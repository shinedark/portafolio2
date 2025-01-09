import mongoose from 'mongoose'

const revenueItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: Number,
    priceRange: String,
    basePrice: Number,
    category: String,
    type: String,
    isMonthly: Boolean,
    description: String,
    quantity: Number,
    min: Number,
    max: Number,
  },
  {
    _id: false,
  },
)

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    items: [revenueItemSchema],
  },
  {
    _id: false,
  },
)

const revenueSchema = new mongoose.Schema(
  {
    categories: {
      services: categorySchema,
      products: categorySchema,
    },
  },
  {
    timestamps: true,
  },
)

export const Revenue = mongoose.model('Revenue', revenueSchema)
