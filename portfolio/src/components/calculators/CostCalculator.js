import React from 'react'
import ItemList from './ItemList'
import { formatCurrency } from '../../utils/formatters'

const CostCalculator = ({
  totals,
  categories,
  showCostForm,
  setShowCostForm,
  onDeleteItem,
  onEditItem,
}) => {
  return (
    <>
      <div className="cost-summary">
        <div className="cost-grid">
          <div className="cost-item need">
            <h4>One-time Needs</h4>
            <span className="amount">
              ${formatCurrency(totals.oneTime.needed)}
            </span>
          </div>
          <div className="cost-item need">
            <h4>Monthly Needs</h4>
            <span className="amount">
              ${formatCurrency(totals.monthly.needed)}/mo
            </span>
          </div>
          <div className="cost-item have">
            <h4>One-time Assets</h4>
            <span className="amount">
              ${formatCurrency(totals.oneTime.have)}
            </span>
          </div>
          <div className="cost-item have">
            <h4>Monthly Expenses</h4>
            <span className="amount">
              ${formatCurrency(totals.monthly.have)}/mo
            </span>
          </div>
          <div className="cost-item have">
            <h4>Total Assets</h4>
            <span className="amount">
              ${formatCurrency(totals.assets.have)}
            </span>
          </div>
        </div>
      </div>

      <div className="categories-grid">
        {Object.entries(categories).map(([categoryId, category]) => (
          <div key={categoryId} className="category-card">
            <h3>{category.name}</h3>
            <ItemList
              items={category.items}
              categoryId={categoryId}
              onDelete={onDeleteItem}
              onEdit={onEditItem}
              type="cost"
            />
          </div>
        ))}
      </div>

      <div className="cost-actions">
        <button
          className="add-cost-button"
          onClick={(e) => {
            e.stopPropagation()
            setShowCostForm(true)
          }}
        >
          + Add Cost Item
        </button>
      </div>
    </>
  )
}

export default CostCalculator
