const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const overlay = document.getElementById("overlay");

const box = 20; // Keep logic at 20px, CSS handles scaling
let score = 0;
let snake = [{ x: 8 * box, y: 10 * box }];
let food = { x: 5 * box, y: 5 * box };
let d = null;
let gameActive = false;

// Input Handling
const setDir = (dir) => {
    if (!gameActive) {
        gameActive = true;
        overlay.style.display = "none";
    }
    if (dir === "LEFT" && d !== "RIGHT") d = "LEFT";
    if (dir === "UP" && d !== "DOWN") d = "UP";
    if (dir === "RIGHT" && d !== "LEFT") d = "RIGHT";
    if (dir === "DOWN" && d !== "UP") d = "DOWN";
};

// Keyboard
document.addEventListener("keydown", (e) => {
    if(e.keyCode == 37) setDir("LEFT");
    if(e.keyCode == 38) setDir("UP");
    if(e.keyCode == 39) setDir("RIGHT");
    if(e.keyCode == 40) setDir("DOWN");
});

// Mobile Buttons
document.getElementById("left").onclick = () => setDir("LEFT");
document.getElementById("up").onclick = () => setDir("UP");
document.getElementById("right").onclick = () => setDir("RIGHT");
document.getElementById("down").onclick = () => setDir("DOWN");

function draw() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Snake
    snake.forEach((part, i) => {
        ctx.fillStyle = (i === 0) ? "#38bdf8" : "#0ea5e9";
        ctx.fillRect(part.x, part.y, box, box);
    });

    // Food
    ctx.fillStyle = "#f43f5e";
    ctx.fillRect(food.x, food.y, box, box);

    if (!gameActive) return;

    let headX = snake[0].x;
    let headY = snake[0].y;

    if (d === "LEFT") headX -= box;
    if (d === "UP") headY -= box;
    if (d === "RIGHT") headX += box;
    if (d === "DOWN") headY += box;

    // Boundary/Self Collision
    if (headX < 0 || headX >= canvas.width || headY < 0 || headY >= canvas.height || 
        snake.some((p, i) => i !== 0 && p.x === headX && p.y === headY)) {
        alert("GAME OVER");
        location.reload();
    }

    if (headX === food.x && headY === food.y) {
        score++;
        scoreEl.innerText = score.toString().padStart(2, '0');
        food = {
            x: Math.floor(Math.random() * (canvas.width/box)) * box,
            y: Math.floor(Math.random() * (canvas.height/box)) * box
        };
    } else {
        snake.pop();
    }

    snake.unshift({ x: headX, y: headY });
}

setInterval(draw, 120);
