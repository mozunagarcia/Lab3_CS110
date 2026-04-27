const CELL_NAMES = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
const WIN_COMBOS = [
  [1,2,3], [4,5,6], [7,8,9],
  [1,4,7], [2,5,8], [3,6,9],
  [1,5,9], [3,5,7]
];

let xMoves = [];
let oMoves = [];
let xScore = 0;
let oScore = 0;
let gameActive = true;

function checkWin(moves) {
  return WIN_COMBOS.some(combo => combo.every(n => moves.includes(n)));
}

function markCell(cellNum, player) {
  const cell = document.querySelector(`.${CELL_NAMES[cellNum - 1]}`);
  cell.querySelector('.xo').textContent = player;
  cell.classList.add('occupied');
}

function setStatus(msg) {
  document.querySelector('h2').textContent = msg;
}

function updateScore() {
  document.querySelector('.score_display').textContent = `Scores: X : ${xScore} O : ${oScore}`;
}

function resolveGame(player) {
  const moves = player === 'X' ? xMoves : oMoves;
  if (checkWin(moves)) {
    if (player === 'X') xScore++;
    else oScore++;
    updateScore();
    setStatus(`${player} wins!`);
    gameActive = false;
    return true;
  }
  if (xMoves.length + oMoves.length === 9) {
    setStatus("It's a tie!");
    gameActive = false;
    return true;
  }
  return false;
}

function computerPlay() {
  if (!gameActive) return;
  const available = [1,2,3,4,5,6,7,8,9].filter(n => !xMoves.includes(n) && !oMoves.includes(n));
  if (!available.length) return;

  const pick = available[Math.floor(Math.random() * available.length)];
  oMoves.push(pick);
  markCell(pick, 'O');

  if (!resolveGame('O')) {
    setStatus('Your turn, X.');
  }
}

function handleCellClick(e) {
  if (!gameActive) return;

  const cell = e.currentTarget;
  const cellClass = CELL_NAMES.find(n => cell.classList.contains(n));
  const cellNum = CELL_NAMES.indexOf(cellClass) + 1;

  if (xMoves.includes(cellNum) || oMoves.includes(cellNum)) return;

  xMoves.push(cellNum);
  markCell(cellNum, 'X');

  if (!resolveGame('X')) {
    setTimeout(computerPlay, 500);
  }
}

function startNewGame() {
  xMoves = [];
  oMoves = [];
  gameActive = true;

  CELL_NAMES.forEach(name => {
    const cell = document.querySelector(`.${name}`);
    cell.querySelector('.xo').textContent = '';
    cell.classList.remove('occupied');
  });

  setStatus('Your turn, X.');
}

function resetAll() {
  xScore = 0;
  oScore = 0;
  updateScore();
  startNewGame();
}

document.addEventListener('DOMContentLoaded', () => {
  CELL_NAMES.forEach(name => {
    document.querySelector(`.${name}`).addEventListener('click', handleCellClick);
  });
  document.querySelector('.new_game').addEventListener('click', startNewGame);
  document.querySelector('.reset').addEventListener('click', resetAll);

  updateScore();
  startNewGame();
});
