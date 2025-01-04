import jwt from 'jsonwebtoken'
import { User } from '../models/User.js'
import { AppError } from '../utils/AppError.js'

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  })
}

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    // Check if user exists
    const user = await User.findOne({ email })
    if (!user || !(await user.comparePassword(password))) {
      throw new AppError('Invalid credentials', 401)
    }

    // Create token
    const token = signToken(user._id)

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user._id,
          email: user.email,
          isAdmin: user.isAdmin,
        },
      },
    })
  } catch (error) {
    next(error)
  }
}

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password')
    if (!user) {
      throw new AppError('User not found', 404)
    }

    res.json({
      success: true,
      data: user,
    })
  } catch (error) {
    next(error)
  }
}
