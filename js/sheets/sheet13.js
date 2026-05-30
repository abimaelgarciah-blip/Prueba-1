window.sheet13 = {
  id: 'contenido-esfuerzo',
  label: 'Contenido Prueba Esfuerzo y ECG',
  type: 'content',
  membreteKey: 'mb-13',

  render() {
    const inner = `
      ${h1('PRUEBA DE ESFUERZO Y ELECTROCARDIOGRAMA')}
      ${p('Datos del estudio:')}
      ${p(`<strong class="ctt-sub-line">Fecha:</strong> ${input('c13-fecha','dd/mm/aaaa','sm')}`)}
      ${p(`<strong class="ctt-sub-line">METs alcanzados:</strong> ${input('c13-mets','____','sm')}`)}
      ${p(`<strong class="ctt-sub-line">FC máxima:</strong> ${input('c13-fcmax','____','sm')} lpm`)}
      ${p(`<strong class="ctt-sub-line">TA máxima:</strong> ${input('c13-tamax','____','sm')} mmHg`)}
      ${p(`<strong class="ctt-sub-line">Ritmo:</strong> ${input('c13-ritmo','____')}`)}
      ${p(`<strong class="ctt-sub-line">Resultado:</strong> ${textarea('c13-resultado','Resumen del resultado...')}`)}
      ${p(`<strong class="ctt-sub-line">Interpretación detallada:</strong> ${textarea('c13-interp','Interpretación clínica...')}`)}
      ${renderAttachment('c13-img','Adjuntar imagen del reporte / ECG')}
    `;
    return renderContentWrapper(this.membreteKey, this.label, inner);
  },

  restore() {
    const ids = ['c13-fecha','c13-mets','c13-fcmax','c13-tamax','c13-ritmo','c13-resultado','c13-interp'];
    restoreFields(ids);
    restoreAutoGrow(ids);
  }
};
