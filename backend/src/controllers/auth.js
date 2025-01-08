import jwt from 'jsonwebtoken'
import { AppError } from '../utils/AppError.js'

const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body

    // Check against environment variables
    if (
      username !== process.env.ADMIN_USERNAME ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      throw new AppError('Invalid credentials', 401)
    }

    // Create token
    const token = jwt.sign({ isAdmin: true }, process.env.JWT_SECRET, {
      expiresIn: '24h',
    })

    // Set cookie
    res.cookie('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    })

    res.status(200).json({
      success: true,
      message: 'Admin logged in successfully',
    })
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    })
  }
}

const adminLogout = (req, res) => {
  res.cookie('admin_token', 'none', {
    expires: new Date(Date.now() + 5 * 1000),
    httpOnly: true,
  })

  res.status(200).json({
    success: true,
    message: 'Admin logged out successfully',
  })
}

const checkAdminStatus = (req, res) => {
  res.status(200).json({
    success: true,
    isAdmin: true,
  })
}

export { adminLogin, adminLogout, checkAdminStatus }
