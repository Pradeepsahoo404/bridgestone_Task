import path from'node:path';
import { LikeRecord, ShareRecord } from'../types/index.js';
import { safeReadJson, safeWriteJson } from'../utils/file-lock.js';

export interface IInteractionRepository {
  findLike(videoId: string, userId: string): Promise<LikeRecord | null>;
  addLike(videoId: string, userId: string): Promise<LikeRecord>;
  removeLike(videoId: string, userId: string): Promise<boolean>;
  addShare(videoId: string, platform: ShareRecord['platform']): Promise<ShareRecord>;
}

export class JsonInteractionRepository implements IInteractionRepository {
  private likesPath = path.resolve(process.cwd(),'src/data/likes.json');
  private sharesPath = path.resolve(process.cwd(),'src/data/shares.json');

  async findLike(videoId: string, userId: string): Promise<LikeRecord | null> {
    const likes = await safeReadJson<LikeRecord[]>(this.likesPath, []);
    return likes.find((l) => l.videoId === videoId && l.userId === userId) || null;
  }

  async addLike(videoId: string, userId: string): Promise<LikeRecord> {
    const likes = await safeReadJson<LikeRecord[]>(this.likesPath, []);
    const existing = likes.find((l) => l.videoId === videoId && l.userId === userId);
    if (existing) return existing;

    const newLike: LikeRecord = {
      id: `like-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      videoId,
      userId,
      createdAt: new Date().toISOString(),
    };

    likes.push(newLike);
    await safeWriteJson(this.likesPath, likes);
    return newLike;
  }

  async removeLike(videoId: string, userId: string): Promise<boolean> {
    const likes = await safeReadJson<LikeRecord[]>(this.likesPath, []);
    const filtered = likes.filter((l) => !(l.videoId === videoId && l.userId === userId));

    if (filtered.length === likes.length) return false;

    await safeWriteJson(this.likesPath, filtered);
    return true;
  }

  async addShare(videoId: string, platform: ShareRecord['platform']): Promise<ShareRecord> {
    const shares = await safeReadJson<ShareRecord[]>(this.sharesPath, []);
    const newShare: ShareRecord = {
      id: `share-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      videoId,
      platform,
      createdAt: new Date().toISOString(),
    };

    shares.push(newShare);
    await safeWriteJson(this.sharesPath, shares);
    return newShare;
  }
}

export const interactionRepository = new JsonInteractionRepository();
