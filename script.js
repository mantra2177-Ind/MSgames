const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const highEl = document.getElementById("highScore");
const overlay = document.getElementById("overlay");
const resetBtn = document.getElementById("resetBtn");

const box = 20;
let score = 0;
let highScore = localStorage.getItem("snakeHigh") || 0;
highEl.innerText = highScore.toString().padStart(2, '0');

let snake = [{ x: 9 * box, y: 10 * box }];
let food = { 
    x: Math.floor(Math.random() * 19 + 1) * box, 
    y: Math.floor(Math.random() * 19 + 1) * box 
};

let d = null;
let gameActive = false;

document.addEventListener("keydown", (e) => {
    if (!gameActive && [37, 38, 39, 40].includes(e.keyCode)) {
        gameActive = true;
        overlay.style.display = "none";
    }

    if (e.keyCode == 37 && d != "RIGHT") d = "LEFT";
    else if (e.keyCode == 38 && d != "DOWN") d = "UP";
    else if (e.keyCode == 39 && d != "LEFT") d = "RIGHT";
    else if (e.keyCode == 40 && d != "UP") d = "DOWN";
});

resetBtn.addEventListener("click", () => location.reload());

function draw() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Snake
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = (i == 0) ? "#38bdf8" : "#0ea5e9";
        ctx.strokeStyle = "#020617";
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    // Draw Food
    ctx.fillStyle = "#f43f5e";
    ctx.fillRect(food.x, food.y, box, box);

    if (!gameActive) return;

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (d == "LEFT") snakeX -= box;
    if (d == "UP") snakeY -= box;
    if (d == "RIGHT") snakeX += box;
    if (d == "DOWN") snakeY += box;

    // Eat food logic
    if (snakeX == food.x && snakeY == food.y) {
        score++;
        scoreEl.innerText = score.toString().padStart(2, '0');
        food = {
            x: Math.floor(Math.random() * 19 + 1) * box,
            y: Math.floor(Math.random() * 19 + 1) * box
        };
    } else {
        snake.pop();
    }

    let newHead = { x: snakeX, y: snakeY };

    // Death logic
    if (snakeX < 0 || snakeX >= canvas.width || snakeY < 0 || snakeY >= canvas.height || collision(newHead, snake)) {
        if (score > highScore) localStorage.setItem("snakeHigh", score);
        clearInterval(game);
        alert("GAME OVER. SCORE: " + score);
        location.reload();
    }

    snake.unshift(newHead);
}

function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x == array[i].x && head.y == array[i].y) return true;
    }
    return false;
}

let game = setInterval(draw, 100);
