window.sheet10 = {
  id: 'sheet10',
  label: 'Hoja 10: Sistema Genitourinario',
  render() {
    return `
    <div class="sheet" id="sheet-10">
      <div class="sheet-header">
        <h1>Sistema Genitourinario</h1>
        <span class="sheet-number">Hoja 10</span>
      </div>
      <div class="sheet-body">

        <div class="section-card">
          <h3>Sexo del Paciente</h3>
          <div class="sex-selector">
            <div class="sex-btn" id="sex-m" onclick="sheet10.setSex('M')">♂ Masculino</div>
            <div class="sex-btn" id="sex-f" onclick="sheet10.setSex('F')">♀ Femenino</div>
          </div>
        </div>

        ${renderStudyItem({ id:'s10-sint', label:'Sintomatología Genitourinaria', fields:[
          {id:'s10-disuria',label:'Disuria',type:'select',opts:['No','Sí']},
          {id:'s10-poliuria',label:'Poliuria',type:'select',opts:['No','Sí']},
          {id:'s10-hematuria',label:'Hematuria',type:'select',opts:['No','Microscópica','Macroscópica']},
          {id:'s10-sint-obs',label:'Observaciones',type:'textarea',ph:'Detalles...'}
        ]})}

        ${renderStudyItem({ id:'s10-eco-rin', label:'Eco de Riñón', fields:[
          {id:'s10-eco-rin-fecha',label:'Fecha',type:'date'},
          {id:'s10-eco-rin-resultado',label:'Resultado',type:'select',opts:['Normal','Anormal','Limítrofe']},
          {id:'s10-eco-rin-obs',label:'Hallazgos',type:'textarea',ph:'Descripción ecográfica...'}
        ]})}

        <div id="s10-female-section">
          ${renderStudyItem({ id:'s10-eco-pelvis', label:'Eco de Pelvis (Mujer)', fields:[
            {id:'s10-eco-pelvis-fecha',label:'Fecha',type:'date'},
            {id:'s10-eco-pelvis-resultado',label:'Resultado',type:'select',opts:['Normal','Anormal','Limítrofe']},
            {id:'s10-eco-pelvis-obs',label:'Hallazgos',type:'textarea',ph:'Descripción...'}
          ]})}
          ${renderStudyItem({ id:'s10-mamo', label:'Mamografía y Eco de Mama (Mujer)', fields:[
            {id:'s10-mamo-fecha',label:'Fecha',type:'date'},
            {id:'s10-mamo-birads',label:'BI-RADS',type:'select',opts:['0','1','2','3','4A','4B','4C','5','6']},
            {id:'s10-mamo-resultado',label:'Resultado',type:'select',opts:['Normal','Anormal','Limítrofe']},
            {id:'s10-mamo-obs',label:'Hallazgos',type:'textarea',ph:'Descripción...'}
          ]})}
          ${renderStudyItem({ id:'s10-rm-mama', label:'RM de Mama (Mujer)', fields:[
            {id:'s10-rm-mama-fecha',label:'Fecha',type:'date'},
            {id:'s10-rm-mama-resultado',label:'Resultado',type:'select',opts:['Normal','Anormal','Limítrofe']},
            {id:'s10-rm-mama-obs',label:'Hallazgos',type:'textarea',ph:'Descripción...'}
          ]})}
        </div>

        <div id="s10-male-section">
          ${renderStudyItem({ id:'s10-eco-pros', label:'Eco de Próstata (Hombre)', fields:[
            {id:'s10-eco-pros-fecha',label:'Fecha',type:'date'},
            {id:'s10-eco-pros-vol',label:'Volumen prostático',type:'text',ph:'cc'},
            {id:'s10-eco-pros-resultado',label:'Resultado',type:'select',opts:['Normal','Anormal','Limítrofe']},
            {id:'s10-eco-pros-obs',label:'Hallazgos',type:'textarea',ph:'Descripción...'}
          ]})}
          ${renderStudyItem({ id:'s10-rm-pros', label:'RM Próstata Multiparamétrica (Hombre)', fields:[
            {id:'s10-rm-pros-fecha',label:'Fecha',type:'date'},
            {id:'s10-rm-pros-pirads',label:'PI-RADS',type:'select',opts:['1','2','3','4','5']},
            {id:'s10-rm-pros-resultado',label:'Resultado',type:'select',opts:['Normal','Anormal','Limítrofe']},
            {id:'s10-rm-pros-obs',label:'Hallazgos',type:'textarea',ph:'Descripción...'}
          ]})}
        </div>

        <div class="section-card">
          <h3>Laboratorios Genitourinarios</h3>
          ${[
            {id:'s10-orina',label:'General de Orina',unit:''},
            {id:'s10-urea',label:'Urea',unit:'mg/dL'},
            {id:'s10-creat',label:'Creatinina',unit:'mg/dL'},
            {id:'s10-nitro',label:'Nitrógeno Ureico (BUN)',unit:'mg/dL'},
            {id:'s10-tfg',label:'Tasa de Filtración Glomerular',unit:'mL/min/1.73m²'},
            {id:'s10-psa',label:'PSA (Hombre)',unit:'ng/mL'}
          ].map(f=>`
          <div class="result-row">
            <label>${f.label}</label>
            <input type="text" id="${f.id}" placeholder="Valor" oninput="saveFieldState('${f.id}')" />
            <span class="unit">${f.unit}</span>
            <select id="${f.id}-res" class="status-select" onchange="updateStatusStyle('${f.id}-res'); saveFieldState('${f.id}-res')">
              <option value="">--</option>
              <option>Normal</option><option>Anormal</option><option>Limítrofe</option>
            </select>
          </div>`).join('')}

          <div style="margin-top:14px;">
            <div style="font-weight:600;font-size:0.85rem;color:#34495e;margin-bottom:8px;text-transform:uppercase;">
              Laboratorios adicionales
            </div>
            <ul class="list-editable" id="s10-extra-labs"></ul>
            <button class="btn-secondary" onclick="sheet10.addExtraLab()">+ Agregar laboratorial</button>
          </div>
        </div>
      </div>
    </div>`;
  },
  setSex(sex) {
    appState.patientSex = sex;
    saveToStorage();
    document.getElementById('sex-m').className = 'sex-btn' + (sex==='M' ? ' active-m' : '');
    document.getElementById('sex-f').className = 'sex-btn' + (sex==='F' ? ' active-f' : '');
    const maleSection = document.getElementById('s10-male-section');
    const femaleSection = document.getElementById('s10-female-section');
    if (maleSection) maleSection.style.display = sex==='M' ? 'block' : 'none';
    if (femaleSection) femaleSection.style.display = sex==='F' ? 'block' : 'none';
    if (sex==='M') document.getElementById('s10-psa')?.closest('.result-row')?.style.removeProperty('display');
    if (sex==='F') document.getElementById('s10-psa')?.closest('.result-row')?.style.setProperty('display','none');
  },
  addExtraLab(label='', value='', result='') {
    const list = document.getElementById('s10-extra-labs');
    const li = document.createElement('li');
    li.style.gap='6px';
    li.innerHTML = `
      <input type="text" placeholder="Nombre del laboratorial" value="${label}"
        style="flex:1.2" oninput="sheet10.saveExtraLabs()" />
      <input type="text" placeholder="Valor" value="${value}"
        style="flex:0.8" oninput="sheet10.saveExtraLabs()" />
      <select class="status-select" onchange="updateStatusStyle(this); sheet10.saveExtraLabs()">
        <option value="">--</option><option ${result==='Normal'?'selected':''}>Normal</option>
        <option ${result==='Anormal'?'selected':''}>Anormal</option>
        <option ${result==='Limítrofe'?'selected':''}>Limítrofe</option>
      </select>
      <button class="btn-remove" onclick="this.parentElement.remove(); sheet10.saveExtraLabs()">✕</button>`;
    list.appendChild(li);
  },
  saveExtraLabs() {
    const rows = document.querySelectorAll('#s10-extra-labs li');
    appState.s10ExtraLabs = [...rows].map(li => {
      const inputs = li.querySelectorAll('input');
      const sel = li.querySelector('select');
      return { label: inputs[0]?.value||'', value: inputs[1]?.value||'', result: sel?.value||'' };
    });
    saveToStorage();
  },
  restore() {
    const sex = appState.patientSex;
    if (sex) setTimeout(()=>this.setSex(sex), 0);
    else {
      const ms = document.getElementById('s10-male-section');
      const fs = document.getElementById('s10-female-section');
      if (ms) ms.style.display = 'block';
      if (fs) fs.style.display = 'block';
    }
    const allFields = ['s10-disuria','s10-poliuria','s10-hematuria','s10-sint-obs',
      's10-eco-rin-fecha','s10-eco-rin-resultado','s10-eco-rin-obs',
      's10-eco-pelvis-fecha','s10-eco-pelvis-resultado','s10-eco-pelvis-obs',
      's10-mamo-fecha','s10-mamo-birads','s10-mamo-resultado','s10-mamo-obs',
      's10-rm-mama-fecha','s10-rm-mama-resultado','s10-rm-mama-obs',
      's10-eco-pros-fecha','s10-eco-pros-vol','s10-eco-pros-resultado','s10-eco-pros-obs',
      's10-rm-pros-fecha','s10-rm-pros-pirads','s10-rm-pros-resultado','s10-rm-pros-obs',
      's10-orina','s10-urea','s10-creat','s10-nitro','s10-tfg','s10-psa',
      's10-orina-res','s10-urea-res','s10-creat-res','s10-nitro-res','s10-tfg-res','s10-psa-res'];
    restoreFields(allFields);
    allFields.filter(f=>f.endsWith('-res')||f.endsWith('-resultado')).forEach(f=>updateStatusStyle(f));
    restoreStudies([
      {id:'s10-sint'},{id:'s10-eco-rin'},{id:'s10-eco-pelvis'},{id:'s10-mamo'},{id:'s10-rm-mama'},
      {id:'s10-eco-pros'},{id:'s10-rm-pros'}
    ]);
    (appState.s10ExtraLabs||[]).forEach(l => this.addExtraLab(l.label, l.value, l.result));
  }
};
