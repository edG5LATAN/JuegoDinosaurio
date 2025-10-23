var time = new Date();
var deltaTime = 0;

var sueloY = 22;
var velY = 0;
var impulso = 900;
var gravedad = 2500;

var dinoPosX = 42;
var dinoPosY = sueloY;

var sueloX = 0;
var velEscenario = 1280 / 3;
var gameVel = 1;
var score = 0;

var parado = false;
var saltando = false;

var tiempoHastaObstaculo = 2;
var tiempoObstaculoMin = 0.7;
var tiempoObstaculoMax = 1.8;
var obstaculoPosY = 16;
var obstaculos = [];

// 🌥️ Variables de nubes
var tiempoHastaNube = 0.3;
var tiempoNubeMin = 0.3;
var tiempoNubeMax = 1.0;
var nubes = [];

var contenedor;
var dino;
var textoScore;
var suelo;
var gameOver;

if (document.readyState === "complete" || document.readyState === "interactive") {
  setTimeout(Init, 1);
} else {
  document.addEventListener("DOMContentLoaded", Init);
}

function Init() {
  time = new Date();
  Start();
  Loop();
}

function Loop() {
  deltaTime = (new Date() - time) / 1000;
  time = new Date();
  update();
  requestAnimationFrame(Loop);
}

function Start() {
  gameOver = document.querySelector(".game-over");
  suelo = document.querySelector(".suelo");
  contenedor = document.querySelector(".contenedor");
  textoScore = document.querySelector(".score");
  dino = document.querySelector(".dino");

  document.addEventListener("keydown", HandleKeyDown);

  // 🖐️ Control táctil para móviles
  contenedor.addEventListener("touchstart", function (e) {
    e.preventDefault();
    Saltar();
  });
}

function HandleKeyDown(ev) {
  if (ev.code === "Space" || ev.keyCode === 32) {
    Saltar();
  }
}

function Saltar() {
  if (dinoPosY === sueloY) {
    saltando = true;
    velY = impulso;
    dino.classList.remove("dino-corriendo");
  }
}

function update() {
  if (parado) return;

  moverSuelo();
  MoverDinosaurio();
  DecidirCrearObstaculos();
  MoverObstaculos();
  DecidirCrearNubes();
  MoverNubes();
  DetectarColision();

  velY -= gravedad * deltaTime;
}

function moverSuelo() {
  sueloX += CalcularDesplazamiento();
  suelo.style.left = -(sueloX % contenedor.clientWidth) + "px";
}

function CalcularDesplazamiento() {
  return velEscenario * deltaTime * gameVel;
}

function MoverDinosaurio() {
  dinoPosY += velY * deltaTime;
  if (dinoPosY < sueloY) {
    TocarSuelo();
  }
  dino.style.bottom = dinoPosY + "px";
}

function TocarSuelo() {
  dinoPosY = sueloY;
  velY = 0;
  if (saltando) dino.classList.add("dino-corriendo");
  saltando = false;
}

function DecidirCrearObstaculos() {
  tiempoHastaObstaculo -= deltaTime;
  if (tiempoHastaObstaculo <= 0) CrearObstaculo();
}

function CrearObstaculo() {
  var obstaculo = document.createElement("div");
  contenedor.appendChild(obstaculo);
  obstaculo.classList.add("cactus");
  obstaculo.posX = contenedor.clientWidth;
  obstaculo.style.left = contenedor.clientWidth + "px";

  obstaculos.push(obstaculo);
  tiempoHastaObstaculo =
    tiempoObstaculoMin +
    (Math.random() * (tiempoObstaculoMax - tiempoObstaculoMin)) / gameVel;
}

function MoverObstaculos() {
  for (var i = obstaculos.length - 1; i >= 0; i--) {
    if (obstaculos[i].posX < -obstaculos[i].clientWidth) {
      obstaculos[i].remove();
      obstaculos.splice(i, 1);
      GanarPuntos();
    } else {
      obstaculos[i].posX -= CalcularDesplazamiento();
      obstaculos[i].style.left = obstaculos[i].posX + "px";
    }
  }
}

// 🌥️ Nubes
function DecidirCrearNubes() {
  tiempoHastaNube -= deltaTime;
  if (tiempoHastaNube <= 0) CrearNube();
}

function CrearNube() {
  var nube = document.createElement("div");
  contenedor.appendChild(nube);
  nube.classList.add("nube");
  nube.posX = contenedor.clientWidth;
  nube.style.left = contenedor.clientWidth + "px";
  nube.style.top = 20 + Math.random() * 100 + "px";

  nubes.push(nube);
  tiempoHastaNube =
    tiempoNubeMin +
    Math.random() * (tiempoNubeMax - tiempoNubeMin) / gameVel;
}

function MoverNubes() {
  for (var i = nubes.length - 1; i >= 0; i--) {
    if (nubes[i].posX < -nubes[i].clientWidth) {
      nubes[i].remove();
      nubes.splice(i, 1);
    } else {
      nubes[i].posX -= CalcularDesplazamiento() * 0.5;
      nubes[i].style.left = nubes[i].posX + "px";
    }
  }
}

function GanarPuntos() {
  score++;
  textoScore.innerText = score;
}

function DetectarColision() {
  for (var i = 0; i < obstaculos.length; i++) {
    if (obstaculos[i].posX > dinoPosX + dino.clientWidth) break;
    if (IsCollision(dino, obstaculos[i], 10, 30, 15, 20)) GameOver();
  }
}

function IsCollision(a, b, paddingTop, paddingRight, paddingBottom, paddingLeft) {
  var aRect = a.getBoundingClientRect();
  var bRect = b.getBoundingClientRect();

  return !(
    aRect.top + aRect.height - paddingBottom < bRect.top ||
    aRect.top + paddingTop > bRect.top + bRect.height ||
    aRect.left + aRect.width - paddingRight < bRect.left ||
    aRect.left + paddingLeft > bRect.left + bRect.width
  );
}

function GameOver() {
  Estrellarse();
  gameOver.style.display = "block";
}

function Estrellarse() {
  dino.classList.remove("dino-corriendo");
  dino.classList.add("dino-estrellado");
  parado = true;
}
