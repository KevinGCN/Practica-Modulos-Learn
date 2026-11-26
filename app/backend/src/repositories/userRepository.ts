/** Repository: TODO el acceso a datos de users vive aquí (módulo 14) */
import type Database from 'better-sqlite3';
import type { User, UserConHash } from '../types/user.js';

export class UserRepository {
  constructor(private db: Database.Database) {}

  crear(email: string, nombre: string, password_hash: string): User {
    const stmt = this.db.prepare(
      'INSERT INTO users (email, nombre, password_hash) VALUES (?, ?, ?)'
    );
    const info = stmt.run(email.toLowerCase(), nombre, password_hash);
    return this.porId(Number(info.lastInsertRowid))!;
  }

  porId(id: number): User | undefined {
    return this.db
      .prepare('SELECT id, email, nombre, rol, creado_en FROM users WHERE id = ?')
      .get(id) as User | undefined;
  }

  porEmailConHash(email: string): UserConHash | undefined {
    return this.db
      .prepare('SELECT * FROM users WHERE email = ?')
      .get(email.toLowerCase()) as UserConHash | undefined;
  }

  listar(): User[] {
    return this.db
      .prepare('SELECT id, email, nombre, rol, creado_en FROM users ORDER BY creado_en DESC')
      .all() as User[];
  }

  editar(id: number, campos: { nombre?: string; rol?: string; password_hash?: string }): User | undefined {
    const sets: string[] = [];
    const vals: unknown[] = [];
    if (campos.nombre) { sets.push('nombre = ?'); vals.push(campos.nombre); }
    if (campos.rol) { sets.push('rol = ?'); vals.push(campos.rol); }
    if (campos.password_hash) { sets.push('password_hash = ?'); vals.push(campos.password_hash); }
    if (!sets.length) return this.porId(id);
    vals.push(id);
    this.db.prepare(`UPDATE users SET ${sets.join(', ')} WHERE id = ?`).run(...vals);
    return this.porId(id);
  }

  eliminar(id: number): boolean {
    return this.db.prepare('DELETE FROM users WHERE id = ?').run(id).changes > 0;
  }

  editarSinRol(email: string, campos: { rol: string }): void {
    this.db.prepare('UPDATE users SET rol = ? WHERE email = ?').run(campos.rol, email);
  }

  contar(): number {
    return (this.db.prepare('SELECT COUNT(*) as n FROM users').get() as any).n as number;
  }
}
