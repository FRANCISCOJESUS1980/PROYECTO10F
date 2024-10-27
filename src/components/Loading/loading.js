const Loading = () => {
  const loadingElement = document.createElement('div')
  loadingElement.classList.add('loading')
  loadingElement.innerHTML = 'Cargando...'
  return loadingElement
}

export { Loading }
