import express from 'express'
import { validateRequest } from '../middleware/validateRequest.js'
import { adminLoginSchema } from '../schemas/auth.js'
import {
  adminLogin,
  adminLogout,
  checkAdminStatus,
} from '../controllers/auth.js'
import { adminProtect } from '../middleware/auth.js'

const router = express.Router()

// Health check endpoint
router.head('/health', (req, res) => res.status(200).end())

// Admin auth routes
router.post('/admin/login', validateRequest(adminLoginSchema), adminLogin)
router.post('/admin/logout', adminLogout)
router.get('/admin/status', adminProtect, checkAdminStatus)

export default router
