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
        ${p(`<strong class="ctt-sub-line">Síntomas respiratorios:</strong> ${input('c7-resp-sint')}`)}
        ${p(`<strong class="ctt-sub-line">Espirometría:</strong> ${input('c7-resp-espiro')}`)}
        ${p(`<strong class="ctt-sub-line">Radiografía de tórax:</strong> ${input('c7-resp-rx')}`)}
        ${renderDynamicBlock('c7-resp-extra','+ Agregar campo a Respiratorio')}
      </div>

      <!-- CARDIOVASCULAR -->
      <div id="block-sis-card">
        ${h1('SISTEMA CARDIOVASCULAR')}
        ${p(`<strong class="ctt-sub-line">Prueba de esfuerzo:</strong> ${input('c7-card-pef')}`)}
        ${p(`<strong class="ctt-sub-line">Electrocardiograma:</strong> ${input('c7-card-ecg')}`)}
        ${renderDynamicBlock('c7-card-extra','+ Agregar campo a Cardiovascular')}
      </div>

      <!-- GASTROINTESTINAL -->
      <div id="block-sis-gi">
        ${h1('SISTEMA GASTROINTESTINAL')}
        ${p(`<strong class="ctt-sub-line">Sintomatología:</strong> ${input('c7-gi-sint')}`)}
        ${p(`<strong class="ctt-sub-line">Ultrasonido abdominal:</strong> ${input('c7-gi-eco')}`)}
        ${p(`<strong class="ctt-sub-line">Pruebas de función hepática:</strong> ${input('c7-gi-pfh')}`)}
        ${p(`<strong class="ctt-sub-line">Coprológico:</strong> ${input('c7-gi-copro')}`)}
        ${p(`<strong class="ctt-sub-line">Coproparasitoscópico:</strong> ${input('c7-gi-coprop')}`)}
        ${p(`<strong class="ctt-sub-line">Evaluación odontológica:</strong> ${input('c7-gi-dental')}`)}
        ${renderDynamicBlock('c7-gi-extra','+ Agregar campo a Gastrointestinal')}
      </div>

      <!-- GENITO-URINARIO -->
      <div id="block-sis-gu">
        ${h1('SISTEMA GENITO-URINARIO')}
        ${p(`<strong class="ctt-sub-line">Sintomatología:</strong> ${input('c7-gu-sint')}`)}
        ${p(`<strong class="ctt-sub-line">Ecosonograma renal:</strong> ${input('c7-gu-ecoR')}`)}
        ${renderIfSex('M', p(`<strong class="ctt-sub-line">Ecosonograma prostático:</strong> ${input('c7-gu-ecoP')}`))}
        ${renderIfSex('F', p(`<strong class="ctt-sub-line">Ecosonograma pélvico:</strong> ${input('c7-gu-ecoPel')}`))}
        ${p(`<strong class="ctt-sub-line">General de orina:</strong> ${input('c7-gu-orina')}`)}
        ${p(`<strong class="ctt-sub-line">Urea:</strong> ${input('c7-gu-urea','','sm')}`)}
        ${p(`<strong class="ctt-sub-line">Creatinina:</strong> ${input('c7-gu-creat','','sm')}`)}
        ${p(`<strong class="ctt-sub-line">Nitrógeno uréico:</strong> ${input('c7-gu-nitro','','sm')}`)}
        ${p(`<strong class="ctt-sub-line">Tasa de filtración glomerular:</strong> ${input('c7-gu-tfg','','sm')}`)}
        ${renderIfSex('M', p(`<strong class="ctt-sub-line">Antígeno prostático:</strong> ${input('c7-gu-psa','','sm')}`))}
        ${renderDynamicBlock('c7-gu-extra','+ Agregar campo a Genito-Urinario')}
      </div>

      <!-- NERVIOSO -->
      <div id="block-sis-nerv">
        ${h1('SISTEMA NERVIOSO Y ÓRGANOS DE LOS SENTIDOS')}
        ${p(`<strong class="ctt-sub-line">Sintomatología:</strong> ${input('c7-nerv-sint')}`)}
        ${p(`<strong class="ctt-sub-line">Valoración oftalmológica:</strong> ${input('c7-nerv-oftal')}`)}
        ${p(`<strong class="ctt-sub-line">Audiometría:</strong> ${input('c7-nerv-audio')}`)}
        ${renderDynamicBlock('c7-nerv-extra','+ Agregar campo a Nervioso')}
      </div>

      <!-- ENDOCRINO -->
      <div id="block-sis-endo">
        ${h1('SISTEMA ENDOCRINO METABÓLICO')}
        ${p(`<strong class="ctt-sub-line">Glucosa:</strong> ${input('c7-endo-gluc','','sm')}`)}
        ${p(`<strong class="ctt-sub-line">Ácido úrico:</strong> ${input('c7-endo-au','','sm')}`)}
        ${p(`<strong class="ctt-sub-line">Colesterol total:</strong> ${input('c7-endo-colT','','sm')}`)}
        ${p(`<strong class="ctt-sub-line">Triglicéridos:</strong> ${input('c7-endo-trig','','sm')}`)}
        ${p(`<strong class="ctt-sub-line">HDL:</strong> ${input('c7-endo-hdl','','sm')}`)}
        ${p(`<strong class="ctt-sub-line">LDL:</strong> ${input('c7-endo-ldl','','sm')}`)}
        ${renderIfSex('F', p(`<strong class="ctt-sub-line">LH:</strong> ${input('c7-endo-lh','','sm')}`))}
        ${renderIfSex('F', p(`<strong class="ctt-sub-line">FSH:</strong> ${input('c7-endo-fsh','','sm')}`))}
        ${renderIfSex('F', p(`<strong class="ctt-sub-line">Prolactina:</strong> ${input('c7-endo-prl','','sm')}`))}
        ${renderIfSex('F', p(`<strong class="ctt-sub-line">Progesterona:</strong> ${input('c7-endo-prog','','sm')}`))}
        ${renderIfSex('F', p(`<strong class="ctt-sub-line">Estradiol:</strong> ${input('c7-endo-est','','sm')}`))}
        ${p(`<strong class="ctt-sub-line">IMC:</strong> ${input('c7-endo-imc','','sm')} &nbsp;—&nbsp; clasificado como ${input('c7-endo-imcClass')}`)}
        ${renderDynamicBlock('c7-endo-extra','+ Agregar campo a Endocrino')}
      </div>

      <!-- MUSCULOESQUELÉTICO -->
      <div id="block-sis-muscu">
        ${h1('SISTEMA MUSCULOESQUELÉTICO')}
        ${p(`<strong class="ctt-sub-line">Sintomatología:</strong> ${input('c7-muscu-sint')}`)}
        ${p(`<strong class="ctt-sub-line">Radiografía de columna lumbar:</strong> ${input('c7-muscu-rx')}`)}
        ${p(`<strong class="ctt-sub-line">Densitometría:</strong> ${input('c7-muscu-densi')}`)}
        ${renderDynamicBlock('c7-muscu-extra','+ Agregar campo a Musculoesquelético')}
      </div>

      <!-- HEMATOPOYÉTICO -->
      <div id="block-sis-hema">
        ${h1('SISTEMA HEMATOPOYÉTICO Y CÉLULAS EN SANGRE')}
        ${p(`<strong class="ctt-sub-line">Biometría hemática:</strong> ${input('c7-hema-bh')}`)}
        ${p(`<strong class="ctt-sub-line">Calcio:</strong> ${input('c7-hema-ca','','sm')}`)}
        ${p(`<strong class="ctt-sub-line">Fósforo:</strong> ${input('c7-hema-p','','sm')}`)}
        ${p(`<strong class="ctt-sub-line">Sodio:</strong> ${input('c7-hema-na','','sm')}`)}
        ${p(`<strong class="ctt-sub-line">Potasio:</strong> ${input('c7-hema-k','','sm')}`)}
        ${p(`<strong class="ctt-sub-line">Cloro:</strong> ${input('c7-hema-cl','','sm')}`)}
        ${p(`<strong class="ctt-sub-line">Hierro sérico:</strong> ${input('c7-hema-fe','','sm')}`)}
        ${p(`<strong class="ctt-sub-line">Grupo sanguíneo:</strong> ${input('c7-hema-grupo','','sm')}`)}
        ${p(`<strong class="ctt-sub-line">Anticuerpos VIH y antígeno p24:</strong> ${input('c7-hema-vih')}`)}
        ${p(`<strong class="ctt-sub-line">VDRL:</strong> ${input('c7-hema-vdrl','','sm')}`)}
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

    const sexEl = document.getElementById('c5-sexo') || document.querySelector('.ctt-sex-M');
    if (!sexEl) refreshSexConditionals();
  }
};
