// js/events.js
let eventLog = [];
let activeEvents = [];

function checkEvents() {
    if (Math.random() < 0.18 / 24 / speed) { // Adjusted chance per tick
        triggerRandomEvent();
    }
}

function triggerRandomEvent() {
    const event = eventsData[Math.floor(Math.random() * eventsData.length)];
    showModal(event.text, event.choices.map(c => `<button onclick="handleChoice('${c.effect}')">${c.text}</button>`).join(''));
    activeEvents.push(event);
}

function handleChoice(effect) {
    // Parse effect like 'morale+10'
    const [stat, change] = effect.split(/[+-]/);
    const amount = parseInt(effect.match(/[+-]\d+/)[0]);
    // Apply to random girl or global
    const girl = girls[Math.floor(Math.random() * girls.length)];
    if (statTypes.includes(stat)) girl.stats[stat] += amount;
    eventLog.push(`Event: ${effect}`);
    closeModal();
}

function enterHardMode() {
    gameState.hardMode = true;
    // Unlock new jobs, cities, events
    jobs.push({ name: 'Idol Agency', reqLewd: 100, baseIncome: 50000, risk: 70 });
    cities.push('Seoul');
    eventsData.push({ id: 'rivalAttack', chance: 0.05, text: 'Rival attacks!', choices:});
    showModal('Entered Hard Mode!');
}
