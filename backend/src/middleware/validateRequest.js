import { AppError } from '../utils/AppError.js'

export const validateRequest = (schema) => {
  return (req, res, next) => {
    try {
      if (!schema || typeof schema.parse !== 'function') {
        throw new Error('Invalid schema provided to validation middleware')
      }

      req.body = schema.parse(req.body)
      next()
    } catch (error) {
      next(
        new AppError(
          error.errors?.[0]?.message || error.message || 'Validation failed',
          400,
        ),
      )
    }
  }
}
