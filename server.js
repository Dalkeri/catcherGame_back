const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors'); 

const app = express();
const port = 3000;

app.use(cors({
    origin: 'http://127.0.0.1:8080'
}));

app.use(bodyParser.json());

const db = new sqlite3.Database('database.sqlite', (err) => {
  if (err) {
    console.error('Erreur lors de l\'ouverture de la base de données:', err);
  } else {
    console.log('Connecté à la base de données SQLite.');
    db.run(`
      CREATE TABLE IF NOT EXISTS scores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        playerName TEXT NOT NULL,
        score INTEGER NOT NULL
      )
    `);
  }
});

// add a score
app.post('/scores', (req, res) => {
  const { playerName, score } = req.body
  console.log(req.body);
  const query = 'INSERT INTO scores (playerName, score) VALUES (?, ?)';
  db.run(query, [playerName, score], function(err) {
    if (err) {
      res.status(400).json({ error: err.message });
    } else {
      res.status(201).json({ id: this.lastID, playerName, score });
    }
  });
});

// get top 5 des scores
app.get('/scores/top5', (req, res) => {
  const query = 'SELECT playerName, score FROM scores ORDER BY score DESC LIMIT 5';
  db.all(query, [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
    } else {
      res.status(200).json(rows);
    }
  });
});

app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});
