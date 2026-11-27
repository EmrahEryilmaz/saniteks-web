// Contact form rules — the single validator shared by the client form (src/components/contact)
// and the /api/contact route handler. Ported from the live saniteks.com.tr form bundle:
// same limits, same sanitising and the same messages on both sides (in the visitor's language, see contactMessages).

import type { Translate } from "@/i18n/translate";
import { contactSubjects, site, type ContactSubject } from "@/lib/site";

export type ContactFieldName = "name" | "email" | "phone" | "subject" | "message";

export type ContactFieldConfig = {
  /** Turkish label, used in the notification e-mail to staff (the form shows a translated label). */
  label: string;
  min: number;
  max: number;
  required: boolean;
};

/** Field order here is the visual order of the form and the order errors are reported in. */
export const contactFields: Record<ContactFieldName, ContactFieldConfig> = {
  name: { label: "Ad Soyad", min: 2, max: 120, required: true },
  email: { label: "E-posta", min: 3, max: 254, required: true },
  phone: { label: "Telefon", min: 0, max: 40, required: false },
  subject: { label: "Konu", min: 1, max: 30, required: true },
  message: { label: "Mesaj", min: 10, max: 5000, required: true },
};

export const contactFieldNames = Object.keys(contactFields) as ContactFieldName[];

/**
 * Whether the visitor must tick an acknowledgement checkbox for the KVKK notice.
 * The live site only links to the notice (no checkbox), so this is off.
 */
export const contactAcknowledgementRequired = false;

export type ContactErrorKey = ContactFieldName | "acknowledged";
export type ContactErrors = Partial<Record<ContactErrorKey, string>>;

/** Sanitised form values (NFC, trimmed, LF line endings). */
export type ContactData = Record<ContactFieldName, string> & { acknowledged: boolean; website: "" };

export type ContactValidationResult = {
  valid: boolean;
  data: ContactData;
  errors: ContactErrors;
};

/** Body of every /api/contact response, and the shape of the form's status state. */
export type ContactResponse = {
  ok: boolean;
  message: string;
  errors?: Record<string, string>;
};

export type ContactMessages = {
  invalidValue: string;
  email: string;
  phone: string;
  subject: string;
  acknowledged: string;
  checkForm: string;
  sendFailed: string;
  unverified: string;
  // Server-only outcomes.
  success: string;
  unsupportedMediaType: string;
  payloadTooLarge: string;
  badRequest: string;
  rateLimited: string;
  unavailable: string;
  deliveryFailed: string;
  /** Length error of each field ("Bu alan 2–120 karakter olmalıdır."). */
  length: Record<ContactFieldName, string>;
};

/**
 * Messages in the visitor's language. Pages build them with getT() and pass them to the form (a plain object, so it
 * can cross into the client component); /api/contact builds them with i18n/translate-for › getTranslateFor.
 */
export function contactMessages(t: Translate): ContactMessages {
  return {
    invalidValue: t("Lütfen geçerli bir değer girin."),
    email: t("Geçerli bir e-posta adresi girin."),
    phone: t("Ülke koduyla birlikte 7–15 rakam içeren bir telefon girin."),
    subject: t("Lütfen bir konu seçin."),
    acknowledged: t("Lütfen aydınlatma bildirimini işaretleyin."),
    checkForm: t("Lütfen form bilgilerini kontrol edin."),
    sendFailed: t("Mesaj gönderilemedi. Lütfen tekrar deneyin."),
    unverified: t(
      "Gönderim sonucu doğrulanamadı. Bilgileriniz korundu; tekrar denemeden önce bekleyin veya bize e-posta ile ulaşın.",
    ),
    success: t("Mesajınız iletildi. Teşekkür ederiz."),
    unsupportedMediaType: t("İstek biçimi desteklenmiyor. Lütfen formu sayfa üzerinden gönderin."),
    payloadTooLarge: t("Gönderilen içerik çok büyük. Lütfen mesajınızı kısaltın."),
    badRequest: t("İstek okunamadı. Lütfen formu yeniden gönderin."),
    rateLimited: t("Kısa sürede çok fazla gönderim yapıldı. Lütfen birkaç dakika sonra tekrar deneyin."),
    unavailable: t("İletişim formu şu anda kullanılamıyor. Lütfen {email} adresine e-posta gönderin veya {phone} numarasını arayın.", {
      email: site.contact.email,
      phone: site.contact.phoneDisplay,
    }),
    deliveryFailed: t("Mesajınız şu anda iletilemedi. Lütfen daha sonra tekrar deneyin veya {email} adresine e-posta gönderin.", {
      email: site.contact.email,
    }),
    length: lengthMessages(t, contactFields),
  };
}

/** "Bu alan 2–120 karakter olmalıdır." / "Bu alan en fazla 40 karakter olmalıdır." */
export function contactLengthMessage(t: Translate, { min, max }: Pick<ContactFieldConfig, "min" | "max">): string {
  return min > 0
    ? t("Bu alan {min}–{max} karakter olmalıdır.", { min, max })
    : t("Bu alan en fazla {max} karakter olmalıdır.", { max });
}

/** Length message of every field of a form. */
export function lengthMessages<K extends string>(
  t: Translate,
  fields: Record<K, Pick<ContactFieldConfig, "min" | "max">>,
): Record<K, string> {
  const out = {} as Record<K, string>;
  for (const key of Object.keys(fields) as K[]) out[key] = contactLengthMessage(t, fields[key]);
  return out;
}

