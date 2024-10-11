export const Modal = (content) => {
  const modal = document.createElement('div')
  modal.style.position = 'fixed'
  modal.style.top = '0'
  modal.style.left = '0'
  modal.style.width = '100%'
  modal.style.height = '100%'
  modal.style.backgroundColor = 'rgba(0, 0, 0, 0.7)'
  modal.style.display = 'flex'
  modal.style.alignItems = 'center'
  modal.style.justifyContent = 'center'
  modal.style.zIndex = '1001'

  const modalContent = document.createElement('div')
  modalContent.style.backgroundColor = 'white'
  modalContent.style.padding = '20px'
  modalContent.style.borderRadius = '5px'
  modalContent.innerHTML = `
      <button id="closeModal">Cerrar</button>
      ${content.outerHTML}
  `

  modal.appendChild(modalContent)

  modal.querySelector('#closeModal').onclick = () => {
    modal.remove()
  }

  return modal
}
