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
  const isCreator = event.creator === token
  const userId = token ? JSON.parse(atob(token.split('.')[1])).id : null // Extraemos el ID del usuario del token
  const userIsAttending = event.attendees.includes(userId) // Verificamos si el usuario está en la lista de asistentes

  let expanded = false

  card.innerHTML = `
    <img src="${event.imageUrl}" alt="${event.title}" class="event-image" />
    <h3 class="event-name">${event.title}</h3>
    <p class="event-description">${event.description}</p>
    <p class="event-date">Fecha: ${new Date(event.date).toLocaleString()}</p>
    <p class="event-location">Ubicación: ${event.location}</p>
    <p class="event-attendees">Asistentes: ${event.attendees.length}</p>
    <div class="event-buttons"></div>
  `

  const buttonContainer = card.querySelector('.event-buttons')

  const toggleExpansion = () => {
    if (expanded) {
      card.classList.remove('expanded')
      buttonContainer.innerHTML = ''
    } else {
      if (!isAuthenticated()) {
        alert('Debes iniciar sesión para interactuar con los eventos.') // Alerta si no está autenticado
        return // No permitimos la expansión si no está autenticado
      }

      card.classList.add('expanded')
      buttonContainer.innerHTML = '' // Limpiamos los botones al expandir

      // Mostrar el botón correspondiente basado en la asistencia del usuario
      if (isCreator) {
        const deleteButton = document.createElement('button')
        deleteButton.textContent = 'Eliminar Evento'
        deleteButton.addEventListener('click', (e) => {
          e.stopPropagation()
          onDelete(eventId)
        })
        buttonContainer.appendChild(deleteButton)
      } else if (userIsAttending) {
        // Si el usuario ya está asistiendo, mostrar el botón "Salir del Evento"
        const leaveButton = document.createElement('button')
        leaveButton.textContent = 'Salir del Evento'
        leaveButton.addEventListener('click', (e) => {
          e.stopPropagation()
          onLeave(eventId)
        })
        buttonContainer.appendChild(leaveButton)
      } else {
        // Si el usuario no está asistiendo, mostrar el botón "Confirmar Asistencia"
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
