const boardEl = document.getElementById('board');
const movesEl = document.getElementById('moves');
const matchesEl = document.getElementById('matches');
const timerEl = document.getElementById('timer');
const gameOverEl = document.getElementById('gameOver');
const totalMovesEl = document.getElementById('totalMoves');
const totalTimeEl = document.getElementById('totalTime');
const finalScoreEl = document.getElementById('finalScore');
const highScoreEl = document.getElementById('highScore');

let icons = ['🍎','🍌','🍇','🍓','🍒','🥝','🍉','🍍','🥑','🥭','🍑','🍋','🍈','🥥','🥕','🌽'];
let cards = [];
let firstCard = null;
let secondCard = null;
let moves = 0;
let matches = 0;
let maxMatches = 0;
let timer = 0;
let timerInterval = null;
let score = 0;
let level = 'beginner';
let highScore = localStorage.getItem('memoryHighScore') || 0;

// Shuffle helper
function shuffle(array){
  for(let i=array.length-1;i>0;i--){
    let j = Math.floor(Math.random()*(i+1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Start Game with level
function startGame(selectedLevel){
  level = selectedLevel;
  gameOverEl.style.display = 'none';
  document.getElementById('levelOverlay').style.display = 'none';

  // Set board size
  let size;
  if(level==='beginner') size = 4;
  else if(level==='intermediate') size = 6;
  else size = 8;

  maxMatches = (size*size)/2;

  // Prepare cards
  cards = shuffle(icons.slice(0, maxMatches).concat(icons.slice(0, maxMatches)));
  boardEl.style.gridTemplateColumns = `repeat(${size}, 80px)`;

  // Clear board
  boardEl.innerHTML = '';
  firstCard = null;
  secondCard = null;
  moves = 0;
  matches = 0;
  timer = 0;
  score = 0;

  movesEl.innerText = moves;
  matchesEl.innerText = matches;
  timerEl.innerText = timer;

  // Create card elements
  cards.forEach(icon=>{
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerText = icon;
    card.addEventListener('click', flipCard);
    boardEl.appendChild(card);
  });

  // Start timer
  clearInterval(timerInterval);
  timerInterval = setInterval(()=>{
    timer++;
    timerEl.innerText = timer;
  },1000);
}

// Flip card
function flipCard(e){
  const card = e.target;
  if(card.classList.contains('flipped') || card.classList.contains('matched')) return;

  card.classList.add('flipped');

  if(!firstCard){
    firstCard = card;
  } else {
    secondCard = card;
    moves++;
    movesEl.innerText = moves;

    if(firstCard.innerText === secondCard.innerText){
      firstCard.classList.add('matched');
      secondCard.classList.add('matched');
      matches++;
      matchesEl.innerText = matches;

      // Score formula: matches*100 - time penalty
      score = matches*100 - timer*2;
      score = score < 0 ? 0 : score;

      resetFlipped();

      if(matches===maxMatches){
        endGame();
      }
    } else {
      setTimeout(()=>{
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        resetFlipped();
      },800);
    }
  }
}

function resetFlipped(){
  firstCard=null;
  secondCard=null;
}

// Game Over
function endGame(){
  clearInterval(timerInterval);
  totalMovesEl.innerText = moves;
  totalTimeEl.innerText = timer;
  finalScoreEl.innerText = score;
  highScore = Math.max(highScore, score);
  localStorage.setItem('memoryHighScore', highScore);
  highScoreEl.innerText = highScore;
  gameOverEl.style.display='flex';
}

// Restart current level
function restartGame(){
  startGame(level);
}

// Back to menu
function backToMenu(){
  clearInterval(timerInterval);
  gameOverEl.style.display='none';
  document.getElementById('levelOverlay').style.display='flex';
}
