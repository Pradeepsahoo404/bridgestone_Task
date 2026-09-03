export interface Video {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  posterUrl: string;
  creatorName: string;
  creatorAvatar: string;
  productName: string;
  productUrl: string;
  price?: string;
  originalPrice?: string;
  discount?: string;
  duration: number;
  likes: number;
  commentsCount: number;
  shares: number;
  createdAt: string;
}

export interface Comment {
  id: string;
  videoId: string;
  author: string;
  message: string;
  createdAt: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
}

export interface VideosApiResponse {
  success: boolean;
  data: {
    videos: Video[];
    pagination: PaginationMeta;
  };
}

export interface SingleVideoApiResponse {
  success: boolean;
  data: Video;
}

export interface LikeApiResponse {
  success: boolean;
  data: {
    videoId: string;
    liked: boolean;
    likes: number;
  };
}

export interface ShareApiResponse {
  success: boolean;
  data: {
    videoId: string;
    shares: number;
    platform: string;
  };
}

export interface CommentsApiResponse {
  success: boolean;
  data: Comment[];
}

export interface CreateCommentApiResponse {
  success: boolean;
  data: Comment;
}
