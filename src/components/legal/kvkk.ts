type LegalNoticeStatus = {
  path: string;
  /** Draft: shows the "Taslak ön izleme" banner, sets noindex/nofollow and keeps the page out of the sitemap. */
  draft: boolean;
  version: string;
  updated: { iso: string; label: string };
};

/**
 * KVKK notice status. The live text is an unapproved preview: it carries a draft banner and
 * `noindex, nofollow`. When the legal team approves the text, set `draft` to false and
 * update `version` / `updated`.
 */
export const kvkkNotice: LegalNoticeStatus = {
  path: "/kvkk-aydinlatma-metni",
  draft: true,
  version: "Ön İzleme 1.0",
  updated: { iso: "2026-09-06", label: "6 Eylül 2026" },
};
