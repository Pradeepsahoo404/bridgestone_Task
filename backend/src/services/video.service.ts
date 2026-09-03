import { videoRepository, IVideoRepository } from'../repositories/video.repository.js';
import { GetVideosQuery } from'../schemas/index.js';
import { Video, PaginationMeta } from'../types/index.js';

export class VideoService {
  constructor(private repo: IVideoRepository = videoRepository) {}

  async getVideos(query: GetVideosQuery): Promise<{ videos: Video[]; pagination: PaginationMeta }> {
    let videos = await this.repo.findAll();

    if (query.search) {
      const searchLower = query.search.toLowerCase();
      videos = videos.filter(
        (v) =>
          v.title.toLowerCase().includes(searchLower) ||
          v.description.toLowerCase().includes(searchLower) ||
          v.creatorName.toLowerCase().includes(searchLower) ||
          v.productName.toLowerCase().includes(searchLower)
      );
    }

    if (query.sort ==='popular') {
      videos.sort((a, b) => b.likes - a.likes);
    } else if (query.sort ==='title') {
      videos.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      // default: newest
      videos.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    const total = videos.length;
    const totalPages = Math.max(1, Math.ceil(total / query.limit));
    const page = Math.min(query.page, totalPages);
    const startIndex = (page - 1) * query.limit;
    const paginatedVideos = videos.slice(startIndex, startIndex + query.limit);

    return {
      videos: paginatedVideos,
      pagination: {
        page,
        limit: query.limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
      },
    };
  }

  async getVideoById(id: string): Promise<Video | null> {
    return this.repo.findById(id);
  }
}

export const videoService = new VideoService();
