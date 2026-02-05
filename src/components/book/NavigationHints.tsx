import { ChevronLeft, ChevronRight } from "lucide-react";
import { a11y } from "@/data/data";

interface NavigationHintsProps {
  canGoBack: boolean;
  canGoForward: boolean;
  onPrev: () => void;
  onNext: () => void;
}

export function NavigationHints({
  canGoBack,
  canGoForward,
  onPrev,
  onNext,
}: NavigationHintsProps) {
  return (
    <>
      {/* Left navigation hint — aria-label from @/data/data (a11y) */}
      {canGoBack && (
        <button
          onClick={onPrev}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-3 rounded-full bg-card/60 backdrop-blur-sm hover:bg-card/80 transition-all opacity-0 hover:opacity-100 group-hover:opacity-60"
          aria-label={a11y.previousPage}
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-foreground/70" />
        </button>
      )}

      {/* Right navigation hint */}
      {canGoForward && (
        <button
          onClick={onNext}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-3 rounded-full bg-card/60 backdrop-blur-sm hover:bg-card/80 transition-all opacity-0 hover:opacity-100 group-hover:opacity-60"
          aria-label={a11y.nextPage}
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-foreground/70" />
        </button>
      )}
    </>
  );
}
