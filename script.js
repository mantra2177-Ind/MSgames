const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("scoreVal");
const overlay = document.getElementById("touchMsg");

// Size setup
const gridSize = 20;
canvas.width = 400;
canvas.height = 400;

let snake = [{ x: 10, y: 10 }, { x: 9, y: 10 }];
let food = { x: 15, y: 15 };
let dx = 0, dy = 0;
let score = 0;
let lastTime = 0;
let moveInterval = 100; // Speed in ms (lower is faster)
let accumulator = 0;
let active = false;

// Inputs
const input = (dir) => {
    if(!active) { active = true; overlay.style.opacity = "0"; dx = 1; dy = 0; }
    if(dir === 'U' && dy === 0) { dx = 0; dy = -1; }
    if(dir === 'D' && dy === 0) { dx = 0; dy = 1; }
    if(dir === 'L' && dx === 0) { dx = -1; dy = 0; }
    if(dir === 'R' && dx === 0) { dx = 1; dy = 0; }
};

// Listeners
window.addEventListener("keydown", e => {
    if(e.key === "ArrowUp") input('U');
    if(e.key === "ArrowDown") input('D');
    if(e.key === "ArrowLeft") input('L');
    if(e.key === "ArrowRight") input('R');
});

document.getElementById("u").onclick = () => input('U');
document.getElementById("d").onclick = () => input('D');
document.getElementById("l").onclick = () => input('L');
document.getElementById("r").onclick = () => input('R');

function gameLoop(currentTime) {
    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;

    if (active) {
        accumulator += deltaTime;
        if (accumulator >= moveInterval) {
            update();
            accumulator = 0;
        }
    }
    
    draw();
    requestAnimationFrame(gameLoop);
}

function update() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };

    // Wall hit
    if (head.x < 0 || head.x >= 20 || head.y < 0 || head.y >= 20) return reset();
    
    // Body hit
    if (snake.some(s => s.x === head.x && s.y === head.y)) return reset();

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score++;
        scoreEl.innerText = score.toString().padStart(2, '0');
        moveInterval = Math.max(60, 100 - (score * 2)); // Dynamic speed
        spawnFood();
    } else {
        snake.pop();
    }
}

function spawnFood() {
    food = {
        x: Math.floor(Math.random() * 20),
        y: Math.floor(Math.random() * 20)
    };
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Grid (Subtle)
    ctx.strokeStyle = "#0f172a";
    for(let i=0; i<canvas.width; i+=gridSize) {
        ctx.beginPath(); ctx.moveTo(i,0); ctx.lineTo(i,400); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0,i); ctx.lineTo(400,i); ctx.stroke();
    }

    // Food
    ctx.fillStyle = "#f43f5e";
    ctx.shadowBlur = 15; ctx.shadowColor = "#f43f5e";
    ctx.beginPath();
    ctx.arc(food.x * gridSize + 10, food.y * gridSize + 10, 7, 0, Math.PI * 2);
    ctx.fill();

    // Snake
    ctx.shadowBlur = 0;
    snake.forEach((s, i) => {
        ctx.fillStyle = i === 0 ? "#38bdf8" : "#0ea5e9";
        const r = 5; // Rounded corners
        const x = s.x * gridSize + 1;
        const y = s.y * gridSize + 1;
        const w = gridSize - 2;
        ctx.beginPath();
        ctx.roundRect(x, y, w, w, r);
        ctx.fill();
    });
}

function reset() {
    alert("CRASH DETECTED. SCORE: " + score);
    snake = [{ x: 10, y: 10 }, { x: 9, y: 10 }];
    dx = 0; dy = 0; score = 0;
    scoreEl.innerText = "00";
    moveInterval = 100;
    active = false;
    overlay.style.opacity = "1";
}

// Start
requestAnimationFrame(gameLoop);
