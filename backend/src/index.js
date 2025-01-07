import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import cookieParser from 'cookie-parser'
import { connectDB } from './config/database.js'
import { errorHandler } from './middleware/errorHandler.js'
import authRoutes from './routes/auth.js'
import calculatorRoutes from './routes/calculator.js'
import contributionRoutes from './routes/contribution.js'
import { initAdmin } from './utils/initAdmin.js'

const app = express()

// CORS configuration
const corsOptions = {
  origin: [
    'https://shinedark.dev',
    'http://localhost:3000',
    'https://portafolio2-backned.onrender.com',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  exposedHeaders: ['Set-Cookie'],
}

// Security middleware
app.use(helmet())
app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())

// Add request logging in development
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`)
    console.log('Headers:', req.headers)
    console.log('Body:', req.body)
    next()
  })
}

// Add CORS pre-flight
app.options('*', cors(corsOptions))

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
      console.log(
        `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`,
      )
    })
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

start()
