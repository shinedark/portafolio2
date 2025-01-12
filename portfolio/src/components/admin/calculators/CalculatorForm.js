import React, { useState, useEffect } from 'react'
import './Calculator.css'

const COST_CATEGORIES = {
  equipment: 'Equipment',
  subscriptions: 'Subscriptions',
  inventory: 'Inventory',
  farming: 'Farming Setup',
  operations: 'Operations',
  legal: 'Legal & Admin',
}

const REVENUE_CATEGORIES = {
  services: 'Services',
  products: 'Products',
}

function CalculatorForm({
  onSubmit,
  isLoading,
  type = 'costs',
  editingItem = null,
}) {
  const getInitialFormData = () => ({
    name: '',
    description: '',
    categoryId: type === 'costs' ? 'equipment' : 'services',
    // Cost-specific fields
    cost: '',
    isEssential: false,
    isMonthly: false,
    isAsset: false,
    isNeeded: true,
    link: '',
    // Revenue-specific fields
    price: '',
    priceRange: '',
    basePrice: '',
    category: '',
    type: '',
    quantity: '',
    min: '',
    max: '',
  })

  const [formData, setFormData] = useState(getInitialFormData())

  useEffect(() => {
    if (editingItem) {
      setFormData({
        ...editingItem,
        cost: editingItem.cost?.toString() || '',
        profit: editingItem.profit?.toString() || '',
        description: editingItem.description || '',
        link: editingItem.link || '',
      })
    } else {
      setFormData(getInitialFormData())
    }
  }, [editingItem])

  useEffect(() => {
    // Reset form when switching tabs
    if (!editingItem) {
      setFormData(getInitialFormData())
    }
  }, [type])

  const handleSubmit = (e) => {
    e.preventDefault()

    // Clean up optional fields and remove categoryId from item data
    const { categoryId, cost, profit, ...rest } = formData
    const cleanedData = {
      ...rest,
      [type === 'costs' ? 'cost' : 'profit']: parseFloat(
        type === 'costs' ? cost : profit,
      ),
      description: (rest.description || '').trim() || null,
      link: (rest.link || '').trim() || null,
    }

    onSubmit(categoryId, cleanedData, type)
  }

  const handleChange = (e) => {
    const { name, value, type: inputType, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: inputType === 'checkbox' ? checked : value,
    }))
  }

  return (
    <div className="calculator-form">
      <h2>Add {type === 'costs' ? 'Cost' : 'Revenue'} Item</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            required
            disabled={isLoading}
            className="form-select"
          >
            {Object.entries(
              type === 'costs' ? COST_CATEGORIES : REVENUE_CATEGORIES,
            ).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="NAME"
            className="form-input"
          />
        </div>

        {type === 'costs' && (
          <>
            <div className="form-grid">
              <input
                type="number"
                name="cost"
                value={formData.cost}
                onChange={handleChange}
                required
                placeholder="COST"
                className="form-input"
              />
              <input
                type="url"
                name="link"
                value={formData.link}
                onChange={handleChange}
                placeholder="LINK (OPTIONAL)"
                className="form-input"
              />
            </div>
            <div className="form-grid">
              <div className="checkbox-grid">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="isEssential"
                    checked={formData.isEssential}
                    onChange={handleChange}
                  />
                  ESSENTIAL
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="isMonthly"
                    checked={formData.isMonthly}
                    onChange={handleChange}
                  />
                  MONTHLY
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="isAsset"
                    checked={formData.isAsset}
                    onChange={handleChange}
                  />
                  ASSET
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="isNeeded"
                    checked={formData.isNeeded}
                    onChange={handleChange}
                  />
                  NEEDED
                </label>
              </div>
            </div>
          </>
        )}

        {type === 'revenue' && (
          <div className="form-grid">
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="PRICE"
              className="form-input"
            />
            <input
              type="text"
              name="priceRange"
              value={formData.priceRange}
              onChange={handleChange}
              placeholder="PRICE RANGE"
              className="form-input"
            />
            <input
              type="number"
              name="basePrice"
              value={formData.basePrice}
              onChange={handleChange}
              placeholder="BASE PRICE"
              className="form-input"
            />
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              placeholder="QUANTITY"
              className="form-input"
            />
            <input
              type="number"
              name="min"
              value={formData.min}
              onChange={handleChange}
              placeholder="MIN"
              className="form-input"
            />
            <input
              type="number"
              name="max"
              value={formData.max}
              onChange={handleChange}
              placeholder="MAX"
              className="form-input"
            />
          </div>
        )}

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="DESCRIPTION"
          rows={3}
          className="form-textarea"
        />

        <div className="button-group">
          {editingItem && (
            <button
              type="button"
              onClick={() => setFormData(getInitialFormData())}
              className="button button-secondary"
            >
              CANCEL
            </button>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="button button-primary"
          >
            {isLoading ? (
              <span className="button-loading">
                <div className="spinner"></div>
                <span>{editingItem ? 'UPDATING...' : 'ADDING...'}</span>
              </span>
            ) : (
              <span>
                {editingItem ? 'UPDATE' : 'ADD'} {type.toUpperCase()} ITEM
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CalculatorForm
