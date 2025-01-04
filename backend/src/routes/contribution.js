import express from 'express'
import { protect } from '../middleware/auth.js'
import { validateRequest } from '../middleware/validateRequest.js'
import {
  getContributions,
  addContribution,
  updateContribution,
} from '../controllers/contribution.js'
import {
  addContributionSchema,
  getContributionsSchema,
  updateContributionSchema,
} from '../schemas/contribution.js'

const router = express.Router()

router.use(protect) // All contribution routes require authentication

router.get(
  '/',
  validateRequest(getContributionsSchema, 'query'),
  getContributions,
)

router.post('/', validateRequest(addContributionSchema), addContribution)

router.put(
  '/:date',
  validateRequest(updateContributionSchema),
  updateContribution,
)

export default router
