import React from 'react'
import './Routes.css'

const Invest = () => {
  return (
    <div className="route-page">
      <div className="route-section">
        <h3>Why Support Us</h3>
        <p>
          Shine Dark's vision was born from a deeply personal journey shaped by
          health challenges. Through finding balance and resilience, we
          discovered the transformative power of self-awareness, creativity, and
          innovation.
        </p>
      </div>
      <div className="route-section">
        <h3>Impact Areas</h3>
        <ul>
          <li>Sustainable Farming Innovation</li>
          <li>Artist Empowerment</li>
          <li>Technology Integration</li>
          <li>Community Building</li>
          <li>Cultural Transformation</li>
        </ul>
      </div>
      <div className="route-section">
        <h3>Get Involved</h3>
        <p>
          Join us in our mission to redefine what's possible at the intersection
          of technology, art, and sustainable living. For collaboration and
          investment opportunities, reach out at{' '}
          <a href="mailto:shinedarkmusic@gmail.com">shinedarkmusic@gmail.com</a>
        </p>
      </div>
    </div>
  )
}

export default Invest
