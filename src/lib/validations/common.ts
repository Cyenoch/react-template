import { z } from 'zod';

export const paginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const idSchema = z.object({
  id: z.string().uuid('Invalid ID format'),
});

export const slugSchema = z.object({
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Invalid slug format'),
});

export type PaginationInput = z.infer<typeof paginationSchema>;
export type IdInput = z.infer<typeof idSchema>;
export type SlugInput = z.infer<typeof slugSchema>;
