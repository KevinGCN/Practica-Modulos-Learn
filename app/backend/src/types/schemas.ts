/** Esquemas Zod (módulo 25): una fuente de verdad de validación + tipos */
import { z } from 'zod';

export const RegistroSchema = z.object({
  email: z.string().email('Email inválido').max(120),
  nombre: z.string().min(2, 'Nombre muy corto').max(60),
  password: z.string().min(8, 'Mínimo 8 caracteres').max(100),
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

/** Admin puede editar usuarios: nombre, rol y (opcional) contraseña nueva */
export const AdminEditSchema = z.object({
  nombre: z.string().min(2).max(60).optional(),
  rol: z.enum(['user', 'admin']).optional(),
  password: z.string().min(8).max(100).optional(),
});

export type RegistroDTO = z.infer<typeof RegistroSchema>;
export type LoginDTO = z.infer<typeof LoginSchema>;
export type AdminEditDTO = z.infer<typeof AdminEditSchema>;
