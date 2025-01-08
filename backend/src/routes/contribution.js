import express from 'express'
import { adminProtect } from '../middleware/auth.js'
import { validateRequest } from '../middleware/validateRequest.js'
import {
  getContributions,
  addContribution,
  updateContribution,
  deleteContribution,
} from '../controllers/contribution.js'
import {
  addContributionSchema,
  updateContributionSchema,
} from '../schemas/contribution.js'

const router = express.Router()

// Public routes
router.get('/', getContributions)

// Admin only routes
router.post(
  '/',
  adminProtect,
  validateRequest(addContributionSchema),
  addContribution,
)

router.put(
  '/:id',
  adminProtect,
  validateRequest(updateContributionSchema),
  updateContribution,
)
router.delete('/:id', adminProtect, deleteContribution)

export default router
