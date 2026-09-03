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
  duration: number;
  likes: number;
  commentsCount: number;
  shares: number;
  createdAt: string;
}

export interface LikeRecord {
  id: string;
  videoId: string;
  userId: string;
  createdAt: string;
}

export interface ShareRecord {
  id: string;
  videoId: string;
  platform:'native' |'copy_link' |'whatsapp' |'facebook' |'linkedin' |'x';
  createdAt: string;
}

export interface CommentRecord {
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

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown[];
  };
}
