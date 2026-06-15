window.sheet17 = {
  id: 'contenido-gabinete',
  label: 'Contenido Estudios de Gabinete',
  type: 'content',
  section: 'gabinete',
  membreteKey: 'mb-17',
  pdfKey: 'pdf-17',

  render() {
    const formato = `
      ${p('Estudios de imagen y de gabinete realizados:')}
      ${renderDynamicBlock('c17-estudios','+ Agregar estudio')}
      ${p('Notas generales:')}
      ${p(textarea('c17-notas','Observaciones generales sobre los estudios de gabinete...'))}
      ${renderAttachment('c17-img','Adjuntar imagen del estudio principal')}
    `;
    const inner = `
      ${h1('ESTUDIOS DE GABINETE')}
      ${renderSectionOmit(this.section, 'Estudios de Gabinete')}
      ${renderPdfReplace(this.pdfKey, formato)}
    `;
    return renderContentWrapper(this.membreteKey, this.label, inner);
  },

  restore() {
    restoreFields(['c17-notas']);
    restoreAutoGrow(['c17-notas']);
    document.querySelectorAll('.ctt-dynamic-body').forEach(autoGrow);
  }
};
