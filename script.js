/* =====================================================
   Conway's Game of Life — the zero-player game.
   Rules (applied to every cell, every generation):
     1. A live cell with 2 or 3 live neighbors survives.
     2. A dead cell with exactly 3 live neighbors becomes alive.
     3. Everything else dies or stays dead.
   ===================================================== */

const COLS = 60;               // grid width in cells
const ROWS = 60;               // grid height in cells
const CELL = 10;               // pixel size of one cell

const canvas = document.getElementById("grid");
const ctx = canvas.getContext("2d");

const playBtn  = document.getElementById("playBtn");
const stepBtn  = document.getElementById("stepBtn");
const randomBtn = document.getElementById("randomBtn");
const clearBtn = document.getElementById("clearBtn");
const speedEl  = document.getElementById("speed");
const genEl    = document.getElementById("gen");
const popEl    = document.getElementById("pop");

// The board: a 2D array of 0 (dead) / 1 (alive)
let board = makeEmptyBoard();
let generation = 0;
let running = false;
let timer = null;

function makeEmptyBoard() {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
}

// Count live neighbors, wrapping around the edges (toroidal world)
function countNeighbors(r, c) {
  let n = 0;
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const rr = (r + dr + ROWS) % ROWS;
      const cc = (c + dc + COLS) % COLS;
      n += board[rr][cc];
    }
  }
  return n;
}

// One tick of the simulation — returns the next board
function nextGeneration() {
  const next = makeEmptyBoard();
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const n = countNeighbors(r, c);
      if (board[r][c] === 1) {
        next[r][c] = (n === 2 || n === 3) ? 1 : 0;  // survival
      } else {
        next[r][c] = (n === 3) ? 1 : 0;             // birth
      }
    }
  }
  board = next;
  generation++;
}

// Draw every cell onto the canvas
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  let population = 0;
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (board[r][c] === 1) {
        population++;
        ctx.fillStyle = "#f5c518";
        ctx.fillRect(c * CELL, r * CELL, CELL, CELL);
      }
    }
  }
  // subtle grid lines for orientation
  ctx.strokeStyle = "#26262f";
  ctx.lineWidth = 0.5;
  ctx.beginPath();
  for (let x = 0; x <= COLS; x++) { ctx.moveTo(x * CELL, 0); ctx.lineTo(x * CELL, canvas.height); }
  for (let y = 0; y <= ROWS; y++) { ctx.moveTo(0, y * CELL); ctx.lineTo(canvas.width, y * CELL); }
  ctx.stroke();

  genEl.textContent = generation;
  popEl.textContent = population;
}

// The main loop: tick, draw, schedule the next tick based on the speed slider
function tick() {
  nextGeneration();
  draw();
  timer = setTimeout(tick, parseInt(speedEl.value, 10));
}

function play() {
  if (running) return;
  running = true;
  playBtn.textContent = "⏸ Pause";
  tick();
}

function pause() {
  running = false;
  clearTimeout(timer);
  playBtn.textContent = "▶ Play";
}

playBtn.addEventListener("click", () => (running ? pause() : play()));
stepBtn.addEventListener("click", () => { pause(); nextGeneration(); draw(); });

randomBtn.addEventListener("click", () => {
  board = makeEmptyBoard();
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++)
      board[r][c] = Math.random() < 0.25 ? 1 : 0;   // ~25% alive
  generation = 0;
  draw();
});

clearBtn.addEventListener("click", () => {
  pause();
  board = makeEmptyBoard();
  generation = 0;
  draw();
});

/* ---------- Drawing cells with the mouse ---------- */
let painting = false;

function cellFromEvent(e) {
  const rect = canvas.getBoundingClientRect();
  // scale client coords to canvas coords (handles responsive shrinking)
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const c = Math.floor((e.clientX - rect.left) * scaleX / CELL);
  const r = Math.floor((e.clientY - rect.top) * scaleY / CELL);
  return { r, c };
}

canvas.addEventListener("mousedown", e => {
  painting = true;
  const { r, c } = cellFromEvent(e);
  board[r][c] = 1;   // paint alive
  draw();
});
window.addEventListener("mouseup", () => (painting = false));
canvas.addEventListener("mousemove", e => {
  if (!painting) return;
  const { r, c } = cellFromEvent(e);
  board[r][c] = 1;
  draw();
});

/* ---------- Famous starter patterns ---------- */
const PATTERNS = {
  // Glider: the little spaceship that crawls across the board
  glider: [[0,1],[1,2],[2,0],[2,1],[2,2]],
  // Pulsar: a beautiful period-3 oscillator (offsets around its center)
  pulsar: [
    [2,4],[2,5],[2,6],[2,10],[2,11],[2,12],
    [4,2],[5,2],[6,2],[4,7],[5,7],[6,7],[4,9],[5,9],[6,9],[4,14],[5,14],[6,14],
    [7,4],[7,5],[7,6],[7,10],[7,11],[7,12],
    [9,4],[9,5],[9,6],[9,10],[9,11],[9,12],
    [10,2],[11,2],[12,2],[10,7],[11,7],[12,7],[10,9],[11,9],[12,9],[10,14],[11,14],[12,14],
    [14,4],[14,5],[14,6],[14,10],[14,11],[14,12],
  ],
  // Gosper glider gun: an infinite glider factory
  gosper: [
    [5,1],[5,2],[6,1],[6,2],
    [3,13],[3,14],[4,12],[4,16],[5,11],[5,17],[6,11],[6,15],[6,17],[6,18],
    [7,11],[7,17],[8,12],[8,16],[9,13],[9,14],
    [1,25],[2,23],[2,25],[3,21],[3,22],[4,21],[4,22],[5,21],[5,22],[6,23],[6,25],[7,25],
    [3,35],[3,36],[4,35],[4,36],
  ],
};

document.querySelectorAll(".preset").forEach(btn => {
  btn.addEventListener("click", () => {
    pause();
    board = makeEmptyBoard();
    generation = 0;
    const cells = PATTERNS[btn.dataset.pattern];
    // stamp the pattern near the top-left with some padding
    const r0 = 20, c0 = 20;
    for (const [r, c] of cells) board[r0 + r][c0 + c] = 1;
    draw();
  });
});

// Start with a random soup so the first paint shows something alive
randomBtn.click();
