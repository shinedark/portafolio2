import React, { useState, useEffect } from 'react'
import { apiCall } from '../../../utils/api'
import CalculatorForm from './CalculatorForm'
import './Calculator.css'

function CalculatorManager() {
  const [costs, setCosts] = useState({})
  const [revenue, setRevenue] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('costs')
  const [editingItem, setEditingItem] = useState(null)

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const [costsData, revenueData] = await Promise.all([
        apiCall('/api/calculator/costs'),
        apiCall('/api/calculator/revenue'),
      ])

      // Access categories directly from the response
      setCosts(costsData.categories || {})
      setRevenue(revenueData.categories || {})
    } catch (error) {
      setError('Failed to fetch calculator data')
      console.error('Error fetching calculator data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddItem = async (categoryId, item, type = 'costs') => {
    try {
      setIsLoading(true)
      const endpoint = `/api/calculator/${type}`

      // Remove any undefined or empty string values
      const cleanedItem = Object.fromEntries(
        Object.entries(item).filter(
          ([_, value]) => value !== undefined && value !== '',
        ),
      )

      // Ensure we're sending the correct structure
      const payload = {
        categoryId,
        item: cleanedItem,
      }

      await apiCall(endpoint, {
        method: 'POST',
        body: JSON.stringify(payload),
      })
      await fetchData()
      setEditingItem(null)
    } catch (error) {
      if (error.errors) {
        setError(error.errors.join(', '))
      } else {
        setError(error.message || `Failed to add ${type} item`)
      }
      console.error('Error adding item:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateItem = async (
    categoryId,
    itemIndex,
    item,
    type = 'costs',
  ) => {
    try {
      setIsLoading(true)
      const endpoint = `/api/calculator/${type}/${categoryId}/${itemIndex}`

      // Remove any undefined or empty string values
      const cleanedItem = Object.fromEntries(
        Object.entries(item).filter(
          ([_, value]) => value !== undefined && value !== '',
        ),
      )

      await apiCall(endpoint, {
        method: 'PUT',
        body: JSON.stringify({
          categoryId,
          itemIndex,
          item: cleanedItem,
        }),
      })
      await fetchData()
      setEditingItem(null)
    } catch (error) {
      setError(error.message || `Failed to update ${type} item`)
      console.error('Error updating item:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteItem = async (categoryId, itemIndex, type = 'costs') => {
    if (!window.confirm('Are you sure you want to delete this item?')) return

    try {
      setIsLoading(true)
      const endpoint = `/api/calculator/${type}/${categoryId}/${itemIndex}`
      await apiCall(endpoint, {
        method: 'DELETE',
      })
      await fetchData()
    } catch (error) {
      setError(error.message || `Failed to delete ${type} item`)
      console.error('Error deleting item:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (categoryId, index, item) => {
    setEditingItem({
      categoryId,
      index,
      ...item,
    })
  }

  const handleSubmit = (categoryId, item, type) => {
    if (editingItem) {
      handleUpdateItem(categoryId, editingItem.index, item, type)
    } else {
      handleAddItem(categoryId, item, type)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    // Reset editing item when switching tabs
    setEditingItem(null)
  }, [activeTab])

  return (
    <div className="calculator-container">
      {/* Tabs */}
      <div className="calculator-tabs">
        <button
          onClick={() => setActiveTab('costs')}
          className={`calculator-tab ${activeTab === 'costs' ? 'active' : ''}`}
        >
          Costs
        </button>
        <button
          onClick={() => setActiveTab('revenue')}
          className={`calculator-tab ${
            activeTab === 'revenue' ? 'active' : ''
          }`}
        >
          Revenue
        </button>
      </div>

      {/* Add/Edit Form */}
      <CalculatorForm
        onSubmit={handleSubmit}
        isLoading={isLoading}
        type={activeTab}
        editingItem={editingItem}
      />

      {/* List */}
      <div className="item-list">
        {Object.entries(activeTab === 'costs' ? costs : revenue).map(
          ([categoryId, category]) => (
            <div key={categoryId} className="item-category">
              <h3 className="category-title">{category.name}</h3>
              <div className="item-list">
                {category.items.map((item, index) => (
                  <div key={index} className="item-card">
                    <div className="item-details">
                      <p className="item-name">{item.name}</p>
                      {activeTab === 'costs' ? (
                        <p className="item-price">${item.cost.toFixed(2)}</p>
                      ) : (
                        <p className="item-price">
                          {item.price
                            ? `$${item.price.toFixed(2)}`
                            : item.priceRange}
                        </p>
                      )}
                      {item.description && (
                        <p className="item-description">{item.description}</p>
                      )}
                      <div className="item-tags">
                        {item.isEssential && (
                          <span className="tag tag-essential">Essential</span>
                        )}
                        {item.isMonthly && (
                          <span className="tag tag-monthly">Monthly</span>
                        )}
                        {item.isAsset && (
                          <span className="tag tag-asset">Asset</span>
                        )}
                        {!item.isNeeded && (
                          <span className="tag tag-optional">Optional</span>
                        )}
                      </div>
                    </div>
                    <div className="item-actions">
                      <button
                        onClick={() => handleEdit(categoryId, index, item)}
                        disabled={isLoading}
                        className="action-button"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() =>
                          handleDeleteItem(categoryId, index, activeTab)
                        }
                        disabled={isLoading}
                        className="action-button action-button-delete"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ),
        )}
      </div>

      {error && <div className="error-message">{error}</div>}
    </div>
  )
}

export default CalculatorManager
