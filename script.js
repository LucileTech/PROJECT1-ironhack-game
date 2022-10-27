//AUDIO
const gameOverSound = new Audio("./audios/angry-cat-meow-82091.mp3");
//ajouter un son angryCatcrache
const youWinSound = new Audio("./audios/cat-purr-meow-8327.mp3");
const purrSound = new Audio("./audios/cat-purring-68797.mp3");
//////VARIABLES
let timer;
let timerAnnouncement;
let counter = 1000;
let score;
let scoreAnnouncement;
let counterScore = 0;
let levelCount = 1;
let dialogYouWin = null;
let dialogGameOver = null;
let dogAppearances = Math.floor(Math.random() * (90 - 70 + 1) + 70);
let bugsAppearances = Math.floor(Math.random() * (60 - 40 + 1) + 40);
let beesAppearances = Math.floor(Math.random() * (100 - 45 + 1) + 45);
let redbugsAppearances = Math.floor(Math.random() * (110 - 90 + 1) + 90);
//ANIMATIONS
const runningImages = [];
const jumpingImages = [];
const catJump = [];
let maxFrames = 51;
//TIMER & SCORE
timer = document.getElementById("timer-level-one");
timerAnnouncement = document.getElementById("time-counter");
score = document.getElementById("bugs-level-one");
scoreAnnouncement = document.getElementById("score-counter");
//VOLUME
purrSound.volume = 1.0;
youWinSound.volume = 1.0;
gameOverSound.volume = 1.0;

function timerFunction(game) {
  counter--;
  if (counter === -1) {
    game.stopGame();
    youWinSound.play();
    dialogYouWin.showModal();
    counter = 1000;
    counterScore = 0;
    score.innerText = 0;
  } else {
    timer.innerHTML = counter;
  }
}

//INTRO RULES LINK
document.getElementById("rulesLink").onclick = function () {
  document.getElementById("intro-screen").classList.add("hidden");
  document.getElementById("level-one-screen").classList.add("hidden");
  document.getElementById("rules-screen").classList.remove("hidden");
};
//RULES START BUTTON
document.getElementById("start-button-level-one-rules").onclick = () => {
  document.getElementById("rules-screen").classList.add("hidden");
  document.getElementById("level-one-screen").classList.remove("hidden");
  const game = new Game();
  game.startGame();
};
//INTRO START BUTTON
document.getElementById("start-button-level-one").onclick = () => {
  document.getElementById("intro-screen").classList.add("hidden");
  document.getElementById("level-one-screen").classList.remove("hidden");
  const game = new Game();
  game.startGame();
};

function loadImages() {
  const numOfImgs = { running: 26, jumping: 51 };
  for (const key in numOfImgs) {
    for (let i = 1; i <= numOfImgs[key]; i++) {
      let cached = new Image();
      cached.src = `./catsprite/${key}${i}.png`;
      if (key === "running") {
        runningImages.push(cached);
      } else {
        jumpingImages.push(cached);
      }
    }
  }
}
loadImages();

///CLASS - cat - background - dog - bug - game
class Cat {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.state = "running";
    this.width = 200;
    this.height = 150;
    this.x = 50;
    this.y = this.canvas.height - 160;
    this.jumpAmount = 25;
    this.gravity = 1;
  }
  bottomEdge() {
    return this.y + this.height;
  }
  leftEdge() {
    return this.x;
  }
  rightEdge() {
    return this.x + this.width;
  }
  topEdge() {
    return this.y;
  }
  moveLeft() {
    if (this.x <= 20) {
      return;
    }
    this.x -= 16;
  }
  moveRight() {
    if (this.x >= this.canvas.width - this.width - 20) {
      return;
    }
    this.x += 16;
  }
  moveUp() {
    if (this.y <= 20) {
      return;
    }
    this.y -= 16;
    this.state = "jumping";
  }
  moveDown() {
    if (this.y >= this.canvas.height - this.height - 20) {
      return;
    }
    this.y += 16;
  }
  draw() {
    this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
  jump(amount) {
    this.y -= this.jumpAmount;
    this.jumpAmount -= this.gravity;
    // this.state = "jumping";
    if (this.y >= canvas.height - this.height) {
      this.y = canvas.height - this.height;
      this.isJumping = false;
      this.jumpAmount = 25;
      this.state = "running";
    }
  }
}

