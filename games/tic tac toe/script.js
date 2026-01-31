let board=[["","",""],["","",""],["","",""]];
let currentPlayer="X";
let gameStarted=false;
let mode=""; // computer or friend
let level="beginner";
let playerScore=0;
let compScore=0;
let startingPlayer = "X"; // alternates after each match
let firstMoveNextMatch = "player"; // alternates between 'player' and 'opponent'



// === Option Selection ===
function selectMode(selectedMode){
  mode=selectedMode;
  document.getElementById("optionOverlay").style.display="none";
  document.getElementById("scoreboard").style.display="block";
  if(mode==="computer"){
    document.getElementById("levelOverlay").style.display="flex";
  } else {
    document.getElementById("board").style.display="table";
    gameStarted=true;
  }
}

// === Level Selection ===
function selectLevel(selectedLevel, btn){
  level=selectedLevel;
  document.querySelectorAll("#levelOverlay button").forEach(b=>b.classList.remove("active"));
  btn.classList.add("active");
}

// === Start Game ===
function startGame(){
  document.getElementById("levelOverlay").style.display = "none";
  document.getElementById("board").style.display = "table";
  gameStarted = true;
  updateScoreboard();

  // Set first move based on firstMoveNextMatch
  if(mode === "computer" && firstMoveNextMatch === "opponent"){
    currentPlayer = "O"; // Computer starts
    firstMoveNextMatch = "player";
    setTimeout(computerMove, 200);
  } else {
    currentPlayer = "X"; // Player starts
    if(mode === "computer") firstMoveNextMatch = "opponent";
  }
}


// === Player Move ===
function makeMove(r,c){
  if(!gameStarted || board[r][c]!="") return;

  board[r][c]=currentPlayer;
  updateBoard();

  if(checkWin(currentPlayer)) { endMatch(currentPlayer+" Wins!"); return; }
  if(checkDraw()) { endMatch("Draw!"); return; }

  if(mode==="computer" && currentPlayer==="X"){
    currentPlayer="O";
    setTimeout(computerMove,200);
  } else {
    currentPlayer=currentPlayer==="X"?"O":"X";
  }
}

// === Update Board Display ===
function updateBoard(){
  let table=document.getElementById("board");
  for(let i=0;i<3;i++){
    for(let j=0;j<3;j++){
      table.rows[i].cells[j].innerText=board[i][j];
    }
  }
}

// === Win / Draw Check ===
function checkWin(p){
  for(let i=0;i<3;i++){
    if(board[i][0]===p && board[i][1]===p && board[i][2]===p) return true;
    if(board[0][i]===p && board[1][i]===p && board[2][i]===p) return true;
  }
  if(board[0][0]===p && board[1][1]===p && board[2][2]===p) return true;
  if(board[0][2]===p && board[1][1]===p && board[2][0]===p) return true;
  return false;
}

function checkDraw(){
  return board.flat().every(cell=>cell!=="");
}

// === End Match ===
function endMatch(msg){
  document.getElementById("overText").innerText=msg;
  document.getElementById("gameOver").style.display="flex";
  gameStarted=false;

  if(msg.includes("Wins")){
    if(mode==="computer"){
      if(msg.includes("Computer")) compScore++;
      else playerScore++;
    } else {
      if(currentPlayer==="X") playerScore++;
      else compScore++; // Player O
    }
  }
  updateScoreboard();
}

// === Scoreboard Update ===
function updateScoreboard(){
  document.getElementById("playerScore").innerText = playerScore;
  document.getElementById("compScore").innerText = compScore;
}

