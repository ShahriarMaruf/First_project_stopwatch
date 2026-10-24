// State variables
let startTime = 0;
let elapsedTime = 0;
let timerInterval = null;
let laps = [];

// DOM Elements
const minsEl = document.getElementById('mins');
const secsEl = document.getElementById('secs');
const msEl = document.getElementById('ms');

const startBtn = document.getElementById('startBtn');
const lapBtn = document.getElementById('lapBtn');
const resetBtn = document.getElementById('resetBtn');
const lapsList = document.getElementById('lapsList');

// Format numbers as padded 2-digit strings
function pad(num) {
  return num.toString().padStart(2, '0');
}

// Update screen display
function updateDisplay(timeMs) {
  const mins = Math.floor(timeMs / 60000);
  const secs = Math.floor((timeMs % 60000) / 1000);
  const ms = Math.floor((timeMs % 1000) / 10);

  minsEl.textContent = pad(mins);
  secsEl.textContent = pad(secs);
  msEl.textContent = pad(ms);
}

// Start / Pause toggle
function toggleStart() {
  if (!timerInterval) {
    // START
    startTime = Date.now() - elapsedTime;
    timerInterval = setInterval(() => {
      elapsedTime = Date.now() - startTime;
      updateDisplay(elapsedTime);
    }, 10);

    startBtn.textContent = 'Pause';
    startBtn.className = 'btn btn-pause';
    lapBtn.disabled = false;
    resetBtn.disabled = false;
  } else {
    // PAUSE
    clearInterval(timerInterval);
    timerInterval = null;

    startBtn.textContent = 'Resume';
    startBtn.className = 'btn btn-start';
    lapBtn.disabled = true;
  }
}

// Record Lap
function recordLap() {
  if (!timerInterval) return;

  laps.push(elapsedTime);
  renderLaps();
}

// Render Lap Times with Fastest / Slowest Highlighting
function renderLaps() {
  lapsList.innerHTML = '';
  if (laps.length === 0) return;

  let minTime = Math.min(...laps);
  let maxTime = Math.max(...laps);

  laps.slice().reverse().forEach((lapTime, index) => {
    const actualLapNum = laps.length - index;
    const li = document.createElement('li');
    li.className = 'lap-item';

    if (laps.length > 1) {
      if (lapTime === minTime) li.classList.add('fastest');
      if (lapTime === maxTime) li.classList.add('slowest');
    }

    const mins = pad(Math.floor(lapTime / 60000));
    const secs = pad(Math.floor((lapTime % 60000) / 1000));
    const ms = pad(Math.floor((lapTime % 1000) / 10));

    li.innerHTML = `
      <span>Lap ${actualLapNum}</span>
      <span>${mins}:${secs}.${ms}</span>
    `;

    lapsList.appendChild(li);
  });
}

// Reset Stopwatch
function reset() {
  clearInterval(timerInterval);
  timerInterval = null;
  elapsedTime = 0;
  laps = [];

  updateDisplay(0);
  lapsList.innerHTML = '';

  startBtn.textContent = 'Start';
  startBtn.className = 'btn btn-start';
  lapBtn.disabled = true;
  resetBtn.disabled = true;
}

// Event Listeners
startBtn.addEventListener('click', toggleStart);
lapBtn.addEventListener('click', recordLap);
resetBtn.addEventListener('click', reset);
