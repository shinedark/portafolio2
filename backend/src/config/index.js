export const config = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  nodeEnv: process.env.NODE_ENV || 'development',
  adminPassword: process.env.ADMIN_PASSWORD,
  frontendUrl:
    process.env.NODE_ENV === 'production'
      ? process.env.PRODUCTION_URL
      : process.env.FRONTEND_URL,
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

// Ensure MongoDB URI has required parameters
if (
  process.env.MONGODB_URI &&
  !process.env.MONGODB_URI.includes('retryWrites=true')
) {
  console.warn('Warning: MongoDB URI should include retryWrites=true')
}

// Validate required environment variables
const requiredEnvVars = [
  'MONGODB_URI',
  'JWT_SECRET',
  'ADMIN_PASSWORD',
  process.env.NODE_ENV === 'production' ? 'PRODUCTION_URL' : 'FRONTEND_URL',
]

const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar])

if (missingEnvVars.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingEnvVars.join(', ')}`,
  )
}
