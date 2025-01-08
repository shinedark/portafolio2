import mongoose from 'mongoose'

const itemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    cost: {
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

const calculatorSchema = new mongoose.Schema(
  {
    categories: {
      equipment: categorySchema,
      subscriptions: categorySchema,
      inventory: categorySchema,
      farming: categorySchema,
      operations: categorySchema,
      legal: categorySchema,
    },
  },
  {
    timestamps: true,
  },
)

export const Calculator = mongoose.model('Calculator', calculatorSchema)
