const cat = document.getElementById("cat");
const dog = document.getElementById("dog");
const score = document.getElementById("score");
// const gameOverScreen = document.getElementsByClassName("game-over-screen");
/* INTRODUCTION SCREEN */

// startButton.addEventListener("click", startGame);

// function startGame() {
//   // hiddenIntro.classList.add("hidden");
// }

/* LEVEL 1 GAME SCREEN */

// function jump() {
//   cat.classList.add("jump-animation");
//   setTimeout(() => {
//     cat.classList.remove("jump-animation");
//   }, 500);
// }

// document.addEventListener("keypress", () => {
//   if (!cat.classList.contains("jump-animation")) {
//     jump();
//   }
// });

// setInterval(() => {
//   score.innerText++;
//   const catTop = parseInt(window.getComputedStyle(cat).getPropertyValue("top"));
//   const dogLeft = parseInt(
//     window.getComputedStyle(dog).getPropertyValue("left")
//   );
//   console.log(dogLeft);
//   if (dogLeft < 0) {
//     dog.style.display = "none";
//   } else {
//     dog.style.display = "";
//   }

//   // if (dogLeft < 50 && dogLeft > 0 && catTop > 150) {
//   //   // alert("You got a score of: " + score.innerText + "Play again ?");
//   //   // location.reload();
//   // }
// }, 50);

/* LEVEL 2 GAME SCREEN */

window.onload = () => {
  document.getElementById("start-button-level-two").onclick = () => {
    const game = new Game();
    game.startGame();
  };
};
const runningImages = [];
const jumpingImages = [];
function loadImages() {
  const numOfImgs = { running: 26, jumping: 26 };

  for (key in numOfImgs) {
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
console.log(runningImages, jumpingImages);
const catJump = [];
// let frames = 0;
let maxFrames = 26;
// image.src = character[frames];

class Cat {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.state = "running";
    this.width = 200;
    this.height = 150;
    this.x = 50;
    this.y = this.canvas.height - 160;
    this.jumpAmount = 10;
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
    this.state = "jumping";
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

// for (let i = 0; i < 22; i++) {
//   let img = new Image();
//   img.src = `./catsprite/running${i}.png`;
// }

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
  }
  init() {
    this.canvas = document.getElementById("canvas");
    this.ctx = canvas.getContext("2d");
    this.createEventListeners();
  }
  startGame() {
    this.intervalId = setInterval(() => {
      this.ctx.clearRect(0, 0, canvas.width, canvas.height);
      this.frames++;
      if (this.frames % 120 === 0) {
        this.dogs.push(new Dog(this.canvas, this.ctx));
      }
      if (this.cat.state === "running") {
        this.cat.image = runningImages[this.frames % 26];
      } else {
        this.cat.image = jumpingImages[this.frames % 26];
      }

      //   document.getElementById(
      //     `${this.cat.state}${(this.frames % 26) + 1}`
      //   ).src;

      //
      console.log();
      this.sky.draw();
      this.sky.move();
      this.cat.draw();

      //add jump//

      if (this.cat.isJumping) {
        this.frames %= maxFrames;
        this.cat.jump(this.cat.jumpAmount);
      }

      //end add jump//
      for (const dog of this.dogs) {
        dog.draw();
        if (this.checkCollision(dog, this.cat)) {
          this.stopGame();
        }
        dog.move();
      }
    }, 1000 / 60);
  }

  stopGame() {
    clearInterval(this.intervalId);
    // gameOverScreen.classList.remove(hidden);
  }

  checkCollision(dog, cat) {
    const isInX =
      dog.rightEdge() >= cat.leftEdge() && dog.leftEdge() <= cat.rightEdge();
    const isInY =
      dog.topEdge() <= cat.bottomEdge() && dog.bottomEdge() >= cat.topEdge();
    return isInX && isInY;
  }

  createEventListeners() {
    document.addEventListener("keydown", (event) => {
      // console.log(event.key)
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
}

class Dog {
  constructor(canvas, ctx) {
    this.image = new Image();
    this.image.src = "./images/dog3.png";
    this.ctx = ctx;
    this.canvas = canvas;
    this.x = this.canvas.width;
    // this.y = Math.floor(Math.random() * (this.canvas.width / 2)) + 20;
    this.y = this.canvas.height - 100;
    this.width = 100;
    this.height = 100;
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
    // if (image.complete) {
    //   this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    // } else {
    //   this.ctx.fillRect(this.x, this.y, this.width, this.height); // image placeholder
    // }
    this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
  move() {
    this.x -= 4;
  }
}
