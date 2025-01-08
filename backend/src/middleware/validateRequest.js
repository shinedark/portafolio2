import { AppError } from '../utils/AppError.js'

export const validateRequest = (schema) => {
  return async (req, res, next) => {
    try {
      // For DELETE and PUT requests, include params in validation
      const dataToValidate = ['DELETE', 'PUT'].includes(req.method)
        ? {
            ...req.body,
            ...req.params,
            itemIndex: req.params.itemIndex
              ? parseInt(req.params.itemIndex, 10)
              : undefined,
          }
        : req.body

      await schema.parseAsync(dataToValidate)
      next()
    } catch (error) {
      // If it's a Zod error, get the first error message
      const message = error.errors?.[0]?.message || 'Validation failed'
      next(new AppError(message, 400))
    }
  }
}
