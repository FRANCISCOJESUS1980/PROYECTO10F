/*const API_URL = 'http://localhost:3000/api'

const isTokenExpired = (token) => {
  const payload = JSON.parse(atob(token.split('.')[1]))
  const now = Date.now() / 1000
  return payload.exp < now
}

const api = async (endpoint, method = 'GET', body = null, token = null) => {
  const headers = {
    'Content-Type': 'application/json'
  }

  if (token) {
    if (isTokenExpired(token)) {
      localStorage.removeItem('token')
      throw new Error(
        'Token inválido o ha expirado. Por favor, inicia sesión de nuevo.'
      )
    }
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

      if (errorData.message && errorData.message.includes('password')) {
        throw new Error(
          'La longitud de la contraseña debe tener al menos 8 caracteres.'
        )
      }

      if (response.status === 401) {
        localStorage.removeItem('token')
        throw new Error(
          'Token inválido o ha expirado. Inicia sesión nuevamente.'
        )
      }
      if (errorData.message && errorData.message.includes('username')) {
        throw new Error(
          'El nombre de usuario debe tener al menos 3 caracteres.'
        )
      }

      throw new Error(errorData.message || response.statusText)
    }

    return response.json()
  } catch (error) {
    console.error('Error en la función fetch:', error)
    throw error
  }
}

export default api*/
const API_URL = 'http://localhost:3000/api'

const isTokenExpired = (token) => {
  const payload = JSON.parse(atob(token.split('.')[1]))
  const now = Date.now() / 1000
  return payload.exp < now
}

const api = async (endpoint, method = 'GET', body = null, token = null) => {
  const headers = {
    'Content-Type': 'application/json'
  }

  if (token) {
    if (isTokenExpired(token)) {
      localStorage.removeItem('token')
      throw new Error(
        'Token inválido o ha expirado. Por favor, inicia sesión de nuevo.'
      )
    }
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

      // Mensajes de error personalizados
      if (errorData.message) {
        if (errorData.message.includes('password')) {
          throw new Error(
            'La longitud de la contraseña debe tener al menos 8 caracteres.'
          )
        } else if (errorData.message.includes('username')) {
          throw new Error(
            'El nombre de usuario debe tener al menos 3 caracteres.'
          )
        } else if (errorData.message.includes('incorrectos')) {
          throw new Error(
            'Las credenciales son incorrectas. Verifica tu correo y contraseña.'
          )
        }
      }

      // Mensaje de error genérico si no coincide con los anteriores
      throw new Error('Error en el inicio de sesión')
    }

    return await response.json()
  } catch (error) {
    console.error('Error en la función fetch:', error)
    throw error
  }
}

export default api
