'use client';

import { useRef, useEffect } from'react';
import { Video } from'../../types';

interface OuterVideoCardProps {
  video: Video;
  onSelect: () => void;
}

export function OuterVideoCard({ video, onSelect }: OuterVideoCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;
    videoEl.muted = true;
    videoEl.play().catch(() => {});
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key ==='Enter' || e.key ==='') {
      e.preventDefault();
      onSelect();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={handleKeyDown}
      aria-label={`Watch video: ${video.title}`}
      className="group relative aspect-[9/16] w-[calc(50%-6px)] max-w-[240px] sm:w-[210px] md:w-[230px] lg:w-[248px] rounded-[18px] overflow-hidden bg-neutral-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2 transition-all duration-300 hover:shadow-[0_12px_32px_rgba(0,0,0,0.18)] hover:-translate-y-0.5 select-none shrink-0"
    >
      <video
        ref={videoRef}
        src={video.videoUrl}
        poster={video.posterUrl || video.thumbnailUrl}
        autoPlay
        playsInline
        muted
        loop
        preload="auto"
        className="w-full h-full object-cover"
      />
    </div>
  );
}
