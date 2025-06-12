import React from 'react'
import ProjectCostCalculator from '../calculators/ProjectCostCalculator'
import './Routes.css'

const BusinessPlan = () => {
  return (
    <div className="route-page">
      <div className="route-section">
        <h3>Business Plan for Shine Dark</h3>
      </div>

      {/* <ProjectCostCalculator /> */}
      <div className="route-section">
        <h3>Company Description</h3>
        <ul>
          <li>
            Type: Content Creator and Artist focusing on health journey documentation,
            music production, and personal transformation.
          </li>
          <li>
            Focus: Creating multi-platform content that documents the recovery journey,
            combining music, fitness, and personal development.
          </li>
          <li>
            Unique Selling Proposition: Authentic documentation of health recovery
            journey through various creative mediums including music, live performances,
            and documentary content.
          </li>
        </ul>
      </div>

      <div className="route-section">
        <h3>Mission</h3>
        <p>
          Shine Dark is committed to documenting and sharing a transformative health
          journey, inspiring others through the intersection of music, physical recovery,
          and personal growth while creating awareness about health conditions and their solutions.
        </p>
      </div>

      <div className="route-section">
        <h3>Operational Plan</h3>
        <ul>
          <li>
            Content Creation: Regular documentation of recovery process through workout sessions,
            music creation, and treatment progress.
          </li>
          <li>
            Performance & Streaming: Live performances showcasing the recovery journey,
            combined with regular streaming sessions for community engagement.
          </li>
          <li>
            Documentary Production: Filming and producing a comprehensive documentary
            that captures the full scope of the health journey, challenges, and solutions.
          </li>
        </ul>
      </div>

      <div className="route-section">
        <h3>Financial Plan</h3>
        <ul>
          <li>
            Revenue Streams: Social media monetization, streaming revenue, music releases,
            documentary distribution, live performance tickets, and potential sponsorships
            from health and fitness brands.
          </li>
          <li>
            Cost Structure: Production equipment, documentary filming and editing,
            marketing expenses, medical treatment documentation, and performance venue costs.
          </li>
          <li>
            Funding: Initial self-funding, potential crowdfunding for documentary production,
            and seeking partnerships with health awareness organizations.
          </li>
        </ul>
      </div>

      <div className="route-section">
        <h3>Future Outlook</h3>
        <p>
          Shine Dark aims to create a powerful narrative that combines personal health journey
          with artistic expression. Through documentary storytelling, live performances, and
          consistent content creation, we seek to inspire others facing similar challenges
          while building a sustainable platform for artistic and personal growth. The project
          will serve as both a personal documentation and a resource for others, showcasing
          how art and health recovery can intertwine to create meaningful impact.
        </p>
      </div>
    </div>
  )
}

export default BusinessPlan
