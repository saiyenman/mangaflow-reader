## Manga Reader — Mobile-first, Dark Theme

Build a single-page manga reader at `/` (replacing the placeholder index) using Swiper.js for the carousel and Tailwind for styling. No backend needed — pages live in local state.

### Stack additions
- `swiper` (React components + modules: Keyboard, Zoom, Pagination, Virtual)
- Reuse existing Tailwind v4 tokens; force dark theme by adding `dark` class on the reader container and using a near-black background.

### Route
- Rewrite `src/routes/index.tsx` with unique head() (title: "Manga Reader", description, og:title, og:description, og:type, twitter:card).
- Move reader UI into `src/components/manga-reader/MangaReader.tsx` and subcomponents.

### Files
- `src/components/manga-reader/MangaReader.tsx` — main component, owns state (currentIndex, isRtl, isFullscreen, controlsVisible, pages[]).
- `src/components/manga-reader/ReaderControls.tsx` — top bar (page counter, RTL/LTR toggle, fullscreen toggle) + bottom progress bar.
- `src/components/manga-reader/pages.ts` — placeholder array of 10 Unsplash image URLs (portrait-oriented) as initial state.
- `src/routes/index.tsx` — thin route that renders `<MangaReader />` + head metadata.

### Feature behavior
1. **Swiper**: horizontal carousel, one slide per view, full viewport height. Modules: `Keyboard` (arrow keys, desktop), `Zoom` (pinch + double-tap), `Pagination` (custom progress fill). Touch swipe on by default.
2. **RTL toggle**: re-key the Swiper on `isRtl` change so `dir="rtl"` re-initializes cleanly; wrap Swiper in a `<div dir={isRtl ? "rtl" : "ltr"}>`. Toggle button in top bar shows current mode.
3. **Overlay controls**:
   - Top bar: `Page X of Y`, RTL/LTR toggle, fullscreen icon button.
   - Bottom: thin progress bar (`(index+1)/total`).
   - Positioned `fixed` with backdrop blur, semi-transparent dark background.
4. **Auto-hide**: controls visible on mount; setTimeout (3s) hides them. Any tap/click on the reader surface toggles visibility and resets the timer. Slide change resets timer too.
5. **Zoom**: Swiper `zoom` module wraps each image in `swiper-zoom-container`; supports pinch on mobile and double-tap. Disable swipe while zoomed (Swiper handles this).
6. **Fullscreen**: use `document.documentElement.requestFullscreen()` / `exitFullscreen()`; track state via `fullscreenchange` event.

### Styling notes
- Container: `bg-black text-white min-h-screen`, hides overflow.
- Images: `object-contain w-full h-screen` inside zoom container.
- Controls: `transition-opacity duration-300` toggled by `controlsVisible`.
- Buttons: use existing shadcn Button where convenient; icons via `lucide-react` (already available).

### Out of scope
- No chapter list, no persistence, no upload — pages are hardcoded in `pages.ts`.
- No SSR-specific concerns beyond guarding `document`/`window` usage inside effects.
