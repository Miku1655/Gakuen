// js/girls.js
let girls = [
    generateGirl('Sakura'), generateGirl('Yuki'), generateGirl('Mei')
];

function generateGirl(name = names[Math.floor(Math.random() * names.length)]) {
    return {
        name,
        age: 18 + Math.floor(Math.random() * 5),
        personality: personalities[Math.floor(Math.random() * personalities.length)],
        backstory: 'Generated backstory.', // Can be randomized or from list
        stats: { loyalty: 50, lewdness: 10, grades: 70, morale: 80 }, // Extend with new stats
        skills: { conversation: 20, handjob: 0, blowjob: 0, vaginal: 0, anal: 0 }, // Extend skills
        traits: [traits[Math.floor(Math.random() * traits.length)]],
        job: null,
        history: []
    };
}

function recruitGirl() {
    const cost = 50000 + Math.random() * 150000;
    if (gameState.money >= cost) {
        gameState.money -= cost;
        girls.push(generateGirl());
        updateGirlsList();
    }
}

function assignJob(girlIndex, jobName) {
    const girl = girls[girlIndex];
    const job = jobs.find(j => j.name === jobName);
    if (girl.stats.lewdness >= job.reqLewd) {
        girl.job = job;
    }
}

function trainSkill(girlIndex, skill, cost = 10000) {
    const girl = girls[girlIndex];
    if (gameState.money >= cost) {
        gameState.money -= cost;
        girl.skills[skill] += 5 + Math.random() * 5;
        girl.history.push(`Trained ${skill}`);
    }
}

function calculateGirlIncome(girl) {
    if (!girl.job) return 0;
    let income = girl.job.baseIncome;
    income *= (1 + girl.stats.loyalty / 100);
    income *= (girl.stats.morale / 100);
    // Apply traits, personality bonuses here
    return income;
}
