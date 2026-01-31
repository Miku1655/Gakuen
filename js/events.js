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

        // Dodatkowy warunek dla eventów z targetJob
        if (e.targetJob) {
            const hasGirlOnJob = gameState.girls.some(g => g.currentJob === e.targetJob);
            if (!hasGirlOnJob) return false;
        }

        return Math.random() * 100 < (e.chance || 100);
    });

    if (!available.length) return;

    const event = available[Math.floor(Math.random() * available.length)];

    // ────────────────────────────────────────────────
    // Obsługa eventów z konkretną dziewczyną
    // ────────────────────────────────────────────────
    if (event.targetJob) {
        const eligibleGirls = gameState.girls.filter(g => 
            g.currentJob === event.targetJob && g.available
        );

        if (eligibleGirls.length === 0) return; // safety, choć filtr wyżej powinien to złapać

        const targetGirl = eligibleGirls[Math.floor(Math.random() * eligibleGirls.length)];

        // Tworzymy instancję eventu z danymi konkretnej dziewczyny
        const eventInstance = {
            ...event,
            description: event.templateDescription.replace("{girlName}", targetGirl.name),
            targetGirlId: targetGirl.id,
            targetGirlName: targetGirl.name
        };

        showEvent(eventInstance);
        return;
    }

    // Normalne eventy bez konkretnej dziewczyny
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

    // ────────────────────────────────────────────────
    // Jeśli event dotyczył konkretnej dziewczyny
    // ────────────────────────────────────────────────
    if (event.targetGirlId) {
        const girl = gameState.girls.find(g => g.id === event.targetGirlId);
        if (!girl) {
            console.warn("Nie znaleziono dziewczyny o id:", event.targetGirlId);
            return;
        }

        if (e.loyalty) {
            girl.loyalty = Math.min(100, Math.max(0, girl.loyalty + e.loyalty));
        }
        if (e.morale) {
            girl.morale = Math.min(100, Math.max(0, girl.morale + e.morale));
        }
        if (e.money) {
            gameState.money += e.money;
        }

        // Log z imieniem dziewczyny
        logEvent(`📅 ${girl.name} – ${choice.followUpText}`, 'date');

        // Opcjonalny mały bonus za udaną randkę
        gameState.money += 2000 + Math.floor(Math.random() * 5000); // 2–7k dodatkowo
    }
    else {
        // Stare zachowanie – efekty globalne
        if (e.money) gameState.money += e.money;
        if (e.reputation) gameState.reputation = Math.max(0, Math.min(100, gameState.reputation + e.reputation));
        if (e.risk) gameState.risk = Math.max(0, Math.min(100, gameState.risk + e.risk));
        if (e.morale) gameState.girls.forEach(g => g.morale = Math.max(0, Math.min(100, g.morale + e.morale)));
        if (e.loyalty) gameState.girls.forEach(g => g.loyalty = Math.max(0, Math.min(100, g.loyalty + e.loyalty)));
        if (e.yakuzaProtection !== undefined) gameState.yakuzaProtection = e.yakuzaProtection;
        if (e.profitTax) gameState.profitTax = e.profitTax;

        logEvent(`📰 ${event.title} – ${choice.text}`, 'event');
    }

    // Wspólne dla wszystkich eventów
    if (e.unlockJob && !gameState.unlockedJobs.includes(e.unlockJob)) {
        gameState.unlockedJobs.push(e.unlockJob);
        logEvent(`🔓 ${JOBS_DATA[e.unlockJob].name}`, 'unlock');
    }
    if (e.addGirl) addRandomGirl();

    if (event.cooldown) gameState.eventCooldowns[event.id] = event.cooldown;
    gameState.completedEvents.push(event.id);  // ewentualnie tylko dla oneTime

    if (choice.followUpText && !event.targetGirlId) {
        alert(choice.followUpText);
    }

    document.getElementById('event-modal').classList.remove('active');
    gameState.isPaused = false;
    document.getElementById('pause-btn').textContent = '▶ Start';  // ← poprawione, bo wcześniej było na stałe 'Pauza'
    updateAll();
}

const FIRST_NAMES = ['Hana','Aiko','Yui','Rin','Nao','Saki','Mei','Sakura','Yuki','Akari','Haruka','Miyu','Noa','Hina','Sara','Aya','Emi','Riko','Yuna','Kana'];
const LAST_NAMES = ['Tanaka','Nakamura','Kobayashi','Sato','Ito','Kato','Suzuki','Yamamoto','Watanabe','Takahashi','Yamada','Sasaki','Yamaguchi','Matsumoto','Inoue'];

