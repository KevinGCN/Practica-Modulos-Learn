/** Guard: solo autenticados (y opcionalmente solo admin) */
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { authServicio } from '../services/authService.js';

export function RequiereAuth({ children, soloAdmin = false }: { children: ReactNode; soloAdmin?: boolean }) {
  const user = authServicio.actual();
  if (!user) return <Navigate to="/login" replace />;
  if (soloAdmin && user.rol !== 'admin') return <Navigate to="/" replace />;
  return <>{children}</>;
}
