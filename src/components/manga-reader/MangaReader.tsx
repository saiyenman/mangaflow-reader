import { useCallback, useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Keyboard, Zoom } from "swiper/modules";
import type { Swiper as SwiperClass } from "swiper";

import "swiper/css";
import "swiper/css/zoom";
import "swiper/css/keyboard";

import { defaultPages } from "./pages";
import { ReaderControls } from "./ReaderControls";

const AUTO_HIDE_MS = 3000;

export function MangaReader() {
  const [pages] = useState<string[]>(defaultPages);
  const [current, setCurrent] = useState(0);
  const [isRtl, setIsRtl] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
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
    setControlsVisible((v) => {
      const next = !v;
      if (next) scheduleHide();
      return next;
    });
  };

  const handleSlideChange = (s: SwiperClass) => {
    setCurrent(s.activeIndex);
    showControls();
  };

  return (
    <div className="dark relative h-screen w-screen overflow-hidden bg-black text-white select-none">
      <div
        className="absolute inset-0"
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
          spaceBetween={0}
          className="h-full w-full"
          onSlideChange={handleSlideChange}
          onInit={(s) => setCurrent(s.activeIndex)}
        >
          {pages.map((src, i) => (
            <SwiperSlide key={i}>
              <div className="swiper-zoom-container flex h-screen w-full items-center justify-center">
                <img
                  src={src}
                  alt={`Page ${i + 1}`}
                  className="max-h-screen max-w-full object-contain"
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
      />
    </div>
  );
}
