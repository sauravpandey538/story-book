import { Memory } from "@/data/memories";
import { a11y } from "@/data/data";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
interface RightPageContentProps {
  memory: Memory;
  pageNumber: number;
}

export function RightPageContent({
  memory,
  pageNumber,
}: RightPageContentProps) {
  const imageCount = memory.images.length;

  // Different layouts based on image count
  const getGridClass = () => {
    switch (imageCount) {
      case 1:
        return "grid-cols-1";
      case 2:
        return "grid-cols-2";
      case 3:
        return "grid-cols-2";
      case 4:
      default:
        return "grid-cols-2";
    }
  };

  const getRotation = (index: number) => {
    const rotations = [-2, 1.5, -1, 2.5];
    return rotations[index % rotations.length];
  };

  return (
    <div className="h-full flex flex-col p-4 sm:p-6 md:p-10 page-shadow-right">
      {/* Photo grid */}
      <div
        className={`flex-1 grid ${getGridClass()} gap-2 sm:gap-3 md:gap-4 content-center`}
      >
        {memory.images.map((image, index) => (
          <ScrapbookImage
            key={index}
            src={image}
            alt={`Memory ${memory.id} - ${index + 1}`}
            rotation={getRotation(index)}
            isLarge={imageCount === 1 || (imageCount === 3 && index === 0)}
          />
        ))}
      </div>

      {/* Caption if exists */}
      {memory.caption && (
        <p
          className="font-display italic text-center text-sm sm:text-base mt-3 sm:mt-4"
          style={{ color: "hsl(15, 40%, 55%)" }}
        >
          {memory.caption}
        </p>
      )}

      {/* Page number */}
      <div className="mt-auto pt-3 sm:pt-4">
        <p className="font-display text-xs text-muted-foreground/50 text-center">
          {pageNumber}
        </p>
      </div>
    </div>
  );
}

interface ScrapbookImageProps {
  src: string;
  alt: string;
  rotation: number;
  isLarge?: boolean;
}

function ScrapbookImage({ src, alt, rotation, isLarge }: ScrapbookImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const openLightbox = () => {
    if (!hasError) setLightboxOpen(true);
  };

  const stopForBook = (
    e: React.MouseEvent | React.TouchEvent | React.PointerEvent,
  ) => {
    if (!hasError) e.stopPropagation();
  };

  return (
    <>
      <div
        className={cn(
          "relative",
          isLarge ? "col-span-2 row-span-2" : "",
          !hasError && "cursor-pointer",
        )}
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        {/* Photo frame/tape effect */}
        <div
          className="absolute -top-1 sm:-top-2 left-1/2 -translate-x-1/2 w-8 sm:w-12 h-3 sm:h-4 opacity-40 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, hsl(45, 30%, 85%) 0%, hsl(45, 25%, 80%) 100%)",
            borderRadius: "2px",
          }}
        />

        {/* Clickable image: button so click always fires; stop pointer events from reaching book */}
        <button
          type="button"
          className="w-full text-left bg-transparent border-0 p-0 rounded shadow-none focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            openLightbox();
          }}
          onMouseDown={stopForBook}
          onTouchStart={stopForBook}
          onPointerDown={stopForBook}
          aria-label={a11y.viewImageFullSize}
          disabled={hasError}
        >
          <div
            className="bg-card p-1.5 sm:p-2 rounded shadow-md"
            style={{
              boxShadow:
                "0 2px 8px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.08)",
            }}
          >
            <div className="relative w-full aspect-[4/3] rounded overflow-hidden min-h-0 pointer-events-none">
              {!isLoaded && !hasError && (
                <div
                  className="absolute inset-0 bg-muted animate-pulse rounded"
                  aria-hidden
                />
              )}
              {hasError && (
                <div className="absolute inset-0 bg-muted flex items-center justify-center rounded">
                  <span className="text-muted-foreground text-xs">{a11y.photoFallback}</span>
                </div>
              )}
              {!hasError && (
                <img
                  src={src}
                  alt={alt}
                  className={cn(
                    "absolute inset-0 w-full h-full object-cover rounded transition-opacity duration-300",
                    isLoaded ? "opacity-100" : "opacity-0",
                  )}
                  onLoad={() => setIsLoaded(true)}
                  onError={() => setHasError(true)}
                  loading="lazy"
                  draggable={false}
                />
              )}
            </div>
          </div>
        </button>
      </div>

      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] w-max h-max p-0 gap-0 border border-border/50 bg-white shadow-xl backdrop-blur-md overflow-hidden [&>button:last-of-type]:hidden">
          <DialogTitle className="sr-only">{alt}</DialogTitle>
          {/* Close (X) at top — only hide dialog's default button, not this one */}
          <DialogClose asChild>
            <button
              type="button"
              className="absolute right-3 top-3 z-[100] flex size-10 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-card text-primary shadow-md backdrop-blur-sm transition-colors hover:bg-primary hover:text-primary-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background/80"
              aria-label={a11y.close}
            >
              <X className="h-5 w-5" strokeWidth={2.5} />
            </button>
          </DialogClose>
          <div className="relative flex items-center justify-center p-4">
            <img
              src={src}
              alt={alt}
              className="max-w-[85vw] max-h-[85vh] w-auto h-auto object-contain rounded"
              onClick={(e) => e.stopPropagation()}
              draggable={false}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
