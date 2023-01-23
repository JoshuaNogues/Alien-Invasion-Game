const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d')

// const background = new Image()
// background.src = './images/background.gif'

const ship = new Image()
ship.src = './images/spaceship.png'

const aliens = new Image()
aliens.src = './images/sci-fi.png'

const bullets = new Image()
bullets.src = './images/bullets.png'

class Player {
  constructor(){
    this.position = {
      x: 235,
      y: 425
    }

    this.velocity = {
      x: 0,
    }

    this.ship = ship
    this.width = 25
    this.height = 25
  }

    draw() {
      // ctx.fillStyle = 'red'
      // ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
      ctx.drawImage(this.ship, this.position.x, this.position.y, this.width, this.height)
    }

    update(){
      ctx.clearRect(0,0,500,500)
      this.draw()
      this.position.x += this.velocity.x
    }
}

class Projectile {
  constructor({position, velocity}) {
    this.position = position
    this.velocity = velocity
    this.bullets = bullets
    this.width = 50
    this.height = 50
  }
  draw(){
    ctx.drawImage(this.bullets, this.position.x, this.position.y, this.width, this.height)
  }

  update(){
    this.draw()
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y
  }

}


const player = new Player()
player.draw()
const projectiles = []

const keys = {
  ArrowLeft: {
    pressed: false
  },
  ArrowRight: {
    pressed: false
  },
  space: {
    pressed: false
  }
}

//animation loop function
function animationLoop() {
  requestAnimationFrame(animationLoop)
  player.update()
  projectiles.forEach((projectile, index) => {
    if(projectile.position.y > canvas.height){
      projectiles.splice(index, 1)
    } else {
      projectile.update()
    }
  })

  if (keys.ArrowLeft.pressed === true && player.position.x >= 1){
    player.velocity.x = -3.5
  } else if (keys.ArrowRight.pressed === true && player.position.x + player.width <= canvas.width) {
    player.velocity.x = 3.5
  } else {
    player.velocity.x = 0
  }

}

animationLoop()

addEventListener('keydown', ({key}) => {
  switch(key){
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = true
      break
    case 'ArrowRight':
      keys.ArrowRight.pressed = true
      break
    case ' ':
      projectiles.push(new Projectile({
        position: {
          x: player.position.x + -12.5,
          y: player.position.y - 15 
        },
        velocity: {
          x: 0,
          y: -5
        }
      }))
      break
  }
})

addEventListener('keyup', ({key}) => {
  switch(key){
    case 'ArrowLeft':
      player.velocity.x = -3.5
      keys.ArrowLeft.pressed = false
      break
    case 'ArrowRight':
      player.velocity.x = 3.5
      keys.ArrowRight.pressed = false
      break
    case ' ':
      break
  }
})


window.onload = () => {
  document.getElementById('start-button').onclick = () => {
    if (gameOn === false) {
      startGame();
    }
  }
}