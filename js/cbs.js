// ============================================================================
// SCHOOL
// ============================================================================

function renderSchool() {
    var container = document.getElementById('school-investments');
    var activeSchoolId = gameState.activeSchoolId;
    var tmpl = SCHOOL_TEMPLATES[activeSchoolId];
    var school = getSchool(activeSchoolId);
    var cityId = tmpl ? tmpl.cityId : 'tokyo';
    var city = CITIES_DATA[cityId] || CITIES_DATA.tokyo;

    // School selector bar
    var selectorHtml = '<div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:20px;">';
    gameState.unlockedSchools.forEach(function(sid) {
        var t = SCHOOL_TEMPLATES[sid];
        var isActive = sid === activeSchoolId;
        selectorHtml += '<button onclick="switchActiveSchool(\'' + sid + '\')" class="action-btn" style="padding:8px 14px;' +
            (isActive ? '' : 'background:rgba(255,255,255,0.07);') + '">' +
            t.emoji + ' ' + t.name + '</button>';
    });
    selectorHtml += '</div>';
    document.getElementById('school-selector-bar').innerHTML = selectorHtml;

    // Header info
    var repValue = school.reputation !== undefined ? school.reputation : (tmpl ? tmpl.baseReputation : 45);
    var riskValue = school.risk !== undefined ? school.risk : 15;
    var header = '<div style="margin-bottom:20px;padding:16px;background:rgba(22,33,62,0.6);border-radius:8px;border-left:4px solid ' + city.color + ';">' +
        '<div style="display:flex;align-items:center;gap:12px;margin-bottom:8px;">' +
        '<span style="font-size:2em;">' + (tmpl ? tmpl.emoji : '🏫') + '</span>' +
        '<div><h3 style="margin:0;color:' + city.color + ';">' + (tmpl ? tmpl.fullName : 'Szkoła') + '</h3>' +
        '<p style="color:var(--text-secondary);font-size:0.85em;margin:2px 0;">' + city.emoji + ' ' + city.name + ' — ' + (tmpl ? tmpl.description : '') + '</p></div></div>' +
        '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;font-size:0.9em;">' +
        '<div>📊 Reputacja: <strong>' + repValue + '</strong></div>' +
        '<div>⚠️ Ryzyko: <strong>' + riskValue + '%</strong></div>' +
        '<div>👥 Dziewczyny: <strong>' + getSchoolGirls(activeSchoolId).length + '/' + (tmpl ? tmpl.maxGirls : 20) + '</strong></div>' +
        '</div></div>';

    // Global investments (base + expansion)
    var schoolPurchased = school.purchasedInvestments || [];
    var globalInvHtml = '<h3>📦 Inwestycje Globalne</h3>';
    SCHOOL_INVESTMENTS.forEach(function(inv) {
        var bought = schoolPurchased.includes(inv.id) || (gameState.purchasedInvestments || []).includes(inv.id);
        globalInvHtml += '<div class="investment-card">' +
            '<h4>' + inv.name + ' — ¥' + inv.cost.toLocaleString() + '</h4>' +
            '<p>' + inv.description + '</p>' +
            '<button onclick="buyInvestment(\'' + inv.id + '\')" class="action-btn" ' +
            (bought || gameState.money < inv.cost ? 'disabled' : '') + '>' +
            (bought ? '✅ Kupiono' : 'Kup') + '</button></div>';
    });

    // City-specific investments
    var cityInvList = SCHOOL_INVESTMENTS_BY_CITY[cityId] || [];
    var cityInvHtml = cityInvList.length
        ? '<h3>🏙️ Inwestycje w ' + city.name + '</h3>'
        : '';
    cityInvList.forEach(function(inv) {
        var bought = schoolPurchased.includes(inv.id);
        cityInvHtml += '<div class="investment-card" style="border-color:' + city.color + '33;">' +
            '<h4>' + city.emoji + ' ' + inv.name + ' — ¥' + inv.cost.toLocaleString() + '</h4>' +
            '<p>' + inv.description + '</p>' +
            '<button onclick="buyCityInvestment(\'' + inv.id + '\',\'' + activeSchoolId + '\')" class="action-btn" ' +
            (bought || gameState.money < inv.cost ? 'disabled' : '') + '>' +
            (bought ? '✅ Kupiono' : 'Kup dla ' + city.name) + '</button></div>';
    });

    container.innerHTML = header + globalInvHtml + cityInvHtml;
}

function buyInvestment(id) {
    var inv = SCHOOL_INVESTMENTS.find(function(i){ return i.id === id; });
    var activeSchoolId = gameState.activeSchoolId;
    var school = getSchool(activeSchoolId);
    var purchased = school.purchasedInvestments || [];
    if (!inv || purchased.includes(id) || (gameState.purchasedInvestments||[]).includes(id) || gameState.money < inv.cost) return;

    gameState.money -= inv.cost;
    if (!school.purchasedInvestments) school.purchasedInvestments = [];
    school.purchasedInvestments.push(id);
    // Also mark in global for compatibility
    if (!gameState.purchasedInvestments) gameState.purchasedInvestments = [];
    gameState.purchasedInvestments.push(id);

    applyInvestmentEffects(inv, activeSchoolId);
    logEvent('🏫 Kupiono: ' + inv.name, 'school');
    renderSchool();
    updateDashboard();
}

