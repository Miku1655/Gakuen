// ============================================================================
// EVENTS SYSTEM
// ============================================================================

// ============================================================================
// EVENT TRIGGERING & FILTERING
// ============================================================================

function triggerRandomEvent() {
    const available = getAvailableEvents();
    if (!available.length) return;

    const event = selectRandomEvent(available);
    const eventInstance = prepareEventInstance(event);
    
    if (!eventInstance) return;
    
    showEvent(eventInstance);
}

function getAvailableEvents() {
    return EVENTS_DATA.filter(event => {
        if (!isEventAvailable(event)) return false;
        if (!checkEventConditions(event)) return false;
        return Math.random() * 100 < (event.chance || 100);
    });
}

function isEventAvailable(event) {
    if (event.oneTime && gameState.completedEvents.includes(event.id)) return false;
    if (gameState.eventCooldowns[event.id]) return false;
    return true;
}

function checkEventConditions(event) {
    const c = event.conditions || {};

    const conditionCheckers = {
        minMoney: () => gameState.money >= c.minMoney,
        maxMoney: () => gameState.money <= c.maxMoney,

        minReputation: () => gameState.reputation >= c.minReputation,
        maxReputation: () => gameState.reputation <= c.maxReputation,
        minRisk: () => gameState.risk >= c.minRisk,
        maxRisk: () => gameState.risk <= c.maxRisk,
        minMorale: () => gameState.moraleTotal >= c.minMorale,
        maxMorale: () => gameState.moraleTotal <= c.maxMorale,

        // yakuza:true = needs yakuza; yakuza:false = needs NO yakuza
        yakuza: () => gameState.yakuzaProtection === c.yakuza,

        minGirls: () => gameState.girls.length >= c.minGirls,
        maxGirls: () => gameState.girls.length <= c.maxGirls,
        exactGirls: () => gameState.girls.length === c.exactGirls,

        // City-specific events: cityId must match active city
        cityId: () => {
            if (typeof getActiveCity !== 'function') return true;
            return getActiveCity() === c.cityId;
        },

        // Minimum number of unlocked schools
        minSchools: () => {
            return gameState.unlockedSchools && gameState.unlockedSchools.length >= c.minSchools;
        },

        // City must be unlocked
        cityUnlocked: () => {
            return gameState.unlockedCities && gameState.unlockedCities.includes(c.cityUnlocked);
        },

        // Achievement check for unlock conditions
        hasAchievement: () => {
            return gameState.earnedAchievements && gameState.earnedAchievements.includes(c.hasAchievement);
        },

        minAvgLoyalty: () => {
            if (!gameState.girls.length) return false;
            const avg = gameState.girls.reduce((sum, g) => sum + g.loyalty, 0) / gameState.girls.length;
            return avg >= c.minAvgLoyalty;
        },
        maxAvgLoyalty: () => {
            if (!gameState.girls.length) return true;
            const avg = gameState.girls.reduce((sum, g) => sum + g.loyalty, 0) / gameState.girls.length;
            return avg <= c.maxAvgLoyalty;
        },
        minAvgLewdness: () => {
            if (!gameState.girls.length) return false;
            const avg = gameState.girls.reduce((sum, g) => sum + g.lewdness, 0) / gameState.girls.length;
            return avg >= c.minAvgLewdness;
        },
        maxAvgLewdness: () => {
            if (!gameState.girls.length) return true;
            const avg = gameState.girls.reduce((sum, g) => sum + g.lewdness, 0) / gameState.girls.length;
            return avg <= c.maxAvgLewdness;
        },
        minAvgGrades: () => {
            if (!gameState.girls.length) return false;
            const avg = gameState.girls.reduce((sum, g) => sum + g.grades, 0) / gameState.girls.length;
            return avg >= c.minAvgGrades;
        },

        minAvailableGirls: () => {
            const available = gameState.girls.filter(g => g.available).length;
            return available >= c.minAvailableGirls;
        },
        maxAvailableGirls: () => {
            const available = gameState.girls.filter(g => g.available).length;
            return available <= c.maxAvailableGirls;
        },
        minWorkingGirls: () => {
            const working = gameState.girls.filter(g => g.currentJob !== 'none').length;
            return working >= c.minWorkingGirls;
        }
    };

    return Object.keys(c).every(key =>
        conditionCheckers[key] ? conditionCheckers[key]() : true
    );
}

