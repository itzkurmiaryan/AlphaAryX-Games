const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let carX = 180;
let carY = 420;
let roadSpeed = 2;
let enemySpeed = 3;
let score = 0;
let game = null;
let gameStarted = false;

let enemies = [];

// Controls (keyboard)
document.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft") moveLeft();
  if (e.key === "ArrowRight") moveRight();
});

function moveLeft() {
  if (carX > 20) carX -= 20;
}

function moveRight() {
  if (carX < 340) carX += 20;
}

// Level select
function selectLevel(level, btn) {
  if (level === "beginner") enemySpeed = 3;
  if (level === "intermediate") enemySpeed = 5;
  if (level === "advanced") enemySpeed = 7;

  document.querySelectorAll(".levels button")
    .forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
}

// Start game
function startGame() {
  if (gameStarted) return;
  gameStarted = true;
  document.getElementById("overlay").style.display = "none";
  game = setInterval(draw, 20);
}

// Draw loop
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Road
  ctx.fillStyle = "#020617";
  ctx.fillRect(0, 0, 400, 500);

  // Player car
  ctx.fillStyle = "#38bdf8";
  ctx.fillRect(carX, carY, 40, 60);

  // Enemy cars spawn
  if (Math.random() < 0.03) {
    enemies.push({
      x: Math.random() * 340 + 20,
      y: -60
    });
  }

  enemies.forEach((e, index) => {
    e.y += enemySpeed;
    ctx.fillStyle = "#ef4444";
    ctx.fillRect(e.x, e.y, 40, 60);

    // Collision
    if (
      carX < e.x + 40 &&
      carX + 40 > e.x &&
      carY < e.y + 60 &&
      carY + 60 > e.y
    ) {
      gameOver();
    }

    // Score
    if (e.y > 500) {
      enemies.splice(index, 1);
      score++;
      document.getElementById("score").innerText = score;
    }
  });
}

function gameOver() {
  clearInterval(game);
  document.getElementById("finalScore").innerText = score;
  document.getElementById("gameOver").style.display = "flex";
}
