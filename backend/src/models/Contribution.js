import mongoose from 'mongoose'

const contributionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    count: {
      type: Number,
      default: 0,
    },
    commits: [
      {
        message: {
          type: String,
          required: true,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
        type: {
          type: String,
          enum: ['code', 'design', 'docs', 'test', 'other'],
          default: 'other',
        },
      },
    ],
  },
  {
    timestamps: true,
  },
)

// Index for efficient date queries
contributionSchema.index({ userId: 1, date: 1 }, { unique: true })

export const Contribution = mongoose.model('Contribution', contributionSchema)
