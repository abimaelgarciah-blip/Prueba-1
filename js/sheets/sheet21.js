window.sheet21 = {
  id: 'contenido-laboratorio',
  label: 'Contenido Laboratorio',
  type: 'content',
  membreteKey: 'mb-21',

  render() {
    const inner = `
      ${h1('LABORATORIO')}
      ${p(`<strong class="ctt-sub-line">Fecha de toma:</strong> ${input('c21-fecha','dd/mm/aaaa','sm')}`)}
      ${p(`<strong class="ctt-sub-line">Laboratorio:</strong> ${input('c21-lab','nombre del laboratorio')}`)}
      ${p('Resultados de laboratorio:')}
      ${renderDynamicBlock('c21-resultados','+ Agregar resultado de laboratorio')}
      ${p(`<strong class="ctt-sub-line">Observaciones:</strong> ${textarea('c21-obs','...')}`)}
      ${renderAttachment('c21-img','Adjuntar imagen del reporte')}
    `;
    return renderContentWrapper(this.membreteKey, this.label, inner);
  },

  restore() {
    const ids = ['c21-fecha','c21-lab','c21-obs'];
    restoreFields(ids);
    restoreAutoGrow(ids);
    document.querySelectorAll('.ctt-dynamic-body').forEach(autoGrow);
  }
};
