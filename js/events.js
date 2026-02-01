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
    
    if (!eventInstance) return; // Failed to prepare (e.g., no eligible girls)
    
    showEvent(eventInstance);
}

function getAvailableEvents() {
    return EVENTS_DATA.filter(event => {
        // Check if event is still available
        if (!isEventAvailable(event)) return false;
        
        // Check all conditions
        if (!checkEventConditions(event)) return false;
        
        // Check random chance
        return Math.random() * 100 < (event.chance || 100);
    });
}

function isEventAvailable(event) {
    // One-time events that are completed
    if (event.oneTime && gameState.completedEvents.includes(event.id)) {
        return false;
    }
    
    // Events on cooldown
    if (gameState.eventCooldowns[event.id]) {
        return false;
    }
    
    return true;
}

function checkEventConditions(event) {
    const c = event.conditions || {};
    
    // Define all condition checkers
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
        
        // Available girls (not working/sick/etc)
        minAvailableGirls: () => {
            const available = gameState.girls.filter(g => g.available).length;
            return available >= c.minAvailableGirls;
        },
        maxAvailableGirls: () => {
            const available = gameState.girls.filter(g => g.available).length;
            return available <= c.maxAvailableGirls;
        },
        
        // Working girls (any job except 'none')
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
    // You can add weighted random selection here if needed
    return availableEvents[Math.floor(Math.random() * availableEvents.length)];
}

// ============================================================================
// EVENT INSTANCE PREPARATION
// ============================================================================

function prepareEventInstance(event) {
    // If event targets a specific girl
    if (event.targetJob) {
        return prepareGirlTargetedEvent(event);
    }
    
    // If event targets a random girl (without job requirement)
    if (event.targetRandomGirl) {
        return prepareRandomGirlEvent(event);
    }
    
    // Regular event - no girl targeting
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

function prepareRandomGirlEvent(event) {
    const availableGirls = gameState.girls.filter(g => g.available);
    
    if (availableGirls.length === 0) return null;
    
    const targetGirl = availableGirls[Math.floor(Math.random() * availableGirls.length)];
    
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
        
        // Check job requirement
        if (event.targetJob && girl.currentJob !== event.targetJob) {
            return false;
        }
        
        // Check girl-specific conditions
        const gc = event.girlConditions || {};
        
        if (gc.minLoyalty && girl.loyalty < gc.minLoyalty) return false;
        if (gc.maxLoyalty && girl.loyalty > gc.maxLoyalty) return false;
        if (gc.minLewdness && girl.lewdness < gc.minLewdness) return false;
        if (gc.maxLewdness && girl.lewdness > gc.maxLewdness) return false;
        if (gc.minMorale && girl.morale < gc.minMorale) return false;
        if (gc.maxMorale && girl.morale > gc.maxMorale) return false;
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

    // Check if choice is available
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
    
    // Add more requirement checks here
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
    // Validate choice
    if (!checkChoiceRequirements(choice).available) return;

    // Pay cost
    const cost = choice.cost || 0;
    if (cost > 0) {
        gameState.money -= cost;
    }

    // Apply effects
    applyChoiceEffects(event, choice);

    // Handle cooldown and completion
    handleEventCompletion(event);

    // Close modal
    closeEventModal();
    
    // Update UI
    updateAll();
}

function applyChoiceEffects(event, choice) {
    const effects = choice.effects || {};
    
    // If event targets a specific girl, apply girl-specific effects first
    if (event.targetGirlId) {
        applyGirlEffects(event.targetGirlId, effects);
    } else {
        // Apply global effects
        applyGlobalEffects(effects);
    }
    
    // Apply universal effects (work for both targeted and global events)
    applyUniversalEffects(effects);
    
    // Handle follow-up text
    handleFollowUpText(event, choice);
}

function applyGirlEffects(girlId, effects) {
    const girl = gameState.girls.find(g => g.id === girlId);
    if (!girl) {
        console.warn("Girl not found:", girlId);
        return;
    }
    
    // Define all possible girl effects
    const girlEffectHandlers = {
        loyalty: (value) => { girl.loyalty = clamp(girl.loyalty + value, 0, 100); },
        morale: (value) => { girl.morale = clamp(girl.morale + value, 0, 100); },
        lewdness: (value) => { girl.lewdness = clamp(girl.lewdness + value, 0, 100); },
        grades: (value) => { girl.grades = clamp(girl.grades + value, 0, 100); },
        addTrait: (trait) => { 
            if (!girl.traits.includes(trait)) girl.traits.push(trait); 
        },
        removeTrait: (trait) => { 
            girl.traits = girl.traits.filter(t => t !== trait); 
        },
        skillBoost: (skillData) => {
            for (let skill in skillData) {
                if (girl.skills[skill] !== undefined) {
                    girl.skills[skill] = clamp(girl.skills[skill] + skillData[skill], 0, 100);
                }
            }
        }
    };
    
    // Apply all girl effects
    for (let effect in effects) {
        if (girlEffectHandlers[effect]) {
            girlEffectHandlers[effect](effects[effect]);
        }
    }
    
    // Log girl-specific event
    if (effects.money || effects.loyalty || effects.morale) {
        logEvent(`💝 ${girl.name} – event completed`, 'date');
    }
}

function applyGlobalEffects(effects) {
    // Define all possible global effects
    const globalEffectHandlers = {
        morale: (value) => {
            gameState.girls.forEach(g => {
                g.morale = clamp(g.morale + value, 0, 100);
            });
        },
        loyalty: (value) => {
            gameState.girls.forEach(g => {
                g.loyalty = clamp(g.loyalty + value, 0, 100);
            });
        },
        lewdness: (value) => {
            gameState.girls.forEach(g => {
                g.lewdness = clamp(g.lewdness + value, 0, 100);
            });
        },
        reputation: (value) => {
            gameState.reputation = clamp(gameState.reputation + value, 0, 100);
        },
        risk: (value) => {
            gameState.risk = clamp(gameState.risk + value, 0, 100);
        },
        yakuzaProtection: (value) => {
            gameState.yakuzaProtection = value;
        },
        profitTax: (value) => {
            gameState.profitTax = value;
        }
    };
    
    // Apply all global effects
    for (let effect in effects) {
        if (globalEffectHandlers[effect]) {
            globalEffectHandlers[effect](effects[effect]);
        }
    }
}

function applyUniversalEffects(effects) {
    // Effects that work regardless of targeting
    
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
        // Remove a random girl or specific one
        const girlIndex = Math.floor(Math.random() * gameState.girls.length);
        const removedGirl = gameState.girls.splice(girlIndex, 1)[0];
        logEvent(`⚠️ ${removedGirl.name} odeszła`, 'event');
    }
    
    if (effects.customLog) {
        logEvent(effects.customLog.message, effects.customLog.type || 'event');
    }
}

