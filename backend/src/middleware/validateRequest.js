import { AppError } from '../utils/AppError.js'

export const validateRequest = (schema, property = 'body') => {
  return async (req, res, next) => {
    try {
      const data = await schema.parseAsync(req[property])
      req[property] = data
      next()
    } catch (error) {
      next(new AppError(error.errors[0].message, 400))
    }
  }
}
