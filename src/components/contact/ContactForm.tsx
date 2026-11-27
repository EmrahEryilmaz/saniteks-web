"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { focusStyle, textLinkClass } from "@/components/ui/styles";
import { useLocale, useT } from "@/i18n/client";
import { Link } from "@/i18n/Link";
import type { Translate } from "@/i18n/translate";
import {
  contactFieldNames,
  contactFields,
  parseContactResponse,
  validateContact,
  type ContactFieldName,
  type ContactMessages,
  type ContactResponse,
} from "@/lib/contact-validation";
import { contactSubjects, type ContactSubject } from "@/lib/site";
import type { ContactPrivacyNotice } from "./privacy";

const SUBMIT_TIMEOUT_MS = 45_000;

const controlClass = `mt-2 min-h-12 w-full min-w-0 rounded-sm border border-border-strong bg-surface px-3 py-3 text-base text-foreground disabled:cursor-not-allowed disabled:bg-surface-strong disabled:text-muted-foreground aria-invalid:border-error ${focusStyle}`;

/** Field labels in the page language (contactFields keeps the Turkish ones for the staff e-mail). */
function fieldLabels(t: Translate): Record<ContactFieldName, string> {
  return { name: t("Ad Soyad"), email: t("E-posta"), phone: t("Telefon"), subject: t("Konu"), message: t("Mesaj") };
}

/** Shown names of the subjects; the submitted values stay the Turkish keys of site.ts › contactSubjects. */
function subjectLabels(t: Translate): Record<ContactSubject, string> {
  return { "Genel Bilgi": t("Genel Bilgi"), Satış: t("Satış"), "İnsan Kaynakları": t("İnsan Kaynakları"), Diğer: t("Diğer") };
}

type ContactFormProps = {
  /** Validation and status messages in the page language (contactMessages(await getT()) on the page). */
  messages: ContactMessages;
  privacy?: ContactPrivacyNotice;
  /** Preselected subject (from ?konu=). */
  initialSubject?: ContactSubject | "";
  /** Prefilled message (from ?urun=). */
  initialMessage?: string;
};

