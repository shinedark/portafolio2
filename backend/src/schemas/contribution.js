import { z } from 'zod'

export const commitSchema = z.object({
  message: z.string().min(1, 'Commit message is required'),
  type: z.enum(['code', 'design', 'docs', 'test', 'other']),
})

export const addContributionSchema = z.object({
  date: z.string().datetime(),
  commits: z.array(commitSchema),
})

export const getContributionsSchema = z.object({
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
})

export const updateContributionSchema = z.object({
  date: z.string().datetime(),
  commits: z.array(commitSchema).optional(),
})
