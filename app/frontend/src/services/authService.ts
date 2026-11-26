/** Servicio de auth:(login/register/me) + persistencia del token (módulo 17) */
import { api } from './api.js';
import type { User } from '../types/user.js';

export interface Sesion { token: string; user: User; }

export const authServicio = {
  async register(email: string, nombre: string, password: string): Promise<{ user: User }> {
    return api.post('/auth/register', { email, nombre, password });
  },

  async login(email: string, password: string): Promise<Sesion> {
    const s = await api.post<Sesion>('/auth/login', { email, password });
    localStorage.setItem('token', s.token);
    localStorage.setItem('user', JSON.stringify(s.user));
    return s;
  },

  /** Valida el token guardado contra el server (me renueva la sesión) */
  async refrescar(): Promise<User | null> {
    try {
      const { user } = await api.get<{ user: User }>('/auth/me');
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    } catch {
      this.logout();
      return null;
    }
  },

  actual(): User | null {
    const raw = localStorage.getItem('user');
    if (!raw) return null;
    try { return JSON.parse(raw) as User; } catch { return null; }
  },

  esAdmin(): boolean {
    return this.actual()?.rol === 'admin';
  },

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};
