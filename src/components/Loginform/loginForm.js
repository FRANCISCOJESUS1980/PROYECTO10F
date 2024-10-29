import api from '../../services/api.js'
import Swal from 'sweetalert2'

const LoginForm = (onLogin) => {
  const form = document.createElement('form')
  form.innerHTML = `
        <h2>Iniciar Sesión</h2>
        <input type="email" id="email" placeholder="Correo electrónico" required />
        <input type="password" id="password" placeholder="Contraseña" required />
        <button type="submit">Iniciar Sesión</button>`

  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    const email = form.querySelector('#email').value
    const password = form.querySelector('#password').value

    try {
      const user = await api('/auth/login', 'POST', { email, password })
      onLogin(user.token)
      form.reset()

      const modal = document.getElementById('loginModal')
      if (modal) {
        modal.remove()
      }

      Swal.fire({
        icon: 'success',
        title: 'Inicio de sesión exitoso',
        text: 'Bienvenido de nuevo',
        timer: 2000,
        showConfirmButton: false
      })
    } catch (error) {
      console.error('Error en el inicio de sesión:', error)

      const errorMessage = error.message || 'Error en el inicio de sesión'

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage
      })
    }
  })

  return form
}

export default LoginForm
