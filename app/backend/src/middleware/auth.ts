/** Middleware de auth (módulo 17): 401 sin token, 403 sin rol */
import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import type { JWTPayload } from '../types/user.js';

const JWT_SECRET = process.env.JWT_SECRET!;

// extiende Request con el usuario decodificado
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      usuario?: JWTPayload;
    }
  }
}

export function auth(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization ?? '';
  const [esquema, token] = header.split(' ');
  if (esquema !== 'Bearer' || !token) {
    res.status(401).json({ error: 'Sin token' });
    return;
  }
  try {
    req.usuario = jwt.verify(token, JWT_SECRET) as JWTPayload;
    next();
  } catch {
    res.status(401).json({ error: 'Token inválido o expirado' });
  }
}

export function soloAdmin(req: Request, res: Response, next: NextFunction): void {
  if (req.usuario?.rol !== 'admin') {
    res.status(403).json({ error: 'Se requiere rol admin' });
    return;
  }
  next();
}
