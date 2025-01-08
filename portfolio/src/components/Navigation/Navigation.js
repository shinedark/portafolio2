import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import './Navigation.css'

const Navigation = () => {
  const location = useLocation()
  const { isAdmin, logout } = useAuth()

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
        {isAdmin && (
          <Link
            to="/admin"
            className={location.pathname === '/admin' ? 'active' : ''}
          >
            Admin
          </Link>
        )}
      </div>
      <div className="auth-section">
        {isAdmin ? (
          <button onClick={logout} className="auth-button">
            Logout
          </button>
        ) : (
          <Link to="/admin" className="auth-button">
            Admin Login
          </Link>
        )}
      </div>
    </nav>
  )
}

export default Navigation
