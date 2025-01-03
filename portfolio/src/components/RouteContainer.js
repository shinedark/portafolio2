import React from 'react'
import ProjectNavigation from './ProjectNavigation'
import './RouteContainer.css'

const RouteContainer = ({ activeRoute, onRouteChange, children }) => {
  return (
    <div className="route-container">
      <ProjectNavigation
        activeRoute={activeRoute}
        onRouteChange={onRouteChange}
      />
      <div className="route-content">
        <div className="route-header">
          <h2>
            {activeRoute.charAt(0).toUpperCase() +
              activeRoute.slice(1).replace('-', ' ')}
          </h2>
        </div>
        <div className="route-body">{children}</div>
      </div>
    </div>
  )
}

export default RouteContainer
