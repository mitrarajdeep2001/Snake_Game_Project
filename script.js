// Constants
const playBoard = document.querySelector(".play-board");
const snakeBody = [];
const scoreElement = document.querySelector(".score");
const maxScoreElement = document.querySelector(".max-score");

// Variables
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

// Clear the interval, show alert message and reload the page on game over
const handleGameOver = () => {
  clearInterval(intervalID);
  alert("Game Over! Press OK to replay...");
  location.reload();
};

const initGame = () => {
  // Triggers when the game over condition gets true
  if (gameOver) {
    return handleGameOver();
  }

  // Set position and color for the food
  let htmlMarkup = `<div class="food" style="grid-area: ${foodY} / ${foodX}; background-color: red;"></div>`;

  // Check if snake has eaten the food or not
  if (snakeX === foodX && snakeY === foodY) {
    // Change the food's position
    changeFoodPosition();
    // Extend snake's body
    snakeBody.push([foodX, foodY]);
    console.log(snakeBody);
    // Increment score by 1
    score++;
    // Condition for assigning value to maxScore
    maxScore = score >= maxScore ? score : maxScore;
    // Store the maxScore as key to local storage
    localStorage.setItem("maxScore", maxScore);
    // Assign score to score element
    scoreElement.innerText = `Score: ${score}`;
    // Assign score to max-score element
    maxScoreElement.innerText = `Max Score: ${maxScore}`;
  }

  // Makes the snake's body move
  for (let i = snakeBody.length - 1; i > 0; i--) {
    snakeBody[i] = snakeBody[i - 1];
  }

  // Set the initial value for the snake's body
  snakeBody[0] = [snakeX, snakeY];

  // Change the position of the snake's head
  snakeX += velocityX;
  snakeY += velocityY;

  // Check if the snake has hit the game boundaries or not, to let the game over
  if (snakeX < 1 || snakeX > 30 || snakeY < 1 || snakeY > 30) {
    gameOver = true;
  }

  // It iterates over the snakeBody array and dynamically generates the HTML markup for each segment of the snake's body.
  for (let i = 0; i < snakeBody.length; i++) {
    htmlMarkup += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}; background-color: green;"></div>`;

    // Checks if the snake's head hits any other segment of its body or not, to let the game over
    if (
      i !== 0 &&
      snakeBody[0][1] === snakeBody[i][1] &&
      snakeBody[0][0] === snakeBody[i][0]
    ) {
      gameOver = true;
    }
  }

  // It updates the display of the game board with new states
  playBoard.innerHTML = htmlMarkup;
};

// Start the game loop using setInterval and assign its reference to intervalID
intervalID = setInterval(initGame, 125);

// Set event listeners on arrow key press
document.addEventListener("keydown", changeDirection);
