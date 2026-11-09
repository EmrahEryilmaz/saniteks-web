// Job application rules — the single validator shared by the application form (src/components/careers)
// and the /api/apply route handler: same limits, same sanitising and the same Turkish messages on both sides.
// Text fields reuse the contact form primitives, so e-mail and phone follow exactly the contact form rules.

import { openPositions, type JobPosition } from "@/data/careers";
import {
  contactLengthMessage,
  contactMessages,
  hasForbiddenChars,
  isHoneypotFilled,
  isRecord,
  isValidEmail,
  isValidPhone,
  normalizeFieldValue,
  parseContactResponse,
  type ContactResponse,
} from "@/lib/contact-validation";
import { site } from "@/lib/site";

export { isHoneypotFilled };

export type ApplyFieldName = "name" | "email" | "phone" | "position" | "message";

export type ApplyFieldConfig = {
  label: string;
  min: number;
  max: number;
  required: boolean;
};

/** Text fields in visual order; the CV file and the KVKK checkbox follow them. */
export const applyFields: Record<ApplyFieldName, ApplyFieldConfig> = {
  name: { label: "Ad Soyad", min: 2, max: 120, required: true },
  email: { label: "E-posta", min: 3, max: 254, required: true },
  phone: { label: "Telefon", min: 7, max: 40, required: true },
  position: { label: "Başvurulan pozisyon", min: 1, max: 80, required: true },
  message: { label: "Ön yazı / mesaj", min: 0, max: 3000, required: false },
};

export const applyFieldNames = Object.keys(applyFields) as ApplyFieldName[];

/* ------------------------------------------------------------------ */
/* Positions                                                           */
/* ------------------------------------------------------------------ */

/** Select value of the "Genel başvuru" option (no specific position). */
export const generalApplication = "genel";

export type PositionOption = { value: string; label: string };

/** "Genel başvuru" followed by the open positions in src/data/careers.ts. */
export const positionOptions: PositionOption[] = [
  { value: generalApplication, label: "Genel başvuru" },
  ...openPositions.map((position) => ({ value: position.id, label: `${position.title} – ${position.location.label}` })),
];

export function findPosition(value: string): JobPosition | undefined {
  return openPositions.find((position) => position.id === value);
}

function isPositionValue(value: string): boolean {
  return positionOptions.some((option) => option.value === value);
}

/** Preselected position from /insan-kaynaklari?pozisyon=<id>; unknown or closed ids fall back to "Genel başvuru". */
export function applyPrefill(pozisyon: string | null | undefined): string {
  const candidate = (pozisyon ?? "").normalize("NFC").trim();
  return isPositionValue(candidate) ? candidate : generalApplication;
}

/* ------------------------------------------------------------------ */
/* CV file                                                             */
/* ------------------------------------------------------------------ */

const CV_MAX_MB = 5;

export const cvRules = {
  maxBytes: CV_MAX_MB * 1024 * 1024,
  /** `accept` attribute of the file input. */
  accept:
    ".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  hint: `PDF, DOC veya DOCX; en fazla ${CV_MAX_MB} MB.`,
} as const;

/** Accepted formats: the content type sent with the attachment and the leading bytes the file must start with. */
const cvFormats = {
  // "%PDF"
  pdf: { contentType: "application/pdf", signature: [0x25, 0x50, 0x44, 0x46] },
  // OLE2 compound file (Word 97–2003)
  doc: { contentType: "application/msword", signature: [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1] },
  // ZIP local file header "PK\x03\x04" (Office Open XML)
  docx: {
    contentType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    signature: [0x50, 0x4b, 0x03, 0x04],
  },
} as const;

export type CvFormat = keyof typeof cvFormats;

/** Enough leading bytes for every signature above. */
export const cvSignatureLength = 8;

/** A File in the browser and in the route handler. */
export type CvFile = Blob & { readonly name: string };

/** A CV that passed the name/size checks; the signature still has to be read (see hasCvSignature). */
export type CvCheck = {
  file: CvFile;
  format: CvFormat;
  contentType: string;
  /** Sanitised file name for the e-mail attachment. */
  attachmentName: string;
};

/* ------------------------------------------------------------------ */
/* Messages and result types                                           */
/* ------------------------------------------------------------------ */

