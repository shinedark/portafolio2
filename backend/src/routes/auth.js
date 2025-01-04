import express from 'express'
import { validateRequest } from '../middleware/validateRequest.js'
import { loginSchema } from '../schemas/auth.js'
import { login, getMe } from '../controllers/auth.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

router.post('/login', validateRequest(loginSchema), login)
router.get('/me', protect, getMe)

export default router
