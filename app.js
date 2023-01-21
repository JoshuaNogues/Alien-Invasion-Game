const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d')

// const background = new Image()
// background.src = './images/background.gif'

const ship = new Image()
ship.src = './images/spaceship.png'

const aliens = new Image()
aliens.src = './images/sci-fi.png'

class Player {
  constructor(){
    this.position = {
      x: 225,
      y: 400
    }

    this.velocity = {
      x: 0,
    }

    this.ship = ship
    this.width = 50
    this.height = 50
  }

    draw() {
      // ctx.fillStyle = 'red'
      // ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
      ctx.drawImage(this.ship, this.position.x, this.position.y, this.width, this.height)
    }
}

const player = new Player()
player.draw()

function animationLoop() {
  requestAnimationFrame(animationLoop)
  player.draw()
}

animationLoop()