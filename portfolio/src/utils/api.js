const API_URL = process.env.REACT_APP_API_URL

export const checkApiConnection = async () => {
  try {
    const response = await fetch(`${API_URL}/api/health`, {
      method: 'HEAD',
      timeout: 5000,
    })
    return response.ok
  } catch (error) {
    console.error('API connection check failed:', error)
    return false
  }
}

export const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || 'API request failed')
    }

    return await response.json()
  } catch (error) {
    if (error.message === 'Failed to fetch') {
      throw new Error(
        'Unable to connect to the server. Please check your connection.',
      )
    }
    throw error
  }
}
