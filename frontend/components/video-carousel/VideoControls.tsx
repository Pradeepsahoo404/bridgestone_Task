'use client';

import { Play, Pause, Volume2, VolumeX } from'lucide-react';
import { formatDuration } from'../../lib/utils';

interface VideoControlsProps {
  isPlaying: boolean;
  isMuted: boolean;
  currentTime: number;
  duration: number;
  onTogglePlay: () => void;
  onToggleMute: () => void;
}

export function VideoControls({
  isPlaying,
  isMuted,
  currentTime,
  duration,
  onTogglePlay,
  onToggleMute,
}: VideoControlsProps) {
  return (
    <div className="flex items-center justify-between gap-3 text-white text-xs font-medium z-20">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onTogglePlay}
          aria-label={isPlaying ?'Pause video' :'Play video'}
          className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 transition-all text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          {isPlaying ? (
            <Pause className="w-4 h-4 fill-current" />
          ) : (
            <Play className="w-4 h-4 fill-current ml-0.5" />
          )}
        </button>

        <span className="tabular-nums text-white/90">
          {formatDuration(currentTime)} / {formatDuration(duration)}
        </span>
      </div>

      <button
        type="button"
        onClick={onToggleMute}
        aria-label={isMuted ?'Unmute audio' :'Mute audio'}
        className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 transition-all text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
      >
        {isMuted ? (
          <VolumeX className="w-4 h-4" />
        ) : (
          <Volume2 className="w-4 h-4" />
        )}
      </button>
    </div>
  );
}
