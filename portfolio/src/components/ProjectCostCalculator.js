import React, { useState } from 'react'
import './ProjectCostCalculator.css'
import CostCalculator from './calculators/CostCalculator'
import RevenueCalculator from './calculators/RevenueCalculator'

const initialCategories = {
  equipment: {
    name: 'Equipment',
    items: [
      {
        name: 'MacBook Pro',
        cost: 4199,
        isEssential: true,
        isNeeded: true,
        link: 'https://www.apple.com/shop/buy-mac/macbook-pro',
        description:
          'Current 2013 Mac Pro is outdated and unable to run modern development tools like React Native',
      },
      {
        name: 'Studio Equipment',
        cost: 7500,
        isEssential: false,
        isNeeded: false,
        link: '#',
        description: 'Music production and recording equipment',
      },
    ],
  },
  subscriptions: {
    name: 'Subscriptions',
    items: [
      {
        name: 'ChatGPT',
        cost: 200,
        isEssential: true,
        isMonthly: true,
        isNeeded: true,
        link: 'https://chat.openai.com/',
        description: 'AI-powered assistance and productivity',
      },
      {
        name: 'Cursor',
        cost: 20,
        isEssential: true,
        isMonthly: true,
        isNeeded: false,
        link: 'https://cursor.sh/',
        description: 'Currently subscribed development tool',
      },
    ],
  },
  inventory: {
    name: 'Inventory',
    items: [
      {
        name: 'Vinyl Records',
        cost: 16500,
        isEssential: false,
        description: '500 copies',
        isAsset: true,
        isNeeded: false,
      },
      {
        name: 'Music Catalog',
        cost: 0,
        isEssential: false,
        description: '200 songs across 50+ releases',
        isAsset: true,
        isNeeded: false,
      },
    ],
  },
  farming: {
    name: 'Farming Setup',
    items: [
      {
        name: 'Indoor Growing System',
        cost: 2000,
        isEssential: true,
        isNeeded: true,
        description:
          'For crops like yuca root, onions, garlic, guava, chilies, herbs, and lavender',
      },
      {
        name: 'Seeds and Supplies',
        cost: 500,
        isEssential: true,
        isNeeded: true,
        description: 'Initial farming supplies',
      },
    ],
  },
  operations: {
    name: 'Operations',
    items: [
      {
        name: 'Utilities',
        cost: 300,
        isEssential: true,
        isMonthly: true,
        isNeeded: true,
        description: 'Electricity, water, internet',
      },
      {
        name: 'Insurance',
        cost: 150,
        isEssential: true,
        isMonthly: true,
        isNeeded: true,
        description: 'Business liability and equipment insurance',
      },
      {
        name: 'Marketing',
        cost: 200,
        isEssential: false,
        isMonthly: true,
        isNeeded: true,
        description: 'Digital advertising and promotional materials',
      },
      {
        name: 'Maintenance',
        cost: 100,
        isEssential: true,
        isMonthly: true,
        isNeeded: true,
        description: 'Equipment and facilities maintenance',
      },
    ],
  },
  legal: {
    name: 'Legal & Admin',
    items: [
      {
        name: 'Business Registration',
        cost: 500,
        isEssential: true,
        isNeeded: true,
        description: 'LLC formation and permits',
      },
      {
        name: 'Accounting Software',
        cost: 30,
        isEssential: true,
        isMonthly: true,
        isNeeded: true,
        description: 'Financial tracking and reporting',
      },
      {
        name: 'Legal Consultation',
        cost: 1000,
        isEssential: true,
        isNeeded: true,
        description: 'Initial legal setup and consultation',
      },
    ],
  },
}

