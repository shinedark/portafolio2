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
          <h1 className="text-2xl font-bold">Post Management</h1>
          <PostManager />
        </div>
      )}
    </div>
  )
}

export default AdminRoute
