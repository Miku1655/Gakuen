// js/ui.js

// Show/hide sections and highlight active menu button
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(el => {
        el.classList.remove('active');
        el.style.display = 'none';
    });

    // Remove active class from all menu buttons
    document.querySelectorAll('.menu-item').forEach(el => {
        el.classList.remove('active');
    });

    // Show selected section and mark button active
    const section = document.getElementById(sectionId);
    if (section) {
        section.classList.add('active');
        section.style.display = 'block';
    }

    const button = document.querySelector(`button[onclick="showSection('${sectionId}')"]`);
    if (button) {
        button.classList.add('active');
    }

    // Refresh everything visible
    updateUI();
}

// Main refresh function — called every tick + on actions
function updateUI() {
    updateSidebar();
    updateDashboard();
    updateGirlsList();
    updateSchoolList();
    updateBusinessList();
    updateCityList();
    updateEventLog();
}

// ────────────────────────────────────────────────
// Sidebar (always visible)
function updateSidebar() {
    // Time
    const timeStr = `Time: ${gameTime.year}-${String(gameTime.month).padStart(2, '0')}-${String(gameTime.day).padStart(2, '0')} ${String(gameTime.hour).padStart(2, '0')}:00`;
    document.getElementById('sidebar-time').textContent = timeStr;

    // Money & Debt (formatted with commas)
    document.getElementById('money-value').textContent = Math.floor(gameState.money).toLocaleString();
    document.getElementById('debt-value').textContent = Math.floor(gameState.debt).toLocaleString();

    // Speed & Pause
    document.getElementById('speed-value').textContent = speed;
    document.getElementById('pause-btn').textContent = paused ? "Resume" : "Pause";
}

// ────────────────────────────────────────────────
// Dashboard (main overview)
function updateDashboard() {
    // Main stat cards
    document.getElementById('main-money').textContent = "¥" + Math.floor(gameState.money).toLocaleString();
    document.getElementById('main-debt').textContent = "¥" + Math.floor(gameState.debt).toLocaleString();
    document.getElementById('reputation').textContent = gameState.reputation;

    const avgMorale = girls.length > 0 ? (girls.reduce((sum, g) => sum + g.stats.morale, 0) / girls.length).toFixed(0) : 0;
    const avgGrades = girls.length > 0 ? (girls.reduce((sum, g) => sum + g.stats.grades, 0) / girls.length).toFixed(0) : 0;

    document.getElementById('avg-morale').textContent = avgMorale + "%";
    document.getElementById('avg-grades').textContent = avgGrades;

    // Counts
    document.getElementById('girls-count').textContent = girls.length;
    document.getElementById('schools-count').textContent = gameState.ownedSchools.length;

    // Income breakdown (simple for now)
    const totalIncome = calculateTotalIncome();
    document.getElementById('income-breakdown').innerHTML = `
        Total daily income: ¥${Math.floor(totalIncome).toLocaleString()}<br>
        ${gameState.yakuza ? '<small>(Yakuza protection: -15%)</small>' : ''}
    `;

    // Alerts
    let alertsHtml = '';
    if (girls.some(g => g.stats.morale < 30)) {
        alertsHtml += '<div class="alert">Low Morale! Risk of rebellion or drop in efficiency.</div>';
    }
    if (gameState.debt > 5000000 * 1.5) {
        alertsHtml += '<div class="alert">Debt is dangerously high! Creditors may act soon.</div>';
    }
    document.getElementById('alerts').innerHTML = alertsHtml;
}

// ────────────────────────────────────────────────
// Girls section
function updateGirlsList() {
    const container = document.getElementById('girls-list');
    if (!container) return;

    container.innerHTML = girls.map((girl, index) => {
        const income = calculateGirlIncome(girl);
        const jobName = girl.job ? girl.job.name : 'None';

        return `
            <div class="girl-card">
                <h3>${girl.name}</h3>
                <div>Age: ${girl.age} | ${girl.personality}</div>
                <div>Traits: ${girl.traits.join(', ') || 'None'}</div>
                
                <div class="girl-stats">
                    <strong>Stats:</strong><br>
                    Loyalty: ${girl.stats.loyalty} | Morale: ${girl.stats.morale}<br>
                    Lewdness: ${girl.stats.lewdness} | Grades: ${girl.stats.grades}
                </div>
                
                <div class="girl-skills">
                    <strong>Skills:</strong><br>
                    ${Object.entries(girl.skills).map(([skill, val]) => 
                        `${skill.charAt(0).toUpperCase() + skill.slice(1)}: ${Math.floor(val)}`
                    ).join('<br>')}
                </div>
                
                <div><strong>Current Job:</strong> ${jobName}</div>
                <div><strong>Est. Income:</strong> ¥${Math.floor(income).toLocaleString()}</div>

                <select onchange="assignJob(${index}, this.value)">
                    <option value="">None</option>
                    ${jobs.map(job => 
                        `<option value="${job.name}" ${jobName === job.name ? 'selected' : ''}>${job.name}</option>`
                    ).join('')}
                </select>

                <div style="margin-top:8px;">
                    <button onclick="trainSkill(${index}, 'conversation')">Train Conversation (¥10k)</button>
                    <!-- You can add more train buttons later -->
                </div>
            </div>
        `;
    }).join('');
}

// ────────────────────────────────────────────────
// School section
function updateSchoolList() {
    const container = document.getElementById('school-list');
    if (!container) return;

    container.innerHTML = gameState.ownedSchools.map(school => `
        <div class="school-item">
            <strong>${school.name}</strong>
            <!-- You can add more school stats/upgrades here later -->
        </div>
    `).join('');
}

// ────────────────────────────────────────────────
// Business section
function updateBusinessList() {
    const container = document.getElementById('business-list');
    if (!container) return;

    container.innerHTML = gameState.ownedBusinesses.map(b => `
        <div>${b.name} (owned)</div>
    `).join('');

    if (gameState.ownedBusinesses.length === 0) {
        container.innerHTML += '<p>No businesses owned yet.</p>';
    }
}

// ────────────────────────────────────────────────
// City / Expansion section
function updateCityList() {
    const container = document.getElementById('city-list');
    if (!container) return;

    container.innerHTML = cities.map(city => `
        <div class="city-item">
            ${city}
            <button onclick="acquireInCity('${city}')">Acquire asset</button>
        </div>
    `).join('');
}

// ────────────────────────────────────────────────
// Events section
function updateEventLog() {
    const container = document.getElementById('event-log');
    if (!container) return;

    if (eventLog.length === 0) {
        container.innerHTML = '<p>No events recorded yet.</p>';
        return;
    }

    container.innerHTML = eventLog.slice(-15).reverse().map(entry => 
        `<div>${entry}</div>`
    ).join('');
}

// ────────────────────────────────────────────────
// Modal helpers
function showModal(title, message = '', buttonsHtml = '') {
    const body = document.getElementById('modal-body');
    body.innerHTML = `
        <h3>${title}</h3>
        <p>${message}</p>
        ${buttonsHtml}
    `;
    document.getElementById('modal').style.display = 'block';
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}
