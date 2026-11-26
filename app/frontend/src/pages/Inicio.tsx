/** Home protegida: distinta para admin y user */
import { Link } from 'react-router-dom';
import { useSesion } from '../components/SesionContext.js';

export default function Inicio() {
  const { user, logout } = useSesion();
  if (!user) return null;

  return (
    <div className="home">
      <header>
        <span className="logo">Popayán<b>ese</b> App</span>
        <span className="quien">{user.nombre} ({user.rol})</span>
        <button onClick={logout}>Salir</button>
      </header>

      <main>
        <h1>Hola, {user.nombre}</h1>
        {user.rol === 'admin' ? (
          <p>
            Sos <b>administrador</b>. Podés gestionar usuarios:{' '}
            <Link to="/admin" className="admin-link">Abrir panel de administración →</Link>
          </p>
        ) : (
          <p>Tu cuenta está lista. Las funciones de tu rol aparecen acá con el tiempo.</p>
        )}
      </main>
    </div>
  );
}
