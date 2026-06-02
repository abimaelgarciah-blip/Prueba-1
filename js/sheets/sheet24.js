window.sheet24 = {
  id: 'contenido-audiometria',
  label: 'Contenido Audiometría',
  type: 'content',
  membreteKey: 'mb-24',

  render() {
    const inner = `
      ${h1('AUDIOMETRÍA')}
      ${p(`<strong class="ctt-sub-line">Fecha:</strong> ${input('c24-fecha','dd/mm/aaaa','sm')}`)}

      ${h2('Oído Derecho (OD)')}
      ${p(`<strong class="ctt-sub-line">500 Hz:</strong> ${input('c24-od-500','','sm')} dB &nbsp;
           <strong class="ctt-sub-line">1,000 Hz:</strong> ${input('c24-od-1k','','sm')} dB &nbsp;
           <strong class="ctt-sub-line">2,000 Hz:</strong> ${input('c24-od-2k','','sm')} dB`)}
      ${p(`<strong class="ctt-sub-line">4,000 Hz:</strong> ${input('c24-od-4k','','sm')} dB &nbsp;
           <strong class="ctt-sub-line">8,000 Hz:</strong> ${input('c24-od-8k','','sm')} dB`)}
      ${p(`<strong class="ctt-sub-line">Clasificación OD:</strong> ${select('c24-od-clasif',[
        'Normal','Hipoacusia leve','Hipoacusia moderada','Hipoacusia severa','Hipoacusia profunda'
      ])}`)}

      ${h2('Oído Izquierdo (OI)')}
      ${p(`<strong class="ctt-sub-line">500 Hz:</strong> ${input('c24-oi-500','','sm')} dB &nbsp;
           <strong class="ctt-sub-line">1,000 Hz:</strong> ${input('c24-oi-1k','','sm')} dB &nbsp;
           <strong class="ctt-sub-line">2,000 Hz:</strong> ${input('c24-oi-2k','','sm')} dB`)}
      ${p(`<strong class="ctt-sub-line">4,000 Hz:</strong> ${input('c24-oi-4k','','sm')} dB &nbsp;
           <strong class="ctt-sub-line">8,000 Hz:</strong> ${input('c24-oi-8k','','sm')} dB`)}
      ${p(`<strong class="ctt-sub-line">Clasificación OI:</strong> ${select('c24-oi-clasif',[
        'Normal','Hipoacusia leve','Hipoacusia moderada','Hipoacusia severa','Hipoacusia profunda'
      ])}`)}

      ${h2('Conclusión')}
      ${p(`<strong class="ctt-sub-line">Resultado:</strong> ${textarea('c24-resultado','Resumen del resultado...')}`)}
      ${p(`<strong class="ctt-sub-line">Recomendaciones:</strong> ${textarea('c24-reco','...')}`)}
      ${renderAttachment('c24-img','Adjuntar audiograma / reporte')}
    `;
    return renderContentWrapper(this.membreteKey, this.label, inner);
  },

  restore() {
    const ids = [
      'c24-fecha',
      'c24-od-500','c24-od-1k','c24-od-2k','c24-od-4k','c24-od-8k','c24-od-clasif',
      'c24-oi-500','c24-oi-1k','c24-oi-2k','c24-oi-4k','c24-oi-8k','c24-oi-clasif',
      'c24-resultado','c24-reco'
    ];
    restoreFields(ids);
    restoreAutoGrow(ids);
    ids.filter(id => id.endsWith('-clasif')).forEach(id => updateStatusStyle(id));
  }
};
