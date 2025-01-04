import React from 'react'

const ItemList = ({ items, categoryId, onDelete, onEdit, type }) => {
  const isCost = type === 'cost'

  const renderItem = (item, index) => (
    <div key={index} className="item-row">
      <div className="item-info">
        <div className="item-details">
          <span className="item-name">
            {item.link ? (
              <a href={item.link} target="_blank" rel="noopener noreferrer">
                {item.name}
              </a>
            ) : (
              item.name
            )}
            {isCost && item.isEssential && (
              <span className="essential-tag">Essential</span>
            )}
            {isCost && item.isAsset && <span className="asset-tag">Asset</span>}
          </span>
          {item.description && (
            <span className="item-description">{item.description}</span>
          )}
        </div>
        {isCost ? (
          <span className="item-cost">
            ${item.cost}
            {item.isMonthly && <span className="monthly-tag">/mo</span>}
          </span>
        ) : (
          <div className="price-info">
            <span className="price">${item.price}</span>
            <span className="unit">{item.unit}</span>
            <span className="estimated">Est: {item.estimated}/mo</span>
          </div>
        )}
      </div>
      <div className="item-actions">
        <button
          className="edit-button"
          onClick={(e) => {
            e.stopPropagation()
            onEdit(categoryId, index, item)
          }}
        >
          ✎
        </button>
        <button
          className="delete-button"
          onClick={(e) => {
            e.stopPropagation()
            onDelete(categoryId, index)
          }}
        >
          ×
        </button>
      </div>
    </div>
  )

  if (isCost) {
    const needed = items.filter((item) => item.isNeeded)
    const have = items.filter((item) => !item.isNeeded)

    return (
      <>
        {needed.length > 0 && (
          <div className="items-section">
            <h4 className="section-title">Need</h4>
            {needed.map((item, index) => renderItem(item, index))}
          </div>
        )}
        {have.length > 0 && (
          <div className="items-section">
            <h4 className="section-title">Have</h4>
            {have.map((item, index) => renderItem(item, index))}
          </div>
        )}
      </>
    )
  }

  return <div className="items-list">{items.map(renderItem)}</div>
}

export default ItemList
