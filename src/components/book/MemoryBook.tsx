import { useState, useEffect, useCallback } from "react";
import { motion, useMotionValue, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { memories, PAGE_THICKNESS_UNIT } from "@/data/memories";
import { book } from "@/data/data";
import { usePageTurn } from "@/hooks/usePageTurn";
import { useSound } from "@/hooks/useSound";
import { BookCover } from "./BookCover";
import { BackCover } from "./BackCover";
import { BookPage } from "./BookPage";
import { SoundToggle } from "./SoundToggle";
import { NavigationHints } from "./NavigationHints";

/** Match BookCover open animation so we reveal first page when cover is fully open */
const COVER_OPEN_DURATION_MS = 100;

/** Book perspective angles */
const CLOSED_ANGLE = -30; // Tilted view when closed
const OPEN_ANGLE = 0; // Face-forward when reading
const PERSPECTIVE_TRANSITION = {
  duration: 0.8,
  ease: [0.22, 0.61, 0.36, 1] as const,
};

export function MemoryBook() {
  type BookState = "closed" | "opening" | "open" | "closing";
  const [bookState, setBookState] = useState<BookState>("closed");
  const { isMuted, toggleMute, playPageFlip } = useSound();

  const {
    currentSpread,
    totalSpreads,
    isAnimating,
    dragState,
    pendingFlip,
    containerRef,
    goToSpread,
    nextPage,
    prevPage,
    requestNextPage,
    requestPrevPage,
    commitFlip,
    handlers,
  } = usePageTurn({
    totalPages: memories.length,
    onPageChange: (spread) => {
      if (bookState === "open") {
        playPageFlip();
      }
      // When reaching the last spread, trigger closing animation
      if (spread === totalSpreads - 1 && bookState === "open") {
        setTimeout(() => {
          setBookState("closing");
        }, 500);
      }
    },
  });

  // Calculate book thickness based on memories
  const bookThickness = Math.min(memories.length * PAGE_THICKNESS_UNIT, 40);

  // Determine the book's perspective angle based on state
  const perspectiveAngle =
    bookState === "closed" || bookState === "closing"
      ? CLOSED_ANGLE
      : OPEN_ANGLE;
  const isBookOpen = bookState === "open" || bookState === "opening";

  // One memory per spread: left = date/title/intro, right = images/caption for the same memory
  const getMemoriesForSpread = useCallback(
    (spreadIndex: number) => {
      if (spreadIndex <= 1 || spreadIndex >= totalSpreads - 1) {
        return { left: undefined, right: undefined };
      }
      const memoryIndex = spreadIndex - 2;
      const memory = memories[memoryIndex];
      if (!memory) return { left: undefined, right: undefined };
      return { left: memory, right: memory };
    },
    [totalSpreads],
  );

  // Motion values for flip angles — used only during drag for smooth 60fps updates
  const leftPageAngleMotion = useMotionValue(0);
  const rightPageAngleMotion = useMotionValue(0);

  /** Called by BookPage when the declarative page-turn animation completes */
  const handleFlipComplete = useCallback(() => {
    if (pendingFlip) {
      commitFlip(pendingFlip.targetSpread);
      if (bookState === "open") playPageFlip();
    }
  }, [pendingFlip, commitFlip, bookState, playPageFlip]);

  // Sync drag progress to motion values so drag flip is also smooth
  useEffect(() => {
    if (!dragState.isDragging) {
      if (!pendingFlip) {
        leftPageAngleMotion.set(0);
        rightPageAngleMotion.set(0);
      }
      return;
    }
    if (dragState.direction === "right") {
      rightPageAngleMotion.set(dragState.progress * -180);
    } else if (dragState.direction === "left") {
      leftPageAngleMotion.set(dragState.progress * 180);
    }
  }, [
    dragState.isDragging,
    dragState.direction,
    dragState.progress,
    pendingFlip,
    leftPageAngleMotion,
    rightPageAngleMotion,
  ]);

  const handleOpenBook = useCallback(() => {
    setBookState("opening");
    playPageFlip();
    // Transition to open state after perspective animation
    setTimeout(() => {
      setBookState("open");
      nextPage();
    }, COVER_OPEN_DURATION_MS);
  }, [playPageFlip, nextPage]);

  const handleReopenBook = useCallback(() => {
    // Reset to beginning and reopen
    goToSpread(0, true);
    setTimeout(() => {
      setBookState("opening");
      playPageFlip();
      setTimeout(() => {
        setBookState("open");
        nextPage();
      }, COVER_OPEN_DURATION_MS);
    }, 100);
  }, [goToSpread, playPageFlip, nextPage]);

  // Navigation availability
  const canGoBack = currentSpread > 1 || !isBookOpen;
  const canGoForward = currentSpread < totalSpreads - 1;

  return (
    <div className="relative w-full h-fit flex items-center justify-center overflow-hidden bg-card">
      {/* Subtle ambient gradient — stays white/cream to match site */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at center, hsl(0 0% 100%) 0%, hsl(38 20% 96%) 100%)
          `,
        }}
      />

      {/* Subtle vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.1) 100%)",
        }}
      />

      {/* Book container with perspective */}
      <motion.div
        className="relative perspective-book group"
        style={{
          width: "min(95vw, 900px)",
          height: "min(85vh, 600px)",
          perspective: "1800px",
        }}
        initial={{ rotateY: CLOSED_ANGLE }}
        animate={{ rotateY: perspectiveAngle }}
        transition={PERSPECTIVE_TRANSITION}
      >
        {/* Book body with dynamic thickness */}
        <div
          ref={containerRef}
          className="relative w-full h-full preserve-3d book-shadow rounded-sm"
          style={{
            transformStyle: "preserve-3d",
          }}
          {...(isBookOpen ? handlers : {})}
        >
          {/* Book spine - visible from the side */}
          <div
            className="absolute left-0 top-0 bottom-0 preserve-3d"
            style={{
              width: `${bookThickness}px`,
              transform: `translateX(-${bookThickness}px) rotateY(-90deg)`,
              transformOrigin: "right center",
              background: `linear-gradient(180deg, 
                hsl(20, 15%, 40%) 0%, 
                hsl(20, 15%, 35%) 50%, 
                hsl(20, 15%, 30%) 100%
              )`,
              borderRadius: "2px 0 0 2px",
            }}
          >
            {/* Spine text */}
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
            >
              <span
                className="font-display text-xs tracking-widest"
                style={{ color: "hsl(15, 50%, 75%)" }}
              >
                {book.spineTitle}
              </span>
            </div>
          </div>

          {/* Page edges (right side) - showing stacked pages */}
          <div
            className="absolute right-0 top-1 bottom-1"
            style={{
              width: `${Math.min(bookThickness, 30)}px`,
              transform: `translateX(${Math.min(bookThickness, 30)}px) rotateY(90deg)`,
              transformOrigin: "left center",
              background: `repeating-linear-gradient(
                180deg,
                hsl(40, 30%, 96%) 0px,
                hsl(40, 25%, 94%) 1px,
                hsl(40, 30%, 97%) 2px
              )`,
              borderRadius: "0 2px 2px 0",
              boxShadow: "inset -2px 0 4px rgba(0,0,0,0.1)",
            }}
          />

          {/* Top edge of pages */}
          <div
            className="absolute left-0 right-0 top-0"
            style={{
              height: `${Math.min(bookThickness * 0.3, 10)}px`,
              transform: `translateY(-${Math.min(bookThickness * 0.3, 10)}px) rotateX(90deg)`,
              transformOrigin: "bottom center",
              background: `repeating-linear-gradient(
                90deg,
                hsl(40, 30%, 96%) 0px,
                hsl(40, 25%, 94%) 1px,
                hsl(40, 30%, 97%) 2px
              )`,
            }}
          />

          {/* Bottom edge of pages */}
          <div
            className="absolute left-0 right-0 bottom-0"
            style={{
              height: `${Math.min(bookThickness * 0.3, 10)}px`,
              transform: `translateY(${Math.min(bookThickness * 0.3, 10)}px) rotateX(-90deg)`,
              transformOrigin: "top center",
              background: `repeating-linear-gradient(
                90deg,
                hsl(40, 30%, 96%) 0px,
                hsl(40, 25%, 94%) 1px,
                hsl(40, 30%, 97%) 2px
              )`,
            }}
          />

          {/* Pages container — two-page spread when open */}
          <div
            className={cn(
              "absolute inset-0 rounded-r-sm bg-card preserve-3d",
              pendingFlip?.direction !== "left" &&
                !(dragState.isDragging && dragState.direction === "left")
                ? "overflow-hidden"
                : "overflow-visible",
            )}
          >
            {Array.from({ length: totalSpreads }, (_, i) => {
              if (i === totalSpreads - 1) return null;
              // Spread 0 is the "cover" state — never show it as a page when open
              if (isBookOpen && i === 0) return null;

              const displaySpread =
                isBookOpen && currentSpread === 0 ? 1 : currentSpread;
              const isCurrent = i === displaySpread;
              const isNext = i === displaySpread + 1;
              const isPrev = i === displaySpread - 1;

              // Show 2 spreads during flip
              const showNext =
                isNext &&
                ((dragState.isDragging && dragState.direction === "right") ||
                  pendingFlip?.direction === "right");
              const showPrev =
                isPrev &&
                ((dragState.isDragging && dragState.direction === "left") ||
                  pendingFlip?.direction === "left");
              if (!isCurrent && !showNext && !showPrev) return null;

              const { left, right } = getMemoriesForSpread(i);

              const isFlipping = dragState.isDragging || pendingFlip != null;
              const flipDirection: "left" | "right" | null = pendingFlip
                ? pendingFlip.direction
                : dragState.direction;

              return (
                <BookPage
                  key={i}
                  spreadIndex={i}
                  leftMemory={left}
                  rightMemory={right}
                  isFlipping={isFlipping}
                  flipDirection={flipDirection}
                  isDragging={dragState.isDragging}
                  leftPageAngleMotion={leftPageAngleMotion}
                  rightPageAngleMotion={rightPageAngleMotion}
                  isCurrent={isCurrent}
                  isNext={showNext}
                  isPrev={showPrev}
                  totalSpreads={totalSpreads}
                  pendingFlip={pendingFlip}
                  onFlipComplete={handleFlipComplete}
                />
              );
            })}
          </div>

          {/* Cover: full width when closed; right 50% when open. When open, allow clicks to pass through to pages (images). */}
          <div
            className={cn(
              "absolute top-0 bottom-0 preserve-3d",
              isBookOpen
                ? "right-0 overflow-hidden pointer-events-none"
                : "inset-0",
            )}
            style={{
              width: isBookOpen ? "50%" : undefined,
              zIndex: 20,
              boxShadow: !isBookOpen
                ? "4px 0 16px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)"
                : undefined,
            }}
          >
            <BookCover
              isOpen={isBookOpen}
              onOpen={handleOpenBook}
              bookThickness={bookThickness}
              currentSpread={currentSpread}
            />
          </div>

          {/* Back cover — shown when closing or closed after reading */}
          <BackCover
            isVisible={
              bookState === "closing" ||
              (isBookOpen && currentSpread === totalSpreads - 1)
            }
            bookThickness={bookThickness}
            onReopen={handleReopenBook}
            showReopenHint={bookState === "closing"}
          />

          {/* Navigation hints */}
          {bookState === "open" && (
            <NavigationHints
              canGoBack={canGoBack}
              canGoForward={canGoForward}
              onPrev={requestPrevPage}
              onNext={requestNextPage}
            />
          )}
        </div>
      </motion.div>

      {/* Sound toggle */}
      <SoundToggle isMuted={isMuted} onToggle={toggleMute} />

      {/* Page indicator */}
      <AnimatePresence>
        {bookState === "open" && currentSpread > 0 && (
          <motion.div
            className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <p className="font-display text-xs text-muted-foreground/60 bg-card/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
              {currentSpread} / {totalSpreads - 1}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reopen prompt when book is closed */}
      <AnimatePresence>
        {bookState === "closing" && (
          <motion.div
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 1 } }}
            exit={{ opacity: 0, y: 10 }}
          >
            <button
              onClick={handleReopenBook}
              className="font-display text-sm text-primary bg-card/80 backdrop-blur-sm px-4 py-2 rounded-full border border-primary/20 hover:bg-card transition-colors"
            >
              {book.reopenCta}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
