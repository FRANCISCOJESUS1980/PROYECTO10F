import { openCreateEventModal } from './OpenCreateEventModal'

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
export default addCreateEventButton
