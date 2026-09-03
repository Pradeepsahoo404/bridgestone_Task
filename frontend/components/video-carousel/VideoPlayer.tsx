'use client';

import { useState, useRef, useEffect } from'react';
import { Volume2, VolumeX, Loader2, AlertTriangle, RotateCcw, Play, Pause } from'lucide-react';
import { Video } from'../../types';
import { useVideoPlayback } from'../../hooks/useVideoPlayback';
import { useVideoProgress } from'../../hooks/useVideoProgress';
import { VideoProgressBar } from'./VideoProgressBar';
import { VideoActions } from'./VideoActions';

interface VideoPlayerProps {
  video: Video;
  isActive: boolean;
  onOpenComments: () => void;
  onOpenShare: () => void;
  onVideoEnd?: () => void;
}

export function VideoPlayer({
  video,
  isActive,
  onOpenComments,
  onOpenShare,
  onVideoEnd,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isEnded, setIsEnded] = useState<boolean>(false);
  const [tapIcon, setTapIcon] = useState<'play' |'pause' | null>(null);
  const tapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const {
    isPlaying,
    isMuted,
    isLoading,
    hasError,
    togglePlay,
    toggleMute,
    play,
  } = useVideoPlayback({
    videoRef,
    isActive,
    autoPlay: true,
  });

  const { duration, progressPercent, seekTo } = useVideoProgress(
    videoRef,
    isPlaying
  );

  useEffect(() => {
    return () => {
      if (tapTimerRef.current) {
        clearTimeout(tapTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    setTapIcon(null);
    setIsEnded(false);
  }, [video.id, isActive]);

  const flashTapIcon = (icon:'play' |'pause') => {
    setTapIcon(icon);
    if (tapTimerRef.current) {
      clearTimeout(tapTimerRef.current);
    }
    tapTimerRef.current = setTimeout(() => {
      setTapIcon(null);
    }, 550);
  };

  const handleEnded = () => {
    setIsEnded(true);
    if (onVideoEnd) {
      onVideoEnd();
    }
  };

  const handleReplay = () => {
    setIsEnded(false);
    seekTo(0);
    play();
    flashTapIcon('play');
  };

  const handleMuteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleMute();
  };

  const handlePlayPauseClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isEnded) {
      handleReplay();
      return;
    }

    const videoEl = videoRef.current;
    const willPause = videoEl ? !videoEl.paused : isPlaying;
    flashTapIcon(willPause ?'pause' :'play');
    togglePlay();
  };

  return (
    <div className="relative w-full h-full rounded-[18px] overflow-hidden bg-neutral-950 shadow-[0_20px_60px_rgba(0,0,0,0.45)] flex items-center justify-center select-none">
      {isActive && (
        <div
          className="absolute top-2.5 left-3 right-3 z-30"
          onClick={(e) => e.stopPropagation()}
        >
          <VideoProgressBar
            progressPercent={progressPercent}
            duration={duration}
            onSeek={seekTo}
          />
        </div>
      )}

      {isActive && (
        <button
          type="button"
          onClick={handleMuteClick}
          aria-label={isMuted ?'Unmute video sound' :'Mute video sound'}
          className="absolute top-10 right-3 z-40 w-8 h-8 rounded-full bg-black/45 hover:bg-black/65 text-white backdrop-blur-sm flex items-center justify-center focus:outline-none"
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      )}

      <video
        ref={videoRef}
        src={isActive ? video.videoUrl : undefined}
        poster={video.posterUrl || video.thumbnailUrl}
        playsInline
        muted={isMuted}
        preload={isActive ?'auto' :'none'}
        onEnded={handleEnded}
        className="w-full h-full object-cover"
      />

      {isActive && (
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/20 pointer-events-none" />
      )}

      {isActive && !hasError && (
        <button
          type="button"
          onClick={handlePlayPauseClick}
          aria-label={isPlaying ?'Pause video' :'Play video'}
          className="absolute inset-0 z-20 flex items-center justify-center bg-transparent"
        >
          {tapIcon && (
            <span className="reels-tap-icon w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-full bg-black/55 text-white backdrop-blur-sm flex items-center justify-center pointer-events-none">
              {tapIcon ==='pause' ? (
                <Pause className="w-8 h-8 fill-current" />
              ) : (
                <Play className="w-8 h-8 fill-current ml-1" />
              )}
            </span>
          )}
        </button>
      )}

      {isActive && isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 pointer-events-none z-10">
          <Loader2 className="w-8 h-8 text-white animate-spin" />
        </div>
      )}

      {isActive && hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 p-4 text-center z-10 space-y-2">
          <AlertTriangle className="w-8 h-8 text-rose-500" />
          <p className="text-xs sm:text-sm font-semibold text-white">Video failed to load</p>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              play();
            }}
            className="px-3 py-1.5 rounded-lg bg-white text-black text-xs font-bold"
          >
            Retry Playback
          </button>
        </div>
      )}

      {isActive && isEnded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 z-[25] space-y-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleReplay();
            }}
            aria-label="Replay video"
            className="p-3 sm:p-4 rounded-full bg-white text-black shadow-xl"
          >
            <RotateCcw className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>
          <span className="text-xs font-medium text-white">Replay Video</span>
        </div>
      )}

      {isActive && (
        <div
          className="absolute right-2.5 sm:right-3 top-[38%] z-40"
          onClick={(e) => e.stopPropagation()}
        >
          <VideoActions
            video={video}
            onOpenComments={onOpenComments}
            onOpenShare={onOpenShare}
          />
        </div>
      )}
    </div>
  );
}
