"use client";

import { useSearchParams } from "next/navigation";
import { useT } from "@/i18n/client";
import { contactPrefill, type ContactMessages } from "@/lib/contact-validation";
import { ContactForm } from "./ContactForm";
import type { ContactPrivacyNotice } from "./privacy";

/**
 * Contact form prefilled from the query string: /iletisim?konu=Satış&urun=<ürün adı> (konu is the Turkish subject key
 * in every language). Render inside <Suspense fallback={<ContactForm … />}> so /iletisim stays statically prerendered.
 */
export function PrefilledContactForm({ messages, privacy }: { messages: ContactMessages; privacy?: ContactPrivacyNotice }) {
  const t = useT();
  const searchParams = useSearchParams();
  const { subject, product } = contactPrefill(searchParams.get("konu"), searchParams.get("urun"));
  const message = product ? t("{product} hakkında bilgi almak istiyorum.", { product }) : "";
  // Remount when the prefill changes (client navigation between two prefilled links) —
  // the fields are uncontrolled, so new defaults would not show otherwise.
  return (
    <ContactForm
      key={`${subject}\u0000${message}`}
      messages={messages}
      privacy={privacy}
      initialSubject={subject}
      initialMessage={message}
    />
  );
}
