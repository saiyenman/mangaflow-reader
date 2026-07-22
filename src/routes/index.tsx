import { createFileRoute } from "@tanstack/react-router";
import { MangaReader } from "@/components/manga-reader/MangaReader";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Manga Reader — Swipe. Zoom. Read." },
      {
        name: "description",
        content:
          "MangaFlow Reader is a mobile-first, dark-themed React application for reading manga.",
      },
      { property: "og:title", content: "Manga Reader — Swipe. Zoom. Read." },
      {
        property: "og:description",
        content:
          "MangaFlow Reader is a mobile-first, dark-themed React application for reading manga.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MangaReader,
});
