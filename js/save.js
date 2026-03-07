// ============================================================================
// SAVE/LOAD
// ============================================================================

function saveGame(auto) {
    try {
        localStorage.setItem('gakuen_save', JSON.stringify(gameState));
        if (!auto) alert('✅ Zapisano!');
    } catch(e) { alert('❌ Błąd zapisu!'); }
}

function loadGame() {
    try {
        const saved = localStorage.getItem('gakuen_save');
        if (!saved) { alert('Brak zapisu!'); return; }
        const loaded = JSON.parse(saved);

        // Migration: ensure new fields exist for saves from older versions
        if (!loaded.comfortCooldowns)    loaded.comfortCooldowns    = {};
        if (!loaded.npcRelationships)    loaded.npcRelationships    = {};
        if (!loaded.earnedAchievements)  loaded.earnedAchievements  = [];
        if (!loaded.weeklyStats)         loaded.weeklyStats         = { income: 0, events: 0, trained: 0 };
        if (loaded.totalDays === undefined) loaded.totalDays        = 0;

        gameState = loaded;

        // Re-merge expansion data after load (in case init hasn't run yet on this load path)
        if (typeof JOBS_DATA_EXPANSION !== 'undefined') Object.assign(JOBS_DATA, JOBS_DATA_EXPANSION);
        if (typeof EVENTS_DATA_EXPANSION !== 'undefined') {
            // Only push events not already present
            EVENTS_DATA_EXPANSION.forEach(ev => {
                if (!EVENTS_DATA.find(e => e.id === ev.id)) EVENTS_DATA.push(ev);
            });
        }
        if (typeof SCHOOL_INVESTMENTS_EXPANSION !== 'undefined') {
            SCHOOL_INVESTMENTS_EXPANSION.forEach(inv => {
                if (!SCHOOL_INVESTMENTS.find(i => i.id === inv.id)) SCHOOL_INVESTMENTS.push(inv);
            });
        }

        // Ensure NPC relationships initialized for any new NPCs added since save
        if (typeof NPC_DATA !== 'undefined') {
            Object.keys(NPC_DATA).forEach(id => {
                if (gameState.npcRelationships[id] === undefined)
                    gameState.npcRelationships[id] = NPC_DATA[id].initialRelationship;
            });
        }

        updateAverageMorale();
        updateAll();
        alert('✅ Wczytano!');
    } catch(e) { alert('❌ Błąd wczytywania: ' + e.message); }
}
