// Open positions on /insan-kaynaklari — the single source for the "Açık Pozisyonlar" cards, the
// "Başvurulan pozisyon" options of the application form (client and /api/apply) and the JobPosting JSON-LD.
// Publish a position by adding an entry to `openPositions`; remove the entry when the position is filled.

import { site } from "@/lib/site";

/** Employment types as shown on the cards, with their schema.org JobPosting `employmentType`. */
export const employmentTypes = {
  "Tam zamanlı": "FULL_TIME",
  "Yarı zamanlı": "PART_TIME",
  Sözleşmeli: "CONTRACTOR",
  Geçici: "TEMPORARY",
  Staj: "INTERN",
} as const;

export type EmploymentType = keyof typeof employmentTypes;

export type JobLocation = {
  /** Shown on the card, e.g. "Hendek / Sakarya". */
  label: string;
  streetAddress?: string;
  addressLocality: string;
  addressRegion: string;
};

/** Saniteks sites (see /kurumsal/uretim-tesisleri). Use these for `location` unless a position is elsewhere. */
export const jobLocations = {
  hendek: {
    label: "Hendek / Sakarya",
    streetAddress: "Kargalıhanbaba OSB Mah. Organize Sanayi 18. Sk. No:3/1",
    addressLocality: "Hendek",
    addressRegion: "Sakarya",
  },
  merkez: {
    label: "İstanbul (Merkez Ofis)",
    streetAddress: site.contact.addressParts.street,
    addressLocality: site.contact.addressParts.district,
    addressRegion: site.contact.addressParts.city,
  },
} satisfies Record<string, JobLocation>;

export type JobPosition = {
  /**
   * Unique, URL-safe (lowercase letters, digits, hyphens). Used in /insan-kaynaklari?pozisyon=<id> and as the form value;
   * "genel" is taken by the "Genel başvuru" option.
   */
  id: string;
  title: string;
  department: string;
  location: JobLocation;
  type: EmploymentType;
  /** One or two plain sentences about the role. */
  summary: string;
  /** Optional "Aranan nitelikler" bullet list. */
  requirements?: string[];
  /** Publication date, YYYY-MM-DD. */
  published: string;
};

export const openPositions: JobPosition[] = [
  // Example — copy into the array (without the comment markers) and fill in real details:
  // {
  //   id: "uretim-operatoru-hendek",
  //   title: "Üretim Operatörü",
  //   department: "Üretim",
  //   location: jobLocations.hendek,
  //   type: "Tam zamanlı",
  //   summary: "Hendek tesisimizdeki üretim hatlarında görev alacak çalışma arkadaşı arıyoruz.",
  //   requirements: ["Vardiyalı çalışmaya uygun olmak.", "Tercihen üretim ortamında deneyim sahibi olmak."],
  //   published: "2026-11-06",
  // },
];