/** C0/C1 control characters plus the Unicode line/paragraph separators. */
const CONTROL_CHARS = /[\u0000-\u001f\u007f-\u009f\u2028\u2029]/;
/** Same, but the message may keep tab, LF and CR. */
const MESSAGE_CONTROL_CHARS = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f-\u009f]/;
const CONTROL_CHARS_GLOBAL = /[\u0000-\u001f\u007f-\u009f\u2028\u2029]/g;

const EMAIL_PATTERN = /^[^\s@<>(),;:\\"]+@[^\s@<>(),;:\\"]+\.[^\s@<>(),;:\\"]+$/u;
const PHONE_PATTERN = /^\+?[\d ()-]+$/;

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/* Field primitives — also used by the job application validator (src/lib/apply-validation.ts). */

/** The stored form of every text field: NFC, trimmed, LF line endings. */
export function normalizeFieldValue(raw: string): string {
  return raw.normalize("NFC").trim().replace(/\r\n?/g, "\n");
}

/** True when `raw` holds control characters; multi-line fields may keep tab, LF and CR. */
export function hasForbiddenChars(raw: string, multiline = false): boolean {
  return multiline ? MESSAGE_CONTROL_CHARS.test(raw) : CONTROL_CHARS.test(raw);
}

export function isValidEmail(email: string): boolean {
  return email.length <= contactFields.email.max && !CONTROL_CHARS.test(email) && EMAIL_PATTERN.test(email);
}

/** Digits with an optional leading "+", spaces, parentheses and hyphens; 7–15 digits in total. */
export function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, "").length;
  return PHONE_PATTERN.test(phone) && digits >= 7 && digits <= 15;
}

function isContactSubject(value: string): value is ContactSubject {
  return (contactSubjects as readonly string[]).includes(value);
}

/** True when the hidden "website" field carries anything — only bots fill it. */
export function isHoneypotFilled(input: unknown): boolean {
  if (!isRecord(input)) return false;
  return input.website !== undefined && input.website !== "";
}

/**
 * Validates and sanitises a contact submission.
 * Accepts the raw object the client builds from FormData (or the parsed JSON body on the server).
 */
export function validateContact(
  input: unknown,
  messages: ContactMessages,
  options: { requireAcknowledgement?: boolean } = {},
): ContactValidationResult {
  const record = isRecord(input) ? input : {};
  const found: ContactErrors = {};
  const data: ContactData = {
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    acknowledged: record.acknowledged === true,
    website: "",
  };

  for (const field of contactFieldNames) {
    const config = contactFields[field];
    const rawValue = record[field];
    const raw = typeof rawValue === "string" ? rawValue : "";
    const value = normalizeFieldValue(raw);
    data[field] = value;

    const wrongType = rawValue !== undefined && typeof rawValue !== "string";
    if (wrongType || hasForbiddenChars(raw, field === "message")) {
      found[field] = messages.invalidValue;
    } else if (value.length < config.min || raw.length > config.max) {
      found[field] = messages.length[field];
    }
  }

  if (!isValidEmail(data.email)) {
    found.email = messages.email;
  }

  if (data.phone && !isValidPhone(data.phone)) {
    found.phone = messages.phone;
  }

  if (!isContactSubject(data.subject)) {
    found.subject = messages.subject;
  }

  if (options.requireAcknowledgement && !data.acknowledged) {
    found.acknowledged = messages.acknowledged;
  }

  // Report errors in form order so "focus the first invalid field" follows the layout.
  const errors: ContactErrors = {};
  for (const key of [...contactFieldNames, "acknowledged"] as ContactErrorKey[]) {
    const message = found[key];
    if (message) errors[key] = message;
  }

  return {
    valid: !isHoneypotFilled(record) && Object.keys(errors).length === 0,
    data,
    errors,
  };
}

/** Narrows an unknown JSON body to a ContactResponse (drops non-string error entries). */
export function parseContactResponse(body: unknown): ContactResponse | null {
  if (!isRecord(body) || typeof body.ok !== "boolean" || typeof body.message !== "string") return null;
  const response: ContactResponse = { ok: body.ok, message: body.message };
  if (isRecord(body.errors)) {
    const errors: Record<string, string> = {};
    for (const [key, value] of Object.entries(body.errors)) {
      if (typeof value === "string") errors[key] = value;
    }
    response.errors = errors;
  }
  return response;
}

/* ------------------------------------------------------------------ */
/* Prefill — /iletisim?konu=Satış&urun=…                               */
/* ------------------------------------------------------------------ */

export const contactPrefillProductMaxLength = 160;

export type ContactPrefill = { subject: ContactSubject | ""; product: string };

/**
 * Reads the initial subject and product name from the query string (the form turns the product into
 * "<ürün> hakkında bilgi almak istiyorum." in the page language).
 * Unknown subjects are ignored (the ?konu= values are the Turkish subject keys in every language); the product
 * name is stripped of control characters, whitespace-collapsed and capped at 160 characters.
 */
export function contactPrefill(konu: string | null | undefined, urun: string | null | undefined): ContactPrefill {
  const subjectCandidate = (konu ?? "").normalize("NFC").trim();
  const subject = isContactSubject(subjectCandidate) ? subjectCandidate : "";

  const product = Array.from(
    (urun ?? "").normalize("NFC").replace(CONTROL_CHARS_GLOBAL, " ").replace(/\s+/g, " ").trim(),
  )
    .slice(0, contactPrefillProductMaxLength)
    .join("")
    .trim();

  return { subject, product };
}
