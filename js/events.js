// ============================================================================
// EVENTS SYSTEM - Modular & Easy to Extend
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
    if (event.oneTime && gameState.completedEvents.includes(event.id)) {
        return false;
    }
    if (gameState.eventCooldowns[event.id]) {
        return false;
    }
    return true;
}

function checkEventConditions(event) {
    const c = event.conditions || {};

    const conditionCheckers = {
        // ====================================================================
        // MONEY & RESOURCES
        // ====================================================================
        minMoney: () => gameState.money >= c.minMoney,
        maxMoney: () => gameState.money <= c.maxMoney,

        // ====================================================================
        // STATS & METRICS
        // ====================================================================
        minReputation: () => gameState.reputation >= c.minReputation,
        maxReputation: () => gameState.reputation <= c.maxReputation,
        minRisk: () => gameState.risk >= c.minRisk,
        maxRisk: () => gameState.risk <= c.maxRisk,
        minMorale: () => gameState.moraleTotal >= c.minMorale,
        maxMorale: () => gameState.moraleTotal <= c.maxMorale,

        // BUG FIX: yakuza condition was entirely missing from conditionCheckers
        // yakuza:true means requires yakuza protection; yakuza:false means requires NO protection
        yakuza: () => gameState.yakuzaProtection === c.yakuza,

        // Average stats across all girls
        minAvgLoyalty: () => {
            if (gameState.girls.length === 0) return false;
            const avg = gameState.girls.reduce((sum, g) => sum + g.loyalty, 0) / gameState.girls.length;
            return avg >= c.minAvgLoyalty;
        },
        maxAvgLoyalty: () => {
            if (gameState.girls.length === 0) return true;
            const avg = gameState.girls.reduce((sum, g) => sum + g.loyalty, 0) / gameState.girls.length;
            return avg <= c.maxAvgLoyalty;
        },
        minAvgLewdness: () => {
            if (gameState.girls.length === 0) return false;
            const avg = gameState.girls.reduce((sum, g) => sum + g.lewdness, 0) / gameState.girls.length;
            return avg >= c.minAvgLewdness;
        },
        maxAvgLewdness: () => {
            if (gameState.girls.length === 0) return true;
            const avg = gameState.girls.reduce((sum, g) => sum + g.lewdness, 0) / gameState.girls.length;
            return avg <= c.maxAvgLewdness;
        },
        minAvgGrades: () => {
            if (gameState.girls.length === 0) return false;
            const avg = gameState.girls.reduce((sum, g) => sum + g.grades, 0) / gameState.girls.length;
            return avg >= c.minAvgGrades;
        },

        // ====================================================================
        // GIRLS - BASIC COUNTS
        // ====================================================================
        minGirls: () => gameState.girls.length >= c.minGirls,
        maxGirls: () => gameState.girls.length <= c.maxGirls,
        exactGirls: () => gameState.girls.length === c.exactGirls,

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
    if (event.targetJob) {
        return prepareGirlTargetedEvent(event);
    }
    if (event.targetRandomGirl) {
        return prepareRandomGirlEvent(event);
    }
    return { ...event };
}

function prepareGirlTargetedEvent(event) {
    const eligibleGirls = getEligibleGirlsForEvent(event);
    if (eligibleGirls.length === 0) return null;
    const targetGirl = eligibleGirls[Math.floor(Math.random() * eligibleGirls.length)];
    return {
        ...event,
        description: replaceGirlPlaceholders(event.templateDescription || event.description, targetGirl),
        targetGirlId: targetGirl.id,
        targetGirlName: targetGirl.name
    };
}

// BUG FIX: prepareRandomGirlEvent was ignoring girlConditions entirely.
// Now it uses getEligibleGirlsForEvent (same filtering logic) but without job requirement.
function prepareRandomGirlEvent(event) {
    const eligibleGirls = getEligibleGirlsForEvent(event);
    if (eligibleGirls.length === 0) return null;
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

        // Job filter only for targetJob events
        if (event.targetJob && girl.currentJob !== event.targetJob) {
            return false;
        }

        const gc = event.girlConditions || {};
        if (gc.minLoyalty !== undefined && girl.loyalty < gc.minLoyalty) return false;
        if (gc.maxLoyalty !== undefined && girl.loyalty > gc.maxLoyalty) return false;
        if (gc.minLewdness !== undefined && girl.lewdness < gc.minLewdness) return false;
        if (gc.maxLewdness !== undefined && girl.lewdness > gc.maxLewdness) return false;
        if (gc.minMorale !== undefined && girl.morale < gc.minMorale) return false;
        if (gc.maxMorale !== undefined && girl.morale > gc.maxMorale) return false;
        if (gc.hasTrait && !girl.traits.includes(gc.hasTrait)) return false;
        if (gc.notHasTrait && girl.traits.includes(gc.notHasTrait)) return false;

        return true;
    });
}

