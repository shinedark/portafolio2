import React from 'react'
import ProjectCostCalculator from '../calculators/ProjectCostCalculator'
import './Routes.css'

const BusinessPlan = () => {
  return (
    <div className="route-page">
      <div className="route-section">
        <h3>Mission</h3>
        <p>
          Using technology and ingenuity, we are creating and developing a
          replicable process to create a new culture for America's modern
          farmer. Showing how self-sufficiency and collaboration can revamp
          America's production of goods.
        </p>
      </div>

      <div className="route-section">
        <h3>Goals</h3>
        <ul>
          <li>Develop sustainable farming practices</li>
          <li>Create collaborative production networks</li>
          <li>Document and share processes</li>
          <li>Build "Made in America" framework</li>
          <li>Foster self-sufficiency culture</li>
        </ul>
      </div>
      <ProjectCostCalculator />
    </div>
  )
}

export default BusinessPlan
