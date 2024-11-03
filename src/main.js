import api from './services/api.js'
import Header from './components/header/Header.js'
import { Loading } from './components/Loading/loading.js'
import Swal from 'sweetalert2'
import { EventCard } from './components/tarjetaEventos/EventCard.js'
import addCreateEventButton from './components/crearEventos/openCreateEventButton'
import { createBall } from './components/crearBolas/createball.js'
import { createUserMenu } from './components/Usuarios/UserMenu.js'

const newBall = createBall()
document.body.appendChild(newBall)
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
  Swal.fire({
    icon: 'error',
    title: 'Error',
    text: message
  })
}

export const isAuthenticated = () => {
  return !!token
}
export const loadEvents = async () => {
  showLoading()
  try {
    const events = await api('/events', 'GET', null, token)
    hideLoading()

    app.innerHTML = ''

    const header = Header(handleRegister, handleLogin)
    app.appendChild(header)

    if (isAuthenticated()) {
      addCreateEventButton()
      const removeMenu = createUserMenu()

      const buttonContainer = document.querySelector('div .button-container')
      if (buttonContainer) {
        buttonContainer.remove()
      }
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
      Swal.fire({
        icon: 'warning',
        title: 'Sesión expirada',
        text: 'Tu sesión ha expirado. Por favor, inicia sesión de nuevo.'
      }).then(() => {
        window.location.reload()
      })
    } else {
      showError('Error al cargar eventos. Intenta más tarde.')
    }
  }
}

const confirmAttendance = async (eventId) => {
  showLoading()
  if (!isAuthenticated()) {
    Swal.fire({
      icon: 'info',
      title: 'Iniciar sesión',
      text: 'Debes iniciar sesión para confirmar asistencia.'
    })
    hideLoading()
    return
  }
  try {
    await api(`/events/${eventId}/attend`, 'POST', null, token)
    Swal.fire({
      icon: 'success',
      title: 'confirmar Asistencia',
      text: 'Has confirmado Asistencia con exito'
    })
    loadEvents()
  } catch (error) {
    hideLoading()
    console.error('Error al confirmar asistencia:', error)
    if (
      error.message.includes('Token inválido') ||
      error.message.includes('ha expirado')
    ) {
      localStorage.removeItem('token')
      token = null
      Swal.fire({
        icon: 'warning',
        title: 'Sesión expirada',
        text: 'Tu sesión ha expirado. Por favor, inicia sesión de nuevo.'
      }).then(() => {
        window.location.reload()
      })
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al confirmar asistencia. Intenta de nuevo.'
      })
    }
  }
}

const leaveEvent = async (eventId) => {
  showLoading()
  if (!isAuthenticated()) {
    Swal.fire({
      icon: 'info',
      title: 'Iniciar sesión',
      text: 'Debes iniciar sesión para salir del evento.'
    })
    hideLoading()
    return
  }
  try {
    await api(`/events/${eventId}/leave`, 'POST', null, token)
    Swal.fire({
      icon: 'success',
      title: 'Salir de evento',
      text: 'has salido con exito del evento'
    })
    loadEvents()
  } catch (error) {
    hideLoading()
    console.error('Error al salir del evento:', error)
    if (
      error.message.includes('Token inválido') ||
      error.message.includes('ha expirado')
    ) {
      localStorage.removeItem('token')
      token = null
      Swal.fire({
        icon: 'warning',
        title: 'Sesión expirada',
        text: 'Tu sesión ha expirado. Por favor, inicia sesión de nuevo.'
      }).then(() => {
        window.location.reload()
      })
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al salir del evento. Intenta de nuevo.'
      })
    }
  }
}

const deleteEvent = async (eventId) => {
  showLoading()
  if (!isAuthenticated()) {
    Swal.fire({
      icon: 'info',
      title: 'Iniciar sesión',
      text: 'Debes iniciar sesión para eliminar el evento.'
    })
    hideLoading()
    return
  }
  try {
    await api(`/events/${eventId}`, 'DELETE', null, token)
    Swal.fire({
      icon: 'success',
      title: 'Eliminar Evento',
      text: 'El evento ha sido eliminado con exito'
    })
    loadEvents()
  } catch (error) {
    hideLoading()
    console.error('Error al eliminar evento:', error)
    if (
      error.message.includes('Token inválido') ||
      error.message.includes('ha expirado')
    ) {
      localStorage.removeItem('token')
      token = null
      Swal.fire({
        icon: 'warning',
        title: 'Sesión expirada',
        text: 'Tu sesión ha expirado. Por favor, inicia sesión de nuevo.'
      }).then(() => {
        window.location.reload()
      })
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al eliminar evento. Intenta de nuevo.'
      })
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
