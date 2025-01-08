import React, { useState, useEffect } from 'react'
import './ProjectCostCalculator.css'
import CostCalculator from './CostCalculator'
import RevenueCalculator from './RevenueCalculator'
import { apiCall } from '../../utils/api'
import { populateCalculatorData } from '../../utils/populateCalculatorData'

const ProjectCostCalculator = () => {
  const [showCosts, setShowCosts] = useState(false)
  const [showRevenue, setShowRevenue] = useState(false)
  const [categories, setCategories] = useState({})
  const [revenue, setRevenue] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const [costsData, revenueData] = await Promise.all([
        apiCall('/api/calculator/costs'),
        apiCall('/api/calculator/revenue'),
      ])
      setCategories(costsData.data.categories || {})
      setRevenue(revenueData.data.categories || {})
    } catch (error) {
      console.error('Error fetching data:', error)
      setError('Failed to fetch calculator data')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const initializeData = async () => {
      try {
        await populateCalculatorData()
        await fetchData()
      } catch (error) {
        setError('Failed to initialize calculator data')
      }
    }
    initializeData()
  }, [])

  const calculateTotalCost = () => {
    let oneTime = { needed: 0, have: 0 }
    let monthly = { needed: 0, have: 0 }
    let assets = { needed: 0, have: 0 }

    Object.values(categories).forEach((category) => {
      category.items.forEach((item) => {
        const type = item.isNeeded ? 'needed' : 'have'
        if (item.isAsset) {
          assets[type] += Number(item.cost)
        } else if (item.isMonthly) {
          monthly[type] += Number(item.cost)
        } else {
          oneTime[type] += Number(item.cost)
        }
      })
    })

    return { oneTime, monthly, assets }
  }

  const calculateRevenue = () => {
    let monthlyRevenue = 0
    let annualRevenue = 0

    Object.values(revenue).forEach((category) => {
      category.items.forEach((item) => {
        if (item.isMonthly) {
          monthlyRevenue += Number(item.profit)
          annualRevenue += Number(item.profit) * 12
        } else {
          annualRevenue += Number(item.profit)
        }
      })
    })

    const totals = calculateTotalCost()
    return {
      monthly: monthlyRevenue,
      annual: annualRevenue,
      projectedProfit: {
        monthly: monthlyRevenue - totals.monthly.needed,
        annual:
          annualRevenue - totals.monthly.needed * 12 - totals.oneTime.needed,
      },
    }
  }

  const totals = calculateTotalCost()
  const revenueData = calculateRevenue()

  const handleDeleteCostItem = async (categoryId, index) => {
    try {
      await apiCall(`/api/calculator/costs/${categoryId}/${index}`, {
        method: 'DELETE',
      })
      await fetchData()
    } catch (error) {
      console.error('Error deleting cost item:', error)
      setError('Failed to delete cost item')
    }
  }

  const handleDeleteRevenueItem = async (categoryId, index) => {
    try {
      await apiCall(`/api/calculator/revenue/${categoryId}/${index}`, {
        method: 'DELETE',
      })
      await fetchData()
    } catch (error) {
      console.error('Error deleting revenue item:', error)
      setError('Failed to delete revenue item')
    }
  }

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
            totals={totals}
            categories={categories}
            onDeleteItem={handleDeleteCostItem}
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
            revenueData={revenueData}
            revenue={revenue}
            onDeleteItem={handleDeleteRevenueItem}
          />
        )}
      </div>
    </div>
  )
}

export default ProjectCostCalculator
