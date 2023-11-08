let direccion = "idle";
let caminarDerecha = [];
let caminarIzquierda = [];
let idle = [];
let saltarArriba = [];
let personaje;
let velocidad = 5;
let gravedad = 1.1;
let isJumping = false;
let jumpForce = 10;
let barraProgresso;
let jumpSound, walkSound;
let playing = false;

function stopSound() {
  walkSound.stop();
  playing = false;
}

function setup() {
  createCanvas(400, 400);
  barraProgresso = document.createElement("progress");
  barraProgresso.setAttribute("value", "90");
  barraProgresso.setAttribute("max", "100");
  document.body.appendChild(barraProgresso);
  barraProgresso.style.position = "absolute";
  barraProgresso.style.top = "50%";
  barraProgresso.style.left = "50%";
  barraProgresso.style.transform = "translate(-50%, -335%)";
  barraProgresso.classList.add("mi-clase-css");

  personaje = new Sprite(width / 7, height / 1.08, 60, 50, {
    idle: idle,
    caminarDerecha: caminarDerecha,
    caminarIzquierda: caminarIzquierda,
    saltarArriba: saltarArriba,
  });
}

class Sprite {
  constructor(x, y, w, h, animations) {
    this.position = createVector(x, y);
    this.width = w;
    this.height = h;
    this.animations = animations;
    this.currentAnimation = animations.idle;
    this.currentFrame = 0;
    this.frameDelay = 10;
    this.frameDelayCounter = 0;
    this.jumpVelocity = jumpForce;
    this.jumpCount = 0;
    this.jumpHeight = 50;
    this.velocity = createVector(0, 0);
  }

  playAnimation(animationName) {
    if (this.currentAnimation != this.animations[animationName]) {
      this.currentAnimation = this.animations[animationName];
      this.currentFrame = 0;
      this.frameDelayCounter = 0;
    }
  }

  update() {
    this.frameDelayCounter++;
    if (this.frameDelayCounter >= this.frameDelay) {
      this.frameDelayCounter = 0;
      this.currentFrame++;
      if (this.currentFrame >= this.currentAnimation.length) {
        this.currentFrame = 0;
      }
    }
  }

  show() {
    image(
      this.currentAnimation[this.currentFrame],
      this.position.x - this.width / 2,
      this.position.y - this.height / 2,
      this.width,
      this.height
    );
  }
}

function preload() {
  for (let i = 1; i <= 3; i++) {
    // atacar.push(loadImage('4.png'));
    // atacar.push(loadImage('5.png'));
    // atacar.push(loadImage('6.png'));//
    caminarDerecha.push(loadImage("l8.png"));
    caminarDerecha.push(loadImage("l11.png"));
    caminarDerecha.push(loadImage("l9.png"));
    caminarIzquierda.push(loadImage("l2.png"));
    caminarIzquierda.push(loadImage("l10.png"));
    caminarIzquierda.push(loadImage("l12.png"));

    idle.push(loadImage("mn (1).png"));
    idle.push(loadImage("mn3.png"));
    idle.push(loadImage("mn2.png"));
    saltarArriba.push(loadImage("l.png"));
    saltarArriba.push(loadImage("l3.png"));
    saltarArriba.push(loadImage("l4.png"));
  }
  jumpSound = loadSound("saltar.mp3");
  walkSound = loadSound("caminar.mp3");
}

function draw() {
  barraProgresso.style.left = personaje.position.x + "px";
  barraProgresso.style.top = personaje.position.y + "px";

  background(220);

  if (keyIsDown(LEFT_ARROW)) {
    personaje.position.x -= velocidad;
    direccion = "izquierda";
    if (!playing) {
      walkSound.play();
      playing = true;
      setTimeout(stopSound, 800);
    }
  } else if (keyIsDown(RIGHT_ARROW)) {
    personaje.position.x += velocidad;
    direccion = "derecha";
    if (!playing) {
      walkSound.play();
      playing = true;
      setTimeout(stopSound, 800);
    }
  } else {
    direccion = "idle";
  }

  if (direccion === "derecha") {
    personaje.playAnimation("caminarDerecha");
  } else if (direccion === "izquierda") {
    personaje.playAnimation("caminarIzquierda");
  } else if (isJumping) {
    personaje.playAnimation("saltarArriba");
  } else if (direccion === "idle") {
    personaje.playAnimation("idle");
  }

  personaje.show();

  if (isJumping) {
    personaje.position.y -= personaje.jumpVelocity;
    personaje.jumpVelocity -= gravedad;
    if (personaje.position.y >= height - personaje.height / 2) {
      isJumping = false;
      personaje.position.y = height - personaje.height / 2;
    }
  }

  if (personaje.position.x < 0) {
    personaje.position.x = 0;
  }
  if (personaje.position.x > width) {
    personaje.position.x = width;
  }

  personaje.update();
}

function keyReleased() {
  if (!isJumping && keyCode === UP_ARROW) {
    isJumping = true;
    personaje.jumpVelocity = jumpForce;
    if (!playing) {
      jumpSound.play();
      playing = true;
      setTimeout(stopSound, 10);
    }
  }
}

function keyPressed() {
  // Si se ha soltado la tecla de salto, marcar isJumping como falso
  if (keyCode === UP_ARROW) {
    isJumping = true;
  }
}

document.getElementById("arriba").addEventListener("click", function () {
  if (!isJumping) {
    isJumping = true;
    personaje.jumpVelocity = jumpForce;
    if (!playing) {
      jumpSound.play();
      playing = true;
      setTimeout(stopSound, 10);
    }
  }
});
