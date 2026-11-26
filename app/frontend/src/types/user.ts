/** Tipos compartidos con el backend (módulo 14: types/ = contrato) */
export type Rol = 'user' | 'admin';

export interface User {
  id: number;
  email: string;
  nombre: string;
  rol: Rol;
  creado_en: string;
}
