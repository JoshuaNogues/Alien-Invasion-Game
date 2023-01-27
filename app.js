const startButton = document.getElementById("start-button");
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const bullets = new Image();
bullets.src = "images/bullets.png";
const maxAlienVelocity = 3;
const minAlienSpawnInterval = 500;

let gameOn = false;
let score = 0;
let lives = 3;
let bossId;
let alienId;
let startGameId;
let heartId;
let heartSpawnInterval = 45000;
let alienSpawnInterval = 1500;
let alienVelocity = 0.75;

class Player {
  constructor() {
    this.position = {
      x: 235,
      y: 435,
    };

    this.velocity = {
      x: 0,
    };

    const ship = new Image();
    ship.src = "images/spaceship.png";
    ship.onload = () => {
      this.ship = ship;
      this.width = 25;
      this.height = 25;
    };
  }

  draw() {
    if (this.ship)
      ctx.drawImage(
        this.ship,
        this.position.x,
        this.position.y,
        this.width,
        this.height
      );
  }

  update() {
    ctx.clearRect(0, 0, 500, 500);
    this.draw();
    this.position.x += this.velocity.x;
  }
}

class Projectile {
  constructor({ position, velocity }) {
    this.position = position;
    this.velocity = velocity;
    this.bullets = bullets;
    this.width = 50;
    this.height = 50;
  }
  draw() {
    ctx.drawImage(
      this.bullets,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}

class Alien {
  constructor() {
    this.position = {
      x: Math.random() * 500,
      y: 0,
    };
    this.velocity = {
      y: alienVelocity,
    };
    const alien = new Image();
    alien.src = "images/sci-fi.png";
    alien.onload = () => {
      this.alien = alien;
      this.width = 25;
      this.height = 25;
    };
  }

  draw() {
    if (this.alien)
      ctx.drawImage(
        this.alien,
        this.position.x,
        this.position.y,
        this.width,
        this.height
      );
  }

  update() {
    this.draw();
    this.position.y += this.velocity.y;
  }
}

class Boss {
  constructor() {
    this.position = {
      x: Math.random() * 500,
      y: 0,
    };
    this.velocity = {
      y: 0.25,
    };
    const boss = new Image();
    boss.src = "images/boss.png";
    boss.onload = () => {
      this.boss = boss;
      this.width = 75;
      this.height = 75;
    };
    this.health = 100;
  }

  draw() {
    if (this.boss)
      ctx.drawImage(
        this.boss,
        this.position.x,
        this.position.y,
        this.width,
        this.height
      );

    //health bar
    ctx.fillStyle = "red";
    ctx.fillRect(this.position.x, this.position.y - 10, this.width, 5);
    ctx.fillStyle = "green";
    ctx.fillRect(
      this.position.x,
      this.position.y - 10,
      (this.width * this.health) / 100,
      5
    );
  }

  update() {
    this.draw();
    this.position.y += this.velocity.y;
  }
}

class Heart {
  constructor() {
    this.position = {
      x: Math.random() * 500,
      y: 0,
    };
    this.velocity = {
      y: 2.5,
    };
    const heart = new Image();
    heart.src = "images/heart.png";
    heart.onload = () => {
      this.heart = heart;
      this.width = 25;
      this.height = 25;
    };
  }

  draw() {
    if (this.heart)
      ctx.drawImage(
        this.heart,
        this.position.x,
        this.position.y,
        this.width,
        this.height
      );
  }

  update() {
    this.draw();
    this.position.y += this.velocity.y;
  }
}

const player = new Player();
const projectiles = [];
const aliens = [];
const hearts = [];
const bosses = [];

const keys = {
  ArrowLeft: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
  space: {
    pressed: false,
  },
};

function animationLoop() {
  player.update();

  updateAndDrawScore();

  determineLevel();

  checkAndDrawProjectiles();

  checkCollision();

  checkAlienCollision();

  checkHeartCollision();

  checkBossCollision();

  checkPlayerLostLife();

  checkLoseCondition();

  updateObjects();

  controlPlayer();
}

function updateAndDrawScore() {
  ctx.fillStyle = "white";
  ctx.font = "18px Black Ops One";
  ctx.fillText("Score: " + score, 10, 480);
}

function determineLevel() {
  const levels = [
    "Level 1",
    "Level 2",
    "Level 3",
    "Level 4",
    "Level 5",
    "Level 6",
    "Level 7",
    "Level 8",
    "Level 9",
    "Level 10! Max LVL!",
  ];

  for (let i = 0; i < levels.length; i++) {
    if (score === i * 100) {
      ctx.fillStyle = "white";
      ctx.font = "30px Black Ops One";
      ctx.fillText(levels[i], canvas.width / 2 - 70, canvas.height / 2);
    }
  }
}

function checkAndDrawProjectiles() {
  projectiles.forEach((projectile, index) => {
    if (projectile.position.y > canvas.height) {
      projectiles.splice(index, 1);
    } else {
      projectile.update();
    }
  });
}

function checkAlienCollision() {
  aliens.forEach((alien, index) => {
    if (
      alien.position.y >= canvas.height ||
      aliensCollideWithPlayer() ||
      bossCollideWithPlayer()
    ) {
      aliens.splice(index, 1);
      lives = lives - 1;
    }
  });
}

function aliensPassedPlayer() {
  let passed = false;
  aliens.forEach((alien) => {
    if (alien.position.y === player.position.y) {
      passed = true;
    }
  });
  return passed;
}

function aliensCollideWithPlayer() {
  let collision = false;
  aliens.forEach((alien) => {
    if (
      alien.position.x < player.position.x + player.width &&
      alien.position.x + alien.width > player.position.x &&
      alien.position.y < player.position.y + player.height &&
      alien.height + alien.position.y > player.position.y
    ) {
      collision = true;
    }
  });
  return collision;
}

function heartsCollideWithPlayer() {
  let heartCollision = false;
  hearts.forEach((heart) => {
    if (
      heart.position.x < player.position.x + player.width &&
      heart.position.x + heart.width > player.position.x &&
      heart.position.y < player.position.y + player.height &&
      heart.height + heart.position.y > player.position.y
    ) {
      heartCollision = true;
    }
  });
  return heartCollision;
}

function checkHeartCollision() {
  hearts.forEach((heart, index) => {
    if (heartsCollideWithPlayer()) {
      hearts.splice(index, 1);
      lives = lives + 1;
    }
  });
}

function bossCollideWithPlayer() {
  let collision = false;
  bosses.forEach((boss) => {
    if (
      boss.position.x < player.position.x + player.width &&
      boss.position.x + boss.width > player.position.x &&
      boss.position.y < player.position.y + player.height &&
      boss.height + boss.position.y > player.position.y
    ) {
      collision = true;
    }
  });
  return collision;
}

function checkCollision() {
  for (let i = 0; i < projectiles.length; i++) {
    for (let j = 0; j < aliens.length; j++) {
      // check if the bounding boxes of the projectiles and aliens overlap
      if (
        projectiles[i].position.x < aliens[j].position.x + aliens[j].width &&
        projectiles[i].position.x + projectiles[i].width >
          aliens[j].position.x &&
        projectiles[i].position.y < aliens[j].position.y + aliens[j].height &&
        projectiles[i].position.y + projectiles[i].height > aliens[j].position.y
      ) {
        // get the image data of the projectiles and aliens at the coordinates of the collision
        let projData = ctx.getImageData(
          projectiles[i].position.x,
          projectiles[i].position.y,
          projectiles[i].width,
          projectiles[i].height
        );
        let alienData = ctx.getImageData(
          aliens[j].position.x,
          aliens[j].position.y,
          aliens[j].width,
          aliens[j].height
        );

        // check if any of the pixels of the projectiles and aliens overlap
        for (let p = 0; p < projData.data.length; p += 4) {
          for (let a = 0; a < alienData.data.length; a += 4) {
            if (projData.data[p + 3] !== 0 && alienData.data[a + 3] !== 0) {
              // collision detected
              projectiles.splice(i, 1);
              aliens.splice(j, 1);
              i--;
              j--;
              score += 10; // Increment the score by 10
              if (alienVelocity < maxAlienVelocity) {
                alienVelocity += 0.025; // Increase the velocity of new aliens by 0.025
              }
              if (alienSpawnInterval > minAlienSpawnInterval) {
                alienSpawnInterval -= 100; // Decrease the spawn interval of new aliens by 100ms
              }
              return;
            }
          }
        }
      }
    }
  }
}

function checkBossCollision() {
  for (let i = 0; i < projectiles.length; i++) {
    for (let j = 0; j < bosses.length; j++) {
      // check if the bounding boxes of the projectiles and aliens overlap
      if (
        projectiles[i].position.x < bosses[j].position.x + bosses[j].width &&
        projectiles[i].position.x + projectiles[i].width >
          bosses[j].position.x &&
        projectiles[i].position.y < bosses[j].position.y + bosses[j].height &&
        projectiles[i].position.y + projectiles[i].height > bosses[j].position.y
      ) {
        // get the image data of the projectiles and bosses at the coordinates of the collision
        let projData = ctx.getImageData(
          projectiles[i].position.x,
          projectiles[i].position.y,
          projectiles[i].width,
          projectiles[i].height
        );
        let bossData = ctx.getImageData(
          bosses[j].position.x,
          bosses[j].position.y,
          bosses[j].width,
          bosses[j].height
        );

        // check if any of the pixels of the projectiles and bosses overlap
        for (let p = 0; p < projData.data.length; p += 4) {
          for (let a = 0; a < bossData.data.length; a += 4) {
            if (projData.data[p + 3] !== 0 && bossData.data[a + 3] !== 0) {
              // collision detected
              projectiles.splice(i, 1);
              bosses[j].health -= 10;
              console.log(bosses[j].health);
              if (bosses[j].health === 0) {
                bosses.splice(j, 1);
              }
              i--;
              j--;
              score += 5; // Increment the score by 2
              return;
            }
          }
        }
      }
    }
  }
}

function checkPlayerLostLife() {
  if (aliensPassedPlayer() || aliensCollideWithPlayer()) {
    lives = lives - 1;
  }
}

function checkLoseCondition() {
  if (lives <= 0) {
    ctx.fillStyle = "white";
    ctx.font = "30px Black Ops One";
    ctx.fillText("Game Over", canvas.width / 2 - 90, canvas.height / 2);
    clearInterval(startGameId); // Stop animation loop
  } else {
    ctx.fillStyle = "white";
    ctx.font = "18px Black Ops One";
    ctx.fillText("Lives: " + lives, 420, 480);
  }
}

function updateObjects() {
  aliens.forEach((alien) => {
    alien.update();
  });

  hearts.forEach((heart) => {
    heart.update();
  });

  bosses.forEach((boss) => {
    boss.update();
  });
}

function controlPlayer() {
  if (keys.ArrowLeft.pressed === true && player.position.x >= 1) {
    player.velocity.x = -3.5;
  } else if (
    keys.ArrowRight.pressed === true &&
    player.position.x + player.width <= canvas.width
  ) {
    player.velocity.x = 3.5;
  } else {
    player.velocity.x = 0;
  }
}

addEventListener("keydown", ({ key }) => {
  switch (key) {
    case "ArrowLeft":
      keys.ArrowLeft.pressed = true;
      break;
    case "ArrowRight":
      keys.ArrowRight.pressed = true;
      break;
    case " ":
      projectiles.push(
        new Projectile({
          position: {
            x: player.position.x + -12.5,
            y: player.position.y - 15,
          },
          velocity: {
            x: 0,
            y: -5,
          },
        })
      );
      document.getElementById("pew").play();
      break;
  }
});

addEventListener("keyup", ({ key }) => {
  switch (key) {
    case "ArrowLeft":
      player.velocity.x = -3.5;
      keys.ArrowLeft.pressed = false;
      break;
    case "ArrowRight":
      player.velocity.x = 3.5;
      keys.ArrowRight.pressed = false;
      break;
  }
});

window.addEventListener("click", () => {
  document.getElementById("song").play();
});

startButton.addEventListener("mousedown", function () {
  gameOn = true;

  if (gameOn) {
    alienId = setInterval(() => {
      aliens.push(new Alien());
    }, alienSpawnInterval);
    heartId = setInterval(() => {
      hearts.push(new Heart());
    }, heartSpawnInterval);
    bossId = setInterval(() => {
      bosses.push(new Boss());
    }, 20000);
    startGameId = setInterval(() => {
      animationLoop();
    }, 8);
  }
});