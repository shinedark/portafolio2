import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { Calculator } from '../models/Calculator.js'
import { Revenue } from '../models/Revenue.js'
import initialData from '../../../portfolio/src/data/initialData.json' assert { type: 'json' }

// Load environment variables
dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI

async function uploadInitialData() {
  try {
    // Connect to MongoDB Atlas
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    console.log('Connected to MongoDB Atlas')

    // Clear existing data
    await Calculator.deleteMany({})
    await Revenue.deleteMany({})
    console.log('Cleared existing data')

    // Format costs data for Calculator model
    const calculatorData = {
      categories: {
        equipment: {
          name: 'Equipment',
          items: initialData.costs.equipment.items
        },
        subscriptions: {
          name: 'Subscriptions',
          items: initialData.costs.subscriptions.items
        }
      }
    }

    // Format revenue data for Revenue model
    const revenueData = {
      categories: {
        services: {
          name: 'Services',
          items: initialData.revenue.services.items
        },
        products: {
          name: 'Products',
          items: initialData.revenue.products.items
        }
      }
    }

    // Upload data
    await Calculator.create(calculatorData)
    await Revenue.create(revenueData)

    console.log('Successfully uploaded initial data')
  } catch (error) {
    console.error('Error uploading initial data:', error)
    console.error('Error details:', error.message)
  } finally {
    await mongoose.disconnect()
    console.log('Disconnected from MongoDB')
  }
}

uploadInitialData() 