/** Punto de entrada: helmet + cors + rate limit + rutas + error handler */
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { abrirDB } from './db/migrate.js';
import { UserRepository } from './repositories/userRepository.js';
import { UserService } from './services/userService.js';
import { AuthController } from './controllers/authController.js';
import { UsersController } from './controllers/usersController.js';
import { armarRouter } from './routes/index.js';

const PORT = Number(process.env.PORT ?? 3000);
const ORIGEN_FRONT = process.env.ORIGEN_FRONT ?? 'http://localhost:5173';

async function main() {
  const db = abrirDB();
  const repo = new UserRepository(db);
  const service = new UserService(repo);
  await service.bootstrapAdmin();           // supercuenta si la DB está vacía

  const app = express();
  app.use(helmet());
  app.use(cors({ origin: ORIGEN_FRONT, credentials: false }));
  app.use(express.json());

  // fuerza bruta solo en auth (módulo 17)
  app.use(['/auth/login', '/auth/register'], rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
  }));

  app.get('/health', (_req, res) => res.json({ ok: true }));

  app.use('/api', armarRouter(new AuthController(service), new UsersController(service)));

  // error handler central (módulo 25): detalle completo al log, mensaje corto al cliente
  app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error(err);
    res.status(500).json({ error: 'Error interno' });
  });

  app.listen(PORT, () => console.log(`API escuchando en :${PORT} (front: ${ORIGEN_FRONT})`));
}

main().catch(e => { console.error(e); process.exit(1); });
