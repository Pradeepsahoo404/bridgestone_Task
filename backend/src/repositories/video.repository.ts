import path from'node:path';
import { Video } from'../types/index.js';
import { safeReadJson, safeWriteJson } from'../utils/file-lock.js';

export interface IVideoRepository {
  findAll(): Promise<Video[]>;
  findById(id: string): Promise<Video | null>;
  updateLikes(id: string, delta: number): Promise<Video | null>;
  updateShares(id: string, delta: number): Promise<Video | null>;
  updateCommentsCount(id: string, delta: number): Promise<Video | null>;
}

export class JsonVideoRepository implements IVideoRepository {
  private filePath = path.resolve(process.cwd(),'src/data/videos.json');

  async findAll(): Promise<Video[]> {
    return safeReadJson<Video[]>(this.filePath, []);
  }

  async findById(id: string): Promise<Video | null> {
    const videos = await this.findAll();
    return videos.find((v) => v.id === id) || null;
  }

  async updateLikes(id: string, delta: number): Promise<Video | null> {
    const videos = await this.findAll();
    const index = videos.findIndex((v) => v.id === id);
    if (index === -1) return null;

    videos[index].likes = Math.max(0, videos[index].likes + delta);
    await safeWriteJson(this.filePath, videos);
    return videos[index];
  }

  async updateShares(id: string, delta: number): Promise<Video | null> {
    const videos = await this.findAll();
    const index = videos.findIndex((v) => v.id === id);
    if (index === -1) return null;

    videos[index].shares = Math.max(0, videos[index].shares + delta);
    await safeWriteJson(this.filePath, videos);
    return videos[index];
  }

  async updateCommentsCount(id: string, delta: number): Promise<Video | null> {
    const videos = await this.findAll();
    const index = videos.findIndex((v) => v.id === id);
    if (index === -1) return null;

    videos[index].commentsCount = Math.max(0, videos[index].commentsCount + delta);
    await safeWriteJson(this.filePath, videos);
    return videos[index];
  }
}

export const videoRepository = new JsonVideoRepository();
