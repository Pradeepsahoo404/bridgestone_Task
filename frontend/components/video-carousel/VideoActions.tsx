'use client';

import { useState } from'react';
import { Heart, Send, MessageCircle, ShoppingCart } from'lucide-react';
import { Video } from'../../types';
import { formatNumber, getOrGenerateUserId } from'../../lib/utils';
import { likeVideo } from'../../lib/api';

interface VideoActionsProps {
  video: Video;
  onOpenComments: () => void;
  onOpenShare: () => void;
}

export function VideoActions({ video, onOpenComments, onOpenShare }: VideoActionsProps) {
  const [liked, setLiked] = useState<boolean>(false);
  const [likesCount, setLikesCount] = useState<number>(video.likes);
  const [isLiking, setIsLiking] = useState<boolean>(false);

  const handleToggleLike = async () => {
    if (isLiking) return;

    const previousLiked = liked;
    const previousCount = likesCount;

    const nextLiked = !liked;
    const nextCount = nextLiked ? likesCount + 1 : Math.max(0, likesCount - 1);

    setLiked(nextLiked);
    setLikesCount(nextCount);
    setIsLiking(true);

    try {
      const userId = getOrGenerateUserId();
      const res = await likeVideo({
        videoId: video.id,
        userId,
        action: nextLiked ?'like' :'unlike',
      });
      setLiked(res.liked);
      setLikesCount(res.likes);
    } catch (err) {
      setLiked(previousLiked);
      setLikesCount(previousCount);
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 sm:gap-5 z-30">
      <div className="flex flex-col items-center gap-0.5">
        <button
          type="button"
          onClick={handleToggleLike}
          disabled={isLiking}
          aria-label={liked ?'Unlike video' :'Like video'}
          className="group w-11 h-11 rounded-full flex items-center justify-center bg-black/35 hover:bg-black/55 backdrop-blur-[2px] transition-all duration-200 transform active:scale-90 focus:outline-none"
        >
          <Heart
            className={`w-[22px] h-[22px] drop-shadow-md transition-all duration-200 ${
              liked ?'fill-red-500 text-red-500 scale-110' :'text-white group-hover:scale-110'
            }`}
            strokeWidth={1.8}
          />
        </button>
        <span className="text-[11px] font-semibold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] leading-none">
          {formatNumber(likesCount)}
        </span>
      </div>

      <div className="flex flex-col items-center gap-0.5">
        <button
          type="button"
          onClick={onOpenShare}
          aria-label="Share video"
          className="group w-11 h-11 rounded-full flex items-center justify-center bg-black/35 hover:bg-black/55 backdrop-blur-[2px] text-white transition-all transform active:scale-90 focus:outline-none"
        >
          <Send className="w-[22px] h-[22px] drop-shadow-md group-hover:scale-110 transition-transform -rotate-12" strokeWidth={1.8} />
        </button>
        <span className="text-[11px] font-semibold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] leading-none">
          {formatNumber(video.shares)}
        </span>
      </div>

      <div className="flex flex-col items-center gap-0.5">
        <button
          type="button"
          onClick={onOpenComments}
          aria-label="View and post comments"
          className="group w-11 h-11 rounded-full flex items-center justify-center bg-black/35 hover:bg-black/55 backdrop-blur-[2px] text-white transition-all transform active:scale-90 focus:outline-none"
        >
          <MessageCircle className="w-[22px] h-[22px] drop-shadow-md group-hover:scale-110 transition-transform" strokeWidth={1.8} />
        </button>
        <span className="text-[11px] font-semibold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] leading-none">
          {formatNumber(video.commentsCount)}
        </span>
      </div>

      {video.productUrl && (
        <a
          href={video.productUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Buy ${video.productName}`}
          className="group w-11 h-11 rounded-full flex items-center justify-center bg-black/35 hover:bg-black/55 backdrop-blur-[2px] text-white transition-all transform active:scale-90 focus:outline-none"
        >
          <ShoppingCart className="w-[22px] h-[22px] drop-shadow-md group-hover:scale-110 transition-transform" strokeWidth={1.8} />
        </a>
      )}
    </div>
  );
}