function handleEventCompletion(event) {
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
    
    // For girl-targeted events, replace placeholders
    let text = choice.followUpText;
    if (event.targetGirlId) {
        const girl = gameState.girls.find(g => g.id === event.targetGirlId);
        if (girl) {
            text = replaceGirlPlaceholders(text, girl);
            logEvent(`📅 ${girl.name} – ${text}`, 'date');
        }
    } else {
        logEvent(`📰 ${event.title} – ${text}`, 'event');
    }
    
    // Show alert if specified
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
    const last = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];

    const age = 16 + Math.floor(Math.random() * 4);

    const loyalty = 35 + Math.floor(Math.random() * 35);
    const lewdness = personality.lewdness[0] + Math.floor(Math.random() * (personality.lewdness[1] - personality.lewdness[0] + 1));
    const grades = personality.grades[0] + Math.floor(Math.random() * (personality.grades[1] - personality.grades[0] + 1));
    const morale = personality.morale[0] + Math.floor(Math.random() * (personality.morale[1] - personality.morale[0] + 1));
    const conversation = personality.conversation[0] + Math.floor(Math.random() * (personality.conversation[1] - personality.conversation[0] + 1));

    const handjob = Math.max(0, Math.floor(lewdness * 0.6) + Math.floor(Math.random() * 15) - 10);
    const blowjob = Math.max(0, Math.floor(lewdness * 0.4) + Math.floor(Math.random() * 12) - 8);
    const vaginal = Math.max(0, Math.floor(lewdness * 0.3) - 5 + Math.floor(Math.random() * 10));
    const anal = Math.max(0, Math.floor(lewdness * 0.15) - 10 + Math.floor(Math.random() * 8));
    const feet = Math.max(0, Math.floor(lewdness * 0.5) + Math.floor(Math.random() * 18) - 12);

    const traits = [...personality.traits];
    if (lewdness < 15) traits.push("virgin");
    if (morale < 50) traits.push("insecure");
    if (grades > 90) traits.push("smart");

    const backstory = `${personality.name.toLowerCase()}. ${["Pochodzi z biednej rodziny.", "Ma problemy finansowe w domu.", "Nowa w Seiran Academy.", "Chce pomóc rodzinie."][Math.floor(Math.random()*4)]}`;

    return {
        id: gameState.nextGirlId++,
        name: `${first} ${last}`,
        age: age,
        personality: personality.name,
        backstory: backstory,
        loyalty: Math.min(95, loyalty),
        lewdness: Math.min(60, lewdness),
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
            income:'💰', 
            job:'💼', 
            training:'📚', 
            comfort:'❤️', 
            event:'📰', 
            unlock:'🔓', 
            recruit:'✨', 
            debt:'💳',
            date:'💝' 
        };
        html += `<div class="event-log-item">
            <span class="event-time">[${log.ts}]</span>
            <span>${icons[log.type] || '📋'} ${log.msg}</span>
        </div>`;
    });
    container.innerHTML = html + '</div>';
}