// === Next Match ===
function nextMatch(){
  board = [["","",""],["","",""],["","",""]];
  gameStarted = true;
  document.getElementById("board").style.display = "table";
  document.getElementById("gameOver").style.display = "none";
  updateBoard();

  // Alternate who moves first
  if(firstMoveNextMatch === "player"){
    currentPlayer = "X"; // Player
    firstMoveNextMatch = "opponent";
    
    // If computer starts, make its move immediately
    if(mode === "computer") setTimeout(computerMove, 200);
  } else {
    currentPlayer = "O"; // Opponent / Computer
    firstMoveNextMatch = "player";

    if(mode === "computer") setTimeout(computerMove, 200);
  }
}


// === Restart All ===
function restartAll(){
  board=[["","",""],["","",""],["","",""]];
  currentPlayer="X";
  gameStarted=false;
  playerScore=0;
  compScore=0;
  document.getElementById("gameOver").style.display="none";
  document.getElementById("optionOverlay").style.display="flex";
  document.getElementById("board").style.display="none";
  updateBoard();
  updateScoreboard();
}

// === Computer AI ===
function computerMove(){
  let move;
  if(level==="beginner") move=randomMove();
  else if(level==="intermediate") move=intermediateMove();
  else move=bestMove();

  if(move){
    board[move.row][move.col]="O";
    updateBoard();
  }

  if(checkWin("O")) { currentPlayer="O"; endMatch("Computer Wins!"); return; }
  if(checkDraw()) { endMatch("Draw!"); return; }
  currentPlayer="X";
}

// === Beginner Random ===
function randomMove(){
  let empty=[];
  for(let i=0;i<3;i++)
    for(let j=0;j<3;j++)
      if(board[i][j]==="") empty.push({row:i,col:j});
  return empty[Math.floor(Math.random()*empty.length)];
}

// === Intermediate AI ===
function intermediateMove(){
  for(let i=0;i<3;i++){
    for(let j=0;j<3;j++){
      if(board[i][j]===""){ board[i][j]="O"; if(checkWin("O")) return {row:i,col:j}; board[i][j]=""; }
    }
  }
  for(let i=0;i<3;i++){
    for(let j=0;j<3;j++){
      if(board[i][j]===""){ board[i][j]="X"; if(checkWin("X")){ board[i][j]=""; return {row:i,col:j}; } board[i][j]=""; }
    }
  }
  return randomMove();
}

// === Advanced Minimax ===
function bestMove(){
  let bestScore=-Infinity, move;
  for(let i=0;i<3;i++){
    for(let j=0;j<3;j++){
      if(board[i][j]===""){
        board[i][j]="O";
        let score=minimax(board,0,false);
        board[i][j]="";
        if(score>bestScore){ bestScore=score; move={row:i,col:j}; }
      }
    }
  }
  return move;
}

function minimax(boardState, depth, isMaximizing){
  if(checkWin("O")) return 10-depth;
  if(checkWin("X")) return depth-10;
  if(checkDraw()) return 0;

  if(isMaximizing){
    let best=-Infinity;
    for(let i=0;i<3;i++)
      for(let j=0;j<3;j++)
        if(boardState[i][j]===""){
          boardState[i][j]="O";
          best=Math.max(best,minimax(boardState,depth+1,false));
          boardState[i][j]="";
        }
    return best;
  } else {
    let best=Infinity;
    for(let i=0;i<3;i++)
      for(let j=0;j<3;j++)
        if(boardState[i][j]===""){
          boardState[i][j]="X";
          best=Math.min(best,minimax(boardState,depth+1,true));
          boardState[i][j]="";
        }
    return best;
  }
}

function goBack(){
  // Reset board and game state
  board = [["","",""],["","",""],["","",""]];
  gameStarted = false;
  currentPlayer = "X";
  firstMoveNextMatch = "player";
  
  // Hide overlays and board
  document.getElementById("levelOverlay").style.display = "none";
  document.getElementById("gameOver").style.display = "none";
  document.getElementById("board").style.display = "none";
  
  // Show main menu
  document.getElementById("optionOverlay").style.display = "flex";
  
  // Reset scores if needed
  playerScore = 0;
  compScore = 0;
  updateScoreboard();
}

