window.sheet15 = {
  id: 'contenido-espirometria',
  label: 'Contenido Espirometría',
  type: 'content',
  membreteKey: 'mb-15',

  render() {
    const inner = `
      ${h1('ESPIROMETRÍA')}
      ${p(`<strong class="ctt-sub-line">Fecha:</strong> ${input('c15-fecha','dd/mm/aaaa','sm')}`)}
      ${p(`<strong class="ctt-sub-line">CVF (FVC):</strong> ${input('c15-fvc','____','sm')} % predicho`)}
      ${p(`<strong class="ctt-sub-line">VEF1 (FEV1):</strong> ${input('c15-fev1','____','sm')} % predicho`)}
      ${p(`<strong class="ctt-sub-line">VEF1/CVF:</strong> ${input('c15-fev1fvc','____','sm')}`)}
      ${p(`<strong class="ctt-sub-line">Patrón:</strong> ${select('c15-patron',['Normal','Obstructivo','Restrictivo','Mixto'])}`)}
      ${p(`<strong class="ctt-sub-line">Resultado:</strong> ${textarea('c15-resultado','Resumen del resultado...')}`)}
      ${p(`<strong class="ctt-sub-line">Interpretación:</strong> ${textarea('c15-interp','Interpretación clínica...')}`)}
      ${renderAttachment('c15-img','Adjuntar imagen del reporte')}
    `;
    return renderContentWrapper(this.membreteKey, this.label, inner);
  },

  restore() {
    const ids = ['c15-fecha','c15-fvc','c15-fev1','c15-fev1fvc','c15-patron','c15-resultado','c15-interp'];
    restoreFields(ids);
    restoreAutoGrow(ids);
  }
};
