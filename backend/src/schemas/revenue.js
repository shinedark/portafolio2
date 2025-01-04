import { z } from 'zod'

export const revenueItemSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  price: z.number().positive('Price must be positive'),
  unit: z.string().min(1, 'Unit is required'),
  estimated: z.number().int().positive('Estimated units must be positive'),
  isMonthly: z.boolean().default(true),
  description: z.string().optional(),
})

export const addRevenueItemSchema = z.object({
  categoryId: z.enum(['services', 'products']),
  item: revenueItemSchema,
})

export const updateRevenueItemSchema = addRevenueItemSchema.extend({
  itemIndex: z.number().int().min(0),
})

export const deleteRevenueItemSchema = z.object({
  categoryId: z.enum(['services', 'products']),
  itemIndex: z.number().int().min(0),
})
