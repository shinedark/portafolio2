import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import cookieParser from 'cookie-parser'
import { connectDB } from './config/database.js'
import { config } from './config/index.js'
import { errorHandler } from './middleware/errorHandler.js'
import authRoutes from './routes/auth.js'
import calculatorRoutes from './routes/calculator.js'
import contributionRoutes from './routes/contribution.js'
import subscriberRoutes from './routes/subscriberRoutes.js'
import { initAdmin } from './utils/initAdmin.js'

const app = express()

// CORS configuration
const corsOptions = {
  origin: config.allowedOrigins,
  ...config.corsOptions,
}

// Security middleware
app.use(helmet())
app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())

// Add request logging in development
// if (config.nodeEnv === 'development') {
//   app.use((req, res, next) => {
//     console.log(`${req.method} ${req.url}`)
//     console.log('Headers:', req.headers)
//     console.log('Body:', req.body)
//     next()
//   })
// }

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
app.use('/api/subscribers', subscriberRoutes)

// Error handling
app.use(errorHandler)

// Start server
const start = async () => {
  try {
    await connectDB()
    await initAdmin()
    app.listen(config.port, () => {
      console.log(
        `Server running in ${config.nodeEnv} mode on port ${config.port}`,
      )
    })
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

start()
