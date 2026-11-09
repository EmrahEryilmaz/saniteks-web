import { employmentTypes, type JobPosition } from "@/data/careers";
import { site } from "@/lib/site";

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] ?? c);
}

/** schema.org JobPosting for one open position (absolute URLs; description as simple HTML). */
export function jobPostingJsonLd(position: JobPosition, pagePath: string) {
  const requirements = position.requirements?.length
    ? `<p>Aranan nitelikler:</p><ul>${position.requirements.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`
    : "";
  const { streetAddress, addressLocality, addressRegion } = position.location;

  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: position.title,
    description: `<p>${escapeHtml(position.summary)}</p>${requirements}`,
    identifier: { "@type": "PropertyValue", name: site.name, value: position.id },
    datePosted: position.published,
    employmentType: employmentTypes[position.type],
    directApply: true,
    url: `${site.url}${pagePath}#pozisyon-${position.id}`,
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
