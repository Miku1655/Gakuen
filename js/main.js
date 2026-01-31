// js/main.js
let gameState = {
    money: 100000,
    debt: 5000000,
    reputation: 50,
    hardMode: false,
    yakuza: false,
    ownedSchools: [schools[0]],
    ownedBusinesses: []
};

function init() {
    loadGame();
    startTime();
    updateUI();
}

function saveGame() {
    localStorage.setItem('gakuenSave', JSON.stringify({ gameState, girls, gameTime, eventLog }));
}

function loadGame() {
    const save = localStorage.getItem('gakuenSave');
    if (save) {
        const data = JSON.parse(save);
        gameState = data.gameState;
        girls = data.girls;
        gameTime = data.gameTime;
        eventLog = data.eventLog;
    }
}

function resetGame() {
    localStorage.removeItem('gakuenSave');
    location.reload();
}

function toggleYakuza() {
    gameState.yakuza = !gameState.yakuza;
}

function updateIncome() {
    // Called in time tick, but daily applied
}

init();
