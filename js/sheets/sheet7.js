window.sheet7 = {
  id: 'sheet7',
  label: 'Hoja 7: Sistema Respiratorio',
  studies: [
    { id:'s7-sintomas', label:'Síntomas Respiratorios', fields:[
      {id:'s7-disnea',label:'Disnea',type:'select',opts:['No','Leve','Moderada','Severa']},
      {id:'s7-tos',label:'Tos',type:'select',opts:['No','Seca','Productiva','Crónica']},
      {id:'s7-sibil',label:'Sibilancias',type:'select',opts:['No','Ocasionales','Frecuentes']},
      {id:'s7-sint-obs',label:'Observaciones',type:'textarea',ph:'Detalles de síntomas...'}
    ]},
    { id:'s7-rx', label:'Rx de Tórax', fields:[
      {id:'s7-rx-fecha',label:'Fecha',type:'date'},
      {id:'s7-rx-resultado',label:'Resultado',type:'select',opts:['Normal','Anormal','Limítrofe']},
      {id:'s7-rx-desc',label:'Descripción',type:'textarea',ph:'Hallazgos radiológicos...'}
    ]},
    { id:'s7-espiro', label:'Espirometría', fields:[
      {id:'s7-espiro-fecha',label:'Fecha',type:'date'},
      {id:'s7-fvc',label:'CVF (FVC)',type:'text',ph:'% predicho'},
      {id:'s7-fev1',label:'VEF1 (FEV1)',type:'text',ph:'% predicho'},
      {id:'s7-fev1fvc',label:'VEF1/CVF',type:'text',ph:'ratio'},
      {id:'s7-espiro-res',label:'Resultado',type:'select',opts:['Normal','Obstructivo','Restrictivo','Mixto']},
      {id:'s7-espiro-obs',label:'Observaciones',type:'textarea',ph:'Notas...'}
    ]}
  ],
  render() {
    return `
    <div class="sheet" id="sheet-7">
      <div class="sheet-header">
        <h1>Sistema Respiratorio</h1>
        <span class="sheet-number">Hoja 7</span>
      </div>
      <div class="sheet-body">
        ${this.studies.map(s => renderStudyItem(s)).join('')}
      </div>
    </div>`;
  },
  restore() { restoreStudies(this.studies); }
};
