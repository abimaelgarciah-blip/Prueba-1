window.sheet7 = {
  id: 'contenido-sistemas',
  label: 'Contenido Sistemas',
  type: 'content',
  membreteKey: 'mb-7',

  render() {
    const inner = `
      <!-- RESPIRATORIO -->
      <div id="block-sis-resp">
        ${h1('SISTEMA RESPIRATORIO')}
        ${renderStudyLine('est-resp-sint', `Síntomas respiratorios ${input('c7-resp-sint','negados al momento')}.`)}
        ${renderStudyLine('est-resp-espiro', `Espirometría ${input('c7-resp-espiro','____')}.`)}
        ${renderStudyLine('est-resp-rx', `Radiografía de tórax ${input('c7-resp-rx','____')}.`)}
        ${renderDynamicBlock('c7-resp-extra','+ Agregar campo a Respiratorio')}
      </div>

      <!-- CARDIOVASCULAR -->
      <div id="block-sis-card">
        ${h1('SISTEMA CARDIOVASCULAR')}
        ${renderStudyLine('est-card-pef', `Prueba de esfuerzo ${input('c7-card-pef','____')}.`)}
        ${renderStudyLine('est-card-ecg', `Electrocardiograma ${input('c7-card-ecg','____')}.`)}
        ${renderDynamicBlock('c7-card-extra','+ Agregar campo a Cardiovascular')}
      </div>

      <!-- GASTROINTESTINAL -->
      <div id="block-sis-gi">
        ${h1('SISTEMA GASTROINTESTINAL')}
        ${renderStudyLine('est-gi-sint', `Sintomatología ${input('c7-gi-sint','____')}.`)}
        ${renderStudyLine('est-gi-eco', `Ultrasonido abdominal ${input('c7-gi-eco','____')}.`)}
        ${renderStudyLine('est-gi-pfh', `Pruebas de función hepática ${input('c7-gi-pfh','____')}.`)}
        ${renderStudyLine('est-gi-copro', `Coprológico ${input('c7-gi-copro','____')}.`)}
        ${renderStudyLine('est-gi-coprop', `Coproparasitoscópico ${input('c7-gi-coprop','____')}.`)}
        ${renderStudyLine('est-gi-dental', `La evaluación odontológica ${input('c7-gi-dental','____')}.`)}
        ${renderDynamicBlock('c7-gi-extra','+ Agregar campo a Gastrointestinal')}
      </div>

      <!-- GENITO-URINARIO -->
      <div id="block-sis-gu">
        ${h1('SISTEMA GENITO-URINARIO')}
        ${renderStudyLine('est-gu-sint', `Sintomatología ${input('c7-gu-sint','____')}.`)}
        ${renderStudyLine('est-gu-ecoR', `Ecosonograma renal ${input('c7-gu-ecoR','____')}.`)}
        ${renderIfSex('M', renderStudyLine('est-gu-ecoP', `Ecosonograma prostático ${input('c7-gu-ecoP','____')}.`))}
        ${renderIfSex('F', renderStudyLine('est-gu-ecoPel', `Ecosonograma pélvico ${input('c7-gu-ecoPel','____')}.`))}
        ${renderStudyLine('est-gu-orina', `General de orina ${input('c7-gu-orina','____')}.`)}
        ${renderStudyLine('est-gu-renal', `Urea ${input('c7-gu-urea','____','sm')}, creatinina ${input('c7-gu-creat','____','sm')}, nitrógeno uréico ${input('c7-gu-nitro','____','sm')}, tasa de filtración glomerular ${input('c7-gu-tfg','____','sm')}.`)}
        ${renderIfSex('M', renderStudyLine('est-gu-psa', `Antígeno prostático ${input('c7-gu-psa','____','sm')}.`))}
        ${renderDynamicBlock('c7-gu-extra','+ Agregar campo a Genito-Urinario')}
      </div>

      <!-- NERVIOSO -->
      <div id="block-sis-nerv">
        ${h1('SISTEMA NERVIOSO Y ÓRGANOS DE LOS SENTIDOS')}
        ${renderStudyLine('est-nerv-sint', `Sintomatología ${input('c7-nerv-sint','____')}.`)}
        ${renderStudyLine('est-nerv-oftal', `Valoración oftalmológica ${input('c7-nerv-oftal','____')}.`)}
        ${renderStudyLine('est-nerv-audio', `Audiometría ${input('c7-nerv-audio','____')}.`)}
        ${renderDynamicBlock('c7-nerv-extra','+ Agregar campo a Nervioso')}
      </div>

      <!-- ENDOCRINO -->
      <div id="block-sis-endo">
        ${h1('SISTEMA ENDOCRINO METABÓLICO')}
        ${renderStudyLine('est-endo-gluc', `Glucosa ${input('c7-endo-gluc','____','sm')}.`)}
        ${renderStudyLine('est-endo-au', `Ácido úrico ${input('c7-endo-au','____','sm')}.`)}
        ${renderStudyLine('est-endo-lip', `Perfil de lípidos: colesterol total ${input('c7-endo-colT','____','sm')}, triglicéridos ${input('c7-endo-trig','____','sm')}, HDL ${input('c7-endo-hdl','____','sm')}, LDL ${input('c7-endo-ldl','____','sm')}.`)}
        ${renderIfSex('F', renderStudyLine('est-endo-ovar', `Perfil ovárico: LH ${input('c7-endo-lh','____','sm')}, FSH ${input('c7-endo-fsh','____','sm')}, prolactina ${input('c7-endo-prl','____','sm')}, progesterona ${input('c7-endo-prog','____','sm')}, estradiol ${input('c7-endo-est','____','sm')}.`))}
        ${renderStudyLine('est-endo-imc', `Índice de masa corporal ${input('c7-endo-imc','____','sm')} (${input('c7-endo-imcClass','clasificación')}).`)}
        ${renderDynamicBlock('c7-endo-extra','+ Agregar campo a Endocrino')}
      </div>

      <!-- MUSCULOESQUELÉTICO -->
      <div id="block-sis-muscu">
        ${h1('SISTEMA MUSCULOESQUELÉTICO')}
        ${renderStudyLine('est-muscu-sint', `Sintomatología ${input('c7-muscu-sint','____')}.`)}
        ${renderStudyLine('est-muscu-rx', `Radiografía de columna lumbar ${input('c7-muscu-rx','____')}.`)}
        ${renderStudyLine('est-muscu-densi', `Densitometría ${input('c7-muscu-densi','____')}.`)}
        ${renderDynamicBlock('c7-muscu-extra','+ Agregar campo a Musculoesquelético')}
      </div>

      <!-- HEMATOPOYÉTICO -->
      <div id="block-sis-hema">
        ${h1('SISTEMA HEMATOPOYÉTICO Y CÉLULAS EN SANGRE')}
        ${renderStudyLine('est-hema-bh', `Biometría hemática ${input('c7-hema-bh','____')}.`)}
        ${renderStudyLine('est-hema-elec', `Electrolitos: calcio ${input('c7-hema-ca','____','sm')}, fósforo ${input('c7-hema-p','____','sm')}, sodio ${input('c7-hema-na','____','sm')}, potasio ${input('c7-hema-k','____','sm')}, cloro ${input('c7-hema-cl','____','sm')}.`)}
        ${renderStudyLine('est-hema-fe', `Hierro sérico ${input('c7-hema-fe','____','sm')}.`)}
        ${renderStudyLine('est-hema-grupo', `Grupo sanguíneo ${input('c7-hema-grupo','____','sm')}.`)}
        ${renderStudyLine('est-hema-vih', `Anticuerpos contra el virus del SIDA y antígeno p24 ${input('c7-hema-vih','____')}.`)}
        ${renderStudyLine('est-hema-vdrl', `VDRL ${input('c7-hema-vdrl','____','sm')}.`)}
        ${renderDynamicBlock('c7-hema-extra','+ Agregar campo a Hematopoyético')}
      </div>
    `;
    return renderContentWrapper(this.membreteKey, this.label, inner);
  },

  restore() {
    const ids = [
      'c7-resp-sint','c7-resp-espiro','c7-resp-rx',
      'c7-card-pef','c7-card-ecg',
      'c7-gi-sint','c7-gi-eco','c7-gi-pfh','c7-gi-copro','c7-gi-coprop','c7-gi-dental',
      'c7-gu-sint','c7-gu-ecoR','c7-gu-ecoP','c7-gu-ecoPel','c7-gu-orina',
      'c7-gu-urea','c7-gu-creat','c7-gu-nitro','c7-gu-tfg','c7-gu-psa',
      'c7-nerv-sint','c7-nerv-oftal','c7-nerv-audio',
      'c7-endo-gluc','c7-endo-au','c7-endo-colT','c7-endo-trig','c7-endo-hdl','c7-endo-ldl',
      'c7-endo-lh','c7-endo-fsh','c7-endo-prl','c7-endo-prog','c7-endo-est',
      'c7-endo-imc','c7-endo-imcClass',
      'c7-muscu-sint','c7-muscu-rx','c7-muscu-densi',
      'c7-hema-bh','c7-hema-ca','c7-hema-p','c7-hema-na','c7-hema-k','c7-hema-cl',
      'c7-hema-fe','c7-hema-grupo','c7-hema-vih','c7-hema-vdrl'
    ];
    restoreFields(ids);
    restoreAutoGrow(ids);

    // Limpiar omit toggles antiguos a nivel de sistema (migración)
    ['sis-resp','sis-card','sis-gi','sis-gu','sis-nerv','sis-endo','sis-muscu','sis-hema']
      .forEach(k => { if (appState[`omit-${k}`]) delete appState[`omit-${k}`]; });
    saveToStorage();

    document.querySelectorAll('.ctt-dynamic-body').forEach(autoGrow);
    refreshSexConditionals();
  }
};
