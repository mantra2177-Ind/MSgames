const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const highEl = document.getElementById("high");
const msg = document.getElementById("msg");

const box = 20;
let snake = [{x: 10, y: 10}];
let food = {x: 15, y: 10};
let dx = 0, dy = 0;
let score = 0;
let active = false;

// Input Function
function handleInput(dir) {
    if (!active) {
        active = true;
        msg.style.display = "none";
    }
    if (dir === "U" && dy === 0) { dx = 0; dy = -1; }
    if (dir === "D" && dy === 0) { dx = 0; dy = 1; }
    if (dir === "L" && dx === 0) { dx = -1; dy = 0; }
    if (dir === "R" && dx === 0) { dx = 1; dy = 0; }
}

// Button Listeners (PointerDown works for both Mouse and Touch)
document.getElementById("u").onpointerdown = (e) => { e.preventDefault(); handleInput("U"); };
document.getElementById("d").onpointerdown = (e) => { e.preventDefault(); handleInput("D"); };
document.getElementById("l").onpointerdown = (e) => { e.preventDefault(); handleInput("L"); };
document.getElementById("r").onpointerdown = (e) => { e.preventDefault(); handleInput("R"); };

// Keyboard
window.onkeydown = (e) => {
    if (e.key === "ArrowUp") handleInput("U");
    if (e.key === "ArrowDown") handleInput("D");
    if (e.key === "ArrowLeft") handleInput("L");
    if (e.key === "ArrowRight") handleInput("R");
};

function gameLoop() {
    if (active) {
        const head = { x: snake[0].x + dx, y: snake[0].y + dy };

        // Wall or Body hit
        if (head.x < 0 || head.x >= 20 || head.y < 0 || head.y >= 20 || 
            snake.some(s => s.x === head.x && s.y === head.y)) {
            alert("Score: " + score);
            location.reload();
            return;
        }

        snake.unshift(head);

        if (head.x === food.x && head.y === food.y) {
            score++;
            scoreEl.innerText = score;
            food = { x: Math.floor(Math.random()*20), y: Math.floor(Math.random()*20) };
        } else {
            snake.pop();
        }
    }

    draw();
    setTimeout(gameLoop, 100); // Constant speed for stability
}
let touchStartX = 0;
let touchStartY = 0;

canvas.addEventListener("touchstart", function (e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
});

canvas.addEventListener("touchmove", function (e) {
    if (!touchStartX || !touchStartY) return;

    let touchEndX = e.touches[0].clientX;
    let touchEndY = e.touches[0].clientY;

    let dx = touchEndX - touchStartX;
    let dy = touchEndY - touchStartY;

    // Detect swipe direction
    if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 0 && direction !== "LEFT") direction = "RIGHT";
        else if (dx < 0 && direction !== "RIGHT") direction = "LEFT";
    } else {
        if (dy > 0 && direction !== "UP") direction = "DOWN";
        else if (dy < 0 && direction !== "DOWN") direction = "UP";
    }

    touchStartX = 0;
    touchStartY = 0;
});
function draw() {
    // Background Checkerboard
    for (let i = 0; i < 20; i++) {
        for (let j = 0; j < 20; j++) {
            ctx.fillStyle = (i + j) % 2 === 0 ? "#aad751" : "#a2d149";
            ctx.fillRect(i * box, j * box, box, box);
        }
    }

    // Apple
    ctx.fillStyle = "#e74c3c";
    ctx.beginPath();
    ctx.arc(food.x * box + 10, food.y * box + 10, 8, 0, 7);
    ctx.fill();

    // Blue Snake
    snake.forEach((s, i) => {
        ctx.fillStyle = i === 0 ? "#4571e3" : "#527efd";
        ctx.fillRect(s.x * box, s.y * box, box - 1, box - 1);
    });
}

gameLoop();
