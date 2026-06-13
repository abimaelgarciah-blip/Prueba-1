/* ===== SECCIÓN: EVALUACIÓN DENTAL (portada + contenido) ===== */
window.sheetDentalPortada = {
  id: 'portada-dental',
  label: 'Portada Evaluación Dental',
  type: 'cover',
  render() { return renderCoverPage('cover-dental', 'Portada Evaluación Dental'); },
  restore() {}
};

window.sheetDentalContenido = {
  id: 'contenido-dental',
  label: 'Contenido Evaluación Dental',
  type: 'content',
  membreteKey: 'mb-dental',

  render() {
    const inner = `
      ${h1('EVALUACIÓN DENTAL')}
      ${p(`<strong class="ctt-sub-line">Fecha de evaluación:</strong> ${input('den-fecha','dd/mm/aaaa','sm')}`)}
      ${p('Hallazgos:')}
      ${renderDynamicBlock('den-hallazgos','+ Agregar hallazgo')}
      ${p(`<strong class="ctt-sub-line">Observaciones:</strong> ${textarea('den-obs','...')}`)}
      ${renderAttachment('den-img','Adjuntar imagen del estudio')}
    `;
    return renderContentWrapper(this.membreteKey, this.label, inner);
  },

  restore() {
    const ids = ['den-fecha','den-obs'];
    restoreFields(ids);
    restoreAutoGrow(ids);
    document.querySelectorAll('.ctt-dynamic-body').forEach(autoGrow);
  }
};
