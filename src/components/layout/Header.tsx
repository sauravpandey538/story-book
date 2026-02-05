import { cn } from "@/lib/utils";
import { Github, Linkedin } from "lucide-react";
import { header } from "@/data/data";

/**
 * Minimal header — same theme as the book. Link scrolls to Our Story.
 * Copy and social links from @/data/data (header).
 */
export function Header() {
  const scrollToStory = () => {
    document
      .getElementById("our-story")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const hasGithub = header.githubUrl?.trim().length > 0;
  const hasLinkedin = header.linkedinUrl?.trim().length > 0;

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b border-border bg-background backdrop-blur-sm",
      )}
      role="banner"
    >
      <div className="container flex h-14 items-center justify-between px-4">
        <span className="font-display text-lg font-semibold tracking-wide text-foreground flex items-center justify-center gap-2">
          {header.nameLeft}
          <span className="flex items-center gap-1 text-primary/60">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-4 w-4 sm:h-5 sm:w-5"
              aria-hidden
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </span>
          {header.nameRight}
        </span>

        <div className="flex items-center gap-3">
          {/* Our Story scroll button */}
          <button
            type="button"
            onClick={scrollToStory}
            className="font-body text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            {header.navCta}
          </button>
          {/* GitHub & LinkedIn — only shown when URLs are set in data.ts */}
          {hasGithub && (
            <a
              href={header.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              aria-label="GitHub repository"
            >
              <Github className="h-5 w-5" />
            </a>
          )}
          {hasLinkedin && (
            <a
              href={header.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              aria-label="LinkedIn profile"
            >
              <Linkedin className="h-5 w-5" />
            </a>
          )}
        </div>
      </div>
    </header>
  );
}
