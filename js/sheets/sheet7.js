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

  // Estudios numéricos de laboratorio (rangos estándar editables)
  endoLab: [
    { id: 'gluc', label: 'Glucosa',          unit: 'mg/dL', min: 70,  max: 100 },
    { id: 'au',   label: 'Ácido úrico',      unit: 'mg/dL', min: 3.4, max: 7.0 },
    { id: 'colT', label: 'Colesterol total', unit: 'mg/dL', min: 125, max: 200 },
    { id: 'trig', label: 'Triglicéridos',    unit: 'mg/dL', min: 40,  max: 150 },
    { id: 'hdl',  label: 'HDL',              unit: 'mg/dL', min: 40,  max: 80  },
    { id: 'ldl',  label: 'LDL',              unit: 'mg/dL', min: 50,  max: 100 },
  ],
  endoHormonas: [
    { id: 'lh',   label: 'LH',           unit: 'mUI/mL', min: 2,   max: 12  },
    { id: 'fsh',  label: 'FSH',          unit: 'mUI/mL', min: 3,   max: 10  },
    { id: 'prl',  label: 'Prolactina',   unit: 'ng/mL',  min: 5,   max: 25  },
    { id: 'prog', label: 'Progesterona', unit: 'ng/mL',  min: 0.1, max: 1.5 },
    { id: 'est',  label: 'Estradiol',    unit: 'pg/mL',  min: 30,  max: 120 },
  ],
  guLab: [
    { id: 'urea',  label: 'Urea',                          unit: 'mg/dL',  min: 15, max: 45  },
    { id: 'creat', label: 'Creatinina',                    unit: 'mg/dL',  min: 0.6, max: 1.2 },
    { id: 'nitro', label: 'Nitrógeno uréico (BUN)',        unit: 'mg/dL',  min: 7,  max: 20  },
    { id: 'tfg',   label: 'Tasa de filtración glomerular', unit: 'mL/min', min: 90, max: 120 },
  ],
  guPsa: [
    { id: 'psa', label: 'Antígeno prostático (PSA)', unit: 'ng/mL', min: 0, max: 4 },
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
        ${renderLabCard('gu','Función renal', this.guLab)}
        ${renderIfSex('M', renderLabCard('gupsa','Antígeno prostático', this.guPsa))}
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
        ${renderLabCard('endo','Perfil metabólico y de lípidos', this.endoLab)}
        ${renderIfSex('F', renderLabCard('endohorm','Perfil hormonal femenino', this.endoHormonas))}
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
      'c7-nerv-sint','c7-nerv-oftal','c7-nerv-audio',
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
