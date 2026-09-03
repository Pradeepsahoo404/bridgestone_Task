'use client';

interface VideoProgressBarProps {
  progressPercent: number;
  duration: number;
  onSeek: (seconds: number) => void;
}

export function VideoProgressBar({
  progressPercent,
  duration,
  onSeek,
}: VideoProgressBarProps) {
  const handleSeekClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, clickX / rect.width));
    onSeek(percentage * duration);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!duration) return;
    const currentSeconds = (progressPercent / 100) * duration;
    if (e.key ==='ArrowRight') {
      e.preventDefault();
      onSeek(Math.min(duration, currentSeconds + 5));
    } else if (e.key ==='ArrowLeft') {
      e.preventDefault();
      onSeek(Math.max(0, currentSeconds - 5));
    }
  };

  const clamped = Math.max(0, Math.min(100, progressPercent));

  return (
    <div
      role="slider"
      aria-label="Video progress line"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(clamped)}
      tabIndex={0}
      onClick={handleSeekClick}
      onKeyDown={handleKeyDown}
      className="relative w-full h-[3px] bg-white/35 hover:h-1 rounded-full overflow-hidden cursor-pointer focus:outline-none focus:ring-1 focus:ring-white/50"
    >
      <div
        className="h-full w-full bg-white rounded-full origin-left"
        style={{ transform: `scaleX(${clamped / 100})` }}
      />
    </div>
  );
}
