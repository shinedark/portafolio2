import React, { useState, useEffect } from 'react'
import PostManager from '../admin/PostManager'
import LoginForm from '../admin/LoginForm'
import { useAuth } from '../auth/AuthContext'

function AdminRoute() {
  const { isAdmin } = useAuth()
  const [showAdmin, setShowAdmin] = useState(false)
  const [secretAttempts, setSecretAttempts] = useState(0)
  const maxAttempts = 3

  useEffect(() => {
    const storedSecret = localStorage.getItem('admin_access')
    if (storedSecret === process.env.REACT_APP_ADMIN_SECRET) {
      setShowAdmin(true)
    }
  }, [])

  const handleSecretSubmit = (e) => {
    e.preventDefault()
    const secret = e.target.secret.value

    if (secretAttempts >= maxAttempts) {
      alert('Too many attempts. Please try again later.')
      return
    }

    if (secret === process.env.REACT_APP_ADMIN_SECRET) {
      localStorage.setItem('admin_access', secret)
      setShowAdmin(true)
    } else {
      setSecretAttempts((prev) => prev + 1)
      alert(
        `Invalid secret. ${
          maxAttempts - secretAttempts - 1
        } attempts remaining.`,
      )
    }
  }

  if (!showAdmin) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <form
          onSubmit={handleSecretSubmit}
          className="w-full max-w-md space-y-4"
        >
          <div className="space-y-2">
            <label
              htmlFor="secret"
              className="block text-sm font-medium text-white/60"
            >
              Enter Admin Secret
            </label>
            <input
              type="password"
              id="secret"
              name="secret"
              required
              disabled={secretAttempts >= maxAttempts}
              className="w-full px-4 py-3 bg-neutral-800/50 text-white/90 border border-neutral-700 rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50
                placeholder:text-neutral-500 transition-all duration-200"
              placeholder="Enter secret"
            />
          </div>
          <button
            type="submit"
            disabled={secretAttempts >= maxAttempts}
            className="w-full px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium 
              rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 
              focus:ring-emerald-500/50 focus:ring-offset-2 focus:ring-offset-neutral-900
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Access Admin
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="route-page max-w-4xl mx-auto p-6">
      {!isAdmin ? (
        <LoginForm />
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Post Management</h1>
            <button
              onClick={() => {
                localStorage.removeItem('admin_access')
                setShowAdmin(false)
                setSecretAttempts(0)
              }}
              className="px-4 py-2 text-sm bg-red-500/10 text-red-400 hover:bg-red-500/20 
                rounded-lg transition-colors"
            >
              Exit Admin Mode
            </button>
          </div>
          <PostManager />
        </div>
      )}
    </div>
  )
}

export default AdminRoute
