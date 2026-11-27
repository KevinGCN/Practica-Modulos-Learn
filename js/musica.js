/* ============ Música: botón circular plegable (S8) ============
   Cargado en todas las páginas. Plegado por defecto: solo un botón circular
   flotante; al presionarlo despliega el bloque, y desde el bloque se vuelve
   a plegar. Desigual al monolito, que era una barra grande fija arriba.      */
(() => {
  const CANCIONES = [
    { t: 'Lo-fi para codear', url: '' },   // sin mp3 por ahora: pista silenciosa marcada
    { t: 'Synthwave', url: '' },
    { t: 'Piano focus', url: '' },
  ];
  const LS_MUS = 'popayanese_musica_v1';

  let abierto = false, suena = false, pista = 0;
  try {
    const g = JSON.parse(localStorage.getItem(LS_MUS) || '{}');
    if (g.abierto === true) abierto = true;
    if (Number.isInteger(g.pista)) pista = g.pista;
  } catch { /* estado por defecto */ }

  document.body.insertAdjacentHTML('beforeend', `
    <button id="musica-boton" aria-label="música de fondo" title="música de fondo">🎵</button>
    <div id="musica-panel" role="dialog" aria-label="dock de música" hidden>
      <h3>🎵 Música de fondo</h3>
      <div id="musica-pistas"></div>
    </div>`);

  const btn   = document.getElementById('musica-boton');
  const panel = document.getElementById('musica-panel');
  const lista = document.getElementById('musica-pistas');

  const persistir = () => localStorage.setItem(LS_MUS, JSON.stringify({ abierto, pista }));

  function pintarPistas() {
    lista.innerHTML = CANCIONES.map((c, i) => `
      <div class="pista ${suena && i === pista ? 'escuchando' : ''}" data-pista="${i}" role="button" tabindex="0">
        <span>${c.t}</span><span>${suena && i === pista ? '▶' : '·'}</span>
      </div>`).join('');
  }

  function plegar()    { abierto = false; panel.hidden = true; persistir(); }
  function desplegar() { abierto = true;  panel.hidden = false; persistir(); }

  btn.addEventListener('click', () => (abierto ? plegar() : desplegar()));
  lista.addEventListener('click', e => {
    const fila = e.target.closest('[data-pista]');
    if (!fila) return;
    const i = +fila.dataset.pista;
    suena = suena && i === pista ? false : true;   // misma pista: pause/play
    pista = i;
    persistir(); pintarPistas();
    // TODO: conectar <audio> real cuando existan los mp3
  });
  lista.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.target.click?.(); }
  });

  if (abierto && window.matchMedia('(min-width: 641px)').matches) desplegar();
  else { panel.hidden = true; }
  pintarPistas();
})();
