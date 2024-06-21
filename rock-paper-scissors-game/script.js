const rulesToggleBtns = document.querySelectorAll(
  "[data-function=toggleRules]"
);
const rulesModal = document.querySelector(".rules__modal");
const playBtns = document.querySelectorAll("[data-play]");
const playSection = document.querySelector(".buttons--play");
const resultSection = document.querySelector(".buttons--results");
const replayDiv = document.querySelector(".replay");
const replayBtn = document.querySelector(".replayBtn");
const playerPlaceholder = document.querySelector("#player");
const housePlaceholder = document.querySelector("#house");
const resultMsg = document.querySelector("#resultMessage");
const houseContainer = document.querySelector(".container--house");
let score = document.querySelector(".score__score");

const toggleRules = () => {
  rulesModal.classList.toggle("hideRules");
  console.log("click");
};

const getResult = (value) => {
  if (value === -2 || value === 1) return "Win";
  if (value === 0) return "Draw";
  if (value === -1 || value === 2) return "Loss";
};

const playRPS = (e) => {
  const options = ["rock", "paper", "scissors"];
  const houseChoice = options[Math.floor(Math.random() * options.length)];
  let playerChoice = e.currentTarget.dataset.play;
  let playerValue = options.indexOf(playerChoice);
  let houseValue = options.indexOf(houseChoice);
  let result = getResult(playerValue - houseValue);
  showResults(result, playerChoice, houseChoice);
};

const showResults = (result, player, house) => {
  playSection.style.display = "none";
  resultSection.style.display = "flex";
  let playerFragment = `<div class="${player}__border btn btn--results">
        <div>
          <img src="./images/icon-${player}.svg" alt="${player} button" class="${player} img">
        </div>
      </div>`;
  let houseFragment = `<div class="${house}__border btn btn--results">
        <div>
          <img src="./images/icon-${house}.svg" alt="${house} button" class="${house} img">
        </div>
      </div>`;

  setTimeout(() => {
    playerPlaceholder.innerHTML = playerFragment;
  }, 100);

  setTimeout(() => {
    housePlaceholder.innerHTML = houseFragment;
  }, 300);

  setTimeout(() => {
    replayDiv.style.display = "block";
    if (result === "Win") {
      playerPlaceholder.firstChild.classList.add("winner");
      resultMsg.textContent = "YOU WIN";
      score.textContent = Number(score.textContent) + 1;
    }
    if (result === "Loss") {
      housePlaceholder.firstChild.classList.add("winner");
      houseContainer.style.zIndex = 2;
      resultMsg.textContent = "YOU LOSE";
      score.textContent = Number(score.textContent) - 1;
    }
  }, 500);
};

const playAgain = () => {
  playerPlaceholder.firstChild.classList.remove("winner");
  housePlaceholder.firstChild.classList.remove("winner");
  resultMsg.textContent = "DRAW";
  resultSection.style.display = "none";
  playSection.style.display = "flex";
  playerPlaceholder.innerHTML = "";
  houseContainer.style.zIndex = 2000;
  housePlaceholder.innerHTML = "";
  replayDiv.style.display = "none";
};

rulesToggleBtns.forEach((btn) => btn.addEventListener("click", toggleRules));
playBtns.forEach((btn) => btn.addEventListener("click", playRPS));
replayBtn.addEventListener("click", playAgain);
