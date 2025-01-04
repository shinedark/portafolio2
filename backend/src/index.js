import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import { connectDB } from './config/database.js'
import { errorHandler } from './middleware/errorHandler.js'
import authRoutes from './routes/auth.js'
import calculatorRoutes from './routes/calculator.js'
import contributionRoutes from './routes/contribution.js'
import { initAdmin } from './utils/initAdmin.js'

const app = express()

// Security middleware
app.use(helmet())
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
)
app.use(express.json())

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
})
app.use(limiter)

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/calculator', calculatorRoutes)
app.use('/api/contributions', contributionRoutes)

// Error handling
app.use(errorHandler)

// Start server
const PORT = process.env.PORT || 5000

const start = async () => {
  try {
    await connectDB()
    await initAdmin()
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

start()
