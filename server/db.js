const Database = require('better-sqlite3');
const path = require('path');
require('dotenv').config();

const db = new Database(process.env.DB_PATH || './database.sqlite');

// Inicialização das tabelas
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS knowledge_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    solution TEXT NOT NULL,
    category TEXT NOT NULL,
    tags TEXT, -- Armazenado como JSON string
    reporters TEXT, -- Armazenado como JSON string
    helpful_count INTEGER DEFAULT 0,
    user_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    entry_id INTEGER,
    author TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (entry_id) REFERENCES knowledge_entries(id) ON DELETE CASCADE
  );
`);

module.exports = db;