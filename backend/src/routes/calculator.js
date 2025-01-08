import express from 'express'
import { adminProtect } from '../middleware/auth.js'
import { validateRequest } from '../middleware/validateRequest.js'
import {
  getCosts,
  addCost,
  updateCost,
  deleteCost,
  getRevenue,
  addRevenue,
  updateRevenue,
  deleteRevenue,
} from '../controllers/calculator.js'
import {
  addCostItemSchema,
  addRevenueItemSchema,
  updateCostItemSchema,
  updateRevenueItemSchema,
  deleteCostItemSchema,
  deleteRevenueItemSchema,
} from '../schemas/calculator.js'

const router = express.Router()

// Public read routes
router.get('/costs', getCosts)
router.get('/revenue', getRevenue)

// Protected write routes - admin only
router.post('/costs', adminProtect, validateRequest(addCostItemSchema), addCost)
router.put(
  '/costs/:categoryId/:itemIndex',
  adminProtect,
  validateRequest(updateCostItemSchema),
  updateCost,
)
router.delete(
  '/costs/:categoryId/:itemIndex',
  adminProtect,
  validateRequest(deleteCostItemSchema),
  deleteCost,
)

router.post(
  '/revenue',
  adminProtect,
  validateRequest(addRevenueItemSchema),
  addRevenue,
)
router.put(
  '/revenue/:categoryId/:itemIndex',
  adminProtect,
  validateRequest(updateRevenueItemSchema),
  updateRevenue,
)
router.delete(
  '/revenue/:categoryId/:itemIndex',
  adminProtect,
  validateRequest(deleteRevenueItemSchema),
  deleteRevenue,
)

export default router
