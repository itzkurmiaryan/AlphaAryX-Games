const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let player = {x: 180, y: 550, width: 40, height: 40};
let bullets = [];
let zombies = [];
let powerUps = [];
let score = 0;
let lives = 3;
let gameInterval, zombieInterval, powerUpInterval;
let bulletSpeed = 6;

// Controls
let leftPressed = false;
let rightPressed = false;
document.addEventListener('keydown', e=>{
  if(e.key === 'ArrowLeft') leftPressed = true;
  if(e.key === 'ArrowRight') rightPressed = true;
  if(e.key===' '){ shootBullet(); }
});
document.addEventListener('keyup', e=>{
  if(e.key === 'ArrowLeft') leftPressed = false;
  if(e.key === 'ArrowRight') rightPressed = false;
});

// === Start game from overlay ===
function startGameFromOverlay(){
  document.getElementById('startOverlay').style.display='none';
  startGame();
}

// Start Game
function startGame(){
  bullets = [];
  zombies = [];
  powerUps = [];
  score = 0;
  lives = 3;
  document.getElementById('score').innerText = score;
  document.getElementById('lives').innerText = lives;
  document.getElementById('gameOver').style.display='none';

  clearInterval(gameInterval);
  clearInterval(zombieInterval);
  clearInterval(powerUpInterval);

  gameInterval = setInterval(gameLoop,16);
  zombieInterval = setInterval(spawnZombie, 1200);
  powerUpInterval = setInterval(spawnPowerUp, 15000); // every 15s
}

// Shoot Bullet
function shootBullet(){
  bullets.push({x: player.x + player.width/2 - 5, y: player.y, width: 10, height: 20});
}

// Spawn Zombies
function spawnZombie(){
  const x = Math.random()*(canvas.width-40);
  const rand = Math.random();
  let type = 'normal';
  let hp = 1;
  if(rand>0.7){ type='fast'; hp=1;}
  if(rand>0.9){ type='strong'; hp=2;}
  zombies.push({x,y:-40,width:40,height:40,type,hp});
}

// Power-up spawn
function spawnPowerUp(){
  const x = Math.random()*(canvas.width-30);
  powerUps.push({x,y:-30,width:30,height:30,type:'life'});
}

// Game Loop
function gameLoop(){
  ctx.clearRect(0,0,canvas.width,canvas.height);

  // Player movement
  if(leftPressed && player.x>0) player.x -=5;
  if(rightPressed && player.x+player.width<canvas.width) player.x +=5;

  // Draw player
  ctx.fillStyle='#22c55e';
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // Bullets
  ctx.fillStyle='#facc15';
  bullets.forEach((b,i)=>{
    b.y -= bulletSpeed;
    ctx.fillRect(b.x,b.y,b.width,b.height);
    if(b.y<0) bullets.splice(i,1);
  });

  // Zombies
  zombies.forEach((z, zi) => {
    // Speed by type
    if(z.type==='normal') z.y +=2;
    if(z.type==='fast') z.y +=4;
    if(z.type==='strong') z.y +=1.5;

    // Draw zombies
    ctx.fillStyle = z.type==='normal'?'#ef4444':
                    (z.type==='fast'?'#f97316':'#b91c1c');
    ctx.fillRect(z.x, z.y, z.width, z.height);

    // Collision with player ONLY
    if(collide(z, player)){
      zombies.splice(zi,1);
      lives--;
      document.getElementById('lives').innerText = lives;
      if(lives <= 0) endGame();
      return; // skip bullet collision after touching player
    }

    // Collision with bullets
    bullets.forEach((b, bi) => {
      if(collide(z, b)){
        z.hp--;
        bullets.splice(bi,1);
        if(z.hp <=0){
          zombies.splice(zi,1);
          let points = z.type==='normal'?10:(z.type==='fast'?15:20);
          score += points;
          document.getElementById('score').innerText = score;
        }
      }
    });

    // Zombie escapes past bottom → just remove it
    if(z.y > canvas.height){
      zombies.splice(zi,1);
    }
  });

  // Power-ups
  powerUps.forEach((p,pi)=>{
    p.y+=2;
    ctx.fillStyle='#22c55e';
    ctx.fillRect(p.x,p.y,p.width,p.height);

    if(collide(p,player)){
      if(p.type==='life'){ lives++; document.getElementById('lives').innerText=lives; }
      powerUps.splice(pi,1);
    }

    if(p.y>canvas.height) powerUps.splice(pi,1);
  });
}

// Collision
function collide(a,b){
  return a.x < b.x+b.width &&
         a.x+a.width > b.x &&
         a.y < b.y+b.height &&
         a.y+a.height > b.y;
}

// End Game
function endGame(){
  clearInterval(gameInterval);
  clearInterval(zombieInterval);
  clearInterval(powerUpInterval);
  document.getElementById('finalScore').innerText=score;
  document.getElementById('gameOver').style.display='flex';
}

// Back to menu
function backToMenu(){
  clearInterval(gameInterval);
  clearInterval(zombieInterval);
  clearInterval(powerUpInterval);
  document.getElementById('gameOver').style.display='none';
  document.getElementById('startOverlay').style.display='flex';
}
