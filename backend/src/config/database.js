import mongoose from 'mongoose'
import { config } from './index.js'

export const connectDB = async () => {
  try {
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      retryWrites: true,
      w: 'majority',
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    }

    await mongoose.connect(config.mongoUri, options)
    console.log('MongoDB connected successfully')
  } catch (error) {
    console.error('MongoDB connection error:', error)
    if (error.name === 'MongooseServerSelectionError') {
      console.error('Please check if your IP is whitelisted in MongoDB Atlas')
      console.error('Current environment:', config.nodeEnv)
    }
    process.exit(1)
  }
}
