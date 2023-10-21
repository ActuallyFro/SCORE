// Initialize a flag to check if data has been loaded from local storage
let isDataLoaded = false;

// Initialize counters, scores, and logs from localStorage or default values
let saves = parseInt(localStorage.getItem('saves')) || 0;
let totalPuntsPassed = parseInt(localStorage.getItem('totalPuntsPassed')) || 0;
let totalPuntsMissed = parseInt(localStorage.getItem('totalPuntsMissed')) || 0;
let totalThrowsPassed = parseInt(localStorage.getItem('totalThrowsPassed')) || 0;
let totalThrowsKicksMissed = parseInt(localStorage.getItem('totalThrowsKicksMissed')) || 0;
let totalGoalieKicksPassed = parseInt(localStorage.getItem('totalGoalieKicksPassed')) || 0;
let totalGoalieKicksMissed = parseInt(localStorage.getItem('totalGoalieKicksMissed')) || 0;

let teamScore = parseInt(localStorage.getItem('teamScore')) || 0;
let opponentScore = parseInt(localStorage.getItem('opponentScore')) || 0;
let logs = [];

const form = document.getElementById('logForm');
const logTable = document.getElementById('log');
const statsTable = document.getElementById('stats');
const teamScoreDisplay = document.getElementById('teamScore');
const opponentScoreDisplay = document.getElementById('opponentScore');

let gameClockInterval;
let minutes = parseInt(localStorage.getItem('savedMinutes')) || 0;
let seconds = parseInt(localStorage.getItem('savedSeconds')) || 0;
let isPaused = localStorage.getItem('isClockPaused') == 'true';
console.log('Is Clock Paused: ' + isPaused);


form.addEventListener('submit', (e) => {
  e.preventDefault();
  const goalieSelection = document.getElementById('goalieSelection').value;
  const notesInput = document.getElementById('notesInput').value;

  const selectedGoalie = document.getElementById('goalieSelection').value;

  logEntry({ time: new Date().toLocaleTimeString(), goalie: goalieSelection, notes: notesInput });
  updateStats();
  saveDataToLocalStorage();
  form.reset();

  document.getElementById('goalieSelection').value = selectedGoalie;
});

function logEvent(eventType) {
  const notesInput = document.getElementById('notesInput').value;
  if (eventType === 'Game Start') {
    startGameClock(true);
  } else if (eventType === 'Break Start') {
    stopGameClock();
  } else if (eventType === 'Break End') {
    startGameClock(false);
  } else if (eventType === 'Game End') {
    stopGameClock();
  }
  logEntry({ time: new Date().toLocaleTimeString(), event: eventType, notes: notesInput });
  updateScores();
  updateStats();
  saveDataToLocalStorage();
}

document.getElementById('teamScoreButton').addEventListener('click', () => {
    logEvent('Team Scored');
});

document.getElementById('opponentScoreButton').addEventListener('click', () => {
    logEvent('Opponent Scored');
}); 

function logEntry(entryData) {
    const row = logTable.insertRow();
    const timeCell = row.insertCell(0);
    const eventCell = row.insertCell(1);
    const goalieCell = row.insertCell(2);
    const savesCell = row.insertCell(3);
    const goalieKickCell = row.insertCell(4);
    const qualifierCell = row.insertCell(5);
    const notesCell = row.insertCell(6);

    timeCell.textContent = entryData.time;
    eventCell.textContent = entryData.event || '';
    goalieCell.textContent = entryData.goalie || '';
    savesCell.textContent = entryData.saves || ''; // Display blank for NaN
    goalieKickCell.textContent = entryData.goalieKick || '';
    qualifierCell.textContent = entryData.qualifier || '';
    notesCell.textContent = entryData.notes || '';

  // Add the entry to the logs array
  logs.push(entryData);
}

