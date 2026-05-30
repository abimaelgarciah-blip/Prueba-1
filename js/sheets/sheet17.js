window.sheet17 = {
  id: 'contenido-gabinete',
  label: 'Contenido Estudios de Gabinete',
  type: 'content',
  membreteKey: 'mb-17',

  render() {
    const inner = `
      ${h1('ESTUDIOS DE GABINETE')}
      ${p('Estudios de imagen y de gabinete realizados:')}
      ${renderDynamicBlock('c17-estudios','+ Agregar estudio')}
      ${p('Notas generales:')}
      ${p(textarea('c17-notas','Observaciones generales sobre los estudios de gabinete...'))}
      ${renderAttachment('c17-img','Adjuntar imagen del estudio principal')}
    `;
    return renderContentWrapper(this.membreteKey, this.label, inner);
  },

  restore() {
    restoreFields(['c17-notas']);
    restoreAutoGrow(['c17-notas']);
    document.querySelectorAll('.ctt-dynamic-body').forEach(autoGrow);
  }
};
