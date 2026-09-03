import { OuterVideoCarousel } from'../components/video-carousel/OuterVideoCarousel';

interface HomePageProps {
  searchParams?: {
    video?: string;
  };
}

export default function HomePage({ searchParams }: HomePageProps) {
  const initialVideoId = searchParams?.video;

  return (
    <main className="min-h-screen bg-white py-10 sm:py-14 px-4 sm:px-6 flex flex-col items-center">
      <div className="w-full max-w-5xl space-y-8 sm:space-y-10">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-[28px] sm:text-[32px] lg:text-[34px] font-medium text-neutral-600 tracking-tight">
            Our Bestsellers
          </h1>
        </div>

        <section aria-label="Our Bestsellers Video Carousel" className="w-full">
          <OuterVideoCarousel initialVideoId={initialVideoId} />
        </section>
      </div>
    </main>
  );
}
