import React, { useEffect, useState } from 'react'
import './TechStack.css'

const TechStack = ({ isAnimating, selectedTech, onTechSelect }) => {
  const [shuffledTech, setShuffledTech] = useState([
    'JS',
    'TS',
    'GRAPHQL',
    'SOLIDITY',
    'NODE',
    'MOBILE',
    'WEB',
    null,
    null,
  ])

  const shuffleArray = () => {
    const techCopy = [...shuffledTech]
    for (let i = techCopy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[techCopy[i], techCopy[j]] = [techCopy[j], techCopy[i]]
    }
    setShuffledTech(techCopy)
  }

  return (
    <div className={`tech-stack ${isAnimating ? 'animating' : ''}`}>
      {shuffledTech.map((tech, index) => (
        <div
          key={tech || `empty-${index}`}
          className={`grid-item animate-bounce ${
            tech ? 'tech-item' : 'empty-item'
          }`}
          onClick={() => {
            shuffleArray()
            if (!tech) {
              onTechSelect(null)
            } else {
              onTechSelect(tech)
            }
          }}
        >
          {tech}
        </div>
      ))}
    </div>
  )
}

export default TechStack