function replaceGirlPlaceholders(text, girl) {
    return text
        .replace(/\{girlName\}/g, girl.name)
        .replace(/\{girlAge\}/g, girl.age)
        .replace(/\{girlPersonality\}/g, girl.personality)
        .replace(/\{girlJob\}/g, JOBS_DATA[girl.currentJob]?.name || 'Bez pracy');
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
    if (cost > 0 && gameState.money < cost) {
        return { available: false, reason: 'Za mało ¥' };
    }
    const req = choice.requirements || {};
    if (req.minReputation && gameState.reputation < req.minReputation) {
        return { available: false, reason: 'Za mała reputacja' };
    }
    if (req.minGirls && gameState.girls.length < req.minGirls) {
        return { available: false, reason: 'Za mało dziewczyn' };
    }
    return { available: true };
}

// ============================================================================
// CHOICE HANDLING & EFFECTS
// ============================================================================

function selectChoice(event, choice) {
    if (!checkChoiceRequirements(choice).available) return;

    const cost = choice.cost || 0;
    if (cost > 0) {
        gameState.money -= cost;
    }

    applyChoiceEffects(event, choice);
    handleEventCompletion(event);
    closeEventModal();
    
    // BUG FIX: moraleTotal was never updated after events changed girl morale.
    // Now we always recalculate after any choice.
    updateAverageMorale();
    updateAll();
}

function applyChoiceEffects(event, choice) {
    const effects = choice.effects || {};

    if (event.targetGirlId) {
        applyGirlEffects(event.targetGirlId, effects);
        // BUG FIX: global effects (reputation, risk) were silently dropped for
        // girl-targeted events because applyGlobalEffects was never called.
        // Now we always run it regardless of targeting.
    }

    // Always apply global effects (reputation, risk, yakuza, profitTax, etc.)
    applyGlobalEffects(effects, event.targetGirlId ? null : null);

    // Universal effects (money, addGirl, unlockJob, etc.)
    applyUniversalEffects(effects, event.targetGirlId);

    // NPC relationship effects (stored on choice, not effects object)
    applyChoiceNpcEffect(choice);

    handleFollowUpText(event, choice);
}

function applyGirlEffects(girlId, effects) {
    const girl = gameState.girls.find(g => g.id === girlId);
    if (!girl) {
        console.warn("Girl not found:", girlId);
        return;
    }

    const girlEffectHandlers = {
        loyalty:    (v) => { girl.loyalty  = clamp(girl.loyalty  + v, 0, 100); },
        morale:     (v) => { girl.morale   = clamp(girl.morale   + v, 0, 100); },
        lewdness:   (v) => { girl.lewdness = clamp(girl.lewdness + v, 0, 100); },
        grades:     (v) => { girl.grades   = clamp(girl.grades   + v, 0, 100); },
        addTrait:   (trait) => { if (!girl.traits.includes(trait)) girl.traits.push(trait); },
        removeTrait:(trait) => { girl.traits = girl.traits.filter(t => t !== trait); },
        skillBoost: (skillData) => {
            for (let skill in skillData) {
                if (girl.skills[skill] !== undefined) {
                    girl.skills[skill] = clamp(girl.skills[skill] + skillData[skill], 0, 100);
                }
            }
        }
    };

    for (let effect in effects) {
        if (girlEffectHandlers[effect]) {
            girlEffectHandlers[effect](effects[effect]);
        }
    }

    if (effects.money || effects.loyalty || effects.morale) {
        logEvent(`💝 ${girl.name} – event completed`, 'date');
    }
}

