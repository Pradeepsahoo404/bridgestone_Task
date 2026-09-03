'use client';

import { useCallback, useEffect, useState } from'react';
import { ChevronLeft, ChevronRight } from'lucide-react';
import { Video } from'../../types';
import { VideoPlayer } from'./VideoPlayer';
import { CommentPanel } from'./CommentPanel';
import { ShareMenu } from'./ShareMenu';

interface InnerVideoCarouselProps {
  videos: Video[];
  initialIndex: number;
}

export function InnerVideoCarousel({
  videos,
  initialIndex,
}: InnerVideoCarouselProps) {
  const [activeIndex, setActiveIndex] = useState<number>(initialIndex);
  const [slideDirection, setSlideDirection] = useState<'next' |'prev' | null>(null);
  const [commentsOpen, setCommentsOpen] = useState<boolean>(false);
  const [shareOpen, setShareOpen] = useState<boolean>(false);

  const activeVideo = videos[activeIndex] || videos[0];
  const isFirst = activeIndex <= 0;
  const isLast = activeIndex >= videos.length - 1;

  const goTo = useCallback(
    (index: number) => {
      const nextIndex = Math.max(0, Math.min(videos.length - 1, index));
      if (nextIndex === activeIndex) return;

      const dir = nextIndex > activeIndex ?'next' :'prev';
      setSlideDirection(dir);
      setActiveIndex(nextIndex);
      setCommentsOpen(false);
    },
    [activeIndex, videos.length]
  );

  const handlePrev = (e: React.SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFirst) return;
    goTo(activeIndex - 1);
  };

  const handleNext = (e: React.SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isLast) return;
    goTo(activeIndex + 1);
  };

  useEffect(() => {
    if (commentsOpen || shareOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key ==='ArrowLeft') {
        e.preventDefault();
        if (!isFirst) goTo(activeIndex - 1);
      }
      if (e.key ==='ArrowRight') {
        e.preventDefault();
        if (!isLast) goTo(activeIndex + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, isFirst, isLast, goTo, commentsOpen, shareOpen]);

  const handleVideoEnd = useCallback(() => {
    if (activeIndex < videos.length - 1) {
      goTo(activeIndex + 1);
    } else {
      goTo(0);
    }
  }, [activeIndex, videos.length, goTo]);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="reels-viewport">
        <div
          className="reels-track"
          style={{
            transform: `translate3d(calc(-0.5 * var(--reels-card-w) - ${activeIndex} * var(--reels-step)), -50%, 0)`,
          }}
        >
          {videos.map((video, idx) => {
            const isActive = idx === activeIndex;
            const isPrev = idx === activeIndex - 1;
            const isNext = idx === activeIndex + 1;
            const isSide = isPrev || isNext;

            let zIndex = 1;
            if (isActive) {
              zIndex = 30;
            } else if (slideDirection ==='next' && isPrev) {
              zIndex = 15;
            } else if (slideDirection ==='prev' && isNext) {
              zIndex = 15;
            } else if (isSide) {
              zIndex = 10;
            }

            return (
              <div
                key={video.id}
                className={`reels-card ${isActive ?'is-active' :''} ${
                  isPrev ?'is-prev is-side' :''
                } ${isNext ?'is-next is-side' :''}`}
                style={{ zIndex }}
                onClick={() => {
                  if (!isActive) goTo(idx);
                }}
              >
                <VideoPlayer
                  video={video}
                  isActive={isActive}
                  onOpenComments={() => setCommentsOpen(true)}
                  onOpenShare={() => setShareOpen(true)}
                  onVideoEnd={handleVideoEnd}
                />
              </div>
            );
          })}
        </div>

        {!commentsOpen && !shareOpen && (
          <>
            <button
              type="button"
              aria-label="Previous video"
              disabled={isFirst}
              onClick={handlePrev}
              className="reels-nav-btn reels-nav-btn-prev"
            >
              <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7" strokeWidth={2.25} />
            </button>

            <button
              type="button"
              aria-label="Next video"
              disabled={isLast}
              onClick={handleNext}
              className="reels-nav-btn reels-nav-btn-next"
            >
              <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7" strokeWidth={2.25} />
            </button>
          </>
        )}
      </div>

      <CommentPanel
        videoId={activeVideo.id}
        isOpen={commentsOpen}
        onClose={() => setCommentsOpen(false)}
      />

      <ShareMenu
        video={activeVideo}
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
      />
    </div>
  );
}
