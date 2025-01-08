import React, { useState, useEffect } from 'react'
import './ContributionGrid.css'

const ContributionGrid = () => {
  const [contributions, setContributions] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)
  const START_DATE = new Date('2025-01-06')

  useEffect(() => {
    const fetchContributions = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const API_URL =
          process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : ''

        const response = await fetch(`${API_URL}/api/contributions`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch contributions: ${response.status}`)
        }

        const data = await response.json()
        const contributionsMap = {}

        // Group contributions by date and count them
        if (data && data.length > 0) {
          data.forEach((contribution) => {
            const date = contribution.date.split('T')[0]
            if (!contributionsMap[date]) {
              contributionsMap[date] = {
                count: 1,
                contributions: [contribution],
              }
            } else {
              contributionsMap[date].count++
              contributionsMap[date].contributions.push(contribution)
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

  const getIntensityLevel = (count) => {
    if (!count) return 0
    if (count >= 5) return 5
    return count
  }

  const renderGrid = () => {
    const today = new Date()
    const years = []
    const END_DATE = new Date('2030-01-06')

    for (
      let year = START_DATE.getFullYear();
      year <= END_DATE.getFullYear();
      year++
    ) {
      const months = []
      const startMonth =
        year === START_DATE.getFullYear() ? START_DATE.getMonth() : 0
      const endMonth =
        year === END_DATE.getFullYear() ? END_DATE.getMonth() : 11

      for (let month = startMonth; month <= endMonth; month++) {
        const days = []
        const daysInMonth = new Date(year, month + 1, 0).getDate()
        const startDay =
          year === START_DATE.getFullYear() && month === START_DATE.getMonth()
            ? START_DATE.getDate()
            : 1

        for (let day = startDay; day <= daysInMonth; day++) {
          const date = new Date(year, month, day)
          const dateStr = date.toISOString().split('T')[0]
          const isFuture = date > today
          const isPast = date < START_DATE
          const data = contributions[dateStr]

          let squareClass = 'contribution-square '
          if (isFuture || isPast) {
            squareClass += 'future'
          } else {
            squareClass += `level-${getIntensityLevel(data?.count)}`
          }

          const title = data
            ? `${dateStr}: ${data.count} contribution${
                data.count > 1 ? 's' : ''
              }`
            : isFuture
            ? 'Future date'
            : 'No contributions'

          days.push(
            <div
              key={dateStr}
              className={squareClass}
              onClick={() =>
                !isFuture && !isPast && data && handleSquareClick(dateStr)
              }
              title={title}
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
    if (contributions[date]) {
      setSelectedDate(date)
    }
  }

  const handleCancel = () => {
    setSelectedDate(null)
  }

  if (isLoading) {
    return <div className="loading">Loading contributions...</div>
  }

  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className="contribution-container">
      <div className="contributions-wrapper">{renderGrid()}</div>

      <div className="contribution-legend">
        <span>Less</span>
        <div className="legend-squares">
          <div
            className="contribution-square level-0"
            title="No contributions"
          />
          <div className="contribution-square level-1" title="1 contribution" />
          <div
            className="contribution-square level-2"
            title="2 contributions"
          />
          <div
            className="contribution-square level-3"
            title="3 contributions"
          />
          <div
            className="contribution-square level-4"
            title="4 contributions"
          />
          <div
            className="contribution-square level-5"
            title="5+ contributions"
          />
        </div>
        <span>More</span>
      </div>

      {selectedDate && contributions[selectedDate] && (
        <div className="contribution-modal" onClick={handleCancel}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>
              {formatDate(selectedDate)} - {contributions[selectedDate].count}{' '}
              contribution(s)
            </h3>
            <div className="contribution-details">
              {contributions[selectedDate].contributions.map(
                (contribution, index) => (
                  <div key={index} style={{ marginBottom: '15px' }}>
                    <p>
                      <strong>Type:</strong> {contribution.type}
                    </p>
                    <p>
                      <strong>Title:</strong> {contribution.title}
                    </p>
                    <p>
                      <strong>Content:</strong> {contribution.content}
                    </p>
                  </div>
                ),
              )}
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
