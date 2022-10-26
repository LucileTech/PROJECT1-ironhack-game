//////VARIABLES
//AUDIO
const gameOverSound = new Audio("./audios/angry-cat-meow-82091.mp3");
//ajouter un son angryCatcrache
const youWinSound = new Audio("./audios/cat-purr-meow-8327.mp3");
const purrSound = new Audio("./audios/cat-purring-68797.mp3");

//ANIMATIONS
const runningImages = [];
const jumpingImages = [];
const catJump = [];
let maxFrames = 26;

let timer;
let timerAnnouncement;
let counter = 0;

let score;
let scoreAnnouncement;
let counterScore = 0;

let dialogYouWin = null;
let dialogGameOver = null;

function timerFunction(game) {
  counter++;
  if (counter > 1000) {
    game.stopGame();
    youWinSound.play();
    purrSound.play();
    dialogYouWin.showModal();
    counter = 0;
    counterScore = 0;
  } else {
    timer.innerHTML = counter;
    // timerAnnouncement.innerHTML = counter;
  }
}

// function checkEatBug(game) {
//   counterScore++;

// }

// function countBugs(game) {

//   if (counter > 100) {
//     counterBugs++;
//     game.stopGame();
//     youWinSound.play();
//     purrSound.play();
//     dialogYouWin.showModal();
//     counter = 0;
//   } else {
//     timer.innerHTML = counter;
//     timerAnnouncement.innerHTML = counter;
//   }
// }

// window.onload = () => {
//TIMER & SCORE
timer = document.getElementById("timer-level-one");
timerAnnouncement = document.getElementById("time-counter");
score = document.getElementById("bugs-level-one");
scoreAnnouncement = document.getElementById("score-counter");

// document.getElementById("level-one-screen").classList.add("hidden");

document.getElementById("start-button-level-one").onclick = () => {
  document.getElementById("intro-screen").classList.add("hidden");
  document.getElementById("level-one-screen").classList.remove("hidden");
  const game = new Game();
  game.startGame();
};
// };

function loadImages() {
  const numOfImgs = { running: 26, jumping: 26 };
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
    this.x -= 10;
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
    this.x -= 15;
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
    this.levelCount = 1;
  }
  init() {
    this.canvas = document.getElementById("canvas");
    this.ctx = canvas.getContext("2d");
    this.createEventListeners();
  }
  startGame() {
    dialogYouWin = document.getElementById("you-win-alert");
    dialogGameOver = document.getElementById("game-over-alert");
    this.intervalId = setInterval(() => {
      // if (timer === 1000) {
      //   // this.stopGame();
      //   // dialogYouWin.showModal();
      //   // counter = 0;
      //   // gameOverSound.play();
      // }
      //GAME OVER MODAL
      //YOU WIN MODAL A AJOUTER
      // const dialogYouWin = document.getElementById("you-win-alert");
      // console.log(canvas.height, canvas.width);
      this.ctx.clearRect(0, 0, canvas.width, canvas.height);
      this.frames++;
      //DOGS & BUGS APPEARANCE
      if (this.frames % 80 === 0) {
        this.dogs.push(new Dog(this.canvas, this.ctx));
      }
      this.dogs.forEach((dog) => {
        dog.image = document.getElementById(`dog${(this.frames % 21) + 1}`);
      });
      if (this.frames % 50 === 0) {
        this.bugs.push(new Bug(this.canvas, this.ctx));
      }
      this.bugs.forEach((bug) => {
        bug.image = document.getElementById(`bug${this.frames % 14}`);
      });
      //CAT RUN & JUMPS
      if (this.cat.state === "running") {
        this.cat.image = runningImages[this.frames % 26];
      } else {
        this.cat.image = jumpingImages[this.frames % 26];
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
      for (const dog of this.dogs) {
        dog.draw();
        if (this.checkCollision(dog, this.cat)) {
          this.stopGame();
          counter = -1;
          gameOverSound.play();
          dialogGameOver.showModal();
        }
        dog.move();
      }
      //DUG COUNTER A IMPLEMENTER
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

      ////////// IF LEVEL 2 // if (this.levelCount === 2)

      /////////// IF LEVEL 2 ///  if (this.frames === 1200) {
      //   this.changeLevel();
      // }
    }, 1000 / 60);
  }
  stopGame() {
    clearInterval(this.intervalId);
  }
  youWinTheGame() {
    dialogYouWin.showModal();
    counter = 0;
    gameOverSound.play();
  }

  checkCollision(dog, cat) {
    const isInX =
      dog.rightEdge() - 20 >= cat.leftEdge() + 20 &&
      dog.leftEdge() + 10 <= cat.rightEdge() - 10;
    const isInY =
      dog.topEdge() + 20 <= cat.bottomEdge() - 20 &&
      dog.bottomEdge() - 10 >= cat.topEdge() + 10;
    return isInX && isInY;
    // document.getElementById("audioLose").play();
  }
  checkEatBug(bug, cat) {
    const isInXBug =
      bug.rightEdge() >= cat.leftEdge() && bug.leftEdge() <= cat.rightEdge();
    const isInYBug =
      bug.topEdge() <= cat.bottomEdge() && bug.bottomEdge() >= cat.topEdge();
    return isInXBug && isInYBug;
    // document.getElementById("audioLose").play();
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
