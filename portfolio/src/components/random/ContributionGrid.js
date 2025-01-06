import React, { useState, useEffect } from 'react'
import './ContributionGrid.css'

// Add mock data
const MOCK_DATA = {
  data: [
    {
      date: '2024-03-01',
      commits: [
        { type: 'code', message: 'Implemented user authentication' },
        { type: 'test', message: 'Added tests for auth flow' },
      ],
    },
    {
      date: '2024-03-02',
      commits: [{ type: 'code', message: 'Fixed navigation bug' }],
    },
    {
      date: '2024-03-05',
      commits: [
        { type: 'design', message: 'Updated button styles' },
        { type: 'code', message: 'Implemented new header' },
        { type: 'docs', message: 'Updated README' },
      ],
    },
    // Add more mock data as needed
  ],
  pagination: {
    total: 3,
    page: 1,
    pages: 1,
    hasMore: false,
  },
}

const ContributionGrid = () => {
  const [contributions, setContributions] = useState({})
  const [pagination, setPagination] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedDate, setSelectedDate] = useState(null)

  // Add caching with localStorage
  const CACHE_KEY = 'contributionGridData'
  const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

  const getCachedData = () => {
    const cached = localStorage.getItem(CACHE_KEY)
    if (cached) {
      const { data, timestamp } = JSON.parse(cached)
      if (Date.now() - timestamp < CACHE_DURATION) {
        return data
      }
    }
    return null
  }

  const setCachedData = (data) => {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({
        data,
        timestamp: Date.now(),
      }),
    )
  }

  useEffect(() => {
    const fetchContributions = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Use mock data instead of API call
        const { data, pagination } = MOCK_DATA

        if (!data || data.length === 0) {
          setError('No contribution data available')
          return
        }

        // Transform the mock data
        const contributionsMap = {}
        data.forEach((contribution) => {
          contributionsMap[contribution.date] = {
            severity: contribution.commits.length,
            description: contribution.commits
              .map((commit) => `${commit.type}: ${commit.message}`)
              .join('\n'),
          }
        })

        setContributions(contributionsMap)
        setPagination(pagination)
      } catch (err) {
        console.error('Fetch error:', err)
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchContributions()
  }, [currentPage])

  // Add load more function
  const handleLoadMore = () => {
    if (pagination && pagination.hasMore) {
      setCurrentPage((prev) => prev + 1)
    }
  }

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

  if (error) {
    return <div className="error">Error: {error}</div>
  }

  return (
    <div className="contribution-container">
      {error && <div className="error-message">{error}</div>}

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

          {pagination && pagination.hasMore && (
            <button
              onClick={handleLoadMore}
              disabled={isLoading}
              className="load-more-button"
            >
              {isLoading ? 'Loading...' : 'Load More'}
            </button>
          )}
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
