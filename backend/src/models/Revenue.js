import mongoose from 'mongoose'

const itemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    profit: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    isEssential: {
      type: Boolean,
      default: false,
    },
    isMonthly: {
      type: Boolean,
      default: false,
    },
    isAsset: {
      type: Boolean,
      default: false,
    },
    isNeeded: {
      type: Boolean,
      default: true,
    },
    link: {
      type: String,
      default: '',
    },
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
    items: [itemSchema],
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
      sales: categorySchema,
      services: categorySchema,
      investments: categorySchema,
      other: categorySchema,
    },
  },
  {
    timestamps: true,
  },
)

export const Revenue = mongoose.model('Revenue', revenueSchema)
