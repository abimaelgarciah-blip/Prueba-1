window.sheet26 = {
  id: 'contenido-dental',
  label: 'Contenido Diagnóstico Dental',
  type: 'content',
  membreteKey: 'mb-26',

  render() {
    const inner = `
      ${h1('DIAGNÓSTICO DENTAL')}
      ${p(`<strong class="ctt-sub-line">Fecha:</strong> ${input('c26-fecha','dd/mm/aaaa','sm')}`)}

      ${h2('Condición Periodontal')}
      ${p(`<strong class="ctt-sub-line">Estado periodontal:</strong> ${select('c26-periodontal',[
        'Normal','Gingivitis leve','Gingivitis moderada','Periodontitis leve',
        'Periodontitis moderada','Periodontitis severa'
      ])}`)}
      ${p(`<strong class="ctt-sub-line">Higiene oral:</strong> ${select('c26-higiene',[
        'Buena','Regular','Deficiente'
      ])}`)}

      ${h2('Hallazgos')}
      ${p(`<strong class="ctt-sub-line">Caries presentes:</strong> ${input('c26-caries','piezas afectadas')}`)}
      ${p(`<strong class="ctt-sub-line">Piezas faltantes:</strong> ${input('c26-faltantes','núms. de piezas')}`)}
      ${p(`<strong class="ctt-sub-line">Piezas con restauración:</strong> ${input('c26-restauracion','núms. de piezas')}`)}
      ${p(`<strong class="ctt-sub-line">Otros hallazgos:</strong> ${textarea('c26-otros','...')}`)}

      ${h2('Plan de Tratamiento')}
      ${p(`<strong class="ctt-sub-line">Requiere tratamiento:</strong> ${select('c26-tratamiento',[
        'No requiere','Sí requiere','En proceso'
      ])}`)}
      ${p(`<strong class="ctt-sub-line">Diagnóstico:</strong> ${textarea('c26-diagnostico','Diagnóstico detallado...')}`)}
      ${p(`<strong class="ctt-sub-line">Recomendaciones:</strong> ${textarea('c26-reco','...')}`)}
      ${renderAttachment('c26-img','Adjuntar odontograma / reporte')}
    `;
    return renderContentWrapper(this.membreteKey, this.label, inner);
  },

  restore() {
    const ids = [
      'c26-fecha','c26-periodontal','c26-higiene',
      'c26-caries','c26-faltantes','c26-restauracion','c26-otros',
      'c26-tratamiento','c26-diagnostico','c26-reco'
    ];
    restoreFields(ids);
    restoreAutoGrow(ids);
    ['c26-periodontal','c26-higiene','c26-tratamiento'].forEach(id => updateStatusStyle(id));
  }
};
