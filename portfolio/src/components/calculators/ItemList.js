import React from 'react'
import { formatCurrency } from '../../utils/formatters'

const ItemList = ({ items = [], type = 'cost' }) => {
  const isCost = type === 'cost'

  const formatPrice = (item) => {
    if (isCost) {
      return `$${formatCurrency(item?.cost)}${item?.isMonthly ? '/mo' : ''}`
    }

    if (item.priceRange) {
      return `$${item.priceRange}`
    }
    if (item.price) {
      return `$${formatCurrency(item.price)}${item.isMonthly ? '/mo' : ''}`
    }
    if (item.basePrice) {
      return `Starting at $${formatCurrency(item.basePrice)}`
    }
    return 'Price varies'
  }

  return (
    <div className="item-list">
      {items.map((item, index) => (
        <div
          key={index}
          className={`item ${isCost && item?.isEssential ? 'essential' : ''}`}
        >
          <div className="item-header">
            <h4>{item?.name || 'Unnamed Item'}</h4>
            <span className="amount">{formatPrice(item)}</span>
          </div>
          {item?.description && (
            <p className="description">{item.description}</p>
          )}
          {item?.category && (
            <span className="category-tag">{item.category}</span>
          )}
          {item?.type && <span className="type-tag">{item.type}</span>}
        </div>
      ))}
    </div>
  )
}

export default ItemList
