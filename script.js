const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("score");
const highDisplay = document.getElementById("highScore");
const restartBtn = document.getElementById("restartBtn");

// Game Settings
const gridSize = 20;
const tileCount = canvas.width / gridSize;

let score = 0;
let highScore = localStorage.getItem("snakeHighScore") || 0;
highDisplay.innerText = highScore.toString().padStart(2, '0');

let snake = [{ x: 10, y: 10 }];
let food = { x: 5, y: 5 };
let dx = 0;
let dy = 0;
let nextDx = 0;
let nextDy = 0;

// Listen for keys
document.addEventListener("keydown", changeDirection);
restartBtn.addEventListener("click", resetGame);

function changeDirection(event) {
    const KEY_UP = 38, KEY_DOWN = 40, KEY_LEFT = 37, KEY_RIGHT = 39;
    const keyPressed = event.keyCode;

    if (keyPressed === KEY_UP && dy === 0) { nextDx = 0; nextDy = -1; }
    if (keyPressed === KEY_DOWN && dy === 0) { nextDx = 0; nextDy = 1; }
    if (keyPressed === KEY_LEFT && dx === 0) { nextDx = -1; nextDy = 0; }
    if (keyPressed === KEY_RIGHT && dx === 0) { nextDx = 1; nextDy = 0; }
}

function drawGame() {
    // Update movement
    dx = nextDx;
    dy = nextDy;

    const head = { x: snake[0].x + dx, y: snake[0].y + dy };

    // Check Wall Collision
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        return gameOver();
    }

    // Check Self Collision
    for (let i = 0; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) return gameOver();
    }

    snake.unshift(head);

    // Check Food Collision
    if (head.x === food.x && head.y === food.y) {
        score++;
        scoreDisplay.innerText = score.toString().padStart(2, '0');
        placeFood();
    } else {
        if(dx !== 0 || dy !== 0) snake.pop();
    }

    // Clear Canvas
    ctx.fillStyle = "#020617";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Food
    ctx.fillStyle = "#fb7185";
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#fb7185";
    ctx.fillRect(food.x * gridSize + 2, food.y * gridSize + 2, gridSize - 4, gridSize - 4);

    // Draw Snake
    snake.forEach((part, index) => {
        ctx.fillStyle = index === 0 ? "#38bdf8" : "#0ea5e9";
        ctx.shadowBlur = index === 0 ? 15 : 0;
        ctx.shadowColor = "#38bdf8";
        ctx.fillRect(part.x * gridSize + 1, part.y * gridSize + 1, gridSize - 2, gridSize - 2);
    });

    setTimeout(drawGame, 100);
}

function placeFood() {
    food.x = Math.floor(Math.random() * tileCount);
    food.y = Math.floor(Math.random() * tileCount);
}

function gameOver() {
    if (score > highScore) {
        highScore = score;
        localStorage.setItem("snakeHighScore", highScore);
        highDisplay.innerText = highScore.toString().padStart(2, '0');
    }
    alert(`SYSTEM_FAILURE: Score ${score}`);
    resetGame();
}

function resetGame() {
    snake = [{ x: 10, y: 10 }];
    dx = 0; dy = 0; nextDx = 0; nextDy = 0;
    score = 0;
    scoreDisplay.innerText = "00";
    placeFood();
}

placeFood();
drawGame();

