// ============================================================================
// SCHOOL
// ============================================================================

function renderSchool() {
    const container = document.getElementById('school-investments');
    let html = '<h3>Inwestycje w Seiran Academy</h3><p>Ulepszenia zwiększają reputację i morale dziewczyn.</p>';

    SCHOOL_INVESTMENTS.forEach(inv => {
        const bought = gameState.purchasedInvestments.includes(inv.id);
        html += `<div class="investment-card">
            <h4>${inv.name} - ¥${inv.cost.toLocaleString()}</h4>
            <p>${inv.description}</p>
            <button onclick="buyInvestment('${inv.id}')" class="action-btn" ${bought || gameState.money < inv.cost ? 'disabled' : ''}>
                ${bought ? '✅ Kupiono' : 'Kup'}
            </button>
        </div>`;
    });

    container.innerHTML = html;
}

function buyInvestment(id) {
    const inv = SCHOOL_INVESTMENTS.find(i => i.id === id);
    if (!inv || gameState.purchasedInvestments.includes(id) || gameState.money < inv.cost) return;

    gameState.money -= inv.cost;
    gameState.purchasedInvestments.push(id);

    const e = inv.effects;
    if (e.reputation) gameState.reputation += e.reputation;
    if (e.grades)     gameState.girls.forEach(g => g.grades  = Math.min(100, g.grades  + e.grades));
    if (e.morale)     gameState.girls.forEach(g => g.morale  = Math.min(100, g.morale  + e.morale));
    if (e.risk)       gameState.risk = Math.max(0, gameState.risk + e.risk);

    // BUG FIX: school investments changed morale but moraleTotal was never recalculated
    updateAverageMorale();

    logEvent(`🏫 Kupiono: ${inv.name}`, 'school');
    renderSchool();
    updateDashboard();
}

// ============================================================================
// BUSINESS
// ============================================================================

function renderBusiness() {
    const container = document.getElementById('business-operations');
    let html = `<div class="business-section">
        <h3>Ochrona Yakuzy</h3>
        <p><strong>Status:</strong> ${gameState.yakuzaProtection ? '✅ Aktywna' : '❌ Nieaktywna'}</p>
        ${gameState.yakuzaProtection ? `
            <p><strong>Podatek:</strong> ${gameState.profitTax}% z dziennych zysków</p>
            <p><strong>Korzyści:</strong></p>
            <ul>
                <li>Ryzyko -20 (mniej szans na policję i skandale)</li>
                <li>Reputacja +10 (łatwiej rekrutować)</li>
                <li>Dostęp do lepszych eventów</li>
            </ul>
        ` : '<p>Czekaj na ofertę od Yakuzy w eventach (wymaga ¥100k+ i 2+ dziewczyn).</p>'}
    </div>

    <div class="business-section">
        <h3>Odblokowane prace</h3>
        <ul>
            ${gameState.unlockedJobs.map(j => `<li><strong>${JOBS_DATA[j].name}</strong>${JOBS_DATA[j].description ? ': ' + JOBS_DATA[j].description : ''}</li>`).join('')}
        </ul>
        <p style="margin-top:15px;color:var(--text-secondary);">Odblokuj więcej przez wydarzenia i inwestycje.</p>
    </div>`;

    container.innerHTML = html;
}

// ============================================================================
// CITIES
// ============================================================================

function renderCities() {
    const container = document.getElementById('city-locations');
    const cities = [
        { name: 'Tokio',  desc: 'Twoja obecna lokacja. Seiran Academy.', yakuza: true,  police: 'średnia' },
        { name: 'Osaka',  desc: 'Drugie miasto. Tańsze biznesy, więcej Yakuzy.', yakuza: true, police: 'niska' },
        { name: 'Kyoto',  desc: 'Historyczne miasto. Wysokie wymagania.', yakuza: false, police: 'wysoka' }
    ];

    let html = '<div class="cities-grid">';
    cities.forEach(c => {
        html += `<div class="city-card">
            <h3>${c.name}</h3>
            <p>${c.desc}</p>
            <p><strong>Yakuza:</strong> ${c.yakuza ? '✅' : '❌'}</p>
            <p><strong>Policja:</strong> ${c.police}</p>
            <p style="margin-top:10px;color:var(--text-secondary);font-size:0.9em;">Ekspansja do innych miast będzie dostępna w przyszłych wersjach.</p>
        </div>`;
    });
    container.innerHTML = html + '</div>';
}
