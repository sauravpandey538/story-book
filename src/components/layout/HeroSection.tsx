import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { hero } from "@/data/data";

/**
 * Hero section — same warm, book-like theme as the memory book.
 * Uses font-display (Cormorant Garamond) and primary/rose-gold accents.
 * Copy from @/data/data (hero).
 */
export function HeroSection() {
  const scrollToStory = () => {
    document
      .getElementById("our-story")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      className={cn(
        "relative flex min-h-[70vh] flex-col items-center justify-center px-4 py-20",
        "bg-background",
      )}
      aria-label="Hero"
    >
      {/* Subtle radial glow for depth (matches book ambient background) */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 0%, hsl(var(--primary) / 0.08) 0%, transparent 60%)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Decorative heart */}
        <div className="mb-6 text-primary/50" aria-hidden>
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-8 w-8 sm:h-10 sm:w-10"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>

        <p className="font-display text-sm uppercase tracking-[0.3em] text-primary/70 sm:text-base">
          {hero.subtitle}
        </p>
        <h1 className="font-display mt-2 text-4xl font-semibold tracking-wide text-foreground sm:text-5xl md:text-6xl">
          {hero.headline}
        </h1>

        <p className="font-body mt-4 max-w-md text-base leading-relaxed text-muted-foreground/90">
          "{hero.quote}" - {hero.quoteAttribution}
        </p>

        <Button
          size="lg"
          className="mt-10 font-display text-base tracking-wide"
          onClick={scrollToStory}
        >
          {hero.ctaButton}
        </Button>
        <div className="mt-8 h-px w-full bg-primary/30" />

        <p className="font-display mt-4 text-lg  text-muted-foreground sm:text-xl md:text-2xl">
          {hero.names}
        </p>
        <p className="font-body mt-2 max-w-md text-base leading-relaxed text-muted-foreground/90">
          {hero.tagline}
        </p>
      </div>
    </section>
  );
}
