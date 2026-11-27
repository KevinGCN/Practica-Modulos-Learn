/* ============ Progreso compartido (localStorage) ============
   Reusa la misma clave del monolito v6 para conservar el avance existente:
   { mods:{ <idModulo>:{ ej:[bool...], quiz:[<indice elegido>...], completado:bool } },
     examenAprobado:bool }                                              */
const LS_KEY = 'popayanese_capacitacion_v6';

const Progreso = (() => {
  let estado;
  try { estado = JSON.parse(localStorage.getItem(LS_KEY)) || {}; } catch { estado = {}; }
  if (!estado.mods || typeof estado.mods !== 'object') estado.mods = {};
  if (estado.examenAprobado === undefined) estado.examenAprobado = false;

  const guardar = () => localStorage.setItem(LS_KEY, JSON.stringify(estado));

  const mod = id => {
    if (!estado.mods[id]) estado.mods[id] = { ej: [], quiz: [], completado: false };
    return estado.mods[id];
  };

  const esConvergente = m => m.nivel === 'conv';
  const desbloqueado  = m => !esConvergente(m) || estado.examenAprobado;
  const bloqueados    = () => MODULOS.filter(esConvergente).length;

  const porcentaje = () => {
    const completados = MODULOS.filter(m => mod(m.id).completado).length;
    return Math.round(completados / MODULOS.length * 100);
  };

  const toggleEjercicio = (id, idx) => {
    const e = mod(id);
    e.ej[idx] = !e.ej[idx];
    guardar();
    return !!e.ej[idx];
  };

  const responderQuiz = (id, qIdx, elegido) => {
    const e = mod(id);
    e.quiz[qIdx] = elegido;
    guardar();
  };

  const toggleCompletado = id => {
    const e = mod(id);
    e.completado = !e.completado;
    guardar();
    return e.completado;
  };

  const estadoExamen = () => estado.examenAprobado;
  const setAprobado = v => { estado.examenAprobado = v; guardar(); };

  /* Barra de progreso en la navbar, presente en todas las páginas */
  const pintarNav = () => {
    const caja = document.querySelector('.nav-progreso');
    if (!caja) return;
    const pct = porcentaje();
    caja.querySelector('.barra > div').style.width = pct + '%';
    caja.querySelector('span').textContent = `${pct}% · ${MODULOS.filter(m => mod(m.id).completado).length}/${MODULOS.length} módulos`;
  };

  /* Inyecta la navbar en <div data-nav-activo="..."></div> */
  const pintarNavbar = activo => {
    const monta = document.querySelector('[data-nav-monta]');
    if (!monta) return;
    monta.innerHTML = `
      <nav class="nav">
        <div class="nav-inner">
          <a class="nav-brand" href="index.html">popayanese</a>
          <div class="nav-links">
            <a href="index.html"    class="${activo === 'inicio'  ? 'activo' : ''}">Inicio</a>
            <a href="modulos.html"  class="${activo === 'modulos' ? 'activo' : ''}">Módulos</a>
            <a href="examen.html"   class="${activo === 'examen'  ? 'activo' : ''}">Examen</a>
          </div>
          <div class="nav-progreso" aria-label="progreso general">
            <div class="barra"><div></div></div><span></span>
          </div>
        </div>
      </nav>`;
    pintarNav();
  };

  return { estado, guardar, mod, esConvergente, desbloqueado, bloqueados,
           porcentaje, toggleEjercicio, responderQuiz, toggleCompletado,
           estadoExamen, setAprobado, pintarNav, pintarNavbar };
})();