export const applyMessages = {
  invalidValue: contactMessages.invalidValue,
  email: contactMessages.email,
  phone: contactMessages.phone,
  position: "Lütfen listeden bir pozisyon seçin.",
  cvRequired: "Lütfen CV dosyanızı ekleyin.",
  cvType: "CV dosyası PDF, DOC veya DOCX biçiminde olmalıdır.",
  cvEmpty: "Seçilen dosya boş. Lütfen CV dosyanızı yeniden seçin.",
  cvSize: `CV dosyası en fazla ${CV_MAX_MB} MB olabilir.`,
  cvContent: "Dosyanın içeriği PDF, DOC veya DOCX biçimiyle uyuşmuyor. Lütfen CV dosyanızı kontrol edip yeniden seçin.",
  cvUnreadable: "Seçilen dosya okunamadı. Lütfen CV dosyanızı yeniden seçin.",
  acknowledged: "Lütfen aydınlatma metnini okuduğunuzu işaretleyin.",
  checkForm: contactMessages.checkForm,
  sendFailed: "Başvuru gönderilemedi. Lütfen tekrar deneyin.",
  unverified:
    "Gönderim sonucu doğrulanamadı. Bilgileriniz korundu; tekrar denemeden önce bekleyin veya başvurunuzu e-posta ile iletin.",
  // Server outcomes (payloadTooLarge is also shown when a proxy in front of the site rejects the upload).
  success: "Başvurunuz iletildi. İlginiz için teşekkür ederiz.",
  unsupportedMediaType: contactMessages.unsupportedMediaType,
  payloadTooLarge: `Gönderilen içerik çok büyük. CV dosyası en fazla ${CV_MAX_MB} MB olabilir.`,
  badRequest: contactMessages.badRequest,
  rateLimited: contactMessages.rateLimited,
  unavailable: `Başvuru formu şu anda kullanılamıyor. Lütfen başvurunuzu ${site.contact.hrEmail} adresine e-posta ile gönderin.`,
  deliveryFailed: `Başvurunuz şu anda iletilemedi. Lütfen daha sonra tekrar deneyin veya ${site.contact.hrEmail} adresine e-posta ile gönderin.`,
} as const;

export type ApplyErrorKey = ApplyFieldName | "cv" | "acknowledged";
export type ApplyErrors = Partial<Record<ApplyErrorKey, string>>;

/** Sanitised form values (NFC, trimmed, LF line endings). */
export type ApplyData = Record<ApplyFieldName, string> & { acknowledged: boolean; website: "" };

export type ApplyValidationResult = {
  valid: boolean;
  data: ApplyData;
  errors: ApplyErrors;
  /** Set whenever the CV itself passed the name/size checks, even if other fields failed. */
  cv: CvCheck | null;
};

/** Body of every /api/apply response — the same shape as /api/contact. */
export type ApplyResponse = ContactResponse;
export const parseApplyResponse = parseContactResponse;

/* ------------------------------------------------------------------ */
/* CV helpers                                                          */
/* ------------------------------------------------------------------ */

export function isCvFile(value: unknown): value is CvFile {
  return typeof Blob !== "undefined" && value instanceof Blob && typeof (value as { name?: unknown }).name === "string";
}

/** Format from the file name's extension (case-insensitive), or null for anything but .pdf/.doc/.docx. */
export function cvFormat(fileName: string): CvFormat | null {
  const extension = /\.([^.\\/]+)$/.exec(fileName.trim())?.[1]?.toLowerCase();
  return extension === "pdf" || extension === "doc" || extension === "docx" ? extension : null;
}

/** Presence, type and size check of a selected file; returns the Turkish error message or undefined. */
export function cvFileError(file: { name: string; size: number } | null | undefined): string | undefined {
  // A file input left empty still submits an unnamed, empty file.
  if (!file || (file.name === "" && file.size === 0)) return applyMessages.cvRequired;
  if (!cvFormat(file.name)) return applyMessages.cvType;
  if (file.size === 0) return applyMessages.cvEmpty;
  if (file.size > cvRules.maxBytes) return applyMessages.cvSize;
  return undefined;
}

