import Subscriber from '../models/Subscriber.js'

const subscriberController = {
  subscribe: async (req, res) => {
    try {
      const { email } = req.body

      if (!email) {
        return res.status(400).json({ message: 'Email is required' })
      }

      // Check if email already exists
      const existingSubscriber = await Subscriber.findOne({ email })
      if (existingSubscriber) {
        return res.status(400).json({ message: 'Email already subscribed' })
      }

      const subscriber = new Subscriber({ email })
      await subscriber.save()

      res.status(201).json({
        message: 'Successfully subscribed',
        subscriber,
      })
    } catch (error) {
      res.status(500).json({
        message: 'Error subscribing',
        error: error.message,
      })
    }
  },
}

export default subscriberController
