import { Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { a11y } from "@/data/data";

interface SoundToggleProps {
  isMuted: boolean;
  onToggle: () => void;
}

export function SoundToggle({ isMuted, onToggle }: SoundToggleProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onToggle}
      className="fixed bottom-4 right-4 z-50 bg-card/80 backdrop-blur-sm hover:bg-card shadow-lg"
      aria-label={isMuted ? a11y.unmuteSound : a11y.muteSound}
    >
      {isMuted ? (
        <VolumeX className="h-5 w-5 text-muted-foreground" />
      ) : (
        <Volume2 className="h-5 w-5 text-foreground" />
      )}
    </Button>
  );
}
