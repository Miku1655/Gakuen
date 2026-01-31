// js/time.js
let gameTime = { hour: 0, day: 1, month: 1, year: 2026 };
let speed = 1;
let paused = false;
let interval;

function startTime() {
    interval = setInterval(() => {
        if (!paused) {
            advanceTime(speed);
            updateIncome();
            checkEvents();
            updateUI();
        }
    }, 1000); // 1 real sec = 1 game hour at 1x
}

function advanceTime(amount) {
    gameTime.hour += amount;
    if (gameTime.hour >= 24) {
        gameTime.hour = 0;
        gameTime.day++;
        applyDailyEffects();
    }
    if (gameTime.day > 30) {
        gameTime.day = 1;
        gameTime.month++;
    }
    if (gameTime.month > 12) {
        gameTime.month = 1;
        gameTime.year++;
    }
}

function applyDailyEffects() {
    gameState.debt *= 1.003; // 0.3% interest
    gameState.money += calculateTotalIncome();
    if (gameState.debt <= 0 && !gameState.hardMode) enterHardMode();
}

function setSpeed(newSpeed) { speed = newSpeed; }
function togglePause() { paused = !paused; }