const PERSONALITIES = [
    {name: "Nieśmiała i wrażliwa",    conversation: [15,35], lewdness: [5,15], grades: [80,98], morale: [45,70], traits: ["virgin","shy","kind"]},
    {name: "Pewna siebie i ambitna",  conversation: [45,70], lewdness: [15,35], grades: [70,90], morale: [60,85], traits: ["confident","ambitious","athletic"]},
    {name: "Wesoła i figlarna",       conversation: [35,60], lewdness: [20,40], grades: [60,85], morale: [70,95], traits: ["cheerful","playful","cute"]},
    {name: "Skryta i mroczna",        conversation: [10,30], lewdness: [25,50], grades: [75,95], morale: [30,55], traits: ["otaku","genius","quiet"]},
    {name: "Tsundere",                conversation: [30,55], lewdness: [15,45], grades: [65,90], morale: [50,75], traits: ["tsundere","proud","competitive"]},
    {name: "Łagodna i opiekuńcza",    conversation: [40,65], lewdness: [10,25], grades: [70,92], morale: [65,90], traits: ["kind","caring","reliable"]},
    {name: "Energetyczna sportsmenka",conversation: [25,50], lewdness: [20,40], grades: [55,80], morale: [75,95], traits: ["athletic","energetic","tomboy"]},
    {name: "Inteligentna perfekcjonistka", conversation: [50,75], lewdness: [10,30], grades: [90,100], morale: [40,70], traits: ["smart","perfectionist","bookworm"]}
];

const BACKSTORIES = {
    "Nieśmiała i wrażliwa": [
        "Pochodzi z biednej rodziny, ojciec stracił pracę. Bardzo niepewna siebie.",
        "Straciła matkę w młodości, mieszka tylko z ojcem alkoholikiem.",
        "Nowa uczennica, przeniosła się z prowincji, nie ma przyjaciół."
    ],
    "Pewna siebie i ambitna": [
        "Popularna w szkole, ale rodzina ukrywa problemy finansowe.",
        "Córka byłego biznesmena, który zbankrutował.",
        "Chce zostać influencerką lub modelką, potrzebuje szybkich pieniędzy."
    ],
    // ... dodaj więcej dla pozostałych osobowości (możesz dodać 2-3 na każdą)
    // Dla prostoty możesz zrobić jedną wspólną pulę i lekko modyfikować
};

function generateRandomGirl() {
    const personality = PERSONALITIES[Math.floor(Math.random() * PERSONALITIES.length)];
    
    const first = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
    const last = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];

    const age = 16 + Math.floor(Math.random() * 4); // 16-19

    // Statystyki bazowe + modyfikatory osobowości
    const loyalty = 35 + Math.floor(Math.random() * 35);
    const lewdness = personality.lewdness[0] + Math.floor(Math.random() * (personality.lewdness[1] - personality.lewdness[0] + 1));
    const grades = personality.grades[0] + Math.floor(Math.random() * (personality.grades[1] - personality.grades[0] + 1));
    const morale = personality.morale[0] + Math.floor(Math.random() * (personality.morale[1] - personality.morale[0] + 1));

    const conversation = personality.conversation[0] + Math.floor(Math.random() * (personality.conversation[1] - personality.conversation[0] + 1));

    // Losowe umiejętności seksualne (zależne od lewdness)
    const handjob = Math.max(0, Math.floor(lewdness * 0.6) + Math.floor(Math.random() * 15) - 10);
    const blowjob = Math.max(0, Math.floor(lewdness * 0.4) + Math.floor(Math.random() * 12) - 8);
    const vaginal = Math.max(0, Math.floor(lewdness * 0.3) - 5 + Math.floor(Math.random() * 10));
    const anal = Math.max(0, Math.floor(lewdness * 0.15) - 10 + Math.floor(Math.random() * 8));
    const feet = Math.max(0, Math.floor(lewdness * 0.5) + Math.floor(Math.random() * 18) - 12);

    const traits = [...personality.traits];
    if (lewdness < 15) traits.push("virgin");
    if (morale < 50) traits.push("insecure");
    if (grades > 90) traits.push("smart");

    // Backstory – uproszczone (możesz rozbudować)
    const backstory = `${personality.name.toLowerCase()}. ${["Pochodzi z biednej rodziny.", "Ma problemy finansowe w domu.", "Nowa w Seiran Academy.", "Chce pomóc rodzinie."][Math.floor(Math.random()*4)]}`;

    return {
        id: gameState.nextGirlId++,
        name: `${first} ${last}`,
        age: age,
        personality: personality.name,
        backstory: backstory,
        loyalty: Math.min(95, loyalty),
        lewdness: Math.min(60, lewdness),           // na start raczej niskie
        grades: Math.min(100, grades),
        morale: Math.min(100, morale),
        skills: {
            conversation: Math.min(80, conversation),
            handjob: Math.min(60, handjob),
            blowjob: Math.min(50, blowjob),
            vaginal: Math.min(40, vaginal),
            anal: Math.min(25, anal),
            feet: Math.min(55, feet)
        },
        currentJob: 'none',
        traits: traits,
        available: true
    };
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