function selectRandomEvent(availableEvents) {
    return availableEvents[Math.floor(Math.random() * availableEvents.length)];
}

// ============================================================================
// EVENT INSTANCE PREPARATION
// ============================================================================

function prepareEventInstance(event) {
    if (event.targetJob) return prepareGirlTargetedEvent(event);
    if (event.targetRandomGirl) return prepareRandomGirlEvent(event);
    return { ...event };
}

function prepareGirlTargetedEvent(event) {
    const eligibleGirls = getEligibleGirlsForEvent(event);
    if (!eligibleGirls.length) return null;
    const targetGirl = eligibleGirls[Math.floor(Math.random() * eligibleGirls.length)];
    return {
        ...event,
        description: replaceGirlPlaceholders(event.templateDescription || event.description, targetGirl),
        targetGirlId: targetGirl.id,
        targetGirlName: targetGirl.name
    };
}

function prepareRandomGirlEvent(event) {
    // Apply girlConditions filter even for targetRandomGirl events
    const eligibleGirls = getEligibleGirlsForEvent(event);
    if (!eligibleGirls.length) return null;
    const targetGirl = eligibleGirls[Math.floor(Math.random() * eligibleGirls.length)];
    return {
        ...event,
        description: replaceGirlPlaceholders(event.templateDescription || event.description, targetGirl),
        targetGirlId: targetGirl.id,
        targetGirlName: targetGirl.name
    };
}

function getEligibleGirlsForEvent(event) {
    return gameState.girls.filter(girl => {
        if (!girl.available) return false;
        if (event.targetJob && girl.currentJob !== event.targetJob) return false;

        const gc = event.girlConditions || {};
        if (gc.minLoyalty   && girl.loyalty   < gc.minLoyalty)   return false;
        if (gc.maxLoyalty   && girl.loyalty   > gc.maxLoyalty)   return false;
        if (gc.minLewdness  && girl.lewdness  < gc.minLewdness)  return false;
        if (gc.maxLewdness  && girl.lewdness  > gc.maxLewdness)  return false;
        if (gc.minMorale    && girl.morale    < gc.minMorale)    return false;
        if (gc.maxMorale    && girl.morale    > gc.maxMorale)    return false;
        if (gc.hasTrait     && !girl.traits.includes(gc.hasTrait))  return false;
        if (gc.notHasTrait  && girl.traits.includes(gc.notHasTrait)) return false;
        return true;
    });
}

function replaceGirlPlaceholders(text, girl) {
    if (!text) return '';
    var replaced = text
        .replace(/\{girlName\}/g, girl.name)
        .replace(/\{girlAge\}/g, girl.age)
        .replace(/\{girlPersonality\}/g, girl.personality)
        .replace(/\{girlJob\}/g, JOBS_DATA[girl.currentJob]?.name || 'Bez pracy');

    // Profile-based placeholders
    var profile = girl.profile || {};
    if (replaced.includes('{girlDream}'))  replaced = replaced.replace(/\{girlDream\}/g,  profile.dream  || 'mieć spokój');
    if (replaced.includes('{girlFear}'))   replaced = replaced.replace(/\{girlFear\}/g,   profile.fear   || 'stracić wszystko');
    if (replaced.includes('{girlHobby}')) {
        var hobbyText = profile.hobby ? girl.name + ' jest pogrążona w swoim hobby: ' + profile.hobby : girl.name + ' odpoczywa';
        replaced = replaced.replace(/\{girlHobby\}/g, hobbyText);
    }
    if (replaced.includes('{girlQuote}'))  replaced = replaced.replace(/\{girlQuote\}/g,  profile.quote  || '...');
    return replaced;
}

// ============================================================================
// EVENT DISPLAY
// ============================================================================

function showEvent(event) {
    document.getElementById('event-title').textContent = event.title;
    document.getElementById('event-description').textContent = event.description;

    const choicesContainer = document.getElementById('event-choices');
    choicesContainer.innerHTML = '';

    event.choices.forEach(choice => {
        const btn = createChoiceButton(event, choice);
        choicesContainer.appendChild(btn);
    });

    document.getElementById('event-modal').classList.add('active');
    gameState.isPaused = true;
    document.getElementById('pause-btn').textContent = '⏸ Pauza';
}

