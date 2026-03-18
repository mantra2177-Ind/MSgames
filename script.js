const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const highEl = document.getElementById("highScore");
const overlay = document.getElementById("startOverlay");

const box = 20;
const rows = canvas.height / box;
const cols = canvas.width / box;

let snake = [{x: 10, y: 10}];
let food = {x: 15, y: 10};
let dx = 0, dy = 0;
let score = 0;
let highScore = localStorage.getItem("snakeHigh") || 0;
highEl.innerText = highScore;

let lastTime = 0;
let speed = 120; // Lower is faster
let active = false;

// Inputs
function changeDir(dir) {
    if (!active) { active = true; overlay.style.display = "none"; }
    if (dir === "UP" && dy === 0) { dx = 0; dy = -1; }
    if (dir === "DOWN" && dy === 0) { dx = 0; dy = 1; }
    if (dir === "LEFT" && dx === 0) { dx = -1; dy = 0; }
    if (dir === "RIGHT" && dx === 0) { dx = 1; dy = 0; }
}

// Controls
window.addEventListener("keydown", e => {
    if(e.key === "ArrowUp") changeDir("UP");
    if(e.key === "ArrowDown") changeDir("DOWN");
    if(e.key === "ArrowLeft") changeDir("LEFT");
    if(e.key === "ArrowRight") changeDir("RIGHT");
});

document.getElementById("uBtn").onclick = () => changeDir("UP");
document.getElementById("dBtn").onclick = () => changeDir("DOWN");
document.getElementById("lBtn").onclick = () => changeDir("LEFT");
document.getElementById("rBtn").onclick = () => changeDir("RIGHT");

function main(currentTime) {
    window.requestAnimationFrame(main);
    const secondsSinceLastRender = (currentTime - lastTime);
    if (secondsSinceLastRender < speed) return;
    lastTime = currentTime;

    update();
    draw();
}

function update() {
    if (!active) return;

    const head = { x: snake[0].x + dx, y: snake[0].y + dy };

    // Death Check
    if (head.x < 0 || head.x >= cols || head.y < 0 || head.y >= rows || 
        snake.some(seg => seg.x === head.x && seg.y === head.y)) {
        if (score > highScore) {
            highScore = score;
            localStorage.setItem("snakeHigh", score);
        }
        alert("Oops! Game Over.");
        location.reload();
        return;
    }

    snake.unshift(head);

    // Eat Food
    if (head.x === food.x && head.y === food.y) {
        score++;
        scoreEl.innerText = score;
        speed = Math.max(70, 120 - (score * 2)); // Speed up!
        spawnFood();
    } else {
        snake.pop();
    }
}

function spawnFood() {
    food = {
        x: Math.floor(Math.random() * cols),
        y: Math.floor(Math.random() * rows)
    };
    // Don't spawn food on snake body
    if (snake.some(seg => seg.x === food.x && seg.y === food.y)) spawnFood();
}

function draw() {
    // 1. Draw Checkerboard Background
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            ctx.fillStyle = (i + j) % 2 === 0 ? "#aad751" : "#a2d149";
            ctx.fillRect(i * box, j * box, box, box);
        }
    }

    // 2. Draw Red Apple
    ctx.fillStyle = "#e74c3c";
    ctx.beginPath();
    ctx.arc(food.x * box + box/2, food.y * box + box/2, box/2 - 2, 0, Math.PI * 2);
    ctx.fill();

    // 3. Draw Blue Snake
    snake.forEach((seg, index) => {
        ctx.fillStyle = index === 0 ? "#4571e3" : "#527efd";
        ctx.fillRect(seg.x * box, seg.y * box, box, box);
        // Little eyes for the head
        if (index === 0) {
            ctx.fillStyle = "white";
            ctx.fillRect(seg.x * box + 4, seg.y * box + 4, 4, 4);
            ctx.fillRect(seg.x * box + 12, seg.y * box + 4, 4, 4);
        }
    });
}

window.requestAnimationFrame(main);
