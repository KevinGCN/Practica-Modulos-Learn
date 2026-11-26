# Instrucciones Popayanese — De cero a tu primera venta

> Carpeta de trabajo: `C:\Users\carli\popayanese\`
> Archivos: `landing\index.html` (tu web), `capacitacion.html` (tu curso), este archivo (tu mapa).
> Regla de oro: **leé cada paso completo antes de ejecutarlo.** Cada decisión tiene su "por qué" explicado — entenderlo te hace más rápido que copiar.

---

## PARTE 0 — Tu mapa del territorio (5 min)

Qué existe y qué hace cada cosa:

| Archivo | Qué es | Cuándo lo usás |
|---|---|---|
| `landing\index.html` | Tu página de presentación para clientes | Lo customizás ya y lo publicás |
| `capacitacion.html` | Curso progresivo v2 — pista de **infraestructura web** (dominio, DNS, HTTP, puertos, VPS, Nginx/proxy inverso, Cloudflare, operación) | Lo abrís en el navegador y avanzás a tu ritmo |
| `INSTRUCCIONES.md` | Este mapa con las decisiones explicadas | Lo reeleés cuando te trabás |

**Cómo funciona la capacitación v6 (modelo abierto + examen):**
- **17 módulos PRINCIPALES** (los que no dependen de otros): libres desde el día 1, en el orden que quieras. Cada uno con su teoría, ejercicios, videos y mini-quiz para auto-verificarte.
- **10 módulos CONVERGENTES** (sintetizan varios previos: Nginx, Cloudflare, operación, Express, React, React Native, full-stack, testing, seguridad y backend): bloqueados hasta **aprobar el EXAMEN FINAL** — 17 preguntas (una por cada principal), mínimo 15 correctas, reintentos ilimitados.
- Los módulos completados ya NO desbloquean a nadie: solo suman a la barra de progreso. El examen es la única llave.
- El avance **se guarda solo en tu navegador** (localStorage): cerrar y volver a abrir te encuentra donde dejaste. "reiniciar avance" borra todo, incluido el examen aprobado.
- **No marques ejercicios como hechos si no los hiciste.** El sistema es honesto solo si vos lo sos.

**Orden recomendado (no obligatorio):** M0 dominio → M1 DNS → M2 HTTP → M3 puertos → M4 VPS → examen final → M5 Nginx → M10 Express → M11 React → M13 full-stack; el resto a la par (Git y modularidad desde ya; IA/video cuando vayas vendiendo a video).

---

## PARTE 1 — Esta semana (Semana 1)

### Paso 1.1 — Montar tu taller (30 min)
1. Instalá **VS Code** (code.visualstudio.com).
   - *Por qué VS Code:* es gratis, es el estándar mundial, y todos los tutoriales de YouTube están hechos sobre él. Cualquier otro editor te obliga a traducir mentales.
2. Abrí VS Code → File → Open Folder → seleccioná `C:\Users\carli\popayanese\`.
3. Creá tus cuentas (10 min):
   - **GitHub** (github.com): guarda tu código en la nube gratis. Es tu backup para siempre.
   - **Vercel** (vercel.com): publica tus páginas en internet gratis. Entrá con el botón "Continue with GitHub" — así no creás otra contraseña.
   - *Por qué estas dos y no Firebase o GitHub Pages solo:* Vercel te da dominio propio con SSL automático y un despliegue de 1 clic sin tarjeta de crédito. GitHub Pages funciona, pero conectar un dominio custom es más engorroso.
4. Guardá las contraseñas en **KeePass** (lo tenés instalado).

### Paso 1.2 — Hacer tuya la landing (1–2 h)
1. Abrí `landing\index.html` en el navegador (doble click) y en VS Code a la vez.
2. Cambiá estas cosas (están marcadas en el código):
   - **El número de WhatsApp**: buscá `57XXXXXXXXXX` y poné tu número real (formato internacional, sin espacios ni el `+`). Sin esto, el botón principal de la web va a un teléfono que no existe.
     - *Por qué este número y no un formulario:* un negocio pequeño en Popayán tiene 10–30 contactos/mes, no cientos. WhatsApp es donde ese volumen vive, y el botón con texto precargado elimina la fricción de pensar qué decir.
   - **El texto del héroe**: ajustá la promesa a como vos la dirías a un amigo. No lo dejes genérico — la gente compra a humanidad, no a jerga.
   - **Colores** si querés: cambiá `--rojo` al inicio del `<style>`. Un solo cambio y toda la web cambia (variables CSS).
3. Guardá y refrescá el navegador (F5). La imperfección inicial es aceptable: **el cliente la ve publicada, no el proceso.**

### Paso 1.3 — Terminar Módulo 0 del curso (1 h)
Abrí `capacitacion.html` en el navegador y completá el Módulo 0. Con eso ya tenés todo el entorno listo para la Semana 2.

---

## PARTE 2 — Comprar el dominio (cuando tengas 1–3 USD)

> **Importante:** si no podés pagar todavía, no pasa nada — hacé Semana 1 y el Módulo 1–4 igual. El dominio sin contenido es un nombre; la habilidad sin dominio ya se vende (con la URL de Vercel gratis). El dominio es el último paso, no el primero.

### Paso 2.1 — Elegir el registrador (15 min de lectura)
1. Entra a **namecheap.com** y a **cloudflare.com/registrar**.
2. Buscá `popayanese.shop` en ambos y mirá dos números, no uno:
   - Precio del **primer año** (promo, 1–3 USD en Namecheap).
   - Precio de **renovación anual** (Namecheap ~30–40 USD; Cloudflare ~2–5 USD).
   - *Por qué la renovación importa más:* vas a tener este dominio años, no días. El promo primera ronda es carnada de marketing; la renovación es tu costo real permanente. Yo pagaría el doble el primer año por una renovación 6x más barata.
3. Elegí con ese número: si sos del equipo de "todo en un solo proveedor hasta que genere plata", Namecheap con auto-renew es cómodo. Si querés el costo mínimo a largo plazo, Cloudflare.
4. **Verificá que "Domain Privacy" esté activado y gratis** (en ambos lo es). Oculta tu nombre y dirección reales en el registro público del dominio. Sin esto, cualquier persona del mundo puede ver tus datos y llamarte o spamearte.
5. **Activo auto-renew** antes de pagar. La #1 causa de perder un dominio no es hackeo, es olvidar renovar.

### Paso 2.2 — Qué te entregan y qué no
- Te entregan: el **nombre** por 1 año + panel de control + control de DNS. *Nada más.*
- No te entregan: hosting, correos, ni la web. Esos los armás vos con lo de la Parte 3 (gratis).

### Paso 2.3 — Después de pagar (10 min)
1. En tu registrador, **Advanced DNS** queda con los DNS default (no toques nada todavia).
2. Aplicás los registros cuando publiques en Vercel (Paso 3.4).
3. Guardá el login del registrador en KeePass.

---

## PARTE 3 — Publicar y conectar (te toma ~1 h con el dominio en mano)

### Paso 3.1 — Publicar sin dominio (ya podes hacerlo hoy, gratis)
1. En VS Code, con tu carpeta abierta: pestaña **Source Control** → Initialize repo → commit → Publish to GitHub.
   - *Por qué GitHub primero:* Vercel se engancha a GitHub y cada cambio que subís se publica solo. Vos editás → guardás → la web se actualiza a los 30 segundos. Ese es el flujo profesional.
2. En Vercel: Add New Project → elegí tu repo → Deploy.
3. En 1 minuto tenés algo como `popayanese.vercel.app`. Compartilo a un amigo, que lo abra en su celular.

### Paso 3.2 — Conectar tu dominio (con dominio ya comprado)
1. Vercel → tu proyecto → Settings → Domains → agregá `popayanese.shop`.
2. Vercel te muestra los registros DNS exactos (copiá tal cual, no inventes).
3. En tu registrador (Namecheap/Cloudflare) → Advanced DNS → agregá/esos registros.
4. Esperá 10 min–2 h (propagación). Probá escribir `popayanese.shop` en tu celular.
5. El candado SSL (HTTPS) aparece solo en 5–30 min. **No compres SSL Jamás.** En Vercel es gratis y automático.

### Paso 3.3 —Crear tu correo con dominio (opcional, 15 min)
1. Zoho Mail hay un plan gratis personal con 1 usuario: `tunombre@popayanese.shop`.
2. *Por qué email propio:* un correo de "@gmail" resta confianza en ventas de servicios digitales. `hola@popayanese.shop` por menos de 0 USD al mes = percepción profesional instantánea.
3. Zoho te dice qué registros MX añadir en tu registrador. Copiás/pegás, esperás, listo.

---

## PARTE 4 — Primer cliente (Semana 2–4, con el curso avanzado)

### Paso 4.1 — El primer trabajo es a un conocido (gratis)
1. Elegí un negocio de tu barrio que día a día vendes algo (un restaurante, tienda de ropa, ferretería).
2. Ofrecé: te armo el menú QR o la página en 48 h **gratis, a cambio de dos cosas**: que te dejen ponerla en tu portafolio + un testimonio de 2 líneas + poner tu sticker QR en su mesa (o su cartel).
   - *Por qué gratis al primero:* sin portafolio, nadie te paga por adelantado. Con 1 trabajo real y foto, el segundo se cobra fácil. Es la inversión de apertura, no caridad.
3. Entregalo **terminado, no "customizable"**: el cliente no quiere aprender a editar; quiere verlo pulido.

### Paso 4.2 — El pitch de 30 segundos (practicalo en espejo)
> "Buenas, soy Carlos. Hago páginas web para negocios de Popayán — menús QR, catálogos, páginas con ubicación y WhatsApp. Tu negocio en Google sin que vos toques código. La primera consulta es gratis; yo cobro menos que las agencias porque hago todo yo."

(Adaptá a tu tono natural; el punto es: quién sos, qué hacés, qué gana el otro, y paso siguiente concreto.)

### Paso 4.3 — Cuánto cobrar (tu tabla de precios)
| Servicio | Tu precio | Tu tiempo |
|---|---|---|
| Landing simple (página única) | $120.000–200.000 COP | 6–10 h |
| Menú QR / catálogo digital | $50.000–100.000 COP | 2–4 h |
| Página + menú + formación | $250.000–350.000 COP | 10–15 h |
| Mantenimiento mensual | $30.000–50.000 COP/mes | 1–2 h/mes |

**Regla de piso:** no bajes de $120.000 por una landing. Tu hora vale. Si te piden $50.000, te están pidiendo una landing de $50.000 — eso existe en Fiverr, gastá tu tiempo capacitándote mejor, no en competir por abajo.

### Paso 4.4 — Cómo encontrar clientes (sin inversión, aproximado a Popayán)
1. **Grupos de Facebook y WhatsApp locales** ("Emprendedores Popayán", "Clasificados Cauca"). No spamees: comentá lo que sabés y mostrá el portafolio.
2. **Tu Universidad**: profesores con consultorios, egresados con negocios, proyectos de emprendimiento.
3. **Caminar el centro**: entrá a 3 negocios con señal pobre de presencia digital y dejá tu pitch. Con tu tolerancia a vender (1/5), esto es tu superpoder.
4. **Tu trabajo anterior (bodega/atención al público)**: perfiles de gente que conociste. Emprendedores te conocen; vendéles.

---

## PARTE 5 — Errores que no debés cometer

1. **No compres cursos de "aprende webdev y gana $10M/mes".** Todo lo que necesitas está en tu curso gratuito y en YouTube. Si un "mentor" te cobra por el método, el negocio del mentor es el mentee, no la web.
2. **No compres hosting desde el día 1.** Vercel/Netlify es gratis y suficiente para tu nivel actual. Hosting pagado ($20–50 USD/año) lo considerás cuando un cliente lo anticipe o pida algo que la capa gratis no hace.
3. **No dejes que el cliente te pida cambios infinitos gratis.** Incluí 2 rondas de cambios en el precio; después, cada ronda extra se cotiza aparte.
4. **No copiadores la web de otro** (copyright + tu reputación). Inspirarte está bien; clonar no.
5. **No prometas plazos que no podés cumplir.** Mejor 5 días reales que 48 horas mentira. La confianza es tu negocio real.
6. **No avisar al cliente que vos también estás aprendiendo.** Profesionalismo: cobrás por resultado, no por horas de estudio. Lo que el otro necesita (una página que funcione) ya lo vas a tener.

---

## Cierre

Con `landing\index.html` customizado + Módulo 0–4 completados + dominio conectado, vas a estar operativa en 3–4 semanas a ritmo de 2 h/día. Después te toca la parte que ya sabés hacer de tu trabajo anterior: **hablarle a la gente y cobrar**.

Cuándo te trabás en cualquier paso: volvé a este archivo, leé el "por qué" de esa decisión, y si sigue trabado, preguntame.

---

## Actualización v6.1 — módulos 28–30

La capacitación creció a **31 módulos** (21 principales libres + 10 convergentes tras el examen, ahora de **21 preguntas con aprobación ≥18**):

- **M28 · PWA, ORM y el glosario anti-alienígena** — tu web instalable con service worker (menú offline en celular, con código), ORM explicado puenteando al Prisma del módulo 25, y la tabla-glosario de 10 siglas (API, REST/GraphQL, SDK, CI/CD, SaaS/PaaS/IaaS, SSR/SSG, webhook, YAML...) para que ninguna oferta de trabajo suene a otro idioma.
- **M29 · Docker completísimo** — imagen/contenedor/registro/volumen, contenedor vs VM, Dockerfile comentado línea por línea (con la regla de cache de capas), 12 comandos diarios, `docker-compose.yml` con tu stack real (API + Postgres + volúmenes que sobreviven), y el workflow completo hasta el deploy en tu VPS. 7 ejercicios, incluyendo dockerizar tu propia API.
- **M30 · IA generadora de video con agentes** — el pipeline pieza por pieza (voz IA: ElevenLabs/Edge TTS, imágenes: Bing/Leonardo, música: Suno, autopilot: InVideo/Pictory) + orquestación con tu agente local + qué prometer y qué no al cliente + el paquete mensual "web+QR+video+Google Business" que te convierte de freelance en operador.

Orden recomendado: M28 y M30 en paralelo desde ya (son de negocio directo); M29 cuando tengas el VPS del módulo 4.

## Actualización v6.2 — módulo 31 · Inglés B1→C1 (el plan del developer)

**M31 · Inglés B1→C1** (principal, libre): arranca en TU nivel real (B1-B2) con el plan 3×30 semanal (input técnico 30 min + output forzado 30 min + sistema de errores en `mistakes.md`), explota tu ventaja oculta (el vocabulario técnico C1 que ya usás sin saberlo), las 20 frases-patrón del trabajo (stand-up, PR, review), los conectores que marcan C1, y la ruta.userData al mercado en dólares (proposals de Upwork, discovery calls, negociación). Meta medible: 1 llamada de 15 min fluida en 60 días.
