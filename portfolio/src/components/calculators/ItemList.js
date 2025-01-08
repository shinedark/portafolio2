import React from 'react'
import { formatCurrency } from '../../utils/formatters'

const ItemList = ({ items, type = 'cost' }) => {
  const isCost = type === 'cost'

  return (
    <div className="item-list">
      {items.map((item, index) => (
        <div
          key={index}
          className={`item ${isCost && item.isEssential ? 'essential' : ''}`}
        >
          <div className="item-header">
            <h4>{item.name}</h4>
            <span className="amount">
              {isCost
                ? `$${formatCurrency(item.cost)}${item.isMonthly ? '/mo' : ''}`
                : `$${formatCurrency(item.price)} ${item.unit}`}
            </span>
          </div>
          {item.description && (
            <p className="description">{item.description}</p>
          )}
          {!isCost && (
            <p className="estimate">
              Est. {item.estimated} {item.unit}/mo = $
              {formatCurrency(item.price * item.estimated)}/mo
            </p>
          )}
          {item.link && (
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="item-link"
            >
              View Details →
            </a>
          )}
        </div>
      ))}
    </div>
  )
}

export default ItemList
