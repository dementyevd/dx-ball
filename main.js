// мяч
class Ball {
  constructor(canvas) {
      this.canvas = canvas; // игровое поле
      this.ctx = this.canvas.getContext("2d"); // двумерное пространство поля с координатами x и y
      this.radius = 10; // радиус мяча
      this.x = this.canvas.width / 2; // начальная позиция мяча по x - центр
      this.y = this.canvas.height - 30; // начальная позиция мяча по y - над платформой
      this.dx = 2; // скорость и направление полёта мяча по x, если значение положительное - летит вправо, отрицательное - влево
      this.dy = -2; // скорость и направление полёта мяча по y, если значение положительное - летит вниз, отрицательное - вверх
      this.brick = new Brick(this.canvas, 0, 0);
  }

  // отрисовка
  draw() {
      this.ctx.beginPath(); // начало рисования
      this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2); // рисуем контур мяча
      this.ctx.fillStyle = "red"; // цвет заливки
      this.ctx.fill(); // заливка мяча
      this.ctx.closePath(); // окончание рисования
  }

  // движение мяча - метод будет вызываться постоянно для движения мяча
  update(paddle) {
      // если мяч долетел до левой или правой границы игрового поля - полетит в противоположном направлении
      if(this.x + this.dx > this.canvas.width - this.radius || this.x + this.dx < this.radius) {
          this.dx = -this.dx;
      }
      // если долетел до верхней границы - отскакивает в противоположном направлении
      if(this.y + this.dy < this.radius) {
          this.dy = -this.dy;
      }
      // если внизу улетел ниже верхней границы платформы (не попал на платформу)
      else if(this.y + this.dy > this.canvas.height - this.radius - paddle.height) {
          // если попал в пределы платформы - отскакивает вверх
          if(this.x > paddle.x && this.x < paddle.x + paddle.width) {
              this.dy = -this.dy;
          }
      }
      this.x += this.dx; // перемещение мяча по x
      this.y += this.dy; // перемещение мяча по y
  }

  // отскок от кирпича
  bounceOffBrick(brick) {
      this.dy = -this.dy; // при столкновении с кирпичом мяч полетит в противоположном направлении
  }

  // столкновения с кирпичом
  collidesWith(brick) {
      const ballX = this.x;
      const ballY = this.y;
      const brickX = brick.x;
      const brickY = brick.y;

      // если мяч попал в кирпич
      if(ballX + this.radius > brickX &&
          // ballX < brickX + Brick.width &&
          // ballX < brickX + 75 &&
          ballX < brickX + this.brick.width &&
          ballY + this.radius > brickY &&
          // ballY < brickY + Brick.height) {
          // ballY < brickY + 20) {
          ballY < brickY + this.brick.height) {
              return true;
          }
          else {
              return false;
          }
  }
}

// платформа
class Paddle {
  constructor(canvas) {
      this.canvas = canvas;
      this.ctx = this.canvas.getContext("2d");
      this.width = 80; // ширина платформы
      this.height = 20; // высота платформы
      this.rightPressed = false;
      this.leftPressed = false;
      this.x = (this.canvas.width - this.width) / 2; // ставим платформу горизонтально по центру
      // координату y не указываем, т.о. платформа будет находиться внизу игрового поля
  }

  draw() {
      this.ctx.beginPath();
      this.ctx.rect(this.x, this.canvas.height - this.height, this.width, this.height);
      this.ctx.fillStyle = "white";
      this.ctx.fill();
      this.ctx.closePath();
  }

  update() {
      // если нажимаем стрелку влево и платформа не стоит у правого края - можем двигать вправо
      if(this.rightPressed && this.x < this.canvas.width - this.width) {
          this.x += 7;
      }
      // если нажимаем стрелку влево и платформа не стоит у левого края - можем двигать влево
      else if(this.leftPressed && this.x > 0) {
          this.x -= 7;
      }
  }
}

// класс блоков (кирпичи)
class Brick {
  constructor(canvas, x, y) {
      this.canvas = canvas;
      this.ctx = this.canvas.getContext("2d");
      this.width = 75;
      this.height = 20;
      this.padding = 10; // пространство между кирпичами
      this.offsetTop = 30; // верхний отступ
      this.offsetLeft = 30; // отступ слева
      this.x = x;
      this.y = y;
      this.status = 1; // статус 1 - кирпич ещё не сталкивался с мячом, отрисовывается. статус 0 - мяч попал в кирпич, исчезает с игрового поля
  }

