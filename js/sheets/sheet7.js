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
        ${renderStudyLine('est-resp-sint', `Síntomas respiratorios ${input('c7-resp-sint')}.`)}
        ${renderStudyLine('est-resp-espiro', `Espirometría ${input('c7-resp-espiro')}.`)}
        ${renderStudyLine('est-resp-rx', `Radiografía de tórax ${input('c7-resp-rx')}.`)}
        ${renderDynamicBlock('c7-resp-extra','+ Agregar campo a Respiratorio')}
      </div>

      <!-- CARDIOVASCULAR -->
      <div id="block-sis-card">
        ${h1('SISTEMA CARDIOVASCULAR')}
        ${renderStudyLine('est-card-pef', `Prueba de esfuerzo ${input('c7-card-pef')}.`)}
        ${renderStudyLine('est-card-ecg', `Electrocardiograma ${input('c7-card-ecg')}.`)}
        ${renderDynamicBlock('c7-card-extra','+ Agregar campo a Cardiovascular')}
      </div>

      <!-- GASTROINTESTINAL -->
      <div id="block-sis-gi">
        ${h1('SISTEMA GASTROINTESTINAL')}
        ${renderStudyLine('est-gi-sint', `Sintomatología ${input('c7-gi-sint')}.`)}
        ${renderStudyLine('est-gi-eco', `Ultrasonido abdominal ${input('c7-gi-eco')}.`)}
        ${renderStudyLine('est-gi-pfh', `Pruebas de función hepática ${input('c7-gi-pfh')}.`)}
        ${renderStudyLine('est-gi-copro', `Coprológico ${input('c7-gi-copro')}.`)}
        ${renderStudyLine('est-gi-coprop', `Coproparasitoscópico ${input('c7-gi-coprop')}.`)}
        ${renderStudyLine('est-gi-dental', `La evaluación odontológica ${input('c7-gi-dental')}.`)}
        ${renderDynamicBlock('c7-gi-extra','+ Agregar campo a Gastrointestinal')}
      </div>

      <!-- GENITO-URINARIO -->
      <div id="block-sis-gu">
        ${h1('SISTEMA GENITO-URINARIO')}
        ${renderStudyLine('est-gu-sint', `Sintomatología ${input('c7-gu-sint')}.`)}
        ${renderStudyLine('est-gu-ecoR', `Ecosonograma renal ${input('c7-gu-ecoR')}.`)}
        ${renderIfSex('M', renderStudyLine('est-gu-ecoP', `Ecosonograma prostático ${input('c7-gu-ecoP')}.`))}
        ${renderIfSex('F', renderStudyLine('est-gu-ecoPel', `Ecosonograma pélvico ${input('c7-gu-ecoPel')}.`))}
        ${renderStudyLine('est-gu-orina', `General de orina ${input('c7-gu-orina')}.`)}
        ${renderStudyLine('est-gu-urea', `Urea ${input('c7-gu-urea','','sm')}.`)}
        ${renderStudyLine('est-gu-creat', `Creatinina ${input('c7-gu-creat','','sm')}.`)}
        ${renderStudyLine('est-gu-nitro', `Nitrógeno uréico ${input('c7-gu-nitro','','sm')}.`)}
        ${renderStudyLine('est-gu-tfg', `Tasa de filtración glomerular ${input('c7-gu-tfg','','sm')}.`)}
        ${renderIfSex('M', renderStudyLine('est-gu-psa', `Antígeno prostático ${input('c7-gu-psa','','sm')}.`))}
        ${renderDynamicBlock('c7-gu-extra','+ Agregar campo a Genito-Urinario')}
      </div>

      <!-- NERVIOSO -->
      <div id="block-sis-nerv">
        ${h1('SISTEMA NERVIOSO Y ÓRGANOS DE LOS SENTIDOS')}
        ${renderStudyLine('est-nerv-sint', `Sintomatología ${input('c7-nerv-sint')}.`)}
        ${renderStudyLine('est-nerv-oftal', `Valoración oftalmológica ${input('c7-nerv-oftal')}.`)}
        ${renderStudyLine('est-nerv-audio', `Audiometría ${input('c7-nerv-audio')}.`)}
        ${renderDynamicBlock('c7-nerv-extra','+ Agregar campo a Nervioso')}
      </div>

      <!-- ENDOCRINO -->
      <div id="block-sis-endo">
        ${h1('SISTEMA ENDOCRINO METABÓLICO')}
        ${renderStudyLine('est-endo-gluc', `Glucosa ${input('c7-endo-gluc','','sm')}.`)}
        ${renderStudyLine('est-endo-au', `Ácido úrico ${input('c7-endo-au','','sm')}.`)}
        ${renderStudyLine('est-endo-colT', `Colesterol total ${input('c7-endo-colT','','sm')}.`)}
        ${renderStudyLine('est-endo-trig', `Triglicéridos ${input('c7-endo-trig','','sm')}.`)}
        ${renderStudyLine('est-endo-hdl', `HDL ${input('c7-endo-hdl','','sm')}.`)}
        ${renderStudyLine('est-endo-ldl', `LDL ${input('c7-endo-ldl','','sm')}.`)}
        ${renderIfSex('F', renderStudyLine('est-endo-lh',   `LH ${input('c7-endo-lh','','sm')}.`))}
        ${renderIfSex('F', renderStudyLine('est-endo-fsh',  `FSH ${input('c7-endo-fsh','','sm')}.`))}
        ${renderIfSex('F', renderStudyLine('est-endo-prl',  `Prolactina ${input('c7-endo-prl','','sm')}.`))}
        ${renderIfSex('F', renderStudyLine('est-endo-prog', `Progesterona ${input('c7-endo-prog','','sm')}.`))}
        ${renderIfSex('F', renderStudyLine('est-endo-est',  `Estradiol ${input('c7-endo-est','','sm')}.`))}
        ${renderStudyLine('est-endo-imc', `Índice de masa corporal ${input('c7-endo-imc','','sm')} clasificado como ${input('c7-endo-imcClass')}.`)}
        ${renderDynamicBlock('c7-endo-extra','+ Agregar campo a Endocrino')}
      </div>

      <!-- MUSCULOESQUELÉTICO -->
      <div id="block-sis-muscu">
        ${h1('SISTEMA MUSCULOESQUELÉTICO')}
        ${renderStudyLine('est-muscu-sint', `Sintomatología ${input('c7-muscu-sint')}.`)}
        ${renderStudyLine('est-muscu-rx', `Radiografía de columna lumbar ${input('c7-muscu-rx')}.`)}
        ${renderStudyLine('est-muscu-densi', `Densitometría ${input('c7-muscu-densi')}.`)}
        ${renderDynamicBlock('c7-muscu-extra','+ Agregar campo a Musculoesquelético')}
      </div>

      <!-- HEMATOPOYÉTICO -->
      <div id="block-sis-hema">
        ${h1('SISTEMA HEMATOPOYÉTICO Y CÉLULAS EN SANGRE')}
        ${renderStudyLine('est-hema-bh', `Biometría hemática ${input('c7-hema-bh')}.`)}
        ${renderStudyLine('est-hema-ca', `Calcio ${input('c7-hema-ca','','sm')}.`)}
        ${renderStudyLine('est-hema-p',  `Fósforo ${input('c7-hema-p','','sm')}.`)}
        ${renderStudyLine('est-hema-na', `Sodio ${input('c7-hema-na','','sm')}.`)}
        ${renderStudyLine('est-hema-k',  `Potasio ${input('c7-hema-k','','sm')}.`)}
        ${renderStudyLine('est-hema-cl', `Cloro ${input('c7-hema-cl','','sm')}.`)}
        ${renderStudyLine('est-hema-fe', `Hierro sérico ${input('c7-hema-fe','','sm')}.`)}
        ${renderStudyLine('est-hema-grupo', `Grupo sanguíneo ${input('c7-hema-grupo','','sm')}.`)}
        ${renderStudyLine('est-hema-vih', `Anticuerpos contra el virus del SIDA y antígeno p24 ${input('c7-hema-vih')}.`)}
        ${renderStudyLine('est-hema-vdrl', `VDRL ${input('c7-hema-vdrl','','sm')}.`)}
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

    ['sis-resp','sis-card','sis-gi','sis-gu','sis-nerv','sis-endo','sis-muscu','sis-hema']
      .forEach(k => { if (appState[`omit-${k}`]) delete appState[`omit-${k}`]; });
    saveToStorage();

    document.querySelectorAll('.ctt-dynamic-body').forEach(autoGrow);
    refreshSexConditionals();
  }
};
