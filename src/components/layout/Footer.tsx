import { cn } from "@/lib/utils";
import { footer } from "@/data/data";

/**
 * Footer — same warm theme as the book (cream, primary/rose-gold).
 * Minimal, elegant, like the closing of a book.
 * Copy comes from @/data/data (footer).
 */
export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={cn(
        "border-t border-border bg-background px-4 py-12",
        "flex flex-col items-center justify-center gap-6 text-center",
      )}
      role="contentinfo"
    >
      <div className="flex items-center gap-2 text-primary/60" aria-hidden>
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-5 w-5"
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
        <span className="font-display text-sm tracking-widest">
          {footer.branding}
        </span>
      </div>
      <p className="font-body text-xs text-muted-foreground">
        © {currentYear} · {footer.copyright}
      </p>
      <p className="font-display max-w-sm tracking-wide text-muted-foreground/80">
        {footer.madeBy}
      </p>
    </footer>
  );
}
