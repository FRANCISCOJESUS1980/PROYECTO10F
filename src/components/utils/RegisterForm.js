import api from '../../services/api'
import Swal from 'sweetalert2'

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

      Swal.fire({
        title: 'Registro exitoso!',
        text: 'Bienvenido a nuestra plataforma.',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      })
    } catch (error) {
      console.error('Error en el registro:', error)

      let errorMessage = 'Ocurrió un error.'

      if (error.message.includes('Usuario ya registrado')) {
        errorMessage =
          'El usuario ya existe. Por favor, intenta con otro correo o nombre de usuario.'
      } else if (error.message.includes('password')) {
        errorMessage = 'La contraseña debe tener al menos 8 caracteres.'
      } else {
        errorMessage = error.message
      }

      Swal.fire({
        title: 'Error!',
        text: errorMessage,
        icon: 'error',
        confirmButtonText: 'Aceptar'
      })
    }
  })

  return form
}

export default RegisterForm
