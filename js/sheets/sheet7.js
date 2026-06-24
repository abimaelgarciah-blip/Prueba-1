window.sheet7 = {
  id: 'contenido-sistemas',
  label: 'Contenido Sistemas',
  type: 'content',
  membreteKey: 'mb-7',

  /* ===== PANELES DE LABORATORIO (valor + rango → badge y barra) =====
   * Rangos de referencia tomados de los laboratorios adjuntos. Donde el rango
   * cambia por sexo se define minF/maxF (mujer); si no, aplica a ambos.
   * Todos los rangos son editables en el formato. */

  // Marcador de riesgo cardiovascular
  cardio: [
    { id: 'pcr', label: 'Proteína C Reactiva Ultra Sensible', unit: 'mg/L', min: 0.0, max: 1.0 },
  ],

  // Perfil hepático / pruebas de función hepática (Gastrointestinal)
  hepatico: [
    { id: 'bt',   label: 'Bilirrubina Total',           unit: 'mg/dL', min: 0.0, max: 1.2 },
    { id: 'bd',   label: 'Bilirrubina Directa',          unit: 'mg/dL', min: 0.0, max: 0.3 },
    { id: 'bi',   label: 'Bilirrubina Indirecta',        unit: 'mg/dL', min: 0.0, max: 0.9 },
    { id: 'pt',   label: 'Proteínas Totales',            unit: 'g/dL',  min: 6.4, max: 8.3 },
    { id: 'alb',  label: 'Albúmina',                     unit: 'g/dL',  min: 3.5, max: 5.2 },
    { id: 'glob', label: 'Globulina',                    unit: 'g/dL',  min: 2.3, max: 3.8 },
    { id: 'ag',   label: 'Relación A/G',                 unit: '',      min: 1.0, max: 2.0 },
    { id: 'tgo',  label: 'TGO / AST',                    unit: 'U/L',   min: 10,  max: 50,  minF: 10, maxF: 35 },
    { id: 'tgp',  label: 'TGP / ALT',                    unit: 'U/L',   min: 10,  max: 50,  minF: 10, maxF: 35 },
    { id: 'fa',   label: 'Fosfatasa Alcalina',           unit: 'U/L',   min: 40,  max: 129, minF: 35, maxF: 104 },
    { id: 'ggt',  label: 'Gammaglutamiltranspeptidasa (GGT)', unit: 'U/L', min: 0, max: 60, minF: 0,  maxF: 40 },
    { id: 'ldh',  label: 'Deshidrogenasa Láctica (LDH)', unit: 'U/L',   min: 135, max: 225, minF: 135, maxF: 214 },
  ],

  // Función renal (Genito-urinario)
  renal: [
    { id: 'urea',  label: 'Urea',                          unit: 'mg/dL', min: 19,  max: 44, minF: 15, maxF: 40 },
    { id: 'creat', label: 'Creatinina',                    unit: 'mg/dL', min: 0.7, max: 1.2, minF: 0.5, maxF: 0.9 },
    { id: 'bun',   label: 'Nitrógeno Uréico (BUN)',        unit: 'mg/dL', min: 6,   max: 20 },
    { id: 'tfg',   label: 'Tasa de Filtración Glomerular', unit: 'mL/min', min: 60, max: 120 },
  ],
  renalPsa: [
    { id: 'psa', label: 'Antígeno Prostático Específico (PSA)', unit: 'ng/mL', min: 0.0, max: 2.0 },
  ],

  // Perfil metabólico y de lípidos (Endocrino)
  metabolico: [
    { id: 'gluc',  label: 'Glucosa',                  unit: 'mg/dL', min: 70,  max: 99 },
    { id: 'au',    label: 'Ácido Úrico',              unit: 'mg/dL', min: 3.4, max: 7.0, minF: 2.4, maxF: 5.7 },
    { id: 'colT',  label: 'Colesterol Total',         unit: 'mg/dL', min: 125, max: 200 },
    { id: 'trig',  label: 'Triglicéridos',            unit: 'mg/dL', min: 40,  max: 150 },
    { id: 'hdl',   label: 'Colesterol HDL',           unit: 'mg/dL', min: 40,  max: 80, minF: 45, maxF: 90 },
    { id: 'ldl',   label: 'Colesterol LDL',           unit: 'mg/dL', min: 0,   max: 100 },
    { id: 'vldl',  label: 'Colesterol VLDL',          unit: 'mg/dL', min: 2,   max: 38 },
    { id: 'atero', label: 'Índice Aterogénico',       unit: '',      min: 0.0, max: 4.4 },
    { id: 'hba1c', label: 'Hemoglobina Glicada (HbA1c)', unit: '%',   min: 4.0, max: 6.0 },
  ],

  // Perfil tiroideo (opcional, al final de Endocrino)
  tiroideo: [
    { id: 't3',  label: 'T3 Triyodotironina Total', unit: 'ng/dL',  min: 80,   max: 200 },
    { id: 't4t', label: 'T4 Tiroxina Total',        unit: 'µg/dL',  min: 4.58, max: 12.0 },
    { id: 't4l', label: 'T4 Tiroxina Libre',        unit: 'ng/dL',  min: 0.93, max: 1.71 },
    { id: 'tsh', label: 'TSH (Hormona Estimulante de la Tiroides)', unit: 'µUI/mL', min: 0.27, max: 4.2 },
  ],

  // Perfil hormonal femenino (solo Femenino). Rangos = fase folicular (editable).
  hormonalF: [
    { id: 'lh',    label: 'Hormona Luteinizante (LH)',        unit: 'mUI/mL', min: 2.4,  max: 12.6 },
    { id: 'fsh',   label: 'Hormona Folículo Estimulante (FSH)', unit: 'mUI/mL', min: 3.5, max: 12.5 },
    { id: 'prl',   label: 'Prolactina',                       unit: 'ng/mL',  min: 4.79, max: 23.3 },
    { id: 'prog',  label: 'Progesterona (fase folicular)',    unit: 'ng/mL',  min: 0.05, max: 0.19 },
    { id: 'est',   label: 'Estradiol (E2, fase folicular)',   unit: 'pg/mL',  min: 30.9, max: 90.4 },
    { id: 'ca153', label: 'Antígeno CA 15.3 (glándula mamaria)', unit: 'U/mL', min: 0.0, max: 26.2 },
  ],

  // Química sanguínea y electrolitos (Hematopoyético)
  quimica: [
    { id: 'ca', label: 'Calcio',        unit: 'mg/dL',  min: 8.6, max: 10.0 },
    { id: 'p',  label: 'Fósforo',       unit: 'mg/dL',  min: 2.5, max: 4.5  },
    { id: 'na', label: 'Sodio',         unit: 'mmol/L', min: 136, max: 145  },
    { id: 'k',  label: 'Potasio',       unit: 'mmol/L', min: 3.5, max: 5.1  },
    { id: 'cl', label: 'Cloro',         unit: 'mmol/L', min: 98,  max: 107  },
    { id: 'fe', label: 'Hierro sérico', unit: 'µg/dL',  min: 49,  max: 158, minF: 37, maxF: 145 },
  ],

  // Biometría hemática completa (Hematopoyético)
  biometria: [
    { id: 'leu',  label: 'Leucocitos',   unit: 'x10³/µL', min: 4.5,  max: 11.0 },
    { id: 'eri',  label: 'Eritrocitos',  unit: 'x10⁶/µL', min: 4.5,  max: 6.3, minF: 4.2, maxF: 5.4 },
    { id: 'hb',   label: 'Hemoglobina',  unit: 'g/dL',    min: 14.0, max: 18.0, minF: 12.0, maxF: 16.0 },
    { id: 'hto',  label: 'Hematocrito',  unit: '%',       min: 42.0, max: 52.0, minF: 37.0, maxF: 47.0 },
    { id: 'vcm',  label: 'VCM',          unit: 'fL',      min: 83.0, max: 100.0 },
    { id: 'hcm',  label: 'HCM',          unit: 'pg',      min: 27.1, max: 33.5, minF: 26.8, maxF: 33.2 },
    { id: 'chcm', label: 'CHCM',         unit: 'g/dL',    min: 32.0, max: 34.5 },
    { id: 'rdw',  label: 'RDW-CV',       unit: '%',       min: 11.8, max: 17.6, minF: 12.0, maxF: 17.7 },
    { id: 'plq',  label: 'Plaquetas',    unit: 'x10³/µL', min: 150,  max: 450 },
    { id: 'vpm',  label: 'VPM',          unit: 'fL',      min: 7.4,  max: 10.4 },
    { id: 'neu',  label: 'Neutrófilos',  unit: '%',       min: 40,   max: 85 },
    { id: 'lin',  label: 'Linfocitos',   unit: '%',       min: 18,   max: 45 },
    { id: 'mon',  label: 'Monocitos',    unit: '%',       min: 3,    max: 10 },
    { id: 'eos',  label: 'Eosinófilos',  unit: '%',       min: 0.3,  max: 4.5, minF: 0.3, maxF: 5.5 },
    { id: 'bas',  label: 'Basófilos',    unit: '%',       min: 0.0,  max: 1.6, minF: 0.0, maxF: 1.4 },
  ],

  cualitativos: [
    { id: 'grupo', label: 'Grupo sanguíneo y RH' },
    { id: 'vih',   label: 'Anticuerpos VIH (1 y 2) y antígeno p24' },
    { id: 'vdrl',  label: 'VDRL' },
  ],
  heces: [
    { id: 'sangre', label: 'Sangre oculta en heces' },
    { id: 'hpylori', label: 'Antígeno Helicobacter pylori' },
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
        ${renderLabCard('cardio', 'Marcador de riesgo cardiovascular', this.cardio)}
        ${renderDynamicBlock('c7-card-extra','+ Agregar campo a Cardiovascular')}
      </div>

      <!-- GASTROINTESTINAL -->
      <div id="block-sis-gi" class="${sysBlockClass('gi')}" data-sysblock="gi">
        ${renderSysHeader('gi','SISTEMA GASTROINTESTINAL')}
        ${renderStudyLine('est-gi-sint', `<strong class="ctt-sub-line">Sintomatología:</strong> ${textarea('c7-gi-sint')}`)}
        ${renderStudyLine('est-gi-eco', `<strong class="ctt-sub-line">Ultrasonido abdominal:</strong> ${textarea('c7-gi-eco')}`)}
        ${renderLabCard('hepatico', 'Perfil hepático (pruebas de función hepática)', this.hepatico)}
        ${renderStudyLine('est-gi-copro', `<strong class="ctt-sub-line">Coprológico:</strong> ${textarea('c7-gi-copro')}`)}
        ${renderStudyLine('est-gi-coprop', `<strong class="ctt-sub-line">Coproparasitoscópico:</strong> ${textarea('c7-gi-coprop')}`)}
        ${renderQualCard('heces', 'Estudios en heces', this.heces)}
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
        ${renderStudyLine('est-gu-orina', `<strong class="ctt-sub-line">General de orina (EGO):</strong> ${textarea('c7-gu-orina')}`)}
        ${renderLabCard('renal', 'Función renal', this.renal)}
        ${renderIfSex('M', renderLabCard('renalPsa', 'Antígeno prostático', this.renalPsa))}
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
        ${renderLabCard('metabolico', 'Perfil metabólico y de lípidos', this.metabolico)}
        ${renderIfSex('F', renderLabCard('hormonalF', 'Perfil hormonal femenino', this.hormonalF))}
        ${renderStudyLine('est-endo-imc', `<strong class="ctt-sub-line">Índice de masa corporal:</strong> ${textarea('c7-endo-imc','','sm')} <strong class="ctt-sub-line">clasificado como:</strong> ${textarea('c7-endo-imcClass')}`)}
        ${renderLabCardOmit('tiroideo', 'tiroideo', 'Perfil tiroideo', this.tiroideo, 'Omitir Perfil tiroideo (no todos los pacientes lo llevan)')}
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
        ${renderLabCard('biometria', 'Biometría hemática', this.biometria)}
        ${renderLabCard('quimica', 'Química sanguínea y electrolitos', this.quimica)}
        ${renderQualCard('cualit', 'Serología y grupo sanguíneo', this.cualitativos)}
        ${renderDynamicBlock('c7-hema-extra','+ Agregar campo a Hematopoyético')}
      </div>
    `;
    return renderContentWrapper(this.membreteKey, this.label, inner);
  },

  restore() {
    const ids = [
      'c7-resp-sint','c7-resp-espiro','c7-resp-rx',
      'c7-card-pef','c7-card-ecg',
      'c7-gi-sint','c7-gi-eco','c7-gi-copro','c7-gi-coprop','c7-gi-dental',
      'c7-gu-sint','c7-gu-ecoR','c7-gu-ecoP','c7-gu-ecoPel','c7-gu-orina',
      'c7-nerv-sint','c7-nerv-oftal','c7-nerv-audio',
      'c7-endo-imc','c7-endo-imcClass',
      'c7-muscu-sint','c7-muscu-rx','c7-muscu-densi'
    ];
    restoreFields(ids);
    restoreAutoGrow(ids);

    ['sis-resp','sis-card','sis-gi','sis-gu','sis-nerv','sis-endo','sis-muscu','sis-hema']
      .forEach(k => { if (appState[`omit-${k}`]) delete appState[`omit-${k}`]; });
    saveToStorage();

    document.querySelectorAll('.ctt-dynamic-body').forEach(autoGrow);
    refreshSexConditionals();

    // Pintar todas las gráficas de laboratorio y las pastillas cualitativas
    refreshAllLabs();
    refreshAllQual();

    // Resumen por sistemas (conteo + colores por estado)
    refreshSysSummary();
  }
};
