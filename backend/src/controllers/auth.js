import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { User } from '../models/User.js'
import { AppError } from '../utils/AppError.js'

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    // Find user by email
    const user = await User.findOne({ email })
    if (!user) {
      return next(new AppError('Invalid credentials', 401))
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return next(new AppError('Invalid credentials', 401))
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '1d' },
    )

    // Set cookie options for production
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      path: '/',
    }

    // Set HTTP-only cookie
    res
      .cookie('jwt', token, cookieOptions)
      .status(200)
      .json({
        success: true,
        user: {
          id: user._id,
          email: user.email,
          isAdmin: user.isAdmin,
        },
      })
  } catch (error) {
    console.error('Login error:', error)
    next(error)
  }
}

export const logout = async (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    path: '/',
  })
  res.status(200).json({ success: true, message: 'Logged out successfully' })
}

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId).select('-password')
    if (!user) {
      return next(new AppError('User not found', 404))
    }
    res.json({ user })
  } catch (error) {
    console.error('GetMe error:', error)
    next(new AppError('Server error', 500))
  }
}
