import { useCallback, useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Keyboard, Zoom } from "swiper/modules";
import type { Swiper as SwiperClass } from "swiper";
import { MoveHorizontal, X } from "lucide-react";

import "swiper/css";
import "swiper/css/zoom";
import "swiper/css/keyboard";

import { defaultPages } from "./pages";
import { ReaderControls } from "./ReaderControls";

const AUTO_HIDE_MS = 3000;
const HINT_STORAGE_KEY = "manga-reader:swipe-hint-seen";

export function MangaReader() {
  const [pages] = useState<string[]>(defaultPages);
  const [current, setCurrent] = useState(0);
  const [isRtl, setIsRtl] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [showHint, setShowHint] = useState(false);
  const swiperRef = useRef<SwiperClass | null>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scheduleHide = useCallback(() => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => setControlsVisible(false), AUTO_HIDE_MS);
  }, []);

  const showControls = useCallback(() => {
    setControlsVisible(true);
    scheduleHide();
  }, [scheduleHide]);

  useEffect(() => {
    scheduleHide();
    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, [scheduleHide]);

  // First-visit swipe hint
  useEffect(() => {
    try {
      if (!localStorage.getItem(HINT_STORAGE_KEY)) {
        setShowHint(true);
      }
    } catch {
      setShowHint(true);
    }
  }, []);

  const dismissHint = useCallback(() => {
    setShowHint(false);
    try {
      localStorage.setItem(HINT_STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  const toggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.warn("Fullscreen toggle failed", err);
    }
  }, []);

  const handleSurfaceTap = () => {
    if (showHint) {
      dismissHint();
      return;
    }
    setControlsVisible((v) => {
      const next = !v;
      if (next) scheduleHide();
      return next;
    });
  };

  const handleSlideChange = (s: SwiperClass) => {
    setCurrent(s.activeIndex);
    showControls();
    if (showHint) dismissHint();
  };

  return (
    <div className="dark relative h-screen w-screen overflow-hidden bg-black text-white select-none">
      <div
        className="absolute inset-0 flex items-center justify-center px-3 pt-16 pb-10"
        dir={isRtl ? "rtl" : "ltr"}
        onClick={handleSurfaceTap}
      >
        <Swiper
          key={isRtl ? "rtl" : "ltr"}
          dir={isRtl ? "rtl" : "ltr"}
          modules={[Keyboard, Zoom]}
          keyboard={{ enabled: true }}
          zoom={{ maxRatio: 3, toggle: true }}
          slidesPerView={1}
          spaceBetween={16}
          className="h-full w-full"
          onSwiper={(s) => {
            swiperRef.current = s;
            setCurrent(s.activeIndex);
          }}
          onSlideChange={handleSlideChange}
        >
          {pages.map((src, i) => (
            <SwiperSlide key={i}>
              <div className="swiper-zoom-container flex h-full w-full items-center justify-center">
                <img
                  src={src}
                  alt={`Page ${i + 1}`}
                  className="max-h-full max-w-full rounded-md object-contain shadow-2xl shadow-black/60"
                  draggable={false}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <ReaderControls
        visible={controlsVisible}
        current={current}
        total={pages.length}
        isRtl={isRtl}
        isFullscreen={isFullscreen}
        onToggleRtl={() => {
          setIsRtl((v) => !v);
          showControls();
        }}
        onToggleFullscreen={() => {
          toggleFullscreen();
          showControls();
        }}
        onPrev={() => {
          swiperRef.current?.slidePrev();
          showControls();
        }}
        onNext={() => {
          swiperRef.current?.slideNext();
          showControls();
        }}
      />

      {/* First-visit swipe hint */}
      {showHint && (
        <div
          className="fixed inset-0 z-30 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={(e) => {
            e.stopPropagation();
            dismissHint();
          }}
        >
          <div className="mx-6 max-w-sm rounded-2xl border border-white/10 bg-neutral-900/90 p-6 text-center shadow-2xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white/10">
              <MoveHorizontal className="h-7 w-7 animate-pulse text-white" />
            </div>
            <h2 className="mt-4 text-lg font-semibold text-white">Swipe to read</h2>
            <p className="mt-2 text-sm text-white/70">
              Swipe left or right to turn pages. Pinch or double-tap to zoom. Tap
              anywhere to show or hide the controls.
            </p>
            <button
              onClick={dismissHint}
              className="mt-5 inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-white/90"
            >
              <X className="h-4 w-4" />
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
