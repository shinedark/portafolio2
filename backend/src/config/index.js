export const config = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  nodeEnv: process.env.NODE_ENV || 'development',
  allowedOrigins: [
    'https://shinedark.dev',
    'http://localhost:3000',
    'https://portafolio2-backned.onrender.com',
  ],
  corsOptions: {
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    exposedHeaders: ['Set-Cookie'],
  },
}

// Validate required environment variables
const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET']
const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar])

if (missingEnvVars.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingEnvVars.join(', ')}`,
  )
}
