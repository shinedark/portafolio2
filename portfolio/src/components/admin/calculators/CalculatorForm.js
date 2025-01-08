import React, { useState, useEffect } from 'react'

const COST_CATEGORIES = {
  equipment: 'Equipment',
  subscriptions: 'Subscriptions',
  inventory: 'Inventory',
  farming: 'Farming Setup',
  operations: 'Operations',
  legal: 'Legal & Admin',
}

const REVENUE_CATEGORIES = {
  sales: 'Sales',
  services: 'Services',
  investments: 'Investments',
  other: 'Other',
}

function CalculatorForm({
  onSubmit,
  isLoading,
  type = 'costs',
  editingItem = null,
}) {
  const getInitialFormData = () => ({
    name: '',
    cost: '',
    profit: '',
    description: '',
    categoryId: type === 'costs' ? 'equipment' : 'sales',
    isEssential: false,
    isMonthly: false,
    isAsset: false,
    isNeeded: true,
    link: '',
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

  const categories =
    type === 'costs'
      ? [
          'equipment',
          'subscriptions',
          'inventory',
          'farming',
          'operations',
          'legal',
        ]
      : ['sales', 'services', 'investments', 'other']

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
    <div className="bg-white rounded-lg p-8">
      <h2 className="text-2xl font-mono mb-6">
        Add {type === 'costs' ? 'Cost' : 'Revenue'} Item
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <select
              name="categoryId"
              value={
                formData.categoryId ||
                (type === 'costs' ? 'equipment' : 'sales')
              }
              onChange={handleChange}
              required
              disabled={isLoading}
              className="w-full p-3 bg-white border border-gray-200 rounded-lg font-mono text-sm focus:outline-none focus:border-gray-400 transition-colors"
            >
              <option value="">SELECT CATEGORY</option>
              {categories.map((category) => (
                <option key={category} value={category} className="uppercase">
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div>
            <input
              type="text"
              name="name"
              value={formData.name || ''}
              onChange={handleChange}
              required
              disabled={isLoading}
              placeholder="NAME"
              className="w-full p-3 bg-white border border-gray-200 rounded-lg font-mono text-sm focus:outline-none focus:border-gray-400 transition-colors uppercase"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <input
              type="number"
              name={type === 'costs' ? 'cost' : 'profit'}
              value={
                type === 'costs' ? formData.cost || '' : formData.profit || ''
              }
              onChange={handleChange}
              required
              disabled={isLoading}
              placeholder={type === 'costs' ? 'COST' : 'PROFIT'}
              step="0.01"
              min="0"
              className="w-full p-3 bg-white border border-gray-200 rounded-lg font-mono text-sm focus:outline-none focus:border-gray-400 transition-colors uppercase"
            />
          </div>
          <div>
            <input
              type="url"
              name="link"
              value={formData.link || ''}
              onChange={handleChange}
              disabled={isLoading}
              placeholder="LINK (OPTIONAL)"
              className="w-full p-3 bg-white border border-gray-200 rounded-lg font-mono text-sm focus:outline-none focus:border-gray-400 transition-colors uppercase"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isEssential"
              checked={formData.isEssential || false}
              onChange={handleChange}
              disabled={isLoading}
              className="w-4 h-4 border-gray-300 rounded"
            />
            <span className="font-mono text-sm uppercase">ESSENTIAL</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isMonthly"
              checked={formData.isMonthly || false}
              onChange={handleChange}
              disabled={isLoading}
              className="w-4 h-4 border-gray-300 rounded"
            />
            <span className="font-mono text-sm uppercase">MONTHLY</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isAsset"
              checked={formData.isAsset || false}
              onChange={handleChange}
              disabled={isLoading}
              className="w-4 h-4 border-gray-300 rounded"
            />
            <span className="font-mono text-sm uppercase">ASSET</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isNeeded"
              checked={formData.isNeeded || false}
              onChange={handleChange}
              disabled={isLoading}
              className="w-4 h-4 border-gray-300 rounded"
            />
            <span className="font-mono text-sm uppercase">NEED</span>
          </div>
        </div>

        <textarea
          name="description"
          value={formData.description || ''}
          onChange={handleChange}
          disabled={isLoading}
          placeholder="Description"
          rows={3}
          className="w-full p-3 bg-white border border-gray-200 rounded-lg font-mono text-sm focus:outline-none focus:border-gray-400 transition-colors resize-none"
        />

        <div className="flex gap-4">
          {editingItem && (
            <button
              type="button"
              onClick={() => setFormData(getInitialFormData())}
              disabled={isLoading}
              className="flex-1 p-3 bg-gray-100 hover:bg-gray-200 rounded-lg font-mono text-sm uppercase transition-colors"
            >
              CANCEL
            </button>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 p-3 bg-black text-white hover:bg-gray-900 rounded-lg font-mono text-sm uppercase transition-colors"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                <span>{editingItem ? 'UPDATING...' : 'ADDING...'}</span>
              </span>
            ) : (
              <span>ADD {type === 'costs' ? 'COST' : 'REVENUE'} ITEM</span>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CalculatorForm
