// Server-side helpers shared by the form route handlers (/api/contact, /api/apply): SMTP configuration
// and sending, the notification mail layout, a per-IP rate limiter and a size-capped body reader.
// Import only from route handlers — this module pulls in nodemailer.

import nodemailer, { type SendMailOptions } from "nodemailer";
import { site } from "@/lib/site";

/* ------------------------------------------------------------------ */
/* SMTP                                                                */
/* ------------------------------------------------------------------ */

export type MailConfig = {
  host: string;
  port: number;
  secure: boolean;
  user?: string;
  pass?: string;
  from: string;
};

/** SMTP settings from the environment, or null when SMTP_HOST or a sender address is missing. */
export function mailConfig(): MailConfig | null {
  const env = process.env;
  const host = env.SMTP_HOST?.trim();
  const user = env.SMTP_USER?.trim() || undefined;
  const from = env.CONTACT_FROM?.trim() || user;
  if (!host || !from) return null;
  const secure = /^(true|1|yes)$/i.test(env.SMTP_SECURE?.trim() ?? "");
  const port = Number.parseInt(env.SMTP_PORT ?? "", 10);
  return {
    host,
    port: Number.isFinite(port) && port > 0 ? port : secure ? 465 : 587,
    secure,
    user,
    pass: env.SMTP_PASS || undefined,
    from,
  };
}

/** The environment variable's value when set, otherwise the given address from site.ts. */
export function mailRecipient(envName: string, fallback: string = site.contact.email): string {
  return process.env[envName]?.trim() || fallback;
}

/** Recipient for job applications and HR-related contact messages. */
export function hrRecipient(): string {
  return mailRecipient("HR_TO", site.contact.hrEmail);
}

/** Sends one message from `config.from`. Throws when the SMTP server refuses or times out. */
export async function sendMail(config: MailConfig, message: Omit<SendMailOptions, "from">): Promise<void> {
  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    // Port 587 etc.: refuse to send unless the server upgrades the connection with STARTTLS.
    requireTLS: !config.secure,
    auth: config.user && config.pass ? { user: config.user, pass: config.pass } : undefined,
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
  });
  await transporter.sendMail({ from: config.from, ...message });
}

/* ------------------------------------------------------------------ */
/* Mail body                                                           */
/* ------------------------------------------------------------------ */

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] ?? c);
}

type FormMailInput = {
  /** First line, e.g. "Saniteks web sitesi iletişim formundan yeni mesaj". */
  intro: string;
  /** Label/value rows of the summary table. */
  rows: [string, string][];
  /** Free-text block under the table. */
  message: { label: string; text: string };
  sentAt: Date;
};

/** Plain-text and HTML body of a form notification (values escaped in the HTML part). */
export function composeFormMail({ intro, rows, message, sentAt }: FormMailInput): { text: string; html: string } {
  const time = new Intl.DateTimeFormat("tr-TR", { dateStyle: "long", timeStyle: "short", timeZone: "Europe/Istanbul" }).format(sentAt);

  const text = [
    intro,
    "",
    ...rows.map(([label, value]) => `${label}: ${value}`),
    "",
    `${message.label}:`,
    message.text,
    "",
    `Gönderim zamanı: ${time}`,
  ].join("\n");

  const cell = "padding:6px 12px 6px 0;vertical-align:top;text-align:left";
  const html = `<!doctype html>
<html lang="tr"><body style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.5;color:#111">
<p>${escapeHtml(intro)}</p>
<table role="presentation" style="border-collapse:collapse">
${rows.map(([label, value]) => `<tr><th scope="row" style="${cell}">${escapeHtml(label)}</th><td style="${cell}">${escapeHtml(value)}</td></tr>`).join("\n")}
</table>
<p style="margin-top:16px"><strong>${escapeHtml(message.label)}:</strong></p>
<p style="white-space:pre-wrap">${escapeHtml(message.text).replace(/\n/g, "<br>")}</p>
<p style="color:#555;font-size:13px">Gönderim zamanı: ${escapeHtml(time)}</p>
</body></html>`;

  return { text, html };
}

/* ------------------------------------------------------------------ */
/* Rate limit — in memory, per server instance                         */
/* ------------------------------------------------------------------ */

export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request.headers.get("x-real-ip")?.trim() || "unknown";
}

/**
 * Sliding-window limiter with its own counter (one per route). The returned function records a hit
 * and returns the seconds to wait when the limit is exceeded, otherwise 0.
 */
export function createRateLimiter({ max, windowMs }: { max: number; windowMs: number }) {
  const hits = new Map<string, number[]>();

  return function rateLimit(key: string, now = Date.now()): number {
    const windowStart = now - windowMs;
    if (hits.size > 5000) {
      for (const [entry, stamps] of hits) {
        if (stamps[stamps.length - 1] <= windowStart) hits.delete(entry);
      }
    }
    const recent = (hits.get(key) ?? []).filter((t) => t > windowStart);
    if (recent.length >= max) {
      hits.set(key, recent);
      return Math.max(1, Math.ceil((recent[0] + windowMs - now) / 1000));
    }
    recent.push(now);
    hits.set(key, recent);
    return 0;
  };
}

/* ------------------------------------------------------------------ */
/* Body                                                                */
/* ------------------------------------------------------------------ */

/** Reads the raw body, giving up as soon as it exceeds `limit` bytes (also covers chunked uploads). */
export async function readBodyBytes(
  request: Request,
  limit: number,
): Promise<{ bytes: Uint8Array<ArrayBuffer> } | { tooLarge: true }> {
  if (!request.body) return { bytes: new Uint8Array(0) };
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > limit) {
      await reader.cancel().catch(() => undefined);
      return { tooLarge: true };
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return { bytes };
}

/** Reads the body as strict UTF-8 text, giving up as soon as it exceeds `limit` bytes. */
export async function readBodyText(
  request: Request,
  limit: number,
): Promise<{ text: string } | { tooLarge: true } | { invalid: true }> {
  const body = await readBodyBytes(request, limit);
  if ("tooLarge" in body) return body;
  try {
    return { text: new TextDecoder("utf-8", { fatal: true }).decode(body.bytes) };
  } catch {
    return { invalid: true };
  }
}
