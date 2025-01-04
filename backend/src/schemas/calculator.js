import { z } from 'zod'

export const itemSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  cost: z.number().positive('Cost must be positive'),
  description: z.string().optional(),
  isEssential: z.boolean().default(false),
  isMonthly: z.boolean().default(false),
  isAsset: z.boolean().default(false),
  isNeeded: z.boolean().default(true),
  link: z.string().url().optional(),
})

export const addItemSchema = z.object({
  categoryId: z.enum([
    'equipment',
    'subscriptions',
    'inventory',
    'farming',
    'operations',
    'legal',
  ]),
  item: itemSchema,
})

export const updateItemSchema = addItemSchema.extend({
  itemIndex: z.number().int().min(0),
})

export const deleteItemSchema = z.object({
  categoryId: z.enum([
    'equipment',
    'subscriptions',
    'inventory',
    'farming',
    'operations',
    'legal',
  ]),
  itemIndex: z.number().int().min(0),
})
