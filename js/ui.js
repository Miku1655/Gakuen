// js/ui.js
function showTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(el => el.style.display = 'none');
    document.getElementById(tabId).style.display = 'block';
}

function updateUI() {
    updateTimeDisplay();
    updateStats();
    updateIncomeSummary();
    updateAlerts();
    updateGirlsList();
    updateSchoolList();
    updateBusiness();
    updateCityList();
    updateEventLog();
}

function updateTimeDisplay() {
    document.getElementById('time-display').innerText = `Time: ${gameTime.year}-${gameTime.month}-${gameTime.day} ${gameTime.hour}:00`;
}

function updateStats() {
    const avgMorale = girls.reduce((sum, g) => sum + g.stats.morale, 0) / girls.length;
    document.getElementById('stats-overview').innerHTML = `
        Money: ¥${gameState.money.toFixed(0)}<br>
        Debt: ¥${gameState.debt.toFixed(0)}<br>
        Reputation: ${gameState.reputation}<br>
        Avg Grades: ${girls.reduce((sum, g) => sum + g.stats.grades, 0) / girls.length}<br>
        Avg Morale: ${avgMorale}
    `;
}

function updateIncomeSummary() {
    document.getElementById('income-summary').innerText = `Daily Income: ¥${calculateTotalIncome()}`;
    document.getElementById('active-counts').innerText = `Girls: ${girls.length} | Schools: ${gameState.ownedSchools.length}`;
}

function calculateTotalIncome() {
    let total = girls.reduce((sum, g) => sum + calculateGirlIncome(g), 0);
    if (gameState.yakuza) total *= 0.85; // 15% tax
    return total;
}

function updateAlerts() {
    let alerts = '';
    if (girls.some(g => g.stats.morale < 30)) alerts += '<div class="alert">Low Morale!</div>';
    document.getElementById('alerts').innerHTML = alerts;
}

function updateGirlsList() {
    document.getElementById('girls-list').innerHTML = girls.map((g, i) => `
        <div class="girl-card">
            <h3>${g.name}</h3>
            Age: ${g.age}<br>
            Personality: ${g.personality}<br>
            Stats: ${Object.entries(g.stats).map(([k,v]) => `${k}: ${v}`).join('<br>')}<br>
            Skills: ${Object.entries(g.skills).map(([k,v]) => `${k}: ${v}`).join('<br>')}<br>
            Traits: ${g.traits.join(', ')}<br>
            Job: ${g.job ? g.job.name : 'None'}<br>
            Income: ¥${calculateGirlIncome(g)}<br>
            <select onchange="assignJob(${i}, this.value)">
                <option>None</option>
                ${jobs.map(j => `<option>${j.name}</option>`).join('')}
            </select><br>
            <button onclick="trainSkill(${i}, 'conversation')">Train Conversation (¥10k)</button>
        </div>
    `).join('');
}

function updateSchoolList() {
    document.getElementById('school-list').innerHTML = gameState.ownedSchools.map(s => `<div>${s.name}</div>`).join('');
    // Add investments buttons
}

function updateBusiness() {
    document.getElementById('operations').innerHTML = gameState.ownedBusinesses.map(b => `<div>${b.name}</div>`).join('');
}

function updateCityList() {
    document.getElementById('city-list').innerHTML = cities.map(c => `<div>${c} <button onclick="acquireInCity('${c}')">Acquire</button></div>`).join('');
}

function acquireInCity(city) {
    // Logic to buy school/business in city
}

function updateEventLog() {
    document.getElementById('event-log').innerHTML = eventLog.slice(-10).join('<br>');
}

function showModal(text, content = '') {
    document.getElementById('modal-body').innerHTML = `<p>${text}</p>${content}`;
    document.getElementById('modal').style.display = 'block';
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}
