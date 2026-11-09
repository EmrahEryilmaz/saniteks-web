"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { focusStyle, textLinkClass } from "@/components/ui/styles";
import {
  applicationInput,
  applyFieldNames,
  applyFields,
  applyMessages,
  cvFileError,
  cvRules,
  formatFileSize,
  generalApplication,
  hasCvSignature,
  parseApplyResponse,
  positionOptions,
  validateApplication,
  type ApplyResponse,
} from "@/lib/apply-validation";
import { site } from "@/lib/site";

/** Generous: a 5 MB upload on a slow connection plus the SMTP hand-off. */
const SUBMIT_TIMEOUT_MS = 120_000;
const KVKK_PATH = "/kvkk-aydinlatma-metni";

const controlClass = `mt-2 min-h-12 w-full min-w-0 rounded-sm border border-border-strong bg-surface px-3 py-3 text-base text-foreground disabled:cursor-not-allowed disabled:bg-surface-strong disabled:text-muted-foreground aria-invalid:border-error ${focusStyle}`;

/** Native file input (keyboard and screen reader support for free); its button is styled through `file:`. */
const fileInputClass = `mt-2 block min-h-12 w-full min-w-0 cursor-pointer rounded-sm border border-border-strong bg-surface p-1 text-base text-muted-foreground file:mr-4 file:min-h-10 file:cursor-pointer file:rounded-sm file:border-0 file:bg-surface-strong file:px-4 file:py-2 file:text-sm file:font-bold file:text-foreground hover:file:bg-border disabled:cursor-not-allowed disabled:bg-surface-strong aria-invalid:border-error ${focusStyle}`;

type SelectedFile = { name: string; size: number };

type ApplicationFormProps = {
  /** id of the section heading that names the form. */
  labelledBy: string;
  /** Preselected position (from ?pozisyon=); "genel" otherwise. */
  initialPosition?: string;
};

/** Field errors the browser can detect before uploading, or null when the form can be sent. */
async function clientErrors(formData: FormData): Promise<Record<string, string> | null> {
  const result = validateApplication(applicationInput(formData));
  if (!result.valid || !result.cv) return result.errors as Record<string, string>;
  try {
    return (await hasCvSignature(result.cv)) ? null : { cv: applyMessages.cvContent };
  } catch {
    return { cv: applyMessages.cvUnreadable };
  }
}

/** The JSON answer of /api/apply, or a stand-in when a proxy rejected the upload before it reached the route. */
async function readResponse(response: Response): Promise<ApplyResponse> {
  const body = parseApplyResponse(await response.json().catch(() => null));
  if (body) return body;
  if (response.status === 413) return { ok: false, message: applyMessages.payloadTooLarge };
  throw new Error("INVALID_RESPONSE");
}

