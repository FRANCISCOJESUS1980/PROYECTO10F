import api from './services/api.js'
import Header from './components/Header.js'
import { Loading } from './components/loading.js'
import { EventCard } from './components/EventCard.js'

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

const loadEvents = async () => {
  showLoading()
  try {
    const events = await api('/events', 'GET', null, token)
    hideLoading()

    app.innerHTML = '' // Limpiamos el contenido actual

    const header = document.querySelector('header')
    if (header) {
      app.appendChild(header)
    }

    events.forEach((event) => {
      const eventCard = EventCard(event, confirmAttendance, leaveEvent, !!token)
      app.appendChild(eventCard)
    })
  } catch (error) {
    hideLoading()
    console.error('Error al cargar eventos:', error)

    if (error.message.includes('Token inválido')) {
      localStorage.removeItem('token') // Elimina el token si es inválido
      alert('Tu sesión ha expirado. Por favor, inicia sesión de nuevo.')
      window.location.reload() // Recarga la página para volver al estado inicial
    } else {
      showError('Error al cargar eventos. Intenta más tarde.')
    }
  }
}

const confirmAttendance = async (eventId) => {
  try {
    await api(`/events/${eventId}/attend`, 'POST', null, token)
    loadEvents() // Recargar los eventos después de confirmar asistencia
  } catch (error) {
    console.error('Error al confirmar asistencia:', error)
    alert('Error al confirmar asistencia. Intenta de nuevo.')
  }
}

const leaveEvent = async (eventId) => {
  try {
    await api(`/events/${eventId}/leave`, 'POST', null, token)
    loadEvents() // Recargar los eventos después de salir
  } catch (error) {
    console.error('Error al salir del evento:', error)
    alert('Error al salir del evento. Intenta de nuevo.')
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

  const header = Header(handleRegister, handleLogin)
  document.body.prepend(header)

  const storedToken = localStorage.getItem('token')
  if (storedToken) {
    token = storedToken
  }
  loadEvents()
}

initApp()