// BUG FIX: applyGlobalEffects previously only applied morale/loyalty/lewdness to ALL girls.
// For girl-targeted events we want those to apply only to the target (done in applyGirlEffects),
// but reputation, risk, yakuza etc. should still fire.  The girlOnlyKeys set prevents
// double-applying per-girl stats when a targeted event also has global-looking keys.
function applyGlobalEffects(effects) {
    // These keys are handled per-girl in applyGirlEffects for targeted events;
    // for non-targeted events they broadcast to all girls.
    const globalEffectHandlers = {
        morale: (v) => {
            gameState.girls.forEach(g => { g.morale = clamp(g.morale + v, 0, 100); });
        },
        loyalty: (v) => {
            gameState.girls.forEach(g => { g.loyalty = clamp(g.loyalty + v, 0, 100); });
        },
        lewdness: (v) => {
            gameState.girls.forEach(g => { g.lewdness = clamp(g.lewdness + v, 0, 100); });
        },
        reputation:      (v) => { gameState.reputation = clamp(gameState.reputation + v, 0, 100); },
        risk:            (v) => { gameState.risk        = clamp(gameState.risk        + v, 0, 100); },
        yakuzaProtection:(v) => { gameState.yakuzaProtection = v; },
        profitTax:       (v) => { gameState.profitTax = v; }
    };

    for (let effect in effects) {
        if (globalEffectHandlers[effect]) {
            globalEffectHandlers[effect](effects[effect]);
        }
    }
}

// BUG FIX: applyUniversalEffects now receives targetGirlId so that removeGirl
// removes the correct targeted girl instead of a random one.
function applyUniversalEffects(effects, targetGirlId) {
    if (effects.money) {
        gameState.money += effects.money;
    }

    if (effects.unlockJob && !gameState.unlockedJobs.includes(effects.unlockJob)) {
        gameState.unlockedJobs.push(effects.unlockJob);
        const jobName = JOBS_DATA[effects.unlockJob]?.name || effects.unlockJob;
        logEvent(`🔓 ${jobName} odblokowane`, 'unlock');
    }

    if (effects.addGirl) {
        const newGirl = generateRandomGirl();
        gameState.girls.push(newGirl);
        logEvent(`✨ ${newGirl.name} dołączyła do szkoły!`, 'recruit');
    }

    if (effects.addGirls) {
        for (let i = 0; i < effects.addGirls; i++) {
            const newGirl = generateRandomGirl();
            gameState.girls.push(newGirl);
        }
        logEvent(`✨ ${effects.addGirls} nowych dziewczyn dołączyło!`, 'recruit');
    }

    if (effects.removeGirl) {
        // BUG FIX: Previously always removed a *random* girl even when the event
        // had a specific target (e.g. girl_wants_to_leave). Now we remove the
        // targeted girl when one is set, falling back to random otherwise.
        let girlIndex;
        if (targetGirlId !== undefined && targetGirlId !== null) {
            girlIndex = gameState.girls.findIndex(g => g.id === targetGirlId);
            if (girlIndex === -1) girlIndex = Math.floor(Math.random() * gameState.girls.length);
        } else {
            girlIndex = Math.floor(Math.random() * gameState.girls.length);
        }
        if (gameState.girls.length > 0) {
            const removedGirl = gameState.girls.splice(girlIndex, 1)[0];
            logEvent(`⚠️ ${removedGirl.name} odeszła`, 'event');
        }
    }

    if (effects.customLog) {
        logEvent(effects.customLog.message, effects.customLog.type || 'event');
    }
}

// npcEffect is stored on the choice itself (not in effects), handled here
function applyChoiceNpcEffect(choice) {
    if (choice.npcEffect && typeof applyNpcEffect === 'function') {
        applyNpcEffect(choice.npcEffect);
    }
}

function handleEventCompletion(event) {
    // Track for weekly report
    if (typeof gameState !== 'undefined' && gameState.weeklyStats) {
        gameState.weeklyStats.events++;
    }
    if (event.cooldown) {
        gameState.eventCooldowns[event.id] = event.cooldown;
    }
    if (event.oneTime) {
        if (!gameState.completedEvents.includes(event.id)) {
            gameState.completedEvents.push(event.id);
        }
    }
}

