import api from '../services/api.js'

const LoginForm = (onLogin) => {
  const form = document.createElement('form')
  form.innerHTML = `
        <h2>Iniciar Sesión</h2>
        <input type="email" id="email" placeholder="Correo electrónico" required />
        <input type="password" id="password" placeholder="Contraseña" required />
        <button type="submit">Iniciar Sesión</button>
    `

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
    } catch (error) {
      console.error('Error en el inicio de sesión:', error)
      if (error.message === 'Failed to fetch') {
        alert(
          'Error de conexión. No se pudo conectar con el servidor. Inténtalo más tarde.'
        )
      } else if (error.message.includes('Credenciales incorrectas')) {
        alert(
          'Las credenciales son incorrectas. Verifica tu correo y contraseña.'
        )
      } else {
        alert(error.message)
      }
    }
  })

  return form
}

export default LoginForm
