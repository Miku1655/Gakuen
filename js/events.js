// ============================================================================
// EVENTS
// ============================================================================

function triggerRandomEvent() {
    const available = EVENTS_DATA.filter(e => {
        if (e.oneTime && gameState.completedEvents.includes(e.id)) return false;
        if (gameState.eventCooldowns[e.id]) return false;

        const c = e.conditions || {};
        if (c.minMoney && gameState.money < c.minMoney) return false;
        if (c.minReputation && gameState.reputation < c.minReputation) return false;
        if (c.minGirls && gameState.girls.length < c.minGirls) return false;
        if (c.minMorale && gameState.moraleTotal < c.minMorale) return false;
        if (c.maxMorale && gameState.moraleTotal > c.maxMorale) return false;
        if (c.yakuza !== undefined && gameState.yakuzaProtection !== c.yakuza) return false;

        return Math.random() * 100 < (e.chance || 100);
    });

    if (!available.length) return;
    const event = available[Math.floor(Math.random() * available.length)];
    showEvent(event);
}

function showEvent(event) {
    document.getElementById('event-title').textContent = event.title;
    document.getElementById('event-description').textContent = event.description;

    const choices = document.getElementById('event-choices');
    choices.innerHTML = '';

    event.choices.forEach(choice => {
        const btn = document.createElement('button');
        btn.className = 'choice-btn';
        btn.textContent = choice.text;

        const cost = choice.cost || 0;
        if (cost > 0 && gameState.money < cost) {
            btn.disabled = true;
            btn.textContent += ` (Za mało ¥)`;
        }

        btn.onclick = () => selectChoice(event, choice);
        choices.appendChild(btn);
    });

    document.getElementById('event-modal').classList.add('active');
    gameState.isPaused = true;
    document.getElementById('pause-btn').textContent = '⏸ Pauza';
}

function selectChoice(event, choice) {
    const cost = choice.cost || 0;
    if (cost > gameState.money) return;

    if (cost > 0) gameState.money -= cost;

    const e = choice.effects || {};
    if (e.money) gameState.money += e.money;
    if (e.reputation) gameState.reputation = Math.max(0, Math.min(100, gameState.reputation + e.reputation));
    if (e.risk) gameState.risk = Math.max(0, Math.min(100, gameState.risk + e.risk));
    if (e.morale) gameState.girls.forEach(g => g.morale = Math.max(0, Math.min(100, g.morale + e.morale)));
    if (e.loyalty) gameState.girls.forEach(g => g.loyalty = Math.max(0, Math.min(100, g.loyalty + e.loyalty)));
    if (e.yakuzaProtection !== undefined) gameState.yakuzaProtection = e.yakuzaProtection;
    if (e.profitTax) gameState.profitTax = e.profitTax;
    if (e.unlockJob && !gameState.unlockedJobs.includes(e.unlockJob)) {
        gameState.unlockedJobs.push(e.unlockJob);
        logEvent(`🔓 ${JOBS_DATA[e.unlockJob].name}`, 'unlock');
    }
    if (e.addGirl) addRandomGirl();

    logEvent(`📰 ${event.title}`, 'event');
    gameState.completedEvents.push(event.id);
    if (event.cooldown) gameState.eventCooldowns[event.id] = event.cooldown;

    if (choice.followUpText) alert(choice.followUpText);

    document.getElementById('event-modal').classList.remove('active');
    // AUTO-RESUME
    gameState.isPaused = false;
    document.getElementById('pause-btn').textContent = '⏸ Pauza';
    updateAll();
}

function addRandomGirl() {
    const names = ['Hana','Aiko','Yui','Rin','Nao','Saki'];
    const girl = {
        id: gameState.nextGirlId++,
        name: names[Math.floor(Math.random() * names.length)] + ' ' + ['Sato','Ito','Kato'][Math.floor(Math.random() * 3)],
        age: 18 + Math.floor(Math.random() * 3),
        personality: ['Nieśmiała','Ambitna','Wesoła'][Math.floor(Math.random() * 3)],
        backstory: 'Nowa rekrutka z problemami finansowymi.',
        loyalty: 30 + Math.floor(Math.random() * 30),
        lewdness: 10 + Math.floor(Math.random() * 20),
        grades: 70 + Math.floor(Math.random() * 20),
        morale: 50 + Math.floor(Math.random() * 30),
        skills: {
            conversation: 20 + Math.floor(Math.random() * 30),
            handjob: Math.floor(Math.random() * 20),
            blowjob: Math.floor(Math.random() * 10),
            vaginal: 0, anal: 0
        },
        currentJob: 'none',
        traits: ['newbie'],
        available: true
    };
    gameState.girls.push(girl);
    logEvent(`✨ ${girl.name} dołączyła!`, 'recruit');
}

function logEvent(msg, type) {
    const ts = `${gameState.time.day}/${gameState.time.month} ${String(gameState.time.hour).padStart(2,'0')}:00`;
    gameState.eventLog.unshift({ ts, msg, type });
    if (gameState.eventLog.length > 50) gameState.eventLog = gameState.eventLog.slice(0, 50);
}

function renderEventLog() {
    const container = document.getElementById('events-log');
    if (!gameState.eventLog.length) {
        container.innerHTML = '<p>Brak wydarzeń</p>';
        return;
    }

    let html = '<div class="event-log-container">';
    gameState.eventLog.forEach(log => {
        const icons = { income:'💰', job:'💼', training:'📚', comfort:'❤️', event:'📰', unlock:'🔓', recruit:'✨', debt:'💳' };
        html += `<div class="event-log-item">
            <span class="event-time">[${log.ts}]</span>
            <span>${icons[log.type] || '📋'} ${log.msg}</span>
        </div>`;
    });
    container.innerHTML = html + '</div>';
}
