import React from 'react'
import { useAuth } from './AuthContext'

export const AdminOnly = ({ children }) => {
  const { user } = useAuth()

  if (!user?.isAdmin) {
    return null
  }

  return children
}

export default AdminOnly
