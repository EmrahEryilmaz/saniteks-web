/** Stroke icons for the corporate pages (24×24, currentColor). */
const paths = {
  mission: "M13 10V3L4 14h7v7l9-11h-7z",
  vision: [
    "M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z",
    "M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z",
  ],
  check: "M5 13l4 4L19 7",
  pin: ["M17.657 16.657 13.414 20.9a2 2 0 0 1-2.827 0l-4.244-4.243a8 8 0 1 1 11.314 0z", "M15 11a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"],
  factory: ["M3 21V10l6 4V10l6 4V6h6v15H3z", "M7 17h2M11 17h2M15 17h2"],
  office: ["M4 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16", "M16 9h2a2 2 0 0 1 2 2v10", "M3 21h18", "M8 7h4M8 11h4M8 15h4"],
  products: ["M20 7l-8-4-8 4m16 0-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"],
  production: [
    "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z",
    "M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z",
  ],
  group: ["M17 20h5v-2a3 3 0 0 0-5.356-1.857", "M9 20H4v-2a3 3 0 0 1 5.356-1.857", "M7 20v-2a5 5 0 0 1 10 0v2", "M15 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"],
} as const;

export type CorporateIconName = keyof typeof paths;

export function CorporateIcon({ name, className = "size-6" }: { name: CorporateIconName; className?: string }) {
  const d: string | readonly string[] = paths[name];
  const list: readonly string[] = typeof d === "string" ? [d] : d;
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
      {list.map((p) => (
        <path key={p} d={p} />
      ))}
    </svg>
  );
}
