import { localeNames, type Locale } from "@/i18n/config";
import { getTranslateFor, parseLocale } from "@/i18n/translate-for";
import {
  applicationInput,
  applyFields,
  applyMessages as createApplyMessages,
  findPosition,
  formatFileSize,
  generalApplication,
  hasCvSignature,
  isHoneypotFilled,
  positionOptions,
  validateApplication,
  type ApplyData,
  type ApplyResponse,
  type CvCheck,
} from "@/lib/apply-validation";
import { clientIp, composeFormMail, createRateLimiter, hrRecipient, mailConfig, readBodyBytes, sendMail } from "@/lib/mail";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** CV (max 5 MB) plus the text fields and multipart overhead. */
const MAX_BODY_BYTES = 6 * 1024 * 1024;
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;

/* ------------------------------------------------------------------ */
/* Responses                                                           */
/* ------------------------------------------------------------------ */

function reply(status: number, body: ApplyResponse, headers?: Record<string, string>): Response {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store", ...headers } });
}

/* ------------------------------------------------------------------ */
/* Rate limit — in memory, per server instance                         */
/* ------------------------------------------------------------------ */

const rateLimit = createRateLimiter({ max: RATE_LIMIT_MAX, windowMs: RATE_LIMIT_WINDOW_MS });

/* ------------------------------------------------------------------ */
/* Mail — always Turkish (staff inbox), with the visitor's language   */
/* ------------------------------------------------------------------ */

function composeMail(data: ApplyData, cv: CvCheck, locale: Locale, sentAt: Date) {
  const position = data.position === generalApplication ? undefined : findPosition(data.position);
  const positionTitle = position?.title ?? "Genel başvuru";
  const positionRow = positionOptions.find((option) => option.value === data.position)?.label ?? positionTitle;

  const { text, html } = composeFormMail({
    intro: "Saniteks web sitesi başvuru formundan yeni iş başvurusu",
    rows: [
      [applyFields.name.label, data.name],
      [applyFields.email.label, data.email],
      [applyFields.phone.label, data.phone],
      [applyFields.position.label, positionRow],
      ["CV dosyası", `${cv.attachmentName} (${formatFileSize(cv.file.size)}, ekte)`],
      ["Dil", localeNames[locale]],
    ],
    message: { label: applyFields.message.label, text: data.message || "—" },
    sentAt,
  });

  return { subject: `[Saniteks başvuru] ${positionTitle} – ${data.name}`, text, html };
}

/* ------------------------------------------------------------------ */
/* Handler                                                             */
/* ------------------------------------------------------------------ */

export async function POST(request: Request): Promise<Response> {
  // The form posts to /api/apply?lang=<page language>; answers and error messages come back in that language.
  const locale = parseLocale(new URL(request.url).searchParams.get("lang"));
  const applyMessages = createApplyMessages(await getTranslateFor(locale));

  const contentType = request.headers.get("content-type") ?? "";
  const mediaType = contentType.split(";")[0]?.trim().toLowerCase();
  if (mediaType !== "multipart/form-data") {
    return reply(415, { ok: false, message: applyMessages.unsupportedMediaType });
  }

  const declaredLength = Number(request.headers.get("content-length") ?? "0");
  if (declaredLength > MAX_BODY_BYTES) {
    return reply(413, { ok: false, message: applyMessages.payloadTooLarge });
  }

  const retryAfter = rateLimit(clientIp(request));
  if (retryAfter > 0) {
    return reply(429, { ok: false, message: applyMessages.rateLimited }, { "Retry-After": String(retryAfter) });
  }

  // Read with a hard cap first (Content-Length can be missing or wrong), then parse in memory — nothing touches the disk.
  const body = await readBodyBytes(request, MAX_BODY_BYTES);
  if ("tooLarge" in body) {
    return reply(413, { ok: false, message: applyMessages.payloadTooLarge });
  }

  let form: FormData;
  try {
    form = await new Response(body.bytes, { headers: { "Content-Type": contentType } }).formData();
  } catch {
    return reply(400, { ok: false, message: applyMessages.badRequest });
  }

  const input = applicationInput(form);

  // Bots that fill the hidden "website" field get a normal success answer and nothing is sent.
  if (isHoneypotFilled(input)) {
    return reply(200, { ok: true, message: applyMessages.success });
  }

  const result = validateApplication(input, applyMessages);
  if (!result.valid || !result.cv) {
    return reply(422, { ok: false, message: applyMessages.checkForm, errors: result.errors as Record<string, string> });
  }

  const cv = result.cv;
  if (!(await hasCvSignature(cv))) {
    return reply(422, { ok: false, message: applyMessages.checkForm, errors: { cv: applyMessages.cvContent } });
  }

  const mail = composeMail(result.data, cv, locale, new Date());
  const to = hrRecipient();
  const config = mailConfig();

  if (!config) {
    if (process.env.NODE_ENV !== "production") {
      console.info(
        `[api/apply] SMTP yapılandırılmadı; başvuru gönderilmedi (yalnızca geliştirme).\nAlıcı: ${to}\nKonu: ${mail.subject}\nEk: ${cv.attachmentName} (${cv.contentType}, ${cv.file.size} bayt)\n\n${mail.text}`,
      );
      return reply(200, { ok: true, message: applyMessages.success });
    }
    console.error("[api/apply] SMTP_HOST / CONTACT_FROM tanımlı değil; başvuru formu devre dışı.");
    return reply(503, { ok: false, message: applyMessages.unavailable });
  }

  try {
    await sendMail(config, {
      to,
      replyTo: { name: result.data.name, address: result.data.email },
      subject: mail.subject,
      text: mail.text,
      html: mail.html,
      attachments: [{ filename: cv.attachmentName, content: Buffer.from(await cv.file.arrayBuffer()), contentType: cv.contentType }],
    });
  } catch (error) {
    console.error("[api/apply] E-posta gönderilemedi:", error instanceof Error ? error.message : error);
    return reply(502, { ok: false, message: applyMessages.deliveryFailed });
  }

  return reply(200, { ok: true, message: applyMessages.success });
}
