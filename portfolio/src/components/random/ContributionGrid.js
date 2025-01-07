import React, { useState, useEffect } from 'react'
import './ContributionGrid.css'

const ContributionGrid = () => {
  const [contributions, setContributions] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)

  useEffect(() => {
    const fetchContributions = async () => {
      try {
        setIsLoading(true)
        setError(null)

        console.log('Fetching contributions...')

        // Use the correct port for development
        const API_URL =
          process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : ''

        const response = await fetch(`${API_URL}/api/contributions`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          // Since this is a public endpoint, we don't need credentials
        })

        console.log('Raw response:', response)

        if (!response.ok) {
          throw new Error(`Failed to fetch contributions: ${response.status}`)
        }

        const data = await response.json()
        console.log('Contribution data:', data)

        // Transform the data
        const contributionsMap = {}
        if (data && data.length > 0) {
          data.forEach((contribution) => {
            contributionsMap[contribution.date] = {
              severity: contribution.commits.length,
              description: contribution.commits
                .map((commit) => `${commit.type}: ${commit.message}`)
                .join('\n'),
            }
          })
        }

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
    for (let year = 2025; year <= 2029; year++) {
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

  return (
    <div className="contribution-container">
      {error && <div className="error-message">{error}</div>}

      {Object.keys(contributions).length === 0 ? (
        <div className="no-data">No contributions yet. Start contributing!</div>
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
