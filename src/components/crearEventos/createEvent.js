import { openModal, closeModal } from '../utils/Modal.js'
//import { EventCard } from '../tarjetaEventos/EventCard.js'
import Swal from 'sweetalert2'
import { loadEvents } from '../../main.js'

async function handleCreateEvent(e) {
  e.preventDefault()

  const title = document.getElementById('title').value
  const date = document.getElementById('date').value
  const location = document.getElementById('location').value
  const description = document.getElementById('description').value
  const image = document.getElementById('image').files[0]

  if (title.length < 3 || title.length > 16) {
    Swal.fire({
      icon: 'warning',
      title: 'Título inválido',
      text: 'El título debe tener entre 3 y 16 caracteres.',
      confirmButtonText: 'Corregir'
    })
    return
  }

  if (location.length > 14) {
    Swal.fire({
      icon: 'warning',
      title: 'Ubicación inválida',
      text: 'La ubicación no debe superar los 14 caracteres.',
      confirmButtonText: 'Corregir'
    })
    return
  }

  if (description.length > 20) {
    Swal.fire({
      icon: 'warning',
      title: 'Descripción inválida',
      text: 'La descripción no debe superar los 20 caracteres.',
      confirmButtonText: 'Corregir'
    })
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
        Swal.fire({
          icon: 'error',
          title: 'Error en el servidor',
          text: errorMessage.message,
          confirmButtonText: 'OK'
        })
      } else {
        throw new Error('El servidor devolvió un error inesperado.')
      }
      return
    }

    Swal.fire({
      icon: 'success',
      title: 'Evento creado',
      text: 'El evento se ha creado exitosamente.',
      confirmButtonText: 'Aceptar'
    })

    closeModal('eventModal')
    loadEvents()
  } catch (error) {
    console.error('Error al crear el evento:', error)
    Swal.fire({
      icon: 'error',
      title: 'Error al crear el evento',
      text: error.message,
      confirmButtonText: 'Intentar de nuevo'
    })
  } finally {
    submitButton.disabled = false
    submitButton.textContent = 'Crear Evento'
  }
}

export default handleCreateEvent
