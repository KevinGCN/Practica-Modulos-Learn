/** Panel admin: listar, editar y eliminar usuarios (rol admin) */
import { useEffect, useState, FormEvent } from 'react';
import { api } from '../services/api.js';
import { useSesion } from '../components/SesionContext.js';
import type { User, Rol } from '../types/user.js';

export default function PanelAdmin() {
  const { user: yo } = useSesion();
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState('');
  const [editando, setEditando] = useState<number | null>(null);
  const [formNombre, setFormNombre] = useState('');
  const [formRol, setFormRol] = useState<Rol>('user');
  const [formPass, setFormPass] = useState('');

  async function cargar() {
    try {
      const { users } = await api.get<{ users: User[] }>('/users');
      setUsers(users);
    } catch (e: any) {
      setError(e.message);
    }
  }
  useEffect(() => { cargar(); }, []);

  function empezarEdicion(u: User) {
    setEditando(u.id);
    setFormNombre(u.nombre);
    setFormRol(u.rol);
    setFormPass('');
  }

  async function guardarEdicion(id: number) {
    setError('');
    try {
      const body: Record<string, string> = { nombre: formNombre, rol: formRol };
      if (formPass) body.password = formPass;
      const { user } = await api.patch<{ user: User }>(`/users/${id}`, body);
      setUsers(prev => prev.map(u => (u.id === id ? user : u)));
      setEditando(null);
    } catch (e: any) {
      setError(e.message);
    }
  }

  async function eliminar(id: number, nombre: string) {
    if (!confirm(`¿Eliminar a ${nombre}? Esta acción no se deshace.`)) return;
    setError('');
    try {
      await api.delete(`/users/${id}`);
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (e: any) {
      setError(e.message);
    }
  }

  return (
    <div className="panel-admin">
      <header>
        <h1>Panel de administración</h1>
        <button onClick={() => history.back()}>← Volver</button>
      </header>

      {error && <p className="auth-error" role="alert">{error}</p>}

      <table>
        <thead>
          <tr><th>ID</th><th>Nombre</th><th>Email</th><th>Rol</th><th>Creado</th><th>Acciones</th></tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>
                {editando === u.id ? (
                  <input value={formNombre} onChange={e => setFormNombre(e.target.value)} aria-label="nombre" />
                ) : u.nombre}
                {u.id === yo?.id && <em> (vos)</em>}
              </td>
              <td>{u.email}</td>
              <td>
                {editando === u.id ? (
                  <select value={formRol} onChange={e => setFormRol(e.target.value as Rol)}>
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                  </select>
                ) : (
                  <span className={`rol ${u.rol}`}>{u.rol}</span>
                )}
              </td>
              <td>{u.creado_en}</td>
              <td className="acciones">
                {editando === u.id ? (
                  <>
                    <button onClick={() => guardarEdicion(u.id)}>Guardar</button>
                    <button onClick={() => setEditando(null)}>Cancelar</button>
                    {formPass === '' && editando === u.id && (
                      <input type="password" placeholder="nueva pass (opcional)"
                             onChange={e => setFormPass(e.target.value)} />
                    )}
                  </>
                ) : (
                  <>
                    <button disabled={u.id === yo?.id} onClick={() => empezarEdicion(u)}>Editar</button>
                    <button disabled={u.id === yo?.id} className="peligro" onClick={() => eliminar(u.id, u.nombre)}>Eliminar</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {!users.length && <p>No hayusuarios todavía.</p>}
    </div>
  );
}
