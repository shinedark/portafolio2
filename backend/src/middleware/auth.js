import jwt from 'jsonwebtoken'
import { AppError } from '../utils/AppError.js'

export const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
      throw new AppError('Not authorized', 401)
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded

    next()
  } catch (error) {
    next(new AppError('Not authorized', 401))
  }
}

export const adminOnly = (req, res, next) => {
  if (!req.user?.isAdmin) {
    return next(new AppError('Not authorized as admin', 403))
  }
  next()
}
