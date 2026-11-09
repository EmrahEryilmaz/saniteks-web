"use client";

import { useSearchParams } from "next/navigation";
import { contactPrefill } from "@/lib/contact-validation";
import { ContactForm } from "./ContactForm";
import type { ContactPrivacyNotice } from "./privacy";

/**
 * Contact form prefilled from the query string: /iletisim?konu=Satış&urun=<ürün adı>.
 * Render inside <Suspense fallback={<ContactForm … />}> so /iletisim stays statically prerendered.
 */
export function PrefilledContactForm({ privacy }: { privacy?: ContactPrivacyNotice }) {
  const searchParams = useSearchParams();
  const { subject, message } = contactPrefill(searchParams.get("konu"), searchParams.get("urun"));
  // Remount when the prefill changes (client navigation between two prefilled links) —
  // the fields are uncontrolled, so new defaults would not show otherwise.
  return (
    <ContactForm key={`${subject}\u0000${message}`} privacy={privacy} initialSubject={subject} initialMessage={message} />
  );
}
