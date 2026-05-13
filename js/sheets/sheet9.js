window.sheet9 = {
  id: 'sheet9',
  label: 'Hoja 9: Sistema Gastrointestinal',
  studies: [
    { id:'s9-sint', label:'Sintomatología GI', fields:[
      {id:'s9-dolor',label:'Dolor abdominal',type:'select',opts:['No','Leve','Moderado','Severo']},
      {id:'s9-nausea',label:'Náuseas / Vómitos',type:'select',opts:['No','Ocasionales','Frecuentes']},
      {id:'s9-deposiciones',label:'Hábito intestinal',type:'select',opts:['Normal','Estreñimiento','Diarrea','Alternante']},
      {id:'s9-sint-obs',label:'Observaciones',type:'textarea',ph:'Detalles...'}
    ]},
    { id:'s9-eco', label:'Eco de Abdomen', fields:[
      {id:'s9-eco-fecha',label:'Fecha',type:'date'},
      {id:'s9-eco-resultado',label:'Resultado',type:'select',opts:['Normal','Anormal','Limítrofe']},
      {id:'s9-eco-obs',label:'Hallazgos',type:'textarea',ph:'Descripción ecográfica...'}
    ]},
    { id:'s9-hepatico', label:'Pruebas de Función Hepática', fields:[
      {id:'s9-ast',label:'AST (TGO)',type:'text',ph:'U/L'},
      {id:'s9-alt',label:'ALT (TGP)',type:'text',ph:'U/L'},
      {id:'s9-fa',label:'Fosfatasa Alcalina',type:'text',ph:'U/L'},
      {id:'s9-ggt',label:'GGT',type:'text',ph:'U/L'},
      {id:'s9-bili',label:'Bilirrubina Total',type:'text',ph:'mg/dL'},
      {id:'s9-prot',label:'Proteínas Totales',type:'text',ph:'g/dL'},
      {id:'s9-alb',label:'Albúmina',type:'text',ph:'g/dL'},
      {id:'s9-hepatico-resultado',label:'Resultado',type:'select',opts:['Normal','Anormal','Limítrofe']},
      {id:'s9-hepatico-obs',label:'Observaciones',type:'textarea',ph:'Notas...'}
    ]},
    { id:'s9-copro', label:'Coprológico', fields:[
      {id:'s9-copro-fecha',label:'Fecha',type:'date'},
      {id:'s9-copro-resultado',label:'Resultado',type:'select',opts:['Normal','Anormal']},
      {id:'s9-copro-obs',label:'Hallazgos',type:'textarea',ph:'Descripción...'}
    ]},
    { id:'s9-copropara', label:'Coproparasitoscópico', fields:[
      {id:'s9-copropara-fecha',label:'Fecha',type:'date'},
      {id:'s9-copropara-resultado',label:'Resultado',type:'select',opts:['Negativo','Positivo']},
      {id:'s9-copropara-parasito',label:'Parásito encontrado',type:'text',ph:'Si aplica'},
      {id:'s9-copropara-obs',label:'Observaciones',type:'textarea',ph:'Notas...'}
    ]},
    { id:'s9-dental', label:'Evaluación Odontológica', fields:[
      {id:'s9-dental-fecha',label:'Fecha',type:'date'},
      {id:'s9-dental-resultado',label:'Resultado',type:'select',opts:['Normal','Con hallazgos','Requiere tratamiento']},
      {id:'s9-dental-obs',label:'Hallazgos',type:'textarea',ph:'Estado dental, caries, enfermedad periodontal...'}
    ]}
  ],
  render() {
    return `
    <div class="sheet" id="sheet-9">
      <div class="sheet-header">
        <h1>Sistema Gastrointestinal</h1>
        <span class="sheet-number">Hoja 9</span>
      </div>
      <div class="sheet-body">
        ${this.studies.map(s => renderStudyItem(s)).join('')}
      </div>
    </div>`;
  },
  restore() { restoreStudies(this.studies); }
};
