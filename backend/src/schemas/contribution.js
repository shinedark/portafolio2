import { z } from 'zod'

export const commitSchema = z.object({
  message: z.string().min(1, 'Commit message is required'),
  type: z.enum(['code', 'design', 'docs', 'test', 'other']),
})

export const addContributionSchema = z.object({
  date: z.string().datetime(),
  commits: z.array(commitSchema),
})

export const getContributionsSchema = z
  .object({
    startDate: z
      .string()
      .datetime()
      .refine((date) => !isNaN(new Date(date)), {
        message: 'Invalid start date format',
      }),
    endDate: z
      .string()
      .datetime()
      .refine((date) => !isNaN(new Date(date)), {
        message: 'Invalid end date format',
      }),
  })
  .refine(
    (data) => {
      const start = new Date(data.startDate)
      const end = new Date(data.endDate)
      return start <= end
    },
    {
      message: 'Start date must be before or equal to end date',
      path: ['startDate'],
    },
  )

export const updateContributionSchema = z.object({
  date: z.string().datetime(),
  commits: z.array(commitSchema).optional(),
})
