import React, { useState, useEffect, useCallback } from 'react'
import './ProjectCostCalculator.css'
import CostCalculator from './CostCalculator'
import RevenueCalculator from './RevenueCalculator'
import { apiCall } from '../../utils/api'

const ProjectCostCalculator = () => {
  const [showCosts, setShowCosts] = useState(false)
  const [showRevenue, setShowRevenue] = useState(false)
  const [categories, setCategories] = useState({})
  const [revenue, setRevenue] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const formatData = useCallback((responseData) => {
    if (!responseData) {
      return {}
    }
    return responseData.categories || {}
  }, [])

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Fetch costs
      const costsResponse = await apiCall('/api/calculator/costs')
      if (costsResponse && costsResponse.categories) {
        const formattedCosts = formatData(costsResponse)
        setCategories(formattedCosts)
      }

      // Fetch revenue
      const revenueResponse = await apiCall('/api/calculator/revenue')
      if (revenueResponse && revenueResponse.categories) {
        const formattedRevenue = formatData(revenueResponse)
        setRevenue(formattedRevenue)
      }
    } catch (error) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }, [formatData])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const calculateTotalCost = () => {
    let oneTime = { needed: 0, have: 0 }
    let monthly = { needed: 0, have: 0 }
    let assets = { needed: 0, have: 0 }

    if (categories && Object.keys(categories).length > 0) {
      Object.entries(categories).forEach(([categoryName, category]) => {
        if (!category?.items?.length) return

        category.items.forEach((item) => {
          if (!item) return

          console.log(`Processing ${item.name}:`, {
            cost: item.cost,
            category: item.isAsset
              ? 'asset'
              : item.isMonthly
              ? 'monthly'
              : 'one-time',
            type: item.isNeeded ? 'needed' : 'have',
          })

          const type = item.isEssential || item.isNeeded ? 'needed' : 'have'
          const cost = parseFloat(item.cost) || 0

          if (item.isAsset) {
            assets[type] += cost
          } else if (item.isMonthly) {
            monthly[type] += cost
          } else {
            oneTime[type] += cost
          }
        })
      })
    }

    // Log final breakdown
    console.log('Final Breakdown:', {
      oneTime: {
        items: Object.entries(categories)
          .flatMap(([_, category]) => category.items)
          .filter((item) => !item.isAsset && !item.isMonthly)
          .map((item) => ({ name: item.name, cost: item.cost })),
        total: oneTime,
      },
      monthly: {
        items: Object.entries(categories)
          .flatMap(([_, category]) => category.items)
          .filter((item) => item.isMonthly)
          .map((item) => ({ name: item.name, cost: item.cost })),
        total: monthly,
      },
      assets: {
        items: Object.entries(categories)
          .flatMap(([_, category]) => category.items)
          .filter((item) => item.isAsset)
          .map((item) => ({ name: item.name, cost: item.cost })),
        total: assets,
      },
    })

    return { oneTime, monthly, assets }
  }

  const calculateRevenue = () => {
    let monthlyRevenue = 0
    let annualRevenue = 0
    let potentialInventoryValue = 0

    if (!revenue || Object.keys(revenue).length === 0) {
      return {
        monthly: 0,
        annual: 0,
        potentialInventoryValue: 0,
        projectedProfit: { monthly: 0, annual: 0 },
      }
    }

    Object.entries(revenue).forEach(([categoryName, category]) => {
      if (!category?.items?.length) return

      category.items.forEach((item) => {
        let itemRevenue = 0

        if (item.name === 'Vinyl Record' && item.price && item.quantity) {
          // Calculate potential inventory value
          potentialInventoryValue = item.price * item.quantity
          return // Skip adding to monthly/annual revenue
        }

        if (item.price) {
          itemRevenue = Number(item.price) * (Number(item.quantity) || 1)
        } else if (item.basePrice) {
          itemRevenue = Number(item.basePrice)
        } else if (item.priceRange) {
          const [min] = item.priceRange.split('-').map(Number)
          itemRevenue = min || 0
        }

        if (item.isMonthly) {
          monthlyRevenue += itemRevenue
          annualRevenue += itemRevenue * 12
        } else {
          annualRevenue += itemRevenue
        }
      })
    })

    const totals = calculateTotalCost()
    const projectedProfit = {
      monthly: monthlyRevenue - totals.monthly.needed,
      annual:
        annualRevenue - totals.monthly.needed * 12 - totals.oneTime.needed,
    }

    return {
      monthly: monthlyRevenue,
      annual: annualRevenue,
      potentialInventoryValue,
      projectedProfit,
    }
  }

  const totals = calculateTotalCost()
  const revenueData = calculateRevenue()

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-white/20 border-t-white/90"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-400">
        <p>{error}</p>
        <button
          onClick={fetchData}
          className="mt-4 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="cost-calculator">
      <div
        className={`calculator-section ${showCosts ? 'expanded' : ''}`}
        onClick={() => setShowCosts(!showCosts)}
      >
        <div className="section-header">
          <div className="header-content">
            <h2>Project Costs</h2>
            {!showCosts && (
              <span className="header-summary">
                Need: ${totals.monthly.needed.toLocaleString()}/mo + $
                {totals.oneTime.needed.toLocaleString()}• Have: $
                {totals.assets.have.toLocaleString()}
              </span>
            )}
          </div>
          <span className="expand-icon">{showCosts ? '−' : '+'}</span>
        </div>

        {showCosts && (
          <CostCalculator
            totals={calculateTotalCost()}
            categories={categories}
          />
        )}
      </div>

      <div
        className={`calculator-section ${showRevenue ? 'expanded' : ''}`}
        onClick={() => setShowRevenue(!showRevenue)}
      >
        <div className="section-header">
          <div className="header-content">
            <h2>Revenue Projections</h2>
            {!showRevenue && (
              <span className="header-summary">
                Monthly: ${revenueData.monthly.toLocaleString()}• Annual: $
                {revenueData.annual.toLocaleString()}
              </span>
            )}
          </div>
          <span className="expand-icon">{showRevenue ? '−' : '+'}</span>
        </div>

        {showRevenue && (
          <RevenueCalculator
            revenueData={calculateRevenue()}
            revenue={revenue}
          />
        )}
      </div>
    </div>
  )
}

export default ProjectCostCalculator
