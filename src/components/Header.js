import RegisterForm from './RegisterForm.js'
import LoginForm from './loginForm.js'
import { Modal } from './Modal.js'

const clearModals = () => {
  const existingModal = document.querySelector('.modal')
  if (existingModal) {
    existingModal.remove()
  }
}

const Header = (handleRegister, handleLogin) => {
  const headerElement = document.createElement('header')
  headerElement.style.position = 'fixed'
  headerElement.style.top = '0'
  headerElement.style.left = '0'
  headerElement.style.width = '100%'
  headerElement.style.height = '60px'
  headerElement.style.backgroundColor = '#333'
  headerElement.style.color = 'white'
  headerElement.style.display = 'flex'
  headerElement.style.justifyContent = 'space-between'
  headerElement.style.alignItems = 'center'
  headerElement.style.padding = '0 20px'
  headerElement.style.zIndex = '1000'

  headerElement.innerHTML = `
    <img src="/assets/imagenes/header.jpg" alt="Logo" style="height: 40px;" />
    <div>
      <button id="registerBtn">Registrarse</button>
      <button id="loginBtn">Iniciar Sesión</button>
    </div>
  `

  headerElement.querySelector('#registerBtn').onclick = () => {
    clearModals()
    const modal = Modal(RegisterForm(handleRegister))
    document.body.appendChild(modal)
  }

  headerElement.querySelector('#loginBtn').onclick = () => {
    clearModals()
    const modal = Modal(LoginForm(handleLogin))
    document.body.appendChild(modal)
  }

  return headerElement
}

export default Header
