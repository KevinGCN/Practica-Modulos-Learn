/** Routes finas: solo rutean (módulo 14) */
import { Router } from 'express';
import { AuthController } from '../controllers/authController.js';
import { UsersController } from '../controllers/usersController.js';
import { auth, soloAdmin } from '../middleware/auth.js';

export function armarRouter(
  authController: AuthController,
  usersController: UsersController
): Router {
  const r = Router();

  // público
  r.post('/auth/register', (req, res) => authController.registrar(req, res));
  r.post('/auth/login', (req, res) => authController.login(req, res));
  r.get('/auth/me', auth, (req, res) => authController.me(req, res));

  // solo admin (super cuenta)
  r.get('/users', auth, soloAdmin, (req, res) => usersController.listar(req, res));
  r.patch('/users/:id', auth, soloAdmin, (req, res) => usersController.editar(req, res));
  r.delete('/users/:id', auth, soloAdmin, (req, res) => usersController.eliminar(req, res));

  return r;
}
