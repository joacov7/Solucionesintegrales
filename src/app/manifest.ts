import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

/** Manifest PWA — la app queda instalable desde el celular. */
export default function manifest(): MetadataRoute.Manifest {
  const c = siteConfig.colors;
  const rgb = (v: readonly [number, number, number]) => `rgb(${v[0]},${v[1]},${v[2]})`;
  return {
    name: siteConfig.name,
    short_name: siteConfig.shortName,
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: rgb(c.brand),
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/icon-maskable.svg", sizes: "any", type: "image/svg+xml", purpose: "maskable" },
    ],
  };
}
