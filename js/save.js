// ============================================================================
// SAVE / LOAD — with full migration for multi-city edition
// ============================================================================

function saveGame(auto) {
    try {
        localStorage.setItem('gakuen_save', JSON.stringify(gameState));
        if (!auto) { alert('✅ Zapisano!'); }
    } catch(e) { alert('❌ Błąd zapisu!'); }
}

function loadGame() {
    try {
        const saved = localStorage.getItem('gakuen_save');
        if (!saved) { alert('Brak zapisu!'); return; }

        const loaded = JSON.parse(saved);

        // ====================================================================
        // MIGRATION — add any fields that may be missing from older saves
        // ====================================================================

        // Base fields
        if (!loaded.comfortCooldowns)   loaded.comfortCooldowns   = {};
        if (!loaded.npcRelationships)   loaded.npcRelationships   = {};
        if (!loaded.earnedAchievements) loaded.earnedAchievements = [];
        if (!loaded.weeklyStats)        loaded.weeklyStats        = { income: 0, events: 0, trained: 0 };
        if (!loaded.totalDays)          loaded.totalDays          = 0;
        if (!loaded.milestonesShown)    loaded.milestonesShown    = [];

        // Pacing system migration
        if (!loaded.eventPacing) {
            loaded.eventPacing = {
                lastEventRealTime: 0,
                dailyEventCount:   0,
                maxEventsPerDay:   3,
                eventFatigue:      0
            };
        }
        // Ensure all subfields exist (for saves from before full pacing system)
        if (loaded.eventPacing.lastEventRealTime === undefined) loaded.eventPacing.lastEventRealTime = 0;
        if (loaded.eventPacing.dailyEventCount   === undefined) loaded.eventPacing.dailyEventCount   = 0;
        if (loaded.eventPacing.maxEventsPerDay   === undefined) loaded.eventPacing.maxEventsPerDay   = 3;
        if (loaded.eventPacing.eventFatigue      === undefined) loaded.eventPacing.eventFatigue      = 0;

        // Multi-city fields
        if (!loaded.activeSchoolId)     loaded.activeSchoolId     = 'seiran_academy';
        if (!loaded.schools)            loaded.schools            = {};
        if (!loaded.unlockedCities)     loaded.unlockedCities     = ['tokyo'];
        if (!loaded.unlockedSchools)    loaded.unlockedSchools    = ['seiran_academy'];

        // Ensure seiran school state exists
        if (!loaded.schools['seiran_academy']) {
            loaded.schools['seiran_academy'] = {
                reputation: 45,
                risk: 15,
                purchasedInvestments: loaded.purchasedInvestments || [],
                girlIds: []
            };
        }

        // Migrate existing girls into seiran_academy school if no girlIds set
        if (!loaded.schools['seiran_academy'].girlIds || loaded.schools['seiran_academy'].girlIds.length === 0) {
            loaded.schools['seiran_academy'].girlIds = (loaded.girls || []).map(g => g.id);
        }

        // Migrate girl profiles — add profile, achievedMilestones, incomeBonus to existing girls
        if (loaded.girls) {
            // Merge expansion data first so PERSONALITY_PROFILES is available
            try {
                if (typeof JOBS_DATA_EXPANSION !== 'undefined') Object.assign(JOBS_DATA, JOBS_DATA_EXPANSION);
                if (typeof CITY_JOBS !== 'undefined') Object.assign(JOBS_DATA, CITY_JOBS);
                if (typeof EVENTS_DATA_EXPANSION !== 'undefined' && EVENTS_DATA_EXPANSION.length > EVENTS_DATA.filter(e=>EVENTS_DATA_EXPANSION.find(x=>x.id===e.id)).length)
                    EVENTS_DATA.push(...EVENTS_DATA_EXPANSION.filter(e=>!EVENTS_DATA.find(x=>x.id===e.id)));
                if (typeof CITY_EVENTS_DATA !== 'undefined')
                    CITY_EVENTS_DATA.forEach(e=>{ if(!EVENTS_DATA.find(x=>x.id===e.id)) EVENTS_DATA.push(e); });
                if (typeof GIRL_PERSONAL_EVENTS !== 'undefined')
                    GIRL_PERSONAL_EVENTS.forEach(e=>{ if(!EVENTS_DATA.find(x=>x.id===e.id)) EVENTS_DATA.push(e); });
                if (typeof SCHOOL_INVESTMENTS_EXPANSION !== 'undefined')
                    SCHOOL_INVESTMENTS_EXPANSION.filter(i=>!SCHOOL_INVESTMENTS.find(x=>x.id===i.id)).forEach(i=>SCHOOL_INVESTMENTS.push(i));
                if (typeof BACKSTORIES_EXPANSION !== 'undefined')
                    Object.keys(BACKSTORIES_EXPANSION).forEach(k => { BACKSTORIES[k] = [...(BACKSTORIES[k]||[]), ...BACKSTORIES_EXPANSION[k]]; });
            } catch(ex) { console.warn('Partial merge during load:', ex); }

            loaded.girls.forEach(function(girl) {
                if (!girl.profile && typeof generateGirlProfile === 'function') {
                    const pers = PERSONALITIES.find(p => p.name === girl.personality) || PERSONALITIES[0];
                    girl.profile = generateGirlProfile(pers, girl.name);
                }
                if (!girl.achievedMilestones) girl.achievedMilestones = [];
                if (girl.incomeBonus === undefined) girl.incomeBonus = 0;
                if (girl.available === undefined) girl.available = true;
            });
        }

        // Init NPC relationships for any new NPCs added since the save
        if (typeof NPC_DATA !== 'undefined') {
            Object.keys(NPC_DATA).forEach(id => {
                if (loaded.npcRelationships[id] === undefined)
                    loaded.npcRelationships[id] = NPC_DATA[id].initialRelationship;
            });
        }

        // Ensure tutor is always in unlockedJobs (added in expansion)
        if (!loaded.unlockedJobs.includes('tutor')) loaded.unlockedJobs.push('tutor');

        // ====================================================================
        // APPLY
        // ====================================================================
        gameState = loaded;
        updateAverageMorale();
        updateAll();
        alert('✅ Wczytano!');
    } catch(e) {
        alert('❌ Błąd wczytywania: ' + e.message);
        console.error(e);
    }
}
