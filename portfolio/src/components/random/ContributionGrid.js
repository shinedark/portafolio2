import React, { useState, useEffect } from 'react'
import './ContributionGrid.css'

const ContributionGrid = () => {
  const [commitData, setCommitData] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(null)
  const START_DATE = new Date('2025-01-06')

  useEffect(() => {
    const fetchCommitHistory = async () => {
      try {
        setIsLoading(true)
        const username = 'shinedark'
        let allCommits = []
        let page = 1

        // Keep fetching until we get all commits
        while (true) {
          const response = await fetch(
            `https://api.github.com/search/commits?q=author:${username}+author-date:>=${START_DATE.toISOString()}&page=${page}&per_page=100`,
            {
              headers: {
                Authorization: `token ${process.env.REACT_APP_GITHUB_TOKEN}`,
                Accept: 'application/vnd.github.cloak-preview+json',
              },
            },
          )

          if (!response.ok) {
            throw new Error('Failed to fetch commit history')
          }

          const { items: commits, total_count } = await response.json()
          if (!commits || commits.length === 0) break

          allCommits = [...allCommits, ...commits]
          if (allCommits.length >= total_count) break
          page++
        }

        const commitMap = {}
        allCommits.forEach((item) => {
          const date = item.commit.author.date.split('T')[0]
          const repoName = item.repository.name

          if (!commitMap[date]) {
            commitMap[date] = {
              count: 1,
              messages: [`[${repoName}] ${item.commit.message}`],
            }
          } else {
            commitMap[date].count++
            commitMap[date].messages.push(
              `[${repoName}] ${item.commit.message}`,
            )
          }
        })

        setCommitData(commitMap)
      } catch (err) {
        console.error('Error fetching commit history:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCommitHistory()
  }, [])

  const getIntensityLevel = (count) => {
    if (!count) return 0
    if (count >= 5) return 5
    return count
  }

  const handleSquareClick = (date, data) => {
    if (data) {
      setSelectedDate({ date, data })
    }
  }

  const handleCloseModal = () => {
    setSelectedDate(null)
  }

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const renderGrid = () => {
    const today = new Date()
    const squares = []
    const END_DATE = new Date('2030-01-06')
    let index = 0
    for (
      let date = new Date(START_DATE);
      date <= END_DATE;
      date.setDate(date.getDate() + 1)
    ) {
      const dateStr = date.toISOString().split('T')[0]
      const isFuture = date > today
      const data = commitData[dateStr]
      index++
      let squareClass = 'contribution-square '
      if (isFuture) {
        squareClass += 'future'
      } else {
        squareClass += `level-${getIntensityLevel(data?.count)}`
      }

      squares.push(
        <div
          key={index}
          className={squareClass}
          onClick={() => !isFuture && handleSquareClick(dateStr, data)}
          title={data ? `${data.count} commits on ${dateStr}` : 'No commits'}
        />,
      )
    }

    return squares
  }

  if (isLoading) {
    return <div className="loading">Loading commit history...</div>
  }

  return (
    <div className="contribution-container">
      <div className="contributions-wrapper">
        <div className="contribution-grid">{renderGrid()}</div>
      </div>

      <div className="contribution-legend">
        <span>Less</span>
        <div className="legend-squares">
          <div className="contribution-square level-0" title="No commits" />
          <div className="contribution-square level-1" title="1 commit" />
          <div className="contribution-square level-2" title="2 commits" />
          <div className="contribution-square level-3" title="3 commits" />
          <div className="contribution-square level-4" title="4 commits" />
          <div className="contribution-square level-5" title="5+ commits" />
        </div>
        <span>More</span>
      </div>

      {selectedDate && (
        <div className="contribution-modal" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">{formatDate(selectedDate.date)}</div>
            <div className="modal-body">
              <p>
                <strong>
                  {selectedDate.data.count} commit
                  {selectedDate.data.count > 1 ? 's' : ''}
                </strong>
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '10px 0' }}>
                {selectedDate.data.messages.map((message, index) => (
                  <li
                    key={index}
                    style={{
                      marginBottom: '8px',
                      paddingLeft: '10px',
                      borderLeft: '2px solid #000',
                    }}
                  >
                    {message}
                  </li>
                ))}
              </ul>
            </div>
            <div className="modal-footer">
              <button className="modal-close-button" onClick={handleCloseModal}>
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
