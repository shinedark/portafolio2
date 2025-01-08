import mongoose from 'mongoose'

const commitSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['code', 'design', 'docs', 'test', 'blog', 'other'],
    required: true,
  },
})

const contributionSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['code', 'design', 'docs', 'test', 'blog', 'other'],
      required: true,
    },
    imageUrl: String,
    commits: [commitSchema],
    count: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  },
)

// Index for efficient date queries
contributionSchema.index({ date: 1 }, { unique: true })

export const Contribution = mongoose.model('Contribution', contributionSchema)
