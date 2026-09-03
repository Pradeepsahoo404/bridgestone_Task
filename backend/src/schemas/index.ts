import { z } from'zod';

export const GetVideosQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(40),
  search: z.string().optional(),
  sort: z.enum(['popular','newest','title']).optional().default('newest'),
});

export const LikeVideoSchema = z.object({
  videoId: z.string().min(1,'Video ID is required'),
  userId: z.string().optional(),
  action: z.enum(['like','unlike']),
});

export const ShareVideoSchema = z.object({
  videoId: z.string().min(1,'Video ID is required'),
  platform: z.enum(['native','copy_link','whatsapp','facebook','linkedin','x']),
});

export const CreateCommentSchema = z.object({
  author: z.string().trim().min(2,'Author name must be at least 2 characters').max(50,'Author name cannot exceed 50 characters'),
  message: z.string().trim().min(1,'Comment message cannot be empty').max(500,'Comment cannot exceed 500 characters'),
});

export type GetVideosQuery = z.infer<typeof GetVideosQuerySchema>;
export type LikeVideoInput = z.infer<typeof LikeVideoSchema>;
export type ShareVideoInput = z.infer<typeof ShareVideoSchema>;
export type CreateCommentInput = z.infer<typeof CreateCommentSchema>;
