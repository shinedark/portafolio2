import { AppError } from '../utils/AppError.js'

export const validateRequest = (schema) => {
  return async (req, res, next) => {
    try {
      if (!schema || typeof schema.validate !== 'function') {
        throw new Error('Invalid schema provided to validation middleware')
      }

      const { error, value } = schema.validate(req.body)

      if (error) {
        throw error
      }

      req.body = value
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
