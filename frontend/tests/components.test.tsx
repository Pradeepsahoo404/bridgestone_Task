import React from'react';
import { render, screen, fireEvent } from'@testing-library/react';
import { describe, it, expect, vi } from'vitest';
import { VideoSkeletonCard } from'../components/video-carousel/VideoSkeleton';
import { OuterVideoCard } from'../components/video-carousel/OuterVideoCard';
import { VideoProgressBar } from'../components/video-carousel/VideoProgressBar';
import { formatNumber, formatDuration } from'../lib/utils';
import { Video } from'../types';

const dummyVideo: Video = {
  id:'video-001',
  title:'Test Video Hydration Bottle',
  description:'Test description',
  videoUrl:'https://media.w3.org/2010/05/sintel/trailer.mp4',
  thumbnailUrl:'https://images.unsplash.com/photo-1602143407151-7111542de6e8',
  posterUrl:'https://images.unsplash.com/photo-1602143407151-7111542de6e8',
  creatorName:'Alex Vance',
  creatorAvatar:'https://i.pravatar.cc/150?img=11',
  productName:'HydroPro Gallon Bottle 3.7L',
  productUrl:'https://example.com/products/hydropro-37',
  duration: 15,
  likes: 1248,
  commentsCount: 89,
  shares: 312,
  createdAt:'2026-08-15T10:30:00.000Z',
};

describe('Frontend Component & Utility Tests', () => {
  it('formatNumber formats thousands and millions correctly', () => {
    expect(formatNumber(950)).toBe('950');
    expect(formatNumber(1200)).toBe('1.2K');
    expect(formatNumber(3400000)).toBe('3.4M');
  });

  it('formatDuration formats seconds correctly', () => {
    expect(formatDuration(0)).toBe('0:00');
    expect(formatDuration(15)).toBe('0:15');
    expect(formatDuration(65)).toBe('1:05');
  });

  it('VideoSkeletonCard renders skeleton loading structure', () => {
    const { container } = render(<VideoSkeletonCard />);
    expect(container.firstChild).toHaveClass('animate-pulse');
  });

  it('OuterVideoCard renders clean interactive video card element', () => {
    const onSelect = vi.fn();
    render(<OuterVideoCard video={dummyVideo} onSelect={onSelect} />);

    const card = screen.getByRole('button', { name: /watch video/i });
    expect(card).toBeInTheDocument();
  });

  it('OuterVideoCard triggers onSelect callback on click and keyboard Enter', () => {
    const onSelect = vi.fn();
    render(<OuterVideoCard video={dummyVideo} onSelect={onSelect} />);

    const card = screen.getByRole('button', { name: /watch video/i });
    fireEvent.click(card);
    expect(onSelect).toHaveBeenCalledTimes(1);

    fireEvent.keyDown(card, { key:'Enter' });
    expect(onSelect).toHaveBeenCalledTimes(2);
  });

  it('VideoProgressBar updates seek calculation on arrow key press', () => {
    const onSeek = vi.fn();
    render(<VideoProgressBar progressPercent={50} duration={100} onSeek={onSeek} />);

    const slider = screen.getByRole('slider');
    expect(slider).toHaveAttribute('aria-valuenow','50');

    fireEvent.keyDown(slider, { key:'ArrowRight' });
    expect(onSeek).toHaveBeenCalledWith(55);

    fireEvent.keyDown(slider, { key:'ArrowLeft' });
    expect(onSeek).toHaveBeenCalledWith(45);
  });
});
