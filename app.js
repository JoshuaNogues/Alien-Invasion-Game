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

const player = new Player()
player.draw()

//animation loop function
function animationLoop() {
  requestAnimationFrame(animationLoop)
  player.update()
}

animationLoop()

addEventListener('keydown', e => {
  switch(e.keyCode){
    case 37:
      player.velocity.x = -3.5
      break
    case 39:
      player.velocity.x = +3.5
      break
    case 32:
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