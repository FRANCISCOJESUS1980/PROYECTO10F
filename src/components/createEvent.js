import { openModal } from './Modal.js'

async function handleCreateEvent(e) {
  e.preventDefault()

  const formData = new FormData()
  const title = document.getElementById('title').value
  const date = document.getElementById('date').value
  const location = document.getElementById('location').value
  const description = document.getElementById('description').value
  const image = document.getElementById('image').files[0]

  formData.append('title', title)
  formData.append('date', date)
  formData.append('location', location)
  formData.append('description', description)
  formData.append('image', image)

  try {
    const response = await fetch('/events', {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })

    if (!response.ok) {
      const errorMessage = await response.text()
      throw new Error(errorMessage)
    }

    closeModal('eventModal')

    loadEvents()
  } catch (error) {
    console.error('Error al crear el evento:', error)
    alert('Error al crear el evento: ' + error.message)
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
  const button = document.createElement('button')
  button.textContent = 'Crear Evento'
  button.style.width = '200px'
  button.style.height = '50px'
  button.style.margin = '20px auto'
  button.style.display = 'block'
  button.style.fontSize = '20px'
  button.className = 'create-event-btn'
  button.addEventListener('click', openCreateEventModal)

  const appElement = document.getElementById('app')
  if (appElement) {
    appElement.appendChild(button)
  }
}

async function loadEvents() {
  showLoading()
  try {
    const response = await fetch('/api/events', {
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

    if (isAuthenticated()) {
      addCreateEventButton()
    }
  } catch (error) {
    hideLoading()
    console.error('Error al cargar eventos:', error)
    alert('Error al cargar eventos: ' + error.message)
  }
}
