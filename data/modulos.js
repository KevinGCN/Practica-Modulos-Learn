/* Data de módulos — extraída verbatim de index.html v6.2 (commit 38dfd3c).
   Contenido de módulos: NO editar acá dentro; cada página carga este archivo. */
const MODULOS = [

/* ============================ MÓDULO 0 ============================ */
{
  id:'m0', titulo:'Módulo 0 · El dominio: anatomía completa de lo que comprás',
  teoria:`
  <p>Ya compraste (o vas a comprar) <code>popayanese.shop</code>. Antes de tocar DNS, entendé <strong>de qué está hecho</strong> ese registro, porque cada pieza se administra distinto.</p>
  <table class="tabla">
    <tr><th>Pieza</th><th>Qué es</th><th>Dónde se gestiona</th></tr>
    <tr><td>Registro de dominio</td><td>Tu "ficha" en el registro del .shop (dueño, fechas, status)</td><td>Panel del registrador (Namecheap)</td></tr>
    <tr><td>Nameservers (NS)</td><td><em>A qué servidor DNS</em> pregunta el mundo por tus registros</td><td>Panel del registrador</td></tr>
    <tr><td>Zona DNS</td><td>La tabla de registros (A, CNAME, MX...) de tu dominio</td><td>El servicio DNS que apunten tus NS</td></tr>
    <tr><td>WHOIS / Privacy</td><td>Datos públicos del dueño; Privacy los oculta</td><td>Panel del registrador</td></tr>
    <tr><td>Status (EPP)</td><td>Banderas del ciclo de vida: <code>ok</code>, <code>clientTransferProhibited</code> (candado anti-robo), <code>pendingDelete</code></td><td>Panel / autogestionado</td></tr>
  </table>
  <h4>El detalle que a todos les muerde</h4>
  <p><strong>Dominio y DNS no son lo mismo.</strong> Podés comprar el dominio en Namecheap y administrar la zona DNS en Cloudflare (o al revés). Lo que conecta ambas cosas son los nameservers: Namecheap le dice al mundo "quién contesta por popayanese.shop". Cambiar de registrador futuro no toca tu zona DNS si los NS no cambian — por eso conviene separar registrador y zona desde el día uno.</p>
  <h4>Ciclo de renovación</h4>
  <p><code>activo → al vencimiento entra en redención (grace, ~30 días, con sobrecargo) → 5 días de pendingDelete → liberado</code>. Si vos dejás expirar un dominio con marca, alguien más lo puede registrar. Auto-renew + candado de transferencia = raramente verás este problema.</p>
  <div class="aviso">⏱ TTL del GR dom también aplica a NS: cuando cambiás nameservers, la referenciación vieja puede vivir hasta el TTL previo (24–48 h en el peor caso). Planificá cambios de NS con tiempo.</div>`,
  ejercicios:[
    'Comprar (o revisar el panel de) popayanese.shop y ubicar las 5 piezas de la tabla en tu registrador real',
    'Quitar de la cola: activar auto-renew y transfer lock (candado) — documentar con screenshot dónde quedó',
    'Verificar tu dominio con RDAP público: rdap.org/domain/popayanese.shop y ver que Privacy oculta tu nombre',
    'Anotar los nameservers actuales de tu dominio (ej: dns1.registrar-servers.com)',
  ],
  videos:[
    ['Qué es un dominio y cómo funciona DNS (visión general)', 'https://www.youtube.com/results?search_query=como+funciona+un+dominio+web+dns+explicacion'],
    ['Cómo funciona RDAP / WHOIS y por qué importa la privacidad', 'https://www.youtube.com/results?search_query=whois+domain+privacy+explicacion+espanol'],
  ],
  quiz:[
    { p:'¿Quién le dice al mundo a qué servidor DNS preguntar por tu dominio?', ops:['La zona DNS','Los nameservers registrados en el registrador','El hosting'], r:1 },
    { p:'¿Qué es la redención de un dominio?', ops:['Un descuento al renovar temprano','Un periodo post-vencimiento donde podés recuperar el domino pagando sobrecargo, antes de que se libere','Un registro DNS especial'], r:1 },
    { p:'¿Qué pasa si dejás que tu dominio expire?', ops:['Se libera tras redención y otro lo puede registrar','Se congela para siempre','Windows lo renueva solo'], r:0 },
  ],
},
/* ============================ MÓDULO 1 ============================ */
{
  id:'m1', titulo:'Módulo 1 · Registros DNS: A, CNAME, MX, TXT y diagnóstico real',
  teoria:`
  <p>Este es el idioma diario de la administración web. Dominarlo te diferencia del que "le da a publicar" sin entender.</p>
  <table class="tabla">
    <tr><th>Registro</th><th>Qué hace</th><th>Ejemplo para tu dominio</th></tr>
    <tr><td><code>A</code></td><td>Dominio → IPv4</td><td><code>@ → 76.76.21.21</code> (Vercel)</td></tr>
    <tr><td><code>AAAA</code></td><td>Dominio → IPv6</td><td>igual que A, pero IPv6</td></tr>
    <tr><td><code>CNAME</code></td><td>Alias de dominio → otro dominio</td><td><code>www → popayanese.shop</code></td></tr>
    <tr><td><code>MX</code></td><td>Quién recibe el correo del dominio</td><td>Zoho/Google Workspace</td></tr>
    <tr><td><code>TXT</code></td><td>Datos técnicos: verificaciones, SPF, DKIM, DMARC</td><td><code>v=spf1 include:... -all</code></td></tr>
    <tr><td><code>CAA</code></td><td>Qué autoridades de certificado pueden emitir SSL para tu dominio</td><td><code>0 issue "letsencrypt.org"</code></td></tr>
    <tr><td><code>NS</code></td><td>Delegación de un subdominio a otros DNS</td><td>raro de usar al inicio</td></tr>
  </table>
  <h4>Reglas de oro</h4>
  <ol>
    <li><strong>El apex (popayanese.shop) no admite CNAME</strong> en la raíz por estándar. Se procesa con <code>A</code>, <code>ALIAS</code> o <code>ANAME</code> (según el proveedor). Los proveedores modernos (Cloudflare, Netlify) hacen "CNAME flattening" para resolver esto por vos.</li>
    <li><strong>TTL</strong> = cuánto tiempo se cachea cada respuesta DNS. TTL 3600 = hasta 1 hora de retardo al cambiar. Antes de un cambio <em>planificado</em>, bajá el TTL a 300 para que el cambio pueda revertirse rápido; después lo subís.</li>
    <li><strong>Diagnóstico real con herramientas:</strong>
      <pre><code>nslookup popayanese.shop           # Windows: qué IP resuelve
nslookup -type=mx popayanese.shop  # consulta de otro tipo
nslookup -type=txt popayanese.shop</code></pre>
      Con <code>nslookup</code> podés diagnosticar "no carga mi web" en 80% de los casos: o el registro apunta mal, o el TTL viejo sigue cacheado, o el servicio cayó.</li>
  </ol>`,
  ejercicios:[
    'Crear zona DNS para popayanese.shop y cargar los registros que tu plataforma (Netlify/Vercel) te indica',
    'Configurar el redireccionamiento www → apex (o apex → www) y elegir cuál es el canónico',
    'Confirmar resolución con nslookup del apex y del www antes y después del cambio',
    'Si tenés correo: agregar SPF, DKIM y DMARC en TXT. Sin correo: leer por qué el DMARC evita que otros hagan phishing con tu dominio',
    'Diagnosticar un dominio ajeno con nslookup: elegir un dominio colombiano y adivinar dónde está hosteado por la IP',
  ],
  videos:[
    ['Registros DNS todos explicados (A, CNAME, MX, TXT, SPF)', 'https://www.youtube.com/results?search_query=registros+dns+explicados+A+CNAME+MX+TXT'],
    ['Diagnóstico DNS con nslookup/dig', 'https://www.youtube.com/results?search_query=nslookup+dig+diagnosticar+dns+tutorial'],
  ],
  quiz:[
    { p:'¿Qué registro conectás cuando el hosting te da un dominio (popayanese.netlify.app) en vez de una IP?', ops:['A','CNAME','MX'], r:1 },
    { p:'Querés reducir tu tiempo de re-intento ante un error en tu cambio de DNS. ¿Qué hacés?', ops:['Bajar el TTL del registro antes del cambio','Comprar otro dominio','Reiniciar el PC'], r:0 },
    { p:'¿Para qué sirve el registro CAA?', ops:['Para el correo','Regula qué autoridades pueden emitir certificados SSL para tu dominio','Para subdominios'], r:1 },
  ],
},
/* ============================ MÓDULO 2 ============================ */
{
  id:'m2', titulo:'Módulo 2 · HTTP: cómo se habla la web (y qué hacen los códigos de estado)',
  teoria:`
  <p>HTTP es el protocolo con que el navegador y el servidor hablan. Entender lo básico te da superpoderes de diagnóstico: <strong>el código de estado te dice casi siempre dónde está la falla</strong>.</p>
  <table class="tabla">
    <tr><th>Código</th><th>Significado</th><th>Cuándo lo ves</th></tr>
    <tr><td><code>200</code></td><td>OK</td><td>Todo bien</td></tr>
    <tr><td><code>301 / 308</code></td><td>Redirección permanente</td><td>www → dominio canónico</td></tr>
    <tr><td><code>304</code></td><td>Not Modified (caché)</td><td>El navegador ya tiene el recurso</td></tr>
    <tr><td><code>403</code></td><td>Prohibido</td><td>Permisos del servidor / firewall</td></tr>
    <tr><td><code>404</code></td><td>No existe la ruta</td><td>Link roto / dominio mal configurado</td></tr>
    <tr><td><code>500</code></td><td>Error interno del servidor</td><td>Falla del backend, no del navegador</td></tr>
    <tr><td><code>502 / 504</code></td><td>Bad Gateway / Timeout</td><td>El proxy inverso no alcanza al servidor de fondo</td></tr>
  </table>
  <h4>Pedido y respuesta, vistos de verdad</h4>
  <p>Abrí F12 → Network → recargá una web. Vas a ver: método (GET/POST), <strong>headers</strong> (User-Agent, Accept, Cookie), respuesta (Content-Type, Cache-Control, Set-Cookie). Los headers de seguridad que todo admin web debe conocer:</p>
  <pre><code>Content-Security-Policy      # restringe de dónde puede cargar recursos la página
Strict-Transport-Security    # fuerza HTTPS (HSTS)
X-Content-Type-Options: nosniff
X-Frame-Options / frame-ancestors   # anti clickjacking
Cache-Control                # cuánto cachear, clave de performance</code></pre>
  <h4>HTTP → HTTPS, el paso a paso real</h4>
  <ol>
    <li>El browser inicia <strong>handshake TLS</strong>: elige versión de TLS, intercambia claves, el certificado se valida contra las autoridades (CA) de confianza del sistema.</li>
    <li><strong>TLS expira:</strong> los certificados viven 90 días (Let's Encrypt) por diseño — el sistema está pensado para automatizarse con <code>certbot</code>, no para editar a mano.</li>
    <li><strong>Redirección 301</strong>: de <code>http://</code> a <code>https://</code> sin perder la conexión del visitante.</li>
  </ol>
  <div class="aviso">🔑 Los códigos 502/504 casi siempre son de tu proxy (módulo 5) y no del navegador. Saber esto te ahorra horas de debugging en el lugar equivocado.</div>`,
  ejercicios:[
    'F12 → Network en cualquier web: identificar método, status, y 5 headers de respuesta',
    'Probar con curl (o el test de navegador): devolver un 301 manual con Netlify redirects desde www a apex',
    'Identificar un sitio real que tenga HSTS activo (F12 → Response headers) y otro que no',
    'Averiguar la cadena SSL de popayanese.shop (cuando lo tengas publicado) con el candado del navegador',
  ],
  videos:[
    ['Cómo funciona HTTP (métodos, headers, status)', 'https://www.youtube.com/results?search_query=como+funciona+http+explicacion+espanol'],
    ['Handshake TLS y cómo funciona el HTTPS', 'https://www.youtube.com/results?search_query=como+funciona+https+tls+handshake+explicacion'],
  ],
  quiz:[
    { p:'Tu web da 502. ¿Dónde es más probable la falla?', ops:['En el navegador del cliente','En el servidor/proxy de fondo','En el DNS'], r:1 },
    { p:'¿Qué hace Strict-Transport-Security (HSTS)?', ops:['Comprime la página','Fuerza al navegador a usar HTTPS siempre para ese dominio','Bloquea bots'], r:1 },
    { p:'301 es distinto de 302, porque:', ops:['301 es permanente y guarda el cambio en caché del browser; 302 es temporal','301 solo sirve para móviles','No hay diferencia real'], r:0 },
  ],
},
/* ============================ MÓDULO 3 ============================ */
{
  id:'m3', titulo:'Módulo 3 · Puertos, firewall y la red desde tu lado',
  teoria:`
  <p>Un <strong>puerto</strong> es un número que hace que una IP se comporte como un edificio con departamentos: <code>92.63.12.1:443</code> es "el que vive en el piso 443". Cada servicio abre "su" puerto y el firewall decide quién pasa.</p>
  <table class="tabla">
    <tr><th>Puerto</th><th>Servicio típico</th><th>Cuidado</th></tr>
    <tr><td><code>22</code></td><td>SSH (control del server)</td><td>el más atacado del mundo</td></tr>
    <tr><td><code>80</code></td><td>HTTP</td><td>siempre público</td></tr>
    <tr><td><code>443</code></td><td>HTTPS</td><td>siempre público</td></tr>
    <tr><td><code>3306</code></td><td>MySQL</td><td>nunca público</td></tr>
    <tr><td><code>5432</code></td><td>PostgreSQL</td><td>nunca público</td></tr>
    <tr><td><code>6379</code></td><td>Redis</td><td>jamás público (target de bots)</td></tr>
    <tr><td><code>3389</code></td><td>Remote Desktop de Windows</td><td>if expuesto = riesgo alto</td></tr>
  </table>
  <h4>Lo que ves desde Windows</h4>
  <pre><code>netstat -ano              # puertos escuchando en tu máquina (-a todos, -n numérico, -o PID)
ipconfig /all             # tu IP, gateway, DNS
ping popayanese.shop      # probá si hay salida paquetes al host
tracert popayanese.shop   # saltos hasta llegar (resuelve IP de hosting)</code></pre>
  <h4>Modelo mental de seguridad</h4>
  <p><strong>Solo abrí al mundo lo que es público (80/443).</strong> Todo lo demás (bases de datos, SSH si podés, caches) queda <em>solo accesible desde el propio server o con whitelist de IP</em>. En Netlify/Vercel esto es invisible porque ellos administran el firewall, pero cuando montes VPS (modulo 4) es tu responsabilidad directa — y es donde fallan los principiantes: dejan MySQL abierto por comodidad y en 48 h ya hay bots escaneando.</p>
  <div class="aviso">🔒 La regla del firewall profesional: por defecto, todo cerrado; se abre sólemeado lo que se requiere y se documenta para qué.</div>`,
  ejercicios:[
    'netstat -ano en tu PC, identificar qué puertos están escuchando y a qué procesos pertenecen (con Task Manager)',
    'tracert popayanese.shop (o cualquier web) y contar cuántos saltos hay hasta el servidor',
    'Buscar (Leer) tu IP pública de casa con "cuál es mi ip" y responder por qué es distinta a la de tu PC interno (NAT)',
    'Identificar con netstat qué puerto usa VS Code, Discord o Steam a internet en un momento dado',
  ],
  videos:[
    ['Qué son los puertos de red y los más comunes', 'https://www.youtube.com/results?search_query=que+son+los+puertos+de+red+explicacion'],
    ['Firewall de Windows y reglas básicas', 'https://www.youtube.com/results?search_query=firewall+windows+reglas+puertos+explicacion'],
  ],
  quiz:[
    { p:'¿Qué puerto es el más atacado del mundo y qué servicio corres ahí?', ops:['80 HTTP','22 SSH','443 HTTPS'], r:1 },
    { p:'¿Por qué 3306 nunca debe quedar abierto al público?', ops:['Porque es lento','Porque es la base de datos: exponerla a bots es compromiso directo de datos','Porque Windows no lo permite'], r:1 },
    { p:'La IP que ves con ipconfig LAN tiene igual que la de "cuál es mi IP" en internet?', ops:['Sí, siempre','No: NAT transforma tu IP interna en una pública del router','Solo en horario nocturno'], r:1 },
  ],
},
/* ============================ MÓDULO 4 ============================ */
{
  id:'m4', titulo:'Módulo 4 · Tu primer VPS: alquiler, SSH y endurecimiento básico',
  teoria:`
  <p>Netlify y Vercel te esconden el servidor. Un <strong>VPS (Virtual Private Server)</strong> te lo da a vos: una máquina Linux real, con SSH, Nginx y tu responsabilidad. Es el paso donde pasás de "usuario de plataformas" a "admin de servidor".</p>
  <h4>Conectarse por primera vez</h4>
  <pre><code># el proveedor te da: IP, usuario root y contraseña o llave SSH
ssh root@TU_IP
# primer endurecimiento (los 3 pasos que evitan el 90% de compromisos):
adduser carlos                     # usuario nuevo distinto de root
usermod -aG sudo carlos            # le das poder de admin con sudo
nano /etc/ssh/sshd_config          # --> PasswordAuthentication no
                                        PermitRootLogin no
systemctl restart sshd</code></pre>
  <h4>Firewall en Linux con UFW (el más simple)</h4>
  <pre><code>ufw default deny incoming
ufw allow OpenSSH
ufw allow 80
ufw allow 443
ufw enable          # ¡verificá que SSH quedó primero o te lockeaste fuera!</code></pre>
  <div class="aviso">⚠️ Regla de supervivencia con UFW: SIEMPRE <code>ufw allow OpenSSH</code> ANTES de <code>ufw enable</code>, o perdés el acceso remoto en el segundo 1.</div>
  <h4>Proveedores con opción gratis (para práctica)</h4>
  <p>Oracle Cloud Free Tier (VM permanente gratis), Google Cloud (300 USD en 90 días, sirve para aprender; después lo apagás). Para <strong>cliente real</strong>: VPS de 5 USD/mes (Hetzner, DigitalOcean) alcanza para 10–20 pequeños sitios con Nginx.</p>
  <p><strong>Por qué aprender esto si ya tenés Netlify:</strong> porque vas a encontrar clientes que pidan cosas que la plataforma gratis no hace (backend propio, base de datos, reportes), y porque entendiendo el server entiendes qué hacen Netlify/Vercel "mágicamente" por vos — CDN, proxy, SSL, caché — y sos capaz de cobrar más y resolver problemas que otros no pueden.</p>`,
  ejercicios:[
    'Crear (o simular) una VM gratis en Oracle Cloud: OS Ubuntu, obtener IP pública',
    'Conectarte por SSH con la llave o contraseña inicial, y crear tu usuario no-root',
    'Desactivar login de root por SSH y login por contraseña (editar sshd_config y reiniciar servicio)',
    'Aplicar UFW: denegar todo, permitir solo 22, 80 y 443; verificar con ufw status',
    'Instalar tu primer nginx: apt update &amp;&amp; apt install nginx -y; ver la página default en el navegador con tu IP',
  ],
  videos:[
    ['Crear VM gratis en Oracle Cloud permanent Forever (paso a paso en español)', 'https://www.youtube.com/results?search_query=oracle+cloud+gratis+vm+para+siempre+tutorial+espanol'],
    ['SSH básico y primeros pasos de hardening en un server Linux', 'https://www.youtube.com/results?search_query=handering+servidor+vps+ubuntu+ssh+tutorial+espanol'],
    ['UFW firewall pasos previos vs habilitar', 'https://www.youtube.com/results?search_query=ufw+firewall+ubuntu+tutorial+espanol'],
  ],
  quiz:[
    { p:'¿Cuál es la regla de oro de UFW?', ops:['Habilitar UFW antes de autorizar SSH','Permitir SSH antes de habilitar UFW','Nunca usar UFW en producción'], r:1 },
    { p:'¿Por qué desactivar login de root por SSH?', ops:['Cosmética','root es el usuario que cualquiera intenta forzar; usuario con sudo + llave SSH es más difícil de atacar','Porque Linux lo bloquea hoy en día'], r:1 },
  ],
},
/* ============================ MÓDULO 5 ============================ */
{
  id:'m5', nivel:'conv', titulo:'Módulo 5 · Nginx y el proxy inverso: el concepto que separa juniors de admins',
  teoria:`
  <p>Un <strong>proxy inverso</strong> es un "portero inteligente" que recibe TODO el tráfico de internet antes de que llegue a tu aplicación. Tomás tu caso real: tenés 3 clientes (popayanese.shop, el restaurante y la tienda de ropa) todos con un mismo VPS pequeño. Nginx decide, por el <strong>Host header</strong>, a cuál aplicación interna entregar cada pedido.</p>
  <h4>El concepto en 30 segundos</h4>
  <pre><code>internet ──▸ Nginx :443 (SSL + ruteo + caché)
              ├──▸ waiter.app:3000  (app Node del restaurante)
              ├──▸ tienda.app:4000  (app Django de la ropa)
              └──▸ static: /var/www/popayanese</code></pre>
  <h4>Server block real (la unidad de configuración)</h4>
  <pre><code>server {
    listen 443 ssl http2;
    server_name popayanese.shop www.popayanese.shop;

    ssl_certificate     /etc/letsencrypt/live/popayanese.shop/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/popayanese.shop/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;      # ← tu app
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}</code></pre>
  <p>Las líneas <code>X-Real-IP</code> / <code>X-Forwarded-*</code> son las que le dicen a tu aplicación <strong>la IP real del visitante</strong> (si no, tu app cree que todos vienen de localhost) y si venía por HTTPS.</p>
  <h4>Certificado gratis con certbot</h4>
  <pre><code>apt install certbot python3-certbot-nginx -y
certbot --nginx -d popayanese.shop -d www.popayanese.shop
# renovación automática ya viene configurada (systemd timer)</code></pre>
  <h4>El flujo mental cuando algo no anda</h4>
  <pre><code>systemctl status nginx          # ¿está corriendo?
nginx -t                        # ¿la configuración tiene errores de sintaxis?
tail -f /var/log/nginx/error.log    # ¿qué dice el error real?</code></pre>
  <div class="aviso">🧠 Cuando te den 502 Bad Gateway, la tríada diagnóstica es siempre la misma: ¿Nginx vivo? ¿config ok? ¿la app de fondo escuchando en el puerto?</div>`,
  ejercicios:[
    'En tu VPS: configurar un server block que sirva una página estática en popayanese.shop (con un index.html propio)',
    'Agregar un segundo server block con un subdominio (ej: demo.popayanese.shop) apuntando a otro puerto interno',
    'Emitir SSL con certbot para ambos dominios y verificar la renovación automática con certbot renew --dry-run',
    'Si te da 502: aplicar la tríada diagnóstica (status / nginx -t / error.log) y documentar qué encontraste',
    'Colocar gzip y cache básico (expires header) en tu server block para performance',
  ],
  videos:[
    ['Nginx como proxy inverso, la mejor explicación', 'https://www.youtube.com/results?search_query=nginx+proxy+inverso+explicacion+espanol'],
    ['Certbot + Nginx, HTTPS gratis paso a paso', 'https://www.youtube.com/results?search_query=certbot+nginx+ssl+gratis+tutorial+espanol'],
    ['Configurar múltiples sitios en un solo servidor Nginx', 'https://www.youtube.com/results?search_query=nginx+multiple+domains+one+server+tutorial'],
  ],
  quiz:[
    { p:'¿Para qué sirven X-Real-IP y X-Forwarded-For en proxy_pass?', ops:['Sólo comprimen tráfico','Le pasan a tu app la IP real del visitante (y protocolo) detrás del proxy','Son headers de caché'], r:1 },
    { p:'¿Qué comando valida la sintaxis de tu configuración de Nginx ANTES de recargar?', ops:['nginx -t','systemctl reload','tail -f'], r:0 },
    { p:'¿Qué es certbot?', ops:['Un proxy','El cliente automatizado de Let\'s Encrypt que emite y renueva certificados gratis','Un firewall'], r:1 },
  ],
},
/* ============================ MÓDULO 6 ============================ */
{
  id:'m6', nivel:'conv', titulo:'Módulo 6 · Cloudflare, CDN y caché: velocidad y escudo',
  teoria:`
  <p>Una vez que tenés tu dominio y tu servidor, el mejor "mejor amigo" del admin web pequeño es <strong>Cloudflare</strong>: te da CDN global + filtro de bots + SSL + caché, TODO gratis en el plan base.</p>
  <h4>Qué hace realmente Cloudflare</h4>
  <ol>
    <li><strong>Tu DNS pasa a vivir en Cloudflare</strong> (→ cambiás los nameservers en Namecheap, única vez que los tocas).</li>
    <li><strong>Modo proxied (la nube naranja ☁️):</strong> con esta opción activa, el tráfico de tu web pasa por los servidores de Cloudflare, no directo a tu IP. Beneficios: tu IP real queda oculta (protección contra ataques directos), CDN en el borde, caché de estáticos, HTTP/2/3 gratis, y SSL duplicado entre borde y origen.</li>
    <li><strong>Modo DNS-only (nube gris):</strong> sólo responde a los nombres; el tráfico va directo a tu servidor. Útil cuando algo proxied te da problemas o para servicios no-HTTP (juegos, correos).</li>
  </ol>
  <h4>Cache-Control y las 3 superficies de caché</h4>
  <table class="tabla">
    <tr><th>Superficie</th><th>Dónde vive</th><th>Quién controla el tiempo</th></tr>
    <tr><td>Browser cache</td><td>En el navegador del visitante</td><td>Header <code>Cache-Control: max-age=...</code></td></tr>
    <tr><td>CDN cache (Cloudflare)</td><td>Servidores de borde en el mundo</td><td>Reglas de Cloudflare o headers</td></tr>
    <tr><td>Origin cache (Nginx)</td><td>Tu propio servidor</td><td>Config propia (nginx + expires)</td></tr>
  </table>
  <p><strong>La regla de oro de cache:</strong> lo estático (imágenes, CSS, JS con hash en el nombre) → cachear MUY largo. Lo dinámico (HTML, APIs, dashboards) → no cachear o cachear 5 min. El error clásico es cachear HTML largo y el cliente no ve su actualización.</p>
  <h4>Soluciones típicas en el plan gratis de Cloudflare</h4>
  <p>Cuando "actualizo y no veo el cambio": <code>Caching → Purge Everything</code> (limpiá la caché CDN). Cuando ignorás el modo proxied en desarrollo: <code>DNS-only</code>. Cuando sospechás ataque: <code>Security → Events</code> para ver qué bloqueo hubo.</p>`,
  ejercicios:[
    'Crear cuenta gratis Cloudflare y agregar popayanese.shop → cambiar nameservers en Namecheap',
    'Comparar el A record de tu web en modo DNS-only vs proxied: a qué IP responde en cada caso (nslookup)',
    'Activar caché para estáticos y probar el flujo "cambio algo en la web → no veo el cambio → Purge → lo veo"',
    'Con F12: comparar el Time-To-First-Byte de tu web con y sin Cloudflare proxied (graficá ambas mediciones con conocidos)',
    'Activar "Always Use HTTPS" + "Auto Minify" (o su sucesor) y verificar que no rompa tu web',
  ],
  videos:[
    ['Qué es un CDN y cómo funciona Cloudflare', 'https://www.youtube.com/results?search_query=como+funciona+cloudflare+cdn+explicacion'],
    ['Cloudflare setup con tu dominio, paso a paso', 'https://www.youtube.com/results?search_query=configurar+cloudflare+dominio+paso+a+paso'],
    ['Cache-Control / headers explicados', 'https://www.youtube.com/results?search_query=cache-control+http+headers+explicacion'],
  ],
  quiz:[
    { p:'¿Qué hace el "modo proxied" (nube naranja) en Cloudflare?', ops:['Nada, es cosmético','El tráfico pasa por Cloudflare: CDN + caché + oculta tu IP origen + filtro de bots','Redirige todo el tráfico a Namecheap'], r:1 },
    { p:'Actualizaste tu web y el visitante ve la versión vieja. ¿Qué hacés primero?', ops:['Reiniciar el servidor','Purge de caché en Cloudflare (o en el browser)','Cambiar el A record'], r:1 },
    { p:'¿Qué tipo de contenido conviene cachear con TTL muy largo?', ops:['HTML de la página de inicio','CSS/JS con nombre hasheado e imágenes','Respuestas de login'], r:1 },
  ],
},
/* ============================ MÓDULO 7 ============================ */
{
  id:'m7', nivel:'conv', titulo:'Módulo 7 · Administración continua: backup, monitoreo, logs y actualización',
  teoria:`
  <p>Publicar una web es el 20% del trabajo. El 80% es <strong>mantenerla viva</strong>: que no caiga, que se pueda recuperar, que no te la mamen los bots. Este módulo es el checklist del admin web profesional.</p>
  <h4>1) Backups — la regla 3-2-1</h4>
  <p>3 copias, 2 medios distintos, 1 fuera del servidor. Concreto para tu VPS:</p>
  <pre><code>tar -czf backup-$(date +%F).tar.gz /var/www /etc/nginx
# y copiar ese archivo FUERA del server (OttoDrive, S3, otro server)</code></pre>
  <p><strong>Un backup que vive sólo en el mismo server, es un backup que no existe:</strong> a la primera falla de disco, se van los dos.</p>
  <h4>2) Monitoreo — saber cuando algo cae ANTES que tu cliente</h4>
  <ul>
    <li><strong>UptimeRobot</strong> (gratis): ping cada 5 min a tu web → te avisa al mail si cae. La mínima asumible.</li>
    <li><strong>En el server:</strong> <code>htop</code> (uso de CPU/RAM en vivo), <code>df -h</code> (espacio disco — un disco lleno by Nginx muere), <code>systemctl status nginx</code>.</li>
  </ul>
  <h4>3) Logs — la fuente de verdad</h4>
  <pre><code>tail -f /var/log/nginx/access.log     # quién entra y qué pide
tail -f /var/log/nginx/error.log      # qué esta fallando
goaccess /var/log/nginx/access.log    # reporte bonito en tiempo real (opcional)</code></pre>
  <h4>4) Actualizaciones de seguridad</h4>
  <pre><code>apt update &amp;&amp; apt upgrade -y         # routina semanal
# sistemas como unattended-upgrades hacen lo esencial solo</code></pre>
  <h4>5) Checklist de "sitio en producción"</h4>
  <p>☑ SSL activo + renovación automática ☑ backups automáticos ☑ monitoreo con alerta ☑ logs revisados semanalmente ☑ UFW activo ☑ actualizaciones programadas ☑ doc en el repo de cómo levantar todo desde cero (¡tu futuro vos lo va a necesitar!).</p>
  <div class="aviso">🧠 Mentalidad del admin: <strong>assume que el server se va a caer.</strong> Todo lo que armás (backups, monitoreo, doc) es para que esa caída sea un evento de 30 minutos, no una tragedia de 3 días.</div>`,
  ejercicios:[
    'Configurar un backup automático semanal con cron (man crontab) que genere tar.gz de /var/www y /etc/nginx',
    'Ese mismo backup, copiarlo a un destino externo (Google Drive gratis con rclone, o descargarlo a tu PC)',
    'Crear cuenta UptimeRobot y configurar el monitor de popayanese.shop con alerta a tu email',
    'Practicar la tríada de diagnóstico: hacer df -h, htop, systemctl status nginx, y documentar qué salió en cada uno el día que los corriste',
    'Escribir (en README.md del repo) los pasos exactos para reconstruir tu server desde cero — ese doc ES tu seguro',
  ],
  videos:[
    ['Cron y tareas programadas en Linux', 'https://www.youtube.com/results?search_query=crontab+linux+tareas+programadas+explicacion'],
    ['Backups 3-2-1 y rclone para copiar a la nube', 'https://www.youtube.com/results?search_query=backup+3-2-1+regla+servidores+rclone'],
    ['UptimeRobot para monitorear tu web gratis', 'https://www.youtube.com/results?search_query=uptime+robot+tutorial+espanol'],
  ],
  quiz:[
    { p:'¿Cuál es la regla 3-2-1 en backups?', ops:['3 backups por día, 2 semanas, 1 año','3 copias, en 2 medios distintos, con 1 fuera del server','3 meses de retención, 2 servidores, 1 backup'], r:1 },
    { p:'Tu sitio aparenta estar caído pero el server responde. ¿Cuál es el primer comando Nginx a revisar?', ops:['tail -f access.log','systemctl status nginx','reboot ahora'], r:1 },
    { p:'¿Por qué monitorear con UptimeRobot si tus clientes no avisan?', ops:['Por estática del mercado','Porque saber de la caída antes que el cliente es la diferencia entre "lo estoy arreglando" y "qué cosas"...','No es necesario en VPS'], r:1 },
  ],
},

/* ==================== PISTA 2 · DESARROLLO ==================== */

{
  id:'dts', titulo:'Módulo 8 · TypeScript: JavaScript que se revisa solo',
  teoria:`
  <p>JavaScript es dinámico: los errores de tipo solo aparecen <strong>cuando el código corre</strong> (o peor, en producción). TypeScript añade tipos que se verifican <strong>antes de ejecutar</strong> — en tu editor y al compilar. En proyectos profesionales hoy es el estándar, no una opción.</p>
  <pre><code>// tipado básico
let nombre: string = 'Carlos';
let edad: number = 24;
let activo: boolean = true;
let tags: string[] = ['web', 'qr'];

// objetos: interface (también existe 'type')
interface Producto {
  nombre: string;
  precio: number;
  stock?: number;        // ? = opcional, puede faltar
}

// uniones: el valor es UNO de esos literales
type Estado = 'pendiente' | 'pagado' | 'anulado';

// funciones: parámetro y retorno tipados
function subtotal(p: Producto, unidades: number): number {
  return p.precio * unidades;
}</code></pre>
  <h4>Reglas que marcan la diferencia</h4>
  <ul>
    <li><code>any</code> <strong>apaga la protección</strong>: cualquier valor pasa. Usalo solo como último recurso; si no sabés el tipo, <code>unknown</code> obliga a verificar antes de usar — casi siempre la decisión correcta.</li>
    <li><strong>TypeScript nunca corre tal cual:</strong> se <em>compila</em> a JavaScript (<code>tsc</code>). Vite, Next.js y Expo lo compilan por vos — vos solo escribís .ts/.tsx.</li>
    <li>En el <code>tsconfig.json</code> activá <code>"strict": true</code>. Duele al principio, ahorra horas después — es la actitud profesional, no permisionista.</li>
    <li>El 80% del valor lo tenés ya: errores marcados en rojo <strong>mientras escribís</strong> + autocompletado que conoce la forma real de tus datos (una API con tipos deja de necesitar documentación aparte).</li>
  </ul>
  <div class="aviso">🔌 Puente con tu pista de infraestructura: un backend Express escrito en TS le da al front React el tipo <code>Producto</code> compartido — el contrato entre front y back vive en un archivo y termina bajo tu control.</div>`,
  ejercicios:[
    'Crear un proyecto React+TS: npm create vite@latest mi-app -- --template react-ts, y correr npm run dev',
    'Definir interface Producto (nombre, precio, stock opcional) y una función subtotal tipada en un archivo .ts propio',
    'Escribir a propósito subtotal("hola", 2) y leer el error del editor antes de corregirlo',
    'Convertir una variable any de tu código a un tipo concreto y ver qué errores nuevos aparecen (son bugs reales encontrados)',
    'Activar strict:true en tsconfig si no lo está, y resolver los errores que aparezcan',
  ],
  videos:[
    ['TypeScript desde cero en español (el curso que más se completa)', 'https://www.youtube.com/results?search_query=curso+typescript+desde+cero+espanol'],
    ['TypeScript para devs de JavaScript: qué cambia de verdad', 'https://www.youtube.com/results?search_query=typescript+para+programadores+javascript+explicacion'],
  ],
  quiz:[
    { p:'¿Cuál es la diferencia práctica entre any y unknown?', ops:['No hay, son sinónimos','any desactiva el chequeo; unknown obliga a verificar el tipo antes de usar el valor','unknown es más rápido en runtime'], r:1 },
    { p:'¿Qué indica el ? en stock?: number dentro de una interface?', ops:['Que el valor puede ser null siempre','Que la propiedad puede no existir en el objeto','Que es privada'], r:1 },
    { p:'¿Cómo llega TypeScript al navegador?', ops:['El navegador lo interpreta nativamente','Se compila a JavaScript antes de desplegar','Se envía como .ts con un header especial'], r:1 },
  ],
},

{
  id:'dnode', titulo:'Módulo 9 · Node.js: JavaScript en el servidor, event loop y npm',
  teoria:`
  <p><strong>Node.js</strong> es JavaScript fuera del navegador: el motor V8 (el mismo de Chrome) + libuv (I/O asíncrona). Con él, un solo lenguaje cubre tu front (React) y tu back (Express).</p>
  <h4>El modelo: event loop, un hilo, I/O no bloqueante</h4>
  <p>Su server tiene <strong>un solo hilo de ejecución</strong> pero nunca espera: cuando pide leer un archivo o consultar una DB, delega al sistema y <em>sigue atendiendo otros pedidos</em>; cuando el resultado llega, entra por el event loop. Un server Node maneja miles de conexiones simultáneas sin 1000 hilos. La contracara: <strong>si bloqueás el hilo con un cálculo pesado, todo se congela</strong> — el trabajo pesado de CPU se delega o se parte en trozos.</p>
  <pre><code>// async/await: la forma moderna (callbacks viejos no)
import { readFile } from 'node:fs/promises';

const datos = JSON.parse(await readFile('productos.json', 'utf8'));
console.log(datos.length, 'productos cargados');</code></pre>
  <h4>npm y package.json: el ecosistema</h4>
  <pre><code>npm init -y                 # crea package.json
npm install express         # dependencia de runtime (producción)
npm install -D typescript   # devDependency: solo para desarrollar
npm run dev                 # ejecuta un script def. en "scripts"
npx prettier                # corre un paquete sin instalarlo global</code></pre>
  <ul>
    <li><strong>package.json</strong> es tu manifiesto: nombre, scripts, y qué paquetes usa. <code>package-lock.json</code> congela versiones exactas — se commitea siempre.</li>
    <li><strong>Módulos:</strong> CommonJS (<code>const x = require('x')</code>) es el sistema viejo; ESM (<code>import x from 'x'</code>) es el moderno con <code>"type": "module"</code> en package.json. Nuevo código: ESM.</li>
  </ul>
  <h4>Secretos: process.env y .env</h4>
  <p>Credenciales, claves de API y configuración van en variables de entorno, jamás en el código subido a GitHub. Con el paquete <code>dotenv</code>: un archivo <code>.env</code> (listado en .gitignore) y <code>process.env.CLAVE</code> para leer. Un secret filtrado en un commit de GitHub es de los errores más caros y comunes del mundo: bots los buscan en minutos.</p>`,
  ejercicios:[
    'Verificar tu node/npm instalado (node -v, npm -v) y actualizar si están viejos',
    'Crear proyecto de práctica: npm init -y, un index.js con un await readFile de un JSON propio',
    'Agregar "type": "module" en package.json y reescribir un require como import',
    'Crear .env con MI_API_URL (ficticia), leerlo con dotenv y confirmar que .gitignore lo excluye',
    'Agregar "dev" como script en package.json que ejecute tu archivo con node --watch',
  ],
  videos:[
    ['Node.js event loop, la mejor explicación visual', 'https://www.youtube.com/results?search_query=nodejs+event+loop+explicacion+espanol'],
    ['npm y package.json para principiantes', 'https://www.youtube.com/results?search_query=npm+package.json+tutorial+espanol'],
  ],
  quiz:[
    { p:'Node atiende miles de conexiones con un solo hilo porque:', ops:['Crea un hilo por conexión internamente','El I/O es asíncrono: mientras espera disco/red, el event loop atiende otros pedidos','No puede realmente solo benchmark'], r:1 },
    { p:'¿Qué es package-lock.json y que haces con él?', ops:['Backup del package.json: se borra cuando sobra','Congela versiones exactas instaladas: se commitea para builds reproducibles','Lista global de módulos de la máquina'], r:1 },
    { p:'Dónde van las credenciales en un proyecto Node real', ops:['En constantes en el código','En process.env cargadas de .env, excluido de Git','En el package.json como "secrets"'], r:1 },
  ],
},

{
  id:'dexpr', nivel:'conv', titulo:'Módulo 10 · Express: tu primera API REST',
  teoria:`
  <p><strong>Express</strong> es el framework de servidores web de Node: mínimo, flexible, y el que vas a encontrar en cada oferta de back-end. Tu primera API completa se escribe en menos de 30 líneas.</p>
  <pre><code>import express from 'express';
const app = express();
app.use(express.json());        // middleware: parse adulto de JSON

let productos = [
  { id: 1, nombre: 'Zapato cuero', precio: 120000 },
];

app.get('/productos', (req, res) =&gt; res.json(productos));

app.get('/productos/:id', (req, res) =&gt; {
  const p = productos.find(x =&gt; x.id === Number(req.params.id));
  if (!p) return res.status(404).json({ error: 'No existe' });
  res.json(p);
});

app.post('/productos', (req, res) =&gt; {
  const { nombre, precio } = req.body;
  if (!nombre || !precio) return res.status(400).json({ error: 'Falta datos' });
  const nuevo = { id: productos.length + 1, nombre, precio };
  productos.push(nuevo);
  res.status(201).json(nuevo);
});

app.listen(3000, () =&gt; console.log('API en :3000'));</code></pre>
  <h4>Middleware: la cinta transportadora</h4>
  <p>Todo pedido pasa por una fila de funciones antes/después de tu ruta: logger, CORS, autenticación, parseo de JSON, manejo de errores. <strong>El orden importa</strong>: lo que va primero ve el pedido primero. Todo middleware puede cortar la cadena respondiendo, o seguir con <code>next()</code>.</p>
  <pre><code>app.use((req, res, next) =&gt; {
  console.log(new Date().toISOString(), req.method, req.url);
  next();  // sigue la cinta
});</code></pre>
  <h4>Conexión con tu pista de infraestructura (todo se junta)</h4>
  <ul>
    <li>Los códigos que devolvás (200/201/400/404/500) son los del módulo HTTP: el front los lee y decide qué mostrar.</li>
    <li>En tu VPS, Nginx (módulo 5) hace <code>proxy_pass</code> a Express en :3000 — Express ni se entera de SSL ni del mundo exterior.</li>
    <li>Para que el front React (en Vercel/Netlify) pueda llamar tu API necesitas <strong>CORS</strong> — módulo final te lo explica.</li>
  </ul>
  <div class="aviso">💾 Datos del MVP: un array en memoria o un JSON en disco alcanza para validar. Recién integración real de un cliente = SQLite/Postgres. Recordá tu principio: nada de sobreingeniería para un negocio que vende 10 pedidos día.</div>`,
  ejercicios:[
    'Crear API de práctica: npm i express, un server.js como el ejemplo, y probar GET en el navegador',
    'Probar POST con Insomnia (lo usaste antes) o curl, y verificar el 201 y el 400',
    'Agregar middleware logger propio como el ejemplo, y ver los logs en terminal con cada pedido',
    'Agregar la ruta PUT /productos/:id y DELETE /productos/:id, con 404 si no existe',
    'Devolver 400 cuando precio es negativo (validación de entrada: nunca confies en el cliente)',
  ],
  videos:[
    ['Express API REST desde cero en español', 'https://www.youtube.com/results?search_query=express+api+rest+desde+cero+espanol'],
    ['Middleware explicado con ejemplos', 'https://www.youtube.com/results?search_query=express+middleware+explicacion+espanol'],
  ],
  quiz:[
    { p:'¿Qué es un middleware en Express?', ops:['Una base de datos','Una función por la que pasa el pedido (logger, auth, parseo) que puede responder o seguir con next()','Un tipo de ruta solo para login'], r:1 },
    { p:'El cliente manda { precio: -5 }. ¿Respuesta correcta?', ops:['201 con el producto guardado','400 con mensaje de validación: la entrada se valida siempre en el server','Dejar que la base de datos lo decida más tarde'], r:1 },
    { p:'¿Por qué Express escucha en :3000 detrás de Nginx y no directo en 443?', ops:['Porque 443 es lento','Porque Nginx maneja SSL/ruteo y Express se concentra solo en la app (separación de responsabilidades)','Porque 443 está reservado para browsers'], r:1 },
  ],
},

{
  id:'dreact', nivel:'conv', titulo:'Módulo 11 · React: la UI como función del estado',
  teoria:`
  <p><strong>React</strong> construye interfaces con <strong>componentes</strong>: funciones que reciben datos y devuelven JSX (HTML dentro del JS). La idea central — y la que cambia tu cabeza para siempre — es <strong>UI = f(estado)</strong>: no manipulás el DOM a mano cuando algo cambia; cambiás el estado y React redibuja lo que haga falta.</p>
  <pre><code>import { useState } from 'react';

function BuscadorProductos({ productos }) {   // props: datos que bajan
  const [texto, setTexto] = useState('');      // estado local del componente

  const filtrados = productos.filter(p =&gt;
    p.nombre.toLowerCase().includes(texto.toLowerCase())
  );

  return (
    &lt;div&gt;
      &lt;input value={texto} onChange={e =&gt; setTexto(e.target.value)} /&gt;
      {filtrados.map(p =&gt; (
        &lt;ProductoTag key={p.id} producto={p} /&gt;   // key: identidad de la lista
      ))}
    &lt;div&gt;
  );
}</code></pre>
  <h4>Los 3 conceptos que sostienen todo</h4>
  <ul>
    <li><strong>Props</strong>: datos que fluyen del padre al hijo, de lectura. Componentes = piezas reutilizables (<code>&lt;ProductoTag&gt;</code> usado 10 veces es un solo código).</li>
    <li><strong>State</strong>: datos que el componente posee y cambian con el tiempo; <code>useState</code> los declara y cambia. Cambio de estado = re-render automático.</li>
    <li><strong>Efectos</strong>: <code>useEffect</code> corre código fuera del dibujo (fetch a tu API Express, timers, título del tab). Sus <em>dependencias</em> deciden cuándo re-corre; el resto de las veces se puede convertir en la fuente de tus bugs de duplicado: aprendé a leerlas.</li>
  </ul>
  <h4>Init ordenado</h4>
  <p>El estándar actual es <strong>Vite</strong> (rápido, moderno): <code>npm create vite@latest</code>. Un componente por archivo, carpeta <code>components/</code>, y no sub-APIs globales antes de necesitarla (manejo de estado: primero <code>useState</code> bien usado; Contexto/Redux cuando la app lo pide, no antes).</p>
  <div class="aviso">⚠️ Tu caso anterior de despliegue en Netlify encaja: <code>npm run build</code> genera <code>dist/</code> estático (HTML+JS+CSS) y Netlify/Vercel lo sirven con CDN y SSL — lo que ya hiciste un montón de veces, ahora con propósito claro.</div>`,
  ejercicios:[
    'Crear app Vite React y armar un contador con useState (+1, -1, reset)',
    'Componente ProductoCard con props (nombre, precio, imagen) reutilizado en una lista con key',
    'Consumir tu API Express (módulo anterior) con useEffect + fetch y listar los productos reales',
    'Agregar buscador por texto (input controlado + filter) sobre esa lista',
    'Producir un bug a propósito: fetch sin dependencias en useEffect y ver el bucle infinito de re-fetch — luego corregirlo',
  ],
  videos:[
    ['React desde cero en español, curso práctico (componentes, hooks)', 'https://www.youtube.com/results?search_query=react+curso+desde+cero+espanol+componentes+hooks'],
    ['useEffect y sus dependencias sin confusión', 'https://www.youtube.com/results?search_query=react+useeffect+dependencias+explicacion'],
  ],
  quiz:[
    { p:'Props vs state, en una línea', ops:['Son lo mismo con otro nombre','Props entran del padre (solo lectura); state es del componente y cambia con el tiempo','Props cambian a mano, state no'], r:1 },
    { p:'El input controlado con onChange y useState sirve para:', ops:['Evitar re-renders','Mantener el valor visible sincronizado con el estado y reaccionar a cada tecla','Validar el DOM directamente'], r:1 },
    { p:'Por qué la key en un .map de componentes', ops:['Estética','React usa la key para identificar cada item y reciclar su DOM sin retrazar todo','Es obligatoria solo en producción'], r:1 },
  ],
},

{
  id:'drn', nivel:'conv', titulo:'Módulo 12 · React Native + Expo: tu React, ahora en el celular',
  teoria:`
  <p><strong>React Native</strong> es React que en vez de dibujar &lt;div&gt; en un navegador, dibuja <strong>componentes nativos</strong> del celular: <code>View</code>, <code>Text</code>, <code>Image</code>, <code>Pressable</code>. Tu lógica React (componentes, props, useState) se transfiere casi toda a la vez: lo que cambia es la capa de elementos UI.</p>
  <pre><code>import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useState } from 'react';

export default function App() {
  const [pedidos, setPedidos] = useState([]);

  return (
    &lt;View style={styles.contenedor}&gt;
      &lt;Text style={styles.titulo}&gt;Pedidoexpress — Popayán&lt;/Text&gt;
      &lt;Pressable style={styles.boton} onPress={() =&gt; setPedidos(p =&gt; [...p, 'Sancocho'])}&gt;
        &lt;Text style={styles.textoBoton}&gt;Ordenar sancocho&lt;/Text&gt;
      &lt;/Pressable&gt;
      {pedidos.map((p, i) =&gt; &lt;Text key={i}&gt;• {p}&lt;/Text&gt;)}
    &lt;/View&gt;
  );
}

const styles = StyleSheet.create({
  contenedor: { flex: 1, padding: 20, marginTop: 50 },  // flexbox SIEMPRE activo
  titulo: { fontSize: 22, fontWeight: 'bold' },
  boton: { backgroundColor: '#c0392b', padding: 14, borderRadius: 8 },
});</code></pre>
  <h4>Diferencias con React web que te van a golpear</h4>
  <ul>
    <li>No existe <code>div</code>/<code>h1</code>/<code>CSS</code> global: todo es <code>StyleSheet</code> por objeto, y el layout es <strong>Flexbox por defecto en todo</strong>.</li>
    <li>No hay "páginas": hay <strong>pantallas + navegadores</strong> (React Navigation apila, tabula y saca drawer).</li>
    <li>Storage: <code>AsyncStorage</code> en vez de <code>localStorage</code>; y toda API UI del navegador (window, document) no existe — en su lugar APIs nativas (cámara, geolocalización, push).</li>
  </ul>
  <h4>Por qué Expo y no la herramienta raw</h4>
  <p><strong>Expo</strong> es la toolchain estándar: <code>npx create-expo-app</code> y, con la app <strong>Expo Go</strong> en tu celular real, escaneás el QR del dev server y probás la app en tu teléfono en 30 segundos — sin Android Studio, sin Mac, sin compilar. Para publicar en tiendas, <code>eas build</code> construye en la nube (dato honesto de precios: Google Play cuesta ~25 USD una vez; Apple ~99 USD/año — esa barrera la conversás con el cliente si el proyecto lo exige).</p>
  <p><strong>Upa extra para tu negocio:</strong> las <strong>OTA (over-the-air) updates</strong> de Expo te permiten actualizar la app publicada sin pasar por la tienda — cambio de precios del menú en minutos.</p>
  <div class="aviso">📦 Capstone móvil para tu cartera: una app de pedidos para el restaurante conectada a tu API Express (módulo 10). Con eso mostrás "páginas + apps" en tu portafolio — sea la primera app móvil hecha en Popayán con QR de mesa ligada.</div>`,
  ejercicios:[
    'npx create-expo-app mi-app-móvil; npx expo start; escanear el QR con Expo Go en tu celular',
    'Armar una pantalla de menú con View/Text/Pressable y StyleSheet usando tus 4 productos',
    'Consumir tu API Express con fetch (http local requiere tu IP LAN exacta — no localhost) y listar los productos',
    'Agregar React Navigation: primera pantalla menú, segunda pantalla pedido, apilar y navegar adelante/atrás',
    'Guardar el último estado en AsyncStorage (pedidos que cambian al reabrir la app)',
  ],
  videos:[
    ['React Native con Expo desde cero en español', 'https://www.youtube.com/results?search_query=react+native+expo+curso+espanol+desde+cero'],
    ['Expo Go y desarrollo móvil rápido', 'https://www.youtube.com/results?search_query=expo+go+tutorial+espanol+react+native'],
  ],
  quiz:[
    { p:'En React Native, el equivalente de div es:', ops:['Picker','View','Section'], r:1 },
    { p:'Por qué la app Expo conectada a tu API local necesita tu IP LAN y no localhost:', ops:['Porque Expo Go no funciona offline','localhost en tu teléfono es su propio(ish) dispositivo: no llega a tu PC; hay que apuntar a la IP de tu red','Es una regla de Play Store'], r:1 },
    { p:'¿Qué son las OTA updates de Expo?', ops:['Actualizar la app en el teléfono sin pasar por la tienda','El precio de la App Store','Un sistema de backups'], r:0 },
  ],
},

{
  id:'dfull', nivel:'conv', titulo:'Módulo 13 · Full-stack: unir todo y tu proyecto capstone',
  teoria:`
  <p>Este módulo une las dos pistas: tu VPS/Nginx (infra) ejecuta tu API Express que sirve datos a tu front React. <strong>Esto es lo que multiplica tu tarifa:</strong> una landing estática cobra $120–200k; un sistema con backend, catálogo y panel, $300–600k.</p>
  <h4>El mapa completo de producción</h4>
  <pre><code>[Celular/PC del cliente]
   │ https
   ▼
www.popayanese.shop  ── Vercel/Netlify (front React, CDN+SSL)
   │ fetch JSON
   ▼
api.popayanese.shop  ── Nginx :443 (SSL via certbot)
   │ proxy_pass
   ▼
Express :3000 en tu VPS ── PM2 (proceso vivo y se reinicia solo)
   ▼
SQLite / Postgres (cuando lo necesites)</code></pre>
  <h4>Las 4 piezas nuevas de este nivel</h4>
  <ul>
    <li><strong>Subdominio api:</strong> en tu DNS agregás <code>api</code> con A/CNAME a tu VPS — mismo dominio, zona única (módulo 1 de infra).</li>
    <li><strong>CORS:</strong> el navegador bloquea fetch de www a api (dominios distintos). Express con el paquete <code>cors</code> lo habilita de forma explícita: <code>app.use(cors({ origin: 'https://www.popayanese.shop' }))</code>. Es una política de seguridad, no un truco que "no anda".</li>
    <li><strong>PM2:</strong> gestor de procesos de Node: <code>pm2 start api.js</code> reinicia tu API si crashea y la levanta al boot. <code>pm2 logs</code> para re-visar (complementa tus logs Nginx del módulo de operación).</li>
    <li><strong>Dotenv en producción:</strong> las credenciales (DB, claves) viven solo en el VPS; front nunca tiene secretos (todo lo que llega al navegador es público — regla de oro).</li>
  </ul>
  <h4>Capstone: catálogo digital con backend (lo que vendé en Popayán)</h4>
  <ol>
    <li>API Express con CRUD de <code>productos</code> (model = la misma interface TS del módulo 8, compartida en front y back).</li>
    <li>Front React: catálogo público + pequeña pantalla admin para agregar/editar productos.</li>
    <li>Deploy: front en Netlify/Vercel, API en tu VPS con Nginx + PM2 + SSL.</li>
    <li>Agregar Google Business/QR a la mesa del restaurante: el QR apunta al catálogo en vivo.</li>
  </ol>
  <div class="aviso">🧾 Checklist de entrega ante el cliente (todo de esta capacitación): SSL en www y api ✓ backup del server ✓ UptimeRobot ✓ PM2 logo misión ✓ cron de backups ✓ doc de reconstrucción (infra módulo 7). Con eso cobrás como profesional — que lo que entrega es el mismo checklist.</div>`,
  ejercicios:[
    'Instalar PM2 y poner tu API del módulo 10 en producción: pm2 start, pm2 logs, pm2 startup',
    'Agregar registro DNS api.popayanese.shop apuntando a tu VPS + server block Nginx + certbot para SSL',
    'Configurar cors en tu API solo para el dominio de tu front (no comodín *) en producción',
    'Unir el capstone: front React consumiendo la API desplegada, catálogo y admin funcionando desde el mundo exterior',
    'Redactar tu tabla de precios backend-incluido (landing 120-200k / sistema catálogo 300-600k / app móvil con API 400-800k) y tu pitch actualizado',
  ],
  videos:[
    ['Deploy de Node API con PM2 + Nginx paso a paso', 'https://www.youtube.com/results?search_query=deploy+node+pm2+nginx+tutorial+espanol'],
    ['CORS explicado claramente', 'https://www.youtube.com/results?search_query=cors+explicado+espanol'],
  ],
  quiz:[
    { p:'¿Qué problema resuelve CORS?', ops:['Acelera las APIs','El navegador bloquea fetch entre dominios distintos; CORS es el permiso explícito del server','Reduce el peso del JSON'], r:1 },
    { p:'¿Por qué PM2 en producción y no node api.js a mano?', ops:['Es más rápido','Reinicia la app si crashea, la levanta al boot del server y gestiona logs — un proceso a mano muere y nadie lo revive','PM2 evita pagar VPS'], r:1 },
    { p:'¿Dónde van los secretos en producción?', ops:['En el front, ofuscados','Solo en el backend (env del VPS); el front nunca lleva secretos porque todo lo que llega al navegador es público','En el package.json'], r:1 },
  ],
},

/* ==================== PISTA 3 · OFICIO DE INGENIERÍA ==================== */

{
  id:'omod', titulo:'Módulo 14 · Modularidad y arquitectura: cómo se organiza un proyecto de verdad',
  teoria:`
  <p>La modularidad es la respuesta a una pregunta que todo proyecto grande pregunta tarde: <strong>¿dónde pongo esto?</strong> Un módulo es una unidad con <strong>una responsabilidad</strong>, una interfaz clara y el mínimo conocimiento del resto. Bien hecho, cualquier pieza se puede entender, probar y reemplazar sola.</p>
  <h4>Los 3 principios que gobiernan la modularidad</h4>
  <ol>
    <li><strong>Separación de concerns (SoC):</strong> cada cosa tiene su lugar y su única razón de cambiar. Los datos, la lógica de negocio, la presentación y el acceso a red son concerns <em>distintos</em>. Si un archivo hace todo, cambiar "el color del botón" puede romper "el cálculo del IVA": eso es acoplamiento malsano.</li>
    <li><strong>Bajo acoplamiento, alta cohesión:</strong> cohesión = lo que hay <em>junto</em> en el módulo pertenece juntos (todo el código de facturación vive en facturación/); acoplamiento = cuánto necesita un módulo <em>conocer</em> de otro. Buscás módulos muy cohesivos que se comuniquen por interfaces pequeñas, no compartiendo estructuras por doquier.</li>
    <li><strong>Regla de dependencias en una dirección:</strong> la UI depende de la lógica, la lógica de los servicios, los servicios de los datos. <em>Nunca</em> al revés. Las dependencias circulares (A importa B que importa A) son la señal n.º 1 de diseño roto.</li>
  </ol>
  <h4>Cómo se ve en tu stack real (front React + API Express)</h4>
  <pre><code>mi-app/
├── src/
│   ├── components/     # piezas de UI reutilizables ( dumb: solo dibuja)
│   ├── pages/          # pantallas (componen los components)
│   ├── services/       # TODO el fetch/HTTP (pages no conocen axios/fetch)
│   ├── types/          # interfaces compartidas (Producto, Pedido...)
│   └── utils/          # funciones puras reutilizables (formatMoney, validar)
└── package.json
api/
├── routes/             # definición de endpoints (fino: solo rutea)
├── controllers/        # valida entrada, llama servicios, responde
├── services/           # lógica de negocio (el corazón)
├── repositories/       # TODO el acceso a datos (SQL/DB aquí, SOLO aquí)
├── middleware/         # auth, logger, errores
└── types/              # mismas interfaces de app → contrato compartido</code></pre>
  <p><strong>La prueba de la arquitectura:</strong> si mañana cambiás de base de datos, ¿cuántos archivos tocaste? Con repositorios, solo los de <code>repositories/</code>. Si cambiás el diseño, solo <code>components/</code>. Si la prueba falla, hay acoplamiento por limpiar.</p>
  <h4>Refactor manejable: Boy Scout + extracción</h4>
  <p>Regla Boy Scout: "dejá el código un poco mejor de como lo encontraste". No refactors gigantes de fines de semana (no se terminan y rompen todo): extracciones pequeñas diarias — "esta función de 80 líneas tiene 3 responsabilidades, extraigo la que toca hoy". Un archivo &gt; 300 líneas o una función &gt; 40 son señales de extracción pendiente (guías, no leyes).</p>
  <div class="aviso">🧠 Conexión con tu negocio: cuando vendés el sistema del capstone, la modularidad es tu justificación de precio: "te entrego código organizado en capas — si mañana querés cambiar precios no toco 40 archivos, toco 1". El clienta no paga la palabra: paga la propiedad de que el cambio salga rápido y barato.</div>`,
  ejercicios:[
    'Tomar el server.js del módulo 10 (Express) y separarlo en routes/ + controllers/ + services/ — la API debe seguir funcionando idéntica tras el refactor',
    'En tu front React: extraer TODO el fetch a src/services/api.ts (las pages no deben contener ninguna URL ni fetch directo)',
    'Crear src/types/Producto.ts compartido, eliminar cualquier definición duplicada de la interface en el proyecto',
    'Buscar en tu código una función de más de 40 líneas y extraer una parte en una función pura con nombre bueno — probar que sigue funcionando',
    'Dibujar (en papel o txt) el diagrama de dependencias de tu proyecto y marcar con rojo cualquier flecha que "suba" (UI → lógica → datos debe ser la única dirección válida)',
    'Regla de Boy Scout en acción: en tu próximo commit, incluir 1 extracción pequeña (función o componente) y 1 reducción de duplicado',
  ],
  videos:[
    ['Arquitectura de software para principiantes (capas y separación de concerns)', 'https://www.youtube.com/results?search_query=arquitectura+de+software+principiantes+capas+espanol'],
    ['Cómo organizar carpetas en proyectos React grandes', 'https://www.youtube.com/results?search_query=estructura+carpetas+proyecto+react+grande+espanol'],
    ['Clean Code y refactorización básica (run-through práctico)', 'https://www.youtube.com/results?search_query=clean+code+refactorizacion+basica+espanol'],
  ],
  quiz:[
    { p:'Bajo acoplamiento y alta cohesión significan, respectivamente:', ops:['Pocas conexiones EntRE módulos; las cosas de adentro pertenecen juntas','Muchos módulos viejos; cosas bien pegadas con superglue','Módulos pequeños; módulos con nombres cortos'], r:0 },
    { p:'Cambias de Postgres a SQLite y solo tocas la carpeta repositories/. ¿Qué te lo permitió?', ops:['La separación de concerns con dependencias en una dirección','Suerte y comentarios','El express.json() middleware'], r:0 },
    { p:'Una dependencia circular (A→B→A) indica:', ops:['El diseño funciona con optimización automática','Diseño roto: alguna responsabilidad no está en su lugar','Que TypeScript no está activo'], r:1 },
    { p:'Regla Boy Scout, en versión práctica:', ops:['Refactor de 2 días cada mes','Cada vez que tocas código, lo dejas un poco mejor que como lo encontraste','No tocar lo que funciona sin test'], r:1 },
  ],
},

{
  id:'ogit', titulo:'Módulo 15 · Git real: commits, ramas y recovery sin pánico',
  teoria:`
  <p>Ya usaste Git para subir a Netlify (publish a GitHub). Ahora va la parte que <strong>te salva el trabajo y te hace profesional</strong>: historia limpia, ramas y deshacer sin perder nada.</p>
  <h4>El histórico de commits: tu diario técnico</h4>
  <pre><code>git status            # qué cambió (siempre primero)
git diff              # qué cambió exactamente, línea a línea
git add -A            # stage todo "-A"; o archivos específicos
git commit -m "feat: agrega ruta DELETE de productos"
git log --oneline --graph -10</code></pre>
  <p><strong>Conventional Commits</strong> (el estándar profesional): <code>feat:</code> funcionalidad nueva, <code>fix:</code> corrección, <code>refactor:</code> cambio interno sin cambiar comportamiento, <code>docs:</code> documentación, <code>chore:</code> herramientas/config. Un commit = un cambio coherente. "Cambios varios" no te sirve ni a vos ni a quien le pega una mirada a tu GitHub (¡y tu GitHub ES tu CV en venta!).</p>
  <h4>Ramas: trabajo paralelo sin suciedad</h4>
  <pre><code>git switch -c feat/productos-excel    # crear y cambiar rama
# … commits en la rama …
git switch main
git merge feat/productos-excel        # integrar (o pull request en GitHub)</code></pre>
  <p>Regla para freelance: <code>main</code> siempre desplegable y funcional; todo lo demás en rama <code>feat/</code> o <code>fix/</code>. Con Netlify/Vercel, cada <strong>push de rama crea un deploy preview</strong> — prueba el cambio con una URL antes de tocar main y le mostrás al cliente "mira, ni toqué tu producción".</p>
  <h4>Deshacer sin pánico (los 3 escenarios)</h4>
  <pre><code>git restore archivo.js                # deshacer cambios NO commiteados
git restore --staged archivo.js       # sacarlo del stage (queda en disco)
git revert &lt;hash&gt;                     # commitea el inverso — seguro SIEMPRE
# git reset --hard: solo en ramas tuyas sin compartir — puede PERDER trabajo</code></pre>
  <div class="aviso">🛟 La red de seguridad total: <code>git reflog</code> registra TODOS tus movimientos (commits, reset, merge). Incluso "lo borré todo" suele ser recuperable desde ahí. Antebranches de pánico: reflog primero, llantos después (que por lo general no vienen).</div>`,
  ejercicios:[
    'Revisar tu git log de un proyecto: reescribir (escribir primero) los próximos 5 commits en formato Conventional Commits',
    'Pasar tu siguiente cambio por rama feat/ + merge a main, y probar que Main nunca contento un bug (así se rompe en main)',
    'Provocar un error a propósito: cambiar 2 archivos, restaurar 1 sin commitear con git restore, y confirmar qué se perdió y qué no',
    'Con git revert: deshacer un commit de tu historia y verificar que el contenido volvió al estado anterior SIN borrar el historia',
    'Abrir un deploy preview en Netlify de una rama feat/ y compartirlo a un amigo antes del merge',
    'Investigar git reflog: accidentalmente borrar un commit con reset --hard y recuperarlo solo con reflog (en un repo de practica, no en el tuyo real)',
  ],
  videos:[
    ['Git y GitHub completo, curso en español', 'https://www.youtube.com/results?search_query=git+github+curso+completo+espanol'],
    ['Deshacer cambios: restore, revert, reset (con cuándo NO usar cada uno)', 'https://www.youtube.com/results?search_query=git+revert+reset+restore+explicacion'],
  ],
  quiz:[
    { p:'git revert vs git reset --hard:', ops:['Son equivalentes','revert commitea el cambio inverso (seguro en compartidas); reset --hard reescribe historia y PUEDE perder trabajo','reset --hard es el recomendado en equipo'], r:1 },
    { p:'¿Qué commiteás como feat: vs refactor:?', ops:['feat cambia comportamiento visible; refactor es interno sin cambiar comportamiento','Son lo mismo con otro nombre','refactor agrega features con tests'], r:0 },
    { p:'Regla de ramas para freelance:', ops:['Todo directo en main, siempre','main siempre desplegable/estable; el trabajo nuevo en rama, integrado vía merge/PR','Una rama distinta por día'], r:1 },
  ],
},

{
  id:'otest', nivel:'conv', titulo:'Módulo 16 · Testing: código que se prueba solo',
  teoria:`
  <p>Un test es código que ejecuta tu código y verifica que lo que sale es lo que esperabas. Su valor no es "cuando anda bien": <strong>es cuando cambia algo</strong>. Sin tests, cada cambio es fe de que "probé a mano parecía OK"; con tests, el propio proyecto te avisa en segundos si algo viejo se rompió.</p>
  <h4>El patrón RED → GREEN → REFACTOR</h4>
  <ol>
    <li><strong>RED</strong>: escribí un test pequeño que FALLA (porque la función aún no existe o está mal).</li>
    <li><strong>GREEN</strong>: escribí el código mínimo para que pase. Nada más. Sin adelantarte a lo que el test pide.</li>
    <li><strong>REFACTOR</strong>: mejorá la estructura manteniendo los tests en verde. Si algo se rompe, el test te avisó, no el cliente.</li>
  </ol>
  <h4>Con tu stack (Vitest para utilidades y API)</h4>
  <pre><code>// utils/precios.ts
export function subtotal(precio: number, unidades: number): number {
  return precio * unidades;
}
export function aplicarDescuento(total: number, pct: number): number {
  if (pct &lt; 0 || pct &gt; 100) throw new Error('Descuento inválido');
  return total * (1 - pct / 100);
}

// utils/precios.test.ts
import { describe, it, expect } from 'vitest';
import { subtotal, aplicarDescuento } from './precios';

describe('subtotal', () =&gt; {
  it('multiplica precio por unidades', () =&gt; {
    expect(subtotal(10000, 3)).toBe(30000);
  });
  it('con unidades 0 da 0', () =&gt; {
    expect(subtotal(10000, 0)).toBe(0);
  });
});
describe('aplicarDescuento', () =&gt; {
  it('10% sobre 10000', () =&gt; expect(aplicarDescuento(10000, 10)).toBe(9000));
  it('rechaza 150% con error', () =&gt; {
    expect(() =&gt; aplicarDescuento(100, 150)).toThrow();
  });
});</code></pre>
  <p>Correrlo: <code>npm i -D vitest</code> + <code>npx vitest</code> (modo watch). Fijate que el test cubre: caso normal, <strong>frontera</strong> (unidades 0) y <strong>error</strong> (150%): los_tests que apuntan solo al caso feliz son decoración.</p>
  <h4>Los 3 niveles (y cuál te sirve hoy)</h4>
  <table class="tabla">
    <tr><th>Nivel</th><th>Qué prueba</th><th>Cuántos</th></tr>
    <tr><td>Unitario</td><td>Una función pura aislada</td><td>muchos, rápidos</td></tr>
    <tr><td>Integración</td><td>Tu API completa con supertest (ruta + validación + status)</td><td>claves, unos por endpoint</td></tr>
    <tr><td>E2E</td><td>La app completa con Playwright (simula usuario real)</td><td>pocos, caminos críticos</td></tr>
  </table>
  <p>Para tu nivel: <strong>unitarios de lógica de dinero/validaciones + 1 test de integración por endpoint</strong> (supertest). E2E lo agregás cuando hay un flujo que no puede romperse jamás (checkout, pedido). ¿Lo que NO defiendo: apuntar a 100% de cobertura como meta ideal: se cubre con lógica real (cálculos, validaciones, auth), no por mascar un número.</p>
  <div class="aviso">💸 Cotización en freelance: "cambios sin romper nada" es posible SÓLO si hay tests. El cliente que pide cambios cada semana baratilos a vos (no re-testear todo a mano): ahí el test se paga solo el primer mes.</div>`,
  ejercicios:[
    'En un proyecto: npm i -D vitest y configurar el script "test" en package.json',
    'RED→GREEN: escribir el test de aplicarDescuento(-5) que lanza error, verlo FALLAR, implementar la validación y verlo pasar',
    'Testear formatoMoneda() (si la tenés) o formatMoney: fronteras (0, millones, negativo) además del caso normal',
    'Proteger tu API: test de integración con supertest a tu endpoint POST /productos, que verifique 201 para data ok y 400 para data inválida',
    'Romper un test a propósito: cambiar subtotal para que devuelva precio*unidades*2, correr la suite, LEER qué falló, corregirlo',
    'Agregar el script test antes de cada push: habit de CI manual que a Netlify después le d_php cuando lo integres',
  ],
  videos:[
    ['Vitest y testing unitario en español', 'https://www.youtube.com/results?search_query=vitest+testing+espanol+tutorial'],
    ['TDD RED GREEN REFACTOR explicado con ejemplo real', 'https://www.youtube.com/results?search_query=tdd+red+green+refactor+espanol'],
    ['Supertest: tests de integración para tu API Express', 'https://www.youtube.com/results?search_query=supertest+express+test+integracion+tutorial'],
  ],
  quiz:[
    { p:'¿Cuándo vale un test?', ops:['Cuando el código anda bien por primera vez','Cuando algo cambia u se debe confirmar que lo viejo sigue andando','Solo en proyectos grandes'], r:1 },
    { p:'El primer paso del ciclo TTD es:', ops:['Verde: escribir el código para pasar','Rojo: escribir un test que falle por la falta de la funcionalidad','Refactor : mejorrar sin test'], r:1 },
    { p:'Un test que solo prueba el "camino feliz" falla frente a:', ops:['Nada : los demás casos no ocurren','Frontera y errores, los que definen si el sistema es confiable de verdad','Solo bugs de tipografía'], r:1 },
  ],
},

{
  id:'osec', nivel:'conv', titulo:'Módulo 17 · Seguridad y autenticación: proteger tu API y a tus clientes',
  teoria:`
  <p>Todo lo que despliegas en tu VPS tiene bots atacándolo desde el primer minuto. No es paranoia: es medible. La buena noticia: el 90% de los ataques comunes se defiende con 5 hábitos, todos aprendibles hoy.</p>
  <h4>Los 4 ataques que SIEMPRE figuran y su defensa</h4>
  <table class="tabla">
    <tr><th>Ataque</th><th>Cómo funciona</th><th>Tu defensa concreta</th></tr>
    <tr><td>Inyección SQL</td><td>El atacante manda SQL en un input (<code>'; DROP TABLE...')</code> y la DB lo ejecuta</td><td>Queries parametrizadas/sanitizadas SIEMPRE (los ORM como Prisma lo hacen por defecto); jamás concatenar strings en SQL</td></tr>
    <tr><td>XSS</td><td>Escribe <code>&lt;script&gt;</code> en un input que Renderiza sin escapar en tu web (comentario, nombre de producto)</td><td>React ya escapa por defecto — el riesgo es <code>dangerouslySetInnerHTML</code> y inputs de admin; validar y sanitizar en server</td></tr>
    <tr><td>Fuerza bruta en login</td><td>Bots probando combos de emails/contraseñas TODO el día en /login</td><td>Rate limit (express-rate-limit), contraseñas hasheadas, 2FA opcional</td></tr>
    <tr><td>Secrets filtrados</td><td>Subes .env a GitHub; bots escanean commits MINUTOS después</td><td>.gitignore desde el commit 1; si filtraste: rotar la credencial YA, borrar no basta</td></tr>
  </table>
  <h4>Passwords: hash con bcrypt (jamás texto plano)</h4>
  <pre><code>import bcrypt from 'bcrypt';

// al registrar:
const hash = await bcrypt.hash(contrasena, 12);   // 12 = rondas de costo

// al loguear:
const ok = await bcrypt.compare(contrasena, hashGuardado);  // true/false</code></pre>
  <p><strong>Por qué hash y no encriptado:</strong> el hash es un proceso de una dirección: de la contraseña NO se puede volver al original. Si te roban la DB, no roban contraseñas. El <code>salt</code> interno de bcrypt hace que dos usuarios con la misma clave guarden hashes distintos (mata las tablas precalculadas).</p>
  <h4>Sesiones con JWT (el estándar en APIs)</h4>
  <pre><code>// al loguear bien:
const token = jwt.sign({ id: usuario.id, rol: 'admin' }, process.env.JWT_SECRET, { expiresIn: '2h' });
res.json({ token });

// middleware de rutas protegidas:
function auth(req, res, next) {
  const [esquema, token] = req.headers.authorization?.split(' ') ?? [];
  if (esquema !== 'Bearer ' || !token) return res.status(401).json({ error: 'Sin token' });
  try { req.usuario = jwt.verify(token, process.env.JWT_SECRET); next(); }
  catch { res.status(401).json({ error: 'Token inválido o expirado' }); }
}
app.get('/admin/productos', auth, (req, res) =&gt; { ... });</code></pre>
  <p><strong>El JWT firmado (no encriptado)</strong>: nadie puede FALSIFICAR el payload sin tu secreto, pero cualquiera puede leerlo — nunca metas secretos adentro; mete lo mínimo (id, rol). <code>JWT_SECRET</code> vive solo en tu .env del VPS (módulo desarrolló-node). Y el rol <code>admin</code> es lo que separa al dueño del catálogo de un curioso con Postman: 403 para lo no-autorizado.</p>
  <div class="aviso">🔐 Tu capa de entrega con seguridad checklist: rate limit en /login ✓ bcrypt con cost 12 ✓ JWT con expiración ✓ query parametrizada ✓ helmet() (5 líneas y activa headerss HLS/CSP del módulo HTTP) ✓ HTTPS forzado ✓ backups (micro-off) ✓.</div>`,
  ejercicios:[
    'Instalar bcrypt y hashear 3 contraseñas de prueba: verificar que 2 iguales producen hashes distintos (¿por qué? teoría salt)',
    'Implementar auth completo: POST /login con bcrypt.compare + jwt.sign + middleware auth para proteger POST /productos (pedidos: solo admin)',
    'Probar desde Postman/curl: con token expirado o inválido → 401; con admin ok → 201; sin token → 401',
    'Instalar helmet en tu API y verificar con curl -I los headers que ahora salen (los mismos del módulo HTTP)',
    'Rate limit: npm i express-rate-limit y limitar /login a 10/min; probar a golpear; leerás 429',
    'Auditoría de secretos: verificar que TODOS tus .env están en .gitignore; si uno alguna vez filtró un token: rotarlo YA',
  ],
  videos:[
    ['Seguridad básica en Node/Express (XSS, inyección, rate limit)', 'https://www.youtube.com/results?search_query=seguridad+express+node+api+espanol'],
    ['JWT explicado: qué es, cómo se usa, cuándo es el problema', 'https://www.youtube.com/results?search_query=jwt+explicado+espanol+autenticacion'],
    ['OAuth 2.1 flujo simplificado (para entender login con Google)', 'https://www.youtube.com/results?search_query=oauth+explicado+espanol'],
  ],
  quiz:[
    { p:'¿Por qué hashear con bcrypt y no encriptar o guardar texto plano?', ops:['Hash más rápido','El hash es irreversible: robar la DB no revela contraseñas; encriptar es reversible con la clave','Porque la ley colombiana lo exige'], r:1 },
    { p:'El JWT contiene { id: 1, rol: "admin" }. ¿Pueden leerlo terceros?', ops:['No, va cifrado','Sí, el payload es legible; lo seguro es que nadie lo pueda FALSIFICAR sin tu JWT_SECRET','Solo con acceso admin del server'], r:1 },
    { p:'En tu API, ¿dónde extendas la autenticación y dónde la autorización?', ops:['Ambas en el mismo middleware, siempre','Auth (401: eres quién?) verifica el token; autorización (403: qué puedes hacer?) verifica el rol/ruta','Auth en el front, autorización en la DB'], r:1 },
  ],
},

{
  id:'oseo', titulo:'Módulo 18 · SEO y performance: que te encuentren y que no se vayan',
  teoria:`
  <p>Los dos motores de tu negocio web: <strong>SEO</strong> es que Google te encuentre cuando alguien busca "zapatillas Popayán"; <strong>performance</strong> es que cuando te encuentran, la página cargue antes de que se aburran. Ambas cosas se miden con herramientas y se venden con números, no con opiniones.</p>
  <h4>SEO técnico: lo que está bajo tu control</h4>
  <ol>
    <li><strong>Meta por página:</strong> <code>&lt;title&gt;</code> (≤60 car., con la palabra clave) y <code>&lt;meta name="description"&gt;</code> (≤155 car., que invite al click). Cada página distinta: URLs genéricas ignoran el SEO.</li>
    <li><strong>Una sola idea por URL:</strong> estructura con <code>&lt;h1&gt;</code> único por página, jerarquía <code>h2/h3</code> real (no por tamaño visual), URLs descriptivas (<code>/menu</code> vs <code>/p?id=821</code>).</li>
    <li><strong>Google Search Console</strong> (gratis): tu panel de la verdad — con qué búsquedas te encuentran, en qué posición, páginas con error. Registrar tu dominio es paso 0.</li>
    <li><strong>sitemap.xml + robots.txt</strong>: le dicen al crawler qué indexar. Vercel/Netlify + next-sitemap o plugin generan por vos; el mínimo viable: sitemap manual con tus 5–20 URLs.</li>
    <li><strong>Negocios físicos = Google Business Profile</strong> (gratis): para un restaurante de Popayán vale MÁS que todo el SEO web. Aparecer en Maps/"cerca de mí" es tráfico altísimo de compra. Facilitáselo al cliente y cobralo como servicio.</li>
  </ol>
  <h4>Performance: los Core Web Vitals</h4>
  <table class="tabla">
    <tr><th>Métrica</th><th>Qué mide</th><th>Apuntados</th></tr>
    <tr><td>LCP</td><td>Tiempo de la imagen/texto principal</td><td>&lt; 2.5 s</td></tr>
    <tr><td>INP</td><td>respuesta a la interacción del usuario (clicks)</td><td>&lt; 200 ms</td></tr>
    <tr><td>CLS</td><td>Stability del layout (que nada "salte")</td><td>&lt; 0.1</td></tr>
  </table>
  <h4>Los 4 golpes típicos del 90% de la performance en tu stack</h4>
  <ul>
    <li><strong>Imágenes enormes:</strong> fotos de celulares de 4 MB. Solución: comprimir con Squoosh/TinyPNG + <code>&lt;img loading="lazy"&gt;</code> + width/height fijos (mata CLS). El #1 en webs de negocios.</li>
    <li><strong>JS que sobra:</strong> cada librería suma pesos; auditar el bundle: import dinámico del pesado (modal/calendário) bajo demanda.</li>
    <li><strong>Fuentes remotas sin display=swap</strong>: texto invisible hasta que carga la fuente; con el param <code>display=swap</code> el texto aparece ALTO, y hace el LCP menos doloroso.</li>
    <li><strong>Herramientas: Lighthouse</strong> (en DevTools, F12 → Lighthouse) te da puntaje por categoría y CADA problema con su solución. Corre siempre en modo móvil (tu tráfico). Corrélo ntes de publicar y después de cambios grandes: puntaje &gt; 90 en Performance/SEO/Best Practices es tu factura de calidad..</li>
  </ul>
  <div class="aviso">📊 Venta con número: abre Lighthouse de la web vieja del cliente (30/100) vs tu entrega (92/100) = justifica el precio SÓLO, sin hablar de técnica. En Popayán, que businesses NOTICE este diferencial (y lo muestra en facturas reales de tu servicio) te separa del muchacho que "hace páginas" con plantillas roídas.</div>`,
  ejercicios:[
    'Correr Lighthouse (F12) en tu landing publicada an modo MÓVIL, guardar el puntaje inicial y leer TODAS las sugerencias',
    'Comprimir 5 imágenes reales con Squoosh (de MB a KB) y changear &lt;img&gt; por lazy + width/height; re-correr Lighthouse y anotar la mejora',
    'Agregar title + description + Open Graph (og:image) a tu landing — probar el preview compartiendo el link en WhatsApp (là imagen no aparece: porque falta og:image or relative path)',
    'Crear robots.txt + sitemap.xml manual y verificar en Search Console que Google los leeron (o acompañar el registro de popayanese.shop)',
    'Auditar la fuente: stdin Google Fonts con display=swap; si el texto "parpadea" después del font-display, es el propio swap: aceptable',
    'Crear un perfil de Google Business para el negocio conocido (módulo 4): llenar Complete (fotos, horario, tel) y explicar en UNA línea al dueño por qué lo hiciste',
  ],
  videos:[
    ['SEO para principiantes basado en consolas de Google', 'https://www.youtube.com/results?search_query=seo+principiantes+google+search+console+espanol'],
    ['Core Web Vitals y Lighthouse explicados', 'https://www.youtube.com/results?search_query=lighthouse+core+web+vitals+explicacion+espanol'],
    ['Optimizar imágenes web (Lazy, WebP, compresión)', 'https://www.youtube.com/results?search_query=optimizar+imagenes+web+lighthouse+espanol'],
  ],
  quiz:[
    { p:'El usuario busca "menú restaurante Popayán". ¿Qué elemento del HTML es EL más importante para el ranking de tu landing?', ops:['El color de fondo','El &lt;title&gt; y el &lt;h1&gt; con la palabra clave correcta','La animación del menú'], r:1 },
    { p:'La foto del negocio carga en 4 MB y desplaza todo el layout mientras carga. ¿Qué componentes Core Web Vitals BAJAN?', ops:['Solo LCP','LCP (tardo en aparecer) y CLS (hace invisibilidad; sustentable el layout)','Ninguno: la imagen finalmente carga'], r:1 },
    { p:'Para un restaurante local de Popayán, la herramienta de máxima retorno semanal es:', ops:['Meta Tags avanzados','Google Business Profile (su fiche en Maps)','Un bot de chat'], r:1 },
  ],
},

/* ==================== PISTA 4 · FUNDAMENTOS WEB PROFUNDOS ==================== */

{
  id:'whtml', titulo:'Módulo 19 · HTML que pensaste que sabías: semántica, formularios y a11y',
  teoria:`
  <p>Sabés usar <code>div</code>, <code>h1</code> y <code>a</code>. La diferencia práctica entre HTML adivinado y HTML profesional está en tres capas: <strong>semántica</strong> (Google y lectores de pantalla leen tu estructura), <strong>formularios reales</strong> (donde moran la mayoría de los bugs de UX) y <strong>accesibilidad</strong> (que le abre el mercado de clientes institucionales).</p>
  <h4>Semántica: los elementos que reemplazan al div-genérico</h4>
  <pre><code>&lt;header&gt;   banner de la página (logo, nav)
&lt;nav&gt;      bloque de navegación principal
&lt;main&gt;     el contenido único (solo UNO por página)
&lt;article&gt;  pieza independiente (post, producto, noticia)
&lt;section&gt;  agrupación temática dentro de main
&lt;aside&gt;    contenido lateral/relacionado
&lt;footer&gt;   cierre (contacto, legal)
&lt;div&gt;      solo cuando NINGUNO de los anteriores aplica</code></pre>
  <p><strong>Por qué importa (no es cosmética):</strong> 1) los crawlers usan los landmarks para indexar mejor; 2) los lectores de pantalla navegan por landmarks: un sitio sin <code>main</code> obliga al usuario ciego a "pasar por todo"; 3) tu CSS se vuelve más simple (seleccionás <code>main .tarjeta</code> y no <code>.contenedor-principal-3 .cajita</code>).</p>
  <h4>Formularios: el capítulo que nadie estudia</h4>
  <pre><code>&lt;form action="/pedidos" method="post"&gt;
  &lt;label for="nombre"&gt;Tu nombre&lt;/label&gt;
  &lt;input id="nombre" name="nombre" required
         minlength="2" autocomplete="name"&gt;

  &lt;label for="tel"&gt;WhatsApp&lt;/label&gt;
  &lt;input id="tel" type="tel" name="telefono"
         pattern="57[0-9]{10}" inputmode="numeric"&gt;

  &lt;label for="pedido"&gt;Tu pedido&lt;/label&gt;
  &lt;textarea id="pedido" name="pedido" rows="4"&gt;&lt;/textarea&gt;

  &lt;button type="submit"&gt;Enviar pedido&lt;/button&gt;
&lt;/form&gt;</code></pre>
  <ul>
    <li><strong>label for + id</strong>: no es decoración — es lo que permite hacer click en el texto para enfocar el campo, y lo que lee el lector de pantalla. Un <code>placeholder</code> NO reemplaza al label (desaparece al escribir y es gris: mal contraste).</li>
    <li><strong>Validación nativa gratis:</strong> <code>required</code>, <code>minlength</code>, <code>pattern</code>, <code>type="email|tel|number"</code>. El navegador valida ANTES de enviar: menos JavaScript, mejor UX móvil (teclado correcto con <code>inputmode</code>).</li>
    <li><strong>autocomplete correcto</code> (<code>name</code>, <code>email</code>, <code>street-address</code>): en el celular llena los campos en 1 tap — en el�� mundo físico de popayán-comida, esa fricción decide si pide o no pide.</li>
    <li><strong>input vs button:</strong> dentro de un form, el <code>&lt;button&gt;</code> por defecto es type="submit" (envía el form); para botones que NO envían nada: <code>type="button"</code> explícito (el bug clásico: un botón de "limpiar" que manda el pedido a la mitad).</li>
  </ul>
  <h4>Accesibilidad: los 5 hábitos que cubren el 90%</h4>
  <ol>
    <li>Toda imagen significativa con <code>alt</code> descriptivo; decorativa con <code>alt=""</code> (vacío, correcto) — nunca sin alt.</li>
    <li>Contraste de texto ≥ 4.5:1 (lo revisás con el eyedropper de Lighthouse, gratis).</li>
    <li>Navegable con teclado: <code>Tab</code> recorre botones/links en orden lógico; nada crítico escondido solo en <code>:hover</code> (en táctil no existe).</li>
    <li>El foco visible: no lo borres con <code>outline: none</code> sin reemplazo — es lo único que sabe un usuario de teclado.</li>
    <li>HTML válido (un <code>&lt;h1&gt;</code>, labels cerrados, atributos con valor): el 50% de la a11y es "HTML bien escrito".</li>
  </ol>
  <div class="aviso">🧪 Prueba del mundo real: navegá tu landing con SOLO el teclado (sin mouse). Si no podés llegar al botón de WhatsApp, hay un 15% de tus visitantes (y todos los lectores de pantalla) que tampoco.</div>`,
  ejercicios:[
    'Auditar tu landing: reemplazar divs genéricos por header/main/section/footer reales y verificar que todo siga idéntico visualmente',
    'Armar form de pedidos completo con label-for en TODOS los campos, required, pattern de teléfono colombiano y autocomplete',
    'Navegar tu landing solo con Tab y anotar cada foco invisible o elemento inalcanzable que encuentres',
    'Probar tu form con lector de pantalla (Narrador de Windows: Win+Ctrl+Enter) y anotar qué campos "no dicen" nada',
    'Corregir los 3 errores de HTML que te lance el validador oficial W3C (validator.w3.org) sobre tu landing',
  ],
  videos:[
    ['HTML semántico explicado con ejemplos', 'https://www.youtube.com/results?search_query=html+semantico+header+main+article+espanol'],
    ['Formularios HTML bien hechos (validación nativa)', 'https://www.youtube.com/results?search_query=formularios+html+validacion+explicacion+espanol'],
    ['Accesibilidad web básica en 1 video', 'https://www.youtube.com/results?search_query=accesibilidad+web+basica+espanol'],
  ],
  quiz:[
    { p:'¿Cuántos &lt;main&gt; puede tener una página?', ops:['Uno solo; el resto se divide en section/article','Cada viewport permite uno','Ilimitados'], r:0 },
    { p:'¿Por qué placeholder NO reemplaza al label?', ops:['Porque placeholder solo es estético; label es accesible y no desaparece al escribir','Son equivalentes','Placeholder solo funciona en Chrome'], r:0 },
    { p:'El bug clásico del botón en formularios es:', ops:['Olvidar el CSS','Un botón sin type="button" que envía el form por accidente (submit es el default)','Usar label en vez de placeholder'], r:1 },
  ],
},

{
  id:'wcss', titulo:'Módulo 20 · CSS de verdad: posicionamiento, unidades y las 20 reglas que resuelven todo',
  teoria:`
  <p>Tu base de flex/grid ya sirve. Lo que separa a quien "usa CSS" del que lo <strong>domina</strong> son cuatro cosas: el flujo normal y cómo salirse de él, el stacking de capas, las unidades correctas por caso, y transiciones/animaciones sin matar la performance.</p>
  <h4>1) Position: los 4 modos cuándo usar cada uno</h4>
  <table class="tabla">
    <tr><th>Valor</th><th>Qué hace</th><th>Caso de uso típico</th></tr>
    <tr><td><code>static</code></td><td>El flujo normal (default)</td><td>99% del contenido</td></tr>
    <tr><td><code>relative</code></td><td>Se mueve-relativa a sí mismo (sin sacar del flujo); además crea un <em>contexto</em> para hijos absolutos</td><td>badge sobre la esquina de una tarjeta</td></tr>
    <tr><td><code>absolute</code></td><td>Sale del flujo; se ubica respecto al ancestro <code>position</code> más cercano</td><td>badges, tooltips, montar overlays</td></tr>
    <tr><td><code>fixed</code></td><td>Fijo a la ventana (no scrollea con la página)</td><td>barra de cookies, botón flotante de WhatsApp</td></tr>
    <tr><td><code>sticky</code></td><td>Se pega al scrollear dentro de su contenedor</td><td>header de tabla que queda visible (ya lo usás en tu nav)</td></tr>
  </table>
  <p><strong>El bug n.º 1 del position:</strong> un elemento <code>absolute</code> que "se posiciona a ciegas" — no encontró a su <em>padre relativo</em> y se pegó al viewport. Regla: todo <code>absolute</code> debería tener su contenedor con <code>position: relative</code>.</p>
  <h4>2) Z-index y stacking context (el misterio que a todos les muerde)</h4>
  <p><code>z-index</code> solo funciona entre elementos del <strong>mismo stacking context</strong>. Crean contexto propio: <code>position + z-index ≠ auto</code>, <code>opacity &lt; 1</code>, <code>transform</code>, <code>filter</code>. Por eso tu <code>z-index: 9999</code> "no anda": está atrapado en un contexto menor. Diagnóstico: mientras más abajo en el árbol esté el z-index y más contextos haya entre medio, menos window le alcanza — simplificar es la solución, no aumentar números.</p>
  <h4>3) Unidades: la decisión correcta por caso</h4>
  <ul>
    <li><code>px</code>: bordes, sombras, tamaños que NO deben crecer (iconos fijos).</li>
    <li><code>rem</code>: tipografía y espaciados — respeta el ajuste de fuente del usuario (accesibilidad real). <code>1rem = 16px</code> default.</li>
    <li><code>%</code>: anchos relativos al contenedor.</li>
    <li><code>vw/vh</code>: relación con la ventana (héroe de pantalla completa: <code>min-height: 100svh</code> — <strong>svh</strong>, no vh: en móvil el 100vh miente con la barra del navegador; bug clásico del héroe que se corta).</li>
    <li><code>ch</code>: ancho de "0" — para max-width de párrafos: <code>max-width: 65ch</code> = línea de lectura ideal.</li>
  </ul>
  <h4>4) Transiciones y animaciones que no rompen la fluidez</h4>
  <pre><code>.tarjeta {
  transition: transform .2s ease, box-shadow .2s ease;
}
.tarjeta:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,.12);
}</code></pre>
  <p><strong>Regla de oro de performance:</strong> solo animar <code>transform</code> y <code>opacity</code> (corren en la GPU, 60fps). Animar <code>width/height/top/left</code> recalcula layout en cada frame = jank. Y <code>transition</code> vs <code>animation</code>: transición = entre 2 estados definidos (hover, focus); animación (<code>@keyframes</code>) = secuencia autónoma (loader, entrada modal).</p>
  <h4>5) El arsenal chico que diario salva vidas</h4>
  <pre><code>gap: 16px;                      /* fin de margin-negativo hack en flex/grid */
object-fit: cover;             /* imagen que llena sin deformarse */
place-items: center;           /* centrado total en grid: 2 líneas */
scroll-margin-top: 80px;       /* para anclas: no tapa con header sticky */
min-height: 0;                 /* el fix del flex-item que no scrollea */
user-select: none;             /* para botones/iconos no seleccionables */
:is(h1, h2, h3) { margin-block-start: 0 } /* agrupar selectores limpio */
caret-color: transparent;      /* esconder cursor de texto cuando sobra */</code></pre>
  <div class="aviso">🎯 Tu ejercicio mental mínimo: mirar cualquier UI y nombrar sus 3 capas — qué es flujo, qué es posicionado, qué es stacking. Si las podés nombrar, ya no le temas al "CSS se me mueve solo": nada se mueve solo, todo es una de esas 3.</div>`,
  ejercicios:[
    'Reproducir el bug del absolute huérfano: hijo absolute sin padre relative, ver cómo salta al viewport, y arreglarlo con position:relative — documentar con captura',
    'Crear stacking roto a propósito: tarjeta con transform (contexto nuevo) + z-index alto que aún así queda debajo; entender por qué y destransformar de stack para arreglarlo',
    'Cambiar tu héroe de 100vh a 100svh y probar en un celular real: medir qué cambia con y sin la barra del navegador',
    'Construir el mismo layout 3 veces: con %, con vw y con max-width 65ch en párrafo — anotar cuál escale mejor en 320px y 1440px',
    'Animar tarjeta hover solo con transform/opacity y luego animar height — comparar la fluidez en DevTools Performance (frames verdes vs rojos)',
    'Reemplazar todos tus margin-top/margin-bottom entre items de flex/grid por gap y borra los hacks de margin negativo que had',
  ],
  videos:[
    ['CSS position abs/fixed/sticky explicado con ejemplos', 'https://www.youtube.com/results?search_query=css+position+absolute+fixed+sticky+explicacion'],
    ['Z-index y stacking context, el mejor video', 'https://www.youtube.com/results?search_query=z-index+stacking+context+explicacion'],
    ['Unidades CSS: px, rem, em, vh, svh cuándo usar cada una', 'https://www.youtube.com/results?search_query=unidades+css+rem+em+vh+explicacion'],
    ['Animaciones CSS performantes (transform vs layout)', 'https://www.youtube.com/results?search_query=animaciones+css+performance+transform+espanol'],
  ],
  quiz:[
    { p:'Un absolute "se posiciona mal". La causa más común:', ops:['Falta CSS reset','El ancestro al que debería pegarse no tiene position:relative, así que se ancla al viewport','La página es muy larga'], r:1 },
    { p:'Tu z-index:9999 está debajo de un z-index:5. ¿Por qué?', ops:['CSS a veces falla sin causa','Estás en otro stacking context (padre con transform/opacity/position que lo "encierra")','El navegador los ordena por orden de HTML'], r:1 },
    { p:'Para animaciones fluidas solo se debe animar:', ops:['Todo con mismo tiempo','Transform y opacity (GPU); nunca width/height/top que recalculan layout','Solo colores'], r:1 },
    { p:'El héroe se corta en móvil. El fix típico es:', ops:['110vh con !important','100svh: el 100vh mide sin la barra dinámica del navegador móvil','Quitar el héroe'], r:1 },
  ],
},

/* ==================== PISTA 5 · IA COMO OFICIO Y HERRAMIENTAS ==================== */

{
  id:'pgentle', titulo:'Módulo 21 · Trabajar con IA: el harness, el orquestador y la economía de tokens',
  teoria:`
  <p>Todo lo que venimos haciendo juntos corre sobre <strong>Gentle Shell</strong>: un harness (armazón) para agentes de código construido sobre <strong>Pi</strong>, que organiza el trabajo de la IA con disciplina — no como chat, sino como un taller con reglas. Entenderlo te sirve dos veces: para dirigirme mejor a mí, y para copiar el modelo de trabajo en cualquier otro agente que uses a futuro.</p>
  <h4>Las piezas del taller (vistas desde afuera)</h4>
  <ul>
    <li><strong>El harness (Gentle Shell + Pi):</strong> envuelve al modelo con herramientas reales (leer/escribir archivos, terminal, browser, memoria) y reglas: protege al revisor humano, pide permiso para cosas destructivas, y separa las decisiones del humano de las del agente.</li>
    <li><strong>ODD (Organic Driven Development):</strong> el flujo obligatorio: <em>autorizar → explorar → resolver incertidumbre → clasificar el tamaño → tracking → implementar por tareas → cerrar con verificación</em>. Lo ves cuando te pido permiso antes de borrar, o cuando mido antes de cambiar. Su punto: la IA no "improvisa cambios"; cada cosa entra por un circuito con evidencia.</li>
    <li><strong>El orquestador con prioridades:</strong> el agente principal decide entre trabajar <em>inline</em> (él mismo) o <strong>delegar a subagentes</strong> (sesiones hijas con contexto propio y herramientas acotadas). La regla: <em>delegar lo que infla el contexto sin necesidad; hacer inline lo entendido y acotado</em>. Un explorador mide el disco; un escritor toca solo los archivos autorizados; un verificador revisa distinto de quien escribió. Lo viste en vivo: el explorador que midió tu disco no tenía terminal y lo reportó honesto en vez de inventar datos.</li>
    <li><strong>Memoria persistente (Engram):</strong> el agente guarda decisiones, descubrimientos y resúmenes de sesión; en la próxima sesión los recupera por búsqueda, no por scroll de chat.</li>
  </ul>
  <h4>Economía de tokens: la habilidad que más plata vale por pedido</h4>
  <p>Un token ≈ 4 caracteres. Cada llamada paga el <strong>contexto entrante</strong> (archivos, historial, salidas de comandos que le muestro) y la <strong>salida</strong>. El costo se dispara cuando: se pegan archivos gigantes al chat, corren comandos que imprimen miles de líneas, o se relee lo mismo cada turno. Reglas prácticas:</p>
  <ol>
    <li><strong>Salida acotada:</strong> contar (<code>wc -l</code>), resumir (<code>--stat</code>), ver el final (<code>tail</code>) en vez de volcar el archivo entero. (Por eso mis comandos fueron mutando de <code>du</code> a <code>robocopy</code>: cada versión acotaba mejor lo impreso.)</li>
    <li><strong>Contexto justo:</strong> ruta exacta + qué buscar, no "mirá todo el proyecto". La diferencia entre "analizá el sitio" (~5 archivos leídos) y "leé la función subtotal en utils/precios.ts" (1 lectura) es ~10× de tokens por la misma respuesta.</li>
    <li><strong>Subagentes como filtro:</strong> procesos masivos (escanear una carpeta, releer 30 archivos) corren en la sesión del hijo; al padre vuelve solo el resumen. El contexto del padre es el recurso escaso.</li>
    <li><strong>Compaction:</strong> cuando la conversación crece, el harness la resume y deja los datos duros en memoria/disarchivos. De ahí la regla práctica: <strong>archivos de trabajo en el disco</strong> (como los .md que armamos) y no reglas de negocio "en el chat" — el chat se comprima, el disco no.</li>
  </ol>
  <h4>Cómo dirigir a la IA (el prompting que funciona)</h4>
  <ul>
    <li><strong>Dá el criterio de éxito</strong>, no el camino: "el form debe validar teléfono colombiano (57 + 10 dígitos) y guardar en JSON". "Agregale más código" no mide nada.</li>
    <li><strong>Cita la evidencia:</strong> ruta + línea del error en vez de "no anda". El 80% de las idas y vueltas son el agente buscando lo que vos ya tenías en pantalla.</li>
    <li><strong>Un pedido, un alcance:</strong> "arreglá esto" en vez de "arreglás esto y también mejorá todo". Lote chico = resultado verificable.</li>
    <li><strong>Pedí el trade-off, no solo el código:</strong> "cuáles son las 2 opciones y por cuál arranco" — el valor más caro de la IA es el de arquitecto, y aparece cuando pedís alternativas.</li>
  </ul>
  <div class="aviso">🧭 Bonus de negocio: ya trabajaste dentro de un taller profesional de agentes. Cuando contrates o cooordinés a otros devs (o a otra IA), sabés qué pedirles: scope escrito, commits por unidad, revisión por módulo — el estándar lo viviste desde adentro.</div>`,
  ejercicios:[
    'Inventario de esta conversación: identificar las últimas 3 delegaciones a subagentes y qué devolvió cada una (resumen vs datos crudos) y por qué',
    'Formular un mismo pedido de 3 formas (vago / con criterio de éxito / con evidencia y rutas) y comparar la utilidad de las respuestas que obtengas',
    'Escribir tu propio "ODD doméstico" en el .md de seguimiento: checklist de 5 pasos antes de tocar código (autorizar → explorar → tareas → implementar → verificar)',
    'Experimento de salida acotada: la misma búsqueda con y sin tail/wc; anotar cuánto output se ahorra y si perdiste información real',
    'Escribir tu resumen de sesión propio en .md (Goal, Decisions, Next steps) — es exactamente el formato que Engram usa al cerrar sesión',
  ],
  videos:[
    ['Pi coding agent: qué es un harness de agentes de código', 'https://www.youtube.com/results?search_query=pi+coding+agent+terminal+tutorial'],
    ['Prompt engineering para developers: qué pedir y cómo pedirlo', 'https://www.youtube.com/results?search_query=prompt+engineering+para+programadores+espanol'],
    ['Cómo funcionan los tokens de los LLM (tu facturación)', 'https://www.youtube.com/results?search_query=como+funcionan+los+tokens+llm+explicacion'],
    ['Coding agents y sub-agentes: cómo se organizan', 'https://www.youtube.com/results?search_query=coding+agents+sub+agents+orchestrator+explicacion'],
  ],
  quiz:[
    { p:'¿Cuál es el recurso escaso que el orquestador protege al delegar?', ops:['El disco duro','El contexto del agente padre (tokens): el hijo procesa en volumen y devuelve solo el resumen','La RAM del servidor'], r:1 },
    { p:'La diferencia entre "analizá el sitio" y "leé la función subtotal en utils/precios.ts" es:', ops:['Ninguna: la IA interpreta igual','~10× de tokens y una respuesta muchísimo más útil','Que la segunda no usa IA'], r:1 },
    { p:'Por qué el tracking se marca ANTES del código y no después:', ops:['Por forma ritual','Por evidencia: refleja el estado real y obliga a verificar antes de cerrar cada unidad','Para llenar el todo rápido'], r:1 },
  ],
},

{
  id:'pmcp', titulo:'Módulo 22 · MCP: el USB universal de la IA',
  teoria:`
  <p>Antes de MCP, conectar la IA a una herramienta (base de datos: Notion: GitHub) era una integración custom por cada caso. <strong>MCP (Model Context Protocol)</strong>, abierto y estandarizado por Anthropic en 2024, cambió eso: es un protocolo con el que CUALQUIER herramienta expone sus funciones, y CUALQUIER agente (Claude, Pi, ChatGPT vía plugins, tu propio script) las consume. Su analogía: el USB — un solo conector estándar para todos los periféricos.</p>
  <h4>Anatomía de un server MCP</h4>
  <ul>
    <li><strong>Tools:</strong> acciones que la IA puede ejecutar (crear issue en GitHub, query SQL, enviar mail). El agente las "ve" con su descripción y las invoca como functions.</li>
    <li><strong>Resources:</strong> datos legibles (un archivo, una tabla) que la IA puede consultar.</li>
    <li><strong>Prompts:</strong> plantillas de tareas listas ("generar release notes de esta repo" ).</li>
    <li><strong>Transporte:</strong> stdio (proceso local) o HTTP/SSE (remoto). La seguridad depende de VOS: un MCP con acceso a tu DB tiene exactamente los permisos que vos le diste.</li>
  </ul>
  <h4>Servers MCP que te sirven YA (todos gratis)</h4>
  <table class="tabla">
    <tr><th>Server MCP</th><th>Qué le da a tu agente IA</th></tr>
    <tr><td>Filesystem</td><td>Leer/escribir archivos en carpetas específicas (con límites de carpeta)</td></tr>
    <tr><td>GitHub</td><td>Crear issues, leer PRs, revisar diffs sin salir del chat</td></tr>
    <tr><td>PostgreSQL / SQLite</td><td>Consultar tu DB en lenguaje natural (read-only si lo configuras así)</td></tr>
    <tr><td>Playwright / Puppeteer</td><td>Controlar un browser: probar tu web como usuario real</td></tr>
    <tr><td>Slack / WhatsApp / Gmail</td><td>Notificaciones y comunicación (con cuidado: acciones reales)</td></tr>
    <tr><td>Notion / Google Drive</td><td>Tus docs como contexto consultable</td></tr>
  </table>
  <h4>El valor estratégico para vos</h4>
  <p>MCP es la infra que une tus 3 mundos: <em>tu web</em> (un MCP con Postgres de tu catálogo: "cuántos productos agregué esta semana"), <em>tu negocio</em> (el MCP de WhatsApp para avisarte pedidos), <em>tu capacitación</em> (un MCP que exhume tus .md cuando le preguntás). Y como estándar abierto, no ata a un proveedor: si mañana otra IA supera a la actual, tus servers MCP siguen sirviendo.</p>
  <div class="aviso">⚠️ Regla de seguridad MCP (la aprenderás de primera): la descripcion de cada "tool" es texto de PROMPT que la IA lee — si es ambigua, la IA la usa mal. Y las acciones con efectos reales (borrar, publicar, pagar) deberían pedir SIEMPRE confirmación humana: lo mismo que Gentle Shell me exige a mí.</div>`,
  ejercicios:[
    'Leer la doc oficial de MCP (modelcontextprotocol.io) y listar las 3 primitivas con su función en tus palabras',
    'Instalar un server MCP filesystem en tu agente IA favorito y pedirle que lea la carpeta popayanese/ sin acceso a nada más',
    'Conectar el server MCP de GitHub y pedirle: crear un issue de prueba en un repo propio, cerrarlo después desde el panel',
    'Escribir la configuración JSON de tu propia sesión: un server con /popayanese como única carpeta autorizada (least privilege en acción)',
    'Escenario de riesgo: pensar y escribir (en tu .md) qué pasaría si le das al MCP de correo permisos completos en vez de solo "escribir borradores"',
  ],
  videos:[
    ['MCP explicado: qué es y por qué importa', 'https://www.youtube.com/results?search_query=mcp+model+context+protocol+explicado+espanol'],
    ['Servidores MCP que valen la pena (Filesystem, GitHub, DB)', 'https://www.youtube.com/results?search_query=mcp+servers+mejores+para+developers+espanol'],
    ['Construir tu propio server MCP (código real)', 'https://www.youtube.com/results?search_query=mcp+server+racional+tutorial+type+script+nodejs'],
  ],
  quiz:[
    { p:'MCP se compara con el USB porque:', ops:['Transmite datos por USB-C','Es un protocolo estándar abierto: cualquier herramienta expone y cualquier agente consume, sin integraciones custom','Es hardware'], r:1 },
    { p:'La descripción de una "tool" de MCP importa porque:', ops:['Es cosmética','Es prompt que la IA lee: descripción ambigua = uso incorrecto de la herramienta','Solo la ve el administrador'], r:1 },
    { p:'Least privilege en la configuración de MCP significa:', ops:['Dar el mínimo de permisos/carpetas necesarios para la tarea','Usar el server más chico','Desactivar todo preventivamente'], r:0 },
  ],
},

{
  id:'pssh', titulo:'Módulo 23 · SSH y Linux diario: la terminal que te hace el doble de eficiente',
  teoria:`
  <p>El módulo 4 de infra te enseñó a entrar al VPS. Este profundiza: <strong>las llaves, la config, tmux y los comandos de Linux de todos los días</strong> — lo que separa a "se conecta" de "vive en la terminal".</p>
  <h4>SSH con llaves: el setup profesional de una vez</h4>
  <pre><code># en tu PC (Git Bash lo trae):
ssh-keygen -t ed25519 -C "carli@popayanese"   # genera par público/privado
# privada: ~/.ssh/id_ed25519 (NUNCA se comparte ni se sube a Git)
# pública: ~/.ssh/id_ed25519.pub (la que copias al server)

ssh-copy-id -i ~/.ssh/id_ed25519.pub carlos@TU_IP   # la copia al server
ssh -i ~/.ssh/id_ed25519 carlos@TU_IP               # entra sin contraseña

# ~/.ssh/config — apoda tus servidores:
Host popa
    HostName 198.51.100.7
    User carlos
    IdentityFile ~/.ssh/id_ed25519
# después: simplemente "ssh popa"</code></pre>
  <h4>tmux: las sesiones que sobreviven a la caída</h4>
  <p>Problema real: estás corriendo un deploy de 20 minutos, se va tu internet, y el proceso muere. <strong>tmux</strong> crea sesiones que viven en el server:</p>
  <pre><code>tmux new -s deploy       # crea sesión con nombre
d                       # detach: salir sin matar la sesión (Ctrl+b luego d)
tmux ls                  # listar sesiones
tmux attach -t deploy    # volver a entrar: el deploy sigue vivo
tmux split-window -h    # Ctrl+b % : dividir pantalla</code></pre>
  <h4>Comandos de Linux que se usan TODOS los días (los 15)</h4>
  <pre><code>ls -lah            listar con tamaños y ocultos
cat / less         ver / navegar un archivo
tail -f log.txt    seguir un log en vivo
head -5 / wc -l    primeros N / contar líneas
grep -r "texto" .  buscar dentro de archivos (recursivo)
find . -name "*.conf"   buscar por nombre
chmod +x script.sh    dar permiso de ejecución
chown user:group f   cambiar dueño  (solo con sudo)
systemctl status nginx    estado de un servicio
journalctl -u nginx -f    logs del servicio en vivo
du -sh *             tamaños de carpeta actual
df -h                espacio de discos
ps aux | grep node   procesos de node
kill -9 PID          matar un proceso colgado
cp / mv / rm         copiar / mover / borrar (rm -rf con manual: mirelo dos veces)</code></pre>
  <h4>Permisos y usuarios: la lógica de 3 números</h4>
  <p><code>chmod 644 archivo</code> = <code>rw-r--r--</code>: dueño lee/escribe, grupo lee, todos leen. <code>700</code> para claves privadas (solo vos), <code>755</code> para scripts ejecutables. La regla del server: los archivos de Nginx son de <code>www-data</code>, no de root: con <code>chown</code> abajo, sin <code>chmod 777</code> nunca (777 = "que entre cualquiera" y en server production ya lo sufreis).</p>
  <h4>Personalización: tu terminal como herramienta de trabajo</h4>
  <ul>
    <li><strong>Alias</strong> en <code>~/.bashrc</code>: <code>alias ll='ls -lah'</code>, <code>alias gs='git status'</code>, <code>alias sdev='ssh popa'</code> — tus dedos lo agradecen 100 veces por día.</li>
    <li><strong>Opciones de shell:</strong> <code>set -e</code> en scripts (parar ante el primer error), <code>Ctrl+R</code> para buscar comandos pasados (lo más pedido de la vida).</li>
    <li><strong>Windows: Git Bash</strong> ya te lo da, o WSL para el entorno Linux completo dentro de tu PC — ideal para practicar sin borrar nada de tu Windows.</li>
  </ul>
  <div class="aviso">🧯 Autoprotección del principiante en Linux: <code>sudo rm -rf</code> con la ruta equivocada borra tu server en segundos. Reglas: nunca pegues un comando sin leerlo completo, nunca corras como root lo que puede correr como usuario, y confirma antes de cualquier <code>rm</code> con la ruta COMPLETA impresa (echo) si hay duda.</div>`,
  ejercicios:[
    'Generar tu par ed25519, copiarlo a tu VPS y entrar con "ssh popa" sin contraseña — guardar en .ssh/config',
    'Install tmux, crear sesión deploy, correr un bucle sleep 60 && echo listo, separar (d), re-attach later y confirmar que sobrevive',
    'Los 15 comandos: practica cada uno con su contexto real (tail -f sobre tus logs de nginx, du -sh en tu carpeta de proyectos, ps aux | grep node)',
    'chmod: crear test.sh (700), otro.json (644) y verificar con ls -l que se vean iguales a los estándar server',
    'Alias 5 comandos que uses más en ~/.bashrc e invocarlos',
    'WSL (opcional): instalarlo en Windows y montar un Ubuntu donde practicar sin miedo: si rompes WSL, tu PC ni se entera',
  ],
  videos:[
    ['SSH completo (llaves, config, tmux) en un video', 'https://www.youtube.com/results?search_query=ssh+tutorial+llaves+ed25519+config+espanol'],
    ['Comandos Linux esenciales para devs (práctica diaria)', 'https://www.youtube.com/results?search_query=comandos+linux+esenciales+desarrolladores+espanol'],
    ['tmux explicado en 10 minutos', 'https://www.youtube.com/results?search_query=tmux+tutorial+espanol+explicado'],
  ],
  quiz:[
    { p:'La llave SSH privada (.pem/id_ed25519):', ops:['Se sube al server con scp, queda en el backup','NUNCA sale de tu PC ni va a Git; solo la pública se copia a servers','Se guarda en package.json'], r:1 },
    { p:'¿Para qué es tmux en tu flujo real?', ops:['Comprimir archivos','Sesiones que sobreviven desconexión de red/PC: deploys largos y logs en vivo sin morir','Un firewall del server'], r:1 },
    { p:'chmod 777 en un archivo de producción:', ops:['Es el estándar para producción','Abre lectura/escritura/ejecución a todos; en server es comprometer el sistema','Nada: es solo un número'], r:1 },
  ],
},

{
  id:'pvideo', titulo:'Módulo 24 · IA para video: subtitular, editar y animar (tu canal de venta)',
  teoria:`
  <p>Un video corto de tu trabajo ("así quedó el menú QR del restaurante") vende más que 10 mensajes de texto: te muestra el resultado. La IA convierte el video en algo barato de producir: <strong>vos grabás 2 minutos en el celular; la IA hace el resto</strong>.</p>
  <h4>1) Subtitulado automático (el más fiable hoy)</h4>
  <ul>
    <li><strong>Whisper (OpenAI, gratis/local):</strong> transcribe cualquier audio con calidad altísima, incluso español con acento caleño. Local (app Buzz, whisper.cpp) o API pagada a volumen. Exporta .srt que incrustás en CapCut/DaVinci.</li>
    <li><strong>CapCut (gratis):</strong> botón "auto captions": subtítulo en 1 minuto, estilo (fondo, palabra activa) y 2 3 correcciones manuales. El 80% de tus videos solo necesitan esto.</li>
  </ul>
  <h4>2) Edición asistida: cortar por silencios y por texto</h4>
  <ul>
    <li><strong>Edición por transcript:</strong> CapCut y Descript muestran el texto del video; borrás una palabra y se borra del video. Editar = editar texto: la curva de aprendizaje del videomaker desaparece.</li>
    <li><strong>Corte de silencios y pausas:</strong> un botón. Para videos de 20 min del cliente: 3 min limpios.</li>
    <li><strong>Música segura:</strong> biblioteca de CapCut (gratis) o audio library de studio.youtube.com — cero riesgo de copyright.</li>
  </ul>
  <h4>3) Animación y visuales: los 3 niveles de inversión</h4>
  <ol>
    <li><strong>Gratis:</strong> screen recording con voz en off (OBS Studio gratis): recorrer la web del cliente, QR en acción. El formato rey para mostrar tu trabajo.</li>
    <li><strong>Animación de plantilla:</strong> Canva/CapCut: catálogo con entradas animadas, contadores, transiciones — eso se lo podés cobrar aparte al cliente.</li>
    <li><strong>Generativa (Runway, Pika):</strong> clips por prompt para <em>b-roll</em> (ciudad, manos, naturaleza). No escriben tu contenido: usá para cortinillas/ambiente, nunca para prometer al cliente contenido "a medida".</li>
  </ol>
  <h4>El flujo de tus 2 horas por semana</h4>
  <pre><code>1. OBS: grabás pantalla + voz (10 min): recorreed web de cliente, QR en acción
2. CapCut: auto-captions + corregir + cortar silencios (30 min)
3. Exportar 1080p vertical (9:16: WhatsApp/Instagram/Shorts)
4. Publicar: estado de WhatsApp + grupos locales + Instagram/TikTok (15 min)
5. Guardar en /videos/portafolio: evidencia permanente</code></pre>
  <p><strong>Por qué este flujo y no producción "pro":</strong> un video suelto genera curiosidad; una serie semanal genera confianza — y en Popayán se compra confianza. La IA eliminó la barrera técnica: tu límite es grabar, no editar.</p>
  <div class="aviso">📱 Formato ganador: el antes/después (web vieja del cliente vs tu entrega), 30 seg, subtítulos completos (gran parte ve sin sonido), pie con "popayanese.shop". Plantilla fija + repetición = tu anuncio gratis para siempre.</div>`,
  ejercicios:[
    'Instalar CapCut desktop y probar auto-captions con un audio de tu celular',
    'Con OBS: grabar 90 seg recorriendo tu landing (voz en off), subtitularlo y exportarlo 9:16',
    'Tu primer antes/después: pantallazo de un negocio sin web vs tu landing — subtítulos completos y Your pie "popayanese.shop"',
    'Publicar en 2 grupos de Popayán + tu estado de WhatsAppy anotar respuestas (tu primer dato de marketing real)',
    'Probar Whisper local (Buzz): transcribir tu propio audio y comparar las marcas contra las de CapCut',
    'Armar plantilla de intro y cierre (5 seg) reutilizable: tu firma visual',
  ],
  videos:[
    ['CapCut auto-captions y edición por texto', 'https://www.youtube.com/results?search_query=capcut+captions+auto+subtitulos+tutorial+espanol'],
    ['Whisper local (Buzz app) para transcribir gratis', 'https://www.youtube.com/results?search_query=whisper+transcripcion+gratis+buzz+espanol'],
    ['OBS Studio: grabar pantalla + voz', 'https://www.youtube.com/results?search_query=obs+studio+tutorial+espanol+grabar+pantalla'],
    ['Videos antes/después para vender servicios', 'https://www.youtube.com/results?search_query=como+vender+servicios+con+video+antes+despues'],
  ],
  quiz:[
    { p:'¿Por qué el video subtítulado rinde más en tu mercado?', ops:['Por estética','Gran parte se ve sin sonido y el subtítulo igual entrega el mensaje','Pesa menos al enviar'], r:1 },
    { p:'El flujo real de edición con IA para tu volumen semanal:', ops:['Grabar pantalla+voz, auto-captions, cortar silencios, exportar vertical','Generar todo con Runway','Editor humano por video'], r:0 },
    { p:'IA generativa de video (Runway/Pika) en tus entregas:', ops:['Te reemplaza como creador','Uso como b-roll/cortinillas sin prometer contenido generado como propia creación','No sirve'], r:1 },
  ],
},

{
  id:'pback', nivel:'conv', titulo:'Módulo 25 · Backend a fondo: datos, sesiones, deploy y los patrones que faltan',
  teoria:`
  <p>Express ya te hace APIs. Lo que falta entre "API que anda" y "backend que aguanta un cliente real": persistencia, validación seria, entornos y los patrones de error.</p>
  <h4>1) Persistencia: del array a la DB, el escalón correcto</h4>
  <table class="tabla">
    <tr><th>Escalón</th><th>Cuándo</th><th>En tu stack</th></tr>
    <tr><td>Array/JSON</td><td>prototipo, 1 día</td><td>tu API del módulo 10</td></tr>
    <tr><td><strong>SQLite</strong></td><td>archivo único, 0 config, ideal MVP y clientes chicos</td><td>ruta con <code>better-sqlite3</code></td></tr>
    <tr><td>PostgreSQL</td><td>datos serios, concurrencia, producción estable</td><td>Cuando el cliente pague por ello</td></tr>
    <tr><td>ORM (Prisma)</td><td>consultas tipadas (¡tu TS del móduo 8 checa contra el esquema!)</td><td>Proyectos &gt;1 semana</td></tr>
  </table>
  <pre><code>// SQLite con better-sqlite3 (sincrono y simple para MVP):
import Database from 'better-sqlite3';
const db = new Database('pedidos.db');
db.exec('CREATE TABLE IF NOT EXISTS productos (id INTEGER PRIMARY KEY, nombre TEXT, precio INTEGER)');
const insertar = db.prepare('INSERT INTO productos (nombre, precio) VALUES (?, ?)');   // ¿? = parametrizado (anti-inyección)
insertar.run('Zapato cuero', 120000);</code></pre>
  <h4>2) Validación centralizada con Zod (no if() dispersos)</h4>
  <pre><code>import { z } from 'zod';
const ProductoSchema = z.object({
  nombre: z.string().min(2).max(80),
  precio: z.number().int().positive(),
  stock: z.number().int().nonnegative().optional(),
});

app.post('/productos', (req, res) =&gt; {
  const parseo = ProductoSchema.safeParse(req.body);
  if (!parseo.success) return res.status(400).json(parseo.error.flatten());
  const producto = repoCrear(parseo.data);
  res.status(201).json(producto);
});</code></pre>
  <p><strong>Por qué Zod y no if's:</strong> el esquema es UNA fuente de verdad: valida y (con <code>z.infer</code>) genera el tipo TS — front y back comparten la definición exacta. Es el patrón que las empresas usan para APIs serias y es aprendible en 1 tarde.</p>
  <h4>3) Entornos: dev / prod (y por qué odiás el "funciona en mi máquina")</h4>
  <ul>
    <li><strong>.env desarrollo</strong> (DB demo, debug on, keys de prueba) / <strong>entorno prod</strong> (secretos reales solo en el VPS, logs con nivecc mastery y error).</li>
    <li>El <strong>mismo código, distinta configuración</strong>: 12-factor app. Por eso los secretos jamás van en el código: cambian por entorno, no por versión.</li>
    <li><strong>Migraciones</strong>: cuando la DB cambia de forma (agregar columna), el cambio se guarda como script versionado (<code>001_crear_productos.sql</code>, <code>002_agregar_stock.sql</code>) que corre en orden en cada entorno — database a mano en el server es deuda técnica de alcance peligroso.</li>
  </ul>
  <h4>4) Errores y logs como profesional</h4>
  <pre><code>// el patrón: el middleware de error captura TODO lo que se escapó
app.use((err, req, res, next) =&gt; {
  console.error(err);                        // log completo para ti
  res.status(500).json({ error: 'Error interno' });  // al cliente: solo lo necesario
});
// y en rutas: throw está bien si este middleware existe — no try/catch decorativo en cada handler</code></pre>
  <p><strong>Regla de oro:</strong> al cliente jamás detalles internos (stack, nombres de tabla, versión de Express): es mapa para el atacante. Tu log SIEMPRE con timestamps + nivel — es tu único testigo del desastre cuando el cliente dice "anoche no andaba tu sistema".</p>
  <div class="aviso">🎯 Backend check de nivel pro (tu lista para cotizar bien): validación con Zod ✓ DB con parametrización ✓ migraciones versionadas ✓ middleware de error único ✓ logs con niveles ✓ PM2 ✓ backups ✓ auth del módulo 17 ✓. Con esto cobrás la columna "sistema", no la de "página".</div>`,
  ejercicios:[
    'Migrar tu API del módulo 10 de array en memoria a SQLite con better-sqlite3, sin cambiar las rutas (el front no debe enterarse — esa es el valor del repositorio)',
    'Zod: definir ProductoSchema y reemplazar tus if de validación; probar los 3 errores de entrada (nombre corto, precio negativo, stock texto) y ver las respuestas 400',
    'Usar z.infer para extraer el tipo TS del esquema y quitar la interface duplicada',
    'Crear 2 migraciones (001 crear, 002 agregar stock) con un script que las corra en orden y registre cuáles ya corrieron (tabla migrations con hash)',
    'Quitar todos los try/catch decorativo de tus handlers y dejar 1 middleware de error central; verificar que un throw intencional devuelva 500 limpio al cliente y detalle completo solo al log',
    'Probar un bug real de "funciona en dev pero no en prod": correr tu API con NODE_ENV=production faltante de KV_SECRET y documentar cómo falló — esa experiencia es la que te hace tolerant a futuros',
  ],
  videos:[
    ['SQLite + Node/Express (better-sqlite3) paso a paso', 'https://www.youtube.com/results?search_query=sqlite+better-sqlite3+express+espanol'],
    ['Zod para validar entrada en Node y generar tipos', 'https://www.youtube.com/results?search_query=zod+validacion+typescript+tutorial+espanol'],
    ['Patrón middleware de errores Express + manejo de errores en Node', 'https://www.youtube.com/results?search_query=express+error+handler+middleware+espanol'],
  ],
  quiz:[
    { p:'SQLite vs Postgres para tu primer cliente con catálogo:', ops:['Postgres siempre, es lo serio','SQLite: archivo único, cero config y cero costo; Postgres cuando hay concurrencia/crecimiento real','JSON en localStorage'], r:0 },
    { p:'La ventaja real del Zod sobre ifs dispersos es:', ops:['Es más moderno','Un esquema único valida Y genera el tipo TS compartido entre back y front','No requiere tipado'], r:1 },
    { p:'A un cliente con error 500 nunca le devolvés:', ops:['{"error": "Error interno"}','El stack trace o detalles internos (es el mapa que el atacante extrae)','El código de estado'], r:1 },
  ],
},

{
  id:'ptech', titulo:'Módulo 26 · Estar al día: seguir la tecnología sin ahogarte',
  teoria:`
  <p>El sector cambia cada semana y la mayoría se quema de dos formas: siguiendo TODO (parálisis) o siguiendo NADA (obsolescencia). El truco de los veteranos: <strong>un sistema de captura chico + revisión periódica</strong>, no lectura constante.</p>
  <h4>El sistema de tamaños y ritmo concretos</h4>
  <ol>
    <li><strong>Dosis diaria (5 min):</strong> newsletter técnica en tu idioma vale por 20 tweets. Suscripciones recomendadas: <em>TLDR Newsletter</em> (diario, resumen en inglés fácil), <em>Bytes</em> (JS semanal), y en español: los canales de <em>midu.dev</em> y <em>Grupo de React Hispano</em>. Abís al feed una vez al día en un timebox de 5 min: lo interesante a "leer esta semana" (guardado), lo demás no existe.</li>
    <li><strong>Dosis semanal (30 min):</strong> 1 video largo o 1 artículo de fondo de tu backlog. Spotify/YouTube reproducis mientras haces otra cosa (kombinar con tu trayecto).</li>
    <li><strong>Dosis mensual (1 h):</strong> los anuncios que IMPORTAN para tu stack: el blog de Vercel/Next.js, release notes de Node LTS, Expo changelog. Solo lo de tu stack: el resto no te afecta HOY.</li>
  </ol>
  <h4>Fuentes confiables (curaduría hecha):</h4>
  <ul>
    <li><strong>Cambios mayores con evidencia:</strong> release notes oficiales (nodejs.org, react.dev, tailwindcss.com) SIEMPRE ganan al influencer que informa de segunda mano.</li>
    <li><strong>Lo profesional y estable:</strong> repos de GitHub de tus herramientas (issues + discussions: donde se ve qué le duele a la comunidad HOY).</li>
    <li><strong>Cuando algo “rompe” tu web:</strong> el canary: <a href="https://caniuse.com" target="_blank">caniuse.com</a> (soporte de features del navegador), <a href="https://developer.mozilla.org/es/" target="_blank">MDN</a>, y los changelogs del framework — el diagnóstico de "dejo de funcionar el X" se resuelve en minutos.</li>
    <li><strong>Conocimiento personal:</strong> mantener un .md de tu carpeta nombre "log-actualidad.md" donde cada mes anotas: qué nuevas herramientas probé, qué descarté y por qué — ese documento, a 1 año, es tu ventaja competitiva (nadie más en Popayán tiene uno).</li>
  </ul>
  <h4>El filtro de las 3 preguntas (para cada “nueva revolución”)</h4>
  <ol>
    <li><strong>¿Resuelve un problema que YO tengo hoy?</strong> (si no: archivar a "mirar en 6 meses"; el hype sobrevive solo 3 meses promedio)</li>
    <li><strong>¿Tiene comunidad real</strong> (GitHub stars + releases activos + gente usándola en producción con 12+ meses)? (Las librerías huérfanas son un pasivo disfrazado de activo)</li>
    <li><strong>¿Costo y Picasso/habilidades de aprenderla</strong>: ¿le puedo cobrar clientes en los próximos 30 días? (Si no le saca plata para tu realidad ne NyPu-to-Nọng, es un hobbie que debería y wedding posponer)</li>
  </ol>
  <div class="aviso">📉 El error clásico del novato IA: perseguir cada modelor cada framework y NO cerrar la etapa de monetización. La comunidad techersycle diario hyping cró todo; tu tiraje debe generar su encaje corto (tu primer cliente) para TENER quién evaluar los cambios. Cuantos más advanced te eduques intraducibles enlisted con: el flujo: learning → paid project → evaluar junto a lo que arrxtas.</div>`,
  ejercicios:[
    'Suscribirte HOY a TLDR y una newsletter en español (midu.dev) y crear carpeta de lectura semanal en tu .md',
    'Ir a release notes de Node (nodejs.org) y leer el último LTS: anotar 3 cambios que afectan tu.codigo de la capacitación',
    'Aplicar el filtro de 3 preguntas a una herramienta que te llamó la atención (ej: Svelte, Bun, Astro) y decidir momento: ahora o archivo',
    'Crear tu log-actualidad.md con fecha y hacer tu primera entrada: qué aprendiste estas vacaciones en orden cronológico: ese doc es tu futuro CV de freelance',
    'Listar tus 2 fuentes de newsletter diarias y 1 repo con issues activos de tu stack para revisar cada semana',
  ],
  videos:[
    ['Cómo aprender tecnología sin quemarte (estrategia real)', 'https://www.youtube.com/results?search_query=como+aprender+tecnologia+sin+quemarse+estrategia'],
    ['TLDR newsletter / curaduría de noticias tech', 'https://www.youtube.com/results?search_query=mejores+newsletters+tecnologia+developers+espanol'],
    ['Cómo leer release notes y changelogs (descubri que cambia)', 'https://www.youtube.com/results?search_query=como+leer+changelog+release+notes+tutorial'],
  ],
  quiz:[
    { p:'El sistema que recomendado vs el hábito fallido es:', ops:['Leer TODO todos los días','Dosis chicas: 5 min diario/newsletter, 30 min semanal, 1 h mensual de release notes de TU stack','Solo YouTube random'], r:1 },
    { p:'¿Cuál es la mejor fuente ante un cambio crítico que rompe tu web?', ops:['Influencer viral','Release notes oficial + caniuse.com + issues del repo (primera mano)','Telegram de memes'], r:1 },
    { p:'La pregunta más importante del filtro ante una herramienta nueva:', ops:['¿Es más popular?','¿Resuelve un problema que tengo HOY y puedo monetizar pronto?','¿Tiene un logo lindo?'], r:1 },
  ],
},

{
  id:'ptok', titulo:'Módulo 27 · Optimización de IA: tokens, caché y qué IA gratis usar',
  teoria:`
  <p>Vos ya conociste el <strong>orquestador y la economía de tokens</strong> (módulo 21). Este módulo es la caja de herramientas de <strong>optimización activa</strong> en tres frentes: (1) gastar menos tokens por pedido, (2) entender el prompt cache — la palanca invisible que multiplica — y (3) elegir la IA gratuita correcta para cada tarea.</p>
  <h4>1) Optimizar tokens: las 6 palancas</h4>
  <table class="tabla">
    <tr><th>Palanca</th><th>Hacer esto</th><th>Por qué funciona</th></tr>
    <tr><td>Contexto entrante</td><td>Ruta específica + qué buscar, en vez de "mirá todo el proyecto"</td><td>Se paga entrada + salida: "mirá todo" pega 15 archivos en cada turno</td></tr>
    <tr><td>Salida de comandos</td><td><code>wc -l</code> / <code>--stat</code> / <code>tail</code> en vez de volcar salida entera</td><td>Mil líneas de log entran al contexto y resurgen en cada turno siguiente</td></tr>
    <tr><td>Historia de sesión</td><td><code>/clear</code> entre tareas no relacionadas; <code>/compact</code> en sesiones largas</td><td>El historial viaja COMPLETO en cada mensaje: 40 turnos = el primer turno se envía 40 veces (por eso el cache importa tanto)</td></tr>
    <tr><td>Planificación</td><td>Pedí el plan antes de que toque código; apruébalo; recién ahí ejecuta</td><td>Corregir rumbo después cuesta 10× más que validarlo antes</td></tr>
    <tr><td>Un modelo + sus tools por sesión</td><td>Cambiar de modelo, MCP servers o skills a mitad de tarea invalida el cache</td><td>Cada combinación nueva reconstruye el cache del contexto a precio full</td></tr>
    <tr><td>Formato de salida</td><td>Pedí salida específica (JSON, tabla, "solo el código")</td><td>Menos tokens, más señal: pedí el formato que vas a consumir</td></tr>
  </table>
  <h4>2) Prompt caching: la palanca invisible</h4>
  <p>Si los primeros N tokens del prompt son <strong>idénticos</strong> a los del mensaje anterior, el servidor no los reprocesa: los lee de <strong>cache</strong> — esa porción cuesta hasta 90% menos y responde más rápido. La consecuencia práctica: <strong>orden fijo del prompt</strong> (instrucciones estables primero, lo variable AL FINAL). Meter lo variable en el medio rompe el prefijo y pagás todo otra vez. En agentes (como este taller) el cache es lo que hace viable una sesión de 40 turnos — y cambiar de modelo a mitad invalida el cache completo.</p>
  <h4>3) Qué IA gratis usar, según la tarea</h4>
  <table class="tabla">
    <tr><th>Para</th><th>Primera opción gratis</th><th>Punto fuerte</th></tr>
    <tr><td>Código en tu IDE + agentes</td><td>GitHub Copilot Free (2.000 completions/mes + chat/agentes limitado) — <strong>y Copilot Pro GRATIS con el GitHub Student Developer Pack</strong></td><td>Sos estudiante (Universidad del Cauca): verificá el pack HOY; son decenas de herramientas gratis con tu mail universitario</td></tr>
    <tr><td>Chat diario, archivos, voz, español</td><td>ChatGPT Free (modelo rápido con límites variables) / Gemini Free (Flash + Deep Research limitado + Canvas)</td><td>Los dos: búsqueda web, archivos, voz, memoria. Gemini suma los 15 GB de Drive (vos ya vivís en Google)</td></tr>
    <tr><td>Documentos largos / repos grandes</td><td>Claude Free (Sonnet): hasta ~1M de tokens de contexto según el modelo</td><td>Ventana gigante = tu doc completo + el código entero juntos, sin trocear</td></tr>
    <tr><td>Comparar modelos open-weight</td><td>OpenRouter (free tier), Groq, HuggingChat</td><td>Gratis para probar cómo responde cada modelo ante tu caso real</td></tr>
  </table>
  <p><strong>El workflow barato y fuerte (4 pasos de orquestación multi-IA):</strong></p>
  <ol>
    <li><strong>Decisiones y código serio</strong> → Claude/ChatGPT free (mayor ventana, mejor razonamiento en el free tier que probaste).</li>
    <li><strong>Iteración diaria en tu IDE</strong> → Copilot (Pro gratis con el Student Pack: autocompletado constante sin gastar chat).</li>
    <li><strong>Investigación y comparativas</strong> → Deep Research de Gemini (investigación con fuentes, gratis con límites).</li>
    <li><strong>El prompt bien formulado vale más que el modelo premium:</strong> con criterio de éxito + evidencia + un alcance, hasta el free tier te da respuesta profesional; el premium la acelera.</li>
  </ol>
  <div class="aviso">💡 Tus 2 recursos escasos con IA gratis: <strong>(1) tokens de contexto por pedido</strong> y <strong>(2) límite de uso diario</strong>. El prompt caching ataca (1); elegir la IA correcta por tarea ataca (2). El prompt cache es el multiplicador silencioso y la selección por tarea es la disciplina — las dos cosas juntas hacen que la free tier te alcance la semana entera.</div>`,
  ejercicios:[
    'Activar GitHub Student Developer Pack (education.github.com/pack) con tu carnet universitario y verificar que Copilot Pro quedó gratis',
    'Experimento de cache: misma pregunta a una IA en 1 conversación de 10 turnos vs 10 conversaciones nuevas — estimar el tamaño relativo del contexto enviado en cada caso y documentarlo',
    'Medir tu último prompt real: contar caracteres y estimar tokens (chars ~ 4). Estimar el ahorro de la versión con ruta específica + alcance acotado',
    'Probar el orden fijo: a un chat nuevo, la misma pregunta aplicada con (contexto estable primero / variable al final) vs (variable en el medio) — comparar respuesta y consistencia',
    'Probar la misma tarea en ChatGPT free, Gemini free y Claude free (lo podás hacer en una tarde): anotar en tu .md cuál fue mejor en español, en código y en contexto largo — esa es TU tabla de decisión viva',
    'Experimento de /compact / /clear (si usás un agente): medir qué se pierde (el detalle reciente) y qué se gana (espacio de contexto)',
  ],
  videos:[
    ['Official OpenAI: how to make your AI coding limits last longer', 'https://www.youtube.com/results?search_query=how+to+make+ai+coding+limits+last+longer+openai+codex+tips'],
    ['Prompt caching explicado', 'https://www.youtube.com/results?search_query=prompt+caching+llm+explicado+espanol'],
    ['Comparativa de IAs gratis 2026', 'https://www.youtube.com/results?search_query=mejores+ias+gratuitas+2026+comparativa+espanol'],
    ['GitHub Student Developer Pack: qué trae y cómo pedirlo', 'https://www.youtube.com/results?search_query=github+student+developer+pack+tutorial+espanol'],
  ],
  quiz:[
    { p:'Por qué el prompt cache exige "orden fijo" (estable primero, variable al final):', ops:['Por estética del prompt','La caché solo aplica si el PREFIJO es idéntico al mensaje anterior; lo variable en el medio rompe el prefijo y paga todo otra vez','Los LLM no MessageType'], r:1 },
    { p:'Una sesión de 40 turnos: ¿qué pasa con el costo del primer turno?', ops:['Se paga una sola vez','Se re-envía (y se re-cobra) en cada uno de los 40 turnos sin cache — por eso clear/compact del agent existen','Se borra automáticamente'], r:1 },
    { p:'Cambias de modelo a mitad de una tarea larga. Consecuencia típica:', ops:['Nada: el cache se adapta','El cache se invalida: el próximo pedido reconstruye el contexto completo a precio full','El nuevo modelo recalcula gratis'], r:1 },
    { p:'Como estudiante colombiano, la acción de mayor valor inmediato en esta lista es:', ops:['Suscribirse a un plan Pro de pago','Activar el GitHub Student Developer Pack (Copilot Pro + decenas de herramientas gratis con tu carnet)','Usar solo el chat web'], r:1 },
  ],
},
{
  id:'pwap', titulo:'Módulo 28 · PWA, ORM y el glosario que te hace nativo del ecosistema',
  teoria:`
  <p>Este módulo mata el "idioma alienígena": cada sigla que aparece en ofertas de trabajo y folkas de tu equipo, con su explicación en una frase y su rol en tu stack. + una inmersión completa en <strong>PWA</strong> (la sigla que desde 2016 se creía WAP) y <strong>ORM</strong>.</p>
  <h4>¿Qué es una PWA (Progressive Web App)?</h4>
  <p>Es una web <strong>que se instala en el celular como si fuera app</strong>: ícono en la home, pantalla completa sin barra de navegador, y funciona SIN internet lo que tú decidas (gracias a los service workers). Técnicamente tu web normal + 3 piezas:</p>
  <table class="tabla">
    <tr><th>Pieza</th><th>Qué hace</th><th>Archivo/HTML</th></tr>
    <tr><td>Manifest</td><td>Nombre, ícono, colores y pantalla de inicio</td><td><code>manifest.json</code> vinculado con <code>&lt;link rel="manifest"&gt;</code></td></tr>
    <tr><td>Service Worker</td><td>JP script que intercepta pedidos de red y sirve del cache cuando no hay internet</td><td><code>sw.js</code> registrado desde tu JS</td></tr>
    <tr><td>HTTPS obligatorio</td><td>Requisito del navegador para registrar el SW</td><td>Ya lo tenés con Netlify/Vercel o tu certbot</td></tr>
  </table>
  <pre><code>// manifest.json (mínimo viable)
{
  "name": "Popayanese Menú",
  "short_name": "Menú",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0a0a0c",
  "theme_color": "#ff2d40",
  "icons": [{ "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" }]
}

// sw.js — cache-first de tus estáticos:
const CACHE = 'menu-v1';
self.addEventListener('install', e =&gt; {
  e.waitUntil(caches.open(CACHE).then(c =&gt; c.addAll(['/', '/index.html', '/manifest.json'])));
});
self.addEventListener('fetch', e =&gt; {
  e.respondWith(
    caches.match(e.request).then(hit =&gt; hit || fetch(e.request))
  );
});</code></pre>
  <p><strong>Por qué te sirve en Popayán:</strong> los negocios tienen señal inestable y tus clientes/mobile users abren el menú QR en el sótano del mall sin datos. Una PWA del menú queda instalada y carga igual sin internet + la actualizás con "OTA" del cache nuevo (versión +1 del CACHE). <strong>Es tu diferencial n.º 1 para vender frente al que solo hace "una web".</strong></p>
  <h4>El glosario anti-alienígena (lo que aparece en cada oferta)</h4>
  <table class="tabla">
    <tr><th>Sigla/concepto</th><th>En una frase</th><th>Su lugar en tu mundo</th></tr>
    <tr><td><strong>ORM</strong></td><td>Traduce clases/objetos de tu código a tablas/rows de la DB (y la query a llamadas de JS) — te olvidás de escribir SQL a mano</td><td>Prisma (tu módulo 25) es un ORM: defines el esquema en TS y el genera el SQL seguro y tipado</td></tr>
    <tr><td>API</td><td>Puerta con reglas por la que dos programas hablan</td><td>Tu Express</td></tr>
    <tr><td>REST / GraphQL</td><td>Dos estilos de API: REST = rutas + métodos HTTP; GraphQL = un solo endpoint donde pedís exactamente el dato que querés</td><td>REST en tu Express; GraphQL cuando un cliente pida flexibilidad</td></tr>
    <tr><td>SDK</td><td>Kit de herramientas (librerías + docs) para programar sobre una plataforma</td><td>Expo SDK, Stripe SDK</td></tr>
    <tr><td>CI/CD</td><td>Integración/entrega continua: cada push corre tests y despliega solo</td><td>Netlify/Vercel ya lo hacen con tu GitHub</td></tr>
    <tr><td>SaaS / PaaS / IaaS</td><td>Software / Plataforma / Infraestructura "como servicio"</td><td>Netlify es PaaS; tu VPS es IaaS</td></tr>
    <tr><td>SSR / CSR / SSG</td><td>Se renderiza en server / en el navegador / en build-time (estático)</td><td>Tu landing es SSG; Next.js agrega SSR si el cliente quiere SEO serio</td></tr>
    <tr><td>Webhook</td><td>La otra parte te avisa a vos (al revés de polling)</td><td>Pagos de Wompi/MercadoPago te avisan a tu API</td></tr>
    <tr><td>JSON / YAML / TOML</td><td>Formatos de configuración: JSON es de JS; YAML lo usás en Docker/CI</td><td>package.json, docker-compose.yml</td></tr>
    <tr><td>RATE LIMIT</td><td>Acciones máximas por minuto para frenar abusos</td><td>Tu API del módulo 17</td></tr>
  </table>
  <div class="aviso">🧠 Recordá la regla del glosario: nunca prometas lo que no entendés; si una sigla te pregunta el cliente: "eso te agrego en la segunda versión, hoy te entrego X" — y lo aprendás antes de cotizarla. El ORM/PWA ya los podés ofrecer.</div>`,
  ejercicios:[
    'Publicar tu menú QR como PWA mínima: manifest.json + sw.js + icono 192 y probarlo desde el celular real (abrir en Chrome → "Añadir a pantalla de inicio" — ícono, pantalla completa y modo avión con el menú cacheado)',
    'Re-write el cache del SW: cambiar CACHE a menu-v2 y ver cómo el móvil actualiza el contenido de un solo tirón',
    'Escribir tu glosario.md personal con 10 siglas en tus palabras (API, ORM, CI/CD, SSG, webhook, SDK, TTL, CORS, JWT, PWA): si no lo conocías, lo tenés en el módulo correspondiente',
    'Probar el flujo ORM del Prisma (móduo 25): npm i -D prisma; prisma init; definir un modelo Producto y correr prisma generate + primera query con prisma studio — comparar contra el SQL a mano que ya escribiste',
    'Leer un poste de Twitter/LinkedIn real de oferta de trabajo y subrayar CADA sigla: si alguna no podés explicar en una frase, agregarla a tu glosario.md',
  ],
  videos:[
    ['PWA explicada en 10 minutos (service worker + manifest)', 'https://www.youtube.com/results?search_query=pwa+progressive+web+app+explicacion+espanol'],
    ['Convertir tu web a PWA paso a paso', 'https://www.youtube.com/results?search_query=convertir+web+en+pwa+tutorial+espanol'],
    ['Qué es un ORM y por qué usarlo (Prisma)', 'https://www.youtube.com/results?search_query=que+es+orm+prisma+explicacion+espanol'],
  ],
  quiz:[
    { p:'Una PWA "funciona offline" gracias a:', ops:['La app es descargable desde la tienda','El service worker intercepta pedidos y sirve del cache cuando no hay red','El manifest.json'], r:1 },
    { p:'Un ORM es:', ops:['Un tipo de base de datos','La capa que traduce objetos de tu código a tablas SQL con queries tipadas y seguras','Un framework CSS'], r:1 },
    { p:'El requisito NO negociable para registrar un service worker es:', ops:['Dominio .com','HTTPS (por eso tu certbot/Neverlify ya cumple)','CSS Grid'], r:1 },
  ],
},
{
  id:'pdock', titulo:'Módulo 29 · Docker completísimo: contenedores, imágenes, volúmenes y compose',
  teoria:`
  <p><strong>Docker</strong> resuelve el problema más viejo del software: "en mi máquina anda". Empaqueta tu app con TODO su entorno (runtime, dependencias, configuración) en un <strong>contenedor</strong>: una unidad portable que corre exactamente igual en tu laptop que en tu VPS. Con esto aprendés el idioma del despliegue moderno.</p>
  <h4>Los 4 conceptos bases (mental del juego)</h4>
  <table class="tabla">
    <tr><th>Concepto</th><th>Definición</th><th>Analogía</th></tr>
    <tr><td><strong>Imagen</strong></td><td>Plantilla inmutable de tu app: incluye SO + runtime + código. Se CONSTRUYE desde un Dockerfile</td><td>La receta + ingredientes ya preparados</td></tr>
    <tr><td><strong>Contenedor</strong></td><td>Una instancia corriendo de una imagen. Se CREA desde una imagen; es efímero</td><td>El plato servido (puedes servIDr 10 del mismo lote)</td></tr>
    <tr><td><strong>Registro</strong></td><td>Repositorio de imágenes (Docker Hub, GHCR)</td><td>El supermercado de recetas ya hechas</td></tr>
    <tr><td><strong>Volumen</strong></td><td>Almacenamiento persistente fuera del contenedor: los datos sobreviven cuando el contenedor se destruye</td><td>La heladera fuera del plato</td></tr>
  </table>
  <p><strong>Contenedor ≠ máquina virtual:</strong> la VM virtualiza hardware (SO completo de GBs); el contenedor comparte kernel del host y aísla procesos (MBs). Por eso arrancan en segundos y se apilan decenas en una máquina chica — es el motor de todo el cloud moderno.</p>
  <h4>El Dockerfile: la receta de tu imagen</h4>
  <pre><code># Dockerfile — la receta de tu API Express (módulo 10)
FROM node:22-alpine                # imagen base: Node 22 sobre Alpine (Linux mínimo, ~50MB)

WORKDIR /app                       # carpeta de trabajo dentro del contenedor

COPY package*.json ./              # PRIMERO el manifest de deps (mejor caché de build)
RUN npm ci --omit=dev              # instala SOLO dependencias de producción

COPY . .                           # recién ahora tu código (si cambia, no re-instala deps)

EXPOSE 3000                        # documentación del puerto que tu app escucha

USER node                          # NO correr como root (práctica de seguridad)

CMD ["node", "server.js"]          # comando al arrancar el contenedor</code></pre>
  <h4>Comandos esenciales (los 12 que se usan TODOS los días)</h4>
  <pre><code>docker build -t mi-api .        # construir imagen "mi-api" desde este Dockerfile
docker run -d -p 3000:3000 --name api mi-api   # correr: -d fondo, -p puertoHost:puertoContenedor
docker ps                       # contenedores corriendo (-a: incluye parados)
docker logs -f api              # seguir logs del contenedor "api"
docker exec -it api sh          # entrar a la terminal de adentro del contenedor
docker stop api &amp;&amp; docker rm api    # parar y eliminar
docker images                   # imágenes locales (y cuánto pesan)
docker rmi mi-api               # borrar una imagen
docker pull nginx:alpine        # bajar imagen del registro sin correrla
docker volume ls / prune        # listar/limpiar volúmenes (prune = basura)
docker system df                # cuánto ocupa Docker en disco
docker system prune -a          # limpieza nuclear (¡borra imágenes sin usar!)</code></pre>
  <h4>docker-compose.yml: tu stack completo en un archivo</h4>
  <p>Cuando tu app necesita más piezas (API + base de datos + nginx), defines TODO en un archivo y lo levantas con un solo comando:</p>
  <pre><code># docker-compose.yml — tu stack completo del capstone
services:
  api:
    build: .                     # construye desde el Dockerfile de esta carpeta
    ports: ["3000:3000"]
    environment:
      - NODE_ENV=production
      - DATABASE_URL=file:./prod.db
    volumes:
      - ./data:/app/data        # persiste la DB fuera del contenedor
    restart: unless-stopped
    depends_on:
      - db

  db:
    image: postgres:16-alpine    # qué SÍ: tu DB en contenedor aparte en vez de instalarla en el SO
    environment:
      POSTGRES_PASSWORD: 'ejemplo_desde_env'   # del .env — JAMÁS hardcodeada
    volumes:
      - dbdata:/var/lib/postgresql/data   # el volumen con nombre sobrevive a recreaciones

volumes:
  dbdata:</code></pre>
  <pre><code>docker compose up -d        # levanta TODO el stack
docker compose logs -f api  # logs de un servicio
docker compose down         # baja (los volúmenes con nombre sobreviven)
docker compose up -d --build # reconstruye tras cambiar código</code></pre>
  <h4>Persistencia: las 2 formas de montar datos</h4>
  <ul>
    <li><strong>Bind mount</strong> (<code>./data:/app/data</code>): carpeta real de TU disco dentro del contenedor. Para desarrollo: editás el código y no recompilás nada.</li>
    <li><strong>Volumen nombrado</strong> (<code>dbdata:/var/lib/postgresql/data</code>): Docker administra el almacenamiento en su zona. Para datos de producción (DB): sobreviven recreaciones y backups desde <code>docker volume</code>.</li>
  </ul>
  <h4>El workflow profesional completo (el que los trabajos piden)</h4>
  <ol>
    <li><strong>Escribir Dockerfile + .dockerignore</strong> (excluir node_modules, .env, .git — sin esto la imagen pesa 10x y puede filtrar secretos).</li>
    <li><strong>build → run → logs → exec</strong> (el ciclo de desarrollo local).</li>
    <li><strong>Push a registro</strong>: <code>docker tag mi-api usuario/mi-api:v1</code> + <code>docker push</code> → tu imagen viajable a cualquier VPS del mundo.</li>
    <li><strong>En el VPS:</strong> <code>docker compose pull &amp;&amp; docker compose up -d</code> → despliegue idéntico a local (por eso andaba "en tu máquina").</li>
  </ol>
  <div class="aviso">🐳 Conexión completa con tu capacitación: tu VPS (módulo 4) corre el Docker (módulo 29), que levanta tu Express (módulo 10) + Postgres con el compose, y Nginx (módulo 5) frente a todo — proxy_pass a :3000. Cuando dominés esto, sos exactamente el perfil "full-stack con despliegue" que cobra más en Colombia. Dockerize TU capstone (módulo 13) y tenés el portafolio completo.</div>`,
  ejercicios:[
    'Instalar Docker Desktop en tu PC y verificar: docker --version + docker run hello-world (el "hola mundo" oficial que confirma que tu daemon anda)',
    'Dockerizar tu API del módulo 10: Dockerfile con node:22-alpine + .dockerignore (node_modules, .env) + build + run en :3000 + logs y exec de tu contenedor',
    'docker-compose.yml con tu api + postgres + volumen nombrado: up, logs, down y up --build — verificar que la DB sobrevive al down',
    'Comparar tamaños: docker images con node:22 (Debian) vs node:22-alpine — anotar la diferencia de MB y por qué la alpine es la elección server',
    'Pegando bind mount: correr tu API con -v $(pwd):/app y cambiar un archivo desde VS Code SIN rebuild — ver el nodemon refrescar (con --watch o nodemon en dev)',
    'Simular el despliegue: docker save mi-api &gt; Api.tar + docker load &lt; Api.tar en un "VPS" ficticio (o emprobar push real a Docker Hub con tu cuenta gratis y pull desde otra máquina)',
    'Limpieza responsable: docker system df antes y después de docker system prune (solo imágenes colgadas — NO -a si tenés imágenes en uso)',
  ],
  videos:[
    ['Docker desde cero en español (conceptos + Dockerfile + compose)', 'https://www.youtube.com/results?search_query=docker+curso+desde+cero+espanol+contenedores'],
    ['Dockerfile explicado línea por línea', 'https://www.youtube.com/results?search_query=dockerfile+explicado+espanol+tutorial'],
    ['docker-compose con Node + Postgres (stack real)', 'https://www.youtube.com/results?search_query=docker+compose+node+postgres+tutorial+espanol'],
    ['Docker en el VPS: deploy completo', 'https://www.youtube.com/results?search_query=deploy+docker+vps+tutorial+espanol'],
  ],
  quiz:[
    { p:'La diferencia esencial contenedor vs máquina virtual:', ops:['El contenedor es más lento pero más seguro','El contenedor comparte el kernel del host y aísla procesos (MBs); la VM virtualiza hardware con SO completo (GBs)','Son lo mismo con otro nombre'], r:1 },
    { p:'¿Qué permanece cuando un contenedor se destruye?', ops:['Todo, docker guarda archivos automáticamente','Solo lo que montaste en volumen o bind mount; lo demás era efímero','Las variables de entorno'], r:1 },
    { p:'La regla de oro del Dockerfile (orden de capas) es:', ops:['Copiar TODO primero, instalar después','Copiar package*.json + instalar deps ANTES de copiar tu código (así el cache de build no reinstala en cada cambio de código)','Exponer puertos primero'], r:1 },
    { p:'Para tu producción, la DB se guarda en:', ops:['El disco interno del contenedor','Un volumen nombrado (sobrevive recreaciones del contenedor)','Un USB externo'], r:1 },
  ],
},
{
  id:'pagent', titulo:'Módulo 30 · IA generadora de video: cómo hacer videos con agentes (taller completo)',
  teoria:`
  <p>El módulo 24 te enseñó el flujo manual-capacitado (OBS + CapCut + Whisper). Este módulo es el siguiente nivel: <strong>usar IA y agentes para generar el video casi entero</strong>, con el mapa honesto de qué herramienta para qué pieza — y qué NO conviene prometer.</p>
  <h4>El pipeline completo granular (cada pieza con su herramienta)</h4>
  <table class="tabla">
    <tr><th>Fase</th><th>Herramienta IA (gratis o freemium)</th><th>Rol</th></tr>
    <tr><td>1. Guion</td><td>Cualquier LLM gratuito (ChatGPT, Gemini, Claude)</td><td>Del brief de 3 líneas a guion con hooks (gancho, cuerpo, CTA) — pedile 3 versiones y mezclá</td></tr>
    <tr><td>2. Voz en off</td><td><strong>ElevenLabs</strong> (free: 10 min/mes, voces realistas en español) o <strong>Edge TTS</strong> (100% gratis, ilimitado, voces de Microsoft)</td><td>Narración profesional sin grabar tu voz (skip el miedo a la cámara)</td></tr>
    <tr><td>3. Visual/stock</td><td><strong>Canva</strong> (plantillas animadas) / <strong>Pexels/Pixabay</strong> (stock gratis) + prompts IA de imagen: <strong>Bing Image Creator, Leonardo.ai</strong> (free diario)</td><td>B-roll, fondos, miniaturas; si querés personajes/escenas: Runway/Pika (free con créditos limitados)</td></tr>
    <tr><td>4. Subtítulos y edición</td><td><strong>CapCut</strong> auto-captions + Descript (edición por texto) — o <strong>Clipchamp</strong> de Windows (integrado)</td><td>Lo que ya dominás del módulo 24, ahora con la voz IA encima</td></tr>
    <tr><td>5. Música</td><td><strong>Suno</strong> (free, música con IA que NO suena a loop genérico) o la biblioteca de CapCut</td><td>Fondo sin problemas de copyright</td></tr>
    <tr><td>6. Miniaturas/thumbnails</td><td>Canva + IA de imagen, o <strong>Photoroom</strong> (quitar fondos gratis)</td><td>El 50% del click de un video es la miniatura</td></tr>
  </table>
  <h4>Agentes que arman el video por ti (el modo autopilot)</h4>
  <p><strong>Agentes de video</strong> (run them solo): <strong>InVideo AI</strong> y <strong>Pictory</strong> — les pegás el guion o hasta la URL de tu web del cliente y te generan el video completo con voz, stock, subtítulos y música (free con marca de agua/límite; de pago se quita). Los usás así: <strong>tu parte = guion + criterio; la IA = el ensamblaje mecánico</strong>. En 15 min tenés 3 versiones para elegir.</p>
  <p><strong>Y en tu propio harness (el más potente):</strong> un agente local como el que estás usando puede orquestar todo el pipeline: le pedís "para tu landing popayanese, generá guion de 60 seg para un before/after, exportalo a guion.md, llamá a Edge TTS para el audio, generá el listado de imágenes a pedir al Leonardo, y armame el CapCut por escenas". El agente NO edita el video final, pero produce todos los insumos perfectos para el ensamblado de 10 min. <strong>Tu hora baja de 2 h a 40 min por video.</strong></p>
  <h4>Qué prometer y qué no (el honesto mapap del vendedor)</h4>
  <ul>
    <li>✓ <strong>OK ofrecer:</strong> video promocional para redes del negocio, tour del catálogo con voz, before/after de su web, testimonios editados, anuncios en formato vertical. Con ETA de 1–2 h por video, cobrás $30–80k por pieza.</li>
    <li>✗ <strong>NO prometer:</strong> "videos totalmente con IA estilo Hollywood" (la consistencia de personajes/escenas aún es irregular), "<strong>avatar hablante</strong>" (HeyGen/Synthesia: solo en plan pagado) ni reemplazar producción real si el cliente quiere a su gente real frente a cámara.</li>
    <li>⚖️ <strong>Ética mínima:</strong> si hay voz IA, avisáselo al cliente (a la mayoría le encanta el ahorro; a algunos les molesta); NUNCA voces clonadas de personas reales sin permiso explícito — aca tenés problema legal + reputacional.</li>
  </ul>
  <h4>El stack final de tu negocio (el todo-incluido propuesto)</h4>
  <pre><code>Workflow video semanal (tu paquete "marketing digital local"):

1. Brief de 3 líneas del negocio → LLM gratuito → 3 guiones, elegís 1     (10 min)
2. Edge TTS / ElevenLabs → voz en off                                    (10 min)
3. Pantallazos + Leonardo/Bing IA → visuales                             (15 min)
4. CapCut: ensamblar + auto-captions + música de Suno                    (25 min)
5. Exportar 9:16 + guardar en /portafolio                                (5 min)
                                                          TOTAL: ~1 h por video</code></pre>
  <p>3 videos/semana = tu presencia en redes constantes (más opciones de venta) sin que el video te coma el tiempo de código. <strong>El video IA es tu canal de adquisición constante:</strong> cada clip muestra un negocio atendido con QR + link a la web que vos hiciste.</p>
  <div class="aviso">🎬 Vende PUERTAS, no productos: no vendas "un video" — vendé "presencia digital mensual" (web + QR + video semanal + Google Business): $250–400k/mes por negocio recurrente. La IA hace que puedas SERVIS 10 negocios a la vez saneamente. Ese es el salto de freelancer a operador.</div>`,
  ejercicios:[
    'Eleger tu voz: generar el mismo párrafo en Edge TTS (gratis) y ElevenLabs (free tier) — comparar naturalidad y registrar cuál usás para clientes',
    'Pipeline completo #1: de brief a video final en 1 h (usa el stack del módulo): "pizzería de Popayán estrena menú QR" — guion IA + voz IA + visuales + CapCut + subtítulos',
    'Probar un agente autopilot: en InVideo AI o Pictory free, pegar el guion del ejercicio anterior y comparar resultado vs tu ensamblado manual (tiempo + calidad)',
    'Generar b-roll con IA de imagen: 5 imágenes en Bing Image Creator/Leonardo para tu video — curar las 3 mejores',
    'Música con Suno: generar un loop de fondo de tu marca (pop latino instrumental) y guardarlo como asset reutilizable de tu plantilla',
    'Armar tu plantilla maestra en CapCut: intro/cierre/logo/corrimiento de texto — tu firma visual reutilizable en cada video',
  ],
  videos:[
    ['InVideo AI / Pictory: el video autopilot completo', 'https://www.youtube.com/results?search_query=invideo+ai+pictory+tutorial+espanol+video+automatico'],
    ['ElevenLabs vs edge TTS: voces IA en español', 'https://www.youtube.com/results?search_query=elevenlabs+tts+espanol+voz+ia+tutorial'],
    ['Suno: música con IA gratis', 'https://www.youtube.com/results?search_query=suno+ai+musica+tutorial+espanol'],
    ['Pipeline video con IA de A a Z (creador real)', 'https://www.youtube.com/results?search_query=como+hacer+video+con+ia+pipeline+completo+espanol'],
  ],
  quiz:[
    { p:'En el pipeline IA de video, tu parte irremplazable es:', ops:['Ninguna: los agentes lo hacen todo','El guion y el criterio editorial: la IA ensambla, vos curás lo que sale','La voz en off'], r:1 },
    { p:'Para voz en off sin gastar y sin límites razonables, la elección es:', ops:['Solo ElevenLabs pagado','Edge TTS (100% gratis e ilimitado) o el free tier de ElevenLabs con pinch de calidad','Voz de Android'], r:1 },
    { p:'Lo que NO debés prometer aún a un cliente con IA generativa de video:', ops:['Un before/after con voz en off','Consistencia total de personajes/estilo Hollywood — la generación aún es irregular en eso','Subtítulos automáticos'], r:1 },
    { p:'El salto de negocio que habilita el pipeline IA:', ops:['Grabar nosotros mismos','Servir 10 negocios con paquete mensual (web+QR+video+GB) sin morir de asistencia: de freelancer a operador','Cobrar solo por video avulso'], r:1 },
  ],
},
{
  id:'peng', titulo:'Módulo 31 · Inglés B1→C1: el plan del developer para la fluidez',
  teoria:`
  <p>Estás en <strong>B1-B2</strong>: entendés y te hacés entender, pero la conversación fluida se te atasca al construir el la frase. La buena noticia: <strong>la meta C1 para vos es técnica, no general</strong> — vos ya pensás en software: la mitad del vocabulario y de las situaciones que necesitás son DE TU CAMPO. Este módulo aprovecha eso con 3 motores: input masivo de tu área, output forzado (hablar/escribir) y un sistema de errores.</p>
  <h4>1) El plan 3×30 (90 minutos semanales estructurados)</h4>
  <table class="tabla">
    <tr><th>Motor</th><th>Semanal</th><th>Cómo exactamente</th></tr>
    <tr><td><strong>Input (oído/ojo)</strong></td><td>30 min</td><td>Contenido técnico que YA te interesa (doble ganancia): <em> Fireship</em> (rápido, satírico, jerga real), <em>Theo - t3.gg</em>, <em>The Primeagen</em> o podcasts: <em>Syntax.fm</em>, <em>Lex Fridman</em>. SIN subtítulos en español — subtítulos EN inglés si te ayuda al inicio. El truco: nunca pauses para traducir; captá la idea general y seguís.</td></tr>
    <tr><td><strong>Output (hablado)</strong></td><td>30 min</td><td>Hablar SOLO es la única vía a la fluidez. Fuentes: <strong>IA en modo voz</strong> (ChatGPT/Gemini free: diálogo hablado, te corrige y no te juzga — el practicum perfecto), o <strong>tandem</strong> (app Tandem/HelloTalk: intercambio con nativos que aprenden español), o narración de tu propio código en voz alta ("I'm creating a component that fetches the product list...") — es raro y funciona muchísimo.</td></tr>
    <tr><td><strong>Sistema de errores</strong></td><td>30 min</td><td>Cuaderno (o .md) <code>mistakes.md</code>: cada vez que te trabás o corrigen, anotás la frase bien dicha + por qué. Revisar lees antes de hablar. Es la técnica que separa al que mejora del que se repite: <strong>tus errores son TU plan de estudio más valioso</strong>.</li></td></tr>
  </table>
  <h4>2) Inglés técnico vs inglés de la calle (tu ventaja olvidada)</h4>
  <ul>
    <li><strong>Você YA USA vocabulario técnico C1 sin saberlo:</strong> deploy, commit, branch, async, cache, framework, retry, token de session, edge case... Es vocabulario que ningún curso general enseña, y vos lo adquirís leyendo docs y mirando errores. <strong>Ese patrimonio vale mucho en entrevistas y stand-ups.</strong></li>
    <li><strong>Los textos del trabajo son patrón-fijos:</strong> stand-up ("yesterday I... today I'm... blocked by..."), PR description ("this PR adds/fixes/refactors..."), code review ("looks good, but could you..."), docs ("this function returns... throws... takes..."). Memorizá 20 frases-patrón y cubrís el 80% de tu día laboral.</li>
    <li><strong>La jerga casual de Slack es distinta:</strong> "LGTM" (looks good to me), "brb" (be right back), "FYI", "take it offline" (hablemos aparte), "ship it", "on my plate" (tengo eso asignado), "surface it" (hacelo visible). Guardalo en tu mistakes.md al verlos.</li>
  </ul>
  <h4>3) El salto B2→C1: lo que se tiene que cambiar en tu cabeza</h4>
  <ol>
    <li><strong>De traducir → a pensar:</strong> el cuello de botella de B1-B2 es traducir mentalmente de español. La cura no es "estudiar más": es <strong>volumen de habla sin tiempo para traducir</strong> (la IA con voz es perfecta: te fuerza velocidad). Cuando pensás en inglés sin darte cuenta, ya llegaste.</li>
    <li><strong>De perfección → a comunicación:</strong> el hispanohablante se traba por miedo al error. Cambiale el objetivo: <strong>que entiendan tu idea corre más rápido que hablar perfecto</strong>. Los nativos YA tienen paciencia con no nativos — les molesta la duda, no el error.</li>
    <li><strong>Phrasal verbs y conectores:</strong> la diferencia visible entre B2 y C1 es cómo conectás ideas: <em>whereas, therefore, even though, in terms of, as opposed to, roughly speaking</em> — 15 conectores bien usados te hacen sonar C1 inmediatamente.</li>
  </ol>
  <h4>4) Cobrar en inglés: tu caso práctico (dólares desde Popayán)</h4>
  <p>Cuando tu inglés llegue a conversacional (6–12 meses con este plan), se abre el mercado internacional: <strong>Upwork/Fiverr, clientes en USD, tarifas 3–5× a las locales</strong>. Ahí el inglés específico importa:</p>
  <ul>
    <li><strong>Propuesta (proposal):</strong> "Hi [name], I saw your project about [X]. I recently built something similar: [link EN VIVO]. I could have a working version for you within [N days] at $[Y]. Happy to jump on a quick call if helpful." — corta, muestra trabajo, da next step.</li>
    <li><strong>Call de discovery:</strong> 15 min: "Tell me about the project" / "What does success look like for you?" / "What's your timeline and budget range?" — vos preguntás más de lo que hablás (y quedás bien).</li>
    <li><strong>Negociando:</strong> "My rate for this scope is $X. If you need monthly maintenance, that's $Y/month." — los clientes internacionales esperan precio claro; no pidas perdón por cobrar.</li>
  </ul>
  <div class="aviso">🎯 La meta intermedia que se puede medir: <strong>1 llamada de 15 min con un extranjero sobre tu trabajo</strong> dentro de 60 días (puede ser un chat de Upwork con voz, un tandem o práctica con IA con voz). Cuando esa llamada fluye sin que transcibas mentalmente, estás en C1 funcional — y pasás a cobrar en dólares...</div>`,
  ejercicios:[
    'Armar tu mistakes.md hoy: la carpeta /ingles dentro de tu proyecto con el formato (frase mal | frase correcta | regla)',
    'Elegir TU canal de input técnico y consumir 30 min esta semana SIN subtítulos en español (Fireship es la puerta de entrada recomendada: corto, denso, divertido)',
    'IA con voz: 15 min con el modo voz de ChatGPT/Gemini pidiendo que te corrija ("You are my English tutor. Correct my mistakes after each answer, level B2") — registrar los errores en mistakes.md',
    'Narrar tu código: durante tu próxima sesión de programación, explicá en voz alta lo que hacés en inglés (10 min) — la vergüenza inicial vale la pasada',
    'Memorizar tus 20 frases-patrón profesionales (stand-up, PR, review, propuestas) — escribir Одta de cada tipo desde cero SIN copiar',
    'Escribir tu proposal de Upwork en inglés para un proyecto real de la categoría que dominás (QR menu, landing) — guardarla en tu carpeta /ingles para cuando actives esa ruta',
  ],
  videos:[
    ['Fireship: dev content rápido con inglés real de la industria', 'https://www.youtube.com/results?search_query=fireship+latest+videos'],
    ['Cómo pasar de B2 a C1 (técnicas reales, no motivación)', 'https://www.youtube.com/results?search_query=how+to+go+from+b2+to+c1+english'],
    ['English for developers: stand-up, code review y meetings', 'https://www.youtube.com/results?search_query=english+for+programmers+meetings+code+review'],
    ['Upwork proposals que ganan (en inglés)', 'https://www.youtube.com/results?search_query=upwork+proposal+tips+win+jobs'],
  ],
  quiz:[
    { p:'El cuello de botella principal del nivel B1-B2 es:', ops:['Falta de vocabulario','Traducir mentalmente desde el español; la cura es volumen de habla forzada','La gramática'], r:1 },
    { p:'El uso más rentable de tus 30 min de output semanal:', ops:['Ejercicios de gramática','Hablar: IA con voz, tandem o narrar tu código — solo produciendo sale la fluidez','Ver series'], r:1 },
    { p:'Tu vocabulario técnico (deploy, cache, edge case...) es:', ops:['Un obstálogo: mezcla idiomas','Un patrimonio C1 que ningún curso general enseña — úsalo con orgullo','Solo jerga informal'], r:1 },
    { p:'La meta intermedia medible en 60 días:', ops:['Terminar un curso de gramática','1 llamada de 15 min sobre tu trabajo que fluya sin traducción mental','Leer un libro completo'], r:1 },
  ],
},

];

