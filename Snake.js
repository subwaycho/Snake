const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const box = 20;
const canvasSize = 400;

let snake = [];
let food;
let score;
let direction;
let dx, dy;
let lastMoveTime = 0;
const moveInterval = 100; // Time between moves in milliseconds

const scoreElement = document.getElementById('score');

// Load apple image
const appleImg = new Image();
appleImg.src = './images/apple.png';

function resetGame() {
    snake = [{ x: 9 * box, y: 10 * box }];
    food = {
        x: Math.floor(Math.random() * 19 + 1) * box,
        y: Math.floor(Math.random() * 19 + 1) * box
    };
    score = 0;
    direction = "RIGHT";
    dx = box;
    dy = 0;
    lastMoveTime = 0;
    scoreElement.textContent = score;
}

function gameOver() {
    alert(`게임 오버! 당신의 점수는 ${score}점 입니다.`);
    resetGame();
    draw();
}

document.addEventListener("keydown", changeDirection);
canvas.addEventListener("touchstart", handleTouchStart, false);
canvas.addEventListener("touchmove", handleTouchMove, false);

let xDown = null;
let yDown = null;

function handleTouchStart(evt) {
    const firstTouch = evt.touches[0];
    xDown = firstTouch.clientX;
    yDown = firstTouch.clientY;
}

function handleTouchMove(evt) {
    if (!xDown || !yDown) {
        return;
    }

    let xUp = evt.touches[0].clientX;
    let yUp = evt.touches[0].clientY;

    let xDiff = xDown - xUp;
    let yDiff = yDown - yUp;

    if (Math.abs(xDiff) > Math.abs(yDiff)) {
        if (xDiff > 0 && direction !== "RIGHT") {
            direction = "LEFT";
        } else if (xDiff < 0 && direction !== "LEFT") {
            direction = "RIGHT";
        }
    } else {
        if (yDiff > 0 && direction !== "DOWN") {
            direction = "UP";
        } else if (yDiff < 0 && direction !== "UP") {
            direction = "DOWN";
        }
    }
    xDown = null;
    yDown = null;
}

function changeDirection(event) {
    if (event.keyCode == 37 && direction !== "RIGHT") {
        direction = "LEFT";
    } else if (event.keyCode == 38 && direction !== "DOWN") {
        direction = "UP";
    } else if (event.keyCode == 39 && direction !== "LEFT") {
        direction = "RIGHT";
    } else if (event.keyCode == 40 && direction !== "UP") {
        direction = "DOWN";
    }
}

function draw() {
    const currentTime = Date.now();
    if (currentTime - lastMoveTime >= moveInterval) {
        lastMoveTime = currentTime;
        moveSnake();
    }

    ctx.clearRect(0, 0, canvasSize, canvasSize);

    // Draw grid
    for (let i = 0; i <= canvasSize / box; i++) {
        ctx.strokeStyle = '#8ec07c';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(i * box, 0);
        ctx.lineTo(i * box, canvasSize);
        ctx.moveTo(0, i * box);
        ctx.lineTo(canvasSize, i * box);
        ctx.stroke();
    }

    // Draw snake
    for (let i = 0; i < snake.length; i++) {
        if (i === 0) {
            drawSnakeHead(snake[i].x, snake[i].y, direction);
        } else {
            drawSnakeBody(snake[i].x, snake[i].y, i);
        }
    }

    // Draw food
    ctx.drawImage(appleImg, food.x, food.y, box, box);

    requestAnimationFrame(draw);
}

function drawSnakeHead(x, y, direction) {
    ctx.fillStyle = "#4a90e2";
    ctx.beginPath();
    ctx.arc(x + box / 2, y + box / 2, box / 2, 0, 2 * Math.PI);
    ctx.fill();

    // Eyes
    ctx.fillStyle = "white";
    ctx.beginPath();
    if (direction === "RIGHT") {
        ctx.arc(x + box * 3 / 4, y + box / 4, box / 8, 0, 2 * Math.PI);
        ctx.arc(x + box * 3 / 4, y + 3 * box / 4, box / 8, 0, 2 * Math.PI);
    } else if (direction === "LEFT") {
        ctx.arc(x + box / 4, y + box / 4, box / 8, 0, 2 * Math.PI);
        ctx.arc(x + box / 4, y + 3 * box / 4, box / 8, 0, 2 * Math.PI);
    } else if (direction === "UP") {
        ctx.arc(x + box / 4, y + box / 4, box / 8, 0, 2 * Math.PI);
        ctx.arc(x + 3 * box / 4, y + box / 4, box / 8, 0, 2 * Math.PI);
    } else if (direction === "DOWN") {
        ctx.arc(x + box / 4, y + 3 * box / 4, box / 8, 0, 2 * Math.PI);
        ctx.arc(x + 3 * box / 4, y + 3 * box / 4, box / 8, 0, 2 * Math.PI);
    }
    ctx.fill();

    ctx.fillStyle = "black";
    ctx.beginPath();
    if (direction === "RIGHT") {
        ctx.arc(x + box * 3 / 4, y + box / 4, box / 16, 0, 2 * Math.PI);
        ctx.arc(x + box * 3 / 4, y + 3 * box / 4, box / 16, 0, 2 * Math.PI);
    } else if (direction === "LEFT") {
        ctx.arc(x + box / 4, y + box / 4, box / 16, 0, 2 * Math.PI);
        ctx.arc(x + box / 4, y + 3 * box / 4, box / 16, 0, 2 * Math.PI);
    } else if (direction === "UP") {
        ctx.arc(x + box / 4, y + box / 4, box / 16, 0, 2 * Math.PI);
        ctx.arc(x + 3 * box / 4, y + box / 4, box / 16, 0, 2 * Math.PI);
    } else if (direction === "DOWN") {
        ctx.arc(x + box / 4, y + 3 * box / 4, box / 16, 0, 2 * Math.PI);
        ctx.arc(x + 3 * box / 4, y + 3 * box / 4, box / 16, 0, 2 * Math.PI);
    }
    ctx.fill();
}

function drawSnakeBody(x, y, index) {
    ctx.fillStyle = "#4a90e2";
    ctx.beginPath();
    if (index === snake.length - 1) { // Tail part
        ctx.arc(x + box / 2, y + box / 2, box / 2, 0, 2 * Math.PI);
    } else {
        ctx.fillRect(x, y, box, box);
    }
    ctx.fill();
}

function moveSnake() {
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (direction == "LEFT") {
        dx = -box;
        dy = 0;
    } else if (direction == "UP") {
        dx = 0;
        dy = -box;
    } else if (direction == "RIGHT") {
        dx = box;
        dy = 0;
    } else if (direction == "DOWN") {
        dx = 0;
        dy = box;
    }

    snakeX += dx;
    snakeY += dy;

    if (snakeX == food.x && snakeY == food.y) {
        score++;
        scoreElement.textContent = score;
        food = {
            x: Math.floor(Math.random() * 19 + 1) * box,
            y: Math.floor(Math.random() * 19 + 1) * box
        };
    } else {
        snake.pop();
    }

    let newHead = {
        x: snakeX,
        y: snakeY
    };

    // Check for collision with walls
    if (snakeX < 0 || snakeY < 0 || snakeX >= canvasSize || snakeY >= canvasSize) { 
        gameOver();
        return;
    }

    // Check for collision with self
    for (let i = 1; i < snake.length; i++) {
        if (snakeX === snake[i].x && snakeY === snake[i].y) {
            gameOver();
            return;
        }
    }

    snake.unshift(newHead);
}

resetGame();
requestAnimationFrame(draw);
