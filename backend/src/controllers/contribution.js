import { Contribution } from '../models/Contribution.js'
import { AppError } from '../utils/AppError.js'

export const getContributions = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query

    const contributions = await Contribution.find({
      userId: req.user.id,
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    }).sort({ date: 1 })

    res.json({
      success: true,
      data: contributions,
    })
  } catch (error) {
    next(error)
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
