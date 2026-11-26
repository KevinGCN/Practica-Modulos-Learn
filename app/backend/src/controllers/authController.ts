/** Controller: valida entrada, llama servicio, responde (módulo 14) */
import type { Request, Response } from 'express';
import { RegistroSchema, LoginSchema } from '../types/schemas.js';
import type { UserService } from '../services/userService.js';

export class AuthController {
  constructor(private service: UserService) {}

  async registrar(req: Request, res: Response): Promise<void> {
    const parseo = RegistroSchema.safeParse(req.body);
    if (!parseo.success) {
      res.status(400).json({ error: 'Datos inválidos', detalle: parseo.error.flatten() });
      return;
    }
    try {
      const user = await this.service.registrar(parseo.data);
      res.status(201).json({ user });
    } catch (e: any) {
      res.status(e.status ?? 500).json({ error: e.message });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    const parseo = LoginSchema.safeParse(req.body);
    if (!parseo.success) {
      res.status(400).json({ error: 'Datos inválidos', detalle: parseo.error.flatten() });
      return;
    }
    try {
      const { token, user } = await this.service.login(parseo.data);
      res.json({ token, user });
    } catch (e: any) {
      res.status(e.status ?? 500).json({ error: e.message });
    }
  }

  /** El front valida su token y refresca su sesión con esto */
  me(req: Request, res: Response): void {
    const user = this.service.listar().find(u => u.id === req.usuario?.id);
    if (!user) { res.status(404).json({ error: 'No existe' }); return; }
    res.json({ user });
  }
}
