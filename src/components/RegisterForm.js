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
    const email = form.querySelector('#email').value
    const password = form.querySelector('#password').value

    try {
      const user = await api('/auth/register', 'POST', { email, password })
      onRegister(user.token)
      form.reset()
    } catch (error) {
      console.error('Error en el registro:', error)
      alert(error.message)
    }
  })

  return form
}

export default RegisterForm
