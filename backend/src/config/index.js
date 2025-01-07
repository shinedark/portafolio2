export const config = {
  port: process.env.PORT || 5000,
  mongoUri:
    process.env.MONGODB_URI || 'mongodb://localhost:27017/your_local_db',
  jwtSecret: process.env.JWT_SECRET || 'your-local-secret',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  nodeEnv: process.env.NODE_ENV || 'development',
}
