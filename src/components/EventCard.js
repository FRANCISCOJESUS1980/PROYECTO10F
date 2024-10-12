const EventCard = (event, onConfirm, onLeave, isAuthenticated) => {
  const card = document.createElement('div')
  card.classList.add('event-card')

  card.innerHTML = `
    <img src="${event.imageUrl}" alt="${event.title}" class="event-image" />
    <h3 class="event-name">${event.title}</h3>
    <p class="event-description">${event.description}</p>
    <p class="event-date">Fecha: ${new Date(event.date).toLocaleString()}</p>
    <p class="event-location">Ubicación: ${event.location}</p>
    <div class="event-buttons">
      <button class="confirm-btn" id="confirm-${event._id}" ${
    !isAuthenticated ? 'disabled' : ''
  }>Confirmar Asistencia</button>
      <button class="leave-btn" id="leave-${event._id}" ${
    !isAuthenticated ? 'disabled' : ''
  }>Salir</button>
    </div>
  `

  if (isAuthenticated) {
    card
      .querySelector(`#confirm-${event._id}`)
      .addEventListener('click', () => onConfirm(event._id))
    card
      .querySelector(`#leave-${event._id}`)
      .addEventListener('click', () => onLeave(event._id))
  }

  return card
}

export { EventCard }
