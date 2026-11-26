/** Página de registro + login (una sola: los tabs de negocio chico) */
import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSesion } from '../components/SesionContext.js';

export default function Autenticacion() {
  const [modo, setModo] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [nombre, setNombre] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [ocupado, setOcupado] = useState(false);
  const { login, register } = useSesion();
  const navegar = useNavigate();

  async function enviar(e: FormEvent) {
    e.preventDefault();
    setError('');
    setOcupado(true);
    try {
      if (modo === 'login') {
        await login(email, password);
      } else {
        await register(email, nombre, password);
        await login(email, password);   // registro+login en un paso: mejor UX
      }
      navegar('/');
    } catch (e: any) {
      setError(e.message ?? 'Error inesperado');
    } finally {
      setOcupado(false);
    }
  }

  return (
    <div className="auth-caja">
      <div className="auth-tabs">
        <button className={modo === 'login' ? 'activo' : ''} onClick={() => setModo('login')}>Ingresar</button>
        <button className={modo === 'register' ? 'activo' : ''} onClick={() => setModo('register')}>Crear cuenta</button>
      </div>

      <form onSubmit={enviar}>
        {modo === 'register' && (
          <>
            <label htmlFor="nombre">Nombre</label>
            <input id="nombre" value={nombre} onChange={e => setNombre(e.target.value)}
                   required minLength={2} maxLength={60} autoComplete="name" />
          </>
        )}
        <label htmlFor="email">Email</label>
        <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)}
               required autoComplete="email" />
        <label htmlFor="pass">Contraseña</label>
        <input id="pass" type="password" value={password} onChange={e => setPassword(e.target.value)}
               required minLength={8} autoComplete={modo === 'login' ? 'current-password' : 'new-password'} />

        {error && <p className="auth-error" role="alert">{error}</p>}

        <button type="submit" disabled={ocupado} className="auth-enviar">
          {ocupado ? '...' : modo === 'login' ? 'Ingresar' : 'Crear cuenta'}
        </button>
      </form>
    </div>
  );
}
