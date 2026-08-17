const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Connexion a la base de donnees PostgreSQL (variables d'environnement
// definies dans docker-compose.yml)
const pool = new Pool({
  host: process.env.DB_HOST || 'db',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'smarttask',
  password: process.env.DB_PASSWORD || 'smarttask',
  database: process.env.DB_NAME || 'smarttask_db',
});

// Creation de la table au demarrage si elle n'existe pas
async function initDb() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS tasks (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      done BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `;
  let retries = 10;
  while (retries) {
    try {
      await pool.query(createTableQuery);
      console.log('Base de donnees initialisee.');
      break;
    } catch (err) {
      console.log('En attente de la base de donnees...', err.message);
      retries -= 1;
      await new Promise((res) => setTimeout(res, 3000));
    }
  }
}

// -------- Routes API --------

// Healthcheck
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'smarttask-backend' });
});

// Lister toutes les taches
app.get('/api/tasks', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tasks ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Creer une tache
app.post('/api/tasks', async (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ error: 'Le titre est requis' });
  try {
    const result = await pool.query(
      'INSERT INTO tasks (title) VALUES ($1) RETURNING *',
      [title]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mettre a jour une tache (statut termine/non termine)
app.put('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const { done } = req.body;
  try {
    const result = await pool.query(
      'UPDATE tasks SET done = $1 WHERE id = $2 RETURNING *',
      [done, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Supprimer une tache
app.delete('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend SmartTask demarre sur le port ${PORT}`);
  initDb();
});
