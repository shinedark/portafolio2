import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { User } from '../models/User.js'

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    // Add debug logging
    console.log('Login attempt:', {
      email,
      hasPassword: !!password,
      body: req.body,
    })

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      })
    }

    // Set cookie options for production
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    }

    // Find user by email
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '1d' },
    )

    // Send token in cookie
    res
      .cookie('token', token, cookieOptions)
      .status(200)
      .json({
        success: true,
        data: {
          id: user._id,
          email: user.email,
        },
      })
  } catch (error) {
    console.error('Login error:', error)
    next(error)
  }
}

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password')
    res.json({ user })
  } catch (error) {
    console.error('GetMe error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}
