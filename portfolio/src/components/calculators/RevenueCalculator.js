import React from 'react'
import ItemList from './ItemList'
import { formatCurrency } from '../../utils/formatters'

const RevenueCalculator = ({ revenueData, revenue }) => {
  return (
    <>
      <div className="revenue-summary">
        <div className="revenue-grid">
          <div className="revenue-item">
            <h4>Monthly Revenue</h4>
            <span className="amount">
              ${formatCurrency(revenueData?.monthly || 0)}
            </span>
          </div>
          <div className="revenue-item">
            <h4>Annual Revenue</h4>
            <span className="amount">
              ${formatCurrency(revenueData?.annual || 0)}
            </span>
          </div>
          {revenueData?.projectedProfit && (
            <>
              <div className="revenue-item">
                <h4>Projected Monthly Profit</h4>
                <span className="amount">
                  ${formatCurrency(revenueData.projectedProfit.monthly)}
                </span>
              </div>
              <div className="revenue-item">
                <h4>Projected Annual Profit</h4>
                <span className="amount">
                  ${formatCurrency(revenueData.projectedProfit.annual)}
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="revenue-products">
        {revenue &&
          Object.entries(revenue).map(([categoryId, category]) => (
            <div key={categoryId} className="category-card">
              <h3>{category.name}</h3>
              <ItemList
                items={category.items}
                categoryId={categoryId}
                type="revenue"
              />
            </div>
          ))}
      </div>
    </>
  )
}

export default RevenueCalculator
