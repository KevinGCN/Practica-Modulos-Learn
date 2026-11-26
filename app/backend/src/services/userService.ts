/** Service: lógica de negocio de auth y usuarios (sin HTTP, sin SQL) */
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import type { UserRepository } from '../repositories/userRepository.js';
import type { User } from '../types/user.js';
import type { RegistroDTO, LoginDTO, AdminEditDTO } from '../types/schemas.js';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error('JWT_SECRET no definida (.env)');

const BCRYPT_COST = 12;

export class UserService {
  constructor(private repo: UserRepository) {}

  async registrar(dto: RegistroDTO): Promise<User> {
    const existente = this.repo.porEmailConHash(dto.email);
    if (existente) throw Object.assign(new Error('El email ya está registrado'), { status: 409 });

    const hash = await bcrypt.hash(dto.password, BCRYPT_COST);
    return this.repo.crear(dto.email, dto.nombre, hash);
  }

  async login(dto: LoginDTO): Promise<{ token: string; user: User }> {
    const user = this.repo.porEmailConHash(dto.email);
    if (!user) throw Object.assign(new Error('Credenciales inválidas'), { status: 401 });

    const ok = await bcrypt.compare(dto.password, user.password_hash);
    if (!ok) throw Object.assign(new Error('Credenciales inválidas'), { status: 401 });

    const token = jwt.sign({ id: user.id, rol: user.rol }, JWT_SECRET!, { expiresIn: '2h' });
    const { password_hash: _omit, ...safe } = user;
    return { token, user: safe };
  }

  listar(): User[] {
    return this.repo.listar();
  }

  async editarComoAdmin(id: number, dto: AdminEditDTO): Promise<User> {
    const user = this.repo.porId(id);
    if (!user) throw Object.assign(new Error('Usuario no existe'), { status: 404 });

    let password_hash: string | undefined;
    if (dto.password) password_hash = await bcrypt.hash(dto.password, BCRYPT_COST);

    const actualizado = this.repo.editar(id, {
      nombre: dto.nombre,
      rol: dto.rol,
      password_hash,
    });
    return actualizado!;
  }

  eliminarComoAdmin(id: number, solicitanteId: number): void {
    if (id === solicitanteId) {
      throw Object.assign(new Error('No podés eliminar tu propia cuenta admin'), { status: 400 });
    }
    const ok = this.repo.eliminar(id);
    if (!ok) throw Object.assign(new Error('Usuario no existe'), { status: 404 });
  }

  /** Superusuario: si la DB está vacía al arrancar, crea admin@popayanese.shop */
  async bootstrapAdmin(): Promise<void> {
    if (this.repo.contar() === 0) {
      const email = 'admin@popayanese.shop';
      const pass = process.env.ADMIN_PASSWORD ?? 'Cambiar.2024';
      const hash = await bcrypt.hash(pass, BCRYPT_COST);
      this.repo.crear(email, 'Administrador', hash);
      this.repo.editarSinRol(email, { rol: "admin" });
      console.log(`[bootstrap] admin inicial creado: ${email} (cambiale la contraseña en el primer login)`);
    }
  }
}
