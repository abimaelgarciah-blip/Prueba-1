window.sheet19 = {
  id: 'contenido-oftalmologia',
  label: 'Contenido Oftalmología',
  type: 'content',
  membreteKey: 'mb-19',

  render() {
    const inner = `
      ${h1('OFTALMOLOGÍA')}
      ${p(`<strong class="ctt-sub-line">Fecha:</strong> ${input('c19-fecha','dd/mm/aaaa','sm')}`)}
      ${p(`<strong class="ctt-sub-line">Agudeza Visual OD:</strong> ${input('c19-avOD','20/20','sm')}`)}
      ${p(`<strong class="ctt-sub-line">Agudeza Visual OI:</strong> ${input('c19-avOI','20/20','sm')}`)}
      ${p(`<strong class="ctt-sub-line">Presión Intraocular OD:</strong> ${input('c19-pioOD','____','sm')} mmHg`)}
      ${p(`<strong class="ctt-sub-line">Presión Intraocular OI:</strong> ${input('c19-pioOI','____','sm')} mmHg`)}
      ${p(`<strong class="ctt-sub-line">Fondo de Ojo:</strong> ${textarea('c19-fondo','...')}`)}
      ${p(`<strong class="ctt-sub-line">Segmento Anterior:</strong> ${textarea('c19-segAnt','...')}`)}
      ${p(`<strong class="ctt-sub-line">Resultado:</strong> ${textarea('c19-resultado','Resumen del resultado...')}`)}
      ${p(`<strong class="ctt-sub-line">Recomendaciones:</strong> ${textarea('c19-reco','...')}`)}
      ${renderAttachment('c19-img','Adjuntar imagen del reporte')}
    `;
    return renderContentWrapper(this.membreteKey, this.label, inner);
  },

  restore() {
    const ids = ['c19-fecha','c19-avOD','c19-avOI','c19-pioOD','c19-pioOI',
      'c19-fondo','c19-segAnt','c19-resultado','c19-reco'];
    restoreFields(ids);
    restoreAutoGrow(ids);
  }
};
