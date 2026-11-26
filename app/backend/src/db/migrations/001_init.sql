-- 001_init.sql — esquema inicial
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  nombre TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  rol TEXT NOT NULL DEFAULT 'user' CHECK (rol IN ('user','admin')),
  creado_en TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
