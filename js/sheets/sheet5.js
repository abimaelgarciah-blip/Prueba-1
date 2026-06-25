window.sheet5 = {
  id: 'contenido-hallazgos',
  label: 'Contenido Hallazgos',
  type: 'content',
  membreteKey: 'mb-5',

  // Antecedentes no patológicos (lista de "refiere ----")
  noPatologicos: [
    { id:'orig',  label:'Originario de' },
    { id:'resid', label:'Residente de' },
    { id:'alc',   label:'Bebidas alcohólicas refiere' },
    { id:'fum',   label:'Fumar refiere' },
    { id:'dep',   label:'Practicar deportes refiere' },
    { id:'vis',   label:'Problemas visuales refiere' },
    { id:'aud',   label:'Problemas auditivos refiere' },
    { id:'trans', label:'Transfusiones refiere' },
    { id:'hosp',  label:'Hospitalizaciones refiere' },
    { id:'cirug', label:'Intervenciones quirúrgicas refiere' },
    { id:'meds',  label:'Medicamentos refiere' },
    { id:'infec', label:'Enfermedades infecciosas refiere' },
    { id:'alerg', label:'Alergias refiere' },
    { id:'fract', label:'Fracturas refiere' },
    { id:'grsang',label:'Grupo sanguíneo refiere' },
    { id:'inmun', label:'Inmunizaciones refiere' }
  ],

  // Examen físico - descripciones fijas editables
  examenFisico: [
    { id:'ef-general', text:'Paciente consciente, cooperador, cuya edad cronológica corresponde con la real. Su apariencia general es normal.' },
    { id:'ef-derma',   text:'Exploración dermatológica: Sin alteraciones.' },
    { id:'ef-craneo',  text:'Cráneo: Es normoencefalo, con cabello bien implantado, no tiene exóstosis, sin otras alteraciones.' },
    { id:'ef-ojos',    text:'Ojos: Con movimientos oculares, reflejos y fondoscopía normal, conjuntivas, escleróticas y párpados normales.' },
    { id:'ef-oidos',   text:'Oídos: Con pabellón auricular normal, el conducto auditivo externo es normal, la membrana timpánica está íntegra, la conducción aérea y ósea normal.' },
    { id:'ef-nariz',   text:'Nariz: Rectilínea, septum central, sin traumatismos presentes, mucosas normales, cornetes sin alteraciones.' },
    { id:'ef-boca',    text:'Boca: Piezas dentales normales, lengua y mucosas normales, faringe sin alteraciones.' },
    { id:'ef-cuello',  text:'Cuello: Es cilíndrico, no presenta adenomegalias, la tiroides palpable normal, movimientos normales, pulsos presentes normales.' },
    { id:'ef-torax',   text:'Tórax: Es normolíneo, con movimientos de amplexión y amplexación normales, los ruidos respiratorios sin fenómenos acústicos agregados, los ruidos cardíacos rítmicos sin frotes, ni soplos.' },
    { id:'ef-abdomen', text:'Abdomen: Es plano, blando, depresible, no es doloroso, no tiene visceromegalias, no presenta masas, peristaltismo presente y área renal sin alteraciones.' },
    { id:'ef-genit',   text:'Genitales: Sin alteraciones.' },
    { id:'ef-rectal',  text:'Examen rectal: No se realizó.' },
    { id:'ef-extsup',  text:'Examen de extremidades superiores: Sin alteraciones.' },
    { id:'ef-extinf',  text:'Examen de extremidades inferiores: Sin alteraciones.' },
    { id:'ef-neuro',   text:'Examen neurológico: Orientación normal en 3 esferas, pares craneales normales, meningeos negativos, vestíbulos cerebelosos negativos, reflejos osteotendinosos normales, marcha normal, no tiene problemas de sensibilidad ni motilidad.' }
  ],

  render() {
    const inner = `
      ${h1('RESUMEN MÉDICO')}

      <!-- RESUMEN MÉDICO -->
      ${renderInfoCard('Datos del paciente',
        p(`${select('c5-sexo',['Masculino','Femenino'])} de ${input('c5-edad','edad','sm')} años de edad.`),
        { accent:'primary' })}

      <!-- ANTECEDENTES HEREDO FAMILIARES -->
      ${renderInfoCard('Antecedentes heredo familiares',
        p(`<strong class="ctt-sub-line">Refiere:</strong> ${textarea('c5-ahf')}`))}

      <!-- ANTECEDENTES NO PATOLÓGICOS -->
      ${renderInfoCard('Antecedentes personales no patológicos',
        renderFieldGrid(this.noPatologicos.map(np =>
          fieldCell(np.label, textarea('c5-np-'+np.id))), 2, 'stacked'))}

      <!-- ANTECEDENTES PATOLÓGICOS -->
      ${renderInfoCard('Antecedentes personales patológicos', `
        ${renderIfSex('M', p(`<strong class="ctt-sub-line">Al interrogatorio de signos y síntomas prostáticos se refiere</strong> ${textarea('c5-pp-prostata')}`))}
        ${renderIfSex('F', p(`Inicia menstruación a los ${input('c5-pp-menarca','','sm')} años, gesta ${input('c5-pp-gesta','','sm')}, para ${input('c5-pp-para','','sm')}, aborto ${input('c5-pp-aborto','','sm')}, cesáreas ${input('c5-pp-cesareas','','sm')}. Meses promedio de lactancia en el primero ${input('c5-pp-lact1','','sm')} meses, en el segundo ${input('c5-pp-lact2','','sm')} meses, en el tercer ${input('c5-pp-lact3','','sm')} meses. FUM ${input('c5-pp-fum','','sm')}`))}
        ${p(`<strong class="ctt-sub-line">Otros antecedentes refiere</strong> ${textarea('c5-pp-otros')}`)}
      `)}

      <!-- EXAMEN FÍSICO -->
      ${h1('EXAMEN FÍSICO')}
      ${renderInfoCard('Signos vitales', renderMetricCards([
        { label:'T.A.',       field:input('c5-ef-ta','','sm'),    unit:'mmHg' },
        { label:'F.C.',       field:input('c5-ef-fc','','sm'),    unit:'lpm'  },
        { label:'Saturación', field:input('c5-ef-sat','','sm'),   unit:'%'    },
        { label:'Peso',       field:input('c5-ef-peso','','sm'),  unit:'kg'   },
        { label:'Talla',      field:input('c5-ef-talla','','sm'), unit:'cm'   },
      ]))}

      ${renderInfoCard('Exploración física por aparatos y sistemas',
        this.examenFisico.map(ef => renderEditableFixed(ef.id, ef.text)).join(''))}
    `;
    return renderContentWrapper(this.membreteKey, this.label, inner);
  },

  restore() {
    // Inputs simples
    const ids = ['c5-sexo','c5-edad','c5-ahf','c5-pp-prostata','c5-pp-menarca',
      'c5-pp-gesta','c5-pp-para','c5-pp-aborto','c5-pp-cesareas','c5-pp-lact1',
      'c5-pp-lact2','c5-pp-lact3','c5-pp-fum','c5-pp-otros',
      'c5-ef-ta','c5-ef-fc','c5-ef-sat','c5-ef-peso','c5-ef-talla'];
    this.noPatologicos.forEach(np => ids.push('c5-np-'+np.id));
    this.examenFisico.forEach(ef => ids.push(ef.id));
    restoreFields(ids);
    restoreAutoGrow(ids);

    // Sincronizar texto fijo desde state
    this.examenFisico.forEach(ef => syncFixedText(ef.id));

    // Listener para mostrar/ocultar campos por sexo
    const sexEl = document.getElementById('c5-sexo');
    if (sexEl) sexEl.addEventListener('change', refreshSexConditionals);
    refreshSexConditionals();
  }
};
