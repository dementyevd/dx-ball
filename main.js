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
      this.canvas.height - this.radius - paddle.height
    ) {
      if (this.x > paddle.x && this.x < paddle.x + paddle.width) {
        this.dy = -this.dy;
      }
    }
    this.x += this.dx;
    this.y += this.dy;
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
    if (rightPressed && this.x < this.canvas.width - this.width) {
      this.x += 7;
    } else if (leftPressed && this.x > 0) {
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
    
}
