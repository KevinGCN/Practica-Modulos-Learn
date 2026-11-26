/** Contexto de sesión: disponible en toda la app */
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authServicio } from '../services/authService.js';
import type { User } from '../types/user.js';

interface CtxSesion {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, nombre: string, password: string) => Promise<void>;
  logout: () => void;
}

const SesionCtx = createContext<CtxSesion>(null!);

export function ProveedorSesion({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => authServicio.actual());

  // al arrancar: valida el token contra el server (si expiró, hace logout)
  useEffect(() => {
    authServicio.refrescar().then(u => setUser(u));
  }, []);

  const ctx: CtxSesion = {
    user,
    async login(email, password) {
      await authServicio.login(email, password);
      setUser(authServicio.actual());
    },
    async register(email, nombre, password) {
      await authServicio.register(email, nombre, password);
    },
    logout() {
      authServicio.logout();
      setUser(null);
    },
  };

  return <SesionCtx.Provider value={ctx}>{children}</SesionCtx.Provider>;
}

export const useSesion = () => useContext(SesionCtx);