/** "Bize yazın" panel: the contact form with client-side validation and the /api/contact submit. */
export function ContactForm({ messages, privacy, initialSubject = "", initialMessage = "" }: ContactFormProps) {
  const t = useT();
  const locale = useLocale();
  const labels = fieldLabels(t);
  const subjects = subjectLabels(t);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<ContactResponse | null>(null);
  const inFlight = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);
  const pendingFocus = useRef<string | null>(null);

  const errors = status?.ok === false ? status.errors : undefined;
  const requireAcknowledgement = privacy?.acknowledgement === "required";

  // Move focus to the first invalid field once the fieldset is enabled again.
  useEffect(() => {
    const name = pendingFocus.current;
    const form = formRef.current;
    if (busy || !name || !form) return;
    pendingFocus.current = null;
    const element = form.elements.namedItem(name);
    if (element instanceof HTMLElement) element.focus();
  }, [busy, status]);

  function queueFocus(fieldErrors?: Record<string, string>) {
    pendingFocus.current = fieldErrors ? (Object.keys(fieldErrors)[0] ?? null) : null;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return;

    const form = event.currentTarget;
    const entries = Object.fromEntries(new FormData(form));
    const payload = { ...entries, acknowledged: entries.acknowledged === "on" };
    const result = validateContact(payload, messages, { requireAcknowledgement });

    if (!result.valid) {
      const fieldErrors = result.errors as Record<string, string>;
      queueFocus(fieldErrors);
      setStatus({ ok: false, message: messages.checkForm, errors: fieldErrors });
      return;
    }

    inFlight.current = true;
    setBusy(true);
    setStatus(null);

    try {
      // ?lang= makes the route answer in the page language.
      const response = await fetch(`/api/contact?lang=${locale}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(SUBMIT_TIMEOUT_MS),
      });
      const body = parseContactResponse(await response.json());
      if (!body) throw new Error("INVALID_RESPONSE");

      if (response.ok && body.ok) {
        form.reset();
        // reset() restores prefilled defaults (?konu / ?urun); a sent form should be empty.
        for (const name of ["subject", "message"]) {
          const element = form.elements.namedItem(name);
          if (element instanceof HTMLSelectElement || element instanceof HTMLTextAreaElement) element.value = "";
        }
        setStatus(body);
      } else {
        const next: ContactResponse = body.ok ? { ok: false, message: messages.sendFailed } : body;
        queueFocus(next.errors);
        setStatus(next);
      }
    } catch {
      setStatus({ ok: false, message: messages.unverified });
    } finally {
      inFlight.current = false;
      setBusy(false);
    }
  }

  return (
    <div className="min-w-0 border-t-2 border-primary bg-surface-muted p-6 md:p-8 lg:p-10">
      <h2 id="contact-form-title" className="text-3xl font-semibold tracking-tight lg:text-4xl">
        {t("Bize yazın")}
      </h2>
      <p className="mt-4 text-base leading-7 text-muted-foreground">
        {t("Sorunuzu ve iletişim bilgilerinizi paylaşın. Telefon alanı isteğe bağlıdır.")}
      </p>
      <form ref={formRef} onSubmit={handleSubmit} noValidate aria-labelledby="contact-form-title" aria-busy={busy} className="mt-7">
        <fieldset disabled={busy} className="min-w-0">
          <legend className="sr-only">{t("İletişim bilgileri ve mesajınız")}</legend>
          <div className="grid min-w-0 gap-5 sm:grid-cols-2">
            {contactFieldNames.map((name) => {
              const field = contactFields[name];
              const error = errors?.[name];
              const common = {
                id: `contact-${name}`,
                name,
                required: field.required,
                "aria-invalid": Boolean(error),
                "aria-describedby": error ? `contact-${name}-error` : undefined,
                className: controlClass,
              };
              return (
                <div key={name} className={`min-w-0 ${name === "message" ? "sm:col-span-2" : ""}`}>
                  <label htmlFor={common.id} className="text-sm font-semibold">
                    {labels[name]}{" "}
                    <span className="font-normal text-muted-foreground">({field.required ? t("zorunlu") : t("isteğe bağlı")})</span>
                  </label>
                  {name === "subject" ? (
                    <select {...common} defaultValue={initialSubject}>
                      <option value="" disabled>
                        {t("Konu seçin")}
                      </option>
                      {contactSubjects.map((subject) => (
                        <option key={subject} value={subject}>
                          {subjects[subject]}
                        </option>
                      ))}
                    </select>
                  ) : name === "message" ? (
                    <textarea
                      {...common}
                      minLength={field.min}
                      maxLength={field.max}
                      rows={6}
                      defaultValue={initialMessage}
                      className={`${controlClass} resize-y`}
                    />
                  ) : (
                    <input
                      {...common}
                      minLength={field.min}
                      maxLength={field.max}
                      type={name === "email" ? "email" : name === "phone" ? "tel" : "text"}
                      autoComplete={name === "name" ? "name" : name === "email" ? "email" : "tel"}
                    />
                  )}
                  {error ? (
                    <p id={`contact-${name}-error`} className="mt-2 text-sm text-error">
                      {error}
                    </p>
                  ) : null}
                </div>
              );
            })}
          </div>
          <div aria-hidden="true" className="hidden">
            <label htmlFor="contact-website">Website</label>
            <input id="contact-website" name="website" tabIndex={-1} autoComplete="off" />
          </div>
          {privacy ? (
            <div className="mt-6 text-sm leading-6">
              <Link href={privacy.url} className={textLinkClass}>
                {privacy.linkLabel}
              </Link>
              {privacy.acknowledgement === "required" ? (
                <>
                  <label className="mt-3 flex items-start gap-3" htmlFor="contact-acknowledged">
                    <input
                      type="checkbox"
                      id="contact-acknowledged"
                      name="acknowledged"
                      required
                      aria-invalid={Boolean(errors?.acknowledged)}
                      aria-describedby={errors?.acknowledged ? "contact-acknowledged-error" : undefined}
                      className={`mt-1 size-5 shrink-0 accent-primary ${focusStyle}`}
                    />
                    <span>{privacy.statement}</span>
                  </label>
                  {errors?.acknowledged ? (
                    <p id="contact-acknowledged-error" className="mt-2 text-error">
                      {errors.acknowledged}
                    </p>
                  ) : null}
                </>
              ) : (
                <p className="mt-3 text-muted-foreground">{privacy.statement}</p>
              )}
            </div>
          ) : null}
          <button
            type="submit"
            disabled={busy}
            className={`mt-7 inline-flex min-h-12 w-full items-center justify-center rounded-sm bg-primary px-6 py-3 text-[19px] font-bold text-primary-foreground transition-colors hover:bg-primary-hover active:bg-primary-active disabled:cursor-not-allowed disabled:bg-surface-strong disabled:text-muted-foreground motion-reduce:transition-none sm:w-auto ${focusStyle}`}
          >
            {busy ? t("Gönderiliyor…") : t("Gönder")}
          </button>
        </fieldset>
        <div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className={`mt-4 min-h-12 text-sm leading-6 ${status?.ok ? "text-success" : "text-error"}`}
        >
          {status?.message}
        </div>
        <noscript>
          <p className="text-sm text-muted-foreground">
            {t("Form için JavaScript gereklidir. Telefon veya e-posta bağlantılarıyla bize ulaşabilirsiniz.")}
          </p>
        </noscript>
      </form>
    </div>
  );
}
