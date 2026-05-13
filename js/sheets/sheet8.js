window.sheet8 = {
  id: 'sheet8',
  label: 'Hoja 8: Sistema Cardiovascular',
  studies: [
    { id:'s8-pef', label:'Prueba de Esfuerzo con Electrocardiograma', fields:[
      {id:'s8-pef-fecha',label:'Fecha',type:'date'},
      {id:'s8-pef-mets',label:'METs alcanzados',type:'text',ph:'Ej. 8.5'},
      {id:'s8-pef-fc-max',label:'FC máxima',type:'text',ph:'lpm'},
      {id:'s8-pef-ta',label:'TA máxima',type:'text',ph:'mmHg'},
      {id:'s8-pef-resultado',label:'Resultado',type:'select',opts:['Normal','Anormal','No concluyente']},
      {id:'s8-pef-obs',label:'Observaciones',type:'textarea',ph:'Hallazgos...'}
    ]},
    { id:'s8-ecg', label:'Solo Electrocardiograma', fields:[
      {id:'s8-ecg-fecha',label:'Fecha',type:'date'},
      {id:'s8-ecg-ritmo',label:'Ritmo',type:'select',opts:['Sinusal normal','Taquicardia sinusal','Bradicardia sinusal','Fibrilación auricular','Otro']},
      {id:'s8-ecg-resultado',label:'Resultado',type:'select',opts:['Normal','Anormal','Limítrofe']},
      {id:'s8-ecg-obs',label:'Descripción',type:'textarea',ph:'Hallazgos del ECG...'}
    ]},
    { id:'s8-eco', label:'Ecocardiograma Doppler', fields:[
      {id:'s8-eco-fecha',label:'Fecha',type:'date'},
      {id:'s8-eco-fevi',label:'FEVI (%)',type:'text',ph:'Ej. 60'},
      {id:'s8-eco-resultado',label:'Resultado',type:'select',opts:['Normal','Anormal','Limítrofe']},
      {id:'s8-eco-obs',label:'Descripción',type:'textarea',ph:'Hallazgos ecocardiográficos...'}
    ]},
    { id:'s8-pcr', label:'Proteína C Reactiva Ultrasensible', fields:[
      {id:'s8-pcr-fecha',label:'Fecha',type:'date'},
      {id:'s8-pcr-valor',label:'Valor',type:'text',ph:'mg/L'},
      {id:'s8-pcr-resultado',label:'Resultado',type:'select',opts:['Normal (<1 mg/L)','Riesgo intermedio (1-3)','Riesgo alto (>3)']},
      {id:'s8-pcr-obs',label:'Observaciones',type:'textarea',ph:'Notas...'}
    ]}
  ],
  render() {
    return `
    <div class="sheet" id="sheet-8">
      <div class="sheet-header">
        <h1>Sistema Cardiovascular</h1>
        <span class="sheet-number">Hoja 8</span>
      </div>
      <div class="sheet-body">
        ${this.studies.map(s => renderStudyItem(s)).join('')}
      </div>
    </div>`;
  },
  restore() { restoreStudies(this.studies); }
};
