import type { MotionValue } from "framer-motion";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Memory } from "@/data/memories";
import { book } from "@/data/data";
import { LeftPageContent } from "./LeftPageContent";
import { RightPageContent } from "./RightPageContent";
import type { PendingFlip } from "@/hooks/usePageTurn";

/** Default duration when not specified (single flip = 500ms) */
const DEFAULT_FLIP_DURATION = 0.5;
/** Easing: quick, responsive turn */
const PAGE_TURN_EASE = [0.25, 0.1, 0.25, 1] as const;

interface BookPageProps {
  spreadIndex: number;
  leftMemory?: Memory;
  rightMemory?: Memory;
  isFlipping: boolean;
  flipDirection: "left" | "right" | null;
  isDragging: boolean;
  leftPageAngleMotion: MotionValue<number>;
  rightPageAngleMotion: MotionValue<number>;
  isCurrent: boolean;
  isNext: boolean;
  isPrev: boolean;
  totalSpreads: number;
  pendingFlip: PendingFlip | null;
  onFlipComplete: () => void;
}

export function BookPage({
  spreadIndex,
  leftMemory,
  rightMemory,
  isFlipping,
  flipDirection,
  isDragging,
  leftPageAngleMotion,
  rightPageAngleMotion,
  isCurrent,
  isNext,
  isPrev,
  totalSpreads,
  pendingFlip,
  onFlipComplete,
}: BookPageProps) {
  const isFirstSpread = spreadIndex === 1;
  const isLastSpread = spreadIndex === totalSpreads - 2;

  const leftPageNum = (spreadIndex - 1) * 2 + 1;
  const rightPageNum = leftPageNum + 1;

  // Programmatic flip uses Framer Motion animate; drag uses motion value for 60fps
  const isFlippingRight = isCurrent && isFlipping && flipDirection === "right";
  const isFlippingLeft = isCurrent && isFlipping && flipDirection === "left";
  const isProgrammaticRight =
    isFlippingRight && !isDragging && pendingFlip?.direction === "right";
  const isProgrammaticLeft =
    isFlippingLeft && !isDragging && pendingFlip?.direction === "left";
  const flipDuration = pendingFlip?.duration ?? DEFAULT_FLIP_DURATION;

  return (
    <motion.div
      className={cn(
        "absolute inset-0 grid grid-cols-2 preserve-3d",
        !isCurrent && !isNext && !isPrev && "hidden",
      )}
      style={{
        zIndex: isCurrent ? 10 : isPrev ? 5 : 1,
      }}
      initial={false}
    >
      {/* Left Page — turns when going back; drag uses motion value, programmatic uses Framer Motion animate */}
      <motion.div
        key={`left-${spreadIndex}-${isProgrammaticLeft ? "flip" : "idle"}`}
        className="relative overflow-hidden backface-hidden preserve-3d"
        initial={{ rotateY: 0 }}
        style={{
          background: "hsl(40, 30%, 97%)",
          borderRight: "1px solid hsl(30, 20%, 90%)",
          transformOrigin: "right center",
          rotateY:
            isFlippingLeft && isDragging ? leftPageAngleMotion : undefined,
          boxShadow: isFlippingLeft
            ? "inset 4px 0 20px -4px rgba(0,0,0,0.12)"
            : undefined,
          willChange: isFlippingLeft ? "transform" : undefined,
          backfaceVisibility: "hidden",
          zIndex: isFlippingLeft ? 2 : 1,
        }}
        animate={
          !isDragging ? { rotateY: isProgrammaticLeft ? 180 : 0 } : undefined
        }
        transition={{
          type: "tween",
          duration: isProgrammaticLeft ? flipDuration : 0,
          ease: PAGE_TURN_EASE,
        }}
        onAnimationComplete={() => {
          if (isProgrammaticLeft) onFlipComplete();
        }}
      >
        {/* Spine shadow (right edge of left page — mirrors right page's spine shadow) */}
        <div
          className="absolute right-0 top-0 bottom-0 w-4 sm:w-8 pointer-events-none"
          style={{
            background:
              "linear-gradient(270deg, rgba(0,0,0,0.08) 0%, transparent 100%)",
          }}
        />
        {/* Paper texture overlay */}
        <div className="absolute inset-0 paper-texture pointer-events-none" />

        {isFirstSpread ? (
          // Dedication page — text from @/data/data (book)
          <div className="h-full flex flex-col items-center justify-center p-6 sm:p-8 text-center">
            <p className="font-display text-base sm:text-lg md:text-xl  text-foreground/70 leading-relaxed max-w-xs">
              {book.dedication}
            </p>
            <p className="font-display text-xs sm:text-sm text-muted-foreground mt-4 sm:mt-6">
              {book.dedicationSignature}
            </p>
          </div>
        ) : isLastSpread ? (
          // Closing page — text from @/data/data (book)
          <div className="h-full flex flex-col items-center justify-center p-6 sm:p-8 text-center">
            <div className="mb-4 sm:mb-6 text-primary/40">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-8 h-8 sm:w-10 sm:h-10"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
            <p className="font-display text-xl sm:text-2xl md:text-3xl text-foreground/80 mb-2">
              {book.closingLine1}
            </p>
            <p
              className="font-display text-2xl sm:text-3xl md:text-4xl font-semibold"
              style={{ color: "hsl(15, 50%, 65%)" }}
            >
              {book.closingLine2}
            </p>
          </div>
        ) : leftMemory ? (
          <LeftPageContent memory={leftMemory} pageNumber={leftPageNum} />
        ) : null}
        {/* Left page edge effect (mirrors right page) */}
        <div
          className="absolute left-0 top-0 bottom-0 w-1 pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.05) 50%, transparent 100%)",
          }}
        />
      </motion.div>

      {/* Right Page — turns when going forward; drag uses motion value, programmatic uses Framer Motion animate */}
      <motion.div
        className="relative overflow-hidden backface-hidden preserve-3d"
        initial={false}
        style={{
          background: "hsl(40, 30%, 97%)",
          borderLeft: "1px solid hsl(30, 20%, 85%)",
          transformOrigin: "left center",
          rotateY:
            isFlippingRight && isDragging ? rightPageAngleMotion : undefined,
          boxShadow: isFlippingRight
            ? "inset -4px 0 20px -4px rgba(0,0,0,0.12)"
            : undefined,
          willChange: isFlippingRight ? "transform" : undefined,
          backfaceVisibility: "hidden",
          zIndex: isFlippingRight ? 2 : 1,
        }}
        animate={
          !isDragging ? { rotateY: isProgrammaticRight ? -180 : 0 } : undefined
        }
        transition={{
          type: "tween",
          duration: isProgrammaticRight ? flipDuration : 0,
          ease: PAGE_TURN_EASE,
        }}
        onAnimationComplete={() => {
          if (isProgrammaticRight) onFlipComplete();
        }}
      >
        {/* Paper texture overlay */}
        <div className="absolute inset-0 paper-texture pointer-events-none" />

        {/* Spine shadow */}
        <div
          className="absolute left-0 top-0 bottom-0 w-4 sm:w-8 pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, rgba(0,0,0,0.08) 0%, transparent 100%)",
          }}
        />

        {isFirstSpread ? (
          // First memory intro
          <div className="h-full flex flex-col items-center justify-center p-6 sm:p-8 text-center">
            <p className="font-display text-sm sm:text-base md:text-lg text-muted-foreground mb-2">
              Welcome to
            </p>
            <p className="font-display text-xl sm:text-2xl md:text-3xl font-semibold text-foreground">
              Our First Year Memories
            </p>
            <div className="mt-4 sm:mt-6 w-12 sm:w-16 h-0.5 bg-primary/30" />
            <p className="font-body text-xs sm:text-sm text-muted-foreground mt-4 sm:mt-6">
              I hope you enjoy reading about our first year together. ♥️ Love
              You again !!
            </p>
          </div>
        ) : isLastSpread ? (
          // Back endpaper — copy from @/data/data (book.backEndpaper*)
          <div className="h-full flex items-center justify-center">
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
            <div className="flex flex-col items-center justify-center gap-4 px-4 text-center">
              <p className="font-display text-sm sm:text-base text-muted-foreground/70 italic max-w-md">
                {book.backEndpaperIntro}
              </p>
              <p className="font-display text-base sm:text-lg text-foreground/90">
                {book.backEndpaperQuestion}
              </p>
              <p
                className="font-display text-xl sm:text-2xl font-semibold"
                style={{ color: "hsl(15, 50%, 65%)" }}
              >
                {book.backEndpaperClosing}
              </p>
            </div>
          </div>
        ) : rightMemory ? (
          <RightPageContent memory={rightMemory} pageNumber={rightPageNum} />
        ) : null}

        {/* Page edge effect (visible pages stacking) */}
        <div
          className="absolute right-0 top-0 bottom-0 w-1 pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.05) 50%, rgba(0,0,0,0.1) 100%)",
          }}
        />
      </motion.div>
    </motion.div>
  );
}