function createChoiceButton(event, choice) {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.textContent = choice.text;

    const isAvailable = checkChoiceRequirements(choice);
    if (!isAvailable.available) {
        btn.disabled = true;
        btn.textContent += ` (${isAvailable.reason})`;
    }

    btn.onclick = () => selectChoice(event, choice);
    return btn;
}

function checkChoiceRequirements(choice) {
    const cost = choice.cost || 0;
    if (cost > 0 && gameState.money < cost) return { available: false, reason: 'Za mało ¥' };

    const req = choice.requirements || {};
    if (req.minReputation && gameState.reputation < req.minReputation)
        return { available: false, reason: 'Za mała reputacja' };
    if (req.minGirls && gameState.girls.length < req.minGirls)
        return { available: false, reason: 'Za mało dziewczyn' };
    if (req.needsYakuza && !gameState.yakuzaProtection)
        return { available: false, reason: 'Wymaga ochrony Yakuzy' };

    return { available: true };
}

// ============================================================================
// CHOICE HANDLING & EFFECTS
// ============================================================================

function selectChoice(event, choice) {
    if (!checkChoiceRequirements(choice).available) return;

    const cost = choice.cost || 0;
    if (cost > 0) gameState.money -= cost;

    applyChoiceEffects(event, choice);
    handleEventCompletion(event);
    closeEventModal();

    // Process milestones and achievements after effects
    if (typeof checkAllGirlMilestones === 'function') checkAllGirlMilestones();
    if (typeof checkAchievements === 'function') checkAchievements();
    
    updateAll();
}

function applyChoiceEffects(event, choice) {
    const effects = choice.effects || {};

    if (event.targetGirlId) {
        applyGirlEffects(event.targetGirlId, effects);
    }
    // Always apply global effects (bug fix: was skipped for girl-targeted events)
    applyGlobalEffects(effects);
    applyUniversalEffects(effects, event.targetGirlId);
    applyChoiceNpcEffect(choice);
    handleFollowUpText(event, choice);
}

function applyGirlEffects(girlId, effects) {
    const girl = gameState.girls.find(g => g.id === girlId);
    if (!girl) return;

    const girlEffectHandlers = {
        loyalty:     (v) => { girl.loyalty  = clamp(girl.loyalty  + v, 0, 100); },
        morale:      (v) => { girl.morale   = clamp(girl.morale   + v, 0, 100); },
        lewdness:    (v) => { girl.lewdness = clamp(girl.lewdness + v, 0, 100); },
        grades:      (v) => { girl.grades   = clamp(girl.grades   + v, 0, 100); },
        addTrait:    (t) => { if (!girl.traits.includes(t)) girl.traits.push(t); },
        removeTrait: (t) => { girl.traits = girl.traits.filter(x => x !== t); },
        skillBoost:  (sd) => {
            for (let sk in sd) {
                if (girl.skills[sk] !== undefined)
                    girl.skills[sk] = clamp(girl.skills[sk] + sd[sk], 0, 100);
            }
        }
    };

    for (let effect in effects) {
        if (girlEffectHandlers[effect]) girlEffectHandlers[effect](effects[effect]);
    }

    // Update morale total after girl effects
    if (typeof updateAverageMorale === 'function') updateAverageMorale();

    logEvent(`💝 ${girl.name} – zdarzenie`, 'date');
}

function applyGlobalEffects(effects) {
    const globalEffectHandlers = {
        morale:     (v) => { gameState.girls.forEach(g => { g.morale  = clamp(g.morale  + v, 0, 100); }); },
        loyalty:    (v) => { gameState.girls.forEach(g => { g.loyalty = clamp(g.loyalty + v, 0, 100); }); },
        lewdness:   (v) => { gameState.girls.forEach(g => { g.lewdness = clamp(g.lewdness + v, 0, 100); }); },
        reputation: (v) => { gameState.reputation = clamp(gameState.reputation + v, 0, 100); },
        risk:       (v) => { gameState.risk       = clamp(gameState.risk       + v, 0, 100); },
        yakuzaProtection: (v) => { gameState.yakuzaProtection = v; },
        profitTax:  (v) => { gameState.profitTax = v; }
    };

    for (let effect in effects) {
        if (globalEffectHandlers[effect]) globalEffectHandlers[effect](effects[effect]);
    }

    if (typeof updateAverageMorale === 'function') updateAverageMorale();
}

