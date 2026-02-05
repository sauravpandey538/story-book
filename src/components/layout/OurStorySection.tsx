import { cn } from "@/lib/utils";
import { MemoryBook } from "@/components/book/MemoryBook";
import { ourStory } from "@/data/data";

/**
 * Our Story section — contains the interactive memory book.
 * Same theme: warm background, section heading in book typography.
 * Copy from @/data/data (ourStory).
 */
export function OurStorySection() {
  return (
    <section
      id="our-story"
      className={cn(
        "relative h-fit w-full px-4 py-12 sm:py-16",
        "bg-background",
      )}
      aria-labelledby="our-story-heading"
    >
      <div className="container mx-auto flex max-w-4xl flex-col items-center gap-10">
        <header className="text-center">
          <h2
            id="our-story-heading"
            className="font-display text-2xl font-semibold tracking-wide text-foreground sm:text-3xl"
          >
            {ourStory.heading}
          </h2>
          <p className="font-body mt-2 text-sm text-muted-foreground">
            {ourStory.blessing}
          </p>
        </header>

        {/* Book sits on a white "page" surface on cream background */}
        <MemoryBook />
        <p className="font-body mt-2 text-sm text-muted-foreground">
          {ourStory.instruction}
        </p>
      </div>
    </section>
  );
}
