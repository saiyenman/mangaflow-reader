import { Maximize2, Minimize2, ArrowLeftRight } from "lucide-react";

type Props = {
  visible: boolean;
  current: number;
  total: number;
  isRtl: boolean;
  isFullscreen: boolean;
  onToggleRtl: () => void;
  onToggleFullscreen: () => void;
};

export function ReaderControls({
  visible,
  current,
  total,
  isRtl,
  isFullscreen,
  onToggleRtl,
  onToggleFullscreen,
}: Props) {
  const progress = total > 0 ? ((current + 1) / total) * 100 : 0;

  return (
    <div
      className={`pointer-events-none fixed inset-x-0 z-20 transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Top bar */}
      <div
        className="pointer-events-auto fixed inset-x-0 top-0 flex items-center justify-between gap-3 bg-black/60 px-4 py-3 backdrop-blur-md"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="text-sm font-medium tabular-nums text-white/90">
          Page {current + 1} of {total}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleRtl}
            className="inline-flex items-center gap-1.5 rounded-md border border-white/15 bg-white/5 px-2.5 py-1.5 text-xs font-medium text-white transition hover:bg-white/10"
            aria-label="Toggle reading direction"
          >
            <ArrowLeftRight className="h-3.5 w-3.5" />
            {isRtl ? "RTL" : "LTR"}
          </button>
          <button
            onClick={onToggleFullscreen}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-white/15 bg-white/5 text-white transition hover:bg-white/10"
            aria-label="Toggle fullscreen"
          >
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Bottom progress bar */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 bg-black/60 px-4 py-3 backdrop-blur-md">
        <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-white transition-[width] duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
