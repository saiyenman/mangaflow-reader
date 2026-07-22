// Auto-load every image dropped into `src/assets/pages/`.
// Vite's import.meta.glob picks them up at build time — no manual list to keep in sync.
// Files are sorted alphabetically by path, so name them like 01.jpg, 02.jpg, ...
const modules = import.meta.glob<string>(
  "../../assets/pages/*.{png,jpg,jpeg,webp,avif,gif}",
  { eager: true, import: "default", query: "?url" },
);

const localPages: string[] = Object.keys(modules)
  .sort()
  .map((key) => modules[key]);

// Fallback placeholders (Unsplash) shown only when the pages folder is empty.
const fallbackPages: string[] = [
  "https://images.unsplash.com/photo-1560972550-aba3456b5564?w=900&h=1400&fit=crop",
  "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=900&h=1400&fit=crop",
  "https://images.unsplash.com/photo-1613376023733-0a73315d9b06?w=900&h=1400&fit=crop",
  "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=900&h=1400&fit=crop",
  "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=900&h=1400&fit=crop",
];

export const defaultPages: string[] =
  localPages.length > 0 ? localPages : fallbackPages;

export const usingFallback = localPages.length === 0;
