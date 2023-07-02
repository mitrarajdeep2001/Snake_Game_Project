const playBoard = document.querySelector(".play-board");
const snakeBody = [];
const scoreElement = document.querySelector(".score");
const maxScoreElement = document.querySelector(".max-score");

let foodX, foodY;
let snakeX = 15,
  snakeY = 10;
let velocityX = 0,
  velocityY = 0;
let gameOver = false;
let intervalID;
let score = 0;

// Getting max score from the local storage
let maxScore = localStorage.getItem("maxScore") || 0;
maxScoreElement.innerHTML = `Max Score: ${maxScore}`;

// Passing a random 1 - 30 value as food position
const changeFoodPosition = () => {
  foodX = Math.floor(Math.random() * 30) + 1;
  foodY = Math.floor(Math.random() * 30) + 1;
};
changeFoodPosition();

// Changing velocity value based on key press
const changeDirection = (event) => {
  if (event.key === "ArrowUp" && velocityY != 1) {
    velocityX = 0;
    velocityY = -1;
  } else if (event.key === "ArrowDown" && velocityY != -1) {
    velocityX = 0;
    velocityY = 1;
  } else if (event.key === "ArrowLeft" && velocityX != 1) {
    velocityX = -1;
    velocityY = 0;
  } else if (event.key === "ArrowRight" && velocityX != -1) {
    velocityX = 1;
    velocityY = 0;
  }
  initGame();
};

const handleGameOver = () => {
  clearInterval(intervalID);
  alert("Game Over! Press OK to replay...");
  location.reload();
};

const initGame = () => {
  if (gameOver) {
    return handleGameOver();
  }
  let htmlMarkup = `<div class="food" style="grid-area: ${foodY} / ${foodX}; background-color: red;"></div>`;

  if (snakeX === foodX && snakeY === foodY) {
    changeFoodPosition();
    snakeBody.push([foodX, foodY]);
    console.log(snakeBody);
    score++;
    maxScore = score >= maxScore ? score : maxScore;
    localStorage.setItem("maxScore", maxScore);
    scoreElement.innerText = `Score: ${score}`;
    maxScoreElement.innerText = `Max Score: ${maxScore}`;
  }

  for (let i = snakeBody.length - 1; i > 0; i--) {
    snakeBody[i] = snakeBody[i - 1];
  }

  snakeBody[0] = [snakeX, snakeY];
  snakeX += velocityX;
  snakeY += velocityY;

  if (snakeX < 1 || snakeX > 30 || snakeY < 1 || snakeY > 30) {
    gameOver = true;
  }

  for (let i = 0; i < snakeBody.length; i++) {
    htmlMarkup += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}; background-color: green;"></div>`;
    if (
      i !== 0 &&
      snakeBody[0][1] === snakeBody[i][1] &&
      snakeBody[0][0] === snakeBody[i][0]
    ) {
      gameOver = true;
    }
  }
  playBoard.innerHTML = htmlMarkup;
};
intervalID = setInterval(initGame, 125);

document.addEventListener("keydown", changeDirection);
