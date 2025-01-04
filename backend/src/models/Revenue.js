import mongoose from 'mongoose'

const revenueItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    unit: {
      type: String,
      required: true,
    },
    estimated: {
      type: Number,
      required: true,
    },
    isMonthly: {
      type: Boolean,
      default: true,
    },
    description: {
      type: String,
      default: '',
    },
  },
  {
    _id: false,
  },
)

const revenueCategorySchema = new mongoose.Schema(
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
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    categories: {
      services: revenueCategorySchema,
      products: revenueCategorySchema,
    },
  },
  {
    timestamps: true,
  },
)

export const Revenue = mongoose.model('Revenue', revenueSchema)
