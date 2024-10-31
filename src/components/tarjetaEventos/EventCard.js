/*import Swal from 'sweetalert2'

const EventCard = (
  event,
  onConfirm,
  onLeave,
  onDelete,
  token,
  isAuthenticated
) => {
  const card = document.createElement('div')
  card.classList.add('event-card')

  const eventId = event.id || event._id

  let userId = null
  let isCreator = false
  let userIsAttending = false

  try {
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1]))
      userId = decodedToken.id
      console.log('userId from token:', userId)
    }
  } catch (e) {
    console.error('Error al decodificar el token:', e)
  }

  if (event.creator) {
    console.log('Event creator ID:', event.creator)
    isCreator = event.creator.toString() === userId
    console.log('isCreator:', isCreator)
  }

  if (Array.isArray(event.attendees)) {
    userIsAttending = event.attendees.includes(userId)
  }

  let expanded = false

  card.innerHTML = `
    <img src="${event.imageUrl}" alt="${event.title}" class="event-image" />
    <h3 class="event-name">${event.title}</h3>
    <p class="event-description">${event.description}</p>
    <p class="event-date">Fecha: ${new Date(event.date).toLocaleString()}</p>
    <p class="event-location">Ubicación: ${event.location}</p>
    <p class="event-attendees">Asistentes: ${
      event.attendees ? event.attendees.length : 0
    }</p>
    <div class="event-buttons"></div>
  `

  const buttonContainer = card.querySelector('.event-buttons')

  const toggleExpansion = () => {
    if (expanded) {
      card.classList.remove('expanded')
      buttonContainer.innerHTML = ''
    } else {
      if (!isAuthenticated()) {
        Swal.fire({
          icon: 'warning',
          title: 'Inicia sesión',
          text: 'Debes iniciar sesión para interactuar con los eventos.'
        })
        return
      }

      card.classList.add('expanded')
      buttonContainer.innerHTML = ''

      if (isCreator) {
        const deleteButton = document.createElement('button')
        deleteButton.textContent = 'Eliminar Evento'
        deleteButton.addEventListener('click', (e) => {
          e.stopPropagation()
          Swal.fire({
            title: '¿Estás seguro?',
            text: 'No podrás deshacer esta acción.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar'
          }).then((result) => {
            if (result.isConfirmed) {
              onDelete(eventId)
              Swal.fire(
                '¡Eliminado!',
                'El evento ha sido eliminado.',
                'success'
              )
            }
          })
        })
        buttonContainer.appendChild(deleteButton)
      } else if (userIsAttending) {
        const leaveButton = document.createElement('button')
        leaveButton.textContent = 'Salir del Evento'
        leaveButton.addEventListener('click', (e) => {
          e.stopPropagation()
          Swal.fire({
            title: '¿Quieres salir del evento?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí, salir',
            cancelButtonText: 'Cancelar'
          }).then((result) => {
            if (result.isConfirmed) {
              onLeave(eventId)
              Swal.fire('Has salido del evento.', '', 'success')
            }
          })
        })
        buttonContainer.appendChild(leaveButton)
      } else {
        const confirmButton = document.createElement('button')
        confirmButton.textContent = 'Confirmar Asistencia'
        confirmButton.addEventListener('click', (e) => {
          e.stopPropagation()
          Swal.fire({
            title: '¿Quieres confirmar tu asistencia?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí, confirmar',
            cancelButtonText: 'Cancelar'
          }).then((result) => {
            if (result.isConfirmed) {
              onConfirm(eventId)
              Swal.fire('¡Asistencia confirmada!', '', 'success')
            }
          })
        })
        buttonContainer.appendChild(confirmButton)
      }
    }
    expanded = !expanded
  }

  card.addEventListener('click', (e) => {
    toggleExpansion()
  })

  return card
}

export { EventCard }*/
import Swal from 'sweetalert2'
import { openModal } from '../utils/Modal.js'
import handleUpdateEvent from './updateEvent.js'