const initialRevenue = {
  services: {
    name: 'Services',
    items: [
      {
        name: 'Web Development',
        price: 100,
        unit: 'per hour',
        estimated: 80, // hours per month
        isMonthly: true,
        description: 'Custom web development services',
      },
      {
        name: 'Music Production',
        price: 500,
        unit: 'per project',
        estimated: 4, // projects per month
        isMonthly: true,
        description: 'Music production and mixing services',
      },
      {
        name: 'Technical Consulting',
        price: 150,
        unit: 'per hour',
        estimated: 20, // hours per month
        isMonthly: true,
        description: 'Technical architecture and consulting',
      },
    ],
  },
  products: {
    name: 'Products',
    items: [
      {
        name: 'Farm Produce',
        price: 25,
        unit: 'per box',
        estimated: 40, // boxes per month
        isMonthly: true,
        description: 'Weekly vegetable and herb boxes',
      },
      {
        name: 'Vinyl Records',
        price: 35,
        unit: 'per unit',
        estimated: 30, // units per month
        isMonthly: true,
        description: 'Physical music releases',
      },
      {
        name: 'Digital Downloads',
        price: 10,
        unit: 'per album',
        estimated: 50, // downloads per month
        isMonthly: true,
        description: 'Digital music releases',
      },
    ],
  },
}

