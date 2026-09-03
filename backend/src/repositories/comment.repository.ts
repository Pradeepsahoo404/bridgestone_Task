import path from'node:path';
import { CommentRecord } from'../types/index.js';
import { safeReadJson, safeWriteJson } from'../utils/file-lock.js';

export interface ICommentRepository {
  findByVideoId(videoId: string): Promise<CommentRecord[]>;
  create(videoId: string, author: string, message: string): Promise<CommentRecord>;
}

export class JsonCommentRepository implements ICommentRepository {
  private filePath = path.resolve(process.cwd(),'src/data/comments.json');

  async findByVideoId(videoId: string): Promise<CommentRecord[]> {
    const comments = await safeReadJson<CommentRecord[]>(this.filePath, []);
    return comments
      .filter((c) => c.videoId === videoId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async create(videoId: string, author: string, message: string): Promise<CommentRecord> {
    const comments = await safeReadJson<CommentRecord[]>(this.filePath, []);
    const newComment: CommentRecord = {
      id: `comment-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      videoId,
      author,
      message,
      createdAt: new Date().toISOString(),
    };

    comments.push(newComment);
    await safeWriteJson(this.filePath, comments);
    return newComment;
  }
}

export const commentRepository = new JsonCommentRepository();