// Event listeners for observation buttons
function logObservation(observationType) {
    const goalieSelection = document.getElementById('goalieSelection').value;
    const savesInput = observationType === 'Goalie Save' ? 1 : 0; // Set savesInput based on the observation type
    const goalieKickInput = getGoalieKickInput(observationType); // Set goalieKickInput based on the observation type
    const qualifierInput = getQualifierInput(observationType); // Set qualifierInput based on the observation type
    const notesInput = document.getElementById('notesInput').value;

    if (savesInput > 0) {
      saves += savesInput;
    }
  
    logEntry({
      time: new Date().toLocaleTimeString(),
      goalie: goalieSelection,
      saves: savesInput,
      goalieKick: goalieKickInput,
      qualifier: qualifierInput,
      notes: notesInput,
    });
  
    updateStats();
    saveDataToLocalStorage(); // Save data to localStorage after form submission
    form.reset(); // Reset form fields
  }
  
  
  // Function to determine goalieKickInput based on observation type
  function getGoalieKickInput(observationType) {
    if (observationType === 'Punt with Pass' || observationType === 'Punt with Missed') {
      return 'Punt';
    } else if (observationType === 'Goalie Kick with Passed' || observationType === 'Goalie Kick with Missed') {
      return 'Goal Kick';
    }
    return ''; // Default value
  }
  
  // Function to determine qualifierInput based on observation type
  function getQualifierInput(observationType) {
    if (observationType === 'Punt with Pass' || observationType === 'Goalie Kick with Passed') {
      return 'Passed';
    } else if (observationType === 'Punt with Missed' || observationType === 'Goalie Kick with Missed') {
      return 'Missed';
    }
    return ''; // Default value
  }  

function updateStats() {
  statsTable.innerHTML = `
    <tr>
      <td>Score:</td>
      <td> ${teamScore} - ${opponentScore}</td>
    </tr>
    <tr>
      <td>Saves:</td>
      <td>${saves} (${((saves / (opponentScore + saves)) || 0).toFixed(3)})</td>
    </tr>
  `;
    // <tr>
    //   <td>Punts Passed:</td>
    //   <td>${totalPuntsPassed}</td>
    // </tr>
    // <tr>
    //   <td>Punts Missed:</td>
    //   <td>${totalPuntsMissed}</td>
    // </tr>
    // <tr>
    //   <td>Punts %:</td>
    //   <td>${((totalPuntsPassed / (totalPuntsPassed + totalPuntsMissed)) || 0).toFixed(3)}</td>
    // </tr>
    // <tr>
    //   <td>Throws Passed:</td>
    //   <td>${totalThrowsPassed}</td>
    // </tr>
    // <tr>
    //   <td>Throws Missed:</td>
    //   <td>${totalThrowsKicksMissed}</td>  
    // </tr>
    // <tr>
    //   <td>Goalie Kicks Passed:</td>
    //   <td>${totalGoalieKicksPassed}</td>
    // </tr>
    // <tr>
    //   <td>Goalie Kicks Missed:</td>
    //   <td>${totalGoalieKicksMissed}</td>  
    // </tr>

      // <td>${((saves / (opponentScore + saves)) * 100 || 0).toFixed(2)}%</td>
}

function updateScores() {
  teamScoreDisplay.textContent = teamScore;
  opponentScoreDisplay.textContent = opponentScore;
}

const changeClockForm = document.getElementById('changeClockForm');
const minutesInput = document.getElementById('minutesInput');
const secondsInput = document.getElementById('secondsInput');

// Remove the previous event listener for this form
// changeClockForm.addEventListener('submit', (e) => {
//   e.preventDefault();
//   const newMinutes = parseInt(minutesInput.value);
//   const newSeconds = parseInt(secondsInput.value);
//   setGameClock(newMinutes, newSeconds);
// });

// Add a new event listener to handle the form submission
changeClockForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const newMinutes = parseInt(minutesInput.value) || 0; // Ensure it's a valid number or default to 0
  const newSeconds = parseInt(secondsInput.value) || 0; // Ensure it's a valid number or default to 0
  setGameClock(newMinutes, newSeconds);
});

