import express from 'express'
import { protect } from '../middleware/auth.js'
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

// All routes are protected
router.use(protect)

// Cost routes
router.get('/costs', getCosts)
router.post('/costs', validateRequest(addCostItemSchema), addCost)
router.put(
  '/costs/:categoryId/:itemIndex',
  validateRequest(updateCostItemSchema),
  updateCost,
)
router.delete(
  '/costs/:categoryId/:itemIndex',
  validateRequest(deleteCostItemSchema),
  deleteCost,
)

// Revenue routes
router.get('/revenue', getRevenue)
router.post('/revenue', validateRequest(addRevenueItemSchema), addRevenue)
router.put(
  '/revenue/:categoryId/:itemIndex',
  validateRequest(updateRevenueItemSchema),
  updateRevenue,
)
router.delete(
  '/revenue/:categoryId/:itemIndex',
  validateRequest(deleteRevenueItemSchema),
  deleteRevenue,
)

export default router
