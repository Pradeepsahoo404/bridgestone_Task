import { useState, useEffect, useCallback, useRef, RefObject } from'react';

interface UseVideoPlaybackProps {
  videoRef: RefObject<HTMLVideoElement>;
  isActive: boolean;
  autoPlay?: boolean;
}

interface UseVideoPlaybackReturn {
  isPlaying: boolean;
  isMuted: boolean;
  isLoading: boolean;
  hasError: boolean;
  togglePlay: () => void;
  toggleMute: () => void;
  play: () => Promise<void>;
  pause: () => void;
}

export function useVideoPlayback({
  videoRef,
  isActive,
  autoPlay = true,
}: UseVideoPlaybackProps): UseVideoPlaybackReturn {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const isMutedRef = useRef<boolean>(false);

  const play = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      setHasError(false);
      video.muted = isMutedRef.current;
      await video.play();
      setIsPlaying(true);
    } catch (err) {
      if ((err as Error).name !=='AbortError') {
        try {
          video.muted = true;
          isMutedRef.current = true;
          setIsMuted(true);
          await video.play();
          setIsPlaying(true);
        } catch (e) {
          setHasError(true);
          setIsPlaying(false);
        }
      }
    }
  }, [videoRef]);

  const pause = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    video.pause();
    setIsPlaying(false);
  }, [videoRef]);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (!video.paused) {
      pause();
    } else {
      void play();
    }
  }, [pause, play, videoRef]);

  const toggleMute = useCallback((event?: { stopPropagation?: () => void }) => {
    event?.stopPropagation?.();
    const video = videoRef.current;
    if (!video) return;

    const nextMuted = !video.muted;
    video.muted = nextMuted;
    isMutedRef.current = nextMuted;
    setIsMuted(nextMuted);
  }, [videoRef]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleWaiting = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);
    const handlePlaying = () => setIsLoading(false);
    const handleError = () => {
      setIsLoading(false);
      setHasError(true);
      setIsPlaying(false);
    };

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('playing', handlePlaying);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('playing', handlePlaying);
      video.removeEventListener('error', handleError);
    };
  }, [videoRef]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (!isActive) {
      video.pause();
      setIsPlaying(false);
      return;
    }

    if (autoPlay) {
      video.load();
      void play();
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState ==='hidden') {
        video.pause();
        setIsPlaying(false);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isActive, autoPlay, play, videoRef]);

  return {
    isPlaying,
    isMuted,
    isLoading,
    hasError,
    togglePlay,
    toggleMute,
    play,
    pause,
  };
}
