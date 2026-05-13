window.sheet11 = {
  id: 'sheet11',
  label: 'Hoja 11: Sistema Nervioso y Órganos de los Sentidos',
  studies: [
    { id:'s11-sint', label:'Sintomatología Neurológica', fields:[
      {id:'s11-cefalea',label:'Cefalea',type:'select',opts:['No','Ocasional','Frecuente','Crónica']},
      {id:'s11-mareo',label:'Mareo / Vértigo',type:'select',opts:['No','Ocasional','Frecuente']},
      {id:'s11-memoria',label:'Alteraciones de memoria',type:'select',opts:['No','Leve','Moderada']},
      {id:'s11-sint-obs',label:'Observaciones',type:'textarea',ph:'Detalles neurológicos...'}
    ]},
    { id:'s11-oftal', label:'Oftalmología', fields:[
      {id:'s11-oftal-fecha',label:'Fecha',type:'date'},
      {id:'s11-agudeza-od',label:'Agudeza visual OD',type:'text',ph:'Ej. 20/20'},
      {id:'s11-agudeza-oi',label:'Agudeza visual OI',type:'text',ph:'Ej. 20/20'},
      {id:'s11-presion-od',label:'Presión intraocular OD',type:'text',ph:'mmHg'},
      {id:'s11-presion-oi',label:'Presión intraocular OI',type:'text',ph:'mmHg'},
      {id:'s11-oftal-resultado',label:'Resultado',type:'select',opts:['Normal','Anormal','Requiere seguimiento']},
      {id:'s11-oftal-obs',label:'Hallazgos',type:'textarea',ph:'Descripción oftalmológica...'}
    ]},
    { id:'s11-audio', label:'Audiometría', fields:[
      {id:'s11-audio-fecha',label:'Fecha',type:'date'},
      {id:'s11-audio-od',label:'Oído Derecho',type:'select',opts:['Normal','Hipoacusia leve','Hipoacusia moderada','Hipoacusia severa','Hipoacusia profunda']},
      {id:'s11-audio-oi',label:'Oído Izquierdo',type:'select',opts:['Normal','Hipoacusia leve','Hipoacusia moderada','Hipoacusia severa','Hipoacusia profunda']},
      {id:'s11-audio-resultado',label:'Resultado',type:'select',opts:['Normal','Anormal','Limítrofe']},
      {id:'s11-audio-obs',label:'Observaciones',type:'textarea',ph:'Notas...'}
    ]}
  ],
  render() {
    return `
    <div class="sheet" id="sheet-11">
      <div class="sheet-header">
        <h1>Sistema Nervioso y Órganos de los Sentidos</h1>
        <span class="sheet-number">Hoja 11</span>
      </div>
      <div class="sheet-body">
        ${this.studies.map(s => renderStudyItem(s)).join('')}
      </div>
    </div>`;
  },
  restore() { restoreStudies(this.studies); }
};