const EventCard = (
  event,
  onConfirm,
  onLeave,
  onDelete,
  token,
  isAuthenticated
) => {
  const card = document.createElement('div')
  card.classList.add('event-card')

  const eventId = event.id || event._id

  let userId = null
  let isCreator = false
  let userIsAttending = false

  try {
    if (token && typeof token === 'string' && token.trim() !== '') {
      const decodedToken = JSON.parse(atob(token.split('.')[1]))
      userId = decodedToken.id
      console.log('userId from token:', userId)
    } else {
      throw new Error('Token inválido o no proporcionado')
    }
  } catch (e) {
    console.error('Error al decodificar el token:', e)
    Swal.fire({
      icon: 'error',
      title: 'Error de autenticación',
      text: 'No se puede verificar su autenticación. Por favor inicie sesión de nuevo.'
    })
    return card
  }

  if (event.creator) {
    isCreator = event.creator.toString() === userId
  }

  if (Array.isArray(event.attendees)) {
    userIsAttending = event.attendees.includes(userId)
  }

  let expanded = false

  card.innerHTML = `
    <img src="${event.imageUrl}" alt="${event.title}" class="event-image" />
    <h3 class="event-name">${event.title}</h3>
    <p class="event-description">${event.description}</p>
    <p class="event-date">Fecha: ${new Date(event.date).toLocaleString()}</p>
    <p class="event-location">Ubicación: ${event.location}</p>
    <p class="event-attendees">Asistentes: ${
      event.attendees ? event.attendees.length : 0
    }</p>
    <div class="event-buttons"></div>
  `

  const buttonContainer = card.querySelector('.event-buttons')

  const toggleExpansion = () => {
    if (expanded) {
      card.classList.remove('expanded')
      buttonContainer.innerHTML = ''
    } else {
      if (typeof isAuthenticated === 'function' && !isAuthenticated()) {
        Swal.fire({
          icon: 'warning',
          title: 'Inicia sesión',
          text: 'Debes iniciar sesión para interactuar con los eventos.'
        })
        return
      }

      card.classList.add('expanded')
      buttonContainer.innerHTML = ''

      if (isCreator) {
        const deleteButton = document.createElement('button')
        deleteButton.textContent = 'Eliminar Evento'
        deleteButton.addEventListener('click', (e) => {
          e.stopPropagation()
          Swal.fire({
            title: '¿Estás seguro?',
            text: 'No podrás deshacer esta acción.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar'
          }).then((result) => {
            if (result.isConfirmed) {
              onDelete(eventId)
              Swal.fire(
                '¡Eliminado!',
                'El evento ha sido eliminado.',
                'success'
              )
            }
          })
        })
        buttonContainer.appendChild(deleteButton)

        const updateButton = document.createElement('button')
        updateButton.textContent = 'Modificar Evento'
        updateButton.addEventListener('click', (e) => {
          e.stopPropagation()
          openModal(handleUpdateEvent(eventId), 'updateEventModal')
        })
        buttonContainer.appendChild(updateButton)
      } else if (userIsAttending) {
        const leaveButton = document.createElement('button')
        leaveButton.textContent = 'Salir del Evento'
        leaveButton.addEventListener('click', (e) => {
          e.stopPropagation()
          Swal.fire({
            title: '¿Quieres salir del evento?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí, salir',
            cancelButtonText: 'Cancelar'
          }).then((result) => {
            if (result.isConfirmed) {
              onLeave(eventId)
              Swal.fire('Has salido del evento.', '', 'success')
            }
          })
        })
        buttonContainer.appendChild(leaveButton)
      } else {
        const confirmButton = document.createElement('button')
        confirmButton.textContent = 'Confirmar Asistencia'
        confirmButton.addEventListener('click', (e) => {
          e.stopPropagation()
          Swal.fire({
            title: '¿Quieres confirmar tu asistencia?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí, confirmar',
            cancelButtonText: 'Cancelar'
          }).then((result) => {
            if (result.isConfirmed) {
              onConfirm(eventId)
              Swal.fire('¡Asistencia confirmada!', '', 'success')
            }
          })
        })
        buttonContainer.appendChild(confirmButton)
      }
    }
    expanded = !expanded
  }

  card.addEventListener('click', (e) => {
    toggleExpansion()
  })

  return card
}

export { EventCard }
