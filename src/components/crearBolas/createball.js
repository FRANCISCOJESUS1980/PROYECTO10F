export function createBall() {
  const ball = document.createElement('div')
  ball.classList.add('ball')
  ball.style.width = `${Math.random() * 120 + 80}px`
  ball.style.height = ball.style.width
  ball.style.left = `${Math.random() * 100}%`
  ball.style.top = `${Math.random() * 100}%`
  ball.style.animationDuration = `${Math.random() * 2 + 3}s`

  return ball
}

document.addEventListener('DOMContentLoaded', () => {
  const ballsContainer = document.createElement('div')
  ballsContainer.classList.add('balls-container')
  document.body.appendChild(ballsContainer)

  for (let i = 0; i < 20; i++) {
    ballsContainer.appendChild(createBall())
  }
})
