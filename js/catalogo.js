/* ============ Catálogo con filtros por pista ============ */
(() => {
  // Etiqueta la pista de cada módulo según el orden del monolito:
  // m0-m7 dominio · d* desarollo · o* oficio · w* web · p* popayanese (IA y herramientas)
  const pistaDe = id =>
    /^[m0-7]$|^m[0-7]$/.test(id) ? 'dominio' :
    id.startsWith('d') && id !== 'dfull' ? 'desarrollo' :
    id.startsWith('o') ? 'oficio' :
    id.startsWith('w') ? 'web' : 'popayanese';

  const PISTA_NOM = {
    dominio:    '🧭 Dominio, DNS y VPS',
    desarrollo: '⚙️ Fullstack JS',
    oficio:     '🛠️ Oficio de ingeniería',
    web:        '🌐 Web profunda',
    popayanese: '🪐 Hub IA y herramientas',
  };

  MODULOS.forEach(m => { m._pista = pistaDe(m.id); });

  let filtro = 'todos';
  const grid = document.getElementById('grid-modulos');
  const cajaF = document.getElementById('filtros');

  const tarj = m => {
    const e = Progreso.mod(m.id);
    const enCurso = e.ej?.some(Boolean) || e.quiz?.some(v => v !== undefined);
    const est = e.completado ? 'completado' : enCurso ? 'en-curso' : 'pendiente';
    const bloq = !Progreso.desbloqueado(m);
    const cls = ['tarjeta', bloq && 'bloqueada', e.completado && 'completada'].filter(Boolean).join(' ');
    return `<a class="${cls}" href="modulo.html?id=${m.id}" style="text-decoration:none;color:inherit">
      <span class="mini">${PISTA_NOM[m._pista].split(' ')[0]} ${m.nivel === 'conv' ? '· 🔒 convergente' : ''}</span>
      <strong>${m.titulo}</strong>
      ${bloq ? '<span class="estado bloqueado">🔒 requiere examen</span>'
        : `<span class="estado ${est}">${est}</span>`}
    </a>`;
  };

  function pintarFiltros() {
    const contar = pista => MODULOS.filter(m => m._pista === pista).length;
    cajaF.innerHTML = [['todos', 'Todos', MODULOS.length],
      ...Object.keys(PISTA_NOM).map(k => [k, PISTA_NOM[k].replace(/^\S+\s/, ''), contar(k)]),
    ].map(([k, nom, n]) =>
      `<button class="chip ${filtro === k ? 'activo' : ''}" data-f="${k}">${nom}<span class="nro">${n}</span></button>`
    ).join('');
  }

  function pintar() {
    grid.innerHTML = (filtro === 'todos' ? MODULOS : MODULOS.filter(m => m._pista === filtro)).map(tarj).join('');
  }

  cajaF.addEventListener('click', e => {
    const b = e.target.closest('[data-f]');
    if (!b) return;
    filtro = b.dataset.f;
    pintarFiltros(); pintar();
  });

  pintarFiltros(); pintar();
})();