class Sky {
  constructor(canvas, ctx) {
    this.image = new Image();
    this.ctx = ctx;
    this.canvas = canvas;
    this.image.src = "./images/backgroundTrees.png";
    this.x = 0;
    this.y = 0;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
  }
  move() {
    this.x -= 3;
    this.x %= this.canvas.width;
  }
  draw() {
    this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    this.ctx.drawImage(
      this.image,
      this.x + this.width,
      this.y,
      this.width,
      this.height
    );
  }
}

class Dog {
  constructor(canvas, ctx) {
    this.image = new Image();
    this.image.src = "./images/dog3.png";
    this.ctx = ctx;
    this.canvas = canvas;
    this.x = this.canvas.width;
    // this.y = Math.floor(Math.random() * (this.canvas.width / 2)) + 20;
    this.y = this.canvas.height - 150;
    this.width = 150;
    this.height = 150;
    this.speed = Math.floor(Math.random() * (13 - 10 + 1) + 10);
  }
  bottomEdge() {
    return this.y + this.height;
  }
  leftEdge() {
    return this.x;
  }
  rightEdge() {
    return this.x + this.width;
  }
  topEdge() {
    return this.y;
  }
  draw() {
    this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
  move() {
    this.x -= this.speed;
  }
}

class Bug {
  constructor(canvas, ctx) {
    this.image = new Image();
    this.image.src = "./images/skeleton-animation_0.png";
    this.ctx = ctx;
    this.canvas = canvas;
    this.x = this.canvas.width;
    // this.y = Math.floor(Math.random() * (this.canvas.width / 2)) + 20;
    this.y = this.canvas.height - 400;
    this.width = 50;
    this.height = 50;
    // this.speed = Math.random() * 8 + 1;
    this.angle = Math.random() * 2;
    this.angleSpeed = Math.random() * 0.2;
    this.curve = Math.floor(Math.random() * (7 - 4 + 1) + 4);
  }
  bottomEdge() {
    return this.y + this.height;
  }
  leftEdge() {
    return this.x;
  }
  rightEdge() {
    return this.x + this.width;
  }
  topEdge() {
    return this.y;
  }
  draw() {
    this.ctx.scale(-1, 1);
    this.ctx.drawImage(this.image, -this.x, this.y, -this.width, this.height);
    this.ctx.scale(-1, 1);
  }
  move() {
    this.x -= 18;
    this.y += this.curve * Math.sin(this.angle);
    this.angle += this.angleSpeed;
    // if (this.x + this.width < 0) this.x = canvas.width;
  }
}

class Bee {
  constructor(canvas, ctx) {
    this.image = new Image();
    this.image.src = "./images/grass3.png";
    this.ctx = ctx;
    this.canvas = canvas;
    this.x = this.canvas.width;
    // this.y = Math.floor(Math.random() * (this.canvas.width / 2)) + 20;
    this.y = this.canvas.height - 150;
    this.width = 150;
    this.height = 150;
    this.speed = Math.floor(Math.random() * (13 - 10 + 1) + 10);
  }
  bottomEdge() {
    return this.y + this.height;
  }
  leftEdge() {
    return this.x;
  }
  rightEdge() {
    return this.x + this.width;
  }
  topEdge() {
    return this.y;
  }
  draw() {
    this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
  move() {
    this.x -= this.speed;
  }
}

class Redbug {
  constructor(canvas, ctx) {
    this.image = new Image();
    this.image.src = "./images/skeleton-animation_0.png";
    this.ctx = ctx;
    this.canvas = canvas;
    this.x = this.canvas.width;
    // this.y = Math.floor(Math.random() * (this.canvas.width / 2)) + 20;
    this.y = this.canvas.height - 400;
    this.width = 50;
    this.height = 50;
    // this.speed = Math.random() * 8 + 1;
    this.angle = Math.random() * 2;
    this.angleSpeed = Math.random() * 0.2;
    this.curve = Math.floor(Math.random() * (7 - 4 + 1) + 4);
  }
  bottomEdge() {
    return this.y + this.height;
  }
  leftEdge() {
    return this.x;
  }
  rightEdge() {
    return this.x + this.width;
  }
  topEdge() {
    return this.y;
  }
  draw() {
    this.ctx.scale(-1, 1);
    this.ctx.drawImage(this.image, -this.x, this.y, -this.width, this.height);
    this.ctx.scale(-1, 1);
  }
  move() {
    this.x -= 18;
    this.y += this.curve * Math.sin(this.angle);
    this.angle += this.angleSpeed;
    // if (this.x + this.width < 0) this.x = canvas.width;
  }
}

class Game {
  constructor() {
    this.canvas = null;
    this.intervalId = null;
    this.ctx = null;
    this.init();
    this.sky = new Sky(this.canvas, this.ctx);
    this.cat = new Cat(this.canvas, this.ctx);
    this.frames = 0;
    this.dogs = [];
    this.bugs = [];
    this.bees = [];
    this.redbugs = [];
    // this.levelCount = 1;
  }
  init() {
    this.canvas = document.getElementById("canvas");
    this.ctx = canvas.getContext("2d");
    this.createEventListeners();
  }
  startGame() {
    dialogGameOver = document.getElementById("game-over-alert");
    dialogYouWin = document.getElementById("you-win-alert");
    this.intervalId = setInterval(() => {
      this.ctx.clearRect(0, 0, canvas.width, canvas.height);
      this.frames++;
      //DOGS & BUGS APPEARANCE
      if (levelCount === 1) {
        if (this.frames % dogAppearances === 0) {
          this.dogs.push(new Dog(this.canvas, this.ctx));
        }
        this.dogs.forEach((dog) => {
          dog.image = document.getElementById(`dog${(this.frames % 21) + 1}`);
        });
      }
      if (this.frames % bugsAppearances === 0) {
        this.bugs.push(new Bug(this.canvas, this.ctx));
      }
      this.bugs.forEach((bug) => {
        bug.image = document.getElementById(`bug${this.frames % 14}`);
      });
      //CAT RUN & JUMPS
      if (this.cat.state === "running") {
        this.cat.image = runningImages[this.frames % 26];
      } else {
        this.cat.image = jumpingImages[this.frames % 51];
      }
      // console.log(this.cat.image);
      //CAT AND BACKGROUND APPEARANCE
      this.sky.draw();
      this.sky.move();
      this.cat.draw();
      //ADD CAT JUMP
      if (this.cat.isJumping) {
        this.frames %= maxFrames;
        this.cat.jump(this.cat.jumpAmount);
      }
      ////////////// if LEVEL 2 // (this.levelCount === 1)
      //DOG APPEARANCE AND GAME OVER
      if (levelCount === 1) {
        for (const dog of this.dogs) {
          dog.draw();
          if (this.checkCollision(dog, this.cat)) {
            this.stopGame();
            counter = 1001;
            counterScore = 0;
            score.innerText = 0;
            scoreAnnouncement.textContent = 0;
            gameOverSound.play();
            //GAME OVER A REMETTRE
            dialogGameOver.showModal();
          }
          dog.move();
        }
      }
      //BUG
      for (const bug of this.bugs) {
        bug.draw();
        if (!bug.hit && this.checkEatBug(bug, this.cat)) {
          counterScore++;
          score.innerText = counterScore;
          scoreAnnouncement.innerText = counterScore;
          bug.hit = true;
          let newBugArray = this.bugs.splice(this.bugs.indexOf(bug), 1);
          return newBugArray;
        }
        bug.move();
      }
      //TIMER FONCTION CALL
      timerFunction(this);
      // TRY AGAIN
      document.getElementById("try-again-button").onclick = () => {
        const game = new Game();
        game.startGame();
        dialogGameOver.close();
      };
      // TRY AGAIN
      document.getElementById("try-better-score-button").onclick = () => {
        const game = new Game();
        game.startGame();
        dialogYouWin.close();
      };
      //LEVEL 2//
      document.getElementById("level-up-button").onclick = () => {
        levelCount = 2;
        const game = new Game();
        game.startGame();
        dialogYouWin.close();
      };
      console.log(levelCount);

      if (levelCount === 2) {
        document.getElementById("level-up-button").style.display = "none";
      }
      ///////////
      //////////
      if (levelCount === 2) {
        if (this.frames % beesAppearances === 0) {
          this.bees.push(new Bee(this.canvas, this.ctx));
        }
        this.bees.forEach((bee) => {
          bee.image = document.getElementById(`bee${this.frames % 12}`);
        });
        for (const bee of this.bees) {
          bee.draw();
          if (this.checkCollisionBee(bee, this.cat)) {
            this.stopGame();
            counter = 1001;
            counterScore = 0;
            score.innerText = 0;
            scoreAnnouncement.textContent = 0;
            gameOverSound.play();
            //GAME OVER A REMETTRE
            dialogGameOver.showModal();
          }
          bee.move();
        }
        if (this.frames % redbugsAppearances === 0) {
          this.redbugs.push(new Redbug(this.canvas, this.ctx));
        }
        this.redbugs.forEach((redbug) => {
          redbug.image = document.getElementById(
            `redbug${(this.frames % 13) + 1}`
          );
        });
        for (const redbug of this.redbugs) {
          redbug.draw();
          if (!redbug.hit && this.checkEatRedBug(redbug, this.cat)) {
            counterScore++;
            score.innerText = counterScore;
            scoreAnnouncement.innerText = counterScore;
            redbug.hit = true;
            let newRedBugArray = this.redbugs.splice(
              this.redbugs.indexOf(redbug),
              1
            );
            return newRedBugArray;
          }
          redbug.move();
        }
      }
      //////////
      /////////// IF LEVEL 2 ///  if (this.frames === 1200) {
      //   this.changeLevel();
      // }
    }, 1000 / 60);
  }
  stopGame() {
    clearInterval(this.intervalId);
  }

