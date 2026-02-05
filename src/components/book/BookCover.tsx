import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { book } from "@/data/data";

interface BookCoverProps {
  isOpen: boolean;
  onOpen: () => void;
  bookThickness: number;
  /** Once we're on the first page (spread 1+), hide cover so the first spread is visible like a real book */
  currentSpread: number;
}

const COVER_OPEN_DURATION_MS = 1200;

export function BookCover({
  isOpen,
  onOpen,
  bookThickness,
  currentSpread,
}: BookCoverProps) {
  // Hide cover after open animation, or as soon as we've turned to the first page (so we reveal first spread)
  const [openAnimationDone, setOpenAnimationDone] = useState(false);
  useEffect(() => {
    if (isOpen) {
      const t = setTimeout(
        () => setOpenAnimationDone(true),
        COVER_OPEN_DURATION_MS,
      );
      return () => clearTimeout(t);
    }
    setOpenAnimationDone(false);
  }, [isOpen]);

  const hideCover = isOpen && (openAnimationDone || currentSpread >= 1);

  return (
    <motion.div
      className={cn(
        "absolute inset-0 cursor-pointer preserve-3d",
        isOpen && "pointer-events-none",
        hideCover && "invisible",
      )}
      style={{
        width: "100%",
        transformOrigin: "left center",
        zIndex: isOpen ? undefined : 20,
      }}
      initial={false}
      animate={{
        rotateY: isOpen ? -180 : 0,
        translateZ: isOpen ? 8 : 0,
      }}
      transition={{
        type: "tween",
        duration: 1.2,
        ease: [0.22, 0.61, 0.36, 1],
      }}
      onClick={!isOpen ? onOpen : undefined}
    >
      {/* Front cover — single face, like a real book; hinge at left = spine */}
      <div
        className="absolute inset-0 backface-hidden overflow-hidden"
        style={{
          borderRadius: "0 6px 6px 0",
          background:
            "linear-gradient(160deg, hsl(40, 28%, 95%) 0%, hsl(38, 25%, 92%) 100%)",
          boxShadow: "inset 8px 0 12px -4px rgba(0,0,0,0.08)",
        }}
      >
        {/* Single decorative border — classic book look */}
        <div className="absolute inset-5 sm:inset-8 border border-primary/10 rounded pointer-events-none" />

        {/* Title and content */}
        <div className="relative h-full flex flex-col items-center justify-center p-8 text-center">
          <div className="mb-4 sm:mb-6 text-primary/50">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6 sm:w-8 sm:h-8"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>
          <h1
            className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold tracking-wide mb-2 sm:mb-3"
            style={{ color: "hsl(15, 48%, 58%)" }}
          >
            {book.coverTitle}
          </h1>
          <p
            className="font-display text-sm sm:text-base md:text-lg italic tracking-widest"
            style={{ color: "hsl(15, 35%, 50%)" }}
          >
            {book.coverSubtitle}
          </p>
          <div className="mt-6 sm:mt-8 w-16 sm:w-24 h-px bg-primary/25" />
          <p className="mt-8 sm:mt-12 text-xs text-muted-foreground/70 font-body animate-pulse">
            {book.coverHint}
          </p>
        </div>

        {/* Soft spine crease — where cover meets binding */}
        <div
          className="absolute left-0 top-0 bottom-0 w-2 pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, rgba(0,0,0,0.06) 0%, transparent 100%)",
          }}
        />
      </div>

      {/* Back of front cover (inside) — single endpaper surface when cover is open */}
      <div
        className="absolute inset-0 backface-hidden overflow-hidden"
        style={{
          transform: "rotateY(180deg)",
          borderRadius: "0 4px 4px 0",
          background: "hsl(40, 30%, 97%)",
        }}
      >
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 30%, hsl(15, 50%, 65%) 1px, transparent 1px),
              radial-gradient(circle at 80% 70%, hsl(15, 50%, 65%) 1px, transparent 1px)
            `,
            backgroundSize: "30px 30px",
          }}
        />
        <div className="h-full flex items-center justify-center px-8">
          <p className="font-display text-lg sm:text-xl italic text-muted-foreground/50 text-center max-w-md">
            "{book.insideCoverQuote}"
          </p>
        </div>
      </div>
    </motion.div>
  );
}
