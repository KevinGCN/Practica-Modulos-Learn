# Historial del proyecto Popayanese — registro completo

> Log Vivo de todo lo ocurrido en este proyecto: peticiones del usuario, archivos
> creados/modificados, decisiones tomadas y estado actual. Actualizado a mano
> (por el agente) con cada cambio.

---

## Fase 0 · Origen (sesión de ingresos)

- El usuario consultó cómo generar ingresos reales en Colombia; se investigó (web) y se diagnostico: universitario, Popayán/Cauca, 24 años, 20 h/semana, capital <$50k COP, meta $600k–1M/mes.
- Se creó cuestionario (24 preguntas, 6 bloques) → `cuestionario-ingresos-colombia/` (ELIMINADO luego a pedido del usuario).
- Resultado del análisis: 3 rutas — servicios académicos, comida con pedidos anticipados, subir tarifa aprendiendo habilidades. Plan 90 días.
- **Decisión final del usuario:** enfocarse en el servicio de PÁGINAS WEB para negocios locales → marca `popayanese.shop`. Se descartaron las distracciones de venta de inventario y pirámides desde el arranque.

## Fase 1 · Creación del taller (carpeta `popayanese/`)

| Archivo | Estado | Contenido |
|---|---|---|
| `landing/index.html` | creado, luego corregido (typos/copys) | Landing comercial: héroe, 3 servicios (web, menú QR, catálogo), proceso en 4 pasos, CTA WhatsApp (número placeholder `57XXXXXXXXXX` por reemplazar) |
| `capacitacion.html` | creado y evolucionado 6 versiones | Sistema de capacitación progresiva (ver fases 2–3) |
| `INSTRUCCIONES.md` | creado y actualizado 3 veces | Mapa del proyecto + instrucciones paso a paso + errores a evitar |

## Fase 2 · Capacitación: pistas y expansiones

| Versión | Contenido agregado |
|---|---|
| **v1** | 8 módulos iniciales (taller, HTML, CSS, responsivo, menú QR, publicar, clientes, portafolio) |
| **v2** | REESCRITA: el usuario ya sabía HTML/CSS y usaba Netlify → pista de INFRAESTRUCTURA (8 módulos): dominio, DNS, HTTP, puertos, VPS, Nginx/proxy inverso, Cloudflare/CDN, operación continua |
| **v3** | Pista DESARROLLO (6): TypeScript, Node, Express, React, React Native+Expo, capstone full-stack |
| **v4** | Pista OFICIO (5): modularidad/arquitectura, Git real, Testing (Vitest/TDD), Seguridad (bcrypt/JWT), SEO/performance (Core Web Vitals) |
| **v5** | Pistas FUNDAMENTOS (HTML semántico/formularios/a11y, CSS position/stacking/unidades) + IA COMO OFICIO (Gentle Shell/orquestador/tokens, MCP, SSH/Linux, IA para video: Whisper/CapCut/OBS, backend a fondo: SQLite/Zod/migraciones, estar al día) |

**Total actual: 27 módulos · ~110 ejercicios · ~65 preguntas de quiz · ~70 videos sugeridos.**

## Fase 3 · Diseño (gentle-design)

- Enumerados 3 artboards en `C:\Users\carli\design\capacitacion-neon\` (canvas):
  1. `01-consola-entrenamiento.html` (terminal/TTY, tipografía mono, scanlines)
  2. `02-neon-vivo.html` (dial SVG de progreso, cascada, glow, línea neón viva)
  3. `03-sala-control.html` (riel lateral con 27 módulos, KPIs, consultas)
- **Usuario eligió mezcla de 01+02** → piel aplicada al capacitacion.html real.
- Paleta final: neón `#ff2d40`, negro `#0a0a0c`, gris `#9a9aa3`, texto blanco `#f4f4f6`; animaciones (recorre/rayas/cascada/latido/abrir) respetando prefers-reduced-motion.

## Fase 4 · Mecánica v6 (modelo abierto + examen)

- **Cambio clave:** dejó de ser cadena rígida (desbloqueo secuencial) porque bloquear contenido no era ideal.
- **17 módulos PRINCIPALES** libres desde el día 1 (sin dependencias).
- **10 módulos CONVERGENTES** (Nginx, Cloudflare, operación, Express, React, React Native, full-stack, testing, seguridad, backend): bloqueados con UNA sola llave = **examen final** (17 preguntas, ≥15 para aprobar, reintentos ilimitados, persistente).
- Progreso y avance persisten por completo (localStorage clave `popayanese_capacitacion_v6`).

