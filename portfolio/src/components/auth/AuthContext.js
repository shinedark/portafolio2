import React, { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false)
  const [activeRoute, setActiveRoute] = useState('projects')
  const [isLoading, setIsLoading] = useState(false)

  const showAdminPanel = () => {
    if (isAdmin) {
      setActiveRoute('admin')
    }
  }

  const login = async (username, password) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/auth/admin/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ username, password }),
        },
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Invalid credentials')
      }

      const data = await response.json()
      setIsAdmin(true)
      setActiveRoute('admin')

      return data
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  const logout = async () => {
    try {
      setIsAdmin(false)
      setActiveRoute('projects')

      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/auth/admin/logout`,
          {
            method: 'POST',
            credentials: 'include',
          },
        )

        if (!response.ok) {
          console.warn('Backend logout failed, but frontend state was cleared')
        }
      } catch (error) {
        console.warn('Backend unreachable during logout:', error.message)
      }
    } catch (error) {
      console.error('Logout error:', error)
      setIsAdmin(false)
      setActiveRoute('projects')
    }
  }

  return (
    <AuthContext.Provider
      value={{
        isAdmin,
        activeRoute,
        setActiveRoute,
        showAdminPanel,
        login,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
