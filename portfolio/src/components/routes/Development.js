import React from 'react'
import './Routes.css'

const Development = () => {
  return (
    <div className="route-page">
      <div className="route-section">
        <h3>Our Approach</h3>
        <p>
          Born from personal health challenges and a journey of self-discovery,
          our development process focuses on creating sustainable,
          transformative solutions that combine technology with human-centered
          design.
        </p>
      </div>
      <div className="route-section">
        <h3>Core Technologies</h3>
        <div className="tech-grid">
          <div className="tech-category">
            <h4>Digital Platforms</h4>
            <ul>
              <li>Web3 Integration</li>
              <li>Decentralized Systems</li>
              <li>Community Tools</li>
            </ul>
          </div>
          <div className="tech-category">
            <h4>Farming Tech</h4>
            <ul>
              <li>Sustainable Systems</li>
              <li>Process Automation</li>
              <li>Resource Management</li>
            </ul>
          </div>
          <div className="tech-category">
            <h4>Creative Tools</h4>
            <ul>
              <li>Digital Art Platforms</li>
              <li>Music Production</li>
              <li>Content Creation</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Development
