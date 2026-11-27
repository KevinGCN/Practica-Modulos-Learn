/* ============ Detalle de módulo: ?id=<id> ============ */
(() => {
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  const m = MODULOS.find(x => x.id === id);
  const wrap = document.getElementById('wrap-modulo');

  if (!m || !Progreso.desbloqueado(m)) {
    wrap.innerHTML = `
      <h1 class="pagina">${m ? '🔒 Módulo convergente' : '🧐 Módulo no encontrado'}</h1>
      <p class="intro">${m
        ? 'Este módulo se abre con el examen final. Aprobalo (19/22) y volvé.'
        : 'Revisá el enlace: no existe ese id de módulo.'}</p>
      <p><a class="btn" href="modulos.html">← Volver al catálogo</a></p>`;
    return;
  }

  const e = Progreso.mod(m.id);
  const completado = e.completado;

  wrap.innerHTML = `
    <div class="mod-cab">
      <h1>${m.titulo}</h1>
      <button class="btn ${completado ? '' : 'sec'}" id="btn-completar">${completado ? '✓ completado' : 'marcar completado'}</button>
    </div>
    <p class="intro">Módulo de la pista ${m.id[0].toUpperCase()} · progreso guardado en tu navegador</p>

    <h2 class="seccion">📖 Teoría</h2>
    <div class="teoria">${m.teoria}</div>

    <h2 class="seccion">✍️ Ejercicios</h2>
    ${m.ejercicios.map((ej, i) => `
      <label class="check ${e.ej?.[i] ? 'done' : ''}">
        <input type="checkbox" data-ej="${i}" ${e.ej?.[i] ? 'checked' : ''}>
        <span>${ej}</span>
      </label>`).join('')}

    <h2 class="seccion">🎬 Videos</h2>
    ${m.videos.map(([t, u]) => `<p>▸ <a href="${u}" target="_blank" rel="noopener">${t}</a></p>`).join('')}

    <h2 class="seccion">🧠 Quiz</h2>
    ${m.quiz.map((q, qi) => `
      <div class="pregunta" data-q="${qi}">
        <span class="num">P${qi + 1}</span> ${q.p}
        ${q.ops.map((op, oi) => `
          <label class="opcion">
            <input type="radio" name="q${qi}" data-q="${qi}" data-oi="${oi}" ${e.quiz?.[qi] === oi ? 'checked' : ''}>
            <span>${op}</span>
          </label>`).join('')}
      </div>`).join('')}

    <p style="margin-top:20px">
      <a class="btn sec" href="modulos.html">← Catálogo</a>
      <a class="btn sec" href="modulo.html?id=${siguienteId(m.id)}">Siguiente módulo →</a>
    </p>`;

  function siguienteId(actual) {
    const i = MODULOS.findIndex(x => x.id === actual);
    const prox = MODULOS[i + 1];
    return prox ? prox.id : actual;  // al final: repetir el actual
  }

  // --- eventos ---
  wrap.addEventListener('change', ev => {
    const t = ev.target;
    if (t.dataset.ej !== undefined) {
      const done = Progreso.toggleEjercicio(m.id, +t.dataset.ej);
      t.closest('.check').classList.toggle('done', done);
    }
    if (t.dataset.q !== undefined) {
      const qi = +t.dataset.q, oi = +t.dataset.oi;
      Progreso.responderQuiz(m.id, qi, oi);
      const q = m.quiz[qi];
      const caja = t.closest('.pregunta');
      caja.classList.remove('pregunta-bien', 'pregunta-mal');
      // la respuesta correcta se revela recién cuando elegís bien o mostrás
      if (oi === q.r) caja.classList.add('pregunta-bien');
    }
  });
  wrap.addEventListener('click', ev => {
    if (ev.target.id !== 'btn-completar') return;
    const v = Progreso.toggleCompletado(m.id);
    ev.target.textContent = v ? '✓ completado' : 'marcar completado';
    ev.target.classList.toggle('sec', !v);
    Progreso.pintarNav();
  });
  Progreso.pintarNav();
})();
