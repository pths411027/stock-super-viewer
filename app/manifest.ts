import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Stock Super Viewer",
    short_name: "Stock Viewer",
    description: "Track Taiwan stocks and receive price alerts.",
    start_url: "/",
    display: "standalone",
    background_color: "#15130F",
    theme_color: "#E8B84A",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
