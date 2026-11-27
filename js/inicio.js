/* ============ Inicio: camino sugerido + al máx pistas ============ */
/* Camino: los primeros 4 módulos principales como entrada al contenido. */
(() => {
  const Principales = MODULOS.filter(m => !Progreso.esConvergente(m));
  const tarj = m => {
    const e = Progreso.mod(m.id);
    const est = e.completado ? 'completado' : e.ej?.some(Boolean) || e.quiz?.some(v => v !== undefined) ? 'en-curso' : 'pendiente';
    const cls = ['tarjeta', !Progreso.desbloqueado(m) && 'bloqueada', e.completado && 'completada'].filter(Boolean).join(' ');
    return `<a class="${cls}" href="modulo.html?id=${m.id}" style="text-decoration:none;color:inherit">
      <span class="mini">${m.nivel === 'conv' ? '🔒 convergente' : 'módulo'}</span>
      <strong>${m.titulo}</strong>
      ${m.nivel === 'conv' && !Progreso.desbloqueado(m) ? '<span class="estado bloqueado">🔒 requiere examen</span>'
        : `<span class="estado ${est}">${est}</span>`}
    </a>`;
  };

  document.getElementById('camino-inicio').innerHTML = Principales.slice(0, 4).map(tarj).join('');
  document.getElementById('pistas-inicio').innerHTML = Principales.slice(0, 8).map(tarj).join('');
})();
