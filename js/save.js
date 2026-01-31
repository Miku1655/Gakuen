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
        gameState = JSON.parse(saved);
        updateAll();
        alert('✅ Wczytano!');
    } catch(e) { alert('❌ Błąd wczytywania!'); }
}