function applyUniversalEffects(effects, targetGirlId) {
    if (effects.money) gameState.money += effects.money;

    if (effects.unlockJob && !gameState.unlockedJobs.includes(effects.unlockJob)) {
        gameState.unlockedJobs.push(effects.unlockJob);
        const jobName = JOBS_DATA[effects.unlockJob]?.name || effects.unlockJob;
        logEvent(`🔓 ${jobName} odblokowane`, 'unlock');
    }

    // City unlock (from city events)
    if (effects.unlockCity && typeof unlockCity === 'function') {
        unlockCity(effects.unlockCity);
    }

    if (effects.addGirl) {
        const newGirl = generateRandomGirl();
        gameState.girls.push(newGirl);
        // Add to active school
        if (typeof getSchool === 'function') {
            getSchool(gameState.activeSchoolId).girlIds.push(newGirl.id);
        }
        logEvent(`✨ ${newGirl.name} dołączyła do ${SCHOOL_TEMPLATES[gameState.activeSchoolId]?.name || 'szkoły'}!`, 'recruit');
    }

    if (effects.addGirls) {
        for (let i = 0; i < effects.addGirls; i++) {
            const newGirl = generateRandomGirl();
            gameState.girls.push(newGirl);
            if (typeof getSchool === 'function') {
                getSchool(gameState.activeSchoolId).girlIds.push(newGirl.id);
            }
        }
        logEvent(`✨ ${effects.addGirls} nowych dziewczyn dołączyło!`, 'recruit');
    }

    if (effects.removeGirl) {
        let girlIndex;
        if (targetGirlId !== undefined && targetGirlId !== null) {
            girlIndex = gameState.girls.findIndex(g => g.id === targetGirlId);
            if (girlIndex === -1) girlIndex = Math.floor(Math.random() * gameState.girls.length);
        } else {
            girlIndex = Math.floor(Math.random() * gameState.girls.length);
        }
        if (gameState.girls.length > 0) {
            const removedGirl = gameState.girls.splice(girlIndex, 1)[0];
            // Remove from all school records
            Object.keys(gameState.schools || {}).forEach(sid => {
                if (gameState.schools[sid].girlIds) {
                    gameState.schools[sid].girlIds = gameState.schools[sid].girlIds.filter(id => id !== removedGirl.id);
                }
            });
            logEvent(`⚠️ ${removedGirl.name} odeszła`, 'event');
        }
    }

    if (effects.customLog) {
        logEvent(effects.customLog.message, effects.customLog.type || 'event');
    }
}

// npcEffect from city events uses { id, delta } format; from expansion events uses { npc, value }
function applyChoiceNpcEffect(choice) {
    if (!choice.npcEffect || typeof applyNpcEffect !== 'function') return;
    const ne = choice.npcEffect;
    // Normalize to the format applyNpcEffect in index.html expects: { npc, value }
    if (ne.id !== undefined && ne.delta !== undefined) {
        applyNpcEffect({ npc: ne.id, value: ne.delta });
    } else if (ne.npc !== undefined && ne.value !== undefined) {
        applyNpcEffect(ne);
    }
}

function handleEventCompletion(event) {
    if (gameState.weeklyStats) gameState.weeklyStats.events++;
    if (event.cooldown) gameState.eventCooldowns[event.id] = event.cooldown;
    if (event.oneTime && !gameState.completedEvents.includes(event.id)) {
        gameState.completedEvents.push(event.id);
    }
}

function handleFollowUpText(event, choice) {
    if (!choice.followUpText) return;
    let text = choice.followUpText;
    if (event.targetGirlId) {
        const girl = gameState.girls.find(g => g.id === event.targetGirlId);
        const name = girl ? girl.name : (event.targetGirlName || '?');
        text = text.replace(/\{girlName\}/g, name);
        logEvent(`📅 ${name} – ${text}`, 'date');
    } else {
        logEvent(`📰 ${event.title} – ${text}`, 'event');
    }
    if (choice.showAlert) alert(text);
}

