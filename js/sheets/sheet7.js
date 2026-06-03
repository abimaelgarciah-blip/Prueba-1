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
        ${p(`<strong class="ctt-sub-line">Síntomas respiratorios:</strong> ${textarea('c7-resp-sint','...')}`)}
        ${p(`<strong class="ctt-sub-line">Espirometría:</strong> ${textarea('c7-resp-espiro','...')}`)}
        ${p(`<strong class="ctt-sub-line">Radiografía de tórax:</strong> ${textarea('c7-resp-rx','...')}`)}
        ${renderDynamicBlock('c7-resp-extra','+ Agregar campo a Respiratorio')}
      </div>

      <!-- CARDIOVASCULAR -->
      <div id="block-sis-card">
        ${h1('SISTEMA CARDIOVASCULAR')}
        ${p(`<strong class="ctt-sub-line">Prueba de esfuerzo:</strong> ${textarea('c7-card-pef','...')}`)}
        ${p(`<strong class="ctt-sub-line">Electrocardiograma:</strong> ${textarea('c7-card-ecg','...')}`)}
        ${renderDynamicBlock('c7-card-extra','+ Agregar campo a Cardiovascular')}
      </div>

      <!-- GASTROINTESTINAL -->
      <div id="block-sis-gi">
        ${h1('SISTEMA GASTROINTESTINAL')}
        ${p(`<strong class="ctt-sub-line">Sintomatología:</strong> ${textarea('c7-gi-sint','...')}`)}
        ${p(`<strong class="ctt-sub-line">Ultrasonido abdominal:</strong> ${textarea('c7-gi-eco','...')}`)}
        ${p(`<strong class="ctt-sub-line">Pruebas de función hepática:</strong> ${textarea('c7-gi-pfh','...')}`)}
        ${p(`<strong class="ctt-sub-line">Coprológico:</strong> ${textarea('c7-gi-copro','...')}`)}
        ${p(`<strong class="ctt-sub-line">Coproparasitoscópico:</strong> ${textarea('c7-gi-coprop','...')}`)}
        <div id="block-gi-dental">
          ${renderOmitToggle('gi-dental','Omitir evaluación odontológica')}
          ${p(`<strong class="ctt-sub-line">Evaluación odontológica:</strong> ${textarea('c7-gi-dental','...')}`)}
        </div>
        ${renderDynamicBlock('c7-gi-extra','+ Agregar campo a Gastrointestinal')}
      </div>

      <!-- GENITO-URINARIO -->
      <div id="block-sis-gu">
        ${h1('SISTEMA GENITO-URINARIO')}
        ${p(`<strong class="ctt-sub-line">Sintomatología:</strong> ${textarea('c7-gu-sint','...')}`)}
        ${p(`<strong class="ctt-sub-line">Ecosonograma renal:</strong> ${textarea('c7-gu-ecoR','...')}`)}
        ${renderIfSex('M', p(`<strong class="ctt-sub-line">Ecosonograma prostático:</strong> ${textarea('c7-gu-ecoP','...')}`))}
        ${renderIfSex('F', p(`<strong class="ctt-sub-line">Ecosonograma pélvico:</strong> ${textarea('c7-gu-ecoPel','...')}`))}
        ${p(`<strong class="ctt-sub-line">General de orina:</strong> ${textarea('c7-gu-orina','...')}`)}
        ${p(`<strong class="ctt-sub-line">Urea:</strong> ${textarea('c7-gu-urea','...')}`)}
        ${p(`<strong class="ctt-sub-line">Creatinina:</strong> ${textarea('c7-gu-creat','...')}`)}
        ${p(`<strong class="ctt-sub-line">Nitrógeno uréico:</strong> ${textarea('c7-gu-nitro','...')}`)}
        ${p(`<strong class="ctt-sub-line">Tasa de filtración glomerular:</strong> ${textarea('c7-gu-tfg','...')}`)}
        ${renderIfSex('M', p(`<strong class="ctt-sub-line">Antígeno prostático:</strong> ${textarea('c7-gu-psa','...')}`))}
        ${renderDynamicBlock('c7-gu-extra','+ Agregar campo a Genito-Urinario')}
      </div>

      <!-- NERVIOSO -->
      <div id="block-sis-nerv">
        ${h1('SISTEMA NERVIOSO Y ÓRGANOS DE LOS SENTIDOS')}
        ${p(`<strong class="ctt-sub-line">Sintomatología:</strong> ${textarea('c7-nerv-sint','...')}`)}
        ${p(`<strong class="ctt-sub-line">Valoración oftalmológica:</strong> ${textarea('c7-nerv-oftal','...')}`)}
        ${p(`<strong class="ctt-sub-line">Audiometría:</strong> ${textarea('c7-nerv-audio','...')}`)}
        ${renderDynamicBlock('c7-nerv-extra','+ Agregar campo a Nervioso')}
      </div>

      <!-- ENDOCRINO -->
      <div id="block-sis-endo">
        ${h1('SISTEMA ENDOCRINO METABÓLICO')}
        ${p(`<strong class="ctt-sub-line">Glucosa:</strong> ${textarea('c7-endo-gluc','...')}`)}
        ${p(`<strong class="ctt-sub-line">Ácido úrico:</strong> ${textarea('c7-endo-au','...')}`)}
        ${p(`<strong class="ctt-sub-line">Colesterol total:</strong> ${textarea('c7-endo-colT','...')}`)}
        ${p(`<strong class="ctt-sub-line">Triglicéridos:</strong> ${textarea('c7-endo-trig','...')}`)}
        ${p(`<strong class="ctt-sub-line">HDL:</strong> ${textarea('c7-endo-hdl','...')}`)}
        ${p(`<strong class="ctt-sub-line">LDL:</strong> ${textarea('c7-endo-ldl','...')}`)}
        ${renderIfSex('F', p(`<strong class="ctt-sub-line">LH:</strong> ${textarea('c7-endo-lh','...')}`))}
        ${renderIfSex('F', p(`<strong class="ctt-sub-line">FSH:</strong> ${textarea('c7-endo-fsh','...')}`))}
        ${renderIfSex('F', p(`<strong class="ctt-sub-line">Prolactina:</strong> ${textarea('c7-endo-prl','...')}`))}
        ${renderIfSex('F', p(`<strong class="ctt-sub-line">Progesterona:</strong> ${textarea('c7-endo-prog','...')}`))}
        ${renderIfSex('F', p(`<strong class="ctt-sub-line">Estradiol:</strong> ${textarea('c7-endo-est','...')}`))}
        ${p(`<strong class="ctt-sub-line">IMC:</strong> ${textarea('c7-endo-imc','...')}`)}
        ${p(`<strong class="ctt-sub-line">Clasificado como:</strong> ${textarea('c7-endo-imcClass','...')}`)}
        ${renderDynamicBlock('c7-endo-extra','+ Agregar campo a Endocrino')}
      </div>

      <!-- MUSCULOESQUELÉTICO -->
      <div id="block-sis-muscu">
        ${h1('SISTEMA MUSCULOESQUELÉTICO')}
        ${p(`<strong class="ctt-sub-line">Sintomatología:</strong> ${textarea('c7-muscu-sint','...')}`)}
        ${p(`<strong class="ctt-sub-line">Radiografía de columna lumbar:</strong> ${textarea('c7-muscu-rx','...')}`)}
        ${p(`<strong class="ctt-sub-line">Densitometría:</strong> ${textarea('c7-muscu-densi','...')}`)}
        ${renderDynamicBlock('c7-muscu-extra','+ Agregar campo a Musculoesquelético')}
      </div>

      <!-- HEMATOPOYÉTICO -->
      <div id="block-sis-hema">
        ${h1('SISTEMA HEMATOPOYÉTICO Y CÉLULAS EN SANGRE')}
        ${p(`<strong class="ctt-sub-line">Biometría hemática:</strong> ${textarea('c7-hema-bh','...')}`)}
        ${p(`<strong class="ctt-sub-line">Calcio:</strong> ${textarea('c7-hema-ca','...')}`)}
        ${p(`<strong class="ctt-sub-line">Fósforo:</strong> ${textarea('c7-hema-p','...')}`)}
        ${p(`<strong class="ctt-sub-line">Sodio:</strong> ${textarea('c7-hema-na','...')}`)}
        ${p(`<strong class="ctt-sub-line">Potasio:</strong> ${textarea('c7-hema-k','...')}`)}
        ${p(`<strong class="ctt-sub-line">Cloro:</strong> ${textarea('c7-hema-cl','...')}`)}
        ${p(`<strong class="ctt-sub-line">Hierro sérico:</strong> ${textarea('c7-hema-fe','...')}`)}
        ${p(`<strong class="ctt-sub-line">Grupo sanguíneo:</strong> ${textarea('c7-hema-grupo','...')}`)}
        ${p(`<strong class="ctt-sub-line">Anticuerpos VIH y antígeno p24:</strong> ${textarea('c7-hema-vih','...')}`)}
        ${p(`<strong class="ctt-sub-line">VDRL:</strong> ${textarea('c7-hema-vdrl','...')}`)}
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
    document.querySelectorAll('.ctt-dynamic-body').forEach(autoGrow);
    refreshSexConditionals();

    const chkDental = document.getElementById('omit-chk-gi-dental');
    if (chkDental && appState['omit-gi-dental'] === 'true') {
      chkDental.checked = true;
      document.getElementById('block-gi-dental')?.classList.add('ctt-omitted');
    }

    const sexEl = document.getElementById('c5-sexo') || document.querySelector('.ctt-sex-M');
    if (!sexEl) refreshSexConditionals();
  }
};
