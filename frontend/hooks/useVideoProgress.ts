import { useState, useEffect, useCallback, RefObject } from'react';

interface UseVideoProgressReturn {
  currentTime: number;
  duration: number;
  progressPercent: number;
  seekTo: (timeInSeconds: number) => void;
}

export function useVideoProgress(
  videoRef: RefObject<HTMLVideoElement>,
  isPlaying: boolean
): UseVideoProgressReturn {
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let rafId = 0;
    let cancelled = false;

    const sync = () => {
      if (cancelled) return;
      setCurrentTime(video.currentTime || 0);
      if (Number.isFinite(video.duration) && video.duration > 0) {
        setDuration(video.duration);
      }
    };

    const loop = () => {
      sync();
      if (!cancelled && !video.paused && !video.ended) {
        rafId = requestAnimationFrame(loop);
      }
    };

    const startLoop = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(loop);
    };

    const freeze = () => {
      cancelAnimationFrame(rafId);
      sync();
    };

    video.addEventListener('play', startLoop);
    video.addEventListener('playing', startLoop);
    video.addEventListener('pause', freeze);
    video.addEventListener('ended', freeze);
    video.addEventListener('waiting', freeze);
    video.addEventListener('timeupdate', sync);
    video.addEventListener('loadedmetadata', sync);
    video.addEventListener('durationchange', sync);
    video.addEventListener('seeked', sync);

    if (!video.paused && !video.ended) {
      startLoop();
    } else {
      sync();
    }

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      video.removeEventListener('play', startLoop);
      video.removeEventListener('playing', startLoop);
      video.removeEventListener('pause', freeze);
      video.removeEventListener('ended', freeze);
      video.removeEventListener('waiting', freeze);
      video.removeEventListener('timeupdate', sync);
      video.removeEventListener('loadedmetadata', sync);
      video.removeEventListener('durationchange', sync);
      video.removeEventListener('seeked', sync);
    };
  }, [videoRef, isPlaying]);

  const seekTo = useCallback(
    (timeInSeconds: number) => {
      const video = videoRef.current;
      if (!video) return;

      const max = duration || video.duration || 0;
      const safeTime = Math.max(0, Math.min(timeInSeconds, max));
      video.currentTime = safeTime;
      setCurrentTime(safeTime);
    },
    [videoRef, duration]
  );

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return {
    currentTime,
    duration,
    progressPercent,
    seekTo,
  };
}
