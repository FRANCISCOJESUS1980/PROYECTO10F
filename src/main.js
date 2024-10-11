import api from './services/api.js'
import Header from './components/Header.js'
import { Loading } from './components/loading.js'
import { EventCard } from './components/EventCard.js'

let token = null
const app = document.getElementById('app')

const showLoading = () => {
  const loading = Loading()
  app.innerHTML = ''
  app.appendChild(loading)
}

const loadEvents = async () => {
  showLoading()
  try {
    const events = await api('/events', 'GET', null, token)
    app.innerHTML = ''

    const header = document.querySelector('header')
    if (!header) {
      const newHeader = Header(handleRegister, handleLogin)
      document.body.prepend(newHeader)
    }

    events.forEach((event) => {
      const eventCard = EventCard(event, confirmAttendance, leaveEvent)
      app.appendChild(eventCard)
    })
  } catch (error) {
    console.error('Error al cargar eventos:', error)
    app.innerHTML = '<p>Error al cargar eventos.</p>'
  }
}

const confirmAttendance = async (eventId) => {
  showLoading()
  try {
    await api(`/events/${eventId}/attend`, 'POST', null, token)
    alert('Asistencia confirmada.')
    loadEvents()
  } catch (error) {
    console.error('Error al confirmar asistencia:', error)
    alert(error.message)
  }
}

const leaveEvent = async (eventId) => {
  showLoading()
  try {
    await api(`/events/${eventId}/leave`, 'POST', null, token)
    alert('Has salido del evento.')
    loadEvents()
  } catch (error) {
    console.error('Error al salir del evento:', error)
    alert(error.message)
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
    loadEvents()
  } else {
    loadEvents()
  }
}

initApp()
