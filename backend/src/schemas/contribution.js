import { z } from 'zod'

export const commitSchema = z.object({
  message: z.string().min(1, 'Commit message is required'),
  type: z.enum(['code', 'design', 'docs', 'test', 'blog', 'other']),
})

export const addContributionSchema = z.object({
  date: z.string(),
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  type: z.enum(['code', 'design', 'docs', 'test', 'blog', 'other']),
  imageUrl: z.string().optional(),
})

export const updateContributionSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  type: z.enum(['code', 'design', 'docs', 'test', 'blog', 'other']),
  imageUrl: z.string().optional(),
})
