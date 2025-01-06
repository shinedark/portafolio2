import React, { useState, useEffect } from 'react'
import './PrototypeShowcase.css'
import t1 from '../../pictures/t1.jpg'
import t2 from '../../pictures/t2.png'
import t3 from '../../pictures/t3.jpg'
import t4 from '../../pictures/t4.jpg'
const prototypes = [
  {
    id: 1,
    title: 'Project Prototype',
    image: t1,
  },
  {
    id: 2,
    title: 'Project Prototype',
    image: t2,
  },
  {
    id: 3,
    title: 'Project Prototype',
    image: t3,
  },
  {
    id: 4,
    title: 'Project Prototype',
    image: t4,
  },
]

const PrototypeShowcase = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    let interval
    if (isAutoPlaying) {
      interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % prototypes.length)
      }, 5000)
    }
    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const handlePrevious = () => {
    setIsAutoPlaying(false)
    setCurrentIndex((prev) => (prev === 0 ? prototypes.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setIsAutoPlaying(false)
    setCurrentIndex((prev) => (prev + 1) % prototypes.length)
  }

  const handleDotClick = (index) => {
    setIsAutoPlaying(false)
    setCurrentIndex(index)
  }

  return (
    <div className="prototype-showcase">
      <div className="showcase-container">
        <div className="showcase-content">
          <img
            src={prototypes[currentIndex].image}
            alt={prototypes[currentIndex].title}
            className="showcase-image"
          />
          <div className="showcase-info">
            <h2>{prototypes[currentIndex].title}</h2>
            <p>{prototypes[currentIndex].description}</p>
          </div>
        </div>
        <div className="showcase-controls">
          <button onClick={handlePrevious}>&lt;</button>
          <div className="showcase-dots">
            {prototypes.map((_, index) => (
              <button
                key={index}
                className={`dot ${index === currentIndex ? 'active' : ''}`}
                onClick={() => handleDotClick(index)}
              />
            ))}
          </div>
          <button onClick={handleNext}>&gt;</button>
        </div>
      </div>
    </div>
  )
}

export default PrototypeShowcase
