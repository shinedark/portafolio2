import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [activeRoute, setActiveRoute] = useState('projects')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuthStatus = async () => {
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
        setIsLoading(false)
      }
    }

    checkAuthStatus()
  }, [])

  const showAdminPanel = () => {
    setActiveRoute('admin')
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
        throw new Error('Invalid credentials')
      }

      const data = await response.json()
      await Promise.all([
        setUser(data.user),
        setIsAdmin(data.user.isAdmin),
        setActiveRoute('admin'),
      ])

      console.log('Login successful:', {
        user: data.user,
        isAdmin: data.user.isAdmin,
        activeRoute: 'admin',
      })

      return data
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  const logout = () => {
    setUser(null)
    setIsAdmin(false)
    setActiveRoute('projects')
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
