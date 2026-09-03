import type { Metadata } from'next';
import'./globals.css';
import { QueryProvider } from'../components/providers/QueryProvider';

export const metadata: Metadata = {
  title:'Our Bestsellers | Socially Approved Video Carousel',
  description:
'Discover socially approved product videos, workout routines, gear reviews, and authentic customer experiences in an interactive video carousel.',
  keywords: ['Socially Approved','Our Bestsellers','Video Carousel','Product Reviews','E-commerce Videos','Reels'],
  openGraph: {
    title:'Socially Approved | Trending Product Videos',
    description:'Explore community-tested gear and trending product video reels.',
    type:'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light">
      <body className="bg-white text-slate-900 min-h-screen antialiased selection:bg-emerald-500 selection:text-white">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
