import { apiCall } from './api'
import { initialCategories, initialRevenue } from '../data/mockCalculatorData'

export const populateCalculatorData = async () => {
  try {
    console.log('Checking if database needs population...')

    // First, check if data exists
    const [costsData, revenueData] = await Promise.all([
      apiCall('/api/calculator/costs'),
      apiCall('/api/calculator/revenue'),
    ])

    console.log('Current data:', { costsData, revenueData })

    // Check if the data exists and has items
    const hasCosts = Object.values(costsData.data?.categories || {}).some(
      (category) => category.items && category.items.length > 0,
    )
    const hasRevenue = Object.values(revenueData.data?.categories || {}).some(
      (category) => category.items && category.items.length > 0,
    )

    if (!hasCosts && !hasRevenue) {
      console.log('Database is empty. Starting population...')

      // Add costs
      for (const [categoryId, category] of Object.entries(initialCategories)) {
        for (const item of category.items) {
          try {
            await apiCall('/api/calculator/costs', {
              method: 'POST',
              body: JSON.stringify({
                categoryId,
                item,
              }),
            })
            console.log(`Added cost item: ${item.name} to ${categoryId}`)
          } catch (error) {
            console.error(`Failed to add cost item: ${item.name}`, error)
          }
        }
      }

      // Add revenue
      for (const [categoryId, category] of Object.entries(initialRevenue)) {
        for (const item of category.items) {
          try {
            await apiCall('/api/calculator/revenue', {
              method: 'POST',
              body: JSON.stringify({
                categoryId,
                item: {
                  ...item,
                  profit: item.price * item.estimated,
                  isMonthly: true,
                },
              }),
            })
            console.log(`Added revenue item: ${item.name} to ${categoryId}`)
          } catch (error) {
            console.error(`Failed to add revenue item: ${item.name}`, error)
          }
        }
      }

      console.log('Database populated successfully')
      return true
    }

    console.log('Database already has data:', { hasCosts, hasRevenue })
    return false
  } catch (error) {
    console.error('Error populating database:', error)
    throw new Error('Failed to populate database: ' + error.message)
  }
}
