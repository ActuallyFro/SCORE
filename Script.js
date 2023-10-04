let saves = 0;
let goalsAgainst = 0;
let cleanSheets = 0;
let teamScore = 0;
let opponentScore = 0;

const form = document.getElementById('logForm');
const logTable = document.getElementById('log');
const statsTable = document.getElementById('stats');
const teamScoreDisplay = document.getElementById('teamScore');
const opponentScoreDisplay = document.getElementById('opponentScore');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const goalieSelection = document.getElementById('goalieSelection').value;
  const savesInput = document.getElementById('savesInput').valueAsNumber;
  const goalsAgainstInput = document.getElementById('goalsAgainstInput').valueAsNumber;
  const cleanSheetsInput = document.getElementById('cleanSheetsInput').valueAsNumber;
  const goalieKickInput = document.getElementById('goalieKickInput').value;
  const qualifierInput = document.getElementById('qualifierInput').value;
  const notesInput = document.getElementById('notesInput').value;
  logEntry({ time: new Date().toLocaleTimeString(), goalie: goalieSelection, saves: savesInput, goalsAgainst: goalsAgainstInput, cleanSheets: cleanSheetsInput, goalieKick: goalieKickInput, qualifier: qualifierInput, notes: notesInput });
  updateStats();
  // Reset form fields
  form.reset();
});

function logEvent(eventType) {
    const notesInput = document.getElementById('notesInput').value;
    if (eventType === 'Team Scored') {
      teamScore++;
    } else if (eventType === 'Opponent Scored') {
      opponentScore++;
    }
    logEntry({ time: new Date().toLocaleTimeString(), event: eventType, notes: notesInput });
    updateScores();
    updateStats();
  }
  

function logEntry(entryData) {
  const row = logTable.insertRow();
  const timeCell = row.insertCell(0);
  const eventCell = row.insertCell(1);
  const goalieCell = row.insertCell(2);
  const savesCell = row.insertCell(3);
  const goalsAgainstCell = row.insertCell(4);
  const cleanSheetsCell = row.insertCell(5);
  const goalieKickCell = row.insertCell(6);
  const qualifierCell = row.insertCell(7);
  const notesCell = row.insertCell(8);
  timeCell.textContent = entryData.time;
  eventCell.textContent = entryData.event || '';
  goalieCell.textContent = entryData.goalie || '';
  savesCell.textContent = entryData.saves || ''; // Display blank for NaN
  goalsAgainstCell.textContent = entryData.goalsAgainst || ''; // Display blank for NaN
  cleanSheetsCell.textContent = entryData.cleanSheets || ''; // Display blank for NaN
  goalieKickCell.textContent = entryData.goalieKick || '';
  qualifierCell.textContent = entryData.qualifier || '';
  notesCell.textContent = entryData.notes || '';
}

function updateStats() {
  statsTable.innerHTML = `
    <tr>
      <td>Saves:</td>
      <td>${saves}</td>
    </tr>
    <tr>
      <td>Goals Against:</td>
      <td>${goalsAgainst}</td>
    </tr>
    <tr>
      <td>Clean Sheets:</td>
      <td>${cleanSheets}</td>
    </tr>
    <tr>
      <td>Team Score:</td>
      <td>${teamScore}</td>
    </tr>
    <tr>
      <td>Opponent Score:</td>
      <td>${opponentScore}</td>
    </tr>
  `;
}


function updateScores() {
  teamScoreDisplay.textContent = teamScore;
  opponentScoreDisplay.textContent = opponentScore;
}

function exportJSON() {
  const logEntries = [];
  const rows = logTable.querySelectorAll('tr');
  rows.forEach((row, index) => {
    if (index !== 0) {
      const cells = row.querySelectorAll('td');
      const entry = {
        time: cells[0].textContent,
        event: cells[1].textContent,
        goalie: cells[2].textContent,
        saves: cells[3].textContent ? parseInt(cells[3].textContent) : '', // Display blank for NaN
        goalsAgainst: cells[4].textContent ? parseInt(cells[4].textContent) : '', // Display blank for NaN
        cleanSheets: cells[5].textContent ? parseInt(cells[5].textContent) : '', // Display blank for NaN
        goalieKick: cells[6].textContent,
        qualifier: cells[7].textContent,
        notes: cells[8].textContent,
      };
      logEntries.push(entry);
    }
  });
  const jsonBlob = new Blob([JSON.stringify(logEntries)], { type: 'application/json' });
  const url = URL.createObjectURL(jsonBlob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'goalie_log.json';
  a.click();
  URL.revokeObjectURL(url);
}

function importJSON() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.addEventListener('change', (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = function (event) {
      const importedData = JSON.parse(event.target.result);
      importedData.forEach((entry) => {
        logEntry(entry);
      });
      updateStats();
    };
    reader.readAsText(file);
  });
  input.click();
}

function clearLog() {
  logTable.innerHTML = '';
  saves = 0;
  goalsAgainst = 0;
  cleanSheets = 0;
  updateStats();
  teamScore = 0;
  opponentScore = 0;
  updateScores();
}
