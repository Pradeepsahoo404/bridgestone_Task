'use client';

import { Video } from'../../types';

interface SidePeekCardProps {
  video: Video;
  side:'left' |'right';
  onSelect: () => void;
}

export function SidePeekCard({ video, side, onSelect }: SidePeekCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-label={`Watch video: ${video.title}`}
      className={`reels-peek reels-peek-${side}`}
    >
      <div className="reels-peek-inner">
        <img
          src={video.posterUrl || video.thumbnailUrl}
          alt=""
          className="w-full h-full object-cover"
        />
        <span className="reels-peek-shade" />
      </div>
    </button>
  );
}
