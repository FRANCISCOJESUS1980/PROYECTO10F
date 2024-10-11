const API_URL = 'http://localhost:3000/api'

const api = async (endpoint, method = 'GET', body = null, token = null) => {
  const headers = {
    'Content-Type': 'application/json'
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : null
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || response.statusText)
    }

    return response.json()
  } catch (error) {
    console.error('Error en la función fetch:', error)
    throw error
  }
}

export default api
