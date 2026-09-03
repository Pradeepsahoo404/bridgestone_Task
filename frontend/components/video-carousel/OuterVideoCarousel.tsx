'use client';

import { useState } from'react';
import { useQuery } from'@tanstack/react-query';
import { RefreshCw, AlertCircle, Film } from'lucide-react';
import { fetchVideos } from'../../lib/api';
import { QUERY_KEYS } from'../../lib/constants';
import { OuterVideoCard } from'./OuterVideoCard';
import { OuterCarouselSkeleton } from'./VideoSkeleton';
import { VideoModal } from'./VideoModal';

interface OuterVideoCarouselProps {
  initialVideoId?: string;
}

export function OuterVideoCarousel({ initialVideoId }: OuterVideoCarouselProps) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: [QUERY_KEYS.VIDEOS],
    queryFn: () => fetchVideos({ page: 1, limit: 40 }),
  });

  const allVideos = data?.videos || [];
  const displayVideos = allVideos.slice(0, 4);

  const handleSelectVideo = (index: number) => {
    setSelectedIdx(index);
  };

  const handleCloseModal = () => {
    setSelectedIdx(null);
  };

  if (isLoading) {
    return <OuterCarouselSkeleton count={4} />;
  }

  if (isError) {
    return (
      <div className="w-full p-8 rounded-2xl bg-slate-50 border border-rose-200 text-center space-y-4 shadow-xs">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto animate-bounce" />
        <div className="space-y-1">
          <h3 className="text-base font-bold text-slate-800">Unable to load videos</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {error instanceof Error ? error.message :'An error occurred while connecting to the server.'}
          </p>
        </div>
        <button
          type="button"
          onClick={() => refetch()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Try Again
        </button>
      </div>
    );
  }

  if (allVideos.length === 0) {
    return (
      <div className="w-full p-12 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-3">
        <Film className="w-10 h-10 text-slate-400 mx-auto" />
        <h3 className="text-base font-bold text-slate-800">No videos available</h3>
        <p className="text-xs text-slate-500">Check back later for newly added video reels.</p>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto">
      <div className="flex flex-wrap justify-center gap-2.5 sm:gap-3">
        {displayVideos.map((video, idx) => (
          <OuterVideoCard
            key={video.id}
            video={video}
            onSelect={() => handleSelectVideo(idx)}
          />
        ))}
      </div>

      <VideoModal
        isOpen={selectedIdx !== null}
        videos={allVideos}
        selectedIndex={selectedIdx ?? 0}
        onClose={handleCloseModal}
      />
    </div>
  );
}
