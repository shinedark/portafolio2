import { User } from '../models/User.js'

export const initAdmin = async () => {
  try {
    const adminExists = await User.findOne({ email: process.env.ADMIN_EMAIL })

    if (!adminExists) {
      await User.create({
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        isAdmin: true,
      })
      console.log('Admin user created successfully')
    }
  } catch (error) {
    console.error('Error creating admin user:', error)
  }
}
