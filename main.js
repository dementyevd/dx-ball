//мяч
class Ball {
  constructor(canvas) {
    this.canvas = canvas; //игровое поле
    this.ctx = this.canvas.getContext("2d"); //двумерное пространство
    this.radius = 10;
    this.x = this.canvas.width / 2;
    this.y = this.canvas.height - 30;
    this.dx = 2;
    this.dy = -2;
  }
  //отрисовка
  draw() {
    this.ctx.beginPath(); //начало рисования
    this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2); //рисуем мяч
    this.ctx.fillStyle = "gold";
    this.ctx.fill(); //заливка мяча
    this.ctx.closePath(); //окончание рисования
  }
  //движение мяча
  update() {
    if (
      this.x + this.dx > this.canvas.width - this.radius ||
      this.x + this.dx < this.radius
    ) {
      this.dx = -this.dx;
    }

    if (this.y + this.dy < this.radius) {
      this.dy = -this.dy;
    } else if (
      this.y + this.dy >
      this.canvas.height - this.radius - Paddle.height
    ) {
      if (this.x > Paddle.x && this.x < Paddle.x + Paddle.width) {
        this.dy = -this.dy;
      }
    }
    this.x += this.dx;
    this.y += this.dy;
  }

  bounceOffBrick(brick) {
    this.dy = -this.dy;
  }

  collidesWith(brick) {
    const ballX = this.x;
    const ballY = this.y;
    const brickX = brick.x;
    const brickY = brick.y;
    if (
      ballX + this.radius > brickX &&
      ballX < brickX + Brick.width &&
      ballY + this.radius > brickY &&
      ballY < brickY + Brick.height
    ) {
      return true;
    } else {
      false;
    }
  }
}

//платформа
class Paddle {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");
    this.width = 80;
    this.height = 20;
    this.x = (this.canvas.width - this.width) / 2;
    this.rightPressed = false;
    this.leftPressed = false;
  }

  draw() {
    this.ctx.beginPath(); //начало рисования
    this.ctx.rect(
      this.x,
      this.canvas.height - this.height,
      this.width,
      this.height
    );
    this.ctx.fillStyle = "white";
    this.ctx.fill();
    this.ctx.closePath(); //окончание рисования
  }

  update() {
    if (this.rightPressed && this.x < this.canvas.width - this.width) {
      this.x += 7;
    } else if (this.leftPressed && this.x > 0) {
      this.x -= 7;
    }
  }
}

//блоки
class Brick {
  constructor(canvas, x, y) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");
    this.width = 75;
    this.height = 20;
    this.padding = 10;
    this.offSetTop = 30;
    this.offSetLeft = 30;
    this.x = x;
    this.y = y;
    this.status = 1;
  }

  draw() {
    if (this.status === 1) {
      this.ctx.beginPath();
      this.ctx.rect(this.x, this.y, this.width, this.height);
      this.ctx.fillStyle = "firebrick";
      this.ctx.fill();
      this.ctx.closePath();
    }
  }
}

class DXBallGame {
  constructor() {
    this.canvas = document.querySelector("#gameCanvas");
    this.ctx = this.canvas.getContext("2d");
    this.ball = new Ball(this.canvas);
    this.paddle = new Paddle(this.canvas);
    this.bricks = [];
    //создание блоков
    for (let col = 0; col < 10; col++) {
      for (let row = 0; row < 5; row++) {
        const brickX = col * (Brick.width + Brick.padding) + Brick.offSetLeft;
        const brickY = row * (Brick.height + Brick.padding) + Brick.offSetTop;
        this.bricks.push(new Brick(this.canvas, brickX, brickY));
      }
    }

    this.rightPressed = false;
    this.leftPressed = false;

    document.addEventListener("keydown", this.keyDownHandler.bind(this));
    document.addEventListener("keyup", this.keyUpHandler.bind(this));
  }

  keyDownHandler(e) {
    if (e.key == "ArrowRight" || e.key == "Right" || e.key == "D") {
      this.rightPressed = false;
    } else if (e.key == "ArrowLeft" || e.key == "Left" || e.key == "A") {
      this.leftPressed = false;
    }
  }

  keyUpHandler(e) {
    if (e.key == "ArrowRight" || e.key == "Right" || e.key == "D") {
      this.rightPressed = false;
    } else if (e.key == "ArrowLeft" || e.key == "Left" || e.key == "A") {
      this.leftPressed = false;
    }
  }

  collisionDetection() {
    this.bricks.forEach((brick) => {
      if (brick.status === 1 && this.ball.collidesWith(brick)) {
        this.ball.bounceOffBrick(brick);
        brick.status = 0;
      }
    });
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); //очистка игрового поля
    this.ball.draw();
    this.paddle.draw();
    this.bricks.forEach((brick) => brick.draw());
    this.ball.update();
    this.paddle.update();
    this.collisionDetection();
    requestAnimationFrame(this.draw.bind(this)); //обновление игрового поля
  }

  //запуск игры
  start() {
    this.draw();
  }
}

const game = new DXBallGame();
game.start();
