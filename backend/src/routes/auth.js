import express from 'express'
import { validateRequest } from '../middleware/validateRequest.js'
import { loginSchema } from '../schemas/auth.js'
import { login, logout, getMe } from '../controllers/auth.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

// Health check endpoint
router.head('/health', (req, res) => res.status(200).end())

router.post('/login', validateRequest(loginSchema), login)
router.post('/logout', logout)
router.get('/me', protect, getMe)

export default router
