'use client';

import { useState, useEffect, useCallback } from'react';

type ActiveVideoListener = (activeVideoId: string | null) => void;

class ActiveVideoStore {
  private activeVideoId: string | null = null;
  private listeners: Set<ActiveVideoListener> = new Set();

  getActiveVideoId(): string | null {
    return this.activeVideoId;
  }

  setActiveVideoId(id: string | null) {
    if (this.activeVideoId === id) return;
    this.activeVideoId = id;
    this.listeners.forEach((listener) => listener(id));
  }

  subscribe(listener: ActiveVideoListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }
}

export const activeVideoStore = new ActiveVideoStore();

export function useActiveVideoManager(videoId?: string) {
  const [activeId, setActiveId] = useState<string | null>(activeVideoStore.getActiveVideoId());

  useEffect(() => {
    return activeVideoStore.subscribe((id) => {
      setActiveId(id);
    });
  }, []);

  const setActive = useCallback((id: string | null) => {
    activeVideoStore.setActiveVideoId(id);
  }, []);

  const isCurrentActive = videoId ? activeId === videoId : false;

  return {
    activeVideoId: activeId,
    setActiveVideoId: setActive,
    isCurrentActive,
  };
}
