import React, { useState } from 'react'
import './ContributionGrid.css'

const ContributionGrid = () => {
  const initializeEmptyData = () => {
    const data = {}
    const startDate = new Date(2024, 0, 1)
    const endDate = new Date(2029, 11, 31)
    let currentDate = new Date(startDate)

    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split('T')[0]
      data[dateStr] = {
        severity: 0,
        description: '',
      }
      currentDate.setDate(currentDate.getDate() + 1)
    }
    return data
  }

  const [contributions, setContributions] = useState(initializeEmptyData())
  const [selectedDate, setSelectedDate] = useState(null)
  const [formData, setFormData] = useState({
    severity: 0,
    description: '',
  })

  const getContributionLevel = (severity) => {
    if (severity === 0) return 'none'
    if (severity === 1) return 'low'
    if (severity === 2) return 'medium'
    if (severity === 3) return 'high'
    return 'very-high'
  }

  const handleSquareClick = (date) => {
    setSelectedDate(date)
    setFormData(contributions[date] || { severity: 0, description: '' })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!selectedDate) return

    setContributions((prev) => ({
      ...prev,
      [selectedDate]: {
        ...formData,
        severity: parseInt(formData.severity),
      },
    }))

    setSelectedDate(null)
    setFormData({ severity: 0, description: '' })
  }

  const handleCancel = () => {
    setSelectedDate(null)
    setFormData({ severity: 0, description: '' })
  }

  const renderGrid = () => {
    const years = []
    for (let year = 2024; year <= 2029; year++) {
      const months = []
      for (let month = 0; month < 12; month++) {
        const days = []
        const daysInMonth = new Date(year, month + 1, 0).getDate()

        for (let day = 1; day <= daysInMonth; day++) {
          const date = new Date(year, month, day)
          const dateStr = date.toISOString().split('T')[0]
          const data = contributions[dateStr] || { severity: 0 }

          days.push(
            <div
              key={dateStr}
              className={`contribution-square ${getContributionLevel(
                data.severity,
              )}`}
              onClick={() => handleSquareClick(dateStr)}
              title={`${dateStr}: ${data.description || 'No contribution'}`}
            />,
          )
        }

        months.push(
          <div key={`${year}-${month}`} className="month-grid">
            {days}
          </div>,
        )
      }

      years.push(
        <div key={year} className="year-grid">
          {months}
        </div>,
      )
    }
    return years
  }

  return (
    <div className="contribution-container">
      <div className="contributions-wrapper">{renderGrid()}</div>
      <div className="contribution-legend">
        <span>Less</span>
        <div className="legend-squares">
          <div className="contribution-square none" />
          <div className="contribution-square low" />
          <div className="contribution-square medium" />
          <div className="contribution-square high" />
          <div className="contribution-square very-high" />
        </div>
        <span>More</span>
      </div>

      {selectedDate && (
        <div className="contribution-modal">
          <div className="modal-content">
            <h3>Add Contribution for {selectedDate}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Severity:</label>
                <select
                  value={formData.severity}
                  onChange={(e) =>
                    setFormData({ ...formData, severity: e.target.value })
                  }
                >
                  <option value="0">None</option>
                  <option value="1">Low</option>
                  <option value="2">Medium</option>
                  <option value="3">High</option>
                  <option value="4">Very High</option>
                </select>
              </div>
              <div className="form-group">
                <label>Description:</label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="What did you accomplish?"
                  rows="4"
                />
              </div>
              <div className="form-actions">
                <button type="button" onClick={handleCancel}>
                  Cancel
                </button>
                <button type="submit">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ContributionGrid