function closeEventModal() {
    document.getElementById('event-modal').classList.remove('active');
    gameState.isPaused = false;
    document.getElementById('pause-btn').textContent = '▶ Start';
}

// ============================================================================
// UTILITY
// ============================================================================

function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}

// ============================================================================
// GIRL GENERATION — with profile data
// ============================================================================

function generateRandomGirl() {
    const personality = PERSONALITIES[Math.floor(Math.random() * PERSONALITIES.length)];
    const first = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
    const last  = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
    const age   = 15 + Math.floor(Math.random() * 4);  // 15–18

    function rng(range) { return range[0] + Math.floor(Math.random() * (range[1] - range[0] + 1)); }

    const loyalty     = 35 + Math.floor(Math.random() * 35);
    const lewdness    = rng(personality.lewdness);
    const grades      = rng(personality.grades);
    const morale      = rng(personality.morale);
    const conversation = rng(personality.conversation);

    const handjob  = Math.max(0, Math.floor(lewdness * 0.6)  + Math.floor(Math.random() * 15) - 10);
    const blowjob  = Math.max(0, Math.floor(lewdness * 0.4)  + Math.floor(Math.random() * 12) -  8);
    const vaginal  = Math.max(0, Math.floor(lewdness * 0.3)  - 5 + Math.floor(Math.random() * 10));
    const anal     = Math.max(0, Math.floor(lewdness * 0.15) - 10 + Math.floor(Math.random() * 8));
    const feet     = Math.max(0, Math.floor(lewdness * 0.5)  + Math.floor(Math.random() * 18) - 12);

    const traits = [...personality.traits];
    if (lewdness < 15) traits.push('virgin');
    if (morale < 50)   traits.push('insecure');
    if (grades > 90)   traits.push('smart');

    // Use personality-matched backstories
    const bsPool = BACKSTORIES[personality.name] || [
        'Nowa w szkole, szuka swojego miejsca.',
        'Pochodzi z trudnej rodziny. Potrzebuje wsparcia.',
        'Marzy o lepszym życiu dla siebie i bliskich.'
    ];
    const backstory = bsPool[Math.floor(Math.random() * bsPool.length)];

    // Generate rich individual profile
    const profile = typeof generateGirlProfile === 'function'
        ? generateGirlProfile(personality, first + ' ' + last)
        : null;

    const id = gameState.nextGirlId++;

    return {
        id,
        name: `${first} ${last}`,
        age,
        personality: personality.name,
        backstory,
        profile,
        achievedMilestones: [],
        incomeBonus: 0,
        loyalty:  Math.min(95, loyalty),
        lewdness: Math.min(60, lewdness),
        grades:   Math.min(100, grades),
        morale:   Math.min(100, morale),
        skills: {
            conversation: Math.min(80, conversation),
            handjob:  Math.min(60, handjob),
            blowjob:  Math.min(50, blowjob),
            vaginal:  Math.min(40, vaginal),
            anal:     Math.min(25, anal),
            feet:     Math.min(55, feet)
        },
        currentJob: 'none',
        traits,
        available: true
    };
}

// ============================================================================
// EVENT LOGGING
// ============================================================================

function logEvent(msg, type) {
    const ts = `${gameState.time.day}/${gameState.time.month} ${String(gameState.time.hour).padStart(2,'0')}:00`;
    gameState.eventLog.unshift({ ts, msg, type });
    if (gameState.eventLog.length > 80) gameState.eventLog = gameState.eventLog.slice(0, 80);
}

function renderEventLog() {
    const container = document.getElementById('events-log');
    if (!gameState.eventLog.length) {
        container.innerHTML = '<p>Brak wydarzeń</p>';
        return;
    }
    const icons = {
        income:'💰', job:'💼', training:'📚', comfort:'❤️', event:'📰',
        unlock:'🔓', recruit:'✨', debt:'💳', date:'💝', npc:'🎭',
        achievement:'🏆', bond:'💗', school:'🏫', transfer:'✈️', expense:'💸'
    };
    let html = '<div class="event-log-container">';
    gameState.eventLog.forEach(log => {
        html += `<div class="event-log-item">
            <span class="event-time">[${log.ts}]</span>
            <span>${icons[log.type] || '📋'} ${log.msg}</span>
        </div>`;
    });
    container.innerHTML = html + '</div>';
}
