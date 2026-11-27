# Frontend multipágina (navbar + catálogo + examen llave)

## Specs

S1: "hice cambios desde el último trabajo… pasemos de un HTML solo a que hagamos un frontend" — reemplazar el `index.html` monolítico por un sitio multipágina estático (`index.html`, `modulos.html`, `modulo.html?id=…`, `examen.html`, `css/`, `js/`, `data/modulos.js`), sin build ni dependencias.

S2: "quiero evitar que todo sea una landing page, me gustaría repartir el contenido con nabvar, más organizado" — navbar persistente que reparte el contenido entre páginas.

S3: "que tenga un inicio sencillo y limpio" — `index.html` es inicio simple, no landing saturada.

S4: "que el visitante escoja que módulos ver" — catálogo en `modulos.html` con tarjetas y filtros por categoría.

S5 (decisión del formato de respuesta): el examen final funciona como llave: los módulos convergentes quedan bloqueados hasta aprobar el examen; los 22 módulos principales navegan libremente.

S6 (decisión del formato de respuesta): se conserva solo el progreso por módulo en localStorage; música de fondo y panel de competencia quedan fuera del nuevo frontend.

S7 (decisión del formato de respuesta): estética neón oscura vigente (`--neon:#ff2d40` sobre fondo oscuro, monospace) aplicada con más aire.

## Tasks

- T1, S9 — Extraer los 32 módulos de `index.html` a `data/modulos.js` sin alterar contenido. Commit: feat(data)
- T2, S1,S2,S7 — Base compartida: `css/styles.css`, `js/progreso.js` (localStorage), navbar en todas las páginas. Commit: feat(ui)
- T3, S3 — Inicio `index.html` sencillo y limpio. Commit: feat(home)
- T4, S4,S5 — Catálogo `modulos.html` con filtros, estados de progreso y candado en convergentes. Commit: feat(catalogo)
- T5, S4 — Vista de detalle `modulo.html?id=…` con teoría y checklist. Commit: feat(modulo)
- T6, S5 — `examen.html` como llave de los convergentes. Commit: feat(examen)
- T7, S1-S7 — Verificación final (smoke de páginas, progreso persistente, candado) y cierre. Commit: chore(verify)

## Log

L1 (pedido original, verbatim): "hice cambios desde el último trabajo, comprueba la situación actual del archivo index.html" → verificado: árbol limpio, v 1.1 committeada.
L2: "pasemos de un HTML solo a que hagamos un frontend, quiero evitar que todo sea una landing page, me gustaría repartir el contenido con nabvar, más organizado, que el visitante escoja que módulos ver, que tenga un inicio sencillo y limpio"
L3 (decisión usuario, tabla 4 preguntas): arquitectura = estático multipágina; recorrido = examen como llave (22 libres + convergentes bloqueados); features = solo progreso; estética = neón oscuro actual.
L4 (corrección de alcance, verbatim): "tenía problema con el módulo de música, es muy grande incluso dándole a su propio botón de minimizar, en celular es peor, tapa mucho contenido, dejémoslo en reducible como un botón circular que al presionar desplegue el bloque de musica" → S8; T7 nueva (música), verificación pasa a T8.
L5 (evidencia extractiva): el array MODULOS original tiene 4 comas dobles sueltas que dejan agujeros (tras ptok, pwap, pdock, pagent); en data/modulos.js se limpiaron; el defecto visible queda en index.html monolítico. Commit v 1.2 (1.704 líneas de datos en un slice > 400 línes — límite registrado).
L6 (verificación de cierre): smoke OK — 4 páginas 200 vía http.server, assets cargados, sintaxis de los 8 js OK, navbar activa por página correcta, LS_KEY compartida con el monolito, 22/22 preguntas verbatim, 22 libres + 10 convergentes. La música quedó en T3/T8 (js/musica.js): botón circular plegable con panel desplegable + CSS móvil. Servidor de prueba levantado y apagado.
L7 (entrega): commits renumerados con versión según el estilo del repo (v 1.2 → v 1.7) sobre 7dbef52; plan doc re-committeado; push a origin/dev autorizado por el usuario ("no es un entorno real, son prácticas así que puedes hacer push, todo es proyecto mío").
