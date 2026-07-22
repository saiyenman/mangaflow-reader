import { createFileRoute } from "@tanstack/react-router";
import { MangaReader } from "@/components/manga-reader/MangaReader";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Manga Reader — Swipe. Zoom. Read." },
      {
        name: "description",
        content:
          "A mobile-first dark manga reader with RTL support, pinch-to-zoom, and fullscreen reading.",
      },
      { property: "og:title", content: "Manga Reader — Swipe. Zoom. Read." },
      {
        property: "og:description",
        content:
          "A mobile-first dark manga reader with RTL support, pinch-to-zoom, and fullscreen reading.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MangaReader,
});
