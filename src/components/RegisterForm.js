import api from '../services/api.js'

const RegisterForm = (onRegister) => {
  const form = document.createElement('form')
  form.innerHTML = `
        <h2>Registro</h2>
        <input type="text" id="username" placeholder="Nombre de usuario" required />
        <input type="email" id="email" placeholder="Correo electrónico" required />
        <input type="password" id="password" placeholder="Contraseña" required />
        <button type="submit">Registrarse</button>
    `

  form.addEventListener('submit', async (e) => {
    e.preventDefault()

    const username = form.querySelector('#username').value
    const email = form.querySelector('#email').value
    const password = form.querySelector('#password').value

    console.log('Datos a enviar:', { username, email, password })

    try {
      const user = await api('/auth/register', 'POST', {
        username,
        email,
        password
      })
      console.log('Registro exitoso:', user)
      onRegister(user.token)
      form.reset()

      const modal = document.getElementById('registerModal')
      if (modal) {
        modal.remove()
      }
    } catch (error) {
      console.error('Error en el registro:', error)
      if (error.message.includes('Usuario ya registrado')) {
        alert(
          'El usuario ya existe. Por favor, intenta con otro correo o nombre de usuario.'
        )
      } else {
        alert(error.message)
      }
    }
  })

  return form
}

export default RegisterForm
