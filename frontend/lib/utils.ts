import { clsx, type ClassValue } from'clsx';
import { twMerge } from'tailwind-merge';
import { STORAGE_KEYS } from'./constants';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/,'') +'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/,'') +'K';
  }
  return num.toString();
}

export function formatDuration(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return'0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ?'0' :''}${secs}`;
}

export function getOrGenerateUserId(): string {
  if (typeof window ==='undefined') return'server-rendered-id';

  try {
    let userId = localStorage.getItem(STORAGE_KEYS.USER_ID);
    if (!userId) {
      userId ='usr_' + Date.now() +'_' + Math.random().toString(36).substring(2, 9);
      localStorage.setItem(STORAGE_KEYS.USER_ID, userId);
    }
    return userId;
  } catch (e) {
    return'fallback-anon-id';
  }
}