const ProjectCostCalculator = () => {
  const [showCosts, setShowCosts] = useState(false)
  const [showRevenue, setShowRevenue] = useState(false)
  const [showRevenueForm, setShowRevenueForm] = useState(false)
  const [categories, setCategories] = useState(initialCategories)
  const [revenue, setRevenue] = useState(initialRevenue)
  const [newRevenue, setNewRevenue] = useState({
    category: '',
    name: '',
    price: '',
    unit: '',
    estimated: '',
    description: '',
    isMonthly: true,
  })
  const [showCostForm, setShowCostForm] = useState(false)
  const [newCost, setNewCost] = useState({
    category: '',
    name: '',
    cost: '',
    description: '',
    isEssential: false,
    isMonthly: false,
    isAsset: false,
    isNeeded: true,
    link: '',
  })

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

    Object.values(initialRevenue).forEach((category) => {
      category.items.forEach((item) => {
        const monthlyAmount = item.price * item.estimated
        monthlyRevenue += monthlyAmount
        annualRevenue += monthlyAmount * 12
      })
    })

    return {
      monthly: monthlyRevenue,
      annual: annualRevenue,
      projectedProfit: {
        monthly: monthlyRevenue - totals.monthly.needed,
        annual:
          monthlyRevenue * 12 -
          totals.monthly.needed * 12 -
          totals.oneTime.needed,
      },
    }
  }

  const totals = calculateTotalCost()
  const revenueData = calculateRevenue()

  const handleAddRevenue = (e) => {
    e.preventDefault()
    if (!newRevenue.category || !newRevenue.name || !newRevenue.price) return

    setRevenue((prev) => ({
      ...prev,
      [newRevenue.category]: {
        ...prev[newRevenue.category],
        items: [
          ...prev[newRevenue.category].items,
          {
            name: newRevenue.name,
            price: Number(newRevenue.price),
            unit: newRevenue.unit,
            estimated: Number(newRevenue.estimated),
            isMonthly: newRevenue.isMonthly,
            description: newRevenue.description,
          },
        ],
      },
    }))

    setNewRevenue({
      category: '',
      name: '',
      price: '',
      unit: '',
      estimated: '',
      description: '',
      isMonthly: true,
    })
    setShowRevenueForm(false)
  }

  const handleAddCost = (e) => {
    e.preventDefault()
    if (!newCost.category || !newCost.name || !newCost.cost) return

    setCategories((prev) => ({
      ...prev,
      [newCost.category]: {
        ...prev[newCost.category],
        items: [
          ...prev[newCost.category].items,
          {
            name: newCost.name,
            cost: Number(newCost.cost),
            isEssential: newCost.isEssential,
            isMonthly: newCost.isMonthly,
            isAsset: newCost.isAsset,
            isNeeded: newCost.isNeeded,
            link: newCost.link,
            description: newCost.description,
          },
        ],
      },
    }))

    setNewCost({
      category: '',
      name: '',
      cost: '',
      description: '',
      isEssential: false,
      isMonthly: false,
      isAsset: false,
      isNeeded: true,
      link: '',
    })
    setShowCostForm(false)
  }

  const handleDeleteCostItem = (categoryId, index) => {
    setCategories((prev) => ({
      ...prev,
      [categoryId]: {
        ...prev[categoryId],
        items: prev[categoryId].items.filter((_, i) => i !== index),
      },
    }))
  }

  const handleEditCostItem = (categoryId, index, item) => {
    setNewCost({ ...item, category: categoryId })
    setShowCostForm(true)
    // Optional: Add editing mode state and item index for updating instead of adding
  }

  const handleDeleteRevenueItem = (categoryId, index) => {
    setRevenue((prev) => ({
      ...prev,
      [categoryId]: {
        ...prev[categoryId],
        items: prev[categoryId].items.filter((_, i) => i !== index),
      },
    }))
  }

  const handleEditRevenueItem = (categoryId, index, item) => {
    setNewRevenue({ ...item, category: categoryId })
    setShowRevenueForm(true)
    // Optional: Add editing mode state and item index for updating instead of adding
  }

  const ModalForm = ({
    type,
    show,
    onClose,
    onSubmit,
    formData,
    setFormData,
    categories,
  }) => {
    if (!show) return null

    const isCostForm = type === 'cost'

    return (
      <div className="modal-form-overlay" onClick={(e) => e.stopPropagation()}>
        <div className="modal-form">
          <h3>Add {isCostForm ? 'Cost Item' : 'Revenue Stream'}</h3>
          <form onSubmit={onSubmit}>
            <div className="form-grid">
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    category: e.target.value,
                  })
                }
                required
              >
                <option value="">Select Category</option>
                {Object.keys(categories).map((categoryId) => (
                  <option key={categoryId} value={categoryId}>
                    {categories[categoryId].name}
                  </option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />

              <input
                type="number"
                placeholder={isCostForm ? 'Cost' : 'Price'}
                value={isCostForm ? formData.cost : formData.price}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    [isCostForm ? 'cost' : 'price']: e.target.value,
                  })
                }
                required
              />

              {!isCostForm && (
                <>
                  <input
                    type="text"
                    placeholder="Unit (e.g., per hour, per unit)"
                    value={formData.unit}
                    onChange={(e) =>
                      setFormData({ ...formData, unit: e.target.value })
                    }
                    required
                  />

                  <input
                    type="number"
                    placeholder="Estimated Monthly Units"
                    value={formData.estimated}
                    onChange={(e) =>
                      setFormData({ ...formData, estimated: e.target.value })
                    }
                    required
                  />
                </>
              )}

              {isCostForm && (
                <>
                  <input
                    type="text"
                    placeholder="Link (optional)"
                    value={formData.link}
                    onChange={(e) =>
                      setFormData({ ...formData, link: e.target.value })
                    }
                  />
                  <div className="checkbox-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={formData.isEssential}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            isEssential: e.target.checked,
                          })
                        }
                      />
                      Essential
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        checked={formData.isMonthly}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            isMonthly: e.target.checked,
                          })
                        }
                      />
                      Monthly
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        checked={formData.isAsset}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            isAsset: e.target.checked,
                          })
                        }
                      />
                      Asset
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        checked={formData.isNeeded}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            isNeeded: e.target.checked,
                          })
                        }
                      />
                      Need
                    </label>
                  </div>
                </>
              )}

              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />

              <div className="form-actions">
                <button type="button" onClick={onClose}>
                  Cancel
                </button>
                <button type="submit">
                  Add {isCostForm ? 'Cost Item' : 'Revenue Stream'}
                </button>
              </div>
            </div>
          </form>
        </div>
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
            showCostForm={showCostForm}
            setShowCostForm={setShowCostForm}
            onDeleteItem={handleDeleteCostItem}
            onEditItem={handleEditCostItem}
          />
        )}

        <ModalForm
          type="cost"
          show={showCostForm}
          onClose={() => setShowCostForm(false)}
          onSubmit={handleAddCost}
          formData={newCost}
          setFormData={setNewCost}
          categories={categories}
        />
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
            showRevenueForm={showRevenueForm}
            setShowRevenueForm={setShowRevenueForm}
            onDeleteItem={handleDeleteRevenueItem}
            onEditItem={handleEditRevenueItem}
          />
        )}

        <ModalForm
          type="revenue"
          show={showRevenueForm}
          onClose={() => setShowRevenueForm(false)}
          onSubmit={handleAddRevenue}
          formData={newRevenue}
          setFormData={setNewRevenue}
          categories={revenue}
        />
      </div>
    </div>
  )
}

export default ProjectCostCalculator
