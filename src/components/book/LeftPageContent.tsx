import { Memory } from "@/data/memories";

interface LeftPageContentProps {
  memory: Memory;
  pageNumber: number;
}

export function LeftPageContent({ memory, pageNumber }: LeftPageContentProps) {
  // Format date only when present — date is optional on Memory
  const formattedDate = memory.date
    ? new Date(memory.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <div className="h-full flex flex-col p-4 sm:p-6 md:p-10 page-shadow">
      {/* Date — only shown when memory has a date */}
      {formattedDate && (
        <p
          className="font-display text-xs sm:text-sm tracking-widest mb-3 sm:mb-4"
          style={{ color: "hsl(15, 50%, 65%)" }}
        >
          {formattedDate}
        </p>
      )}

      {/* Title */}
      <h2 className="font-display text-xl sm:text-2xl md:text-3xl font-semibold text-foreground mb-4 sm:mb-6 leading-tight">
        {memory.title}
      </h2>

      {/* Decorative line */}
      <div
        className="w-12 sm:w-16 h-0.5 mb-4 sm:mb-6"
        style={{
          background: "linear-gradient(90deg, hsl(15, 50%, 65%), transparent)",
        }}
      />

      {/* Intro text */}
      <p className="font-body text-sm sm:text-base md:text-lg leading-relaxed text-foreground/80 flex-1">
        {memory.intro}
      </p>

      {/* Page number */}
      <div className="mt-auto pt-4">
        <p className="font-display text-xs text-muted-foreground/50 text-center">
          {pageNumber}
        </p>
      </div>
    </div>
  );
}
