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
  addItemSchema,
  updateItemSchema,
  deleteItemSchema,
} from '../schemas/calculator.js'

const router = express.Router()

router.use(protect)

// Cost routes
router.get('/costs', getCosts)
router.post('/costs', validateRequest(addItemSchema), addCost)
router.put(
  '/costs/:categoryId/:itemIndex',
  validateRequest(updateItemSchema),
  updateCost,
)
router.delete(
  '/costs/:categoryId/:itemIndex',
  validateRequest(deleteItemSchema),
  deleteCost,
)

// Revenue routes
router.get('/revenue', getRevenue)
router.post('/revenue', validateRequest(addItemSchema), addRevenue)
router.put(
  '/revenue/:categoryId/:itemIndex',
  validateRequest(updateItemSchema),
  updateRevenue,
)
router.delete(
  '/revenue/:categoryId/:itemIndex',
  validateRequest(deleteItemSchema),
  deleteRevenue,
)

export default router
