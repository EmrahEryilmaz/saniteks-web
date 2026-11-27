import { localeNames, type Locale } from "@/i18n/config";
import { getTranslateFor, parseLocale } from "@/i18n/translate-for";
import {
  contactAcknowledgementRequired,
  contactFields,
  contactMessages as createContactMessages,
  isHoneypotFilled,
  validateContact,
  type ContactData,
  type ContactResponse,
} from "@/lib/contact-validation";
import { clientIp, composeFormMail, createRateLimiter, hrRecipient, mailConfig, mailRecipient, readBodyText, sendMail } from "@/lib/mail";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 16 * 1024;
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;

/* ------------------------------------------------------------------ */
/* Responses                                                           */
/* ------------------------------------------------------------------ */

function reply(status: number, body: ContactResponse, headers?: Record<string, string>): Response {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store", ...headers } });
}

/* ------------------------------------------------------------------ */
/* Rate limit — in memory, per server instance                         */
/* ------------------------------------------------------------------ */

const rateLimit = createRateLimiter({ max: RATE_LIMIT_MAX, windowMs: RATE_LIMIT_WINDOW_MS });

/* ------------------------------------------------------------------ */
/* Mail — always Turkish (staff inbox), with the visitor's language   */
/* ------------------------------------------------------------------ */

function composeMail(data: ContactData, locale: Locale, sentAt: Date) {
  const { text, html } = composeFormMail({
    intro: "Saniteks web sitesi iletişim formundan yeni mesaj",
    rows: [
      [contactFields.name.label, data.name],
      [contactFields.email.label, data.email],
      [contactFields.phone.label, data.phone || "—"],
      [contactFields.subject.label, data.subject],
      ["Dil", localeNames[locale]],
    ],
    message: { label: contactFields.message.label, text: data.message },
    sentAt,
  });

  return { subject: `[Saniteks iletişim] ${data.subject} – ${data.name}`, text, html };
}

/* ------------------------------------------------------------------ */
/* Handler                                                             */
/* ------------------------------------------------------------------ */

export async function POST(request: Request): Promise<Response> {
  // The form posts to /api/contact?lang=<page language>; answers and error messages come back in that language.
  const locale = parseLocale(new URL(request.url).searchParams.get("lang"));
  const contactMessages = createContactMessages(await getTranslateFor(locale));

  const mediaType = request.headers.get("content-type")?.split(";")[0]?.trim().toLowerCase();
  if (mediaType !== "application/json") {
    return reply(415, { ok: false, message: contactMessages.unsupportedMediaType });
  }

  const declaredLength = Number(request.headers.get("content-length") ?? "0");
  if (declaredLength > MAX_BODY_BYTES) {
    return reply(413, { ok: false, message: contactMessages.payloadTooLarge });
  }

  const retryAfter = rateLimit(clientIp(request));
  if (retryAfter > 0) {
    return reply(429, { ok: false, message: contactMessages.rateLimited }, { "Retry-After": String(retryAfter) });
  }

  const body = await readBodyText(request, MAX_BODY_BYTES);
  if ("tooLarge" in body) {
    return reply(413, { ok: false, message: contactMessages.payloadTooLarge });
  }
  if ("invalid" in body) {
    return reply(400, { ok: false, message: contactMessages.badRequest });
  }

  let input: unknown;
  try {
    input = JSON.parse(body.text);
  } catch {
    return reply(400, { ok: false, message: contactMessages.badRequest });
  }

  // Bots that fill the hidden "website" field get a normal success answer and nothing is sent.
  if (isHoneypotFilled(input)) {
    return reply(200, { ok: true, message: contactMessages.success });
  }

  const result = validateContact(input, contactMessages, { requireAcknowledgement: contactAcknowledgementRequired });
  if (!result.valid) {
    return reply(422, { ok: false, message: contactMessages.checkForm, errors: result.errors as Record<string, string> });
  }

  const mail = composeMail(result.data, locale, new Date());
  const config = mailConfig();

  if (!config) {
    if (process.env.NODE_ENV !== "production") {
      console.info(`[api/contact] SMTP yapılandırılmadı; mesaj gönderilmedi (yalnızca geliştirme).\nKonu: ${mail.subject}\n\n${mail.text}`);
      return reply(200, { ok: true, message: contactMessages.success });
    }
    console.error("[api/contact] SMTP_HOST / CONTACT_FROM tanımlı değil; iletişim formu devre dışı.");
    return reply(503, { ok: false, message: contactMessages.unavailable });
  }

  try {
    await sendMail(config, {
      // "İnsan Kaynakları" messages go to the HR inbox, everything else to the general address.
      to: result.data.subject === "İnsan Kaynakları" ? hrRecipient() : mailRecipient("CONTACT_TO"),
      replyTo: { name: result.data.name, address: result.data.email },
      subject: mail.subject,
      text: mail.text,
      html: mail.html,
    });
  } catch (error) {
    console.error("[api/contact] E-posta gönderilemedi:", error instanceof Error ? error.message : error);
    return reply(502, { ok: false, message: contactMessages.deliveryFailed });
  }

  return reply(200, { ok: true, message: contactMessages.success });
}
