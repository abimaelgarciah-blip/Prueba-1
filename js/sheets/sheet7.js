window.sheet7 = {
  id: 'contenido-sistemas',
  label: 'Contenido Sistemas',
  type: 'content',
  membreteKey: 'mb-7',

  // PILOTO — diseño estructurado (valor + rango → badge y barra automáticos).
  // Los rangos son editables; estos son los valores de referencia por defecto.
  quimica: [
    { id: 'ca', label: 'Calcio',        unit: 'mg/dL',  min: 8.5, max: 10.5 },
    { id: 'p',  label: 'Fósforo',       unit: 'mg/dL',  min: 2.5, max: 4.5  },
    { id: 'na', label: 'Sodio',         unit: 'mmol/L', min: 135, max: 145  },
    { id: 'k',  label: 'Potasio',       unit: 'mmol/L', min: 3.5, max: 5.1  },
    { id: 'cl', label: 'Cloro',         unit: 'mmol/L', min: 98,  max: 107  },
    { id: 'fe', label: 'Hierro sérico', unit: 'µg/dL',  min: 60,  max: 170  },
  ],
  cualitativos: [
    { id: 'grupo', label: 'Grupo sanguíneo' },
    { id: 'vih',   label: 'Anticuerpos VIH y antígeno p24' },
    { id: 'vdrl',  label: 'VDRL' },
  ],

  // Catálogo de sistemas (para el resumen con estado por sistema)
  systems: [
    { key: 'resp',  short: 'Respiratorio' },
    { key: 'card',  short: 'Cardiovascular' },
    { key: 'gi',    short: 'Gastrointestinal' },
    { key: 'gu',    short: 'Genito-urinario' },
    { key: 'nerv',  short: 'Nervioso' },
    { key: 'endo',  short: 'Endocrino' },
    { key: 'muscu', short: 'Musculoesquelético' },
    { key: 'hema',  short: 'Hematopoyético' },
  ],

  render() {
    const inner = `
      ${h1('REVISIÓN POR SISTEMAS')}
      ${renderSysSummary(this.systems)}

      <!-- RESPIRATORIO -->
      <div id="block-sis-resp" class="${sysBlockClass('resp')}" data-sysblock="resp">
        ${renderSysHeader('resp','SISTEMA RESPIRATORIO')}
        ${renderStudyLine('est-resp-sint', `<strong class="ctt-sub-line">Síntomas respiratorios:</strong> ${textarea('c7-resp-sint')}`)}
        ${renderStudyLine('est-resp-espiro', `<strong class="ctt-sub-line">Espirometría:</strong> ${textarea('c7-resp-espiro')}`)}
        ${renderStudyLine('est-resp-rx', `<strong class="ctt-sub-line">Radiografía de tórax:</strong> ${textarea('c7-resp-rx')}`)}
        ${renderDynamicBlock('c7-resp-extra','+ Agregar campo a Respiratorio')}
      </div>

      <!-- CARDIOVASCULAR -->
      <div id="block-sis-card" class="${sysBlockClass('card')}" data-sysblock="card">
        ${renderSysHeader('card','SISTEMA CARDIOVASCULAR')}
        ${renderStudyLine('est-card-pef', `<strong class="ctt-sub-line">Prueba de esfuerzo:</strong> ${textarea('c7-card-pef')}`)}
        ${renderStudyLine('est-card-ecg', `<strong class="ctt-sub-line">Electrocardiograma:</strong> ${textarea('c7-card-ecg')}`)}
        ${renderDynamicBlock('c7-card-extra','+ Agregar campo a Cardiovascular')}
      </div>

      <!-- GASTROINTESTINAL -->
      <div id="block-sis-gi" class="${sysBlockClass('gi')}" data-sysblock="gi">
        ${renderSysHeader('gi','SISTEMA GASTROINTESTINAL')}
        ${renderStudyLine('est-gi-sint', `<strong class="ctt-sub-line">Sintomatología:</strong> ${textarea('c7-gi-sint')}`)}
        ${renderStudyLine('est-gi-eco', `<strong class="ctt-sub-line">Ultrasonido abdominal:</strong> ${textarea('c7-gi-eco')}`)}
        ${renderStudyLine('est-gi-pfh', `<strong class="ctt-sub-line">Pruebas de función hepática:</strong> ${textarea('c7-gi-pfh')}`)}
        ${renderStudyLine('est-gi-copro', `<strong class="ctt-sub-line">Coprológico:</strong> ${textarea('c7-gi-copro')}`)}
        ${renderStudyLine('est-gi-coprop', `<strong class="ctt-sub-line">Coproparasitoscópico:</strong> ${textarea('c7-gi-coprop')}`)}
        ${renderStudyLine('est-gi-dental', `<strong class="ctt-sub-line">Evaluación odontológica:</strong> ${textarea('c7-gi-dental')}`)}
        ${renderDynamicBlock('c7-gi-extra','+ Agregar campo a Gastrointestinal')}
      </div>

      <!-- GENITO-URINARIO -->
      <div id="block-sis-gu" class="${sysBlockClass('gu')}" data-sysblock="gu">
        ${renderSysHeader('gu','SISTEMA GENITO-URINARIO')}
        ${renderStudyLine('est-gu-sint', `<strong class="ctt-sub-line">Sintomatología:</strong> ${textarea('c7-gu-sint')}`)}
        ${renderStudyLine('est-gu-ecoR', `<strong class="ctt-sub-line">Ecosonograma renal:</strong> ${textarea('c7-gu-ecoR')}`)}
        ${renderIfSex('M', renderStudyLine('est-gu-ecoP', `<strong class="ctt-sub-line">Ecosonograma prostático:</strong> ${textarea('c7-gu-ecoP')}`))}
        ${renderIfSex('F', renderStudyLine('est-gu-ecoPel', `<strong class="ctt-sub-line">Ecosonograma pélvico:</strong> ${textarea('c7-gu-ecoPel')}`))}
        ${renderStudyLine('est-gu-orina', `<strong class="ctt-sub-line">General de orina:</strong> ${textarea('c7-gu-orina')}`)}
        ${renderStudyLine('est-gu-urea', `<strong class="ctt-sub-line">Urea:</strong> ${textarea('c7-gu-urea','','sm')}`)}
        ${renderStudyLine('est-gu-creat', `<strong class="ctt-sub-line">Creatinina:</strong> ${textarea('c7-gu-creat','','sm')}`)}
        ${renderStudyLine('est-gu-nitro', `<strong class="ctt-sub-line">Nitrógeno uréico:</strong> ${textarea('c7-gu-nitro','','sm')}`)}
        ${renderStudyLine('est-gu-tfg', `<strong class="ctt-sub-line">Tasa de filtración glomerular:</strong> ${textarea('c7-gu-tfg','','sm')}`)}
        ${renderIfSex('M', renderStudyLine('est-gu-psa', `<strong class="ctt-sub-line">Antígeno prostático:</strong> ${textarea('c7-gu-psa','','sm')}`))}
        ${renderDynamicBlock('c7-gu-extra','+ Agregar campo a Genito-Urinario')}
      </div>

      <!-- NERVIOSO -->
      <div id="block-sis-nerv" class="${sysBlockClass('nerv')}" data-sysblock="nerv">
        ${renderSysHeader('nerv','SISTEMA NERVIOSO Y ÓRGANOS DE LOS SENTIDOS')}
        ${renderStudyLine('est-nerv-sint', `<strong class="ctt-sub-line">Sintomatología:</strong> ${textarea('c7-nerv-sint')}`)}
        ${renderStudyLine('est-nerv-oftal', `<strong class="ctt-sub-line">Valoración oftalmológica:</strong> ${textarea('c7-nerv-oftal')}`)}
        ${renderStudyLine('est-nerv-audio', `<strong class="ctt-sub-line">Audiometría:</strong> ${textarea('c7-nerv-audio')}`)}
        ${renderDynamicBlock('c7-nerv-extra','+ Agregar campo a Nervioso')}
      </div>

      <!-- ENDOCRINO -->
      <div id="block-sis-endo" class="${sysBlockClass('endo')}" data-sysblock="endo">
        ${renderSysHeader('endo','SISTEMA ENDOCRINO METABÓLICO')}
        ${renderStudyLine('est-endo-gluc', `<strong class="ctt-sub-line">Glucosa:</strong> ${textarea('c7-endo-gluc','','sm')}`)}
        ${renderStudyLine('est-endo-au', `<strong class="ctt-sub-line">Ácido úrico:</strong> ${textarea('c7-endo-au','','sm')}`)}
        ${renderStudyLine('est-endo-colT', `<strong class="ctt-sub-line">Colesterol total:</strong> ${textarea('c7-endo-colT','','sm')}`)}
        ${renderStudyLine('est-endo-trig', `<strong class="ctt-sub-line">Triglicéridos:</strong> ${textarea('c7-endo-trig','','sm')}`)}
        ${renderStudyLine('est-endo-hdl', `<strong class="ctt-sub-line">HDL:</strong> ${textarea('c7-endo-hdl','','sm')}`)}
        ${renderStudyLine('est-endo-ldl', `<strong class="ctt-sub-line">LDL:</strong> ${textarea('c7-endo-ldl','','sm')}`)}
        ${renderIfSex('F', renderStudyLine('est-endo-lh',   `<strong class="ctt-sub-line">LH:</strong> ${textarea('c7-endo-lh','','sm')}`))}
        ${renderIfSex('F', renderStudyLine('est-endo-fsh',  `<strong class="ctt-sub-line">FSH:</strong> ${textarea('c7-endo-fsh','','sm')}`))}
        ${renderIfSex('F', renderStudyLine('est-endo-prl',  `<strong class="ctt-sub-line">Prolactina:</strong> ${textarea('c7-endo-prl','','sm')}`))}
        ${renderIfSex('F', renderStudyLine('est-endo-prog', `<strong class="ctt-sub-line">Progesterona:</strong> ${textarea('c7-endo-prog','','sm')}`))}
        ${renderIfSex('F', renderStudyLine('est-endo-est',  `<strong class="ctt-sub-line">Estradiol:</strong> ${textarea('c7-endo-est','','sm')}`))}
        ${renderStudyLine('est-endo-imc', `<strong class="ctt-sub-line">Índice de masa corporal:</strong> ${textarea('c7-endo-imc','','sm')} <strong class="ctt-sub-line">clasificado como:</strong> ${textarea('c7-endo-imcClass')}`)}
        ${renderDynamicBlock('c7-endo-extra','+ Agregar campo a Endocrino')}
      </div>

      <!-- MUSCULOESQUELÉTICO -->
      <div id="block-sis-muscu" class="${sysBlockClass('muscu')}" data-sysblock="muscu">
        ${renderSysHeader('muscu','SISTEMA MUSCULOESQUELÉTICO')}
        ${renderStudyLine('est-muscu-sint', `<strong class="ctt-sub-line">Sintomatología:</strong> ${textarea('c7-muscu-sint')}`)}
        ${renderStudyLine('est-muscu-rx', `<strong class="ctt-sub-line">Radiografía de columna lumbar:</strong> ${textarea('c7-muscu-rx')}`)}
        ${renderStudyLine('est-muscu-densi', `<strong class="ctt-sub-line">Densitometría:</strong> ${textarea('c7-muscu-densi')}`)}
        ${renderDynamicBlock('c7-muscu-extra','+ Agregar campo a Musculoesquelético')}
      </div>

      <!-- HEMATOPOYÉTICO -->
      <div id="block-sis-hema" class="${sysBlockClass('hema')}" data-sysblock="hema">
        ${renderSysHeader('hema','SISTEMA HEMATOPOYÉTICO Y CÉLULAS EN SANGRE')}
        ${renderStudyLine('est-hema-bh', `<strong class="ctt-sub-line">Biometría hemática:</strong> ${textarea('c7-hema-bh')}`)}
        ${renderLabCard('quimica', 'Química sanguínea y electrolitos', this.quimica)}
        ${renderQualCard('cualit', 'Estudios cualitativos', this.cualitativos)}
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
      'c7-hema-bh'
    ];
    restoreFields(ids);
    restoreAutoGrow(ids);

    ['sis-resp','sis-card','sis-gi','sis-gu','sis-nerv','sis-endo','sis-muscu','sis-hema']
      .forEach(k => { if (appState[`omit-${k}`]) delete appState[`omit-${k}`]; });
    saveToStorage();

    document.querySelectorAll('.ctt-dynamic-body').forEach(autoGrow);
    refreshSexConditionals();

    // Piloto: calcular badges y barras de la química/electrolitos al cargar.
    refreshAllLabs();
    refreshAllQual();

    // Resumen por sistemas (conteo + colores por estado).
    refreshSysSummary();
  }
};
