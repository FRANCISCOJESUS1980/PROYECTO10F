export const Modal = (content, modalId = '') => {
  const modal = document.createElement('div')
  modal.id = modalId
  modal.style.position = 'fixed'
  modal.style.top = '20%'
  modal.style.left = '20%'
  modal.style.width = '50%'
  modal.style.height = '28%'
  modal.style.backgroundColor = 'rgba(0, 0, 0, 0.7)'
  modal.style.display = 'flex'
  modal.style.alignItems = 'center'
  modal.style.justifyContent = 'center'
  modal.style.zIndex = '1001'

  const modalContent = document.createElement('div')
  modalContent.style.backgroundColor = 'var(--primary-color)'
  modalContent.style.padding = '20px'
  modalContent.style.borderRadius = '5px'

  modalContent.appendChild(content)

  const closeModalButton = document.createElement('button')
  //closeModalButton.id = 'closeModal'
  closeModalButton.className = 'button'
  closeModalButton.textContent = 'Cerrar'
  closeModalButton.onclick = () => {
    modal.remove()
  }

  modalContent.appendChild(closeModalButton)
  modal.appendChild(modalContent)

  return modal
}

export const openModal = (content, modalId) => {
  const modal = Modal(content, modalId)
  document.body.appendChild(modal)
}

export const closeModal = (modalId) => {
  const modal = document.getElementById(modalId)
  if (modal) {
    modal.remove()
  }
}
