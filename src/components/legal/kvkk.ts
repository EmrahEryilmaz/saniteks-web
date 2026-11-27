type LegalNoticeStatus = {
  path: string;
  /** Draft: shows the "Taslak ön izleme" banner, sets noindex/nofollow and keeps the page out of the sitemap. */
  draft: boolean;
  /** Version number; while `draft` is true the page shows it as "Ön İzleme <version>". */
  version: string;
  /** ISO date of the last update (formatted in the page language). */
  updated: string;
};

/**
 * KVKK notice status. The live text is an unapproved preview: it carries a draft banner and
 * `noindex, nofollow`. When the legal team approves the text, set `draft` to false and
 * update `version` / `updated`.
 */
export const kvkkNotice: LegalNoticeStatus = {
  path: "/kvkk-aydinlatma-metni",
  draft: true,
  version: "1.0",
  updated: "2026-09-06",
};
