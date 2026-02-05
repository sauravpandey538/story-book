import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { book } from "@/data/data";

interface BackCoverProps {
  /** Whether we are currently viewing the back cover (so it faces the user). */
  isVisible: boolean;
  bookThickness: number;
  onReopen?: () => void;
  showReopenHint?: boolean;
}

/**
 * Back cover of the book — shown when the user has turned to the last spread.
 * Styled like the outside of a real book's back cover (plain, with optional blurb).
 */
export function BackCover({
  isVisible,
  bookThickness,
  onReopen,
  showReopenHint,
}: BackCoverProps) {
  return (
    <motion.div
      className={cn(
        "absolute inset-0 preserve-3d origin-right",
        !isVisible && "pointer-events-none",
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.5 }}
      style={{
        zIndex: isVisible ? 15 : 1,
        transform: "rotateY(0deg)",
        transformOrigin: "right center",
      }}
    >
      {/* Outside of back cover — plain, like a real book */}
      <div
        className={cn(
          "absolute inset-0 backface-hidden rounded-r-sm overflow-hidden",
          onReopen && showReopenHint && "cursor-pointer",
        )}
        onClick={onReopen && showReopenHint ? onReopen : undefined}
        style={{
          background:
            "linear-gradient(135deg, hsl(35, 25%, 95%) 0%, hsl(40, 30%, 92%) 100%)",
          boxShadow: `
            inset 2px 0 4px rgba(0,0,0,0.1),
            -4px 0 8px rgba(0,0,0,0.15)
          `,
        }}
      >
        {/* Leather texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Decorative border */}
        <div className="absolute inset-4 sm:inset-8 border border-primary/20 rounded pointer-events-none" />

        {/* Back cover content — minimal, like real books */}
        <div className="relative h-full flex flex-col items-center justify-center p-8 text-center">
          <motion.div
            className="mb-4 sm:mb-6 text-primary/30"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: isVisible ? 1 : 0.8, opacity: isVisible ? 1 : 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-8 h-8 sm:w-10 sm:h-10"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </motion.div>

          <motion.p
            className="font-display text-lg sm:text-xl tracking-widest"
            style={{ color: "hsl(15, 40%, 55%)" }}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: isVisible ? 0 : 20, opacity: isVisible ? 1 : 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            {book.backCoverTitle}
          </motion.p>

          <motion.p
            className="font-body text-xs sm:text-sm text-muted-foreground/60 mt-2"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: isVisible ? 0 : 20, opacity: isVisible ? 1 : 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            {book.backCoverSubtitle}
          </motion.p>

          <motion.div
            className="mt-8 w-12 h-px bg-primary/20"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: isVisible ? 1 : 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          />

          <motion.p
            className="font-display text-sm text-muted-foreground/40 mt-6 italic"
            initial={{ opacity: 0 }}
            animate={{ opacity: isVisible ? 1 : 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            {book.backCoverEnd}
          </motion.p>
        </div>

        {/* Right edge (spine side) shadow */}
        <div
          className="absolute right-0 top-0 bottom-0 w-1"
          style={{
            background:
              "linear-gradient(270deg, rgba(0,0,0,0.15) 0%, transparent 100%)",
          }}
        />
      </div>
    </motion.div>
  );
}