  draw() {
      if(this.status === 1) {
          this.ctx.beginPath();
          this.ctx.rect(this.x, this.y, this.width, this.height);
          this.ctx.fillStyle = "firebrick";
          this.ctx.fill();
          this.ctx.closePath();
      }
  }
}

// класс игры
class DXBallGame {
  constructor() {
      this.canvas = document.querySelector("#gameCanvas");
      this.ctx = this.canvas.getContext("2d");
      this.ball = new Ball(this.canvas);
      this.paddle = new Paddle(this.canvas);
      this.brick = new Brick(this.canvas, 0, 0);
      this.bricks = [];

      // создание массива кирпичей
      for(let col = 0; col < 9; col++) {
          for(let row = 0; row < 5; row++) {
              // координата кирпича по x с отступами, чтобы при отрисовке кирпичи не накладывались друг на друга
              // const brickX = col * (Brick.width + Brick.padding) + Brick.offsetLeft;
              // const brickX = col * (75 + 10) + 30;
              // const brickY = row * (Brick.height + Brick.padding) + Brick.offsetTop;
              // const brickY = row * (20 + 10) + 30;
              const brickX = col * (this.brick.width + this.brick.padding) + this.brick.offsetLeft;
              const brickY = row * (this.brick.height + this.brick.padding) + this.brick.offsetTop;
              this.bricks.push(new Brick(this.canvas, brickX, brickY));
          }
      }
      console.log(this.bricks);

      // this.rightPressed = false; // перемещение платформы вправо по умолчанию отключено
      // this.leftPressed = false; // перемещение платформы влево по умолчанию отключено

      document.addEventListener("keydown", this.keyDownHandler.bind(this)); // клавиша нажата, платформа в движении
      document.addEventListener("keyup", this.keyUpHandler.bind(this)); // клавиша отпущена, платформа не двигается
  }

  keyDownHandler(e) {
      // если нажата стрелка вправо, вправо на цифровой клавиатуре или "A"
      if(e.key == "ArrowRight" || e.key == "Right" || e.key == "d" || e.key == "в") {
          // переключаем состояние нажатия клавиши - платформа двигается
          this.paddle.rightPressed = true;
      }
      else if(e.key == "ArrowLeft" || e.key == "Left" || e.key == "a" || e.key == "ф") {
          // переключаем состояние нажатия клавиши - платформа двигается
          this.paddle.leftPressed = true;
      }
  }

  keyUpHandler(e) {
       // если нажата стрелка вправо, вправо на цифровой клавиатуре или "A"
      if(e.key == "ArrowRight" || e.key == "Right" || e.key == "d" || e.key == "в") {
          // переключаем состояние нажатия клавиши - платформа останавливается
          this.paddle.rightPressed = false;
      }
      else if(e.key == "ArrowLeft" || e.key == "Left" || e.key == "a" || e.key == "ф") {
          // переключаем состояние нажатия клавиши - платформа останавливается
          this.paddle.leftPressed = false;
      }
  }

  // обработка столкновений мяча с кирпичами
  collisionDetection() {
      this.bricks.forEach(brick => {
          // если кирпич не разбит и если есть контакт мяча с кирпичом
          if(brick.status === 1 && this.ball.collidesWith(brick)) {
              // мяч отскакивает
              this.ball.bounceOffBrick(brick);
              brick.status = 0; // кирпич разбивается
          }
      });
  }

  draw() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // очистка игрового поля, т.к. происходит постоянное обновление игрового поля
      this.ball.draw(); // отрисовываем мяч
      this.paddle.draw(); // отрисовываем платформу
      this.bricks.forEach(brick => brick.draw()); // отрисовываем кирпичи

      this.ball.update(this.paddle); // запускаем движение мяча
      this.paddle.update(); // запускаем движение платформы
      this.collisionDetection(); // включаем обработку столкновений

      requestAnimationFrame(this.draw.bind(this)); // обновление игрового поля
  }

  // запуск игры
  start() {
      this.draw();
  }
}

const game = new DXBallGame();
game.start();