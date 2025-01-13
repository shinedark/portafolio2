import React, { useState, useEffect } from 'react'
import './Twitch.css'

const TWITCH_CLIENT_ID = process.env.REACT_APP_TWITCH_CLIENT_ID
const TWITCH_REDIRECT_URI =
  process.env.REACT_APP_REDIRECT_URI?.split('#')[0].trim() ||
  'http://localhost:3000'

console.log('Cleaned Redirect URI:', TWITCH_REDIRECT_URI)

const TWITCH_USERNAME = 'shinedarkmusic'

const Twitch = () => {
  const [streamData, setStreamData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [accessToken, setAccessToken] = useState(null)
  const [needsAuth, setNeedsAuth] = useState(false)

  console.log('Component rendering, needsAuth:', needsAuth)

  // Simplified auth function
  const initiateAuth = () => {
    console.log('Initiating auth directly')

    const params = new URLSearchParams({
      client_id: TWITCH_CLIENT_ID,
      redirect_uri: TWITCH_REDIRECT_URI,
      response_type: 'token',
      scope: 'user:read:email', // Add any additional scopes needed
      force_verify: true,
    })

    const authUrl = `https://id.twitch.tv/oauth2/authorize?${params}`
    console.log('Redirecting to:', authUrl)
    window.location.replace(authUrl)
  }

  // Check stream status with token
  const checkStreamStatus = async (token) => {
    try {
      console.log('Checking stream status with token...')
      const response = await fetch(
        `https://api.twitch.tv/helix/streams?user_login=${TWITCH_USERNAME}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Client-ID': TWITCH_CLIENT_ID,
          },
        },
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const { data } = await response.json()
      console.log('Stream data received:', data)

      if (data.length === 0) {
        setStreamData({ isLive: false })
      } else {
        setStreamData({
          isLive: true,
          title: data[0].title,
          viewerCount: data[0].viewer_count,
          gameName: data[0].game_name,
          thumbnailUrl: data[0].thumbnail_url,
        })
      }
      setLoading(false)
    } catch (err) {
      console.error('Error checking stream:', err)
      if (err.message.includes('401')) {
        setNeedsAuth(true)
      }
      setError(err.message)
      setLoading(false)
    }
  }

  // Initial check
  useEffect(() => {
    console.log('Initial useEffect running...')

    // Check for auth callback
    const hash = window.location.hash
    if (hash) {
      const params = new URLSearchParams(hash.substring(1))
      const token = params.get('access_token')
      if (token) {
        console.log('Found token in URL')
        localStorage.setItem('twitch_access_token', token)
        setAccessToken(token)
        window.location.hash = ''
        return
      }
    }

    // Check stored token
    const storedToken = localStorage.getItem('twitch_access_token')
    console.log('Stored token exists:', !!storedToken)

    if (storedToken) {
      setAccessToken(storedToken)
      checkStreamStatus(storedToken)
    } else {
      console.log('No token found, needs auth')
      setNeedsAuth(true)
      setLoading(false)
    }
  }, [])

  // Show loading state
  if (loading) {
    return <div className="twitch-container">Checking stream status...</div>
  }

  // Show auth button if needed
  if (needsAuth) {
    return (
      <div className="twitch-container">
        <h3>Connect to Twitch</h3>
        <p>Authentication required to check stream status</p>
        <button
          onClick={initiateAuth}
          style={{
            backgroundColor: '#9146FF',
            color: 'white',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Connect with Twitch
        </button>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="twitch-container error">
        <p>{error}</p>
        <button onClick={checkStreamStatus} className="retry-button">
          Retry
        </button>
      </div>
    )
  }

  // Show offline state
  if (!streamData?.isLive) {
    return (
      <div className="twitch-container offline">
        <h3>Stream is currently offline</h3>
        <p>Follow me on Twitch to get notified when I go live!</p>
        <a
          href="https://twitch.tv/shinedarkmusic"
          target="_blank"
          rel="noopener noreferrer"
          className="twitch-follow-button"
        >
          Follow on Twitch
        </a>
      </div>
    )
  }

  // Show live state with auth button if needed
  if (streamData?.isLive && needsAuth) {
    return (
      <div className="twitch-container live">
        <div className="stream-info">
          <h3>🔴 Live Now!</h3>
          <p>Connect with Twitch to see stream details</p>
          <button onClick={initiateAuth} className="twitch-auth-button">
            Connect with Twitch
          </button>
        </div>
      </div>
    )
  }

  // Simplified auth view
  if (needsAuth) {
    console.log('Rendering auth view')
    return (
      <div
        style={{
          padding: '20px',
          textAlign: 'center',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
          margin: '20px',
        }}
      >
        <h3 style={{ marginBottom: '15px' }}>Twitch Authentication Required</h3>

        <div style={{ marginBottom: '20px' }}>
          <p>Click the button below to connect with Twitch</p>
          <small>
            Client ID: {TWITCH_CLIENT_ID ? '✓ Present' : '✗ Missing'}
          </small>
          <br />
          <small>Redirect URI: {TWITCH_REDIRECT_URI}</small>
        </div>

        <button
          onClick={() => {
            console.log('Button clicked')
            initiateAuth()
          }}
          style={{
            backgroundColor: '#9146FF',
            color: 'white',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          Connect with Twitch
        </button>

        {error && (
          <div
            style={{
              color: 'red',
              marginTop: '15px',
              padding: '10px',
              backgroundColor: '#ffebee',
              borderRadius: '4px',
            }}
          >
            Error: {error}
          </div>
        )}
      </div>
    )
  }

  // Modify the live stream display section
  if (streamData?.isLive) {
    return (
      <div className="twitch-container live">
        <div className="stream-info">
          <h3>🔴 Live Now: {streamData.title}</h3>
          <p>Playing: {streamData.gameName}</p>
          <p>Viewers: {streamData.viewerCount}</p>
        </div>

        {/* Twitch Player Embed */}
        <div
          className="stream-embed"
          style={{
            width: '100%',
            aspectRatio: '16/9',
            marginTop: '20px',
          }}
        >
          <iframe
            src={`https://player.twitch.tv/?channel=${TWITCH_USERNAME}&parent=${window.location.hostname}`}
            frameBorder="0"
            allowFullScreen={true}
            scrolling="no"
            height="100%"
            width="100%"
            title="Twitch Stream"
          />
        </div>

        {/* Optional: Chat Embed */}
        <div
          className="chat-embed"
          style={{
            width: '100%',
            height: '400px',
            marginTop: '20px',
          }}
        >
          <iframe
            src={`https://www.twitch.tv/embed/${TWITCH_USERNAME}/chat?parent=${window.location.hostname}`}
            frameBorder="0"
            scrolling="no"
            height="100%"
            width="100%"
            title="Twitch Chat"
          />
        </div>
      </div>
    )
  }

  // Normal live stream display
  return (
    <div className="twitch-container live">
      <div className="stream-info">
        <h3>🔴 Live Now: {streamData.title}</h3>
        <p>Playing: {streamData.gameName}</p>
        <p>Viewers: {streamData.viewerCount}</p>
        <a
          href="https://twitch.tv/shinedarkmusic"
          target="_blank"
          rel="noopener noreferrer"
          className="watch-button"
        >
          Watch Stream
        </a>
      </div>
      <div className="stream-preview">
        <img
          src={streamData.thumbnailUrl
            .replace('{width}', '640')
            .replace('{height}', '360')}
          alt="Stream Preview"
        />
      </div>
    </div>
  )
}

export default Twitch
