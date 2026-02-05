import { useState, useCallback, useRef, useEffect } from 'react';

// Base64 encoded short page flip sound (simplified)
const PAGE_FLIP_SOUND = 'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAABhgC7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7//////////////////////////////////////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAAAAAAAAAAAAYYPLnfhAAAAAAAAAAAAAAAAAAAA//tQZAAP8AAAaQAAAAgAAA0gAAABAAABpAAAACAAADSAAAAETEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//tQZB4P8AAAaQAAAAgAAA0gAAABAAABpAAAACAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV';

export function useSound() {
  const [isMuted, setIsMuted] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioBufferRef = useRef<AudioBuffer | null>(null);

  useEffect(() => {
    // Initialize audio context on first user interaction
    const initAudio = async () => {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        
        try {
          // Create a simple click sound programmatically
          const sampleRate = audioContextRef.current.sampleRate;
          const duration = 0.15;
          const buffer = audioContextRef.current.createBuffer(1, sampleRate * duration, sampleRate);
          const channelData = buffer.getChannelData(0);
          
          // Generate a soft paper rustle sound
          for (let i = 0; i < buffer.length; i++) {
            const t = i / sampleRate;
            // Noise with envelope
            const envelope = Math.exp(-t * 20) * (1 - Math.exp(-t * 100));
            const noise = (Math.random() * 2 - 1) * 0.3;
            // Add some low frequency for body
            const low = Math.sin(t * 200) * 0.1 * Math.exp(-t * 15);
            channelData[i] = (noise + low) * envelope;
          }
          
          audioBufferRef.current = buffer;
        } catch (err) {
          console.warn('Could not create audio buffer:', err);
        }
      }
    };

    // Initialize on first click/touch
    const handleInteraction = () => {
      initAudio();
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
    };

    document.addEventListener('click', handleInteraction);
    document.addEventListener('touchstart', handleInteraction);

    return () => {
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
    };
  }, []);

  const playPageFlip = useCallback(() => {
    if (isMuted || !audioContextRef.current || !audioBufferRef.current) return;

    try {
      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBufferRef.current;
      
      const gainNode = audioContextRef.current.createGain();
      gainNode.gain.value = 0.4;
      
      source.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);
      
      source.start(0);
    } catch (err) {
      console.warn('Could not play sound:', err);
    }
  }, [isMuted]);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  return {
    isMuted,
    toggleMute,
    playPageFlip,
  };
}
