const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d')

// const background = new Image()
// background.src = './images/background.gif'

const ship = new Image()
ship.src = './images/spaceship.png'

const aliens = new Image()
aliens.src = './images/sci-fi.png'

let intervalId;
let animationId;

function animationLoop() {
    animationId = setInterval(()=>{
      updateCanvas()
    }, 16)
  }

  function startGame() {
  
    player.x = startingX
    player.y = startingY
  
    ctx.drawImage(road, 0, 0, 500, 700)
    player.draw()
    createObstacle()
    animationLoop()
  
  }