function buyCityInvestment(id, schoolId) {
    var cityId = SCHOOL_TEMPLATES[schoolId] ? SCHOOL_TEMPLATES[schoolId].cityId : 'tokyo';
    var cityInvList = SCHOOL_INVESTMENTS_BY_CITY[cityId] || [];
    var inv = cityInvList.find(function(i){ return i.id === id; });
    var school = getSchool(schoolId);
    if (!inv || !school) return;
    if (!school.purchasedInvestments) school.purchasedInvestments = [];
    if (school.purchasedInvestments.includes(id)) return;
    if (gameState.money < inv.cost) return;

    gameState.money -= inv.cost;
    school.purchasedInvestments.push(id);
    applyInvestmentEffects(inv, schoolId);

    // Special: photo_studio unlocks photography job
    if (id === 'photo_studio' && !gameState.unlockedJobs.includes('photography')) {
        gameState.unlockedJobs.push('photography');
        logEvent('🔓 Sesje Fotograficzne odblokowane', 'unlock');
    }

    logEvent('🏙️ Kupiono [' + (CITIES_DATA[cityId]||{name:cityId}).name + ']: ' + inv.name, 'school');
    renderSchool();
    updateDashboard();
}

function applyInvestmentEffects(inv, schoolId) {
    var e = inv.effects;
    var school = getSchool(schoolId);
    var schoolGirls = getSchoolGirls(schoolId);

    if (e.reputation) {
        gameState.reputation = Math.min(100, gameState.reputation + e.reputation);
        if (school.reputation !== undefined) school.reputation = Math.min(100, school.reputation + e.reputation);
    }
    if (e.grades)  schoolGirls.forEach(function(g){ g.grades  = Math.min(100, g.grades  + e.grades); });
    if (e.morale)  schoolGirls.forEach(function(g){ g.morale  = Math.min(100, g.morale  + e.morale); });
    if (e.loyalty) schoolGirls.forEach(function(g){ g.loyalty = Math.min(100, g.loyalty + e.loyalty); });
    if (e.risk) {
        gameState.risk = Math.max(0, gameState.risk + e.risk);
        if (school.risk !== undefined) school.risk = Math.max(0, school.risk + e.risk);
    }
    updateAverageMorale();
}

// ============================================================================
// BUSINESS
// ============================================================================

function renderBusiness() {
    var container = document.getElementById('business-operations');
    var html = '<div class="business-section">' +
        '<h3>🩸 Ochrona Yakuzy</h3>' +
        '<p><strong>Status:</strong> ' + (gameState.yakuzaProtection ? '✅ Aktywna' : '❌ Nieaktywna') + '</p>' +
        (gameState.yakuzaProtection
            ? '<p><strong>Podatek:</strong> ' + gameState.profitTax + '% z dziennych zysków</p>' +
              '<p style="color:var(--success);font-size:0.9em;">✔ Niższe ryzyko | ✔ Wyższa reputacja | ✔ Dostęp do eventów Yakuzy</p>'
            : '<p style="color:var(--text-secondary);">Czekaj na ofertę od Yakuzy w wydarzeniach (wymaga ¥100k+ i 2+ dziewczyn).</p>') +
        '</div>' +

        '<div class="business-section">' +
        '<h3>💼 Odblokowane Prace</h3>' +
        '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:10px;margin-top:10px;">' +
        gameState.unlockedJobs.filter(function(j){ return j !== 'none'; }).map(function(j) {
            var job = JOBS_DATA[j];
            if (!job) return '';
            return '<div style="background:rgba(255,255,255,0.04);padding:12px;border-radius:6px;border:1px solid rgba(255,255,255,0.1);">' +
                '<strong>' + job.name + '</strong>' +
                (job.cityOnly ? '<span style="color:var(--warning);font-size:0.8em;margin-left:8px;">[' + (CITIES_DATA[job.cityOnly]||{name:job.cityOnly}).name + ']</span>' : '') +
                (job.description ? '<p style="color:var(--text-secondary);font-size:0.85em;margin-top:4px;">' + job.description + '</p>' : '') +
                '<p style="color:var(--accent-secondary);font-size:0.85em;margin-top:4px;">¥' + job.baseIncome.toLocaleString() + '/dzień bazowo</p>' +
                '</div>';
        }).join('') +
        '</div>' +
        '<p style="margin-top:15px;color:var(--text-secondary);font-size:0.85em;">Odblokuj więcej przez wydarzenia fabularne.</p>' +
        '</div>' +

        '<div class="business-section">' +
        '<h3>🗺️ Zasięg Imperium</h3>' +
        '<div id="business-empire-detail"></div>' +
        '</div>';

    container.innerHTML = html;

    // Empire detail
    var detail = '';
    gameState.unlockedCities.forEach(function(cityId) {
        var city = CITIES_DATA[cityId];
        if (!city) return;
        var schoolList = '';
        city.schools.forEach(function(sid) {
            if (gameState.unlockedSchools.includes(sid)) {
                var t = SCHOOL_TEMPLATES[sid];
                var g = getSchoolGirls(sid);
                var income = g.reduce(function(s,girl) {
                    return s + (girl.currentJob!=='none' ? Math.floor(calculateIncome(girl,girl.currentJob)*city.incomeMultiplier) : 0);
                }, 0);
                schoolList += '<div style="margin:6px 0;padding:8px;background:rgba(255,255,255,0.03);border-radius:4px;">' +
                    t.emoji + ' <strong>' + t.name + '</strong> — ' + g.length + ' dziewczyn — ' +
                    '<span style="color:var(--accent-secondary);">¥' + income.toLocaleString() + '/dzień</span></div>';
            }
        });
        detail += '<div style="margin:10px 0;border-left:3px solid ' + city.color + ';padding-left:12px;">' +
            '<strong>' + city.emoji + ' ' + city.name + '</strong>' + schoolList + '</div>';
    });
    document.getElementById('business-empire-detail').innerHTML = detail || '<p style="color:var(--text-secondary)">Tylko Tokio aktywne.</p>';
}
