import { AppError } from '../utils/AppError.js'

export const errorHandler = (err, req, res, next) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    })
  }

  console.error(err)

  res.status(500).json({
    success: false,
    message: 'Internal server error',
  })
}
