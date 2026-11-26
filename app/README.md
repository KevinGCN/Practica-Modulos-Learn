# Popayanese App — Frontend + Backend con login, roles y panel de admin

Aplicación completa: **React + Vite + TypeScript** (front) y **Express + TypeScript + SQLite** (back),
con autenticación JWT, roles y panel de administración (listar/editar/eliminar usuarios).

```
app/
├── backend/       API Express (puerto 3000)
│   ├── src/
│   │   ├── db/            SQLite + migraciones versionadas
│   │   ├── routes/        definición de rutas (fino)
│   │   ├── controllers/   validan entrada, responden
│   │   ├── services/      lógica de negocio (bcrypt, JWT, reglas)
│   │   ├── repositories/  TODO el SQL vive acá
│   │   ├── middleware/    auth + soloAdmin (401/403)
│   │   └── types/         esquemas Zod + tipos
│   └── plantilla-env.txt  → copia a .env y editá
└── frontend/      SPA React (puerto 5173)
    ├── src/
    │   ├── pages/         Autenticacion, Inicio, PanelAdmin
    │   ├── components/    SesionContext, RequiereAuth (guard)
    │   ├── services/      api (fetch+token), authService
    │   └── types/         contrato compartido con el back
    └── plantilla-env.txt  → para producción
```

## Puesta en marcha (local, 5 pasos)

**1. Backend:**
```bash
cd app/backend
npm install
# creá tu .env a partir de plantilla-env.txt (obligatorio: JWT_SECRET)
npm run build
npm start
# la primera vez crea el admin inicial:
#   admin@popayanese.shop / TuContraseñaInicial2024 (cambiale la pass al entrar)
```

**2. Frontend (otra terminal):**
```bash
cd app/frontend
npm install
npm run dev
# abre http://localhost:5173
```

El proxy de vite manda `/api/*` a `:3000` — en desarrollo no hay problema de CORS.

## Cómo funciona la seguridad

| Capa | Qué hace |
|---|---|
| `bcrypt` cost 12 | contraseñas NUNCA en texto plano (hash irreversible + salt) |
| JWT 2h | firma el `{ id, rol }`; el front lo manda en `Authorization: Bearer` |
| middleware `auth` | 401 si falta/el token es inválido |
| middleware `soloAdmin` | 403 si el rol del token no es admin |
| `express-rate-limit` | 20 intentos/15min en login/register (anti fuerza bruta) |
| Zod | valida TODA entrada del cliente en el server (mínimo 8 chars pass, email real, etc.) |
| Zona cero | el admin no puede eliminar ni degradar SU propia cuenta (auto-lock-out) |

## Endpoints

| Método | Ruta | Quién | Qué |
|---|---|---|---|
| POST | /api/auth/register | público | crear cuenta (rol user) |
| POST | /api/auth/login | público | token + datos del usuario |
| GET | /api/auth/me | logueado | refresca sesión (valida token) |
| GET | /api/users | admin | lista completa |
| PATCH | /api/users/:id | admin | editar nombre/rol/password |
| DELETE | /api/users/:id | admin | eliminar (no a sí mismo) |
| GET | /api/health | público | chequeo de vida |

## Despliegue (lo haces vos, como pediste)

### Frontend → Netlify
```bash
cd app/frontend && npm run build     # genera dist/
# en Netlify: conectar repo GitHub o drag&drop de dist/
# Build command: npm run build    Publish directory: dist
```
Después creá `app/frontend/.env` (desde la plantilla) con `VITE_API_URL=https://api.tudominio`

### Backend → tu VPS (con PM2 o Docker - módulos 10/25/29)
```bash
# en el VPS:
cd backend && npm ci --omit=dev && npm run build
JWT_SECRET="tu-frase-secreta-real" ORIGEN_FRONT=https://tu-front.netlify.app PORT=3000 pm2 start dist/server.js --name api
# Nginx frente: server block con proxy_pass http://localhost:3000 + certbot SSL
```

### Importante para producción
1. **JWT_SECRET real** ( frase larga aleatoria; si cambia, invalida todos los tokens).
2. **ORIGEN_FRONT** exacto (con https, sin / al final) — es el CORS del server.
3. El admin inicial: entrá y **cambiá su contraseña** desde el panel (o borrá/rotá).
4. La DB SQLite vive en `backend/data/app.db` — ese archivo entra en tu backup (módulo 7).

## Códigos de error que vas a ver
- `400` datos inválidos (Zod) · `401` sin/invalid token · `403` no es admin ·
  `404` no existe · `409` email duplicado · `429` demasiados intentos · `204` eliminado OK