/** True when `header` starts with the signature of `format` (%PDF, OLE2 for .doc, ZIP for .docx). */
export function cvSignatureMatches(format: CvFormat, header: Uint8Array): boolean {
  const signature = cvFormats[format].signature;
  return header.length >= signature.length && signature.every((byte, index) => header[index] === byte);
}

/** Reads the first bytes of the CV and checks them against its extension. */
export async function hasCvSignature(cv: CvCheck): Promise<boolean> {
  const header = new Uint8Array(await cv.file.slice(0, cvSignatureLength).arrayBuffer());
  return cvSignatureMatches(cv.format, header);
}

/** Attachment name: no path, control or reserved characters, at most 120 characters, lower-case extension. */
export function cvAttachmentName(fileName: string, format: CvFormat): string {
  const base = fileName
    .normalize("NFC")
    .replace(/^.*[\\/]/, "")
    .replace(/\.[^.]*$/, "")
    .replace(/[\u0000-\u001f\u007f-\u009f\p{Zl}\p{Zp}<>:"/\\|?*]/gu, " ")
    .replace(/\s+/g, " ")
    .replace(/^[\s.]+|[\s.]+$/g, "");
  const short = Array.from(base).slice(0, 120).join("").trim();
  return `${short || "CV"}.${format}`;
}

/** "320 KB" / "1,4 MB". */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.ceil(bytes / 1024)} KB`;
  return `${new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 1 }).format(bytes / (1024 * 1024))} MB`;
}

/* ------------------------------------------------------------------ */
/* Validation                                                          */
/* ------------------------------------------------------------------ */

/** The validator input built from the submitted FormData — the same conversion in the browser and in /api/apply. */
export function applicationInput(form: FormData): Record<string, unknown> {
  const input: Record<string, unknown> = {};
  for (const key of [...applyFieldNames, "website"]) {
    const value = form.get(key);
    if (value !== null) input[key] = value;
  }
  input.acknowledged = form.get("acknowledged") === "on";
  input.cv = form.get("cv");
  return input;
}

/**
 * Validates and sanitises an application. `input` is the object from applicationInput():
 * strings for the text fields, a boolean `acknowledged` and the CV file under `cv`.
 */
export function validateApplication(input: unknown): ApplyValidationResult {
  const record = isRecord(input) ? input : {};
  const found: ApplyErrors = {};
  const data: ApplyData = {
    name: "",
    email: "",
    phone: "",
    position: "",
    message: "",
    acknowledged: record.acknowledged === true,
    website: "",
  };

  for (const field of applyFieldNames) {
    const config = applyFields[field];
    const rawValue = record[field];
    const raw = typeof rawValue === "string" ? rawValue : "";
    const value = normalizeFieldValue(raw);
    data[field] = value;

    const wrongType = rawValue !== undefined && typeof rawValue !== "string";
    if (wrongType || hasForbiddenChars(raw, field === "message")) {
      found[field] = applyMessages.invalidValue;
    } else if (value.length < config.min || raw.length > config.max) {
      found[field] = contactLengthMessage(config);
    }
  }

  if (!isValidEmail(data.email)) found.email = applyMessages.email;
  if (!isValidPhone(data.phone)) found.phone = applyMessages.phone;
  if (!isPositionValue(data.position)) found.position = applyMessages.position;

  let cv: CvCheck | null = null;
  const file = record.cv;
  const cvError = isCvFile(file) ? cvFileError(file) : applyMessages.cvRequired;
  if (cvError) {
    found.cv = cvError;
  } else if (isCvFile(file)) {
    const format = cvFormat(file.name) as CvFormat;
    cv = { file, format, contentType: cvFormats[format].contentType, attachmentName: cvAttachmentName(file.name, format) };
  }

  if (!data.acknowledged) found.acknowledged = applyMessages.acknowledged;

  // Report errors in form order so "focus the first invalid field" follows the layout.
  const errors: ApplyErrors = {};
  for (const key of [...applyFieldNames, "cv", "acknowledged"] as ApplyErrorKey[]) {
    const message = found[key];
    if (message) errors[key] = message;
  }

  return {
    valid: !isHoneypotFilled(record) && Object.keys(errors).length === 0,
    data,
    errors,
    cv,
  };
}
