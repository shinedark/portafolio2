import express from 'express'
import subscriberController from '../controllers/subscriberController.js'

const router = express.Router()

// Public route to handle new subscriptions
router.post('/subscribe', subscriberController.subscribe)

export default router
