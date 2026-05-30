# 🐍 SERPENT — DAA Snake Game with Backend

A DAA-themed Snake game with emoji fruits, bomb hazards, score persistence, and a leaderboard.

## Setup

```bash
npm install
node server.js
```

Then open **http://localhost:3000** in your browser.

## Features

### Game
- **10 fruit types** with weighted random spawning (Apple 🍎, Grape 🍇, Strawberry 🍓, Orange 🍊, Lemon 🍋, Watermelon 🍉, Peach 🍑, Blueberry 🫐, Kiwi 🥝, Star ⭐)
- **Bomb 💣** replaces poison — kills on contact
- **Combo multiplier** — eat fruits in a row for chain bonuses
- **Floating score popups** on fruit collection
- **Snake eyes** with pupils that follow movement direction
- **CRT scanline + animated grid** atmosphere

### Backend (server.js)
- Express server on port 3000
- Scores saved to `data/scores.json`
- REST API:
  - `GET  /api/scores`      — top 10 leaderboard
  - `POST /api/scores`      — submit a score `{ player, score, length, level, reason, speed }`
  - `GET  /api/scores/all`  — full score history

### DAA Concepts
1. **Deque** — O(1) push/pop for snake body
2. **Hash Set** — O(1) collision detection
3. **Fisher-Yates** — fair random fruit spawning
4. **BFS** — pathfinding for AI hint (H key)
5. **Greedy** — direction scoring
6. **Min-Heap / Priority Queue** — item expiry management

## Controls
| Key | Action |
|-----|--------|
| W/↑ | Move Up |
| S/↓ | Move Down |
| A/← | Move Left |
| D/→ | Move Right |
| P   | Pause |
| H   | AI Hint (BFS) |
