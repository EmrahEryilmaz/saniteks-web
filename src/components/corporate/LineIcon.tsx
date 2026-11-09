/** 24px line icons used on the corporate pages (paths copied from the live markup). */
const paths = {
  shieldCheck: ["m12 3 8 4v5c0 5-3.4 8.2-8 9-4.6-.8-8-4-8-9V7l8-4Zm-3 9 2 2 4-5"],
  star: ["m12 2 3 6 7 .9-5 4.8 1.3 6.8L12 17l-6.3 3.5L7 13.7 2 8.9 9 8l3-6Z"],
  shieldCare: ["M12 21s7-3.8 7-10V5l-7-3-7 3v6c0 6.2 7 10 7 10Zm-3-9 2 2 4-5"],
  bulb: ["M9 18h6m-5 3h4m4-11a6 6 0 1 0-10 4.5c.7.6 1 1.3 1 2.5h6c0-1.2.3-1.9 1-2.5A6 6 0 0 0 18 10Z"],
  people: ["M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm8 0a4 4 0 1 0 0-8m-8 9c-4 0-6 2-6 5v2h12v-2c0-3-2-5-6-5Zm7 .5c4 0 7 1.5 7 5V20h-5"],
  growth: ["M4 19 10 13l4 4 6-8M15 9h5v5"],
  bolt: ["m13 2-8 12h6l-1 8 9-13h-7l1-7Z"],
  drop: ["M12 3S5 11 5 15a7 7 0 0 0 14 0c0-4-7-12-7-12Z", "M9 15a3 3 0 0 0 3 3"],
  recycle: ["m7 7 3-4h4l3 5M17 4v4h-4M19 11l3 5-2 4h-6M18 23l-4-3 3-3M10 20H4l-2-4 3-5M2 12l3-1 2 4"],
  factory: ["M3 21V10l6 3V8l6 4V3h5l1 18H3Z", "M7 17h1m4 0h1m4 0h1"],
} as const;

export type LineIconName = keyof typeof paths;

export function LineIcon({ name }: { name: LineIconName }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name].map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}
