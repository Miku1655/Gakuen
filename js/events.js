// ============================================================================
// WYDARZENIA
// ============================================================================

function tryTriggerEvent() {
    // Powrót z randki – tylko jeśli ktoś pracuje na school_dates
    if (Math.random() < EVENT_DATE_RETURN.chance / 100 &&
        !gameState.eventCooldowns[EVENT_DATE_RETURN.id])
    {
        const candidates = gameState.girls.filter(g => g.job === EVENT_DATE_RETURN.minJob);
        if (candidates.length === 0) return;

        const girl = candidates[~~(Math.random()*candidates.length)];
        showEvent(EVENT_DATE_RETURN, girl);
        gameState.eventCooldowns[EVENT_DATE_RETURN.id] = EVENT_DATE_RETURN.cooldown;
        return;
    }

    // Rekrutacja – bardzo rzadka
    if (Math.random() < EVENT_RECRUIT.chance / 100 &&
        !gameState.eventCooldowns[EVENT_RECRUIT.id])
    {
        showEvent(EVENT_RECRUIT);
        gameState.eventCooldowns[EVENT_RECRUIT.id] = EVENT_RECRUIT.cooldown;
    }
}

function showEvent(ev, targetGirl = null) {
    let title = ev.title;
    let desc = "";

    if (ev.id === "date_return") {
        desc = `${targetGirl.name} wraca zmęczona z randki.\nTrzyma kopertę z pieniędzmi.\n„Dał radę… ale był bardzo nachalny.”`;
    } else if (ev.id === "recruit") {
        desc = "Nowa uczennica wygląda na zagubioną.\nZaproponować jej pracę? (¥50,000)";
    }

    document.getElementById('event-title').textContent = title;
    document.getElementById('event-description').textContent = desc;

    const chDiv = document.getElementById('event-choices');
    chDiv.innerHTML = '';

    let choices = [];

    if (ev.id === "date_return") {
        choices = [
            { txt: "Przytul i pochwal", eff: () => {
                targetGirl.loyalty += 12;
                targetGirl.morale += 18;
                gameState.money += 5000;
                log(`Przytulono ${targetGirl.name} → +lojalność, +morale, +¥5000`);
            }},
            { txt: "Tylko weź pieniądze", eff: () => {
                targetGirl.loyalty -= 7;
                targetGirl.morale -= 14;
                gameState.money += 5000;
                log(`Zabrano pieniądze ${targetGirl.name} → -lojalność, -morale`);
            }}
        ];
    } else if (ev.id === "recruit") {
        choices = [
            { txt: `Zrekrutuj (-¥${EVENT_RECRUIT.cost.toLocaleString()})`, eff: () => {
                if (gameState.money < EVENT_RECRUIT.cost) return;
                gameState.money -= EVENT_RECRUIT.cost;
                addRandomGirl();
            }},
            { txt: "Zignoruj", eff: () => {} }
        ];
    }

    choices.forEach(c => {
        const btn = document.createElement('button');
        btn.className = 'choice-btn';
        btn.textContent = c.txt;
        btn.onclick = () => {
            c.eff();
            document.getElementById('event-modal').classList.remove('active');
            gameState.isPaused = false;
            document.getElementById('pause-btn').textContent = '⏸ Pauza';
            updateAll();
            renderGirls();
        };
        chDiv.appendChild(btn);
    });

    document.getElementById('event-modal').classList.add('active');
    gameState.isPaused = true;
    document.getElementById('pause-btn').textContent = '▶ Start';
}
