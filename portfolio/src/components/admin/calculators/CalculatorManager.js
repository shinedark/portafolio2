import React, { useState, useEffect } from 'react'
import { apiCall } from '../../../utils/api'
import CalculatorForm from './CalculatorForm'

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
      setCosts(costsData.data.categories)
      setRevenue(revenueData.data.categories)
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
    <div className="space-y-8">
      {/* Tabs */}
      <div className="flex gap-4 border-b border-white/10">
        <button
          onClick={() => setActiveTab('costs')}
          className={`font-mono text-sm pb-2 px-1 transition-colors relative ${
            activeTab === 'costs'
              ? 'text-white/90'
              : 'text-white/40 hover:text-white/60'
          }`}
        >
          Costs
          {activeTab === 'costs' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/90"></div>
          )}
        </button>
        <button
          onClick={() => setActiveTab('revenue')}
          className={`font-mono text-sm pb-2 px-1 transition-colors relative ${
            activeTab === 'revenue'
              ? 'text-white/90'
              : 'text-white/40 hover:text-white/60'
          }`}
        >
          Revenue
          {activeTab === 'revenue' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/90"></div>
          )}
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
      <div>
        {Object.entries(activeTab === 'costs' ? costs : revenue).map(
          ([categoryId, category]) => (
            <div key={categoryId} className="mb-6">
              <h3 className="font-mono text-sm text-white/90 mb-2 capitalize">
                {category.name}
              </h3>
              <div className="space-y-2">
                {category.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border border-white/10 rounded-lg hover:bg-white/5 transition-colors group"
                  >
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-mono text-sm text-white/90">
                          {item.name}
                        </p>
                        <p className="font-mono text-sm text-white/40">
                          $
                          {(activeTab === 'costs'
                            ? item.cost
                            : item.profit
                          ).toFixed(2)}
                        </p>
                      </div>
                      {item.description && (
                        <p className="font-mono text-xs text-white/40 mt-1">
                          {item.description}
                        </p>
                      )}
                      <div className="flex gap-2 mt-2">
                        {item.isEssential && (
                          <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400">
                            Essential
                          </span>
                        )}
                        {item.isMonthly && (
                          <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400">
                            Monthly
                          </span>
                        )}
                        {item.isAsset && (
                          <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-green-500/10 text-green-400">
                            Asset
                          </span>
                        )}
                        {!item.isNeeded && (
                          <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-yellow-500/10 text-yellow-400">
                            Optional
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleEdit(categoryId, index, item)}
                        disabled={isLoading}
                        className="font-mono text-xs px-2 py-1 text-white/60 opacity-0 group-hover:opacity-100 hover:text-white/90 transition-all"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() =>
                          handleDeleteItem(categoryId, index, activeTab)
                        }
                        disabled={isLoading}
                        className="font-mono text-xs px-2 py-1 text-red-400 opacity-0 group-hover:opacity-100 hover:text-red-300 transition-all"
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

      {error && (
        <div className="font-mono p-3 bg-red-500/5 border border-red-500/10 rounded text-red-400 text-sm text-center">
          {error}
        </div>
      )}
    </div>
  )
}

export default CalculatorManager
