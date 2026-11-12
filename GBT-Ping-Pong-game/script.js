const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// PADDLES
const paddleWidth = 15;
const paddleHeight = 100;

let player1Y = 200;
let player2Y = 200;

const player1X = 30;
const player2X = 755;

let paddleSpeed = 7;

// BALL
let ballX = 400;
let ballY = 250;

let ballSize = 12;

let ballSpeedX = 5;
let ballSpeedY = 4;

// SCORE
let score1 = 0;
let score2 = 0;

// KEYBOARD
let up1 = false;
let down1 = false;
let up2 = false;
let down2 = false;

// GAME STATE
let gameRunning = true;

// KEY PRESSES
document.addEventListener("keydown", function(event) {
    if (event.key.toLowerCase() === "w") up1 = true;
    if (event.key.toLowerCase() === "s") down1 = true;

    if (event.key === "ArrowUp") {
        up2 = true;
        event.preventDefault();
    }

    if (event.key === "ArrowDown") {
        down2 = true;
        event.preventDefault();
    }
});

// KEY RELEASES
document.addEventListener("keyup", function(event) {
    if (event.key.toLowerCase() === "w") up1 = false;
    if (event.key.toLowerCase() === "s") down1 = false;

    if (event.key === "ArrowUp") up2 = false;
    if (event.key === "ArrowDown") down2 = false;
});

// MOVE PADDLES
function movePaddles() {
    if (up1) player1Y -= paddleSpeed;
    if (down1) player1Y += paddleSpeed;

    if (up2) player2Y -= paddleSpeed;
    if (down2) player2Y += paddleSpeed;

    // Keep paddles inside the canvas
    player1Y = Math.max(0, Math.min(400, player1Y));
    player2Y = Math.max(0, Math.min(400, player2Y));
}

// MOVE BALL
function moveBall() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Top and bottom collision
    if (ballY <= 0 || ballY + ballSize >= canvas.height) {
        ballSpeedY *= -1;
    }

    // Player 1 collision
    if (
        ballSpeedX < 0 &&
        ballX <= player1X + paddleWidth &&
        ballX >= player1X &&
        ballY + ballSize >= player1Y &&
        ballY <= player1Y + paddleHeight
    ) {
        ballSpeedX *= -1;
    }

    // Player 2 collision
    if (
        ballSpeedX > 0 &&
        ballX + ballSize >= player2X &&
        ballX <= player2X + paddleWidth &&
        ballY + ballSize >= player2Y &&
        ballY <= player2Y + paddleHeight
    ) {
        ballSpeedX *= -1;
    }

    // Player 2 scores
    if (ballX < 0) {
        score2++;
        resetBall();
    }

    // Player 1 scores
    if (ballX > canvas.width) {
        score1++;
        resetBall();
    }

    // Update score
    document.getElementById("score").textContent =
        score1 + " : " + score2;

    // Check winner
    if (score1 >= 5 || score2 >= 5) {
        gameRunning = false;

        setTimeout(() => {
            alert(score1 >= 5 ? "Player 1 Wins!" : "Player 2 Wins!");
        }, 10);
    }
}

// RESET BALL
function resetBall() {
    ballX = 400;
    ballY = 250;

    ballSpeedX = ballSpeedX > 0 ? -5 : 5;
    ballSpeedY = Math.random() > 0.5 ? 4 : -4;
}

// DRAW EVERYTHING
function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Center line
    ctx.setLineDash([10, 10]);
    ctx.strokeStyle = "white";
    ctx.beginPath();
    ctx.moveTo(400, 0);
    ctx.lineTo(400, 500);
    ctx.stroke();
    ctx.setLineDash([]);

    // Paddles
    ctx.fillStyle = "white";

    ctx.fillRect(
        player1X,
        player1Y,
        paddleWidth,
        paddleHeight
    );

    ctx.fillRect(
        player2X,
        player2Y,
        paddleWidth,
        paddleHeight
    );

    // Ball
    ctx.fillRect(
        ballX,
        ballY,
        ballSize,
        ballSize
    );
}

// GAME LOOP
function gameLoop() {
    if (!gameRunning) return;

    movePaddles();
    moveBall();
    drawGame();

    requestAnimationFrame(gameLoop);
}

// RESTART
function restartGame() {
    score1 = 0;
    score2 = 0;

    player1Y = 200;
    player2Y = 200;

    ballX = 400;
    ballY = 250;

    ballSpeedX = 5;
    ballSpeedY = 4;

    gameRunning = true;

    document.getElementById("score").textContent = "0 : 0";

    gameLoop();
}

// START GAME
gameLoop();
