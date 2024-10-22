import api from './services/api.js'
import Header from './components/Header.js'
import { Loading } from './components/loading.js'
import { EventCard } from './components/EventCard.js'
import { addCreateEventButton } from './components/createEvent.js'

let token = localStorage.getItem('token') || null
const app = document.getElementById('app')

const showLoading = () => {
  const loading = Loading()
  app.innerHTML = ''
  app.appendChild(loading)
}

const hideLoading = () => {
  const loadingElement = document.querySelector('.loading')
  if (loadingElement) {
    loadingElement.remove()
  }
}

const showError = (message) => {
  const errorDiv = document.createElement('div')
  errorDiv.classList.add('error-message')
  errorDiv.textContent = message
  app.appendChild(errorDiv)
}

const isAuthenticated = () => {
  return !!token
}

const loadEvents = async () => {
  showLoading()
  try {
    const events = await api('/events', 'GET', null, token)
    hideLoading()

    app.innerHTML = ''

    const header = Header(handleRegister, handleLogin)
    app.appendChild(header)

    if (isAuthenticated()) {
      addCreateEventButton()
    }

    events.forEach((event) => {
      const eventCard = EventCard(
        event,
        confirmAttendance,
        leaveEvent,
        deleteEvent,
        token,
        isAuthenticated
      )
      app.appendChild(eventCard)
    })
  } catch (error) {
    hideLoading()
    console.error('Error al cargar eventos:', error)

    if (
      error.message.includes('Token inválido') ||
      error.message.includes('ha expirado')
    ) {
      localStorage.removeItem('token')
      token = null
      alert('Tu sesión ha expirado. Por favor, inicia sesión de nuevo.')
      window.location.reload()
    } else {
      showError('Error al cargar eventos. Intenta más tarde.')
    }
  }
}

const confirmAttendance = async (eventId) => {
  if (!isAuthenticated()) {
    alert('Debes iniciar sesión para confirmar asistencia.')
    return
  }
  try {
    await api(`/events/${eventId}/attend`, 'POST', null, token)
    loadEvents()
  } catch (error) {
    console.error('Error al confirmar asistencia:', error)
    if (
      error.message.includes('Token inválido') ||
      error.message.includes('ha expirado')
    ) {
      localStorage.removeItem('token')
      token = null
      alert('Tu sesión ha expirado. Por favor, inicia sesión de nuevo.')
      window.location.reload()
    } else {
      alert('Error al confirmar asistencia. Intenta de nuevo.')
    }
  }
}

const leaveEvent = async (eventId) => {
  if (!isAuthenticated()) {
    alert('Debes iniciar sesión para salir del evento.')
    return
  }
  try {
    await api(`/events/${eventId}/leave`, 'POST', null, token)
    loadEvents()
  } catch (error) {
    console.error('Error al salir del evento:', error)
    if (
      error.message.includes('Token inválido') ||
      error.message.includes('ha expirado')
    ) {
      localStorage.removeItem('token')
      token = null
      alert('Tu sesión ha expirado. Por favor, inicia sesión de nuevo.')
      window.location.reload()
    } else {
      alert('Error al salir del evento. Intenta de nuevo.')
    }
  }
}

const deleteEvent = async (eventId) => {
  if (!isAuthenticated()) {
    alert('Debes iniciar sesión para eliminar el evento.')
    return
  }
  try {
    await api(`/events/${eventId}`, 'DELETE', null, token)
    loadEvents()
  } catch (error) {
    console.error('Error al eliminar evento:', error)
    if (
      error.message.includes('Token inválido') ||
      error.message.includes('ha expirado')
    ) {
      localStorage.removeItem('token')
      token = null
      alert('Tu sesión ha expirado. Por favor, inicia sesión de nuevo.')
      window.location.reload()
    } else {
      alert('Error al eliminar evento. Intenta de nuevo.')
    }
  }
}

const handleRegister = (newToken) => {
  token = newToken
  localStorage.setItem('token', token)
  loadEvents()
}

const handleLogin = (newToken) => {
  token = newToken
  localStorage.setItem('token', token)
  loadEvents()
}

const initApp = () => {
  app.innerHTML = ''

  const header = Header(handleRegister, handleLogin, isAuthenticated)
  document.body.prepend(header)

  loadEvents()
}

initApp()
