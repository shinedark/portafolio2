import React from 'react'
import './ProjectNavigation.css'

const ProjectNavigation = ({ activeRoute, onRouteChange }) => {
  const routes = [
    { id: 'projects', label: 'Projects' },
    { id: 'business-plan', label: 'Business Plan' },
    { id: 'timeline', label: 'Timeline' },
    { id: 'development', label: 'Development' },
    { id: 'invest', label: 'Invest & Support' },
    { id: 'admin', label: 'Admin' },
  ]

  return (
    <nav className="project-navigation">
      <ul>
        {routes.map((route) => (
          <li key={route.id}>
            <button
              className={`nav-button ${
                activeRoute === route.id ? 'active' : ''
              }`}
              onClick={() => onRouteChange(route.id)}
            >
              {route.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default ProjectNavigation
