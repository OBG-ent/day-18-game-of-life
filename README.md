# 🧬 Game of Life

> Draw living cells on the grid, press play, and watch an entire universe evolve from three simple rules.

An interactive implementation of John Conway's famous cellular automaton —
zero players required. It ships with three legendary patterns (Glider, Pulsar,
and the Gosper Glider Gun), a speed slider, and live generation/population
stats.

## ✨ Features

- 🖌️ **Draw with your mouse** — paint living cells directly on the grid
- ▶️ Play / pause / single-step through generations
- 🎲 Random soup generator to kickstart chaos
- 🚀 **Famous patterns** pre-loaded: Glider, Pulsar, Gosper Glider Gun
- 🎚️ Speed slider (30–600 ms per generation)
- 📊 Live generation + population counters
- ♾️ Toroidal (wrap-around) edges — gliders never hit a wall

## 👀 Demo

1. Open `index.html` in a browser — a random soup is already evolving.
2. Hit **🧹 Clear**, draw your own shape, then **▶ Play**.
3. Try the **Gosper Gun** preset and watch it fire infinite gliders.

## 🚀 Run it in 30 seconds

1. Download or clone this repo.
2. Open `index.html` in any browser. That's it.

No installs, no build step, no dependencies — pure HTML, CSS & JavaScript.

## 🧠 What I practiced

- 2D arrays as a simulation board
- Neighbor counting with edge wrapping (modular arithmetic)
- `setTimeout`-based game loop driven by a slider
- Canvas rendering + mouse-to-grid coordinate mapping
- Encoding famous patterns as coordinate lists

## 🔍 The rules

1. A live cell with **2 or 3** live neighbors survives.
2. A dead cell with **exactly 3** live neighbors comes alive.
3. Everything else dies or stays dead.

---

*Day 18 · featured build of my daily coding journey.* 💻
