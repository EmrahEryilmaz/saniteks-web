import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: site.name,
    description: site.defaultDescription,
    lang: "tr",
    dir: "ltr",
    start_url: "/",
    scope: "/",
    display: "browser",
    theme_color: "#009933",
    background_color: "#ffffff",
    // Square app icons = the logo cube (yellow/dark-green sponge colours) on a transparent background.
    icons: [
      { src: "/icons/saniteks-icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/saniteks-icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
