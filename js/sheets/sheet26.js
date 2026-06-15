window.sheet26 = {
  id: 'contenido-dental',
  label: 'Contenido Evaluación Dental',
  type: 'content',
  section: 'dental',
  membreteKey: 'mb-26',
  pdfKey: 'pdf-26',

  render() {
    const formato = `
      ${p(`<strong class="ctt-sub-line">Fecha:</strong> ${input('c26-fecha','dd/mm/aaaa','sm')}`)}
      ${p(`<strong class="ctt-sub-line">Higiene bucal:</strong> ${select('c26-higiene',['Buena','Regular','Deficiente'])}`)}
      ${p(`<strong class="ctt-sub-line">Caries detectadas:</strong> ${input('c26-caries','____','sm')}`)}
      ${p(`<strong class="ctt-sub-line">Estado periodontal:</strong> ${select('c26-perio',['Sano','Gingivitis','Periodontitis leve','Periodontitis moderada','Periodontitis severa'])}`)}
      ${p(`<strong class="ctt-sub-line">Piezas ausentes:</strong> ${input('c26-ausentes','____','sm')}`)}
      ${p(`<strong class="ctt-sub-line">Hallazgos:</strong> ${textarea('c26-hallazgos','Hallazgos del examen dental...')}`)}
      ${p(`<strong class="ctt-sub-line">Tratamiento sugerido:</strong> ${textarea('c26-tratamiento','...')}`)}
      ${p(`<strong class="ctt-sub-line">Recomendaciones:</strong> ${textarea('c26-reco','...')}`)}
      ${renderAttachment('c26-img','Adjuntar imagen del reporte / radiografía', this.pdfKey)}
    `;
    const inner = `
      ${h1('EVALUACIÓN DENTAL')}
      ${renderSectionOmit(this.section, 'Evaluación Dental')}
      ${renderPdfReplace(this.pdfKey, formato)}
    `;
    return renderContentWrapper(this.membreteKey, this.label, inner);
  },

  restore() {
    const ids = ['c26-fecha','c26-higiene','c26-caries','c26-perio','c26-ausentes','c26-hallazgos','c26-tratamiento','c26-reco'];
    restoreFields(ids);
    restoreAutoGrow(ids);
  }
};
