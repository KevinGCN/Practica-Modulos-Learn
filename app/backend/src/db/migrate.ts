/**
 * Migrator mínimo: corre los .sql de src/db/migrations en orden y
 * registra en la tabla _migrations cuáles ya corrieron.
 * (Módulo 25 de tu capacitación: migraciones versionadas.)
 */
import Database from 'better-sqlite3';
import { readdirSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const dbPath = process.env.DB_PATH ?? join(here, '..', '..', 'data', 'app.db');

export function correrMigraciones(db: Database.Database): void {
  db.exec(`CREATE TABLE IF NOT EXISTS _migrations (
    id INTEGER PRIMARY KEY,
    nombre TEXT NOT NULL UNIQUE,
    aplicada_en TEXT NOT NULL DEFAULT (datetime('now'))
  )`);

  const carpetas = join(here, 'migrations');
  const archivos = readdirSync(carpetas).filter(f => f.endsWith('.sql')).sort();

  const yaCorridas = new Set(
    db.prepare('SELECT nombre FROM _migrations').all().map((r: any) => r.nombre)
  );

  const insertar = db.prepare('INSERT INTO _migrations (nombre) VALUES (?)');

  for (const archivo of archivos) {
    if (yaCorridas.has(archivo)) continue;
    const sql = readFileSync(join(carpetas, archivo), 'utf8');
    db.exec(sql);                       // mejor-sqlite3: el exec ya corre en transacción implícita por statement
    insertar.run(archivo);
    console.log(`[migrate] aplicada: ${archivo}`);
  }
}

export function abrirDB(): Database.Database {
  const db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
  correrMigraciones(db);
  return db;
}
