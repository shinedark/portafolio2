import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [activeRoute, setActiveRoute] = useState('projects')
  const [isLoading, setIsLoading] = useState(false)
  const [isChecked, setIsChecked] = useState(false)

  useEffect(() => {
    const checkAuthStatus = async () => {
      if (isChecked) return

      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/auth/me`,
          {
            credentials: 'include',
          },
        )
        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
          setIsAdmin(data.user.isAdmin)
        }
      } catch (error) {
        console.error('Failed to check auth status:', error)
      } finally {
        setIsChecked(true)
      }
    }

    checkAuthStatus()
  }, [isChecked])

  const showAdminPanel = () => {
    if (isAdmin) {
      setActiveRoute('admin')
    }
  }

  const login = async (email, password) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/auth/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ email, password }),
        },
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Invalid credentials')
      }

      const { user } = await response.json()
      if (!user) {
        throw new Error('No user data received')
      }

      const defaultRoute = user.isAdmin ? 'admin' : 'projects'

      setUser(user)
      setIsAdmin(user.isAdmin)
      setActiveRoute(defaultRoute)
      setIsChecked(true)

      console.log('Login successful:', {
        user,
        isAdmin: user.isAdmin,
        activeRoute: defaultRoute,
      })

      return { user }
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  const logout = async () => {
    try {
      setUser(null)
      setIsAdmin(false)
      setActiveRoute('projects')
      setIsChecked(true)

      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/auth/logout`,
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

      localStorage.removeItem('admin_access')
    } catch (error) {
      console.error('Logout error:', error)
      setUser(null)
      setIsAdmin(false)
      setActiveRoute('projects')
      localStorage.removeItem('admin_access')
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
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
