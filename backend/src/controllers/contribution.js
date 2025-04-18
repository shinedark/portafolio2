import { Contribution } from '../models/Contribution.js'
import { AppError } from '../utils/AppError.js'
import { updateContributionSchema } from '../schemas/contribution.js'

export const getContributions = async (req, res) => {
  try {
    console.log('Fetching all contributions')

    const contributions = await Contribution.find().sort({ date: -1 }).lean()

    console.log(`Found ${contributions.length} contributions`)

    res.json(contributions)
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
    const { date, title, content, type, imageUrl } = req.body

    const contribution = await Contribution.create({
      date: new Date(date),
      title,
      content,
      type,
      imageUrl,
      commits: [
        {
          message: title,
          type: type,
        },
      ],
      count: 1,
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
    const { id } = req.params
    const validatedData = updateContributionSchema.parse(req.body)

    const contribution = await Contribution.findByIdAndUpdate(
      id,
      {
        $set: {
          ...validatedData,
          commits: [
            {
              message: validatedData.title,
              type: validatedData.type,
            },
          ],
          count: 1,
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
    console.error('Update error:', error)
    next(error)
  }
}

export const deleteContribution = async (req, res, next) => {
  try {
    const { id } = req.params
    const contribution = await Contribution.findByIdAndDelete(id)

    if (!contribution) {
      throw new AppError('Contribution not found', 404)
    }

    res.json({
      success: true,
      data: contribution,
    })
  } catch (error) {
    console.error('Delete error:', error)
    next(error)
  }
}
