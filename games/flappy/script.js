const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let birdY = 200;
let gravity = 0;
let jump = -6;
let pipes = [];
let frame = 0;
let score = 0;
let speed = 0;
let game = null;
let gameStarted = false;

// Controls
document.addEventListener("keydown", e => {
  if (e.code === "Space") flap();
});
canvas.addEventListener("click", flap);

function flap() {
  if (!gameStarted) return;
  gravity = jump;
}

// Level select
function selectLevel(level, btn) {
  if (level === "beginner") jump = -6;
  if (level === "intermediate") jump = -7;
  if (level === "advanced") jump = -8;

  // highlight button
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

function draw() {
  ctx.clearRect(0,0,canvas.width,canvas.height);

  // Bird
  gravity += 0.4;
  birdY += gravity;
  ctx.fillStyle = "#38bdf8";
  ctx.beginPath();
  ctx.arc(80, birdY, 12, 0, Math.PI * 2);
  ctx.fill();

  // Pipes
  if (frame % 90 === 0) {
    let top = Math.random() * 200 + 50;
    pipes.push({ x: 400, top });
  }

  pipes.forEach(p => {
    p.x -= 2;

    // Top pipe
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(p.x, 0, 50, p.top);

    // Bottom pipe
    ctx.fillRect(p.x, p.top + 120, 50, 500);

    // Collision
    if (
      80 > p.x && 80 < p.x + 50 &&
      (birdY < p.top || birdY > p.top + 120)
    ) gameOver();

    // Score
    if (p.x === 80) {
      score++;
      document.getElementById("score").innerText = score;
    }
  });

  // Ground or sky collision
  if (birdY < 0 || birdY > 500) gameOver();

  frame++;
}

function gameOver() {
  clearInterval(game);
  document.getElementById("finalScore").innerText = score;
  document.getElementById("gameOver").style.display = "flex";
}
