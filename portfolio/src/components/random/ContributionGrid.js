import React, { useState, useEffect } from 'react'
import './ContributionGrid.css'

const ContributionGrid = () => {
  const [contributions, setContributions] = useState({})
  const [selectedDate, setSelectedDate] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch contributions from the API
  useEffect(() => {
    const fetchContributions = async () => {
      try {
        const response = await fetch('/api/contributions', {
          credentials: 'include',
        })

        console.log('Raw response:', response)

        if (!response.ok) {
          throw new Error(
            `Failed to fetch contributions: ${response.status} ${response.statusText}`,
          )
        }

        const data = await response.json()

        // Add check for empty data
        if (!data || data.length === 0) {
          setError('No contribution data available')
          return
        }

        // Convert array to object with dates as keys
        const contributionsMap = {}
        data.forEach((contribution) => {
          contributionsMap[contribution.date] = {
            severity: contribution.severity,
            description: contribution.description,
          }
        })

        setContributions(contributionsMap)
      } catch (err) {
        console.error('Fetch error:', err)
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchContributions()
  }, [])

  const getContributionLevel = (severity) => {
    if (severity === 0) return 'none'
    if (severity === 1) return 'low'
    if (severity === 2) return 'medium'
    if (severity === 3) return 'high'
    return 'very-high'
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

  const handleSquareClick = (date) => {
    setSelectedDate(date)
  }

  const handleCancel = () => {
    setSelectedDate(null)
  }

  if (isLoading) {
    return <div className="loading">Loading contributions...</div>
  }

  if (error) {
    return <div className="error">Error: {error}</div>
  }

  return (
    <div className="contribution-container">
      {Object.keys(contributions).length === 0 && !isLoading && !error ? (
        <div className="no-data">No contribution data available</div>
      ) : (
        <>
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
        </>
      )}

      {selectedDate && contributions[selectedDate] && (
        <div className="contribution-modal">
          <div className="modal-content">
            <h3>Contribution for {selectedDate}</h3>
            <div className="contribution-details">
              <p>
                <strong>Severity:</strong>{' '}
                {getContributionLevel(contributions[selectedDate].severity)}
              </p>
              <p>
                <strong>Description:</strong>{' '}
                {contributions[selectedDate].description ||
                  'No description provided'}
              </p>
            </div>
            <div className="form-actions">
              <button type="button" onClick={handleCancel}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ContributionGrid
