import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from './auth/AuthContext'
import './Navigation.css'

const Navigation = () => {
  const location = useLocation()
  const { user, logout } = useAuth()

  return (
    <nav className="navigation">
      <div className="nav-links">
        <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
          Home
        </Link>
        <Link
          to="/timeline"
          className={location.pathname === '/timeline' ? 'active' : ''}
        >
          Timeline
        </Link>
        <Link
          to="/business-plan"
          className={location.pathname === '/business-plan' ? 'active' : ''}
        >
          Business Plan
        </Link>
      </div>
      <div className="auth-section">
        {user ? (
          <button onClick={logout} className="auth-button">
            Logout
          </button>
        ) : (
          <Link to="/login" className="auth-button">
            Login
          </Link>
        )}
      </div>
    </nav>
  )
}

export default Navigation
