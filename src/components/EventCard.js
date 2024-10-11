const EventCard = (event, onConfirm, onLeave) => {
  const card = document.createElement('div')
  card.classList.add('event-card')
  card.innerHTML = `
      <h3>${event.title}</h3>
      <p>${event.description}</p>
      <p>Fecha: ${new Date(event.date).toLocaleString()}</p>
      <p>Ubicación: ${event.location}</p>
      <img src="${event.imageUrl}" alt="${event.title}" />
      <button id="confirm-${event._id}">Confirmar Asistencia</button>
      <button id="leave-${event._id}">Salir</button>
  `

  card
    .querySelector(`#confirm-${event._id}`)
    .addEventListener('click', () => onConfirm(event._id))
  card
    .querySelector(`#leave-${event._id}`)
    .addEventListener('click', () => onLeave(event._id))

  return card
}

export { EventCard }
