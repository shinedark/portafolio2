import express from 'express'
import { protect, requireAdmin } from '../middleware/auth.js'
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
  protect,
  requireAdmin,
  validateRequest(addContributionSchema),
  addContribution,
)

router.put(
  '/:id',
  protect,
  requireAdmin,
  validateRequest(updateContributionSchema),
  updateContribution,
)
router.delete('/:id', protect, requireAdmin, deleteContribution)

export default router
