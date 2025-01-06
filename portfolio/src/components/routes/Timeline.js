import React from 'react'
import ContributionGrid from '../random/ContributionGrid'
import './Routes.css'

const Timeline = () => {
  return (
    <div className="route-page">
      <div className="timeline-header">
        <h2>5 Year Progress</h2>
        <p>Track daily contributions and milestones towards our goals</p>
      </div>

      <ContributionGrid />

      <div className="timeline">
        <div className="timeline-item">
          <div className="timeline-date">2025</div>
          <div className="timeline-content">
            <h3>Foundation</h3>
            <p>Launch of core platforms and initial farming initiatives</p>
          </div>
        </div>
        <div className="timeline-item">
          <div className="timeline-date">2026</div>
          <div className="timeline-content">
            <h3>Process Development</h3>
            <p>Documentation and refinement of farming methodologies</p>
          </div>
        </div>
        <div className="timeline-item">
          <div className="timeline-date">2027</div>
          <div className="timeline-content">
            <h3>Network Growth</h3>
            <p>Expansion of collaborative farming network</p>
          </div>
        </div>
        <div className="timeline-item">
          <div className="timeline-date">2028</div>
          <div className="timeline-content">
            <h3>Culture Building</h3>
            <p>Establishment of self-sufficiency framework</p>
          </div>
        </div>
        <div className="timeline-item">
          <div className="timeline-date">2029</div>
          <div className="timeline-content">
            <h3>Full Implementation</h3>
            <p>Complete rollout of "Made in America" initiative</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Timeline
