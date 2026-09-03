import { videoRepository, IVideoRepository } from'../repositories/video.repository.js';
import { interactionRepository, IInteractionRepository } from'../repositories/interaction.repository.js';
import { LikeVideoInput, ShareVideoInput } from'../schemas/index.js';

export class InteractionService {
  constructor(
    private videoRepo: IVideoRepository = videoRepository,
    private interactionRepo: IInteractionRepository = interactionRepository
  ) {}

  async handleLike(input: LikeVideoInput, clientIp: string): Promise<{ videoId: string; liked: boolean; likes: number }> {
    const video = await this.videoRepo.findById(input.videoId);
    if (!video) {
      const error = new Error('Video not found') as Error & { statusCode?: number; code?: string };
      error.statusCode = 404;
      error.code ='NOT_FOUND';
      throw error;
    }

    const identity = input.userId || `ip-${Buffer.from(clientIp).toString('hex')}`;
    const existingLike = await this.interactionRepo.findLike(input.videoId, identity);

    if (input.action ==='like') {
      if (existingLike) {
        return {
          videoId: video.id,
          liked: true,
          likes: video.likes,
        };
      }

      await this.interactionRepo.addLike(input.videoId, identity);
      const updatedVideo = await this.videoRepo.updateLikes(input.videoId, 1);
      return {
        videoId: video.id,
        liked: true,
        likes: updatedVideo ? updatedVideo.likes : video.likes + 1,
      };
    } else {
      if (!existingLike) {
        return {
          videoId: video.id,
          liked: false,
          likes: video.likes,
        };
      }

      await this.interactionRepo.removeLike(input.videoId, identity);
      const updatedVideo = await this.videoRepo.updateLikes(input.videoId, -1);
      return {
        videoId: video.id,
        liked: false,
        likes: updatedVideo ? updatedVideo.likes : Math.max(0, video.likes - 1),
      };
    }
  }

  async handleShare(input: ShareVideoInput): Promise<{ videoId: string; shares: number; platform: string }> {
    const video = await this.videoRepo.findById(input.videoId);
    if (!video) {
      const error = new Error('Video not found') as Error & { statusCode?: number; code?: string };
      error.statusCode = 404;
      error.code ='NOT_FOUND';
      throw error;
    }

    await this.interactionRepo.addShare(input.videoId, input.platform);
    const updatedVideo = await this.videoRepo.updateShares(input.videoId, 1);

    return {
      videoId: video.id,
      shares: updatedVideo ? updatedVideo.shares : video.shares + 1,
      platform: input.platform,
    };
  }
}

export const interactionService = new InteractionService();