  checkCollision(dog, cat) {
    const isInX =
      dog.rightEdge() - 20 >= cat.leftEdge() + 20 &&
      dog.leftEdge() + 20 <= cat.rightEdge() - 20;
    const isInY =
      dog.topEdge() + 20 <= cat.bottomEdge() - 20 &&
      dog.bottomEdge() - 20 >= cat.topEdge() + 20;
    return isInX && isInY;
  }
  checkEatBug(bug, cat) {
    const isInXBug =
      bug.rightEdge() >= cat.leftEdge() && bug.leftEdge() <= cat.rightEdge();
    const isInYBug =
      bug.topEdge() <= cat.bottomEdge() && bug.bottomEdge() >= cat.topEdge();
    return isInXBug && isInYBug;
  }

  checkCollisionBee(bee, cat) {
    const isInXBee =
      bee.rightEdge() - 30 >= cat.leftEdge() + 30 &&
      bee.leftEdge() + 30 <= cat.rightEdge() - 30;
    const isInYBee =
      bee.topEdge() + 30 <= cat.bottomEdge() - 30 &&
      bee.bottomEdge() - 30 >= cat.topEdge() + 30;
    return isInXBee && isInYBee;
  }

  checkEatRedBug(redbug, cat) {
    const isInXRedbug =
      redbug.rightEdge() - 20 >= cat.leftEdge() + 20 &&
      redbug.leftEdge() + 10 <= cat.rightEdge() - 10;
    const isInYRedbug =
      redbug.topEdge() + 20 <= cat.bottomEdge() - 20 &&
      redbug.bottomEdge() - 10 >= cat.topEdge() + 10;
    return isInXRedbug && isInYRedbug;
  }

  createEventListeners() {
    document.addEventListener("keydown", (event) => {
      switch (event.key) {
        case "ArrowLeft":
          this.cat.moveLeft();
          this.cat.state = "running";
          break;
        case "ArrowRight":
          this.cat.moveRight();
          break;
        case "ArrowUp":
          if (this.cat.isJumping) return;
          this.cat.isJumping = true;
          this.cat.state = "jumping";
          this.frames = 0;
          break;
        case "ArrowDown":
          this.cat.moveDown();
          break;
        default:
          break;
      }
    });
    document.addEventListener("touchstart", () => {
      if (this.cat.isJumping) return;
      this.cat.isJumping = true;
      this.cat.state = "jumping";
      this.frames = 0;
    });
  }
  ////////////////  IF LEVEL 2 ///  changeLevel() {
  //   this.frames = 0;
  //   this.game;
  //   this.cat.x = 50;
  //   this.cat.y = this.canvas.height - 160;
  //   this.dogs = [];
  //   this.bugs = [];
  //   this.levelCount++;
  // }
}
