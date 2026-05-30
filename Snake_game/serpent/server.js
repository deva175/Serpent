const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const SCORES_FILE = path.join(__dirname, 'data', 'scores.json');

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Ensure data directory and file exist
if (!fs.existsSync(path.join(__dirname, 'data'))) {
  fs.mkdirSync(path.join(__dirname, 'data'));
}
if (!fs.existsSync(SCORES_FILE)) {
  fs.writeFileSync(SCORES_FILE, JSON.stringify({ scores: [], lastUpdated: new Date().toISOString() }));
}

function readScores() {
  try {
    return JSON.parse(fs.readFileSync(SCORES_FILE, 'utf8'));
  } catch {
    return { scores: [], lastUpdated: new Date().toISOString() };
  }
}

function writeScores(data) {
  data.lastUpdated = new Date().toISOString();
  fs.writeFileSync(SCORES_FILE, JSON.stringify(data, null, 2));
}

app.get('/api/scores', (req, res) => {
  const data = readScores();
  const top = data.scores
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
  res.json({ success: true, scores: top, total: data.scores.length });
});

// POST /api/scores — save a new score
app.post('/api/scores', (req, res) => {
  const { player, score, length, level, reason, speed } = req.body;
  if (!player || score === undefined) {
    return res.status(400).json({ success: false, error: 'player and score required' });
  }

  const data = readScores();
  const entry = {
    id: Date.now(),
    player: String(player).slice(0, 20),
    score: Number(score),
    length: Number(length) || 0,
    level: Number(level) || 1,
    reason: reason || 'unknown',
    speed: speed || 'NORMAL',
    playedAt: new Date().toISOString()
  };

  data.scores.push(entry);
  // Keep only last 500 entries to prevent unbounded growth
  if (data.scores.length > 500) {
    data.scores = data.scores.sort((a, b) => b.score - a.score).slice(0, 500);
  }
  writeScores(data);

  // Compute rank
  const sorted = data.scores.sort((a, b) => b.score - a.score);
  const rank = sorted.findIndex(s => s.id === entry.id) + 1;

  res.json({ success: true, entry, rank });
});

// GET /api/scores/all — full history (for export)
app.get('/api/scores/all', (req, res) => {
  const data = readScores();
  res.json({ success: true, ...data });
});

app.listen(PORT, () => {
  console.log(`\n🐍 SERPENT backend running at http://localhost:${PORT}`);
  console.log(`📊 Scores stored in: ${SCORES_FILE}`);
  console.log(`🎮 Game at: http://localhost:${PORT}\n`);
});
