import { openModal, closeModal } from '../Modal.js'
import { EventCard } from '../EventCard.js'

async function handleCreateEvent(e) {
  e.preventDefault()

  const title = document.getElementById('title').value
  const date = document.getElementById('date').value
  const location = document.getElementById('location').value
  const description = document.getElementById('description').value
  const image = document.getElementById('image').files[0]

  // Validación de longitud del título en el frontend
  if (title.length < 3) {
    alert('El título debe tener al menos 3 caracteres.')
    return
  }

  const formData = new FormData()
  formData.append('title', title)
  formData.append('date', date)
  formData.append('location', location)
  formData.append('description', description)
  formData.append('image', image)

  const submitButton = document.querySelector('button[type="submit"]')
  submitButton.disabled = true
  submitButton.textContent = 'Creando...'

  try {
    const response = await fetch('http://localhost:3000/api/events', {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })

    if (!response.ok) {
      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        const errorMessage = await response.json()
        alert(errorMessage.message)
      } else {
        throw new Error('El servidor devolvió un error inesperado.')
      }
      return
    }

    closeModal('eventModal')
    loadEvents()
  } catch (error) {
    console.error('Error al crear el evento:', error)
    alert(`Error al crear el evento: ${error.message}`)
  } finally {
    submitButton.disabled = false
    submitButton.textContent = 'Crear Evento'
  }
}

export function openCreateEventModal() {
  const modalContent = document.createElement('div')
  modalContent.innerHTML = `
    <h2>Crear Evento</h2>
    <form id="create-event-form">
      <label for="title">Título:</label>
      <input type="text" id="title" required>
      <label for="date">Fecha:</label>
      <input type="date" id="date" required>
      <label for="location">Ubicación:</label>
      <input type="text" id="location" required>
      <label for="description">Descripción:</label>
      <textarea id="description" required></textarea>
      <label for="image">Imagen:</label>
      <input type="file" id="image" accept="image/*" required>
      <button type="submit">Crear Evento</button>
    </form>
  `

  modalContent
    .querySelector('#create-event-form')
    .addEventListener('submit', handleCreateEvent)

  openModal(modalContent, 'eventModal')
}

export function addCreateEventButton() {
  let existingButton = document.querySelector('.create-event-btn')
  if (existingButton) {
    return
  }

  const button = document.createElement('button')
  button.textContent = 'Crear Evento'
  button.className = 'create-event-btn'
  button.addEventListener('click', openCreateEventModal)

  let eventContainer = document.getElementById('event-container')

  if (!eventContainer) {
    eventContainer = document.createElement('div')
    eventContainer.id = 'event-container'
    eventContainer.style.display = 'flex'
    eventContainer.style.justifyContent = 'center'
    eventContainer.style.alignItems = 'center'
    eventContainer.style.marginTop = '80px'
    eventContainer.style.minHeight = '100px'

    const header = document.querySelector('header')
    header.insertAdjacentElement('afterend', eventContainer)
  }

  eventContainer.appendChild(button)
}

async function loadEvents() {
  showLoading()
  try {
    const response = await fetch('http://localhost:3000/api/events', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })

    if (!response.ok) {
      throw new Error('Error al cargar eventos')
    }

    const events = await response.json()
    hideLoading()

    const app = document.getElementById('app')
    app.innerHTML = ''

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
    alert('Error al cargar eventos: ' + error.message)
  }
}

function showLoading() {
  const loadingElement = document.createElement('div')
  loadingElement.id = 'loading'
  loadingElement.textContent = 'Cargando...'
  document.body.appendChild(loadingElement)
}

function hideLoading() {
  const loadingElement = document.getElementById('loading')
  if (loadingElement) {
    document.body.removeChild(loadingElement)
  }
}

async function confirmAttendance(eventId) {
  try {
    const response = await fetch(
      `http://localhost:3000/api/events/${eventId}/attend`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      }
    )

    if (!response.ok) {
      throw new Error('Error al confirmar asistencia')
    }

    alert('Asistencia confirmada con éxito')
    loadEvents()
  } catch (error) {
    console.error('Error al confirmar asistencia:', error)
    alert('Error al confirmar asistencia: ' + error.message)
  }
}