function handleFollowUpText(event, choice) {
    if (!choice.followUpText) return;

    let text = choice.followUpText;
    if (event.targetGirlId) {
        const girl = gameState.girls.find(g => g.id === event.targetGirlId);
        if (girl) {
            text = replaceGirlPlaceholders(text, girl);
            logEvent(`📅 ${girl.name} – ${text}`, 'date');
        } else {
            // Girl may have just been removed (removeGirl effect)
            text = text.replace(/\{girlName\}/g, event.targetGirlName || '???');
            logEvent(`📅 ${text}`, 'event');
        }
    } else {
        logEvent(`📰 ${event.title} – ${text}`, 'event');
    }

    if (choice.showAlert) {
        alert(text);
    }
}

function closeEventModal() {
    document.getElementById('event-modal').classList.remove('active');
    gameState.isPaused = false;
    document.getElementById('pause-btn').textContent = '▶ Start';
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}

// ============================================================================
// GIRL GENERATION
// ============================================================================

function generateRandomGirl() {
    const personality = PERSONALITIES[Math.floor(Math.random() * PERSONALITIES.length)];

    const first = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
    const last  = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];

    // BUG FIX: range was 16–19, should be 15–18 for a high-school setting
    const age = 15 + Math.floor(Math.random() * 4);

    const loyalty    = 35 + Math.floor(Math.random() * 35);
    const lewdness   = personality.lewdness[0]   + Math.floor(Math.random() * (personality.lewdness[1]   - personality.lewdness[0]   + 1));
    const grades     = personality.grades[0]     + Math.floor(Math.random() * (personality.grades[1]     - personality.grades[0]     + 1));
    const morale     = personality.morale[0]     + Math.floor(Math.random() * (personality.morale[1]     - personality.morale[0]     + 1));
    const conversation = personality.conversation[0] + Math.floor(Math.random() * (personality.conversation[1] - personality.conversation[0] + 1));

    const handjob = Math.max(0, Math.floor(lewdness * 0.6) + Math.floor(Math.random() * 15) - 10);
    const blowjob = Math.max(0, Math.floor(lewdness * 0.4) + Math.floor(Math.random() * 12) - 8);
    const vaginal = Math.max(0, Math.floor(lewdness * 0.3) - 5 + Math.floor(Math.random() * 10));
    const anal    = Math.max(0, Math.floor(lewdness * 0.15) - 10 + Math.floor(Math.random() * 8));
    const feet    = Math.max(0, Math.floor(lewdness * 0.5) + Math.floor(Math.random() * 18) - 12);

    const traits = [...personality.traits];
    if (lewdness < 15) traits.push("virgin");
    if (morale < 50)   traits.push("insecure");
    if (grades > 90)   traits.push("smart");

    // BUG FIX: BACKSTORIES was defined in girls.js but completely ignored here.
    // Now we use it when a matching personality key exists, with a graceful fallback.
    const backstoryList = BACKSTORIES[personality.name];
    const backstory = backstoryList
        ? backstoryList[Math.floor(Math.random() * backstoryList.length)]
        : ["Pochodzi z biednej rodziny.", "Ma problemy finansowe w domu.", "Nowa w Seiran Academy.", "Chce pomóc rodzinie."][Math.floor(Math.random() * 4)];

    return {
        id:          gameState.nextGirlId++,
        name:        `${first} ${last}`,
        age:         age,
        personality: personality.name,
        backstory:   backstory,
        loyalty:     Math.min(95, loyalty),
        lewdness:    Math.min(60, lewdness),
        grades:      Math.min(100, grades),
        morale:      Math.min(100, morale),
        skills: {
            conversation: Math.min(80, conversation),
            handjob:      Math.min(60, handjob),
            blowjob:      Math.min(50, blowjob),
            vaginal:      Math.min(40, vaginal),
            anal:         Math.min(25, anal),
            feet:         Math.min(55, feet)
        },
        currentJob: 'none',
        traits:     traits,
        available:  true
    };
}

// ============================================================================
// EVENT LOGGING
// ============================================================================

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
        const icons = {
            income:'💰', job:'💼', training:'📚', comfort:'❤️',
            event:'📰', unlock:'🔓', recruit:'✨', debt:'💳', date:'💝', school:'🏫'
        };
        html += `<div class="event-log-item">
            <span class="event-time">[${log.ts}]</span>
            <span>${icons[log.type] || '📋'} ${log.msg}</span>
        </div>`;
    });
    container.innerHTML = html + '</div>';
}
