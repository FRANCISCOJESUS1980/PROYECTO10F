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
        alert('Debes iniciar sesión para interactuar con los eventos.')
        return
      }

      card.classList.add('expanded')
      buttonContainer.innerHTML = ''

      if (isCreator) {
        const deleteButton = document.createElement('button')
        deleteButton.textContent = 'Eliminar Evento'
        deleteButton.addEventListener('click', (e) => {
          e.stopPropagation()
          onDelete(eventId)
        })
        buttonContainer.appendChild(deleteButton)
      } else if (userIsAttending) {
        const leaveButton = document.createElement('button')
        leaveButton.textContent = 'Salir del Evento'
        leaveButton.addEventListener('click', (e) => {
          e.stopPropagation()
          onLeave(eventId)
        })
        buttonContainer.appendChild(leaveButton)
      } else {
        const confirmButton = document.createElement('button')
        confirmButton.textContent = 'Confirmar Asistencia'
        confirmButton.addEventListener('click', (e) => {
          e.stopPropagation()
          onConfirm(eventId)
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
/*
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
    }
  } catch (e) {
    console.error('Error al decodificar el token:', e)
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
      const userIsAuthenticated =
        isAuthenticated || (() => !!localStorage.getItem('token'))

      if (!userIsAuthenticated()) {
        alert('Debes iniciar sesión para interactuar con los eventos.')
        return
      }

      card.classList.add('expanded')
      buttonContainer.innerHTML = ''

      if (isCreator) {
        const deleteButton = document.createElement('button')
        deleteButton.textContent = 'Eliminar Evento'
        deleteButton.addEventListener('click', (e) => {
          e.stopPropagation()
          onDelete(eventId)
        })
        buttonContainer.appendChild(deleteButton)
      } else if (userIsAttending) {
        const leaveButton = document.createElement('button')
        leaveButton.textContent = 'Salir del Evento'
        leaveButton.addEventListener('click', (e) => {
          e.stopPropagation()
          onLeave(eventId)
        })
        buttonContainer.appendChild(leaveButton)
      } else {
        const confirmButton = document.createElement('button')
        confirmButton.textContent = 'Confirmar Asistencia'
        confirmButton.addEventListener('click', (e) => {
          e.stopPropagation()
          onConfirm(eventId)
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
*/
