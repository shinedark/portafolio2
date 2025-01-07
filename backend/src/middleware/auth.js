import jwt from 'jsonwebtoken'
import { User } from '../models/User.js'
import { AppError } from '../utils/AppError.js'

export const protect = async (req, res, next) => {
  try {
    const token = req.cookies.jwt

    if (!token) {
      console.log('No token found in cookies:', req.cookies)
      return res
        .status(401)
        .json({ success: false, message: 'No token provided' })
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      console.log('Decoded token:', decoded)

      req.user = decoded

      if (!req.user) {
        return res
          .status(401)
          .json({ success: false, message: 'User not found in token' })
      }

      next()
    } catch (jwtError) {
      console.log('JWT verification failed:', jwtError)
      return res.status(401).json({ success: false, message: 'Invalid token' })
    }
  } catch (error) {
    console.error('Auth middleware error:', error)
    res.status(401).json({ success: false, message: error.message })
  }
}

export const requireAdmin = async (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return next(new AppError('Admin access required', 403))
  }
  next()
}
