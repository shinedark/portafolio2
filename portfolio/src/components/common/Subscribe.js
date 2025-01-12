import React, { useState } from 'react'
import './Subscribe.css'

const Subscribe = () => {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('') // 'success' or 'error'
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage('')
    setStatus('')

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/subscribers/subscribe`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        },
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong')
      }

      setMessage('Thank you for subscribing!')
      setStatus('success')
      setEmail('')
    } catch (error) {
      setMessage(error.message || 'Something went wrong. Please try again.')
      setStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="subscribe-container">
      <h2 className="subscribe-title">Stay Updated</h2>
      <p className="subscribe-description">
        Subscribe to receive updates about new projects and features
      </p>
      <form onSubmit={handleSubmit} className="subscribe-form">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="subscribe-input"
          required
          disabled={isSubmitting || status === 'success'}
        />
        <button
          type="submit"
          className="subscribe-button"
          disabled={isSubmitting || status === 'success'}
        >
          {isSubmitting
            ? 'Subscribing...'
            : status === 'success'
            ? 'Subscribed!'
            : 'Subscribe'}
        </button>
      </form>
      {message && <p className={`subscribe-message ${status}`}>{message}</p>}
    </div>
  )
}

export default Subscribe
