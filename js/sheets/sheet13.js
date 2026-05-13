window.sheet13 = {
  id: 'sheet13',
  label: 'Hoja 13: Sistema Musculoesquelético',
  studies: [
    { id:'s13-sint', label:'Sintomatología Musculoesquelética', fields:[
      {id:'s13-dolor',label:'Dolor articular/muscular',type:'select',opts:['No','Leve','Moderado','Severo']},
      {id:'s13-rigidez',label:'Rigidez matutina',type:'select',opts:['No','< 30 min','> 30 min']},
      {id:'s13-movilidad',label:'Limitación de movimiento',type:'select',opts:['No','Leve','Moderada','Severa']},
      {id:'s13-sint-obs',label:'Observaciones',type:'textarea',ph:'Detalles musculoesqueléticos...'}
    ]},
    { id:'s13-rx-col', label:'Rx de Columna Lumbar', fields:[
      {id:'s13-rx-col-fecha',label:'Fecha',type:'date'},
      {id:'s13-rx-col-resultado',label:'Resultado',type:'select',opts:['Normal','Anormal','Limítrofe']},
      {id:'s13-rx-col-obs',label:'Hallazgos',type:'textarea',ph:'Descripción radiológica...'}
    ]},
    { id:'s13-densi', label:'Densitometría Ósea', fields:[
      {id:'s13-densi-fecha',label:'Fecha',type:'date'},
      {id:'s13-densi-lumbar',label:'T-score Lumbar (L1-L4)',type:'text',ph:'Ej. -1.2'},
      {id:'s13-densi-cadera',label:'T-score Cadera total',type:'text',ph:'Ej. -0.8'},
      {id:'s13-densi-resultado',label:'Resultado',type:'select',opts:['Normal','Osteopenia','Osteoporosis']},
      {id:'s13-densi-obs',label:'Observaciones',type:'textarea',ph:'Notas...'}
    ]}
  ],
  render() {
    return `
    <div class="sheet" id="sheet-13">
      <div class="sheet-header">
        <h1>Sistema Musculoesquelético</h1>
        <span class="sheet-number">Hoja 13</span>
      </div>
      <div class="sheet-body">
        ${this.studies.map(s => renderStudyItem(s)).join('')}
      </div>
    </div>`;
  },
  restore() { restoreStudies(this.studies); }
};
