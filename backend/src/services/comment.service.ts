import { videoRepository, IVideoRepository } from'../repositories/video.repository.js';
import { commentRepository, ICommentRepository } from'../repositories/comment.repository.js';
import { CreateCommentInput } from'../schemas/index.js';
import { CommentRecord } from'../types/index.js';

export class CommentService {
  constructor(
    private videoRepo: IVideoRepository = videoRepository,
    private commentRepo: ICommentRepository = commentRepository
  ) {}

  async getComments(videoId: string): Promise<CommentRecord[]> {
    const video = await this.videoRepo.findById(videoId);
    if (!video) {
      const error = new Error('Video not found') as Error & { statusCode?: number; code?: string };
      error.statusCode = 404;
      error.code ='NOT_FOUND';
      throw error;
    }

    return this.commentRepo.findByVideoId(videoId);
  }

  async createComment(videoId: string, input: CreateCommentInput): Promise<CommentRecord> {
    const video = await this.videoRepo.findById(videoId);
    if (!video) {
      const error = new Error('Video not found') as Error & { statusCode?: number; code?: string };
      error.statusCode = 404;
      error.code ='NOT_FOUND';
      throw error;
    }

    const sanitizedAuthor = input.author.trim().replace(/</g,'&lt;').replace(/>/g,'&gt;');
    const sanitizedMessage = input.message.trim().replace(/</g,'&lt;').replace(/>/g,'&gt;');

    const comment = await this.commentRepo.create(videoId, sanitizedAuthor, sanitizedMessage);
    await this.videoRepo.updateCommentsCount(videoId, 1);

    return comment;
  }
}

export const commentService = new CommentService();
