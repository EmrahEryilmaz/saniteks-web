import { employmentTypes, type JobPosition } from "@/data/careers";
import { localizePath } from "@/i18n/config";
import { localized } from "@/i18n/data";
import { getLocale, getT } from "@/i18n/server";
import { site } from "@/lib/site";

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] ?? c);
}

/**
 * schema.org JobPosting for one open position in the page language (absolute URLs; description as simple HTML).
 * Takes the position as stored in src/data/careers.ts: the employment type and the address are read from it untranslated.
 */
export async function jobPostingJsonLd(raw: JobPosition, pagePath: string) {
  const [t, locale, position] = await Promise.all([getT(), getLocale(), localized(raw)]);
  const requirements = position.requirements?.length
    ? `<p>${escapeHtml(t("Aranan nitelikler:"))}</p><ul>${position.requirements.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`
    : "";
  const { streetAddress, addressLocality, addressRegion } = raw.location;

  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: position.title,
    description: `<p>${escapeHtml(position.summary)}</p>${requirements}`,
    identifier: { "@type": "PropertyValue", name: site.name, value: raw.id },
    datePosted: raw.published,
    employmentType: employmentTypes[raw.type],
    directApply: true,
    url: `${site.url}${localizePath(pagePath, locale)}#pozisyon-${raw.id}`,
    hiringOrganization: {
      "@type": "Organization",
      "@id": `${site.url}/#organization`,
      name: site.name,
      sameAs: site.url,
      logo: `${site.url}${site.logo}`,
    },
    jobLocation: {
      "@type": "Place",
      // JSON.stringify drops streetAddress when it is undefined.
      address: {
        "@type": "PostalAddress",
        streetAddress,
        addressLocality,
        addressRegion,
        addressCountry: site.contact.addressParts.country,
      },
    },
  };
}
