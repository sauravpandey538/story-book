import { useState, useCallback, useRef, useEffect } from 'react';

interface UsePageTurnOptions {
  totalPages: number;
  onPageChange?: (page: number) => void;
}

interface DragState {
  isDragging: boolean;
  startX: number;
  currentX: number;
  progress: number; // 0 to 1
  direction: 'left' | 'right' | null;
}

/** When set, the UI should run an animated flip then call commitFlip() */
export interface PendingFlip {
  direction: 'left' | 'right';
  targetSpread: number;
  /** Duration in seconds: 0.5 for single flip, 0.1 for rapid consecutive flips */
  duration: number;
}

const SINGLE_FLIP_DURATION_MS = 500;
const RAPID_FLIP_DURATION_MS = 100;
const RAPID_THRESHOLD_MS = 450;

export function usePageTurn({ totalPages, onPageChange }: UsePageTurnOptions) {
  const [currentSpread, setCurrentSpread] = useState(0); // 0 = cover, 1+ = spreads
  const [isAnimating, setIsAnimating] = useState(false);
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    startX: 0,
    currentX: 0,
    progress: 0,
    direction: null,
  });
  
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const pendingFlipTargetRef = useRef<number | null>(null);
  const commitTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  /** Time when last flip completed — used to detect rapid consecutive flips for shorter duration */
  const lastFlipCompletedAtRef = useRef<number>(0);

  const [pendingFlip, setPendingFlip] = useState<PendingFlip | null>(null);

  // Cover (0) + dedication (1) + one spread per memory + closing spread + back cover
  const totalSpreads = totalPages + 4;

  /** Actually apply the flip: update spread and clear pending. Called by commitFlip() or by internal timeout. */
  const applyFlip = useCallback((target: number) => {
    if (commitTimeoutRef.current != null) {
      clearTimeout(commitTimeoutRef.current);
      commitTimeoutRef.current = null;
    }
    pendingFlipTargetRef.current = null;
    lastFlipCompletedAtRef.current = Date.now();
    const clamped = Math.max(0, Math.min(target, totalSpreads - 1));
    setCurrentSpread(clamped);
    onPageChange?.(clamped);
    setPendingFlip(null);
  }, [totalSpreads, onPageChange]);

  const goToSpread = useCallback((spread: number, force = false) => {
    if (!force && isAnimating) return;
    const clampedSpread = Math.max(0, Math.min(spread, totalSpreads - 1));
    setCurrentSpread(clampedSpread);
    onPageChange?.(clampedSpread);
  }, [isAnimating, totalSpreads, onPageChange]);

  const nextPage = useCallback(() => {
    if (currentSpread < totalSpreads - 1) {
      goToSpread(currentSpread + 1);
    }
  }, [currentSpread, totalSpreads, goToSpread]);

  const prevPage = useCallback(() => {
    if (currentSpread > 0) {
      goToSpread(currentSpread - 1);
    }
  }, [currentSpread, goToSpread]);

  /** Request an animated flip to next spread. Uses 500ms for single flip, 100ms when flipping rapidly. */
  const requestNextPage = useCallback(() => {
    if (pendingFlip != null || isAnimating || currentSpread >= totalSpreads - 1) return;
    const target = currentSpread + 1;
    const isRapid = Date.now() - lastFlipCompletedAtRef.current < RAPID_THRESHOLD_MS;
    const durationSec = isRapid ? RAPID_FLIP_DURATION_MS / 1000 : SINGLE_FLIP_DURATION_MS / 1000;
    pendingFlipTargetRef.current = target;
    setPendingFlip({ direction: 'right', targetSpread: target, duration: durationSec });
    if (commitTimeoutRef.current != null) clearTimeout(commitTimeoutRef.current);
    const timeoutMs = (durationSec * 1000) + 100;
    commitTimeoutRef.current = setTimeout(() => applyFlip(target), timeoutMs);
  }, [pendingFlip, isAnimating, currentSpread, totalSpreads, applyFlip]);

  /** Request an animated flip to previous spread. Uses 500ms for single flip, 100ms when flipping rapidly. */
  const requestPrevPage = useCallback(() => {
    if (pendingFlip != null || isAnimating || currentSpread <= 0) return;
    const target = currentSpread - 1;
    const isRapid = Date.now() - lastFlipCompletedAtRef.current < RAPID_THRESHOLD_MS;
    const durationSec = isRapid ? RAPID_FLIP_DURATION_MS / 1000 : SINGLE_FLIP_DURATION_MS / 1000;
    pendingFlipTargetRef.current = target;
    setPendingFlip({ direction: 'left', targetSpread: target, duration: durationSec });
    if (commitTimeoutRef.current != null) clearTimeout(commitTimeoutRef.current);
    const timeoutMs = (durationSec * 1000) + 100;
    commitTimeoutRef.current = setTimeout(() => applyFlip(target), timeoutMs);
  }, [pendingFlip, isAnimating, currentSpread, applyFlip]);

  /** Call when animation completes (or from fallback). Clears hook timeout and applies the flip. */
  const commitFlip = useCallback((targetSpread?: number) => {
    const target = targetSpread ?? pendingFlipTargetRef.current;
    if (target != null) applyFlip(target);
  }, [applyFlip]);

  const handleDragStart = useCallback((clientX: number) => {
    if (isAnimating) return;
    setDragState({
      isDragging: true,
      startX: clientX,
      currentX: clientX,
      progress: 0,
      direction: null,
    });
  }, [isAnimating]);

  const handleDragMove = useCallback((clientX: number) => {
    if (!dragState.isDragging || !containerRef.current) return;

    const containerWidth = containerRef.current.offsetWidth;
    const deltaX = clientX - dragState.startX;
    const direction = deltaX < 0 ? 'right' : 'left';
    const progress = Math.min(Math.abs(deltaX) / (containerWidth * 0.5), 1);

    // Prevent dragging past bounds
    if (direction === 'right' && currentSpread >= totalSpreads - 1) return;
    if (direction === 'left' && currentSpread <= 0) return;

    setDragState(prev => ({
      ...prev,
      currentX: clientX,
      progress,
      direction,
    }));
  }, [dragState.isDragging, dragState.startX, currentSpread, totalSpreads]);

  const handleDragEnd = useCallback(() => {
    if (!dragState.isDragging) return;

    const threshold = 0.4;
    const shouldFlip = dragState.progress > threshold;

    if (shouldFlip && dragState.direction) {
      setIsAnimating(true);
      if (dragState.direction === 'right') {
        nextPage();
      } else {
        prevPage();
      }
      setTimeout(() => setIsAnimating(false), 450);
    }

    setDragState({
      isDragging: false,
      startX: 0,
      currentX: 0,
      progress: 0,
      direction: null,
    });
  }, [dragState, nextPage, prevPage]);

  // Mouse events
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    handleDragStart(e.clientX);
  }, [handleDragStart]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    handleDragMove(e.clientX);
  }, [handleDragMove]);

  const handleMouseUp = useCallback(() => {
    handleDragEnd();
  }, [handleDragEnd]);

  // Touch events
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    handleDragStart(touch.clientX);
  }, [handleDragStart]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    handleDragMove(touch.clientX);
  }, [handleDragMove]);

  const handleTouchEnd = useCallback(() => {
    handleDragEnd();
  }, [handleDragEnd]);

  // Keyboard navigation — use animated flip for realism
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        requestNextPage();
      } else if (e.key === 'ArrowLeft') {
        requestPrevPage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [requestNextPage, requestPrevPage]);

  // Global mouse up to catch releases outside container
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (dragState.isDragging) {
        handleDragEnd();
      }
    };

    window.addEventListener('mouseup', handleGlobalMouseUp);
    window.addEventListener('touchend', handleGlobalMouseUp);
    
    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
      window.removeEventListener('touchend', handleGlobalMouseUp);
    };
  }, [dragState.isDragging, handleDragEnd]);

  return {
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
    handlers: {
      onMouseDown: handleMouseDown,
      onMouseMove: handleMouseMove,
      onMouseUp: handleMouseUp,
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
  };
}
