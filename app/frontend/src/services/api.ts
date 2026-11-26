/** Servicio HTTP: TODO fetch vive acá, con token automático (módulo 14) */
const BASE = import.meta.env.VITE_API_URL ?? '/api';   // en dev usa el proxy de vite

function headers(): HeadersInit {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function pedir<T>(ruta: string, opciones: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE}${ruta}`, {
    ...opciones,
    headers: { ...headers(), ...(opciones.headers ?? {}) },
  });
  if (res.status === 204) return undefined as T;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as any).error ?? `Error ${res.status}`);
  return data as T;
}

export const api = {
  get: <T>(ruta: string) => pedir<T>(ruta),
  post: <T>(ruta: string, body: unknown) => pedir<T>(ruta, { method: 'POST', body: JSON.stringify(body) }),
  patch: <T>(ruta: string, body: unknown) => pedir<T>(ruta, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: (ruta: string) => pedir<void>(ruta, { method: 'DELETE' }),
};
