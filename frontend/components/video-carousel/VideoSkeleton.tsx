'use client';

export function VideoSkeletonCard() {
  return (
    <div className="relative aspect-[9/16] w-[calc(50%-6px)] max-w-[240px] sm:w-[210px] md:w-[230px] lg:w-[248px] rounded-[18px] bg-neutral-100 overflow-hidden animate-pulse" />
  );
}

export function OuterCarouselSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="flex flex-wrap justify-center gap-2.5 sm:gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <VideoSkeletonCard key={i} />
      ))}
    </div>
  );
}
