import type { Translate } from "@/i18n/translate";
import { contactAcknowledgementRequired } from "@/lib/contact-validation";

export type ContactPrivacyNotice = {
  url: string;
  linkLabel: string;
  statement: string;
  /** "required" renders a checkbox the visitor must tick; "notice" only shows the statement. */
  acknowledgement: "required" | "notice";
};

/** KVKK notice shown above the submit button (live copy), in the page language: contactPrivacyNotice(await getT()). */
export function contactPrivacyNotice(t: Translate): ContactPrivacyNotice {
  return {
    url: "/kvkk-aydinlatma-metni",
    linkLabel: t("İletişim formu KVKK Aydınlatma Metni"),
    statement: t(
      "İletişim formunda paylaştığınız kişisel verilerin işlenmesine ilişkin açıklamaları aydınlatma metninde inceleyebilirsiniz.",
    ),
    acknowledgement: contactAcknowledgementRequired ? "required" : "notice",
  };
}
