window.sheet24 = {
  id: 'contenido-audiometria',
  label: 'Contenido Audiometría',
  type: 'content',
  section: 'audiometria',
  membreteKey: 'mb-24',
  pdfKey: 'pdf-24',

  render() {
    const formato = `
      ${p(`<strong class="ctt-sub-line">Fecha:</strong> ${input('c24-fecha','dd/mm/aaaa','sm')}`)}
      ${p(`<strong class="ctt-sub-line">Oído Derecho (umbral promedio):</strong> ${input('c24-od','____','sm')} dB`)}
      ${p(`<strong class="ctt-sub-line">Oído Izquierdo (umbral promedio):</strong> ${input('c24-oi','____','sm')} dB`)}
      ${p(`<strong class="ctt-sub-line">Tipo de hipoacusia:</strong> ${select('c24-tipo',['Audición normal','Conductiva','Neurosensorial','Mixta'])}`)}
      ${p(`<strong class="ctt-sub-line">Grado:</strong> ${select('c24-grado',['Normal','Leve','Moderada','Severa','Profunda'])}`)}
      ${p(`<strong class="ctt-sub-line">Resultado:</strong> ${textarea('c24-resultado','Resumen del resultado...')}`)}
      ${p(`<strong class="ctt-sub-line">Interpretación:</strong> ${textarea('c24-interp','Interpretación clínica...')}`)}
      ${p(`<strong class="ctt-sub-line">Recomendaciones:</strong> ${textarea('c24-reco','...')}`)}
      ${renderAttachment('c24-img','Adjuntar imagen del audiograma / reporte', this.pdfKey)}
    `;
    const inner = `
      ${h1('AUDIOMETRÍA')}
      ${renderSectionOmit(this.section, 'Audiometría')}
      ${renderPdfReplace(this.pdfKey, formato)}
    `;
    return renderContentWrapper(this.membreteKey, this.label, inner);
  },

  restore() {
    const ids = ['c24-fecha','c24-od','c24-oi','c24-tipo','c24-grado','c24-resultado','c24-interp','c24-reco'];
    restoreFields(ids);
    restoreAutoGrow(ids);
  }
};
