import { contactAcknowledgementRequired } from "@/lib/contact-validation";

export type ContactPrivacyNotice = {
  url: string;
  linkLabel: string;
  statement: string;
  /** "required" renders a checkbox the visitor must tick; "notice" only shows the statement. */
  acknowledgement: "required" | "notice";
};

/** KVKK notice shown above the submit button (live copy). */
export const contactPrivacyNotice: ContactPrivacyNotice = {
  url: "/kvkk-aydinlatma-metni",
  linkLabel: "İletişim formu KVKK Aydınlatma Metni",
  statement:
    "İletişim formunda paylaştığınız kişisel verilerin işlenmesine ilişkin açıklamaları aydınlatma metninde inceleyebilirsiniz.",
  acknowledgement: contactAcknowledgementRequired ? "required" : "notice",
};