## Fase 5 · Música de fondo (antiboring)

- Usuario: se aburre leyendo puro → reproductor flotante integrado.
- **Fuente real local:** `C:\Users\carli\Videos\aTubeCatcher\` — 12 MP3 reales del usuario (detectados por escaneo).
- Dock flotante abajo-derecha: play/pausa, prev/next con shuffle, volumen, modo mini (chip), auto-continua al terminar canción, retoma el lugar y el volumen al re-abrir.

## Fase 6 · Competencia con amigos (esta iteración)

- Petición: comparar progreso entre amigos, ranking por módulo.
- **Decisión técnica:** con file:// local NO hay ranking en vivo — se resolvió con **códigos de progreso exportables** (firma base64 de tu avance: módulos + ejercicios + quiz + examen). Intercambio manual por WhatsApp; la tabla compara y ordena.
- Ranking real-time con backend: pendiente y documentado en la explicación del panel (se puede armar con la API Express del módulo 10 + un VPS cuando exista).

## Fase 7 · Módulo 27 · Optimización de IA (actual)

- **Módulo nuevo (28 total): "Optimización de IA: tokens, caché y qué IA gratis usar"** — pedido del usuario.
- Contenido: 6 palancas de ahorro de tokens (contexto, salida, /clear-compact, planificación, un modelo+tools por sesión, formato), prompt caching y orden fijo del prompt, y la tabla de elección por tarea: Copilot Free/Student Pack, ChatGPT/Gemini free, Claude free (1M contexto), OpenRouter/Groq.
- Investigación web previa (fuentes nov 2026) para límites vigentes.
- **Es módulo PRINCIPAL** (no converge): entra al examen con su pregunta propia → examen ahora 18 preguntas, aprobación ≥16.
- Mecánica v6 ajustada: 18 principales libres · 10 convergentes tras el examen.

## Fase 8 · Módulos 28–30 · PWA/ORM · Docker completísimo · IA para video con agentes

- **M28 — PWA, ORM y el glosario anti-alienígena:** manifest + service worker (offline real, con código de ejemplo y case de uso en Popayán), ORM explicado (con puente a Prisma del módulo 25), y tabla-glosario de 10 siglas (API, REST/GraphQL, SDK, CI/CD, SaaS/PaaS/IaaS, SSR/CSR/SSG, webhook, YAML, rate limit).
- **M29 — Docker COMPLETISIMO:** los 4 conceptos (imagen/contenedor/registro/volumen), contenedor vs VM, Dockerfile comentado línea por línea con las capas y el orden de cache, los 12 comandos diarios, docker-compose.yml con tu stack real (api + Postgres + volúmenes), bind mount vs volumen, push a registro y deploy al VPS. 7 ejercicios incluyendo dockerizar tu API del módulo 10.
- **M30 — IA generadora de video con agentes:** el pipeline a-piece-piece (ElevenLabs/Edge TTS voz, Bing/Leonardo imágenes, Suno música, InVideo/Pictory autopilot) + orquestación con agente local + qué prometer y qué no (mapa honesto) + el salto de negocio a "operador" con paquete mensual.
- Los 3 son PRINCIPALES (libres); examen ahora 21 preguntas / aprobación ≥18.

## Fase 9 · Módulo 31 · Inglés B1→C1 (última expansión)

- **M31 "Inglés B1→C1: el plan del developer para la fluidez"** (principal, libre): plan 3×30 (input técnico sin subtítulos, output forzado con IA por voz/tandem/narrar código, sistema de errores `mistakes.md`), vocabulario técnico como activo C1 oculto, 20 frases-patrón de trabajo (stand-up/PR/review), conectores que marcan C1, y la ruta al mercado en USD (proposals Upwork, discovery calls, negociación sin pedir perdón por cobrar). Meta medible: llamada de 15 min fluida en 60 días.
- Capacitación final: **32 módulos** (22 principales libres + 10 convergentes tras el examen de **22 preguntas, aprobación ≥19**).

## Fase 10 · v1.1 · Examen final en cajón + desbloqueo al 100%

- Petición: compactar el examen final para que no quede esparcido al inicio; debía quedar dentro de un cajón y desbloquearse al 100% de progreso.
- **`index.html` — examen como cajón colapsable:** pasó de estar siempre expandido a un panel cerrado por defecto, con flecha `▸/▾` y estado persistido en `estado.examenAbierto` (localStorage).
- **Bloqueo al 100% de la ruta principal:** el examen se desbloquea al completar los **22 módulos principales** (los 10 convergentes dependen del examen, así que exigir los 32 sería circular). El badge muestra `🔒 X/22 principales` y, al abrir el cajón bloqueado, cuántos faltan.
- **Mecánica conservada:** aprobar el examen (≥19/22) sigue siendo la llave de los 10 módulos convergentes.
- **Barra de progreso en dos fases:** antes de aprobar mide la ruta principal (`% de la ruta principal · X/22`); después de aprobar mide el curso completo (`X/32 · todo desbloqueado`).
- **Mensajes actualizados:** avisos de módulo convergente bloqueado y de módulo completado ahora explican el flujo principal → examen → convergentes.
- **Fix de CSS:** se eliminó un `@media (prefers-reduced-motion)` duplicado que dejaba el CSS del examen y del panel de competencia anidado dentro de la media query.
- Commits: `38dfd3c` **"v 1.1"** en `main` y `dev`, subido a `origin`.

## Fase 11 · v 1.2 → v 1.7 · Frontend multipágina (navbar + catálogo + examen llave)

- **Petición:** pasar de un solo HTML a un frontend organizado: «evitar que todo sea una landing page, repartir el contenido con navbar, que el visitant escoja que módulos ver, inicio sencillo y limpio» + música plegable como botón circular.
- **Arquitectura elegida (vía técnica): estático multipágina sin build** — `index.html` (inicio), `modulos.html` (catálogo con filtros por pista), `modulo.html?id=…` (detalle con teoría/ejercicios/quiz), `examen.html` (llave), `css/styles.css`, `js/` (progreso, inicio, catalogo, modulo, examen, musica) y `data/` (modulos.js, examen.js).
- **Decisiones del usuario:** catálogo navegable con examen como llave (22 principales libres · 10 convergentes tras aprobar, ≥19/22) · solo progreso persistente (sin dock grande ni ranking) · estética neón oscuro conservada.
- **Progreso compatible:** misma clave localStorage (`popayanese_capacitacion_v6`) — el avance del monolito se conserva.
- **Música plegable:** botón circular flotante (▲ corner de abajo), panel desplegable con pistas; ajustado tamaño en móvil.
- **Hallazgo:** el array `MODULOS` del monolito tenía 4 comas dobles sueltas (agujeros tras `ptok`, `pwap`, `pdock`, `pagent`); en `data/modulos.js` quedaron limpias (32 reales). El monolito queda intacto en `main`/`dev` como referencia.
- **Verificación:** smoke — 4 páginas responden 200, 8 JS parsean sin error, navbar activa correcta por página, 22/22 preguntas verbatim, candado de convergentes activo.
- **Commits en `dev` (notas por versión, estilo repo):** `v 1.2 feat(data)` · `v 1.3 feat(ui)` · `v 1.4 feat(home)` · `v 1.5 feat(catalogo)` · `v 1.6 feat(modulo)` · `v 1.7 feat(examen)` · docs de esta fase.

## Estado actual (resumen ejecutivo)

- **Frontend activo en `dev` (v 1.2 → v 1.7):** sitio multipágina estático — `index.html` inicio, `modulos.html` catálogo con filtros, `modulo.html?id=` detalle y `examen.html` llave; música plegable como botón circular; progreso en localStorage.
- `index.html` monolito (v 1.1): queda en el historial de `main` como referencia — el working tree de `dev` ya trae el nuevo inicio multipágino.
- `landing/index.html`: lista para publicar (pendiente número WhatsApp real, dominio, Netlify).
- `INSTRUCCIONES.md`: actualizado a modelo abierto + examen.
- Diseños canvas quedan en `C:/Users/carli/design/capacitacion-neon/` (referencia, no uso activo).

## Pendientes explícitos del usuario

- ( ) Comprar dominio `popayanese.shop` (verificado disponible; confirmar renovación antes de pagar)
- ( ) Completar los 22 módulos principales y aprobar el examen final (≥19/22) para desbloquear los 10 convergentes
- ( ) Publicar landing en Netlify y customizar WhatsApp numero real
- ( ) Primer trabajo gratis a conocidos (paso 4.1 INSTRUCCIONES)
- ( ) Ranking en vivo: decidir si se monta el backend propio (vida en el módulo 10)
