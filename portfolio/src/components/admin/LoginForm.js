import React, { useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import '../auth/Auth.css'

const LoginForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    try {
      await login(email, password)
    } catch (error) {
      setError('Invalid credentials. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen w-full p-4 sm:p-8 bg-gradient-to-b from-black to-neutral-900">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-8 bg-neutral-900/50 backdrop-blur-sm p-6 sm:p-8 rounded-xl border border-neutral-800 shadow-xl"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-center text-white/90">
          Admin Access
        </h2>
        <div className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-white/60"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter admin email"
              disabled={isLoading}
              className="w-full px-4 py-3 bg-neutral-800/50 text-white/90 border border-neutral-700 rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50
                placeholder:text-neutral-500 transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-white/60"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              disabled={isLoading}
              className="w-full px-4 py-3 bg-neutral-800/50 text-white/90 border border-neutral-700 rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50
                placeholder:text-neutral-500 transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg">
              <p className="text-red-400 text-sm text-center">{error}</p>
            </div>
          )}
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium 
            rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 
            focus:ring-emerald-500/50 focus:ring-offset-2 focus:ring-offset-neutral-900
            disabled:opacity-50 disabled:cursor-not-allowed relative"
        >
          {isLoading ? (
            <>
              <span className="opacity-0">Login</span>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white/20 border-t-white/90 rounded-full animate-spin" />
              </div>
            </>
          ) : (
            'Login'
          )}
        </button>
      </form>
    </div>
  )
}

export default LoginForm
