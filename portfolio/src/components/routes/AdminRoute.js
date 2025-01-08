import React from 'react'
import PostManager from '../admin/PostManager'
import LoginForm from '../admin/LoginForm'
import { useAuth } from '../auth/AuthContext'

function AdminRoute() {
  const { isAdmin } = useAuth()

  return (
    <div className="route-page max-w-4xl mx-auto p-6">
      {!isAdmin ? (
        <LoginForm />
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          </div>
          <PostManager />
        </div>
      )}
    </div>
  )
}

export default AdminRoute
