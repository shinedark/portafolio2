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

    // Check if the response is JSON
    const contentType = response.headers.get('content-type')
    const isJson = contentType && contentType.includes('application/json')

    if (!response.ok) {
      if (isJson) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'API request failed')
      }
      throw new Error('API request failed')
    }

    // Return JSON data if the response is JSON, otherwise return null
    if (isJson) {
      const data = await response.json()
      return data.data || data
    }

    return null
  } catch (error) {
    console.error('API call error:', error)
    if (error.message === 'Failed to fetch') {
      throw new Error(
        'Unable to connect to the server. Please check your connection.',
      )
    }
    throw error
  }
}