/** "Başvuru formu" panel: the job application form with client-side checks and the multipart /api/apply submit. */
export function ApplicationForm({ labelledBy, initialPosition = generalApplication }: ApplicationFormProps) {
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<ApplyResponse | null>(null);
  const [position, setPosition] = useState(initialPosition);
  const [prefill, setPrefill] = useState(initialPosition);
  const [selectedFile, setSelectedFile] = useState<SelectedFile | null>(null);
  const [fileError, setFileError] = useState<string | undefined>(undefined);
  const inFlight = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);
  const positionRef = useRef<HTMLSelectElement>(null);
  const lastPrefill = useRef(initialPosition);
  const pendingFocus = useRef<string | null>(null);

  // A "Başvur" link on this page changed ?pozisyon=: select that position and keep everything else typed so far.
  if (prefill !== initialPosition) {
    setPrefill(initialPosition);
    setPosition(initialPosition);
  }

  // …and move focus to the select — Next.js scrolls to #basvuru but leaves focus on the link. (Runs after Next's
  // layout-effect scroll; focus() only scrolls further when the select is still outside the viewport, e.g. on phones.)
  useEffect(() => {
    if (lastPrefill.current === initialPosition) return;
    lastPrefill.current = initialPosition;
    positionRef.current?.focus();
  }, [initialPosition]);

  const errors = status?.ok === false ? status.errors : undefined;
  const cvError = fileError ?? errors?.cv;

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

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    setSelectedFile(file ? { name: file.name, size: file.size } : null);
    setFileError(file ? cvFileError(file) : undefined);
    // A newly chosen file replaces any earlier verdict on the previous one.
    setStatus((previous) => {
      if (!previous?.errors?.cv) return previous;
      const rest = { ...previous.errors };
      delete rest.cv;
      return { ...previous, errors: rest };
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return;
    inFlight.current = true;

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const fieldErrors = await clientErrors(formData);
      setFileError(undefined);
      if (fieldErrors) {
        queueFocus(fieldErrors);
        setStatus({ ok: false, message: applyMessages.checkForm, errors: fieldErrors });
        return;
      }

      setBusy(true);
      setStatus(null);

      try {
        const response = await fetch("/api/apply", {
          method: "POST",
          body: formData,
          signal: AbortSignal.timeout(SUBMIT_TIMEOUT_MS),
        });
        const body = await readResponse(response);

        if (response.ok && body.ok) {
          form.reset();
          // reset() restores a preselected position (?pozisyon=); a sent form starts again from "Genel başvuru".
          setPosition(generalApplication);
          setSelectedFile(null);
          setStatus(body);
        } else {
          const next: ApplyResponse = body.ok ? { ok: false, message: applyMessages.sendFailed } : body;
          queueFocus(next.errors);
          setStatus(next);
        }
      } catch {
        setStatus({ ok: false, message: applyMessages.unverified });
      }
    } finally {
      inFlight.current = false;
      setBusy(false);
    }
  }

  const cvDescribedBy = ["apply-cv-hint", selectedFile ? "apply-cv-selected" : null, cvError ? "apply-cv-error" : null]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="min-w-0 border-t-2 border-primary bg-surface-muted p-6 md:p-8 lg:p-10">
      <form ref={formRef} onSubmit={handleSubmit} noValidate aria-labelledby={labelledBy} aria-busy={busy}>
        <fieldset disabled={busy} className="min-w-0">
          <legend className="sr-only">Kişisel bilgileriniz, başvurduğunuz pozisyon ve CV dosyanız</legend>
          <div className="grid min-w-0 gap-5 sm:grid-cols-2">
            {applyFieldNames.map((name) => {
              const field = applyFields[name];
              const error = errors?.[name];
              const common = {
                id: `apply-${name}`,
                name,
                required: field.required,
                "aria-invalid": Boolean(error),
                "aria-describedby": error ? `apply-${name}-error` : undefined,
                className: controlClass,
              };
              return (
                <div key={name} className={`min-w-0 ${name === "message" ? "sm:col-span-2" : ""}`}>
                  <label htmlFor={common.id} className="text-sm font-semibold">
                    {field.label}{" "}
                    <span className="font-normal text-muted-foreground">({field.required ? "zorunlu" : "isteğe bağlı"})</span>
                  </label>
                  {name === "position" ? (
                    <select {...common} ref={positionRef} value={position} onChange={(event) => setPosition(event.target.value)}>
                      {positionOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : name === "message" ? (
                    <textarea {...common} maxLength={field.max} rows={6} className={`${controlClass} resize-y`} />
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
                    <p id={`apply-${name}-error`} className="mt-2 text-sm text-error">
                      {error}
                    </p>
                  ) : null}
                </div>
              );
            })}

            <div className="min-w-0 sm:col-span-2">
              <label htmlFor="apply-cv" className="text-sm font-semibold">
                CV dosyası <span className="font-normal text-muted-foreground">(zorunlu)</span>
              </label>
              <p id="apply-cv-hint" className="mt-1 text-sm text-muted-foreground">
                {cvRules.hint}
              </p>
              <input
                id="apply-cv"
                name="cv"
                type="file"
                required
                accept={cvRules.accept}
                onChange={handleFileChange}
                aria-invalid={Boolean(cvError)}
                aria-describedby={cvDescribedBy}
                className={fileInputClass}
              />
              <div aria-live="polite" className="text-sm">
                {selectedFile ? (
                  <p id="apply-cv-selected" className="mt-2 wrap-anywhere">
                    Seçilen dosya: <span className="font-semibold">{selectedFile.name}</span> ({formatFileSize(selectedFile.size)})
                  </p>
                ) : null}
                {cvError ? (
                  <p id="apply-cv-error" className="mt-2 text-error">
                    {cvError}
                  </p>
                ) : null}
              </div>
            </div>
          </div>

          <div aria-hidden="true" className="hidden">
            <label htmlFor="apply-website">Website</label>
            <input id="apply-website" name="website" tabIndex={-1} autoComplete="off" />
          </div>

          <div className="mt-6 text-sm leading-6">
            <Link
              href={KVKK_PATH}
              target="_blank"
              rel="noopener noreferrer"
              className={`${textLinkClass} inline-flex min-h-11 items-center gap-2 font-semibold`}
            >
              KVKK Aydınlatma Metni
              <span aria-hidden="true">↗</span>
              <span className="sr-only">(yeni sekmede açılır)</span>
            </Link>
            <label className="mt-1 flex min-h-11 cursor-pointer items-start gap-3 py-2" htmlFor="apply-acknowledged">
              <input
                type="checkbox"
                id="apply-acknowledged"
                name="acknowledged"
                required
                aria-invalid={Boolean(errors?.acknowledged)}
                aria-describedby={errors?.acknowledged ? "apply-acknowledged-error" : undefined}
                className={`mt-0.5 size-5 shrink-0 accent-primary ${focusStyle}`}
              />
              <span>
                Başvurum kapsamında paylaştığım kişisel verilerin işlenmesine ilişkin aydınlatma metnini okudum.{" "}
                <span className="text-muted-foreground">(zorunlu)</span>
              </span>
            </label>
            {errors?.acknowledged ? (
              <p id="apply-acknowledged-error" className="mt-1 text-error">
                {errors.acknowledged}
              </p>
            ) : null}
          </div>

          <button
            type="submit"
            disabled={busy}
            className={`mt-7 inline-flex min-h-12 w-full items-center justify-center rounded-sm bg-primary px-6 py-3 text-[19px] font-bold text-primary-foreground transition-colors hover:bg-primary-hover active:bg-primary-active disabled:cursor-not-allowed disabled:bg-surface-strong disabled:text-muted-foreground motion-reduce:transition-none sm:w-auto ${focusStyle}`}
          >
            {busy ? "Gönderiliyor…" : "Başvuruyu gönder"}
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
            Form için JavaScript gereklidir. Başvurunuzu CV dosyanızla birlikte {site.contact.hrEmail} adresine e-posta ile de
            iletebilirsiniz.
          </p>
        </noscript>
      </form>
    </div>
  );
}
