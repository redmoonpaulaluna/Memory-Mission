const cardsSymbols = [
  "🔐", "🛡️", "💻", "🕵️‍♂️",
  "📡", "🧑‍💻", "🧩", "🧱"
]; // 8 pairs

const totalClicksAllowed = 16;
let clicksLeft = totalClicksAllowed;
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matchesFound = 0;

const gameBoard = document.getElementById('gameBoard');
const clicksLeftDisplay = document.getElementById('clicksLeft');
const messageDisplay = document.getElementById('message');
const tryAgainBtn = document.getElementById('tryAgainBtn');

function shuffleArray(array) {
  for(let i = array.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function createBoard() {
  // Clear previous board
  gameBoard.innerHTML = '';
  messageDisplay.textContent = '';
  tryAgainBtn.style.display = 'none';
  clicksLeft = totalClicksAllowed;
  matchesFound = 0;
  updateClicksDisplay();

  // Create pairs and shuffle
  const doubleSymbols = cardsSymbols.concat(cardsSymbols);
  const shuffledSymbols = shuffleArray(doubleSymbols);

  shuffledSymbols.forEach((symbol, index) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.symbol = symbol;
    card.dataset.index = index;

    card.innerHTML = `
      <div class="card-inner">
        <div class="card-front">${symbol}</div>
        <div class="card-back">❓</div>
      </div>
    `;

    card.addEventListener('click', onCardClick);

    gameBoard.appendChild(card);
  });
}

function updateClicksDisplay() {
  clicksLeftDisplay.textContent = `Clicks left: ${clicksLeft}`;
  if(clicksLeft <= 3){
    clicksLeftDisplay.classList.add('blink');
  } else {
    clicksLeftDisplay.classList.remove('blink');
  }
}

function onCardClick(e) {
  if(lockBoard) return;
  const clickedCard = e.currentTarget;
  if(clickedCard.classList.contains('flipped')) return;
  if(clicksLeft <= 0) return;

  clickedCard.classList.add('flipped');

  if(!firstCard){
    firstCard = clickedCard;
  } else {
    secondCard = clickedCard;
    lockBoard = true;
    clicksLeft--;
    updateClicksDisplay();

    checkForMatch();
  }
}

function checkForMatch() {
  const isMatch = firstCard.dataset.symbol === secondCard.dataset.symbol;

  if(isMatch){
    matchesFound++;
    resetTurn();
    if(matchesFound === cardsSymbols.length){
      missionSuccess();
    }
  } else {
    setTimeout(() => {
      firstCard.classList.remove('flipped');
      secondCard.classList.remove('flipped');
      resetTurn();
      if(clicksLeft <= 0){
        missionFail();
      }
    }, 1000);
  }
}

function resetTurn() {
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
}

function missionSuccess() {
  messageDisplay.textContent = "The Code is: 379 - well played Agent Antoine!";
  tryAgainBtn.style.display = 'none';
}

function missionFail() {
  messageDisplay.textContent = "Out of clicks! Try again.";
  tryAgainBtn.style.display = 'inline-block';
}

tryAgainBtn.addEventListener('click', () => {
  createBoard();
});

window.onload = () => {
  createBoard();
};
