import type { Request, Response } from 'express';
import { AdminEditSchema } from '../types/schemas.js';
import type { UserService } from '../services/userService.js';

export class UsersController {
  constructor(private service: UserService) {}

  listar(_req: Request, res: Response): void {
    res.json({ users: this.service.listar() });
  }

  async editar(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.id);
    const parseo = AdminEditSchema.safeParse(req.body);
    if (!parseo.success || Number.isNaN(id)) {
      res.status(400).json({ error: 'Datos inválidos', detalle: parseo.error?.flatten() });
      return;
    }
    try {
      const user = await this.service.editarComoAdmin(id, parseo.data);
      res.json({ user });
    } catch (e: any) {
      res.status(e.status ?? 500).json({ error: e.message });
    }
  }

  async eliminar(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) { res.status(400).json({ error: 'ID inválido' }); return; }
    try {
      this.service.eliminarComoAdmin(id, req.usuario!.id);
      res.status(204).send();
    } catch (e: any) {
      res.status(e.status ?? 500).json({ error: e.message });
    }
  }
}
