import { Calculator } from '../models/Calculator.js'
import { Revenue } from '../models/Revenue.js'
import { AppError } from '../utils/AppError.js'

// Cost Controllers
export const getCosts = async (req, res, next) => {
  try {
    const calculator = await Calculator.findOne({ userId: req.user.id })
    if (!calculator) {
      return res.json({ success: true, data: { categories: {} } })
    }
    res.json({ success: true, data: calculator })
  } catch (error) {
    next(error)
  }
}

export const addCost = async (req, res, next) => {
  try {
    const { categoryId, item } = req.body

    let calculator = await Calculator.findOne({ userId: req.user.id })
    if (!calculator) {
      calculator = await Calculator.create({
        userId: req.user.id,
        categories: {},
      })
    }

    if (!calculator.categories[categoryId]) {
      calculator.categories[categoryId] = { name: categoryId, items: [] }
    }

    calculator.categories[categoryId].items.push(item)
    await calculator.save()

    res.status(201).json({ success: true, data: calculator })
  } catch (error) {
    next(error)
  }
}

export const updateCost = async (req, res, next) => {
  try {
    const { categoryId, itemIndex } = req.params
    const { item } = req.body

    const calculator = await Calculator.findOne({ userId: req.user.id })
    if (!calculator || !calculator.categories[categoryId]) {
      throw new AppError('Category not found', 404)
    }

    calculator.categories[categoryId].items[itemIndex] = item
    await calculator.save()

    res.json({ success: true, data: calculator })
  } catch (error) {
    next(error)
  }
}

export const deleteCost = async (req, res, next) => {
  try {
    const { categoryId, itemIndex } = req.params

    const calculator = await Calculator.findOne({ userId: req.user.id })
    if (!calculator || !calculator.categories[categoryId]) {
      throw new AppError('Category not found', 404)
    }

    calculator.categories[categoryId].items.splice(itemIndex, 1)
    await calculator.save()

    res.json({ success: true, data: calculator })
  } catch (error) {
    next(error)
  }
}

// Revenue Controllers
export const getRevenue = async (req, res, next) => {
  try {
    const revenue = await Revenue.findOne({ userId: req.user.id })
    if (!revenue) {
      return res.json({ success: true, data: { categories: {} } })
    }
    res.json({ success: true, data: revenue })
  } catch (error) {
    next(error)
  }
}

export const addRevenue = async (req, res, next) => {
  try {
    const { categoryId, item } = req.body

    let revenue = await Revenue.findOne({ userId: req.user.id })
    if (!revenue) {
      revenue = await Revenue.create({
        userId: req.user.id,
        categories: {},
      })
    }

    if (!revenue.categories[categoryId]) {
      revenue.categories[categoryId] = { name: categoryId, items: [] }
    }

    revenue.categories[categoryId].items.push(item)
    await revenue.save()

    res.status(201).json({ success: true, data: revenue })
  } catch (error) {
    next(error)
  }
}

export const updateRevenue = async (req, res, next) => {
  try {
    const { categoryId, itemIndex } = req.params
    const { item } = req.body

    const revenue = await Revenue.findOne({ userId: req.user.id })
    if (!revenue || !revenue.categories[categoryId]) {
      throw new AppError('Category not found', 404)
    }

    revenue.categories[categoryId].items[itemIndex] = item
    await revenue.save()

    res.json({ success: true, data: revenue })
  } catch (error) {
    next(error)
  }
}

export const deleteRevenue = async (req, res, next) => {
  try {
    const { categoryId, itemIndex } = req.params

    const revenue = await Revenue.findOne({ userId: req.user.id })
    if (!revenue || !revenue.categories[categoryId]) {
      throw new AppError('Category not found', 404)
    }

    revenue.categories[categoryId].items.splice(itemIndex, 1)
    await revenue.save()

    res.json({ success: true, data: revenue })
  } catch (error) {
    next(error)
  }
}
