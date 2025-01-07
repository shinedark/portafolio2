import React, { useState, useEffect } from 'react'
import './Interest.css'

const Interest = () => {
  const paragraphs = [
    'Learning: Cyfrin Updraft courses, Eigen Layer, and AI.',
    'Hobbies: Cooking, Golf, Music, and Futbol.',
    'The Vision is large, Attitude the steering wheel, and discipline the fuel.',
  ]

  const [typedParagraphs, setTypedParagraphs] = useState(
    paragraphs.map(() => ''),
  )
  const [isTypingComplete, setIsTypingComplete] = useState(false)

  useEffect(() => {
    const timeoutIds = []
    let currentIndexes = paragraphs.map(() => 0)
    let isActive = true // For cleanup

    const delay = (ms) =>
      new Promise((resolve) => {
        const timeoutId = window.setTimeout(resolve, ms)
        timeoutIds.push(timeoutId)
        return () => window.clearTimeout(timeoutId)
      })

    const typeNextCharacter = async () => {
      while (isActive) {
        let allCompleted = true

        const newTypedParagraphs = typedParagraphs.map((typed, index) => {
          if (currentIndexes[index] < paragraphs[index].length) {
            allCompleted = false
            currentIndexes[index]++
            return paragraphs[index].slice(0, currentIndexes[index])
          }
          return typed
        })

        if (!isActive) return // Check if component is still mounted

        setTypedParagraphs(newTypedParagraphs)

        if (!allCompleted) {
          await delay(50)
        } else {
          setIsTypingComplete(true)
          break
        }
      }
    }

    typeNextCharacter()

    // Cleanup function
    return () => {
      isActive = false
      timeoutIds.forEach((id) => window.clearTimeout(id))
    }
  }, [])

  return (
    <div className="interest-section">
      <h2>Interests</h2>
      <div className="interest-grid">
        {paragraphs.map((paragraph, index) => (
          <div key={index} className="interest-item">
            <p>{isTypingComplete ? paragraph : typedParagraphs[index]}</p>
            {!isTypingComplete && <span className="cursor">|</span>}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Interest
