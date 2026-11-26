/** Tipos compartidos del dominio (code party el front: types/user.ts) */
export type Rol = 'user' | 'admin';

export interface User {
  id: number;
  email: string;
  nombre: string;
  rol: Rol;
  creado_en: string;
}

export interface UserConHash extends User {
  password_hash: string;
}

/** Payload dentro del JWT (módulo 17: mínimo, sin secretos) */
export interface JWTPayload {
  id: number;
  rol: Rol;
}
