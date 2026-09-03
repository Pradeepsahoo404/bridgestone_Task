import { API_BASE_URL } from'../constants';
import {
  VideosApiResponse,
  SingleVideoApiResponse,
  LikeApiResponse,
  ShareApiResponse,
  CommentsApiResponse,
  CreateCommentApiResponse,
  Video,
  Comment,
} from'../../types';

export async function fetchVideos(params?: {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
}): Promise<{ videos: Video[]; pagination: VideosApiResponse['data']['pagination'] }> {
  const query = new URLSearchParams();
  if (params?.page) query.append('page', params.page.toString());
  if (params?.limit) query.append('limit', params.limit.toString());
  if (params?.search) query.append('search', params.search);
  if (params?.sort) query.append('sort', params.sort);

  const res = await fetch(`${API_BASE_URL}/videos?${query.toString()}`);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Failed to fetch videos (${res.status})`);
  }

  const data: VideosApiResponse = await res.json();
  return data.data;
}

export async function fetchVideoById(id: string): Promise<Video> {
  const res = await fetch(`${API_BASE_URL}/videos/${id}`);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Failed to fetch video (${res.status})`);
  }

  const data: SingleVideoApiResponse = await res.json();
  return data.data;
}

export async function likeVideo(input: {
  videoId: string;
  userId?: string;
  action:'like' |'unlike';
}): Promise<LikeApiResponse['data']> {
  const res = await fetch(`${API_BASE_URL}/like`, {
    method:'POST',
    headers: {'Content-Type':'application/json' },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message ||'Failed to update like status');
  }

  const data: LikeApiResponse = await res.json();
  return data.data;
}

export async function shareVideo(input: {
  videoId: string;
  platform:'native' |'copy_link' |'whatsapp' |'facebook' |'linkedin' |'x';
}): Promise<ShareApiResponse['data']> {
  const res = await fetch(`${API_BASE_URL}/share`, {
    method:'POST',
    headers: {'Content-Type':'application/json' },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message ||'Failed to record share action');
  }

  const data: ShareApiResponse = await res.json();
  return data.data;
}

export async function fetchComments(videoId: string): Promise<Comment[]> {
  const res = await fetch(`${API_BASE_URL}/videos/${videoId}/comments`);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message ||'Failed to load comments');
  }

  const data: CommentsApiResponse = await res.json();
  return data.data;
}

export async function createComment(
  videoId: string,
  input: { author: string; message: string }
): Promise<Comment> {
  const res = await fetch(`${API_BASE_URL}/videos/${videoId}/comments`, {
    method:'POST',
    headers: {'Content-Type':'application/json' },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message ||'Failed to post comment');
  }

  const data: CreateCommentApiResponse = await res.json();
  return data.data;
}
