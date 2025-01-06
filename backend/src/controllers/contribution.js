import { Contribution } from '../models/Contribution.js'
import { AppError } from '../utils/AppError.js'

export const getContributions = async (req, res) => {
  try {
    const { startDate, endDate } = req.query
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 100

    // Validate date range
    const start = new Date(startDate)
    const end = new Date(endDate)

    if (end - start > 365 * 24 * 60 * 60 * 1000) {
      // More than 1 year
      return res.status(400).json({
        message: 'Date range too large. Please limit to 1 year or less.',
      })
    }

    const contributions = await Contribution.find({
      userId: req.user._id,
      date: {
        $gte: start,
        $lte: end,
      },
    })
      .sort({ date: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()

    // Get total count for pagination
    const total = await Contribution.countDocuments({
      userId: req.user._id,
      date: {
        $gte: start,
        $lte: end,
      },
    })

    // Format the response to match frontend expectations
    const formattedContributions = contributions.map((contribution) => ({
      ...contribution,
      date: contribution.date.toISOString().split('T')[0],
      commits: contribution.commits.map((commit) => ({
        ...commit,
        timestamp: commit.timestamp.toISOString(),
      })),
    }))

    res.json({
      data: formattedContributions,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
    })
  } catch (error) {
    console.error('Contribution fetch error:', error)
    res.status(500).json({
      message: 'Error fetching contributions',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    })
  }
}

export const addContribution = async (req, res, next) => {
  try {
    const { date, commits } = req.body

    const contribution = await Contribution.create({
      userId: req.user.id,
      date: new Date(date),
      count: commits.length,
      commits,
    })

    res.status(201).json({
      success: true,
      data: contribution,
    })
  } catch (error) {
    if (error.code === 11000) {
      return next(
        new AppError('Contribution already exists for this date', 400),
      )
    }
    next(error)
  }
}

export const updateContribution = async (req, res, next) => {
  try {
    const { date } = req.params
    const { commits } = req.body

    const contribution = await Contribution.findOneAndUpdate(
      {
        userId: req.user.id,
        date: new Date(date),
      },
      {
        $set: {
          commits,
          count: commits.length,
        },
      },
      { new: true },
    )

    if (!contribution) {
      throw new AppError('Contribution not found', 404)
    }

    res.json({
      success: true,
      data: contribution,
    })
  } catch (error) {
    next(error)
  }
}