// ...
function setGameClock(newMinutes, newSeconds) {
  minutes = newMinutes;
  seconds = newSeconds;
  updateGameClock(true);
  
  document.getElementById('minutes').textContent = newMinutes.toString().padStart(2, '0');
  document.getElementById('seconds').textContent = newSeconds.toString().padStart(2, '0');
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
        // goalsAgainst: cells[4].textContent ? parseInt(cells[4].textContent) : '', // Display blank for NaN
        // cleanSheets: cells[5].textContent ? parseInt(cells[5].textContent) : '', // Display blank for NaN
        goalieKick: cells[4].textContent,
        qualifier: cells[5].textContent,
        notes: cells[6].textContent,
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
  console.log('Clearing log...');
  clearLogTable();
  saves = 0;
  minutes = 0;
  seconds = 0;
  updateGameClock();

  teamScore = 0;
  opponentScore = 0;
  updateStats();
  updateScores();

  // Clear logs data in local storage
  localStorage.removeItem('saves');
  localStorage.removeItem('totalPuntsPassed');
  localStorage.removeItem('totalPuntsMissed');
  localStorage.removeItem('totalThrowsPassed');
  localStorage.removeItem('totalThrowsKicksMissed');
  localStorage.removeItem('totalGoalieKicksPassed');
  localStorage.removeItem('totalGoalieKicksMissed');
  
  localStorage.removeItem('teamScore');
  localStorage.removeItem('opponentScore');
  localStorage.removeItem('logs');
  localStorage.removeItem('savedMinutes');
  localStorage.removeItem('savedSeconds');
  localStorage.removeItem('isClockPaused');
  isPaused = true;

  document.getElementById('goalieSelection').value = "Goalie1";
}


function startGameClock(isStartOrRestart) {
  if (!gameClockInterval) {
    gameClockInterval = setInterval(updateGameClock, 1000);
    updateGameClock();
  }
  if (isStartOrRestart){
    updateGameClock(isStartOrRestart);
  }
}

function updateGameClock(isStartOrRestart) {
  if (isStartOrRestart) {
      console.log('RESETTING Game Clock!');
      isPaused = false;
      if (minutes === 0 && seconds === 0) {
          seconds = 1;
      }
  }

  if (!isPaused) {
      seconds++;
      if (seconds >= 60) {
          seconds = 0;
          minutes++;
      }
  }

  document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
  document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
  saveDataToLocalStorageTime();
}



function pauseGameClock() {
    isPaused = true;
}

function resumeGameClock() {
    isPaused = false;
    updateGameClock();
}

function stopGameClock() {
  clearInterval(gameClockInterval);
  gameClockInterval = null;
  isPaused = true;
  saveDataToLocalStorageTime();
}


function saveDataToLocalStorageTime(){
    localStorage.setItem('savedMinutes',minutes.toString() );
    localStorage.setItem('savedSeconds', seconds.toString());
    localStorage.setItem('isClockPaused', isPaused.toString()); 
}

function saveDataToLocalStorage() {
    console.log('Saving data to localStorage...');
    localStorage.setItem('saves', saves.toString());
    localStorage.setItem('teamScore', teamScore.toString());
    localStorage.setItem('opponentScore', opponentScore.toString());
    localStorage.setItem('logs', JSON.stringify(logs));
    saveDataToLocalStorageTime();
}

function clearLogTable() {
    logTable.innerHTML = `
    <tr>
    <th>Time</th>
    <th>Event</th>
    <th>Goalie</th>
    <th>Saves</th>
    <!-- <th>Goals Against</th> -->
    <!-- <th>Clean Sheets</th> -->
    <th>Goalie Kick</th>
    <th>Qualifier</th>
    <th>Notes</th>
    </tr>
    `;
}

function loadLogsFromLocalStorage() {
  clearLogTable(); // Clear the log table before appending data from local storage
  const logsData = JSON.parse(localStorage.getItem('logs')) || [];
  logsData.forEach((entry) => {
    logEntry(entry);
  });
}

window.addEventListener('load', () => {
  if (!isDataLoaded) {
    clearLogTable(); // Clear the log table
    updateStats();
    updateScores();
    loadLogsFromLocalStorage(); // Load logs data from localStorage
    startGameClock();
    isDataLoaded = true; // Set the flag to true to avoid duplicate loading
  }
});

