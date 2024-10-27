import RegisterForm from '../utils/RegisterForm.js'
import LoginForm from '../Loginform/loginForm.js'
import { Modal } from '../utils/Modal.js'

const clearModals = () => {
  const existingModal = document.querySelector('.modal')
  if (existingModal) {
    existingModal.remove()
  }
}
const Header = (handleRegister, handleLogin) => {
  const headerElement = document.createElement('header')
  headerElement.className = 'header-container'

  headerElement.innerHTML = `
    <div class="header-left">
      <h1 class="header-title">EVENTOS</h1>
    </div>
    <img src="/assets/imagenes/header3.avif" alt="Logo" class="header-image" />
    <div class="button-container">
      <button id="registerBtn" class="header-button">Registrarse</button>
      <button id="loginBtn" class="header-button">Iniciar Sesión</button>
    </div>
  `

  headerElement.querySelector('#registerBtn').onclick = () => {
    clearModals()
    const modal = Modal(RegisterForm(handleRegister), 'registerModal')
    document.body.appendChild(modal)
  }

  headerElement.querySelector('#loginBtn').onclick = () => {
    clearModals()
    const modal = Modal(LoginForm(handleLogin), 'loginModal')
    document.body.appendChild(modal)
  }

  return headerElement
}

export default Header
