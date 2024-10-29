import handleCreateEvent from './createEvent'
import { openModal } from '../utils/Modal'

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
