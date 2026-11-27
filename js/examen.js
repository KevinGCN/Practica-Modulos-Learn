/* ============ Examen final: la llave de los convergentes ============
   Reusa EXAM de data/examen.js (22 preguntas, 1 por cada módulo principal;
   aprobás con 19). Guarda el resultado en la misma LS_KEY del monolito. */
(() => {
  const wrap = document.getElementById('wrap-examen');
  const yaVale = Progreso.estadoExamen();
  const principales = MODULOS.filter(m => !Progreso.esConvergente(m));
  const completados = principales.filter(m => Progreso.mod(m.id).completado).length;
  const desbloqueado = yaVale || completados >= principales.length;

  if(!yaVale) Progreso.pintarNav();

  // ----- estado de aprobación -----
  if (yaVale) {
    wrap.innerHTML = `
      <h1 class="pagina">🎓 Examen final — aprobado</h1>
      <div class="examen-hero aprobado">
        <p>✅ Ya aprobaste el examen: los <strong>10 módulos convergentes</strong> están desbloqueados.</p>
        <p><a class="btn" href="modulos.html">Ir a los módulos convergentes</a></p>
      </div>`;
    return;
  }

  // ----- barrado: preciso completar los principales -----
  if (!desbloqueado) {
    wrap.innerHTML = `
      <h1 class="pagina">🎓 Examen final — bloqueado</h1>
      <div class="examen-hero">
        <p>La llave se gana: necesitas <strong>completar los ${principales.length} módulos principales</strong>
        para habilitar el examen. Llevas <strong>${completados}</strong>.</p>
        <p style="margin-top:10px">Completá un módulo desde su página (botón <em>marcar completado</em>) o volvé a intentarlo cuando quieras.</p>
        <p><a class="btn" href="modulos.html">← Ir a los módulos</a></p>
      </div>`;
    return;
  }

  // ----- examen habilitado -----
  wrap.innerHTML = `
    <h1 class="pagina">🎓 Examen final</h1>
    <p class="intro">22 preguntas, una por cada módulo principal. Aprobás con <strong>19 correctas</strong>.</p>
    <div id="preguntas-examen">
      ${EXAM.map((q, i) => `
        <div class="pregunta" data-i="${i}">
          <span class="num">${q.de}</span><br>${q.p}
          ${q.ops.map((op, oi) => `
            <label class="opcion">
              <input type="radio" name="e${i}" value="${oi}">
              <span>${op}</span>
            </label>`).join('')}
        </div>`).join('')}
      <p style="margin-top:16px"><button class="btn" id="btn-calificar">Calificar respuestas</button></p>
    </div>`;

  document.getElementById('btn-calificar').addEventListener('click', () => {
    const boxes = wrap.querySelectorAll('.pregunta[data-i]');
    let correctas = 0;
    boxes.forEach(caj => {
      const i = +caj.dataset.i;
      const elegido = caj.querySelector('input:checked');
      caj.classList.remove('pregunta-bien', 'pregunta-mal');
      if (!elegido) { caj.classList.add('pregunta-mal'); return; }
      if (+elegido.value === EXAM[i].r) { caj.classList.add('pregunta-bien'); correctas++; }
      else caj.classList.add('pregunta-mal');
    });
    const aprueba = correctas >= 19;
    Progreso.setAprobado(aprueba);
    alert(`${correctas}/22 — ${aprueba ? 'APROBADO: los módulos convergentes ya están desbloqueados 🎉' : 'Aún no: te faltan ' + (19 - correctas) + '. Podés volver a intentarlo.'}`);
    // q se re-renderiza: pintarNav ya se actualizó
    location.reload();
  });
})();
