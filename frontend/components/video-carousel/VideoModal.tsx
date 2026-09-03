'use client';

import { useEffect, useRef } from'react';
import { X } from'lucide-react';
import { Video } from'../../types';
import { useBodyScrollLock } from'../../hooks/useBodyScrollLock';
import { InnerVideoCarousel } from'./InnerVideoCarousel';

interface VideoModalProps {
  isOpen: boolean;
  videos: Video[];
  selectedIndex: number;
  onClose: () => void;
}

export function VideoModal({
  isOpen,
  videos,
  selectedIndex,
  onClose,
}: VideoModalProps) {
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useBodyScrollLock(isOpen);

  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      if (modalRef.current) {
        modalRef.current.focus();
      }
    } else if (previousFocusRef.current) {
      previousFocusRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key ==='Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || videos.length === 0) return null;

  return (
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      tabIndex={-1}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 overflow-hidden animate-fadeIn focus:outline-none"
      onClick={onClose}
    >
      <h2 id="modal-title" className="sr-only">
        Video player carousel modal
      </h2>

      <button
        type="button"
        onClick={onClose}
        aria-label="Close modal"
        className="absolute top-4 right-5 sm:top-6 sm:right-8 z-50 p-2 text-white drop-shadow-[0_1px_6px_rgba(0,0,0,0.85)] hover:text-white transition-all transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/40 rounded-full min-w-[44px] min-h-[44px] flex items-center justify-center"
      >
        <X className="w-7 h-7 sm:w-8 sm:h-8" strokeWidth={1.75} />
      </button>

      <div
        className="relative w-full h-full flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <InnerVideoCarousel videos={videos} initialIndex={selectedIndex} />
      </div>
    </div>
  );
}
