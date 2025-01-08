import jwt from 'jsonwebtoken'
import { AppError } from '../utils/AppError.js'

export const adminProtect = async (req, res, next) => {
  try {
    const token = req.cookies.admin_token

    if (!token || token === 'none') {
      return res.status(401).json({
        success: false,
        message: 'Admin access required. Please login.',
      })
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      if (!decoded.isAdmin) {
        return res.status(403).json({
          success: false,
          message: 'Admin privileges required',
        })
      }

      req.isAdmin = true
      next()
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token',
      })
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    })
  }
}
