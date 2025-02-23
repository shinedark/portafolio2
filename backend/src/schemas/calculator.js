import { z } from 'zod'

const costCategories = [
  'equipment',
  'subscriptions',
  'inventory',
  'farming',
  'operations',
  'legal',
]

const revenueCategories = ['services', 'products']

const baseItemSchema = {
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional().nullable(),
  isEssential: z.boolean().default(false),
  isMonthly: z.boolean().default(false),
  isAsset: z.boolean().default(false),
  isNeeded: z.boolean().default(true),
  link: z.string().url().optional().nullable().or(z.literal('')),
}

export const costItemSchema = z.object({
  ...baseItemSchema,
  cost: z.number().positive('Cost must be positive'),
})

export const revenueItemSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  price: z.number().optional(),
  priceRange: z.string().optional(),
  basePrice: z.number().optional(),
  category: z.string().optional(),
  type: z.string().optional(),
  isMonthly: z.boolean().optional(),
  description: z.string().optional(),
  quantity: z.number().optional(),
  min: z.number().optional(),
  max: z.number().optional(),
})

// Base schemas for both cost and revenue items
const baseCostRequestSchema = z.object({
  item: costItemSchema,
})

const baseRevenueRequestSchema = z.object({
  item: revenueItemSchema,
})

// Add schemas with specific category validation
export const addCostItemSchema = baseCostRequestSchema.extend({
  categoryId: z.enum(costCategories),
})

export const addRevenueItemSchema = baseRevenueRequestSchema.extend({
  categoryId: z.enum(revenueCategories),
})

// Delete schemas
export const deleteCostItemSchema = z.object({
  categoryId: z.enum(costCategories),
  itemIndex: z.number().int().min(0),
})

export const deleteRevenueItemSchema = z.object({
  categoryId: z.enum(revenueCategories),
  itemIndex: z.number().int().min(0),
})

// Update schemas
export const updateCostItemSchema = baseCostRequestSchema.extend({
  categoryId: z.enum(costCategories),
  itemIndex: z.number().int().min(0),
})

export const updateRevenueItemSchema = baseRevenueRequestSchema.extend({
  categoryId: z.enum(revenueCategories),
  itemIndex: z.number().int().min(0),
})
