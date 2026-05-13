window.sheet12 = {
  id: 'sheet12',
  label: 'Hoja 12: Sistema Endocrino Metabólico',
  render() {
    return `
    <div class="sheet" id="sheet-12">
      <div class="sheet-header">
        <h1>Sistema Endocrino Metabólico</h1>
        <span class="sheet-number">Hoja 12</span>
      </div>
      <div class="sheet-body">

        <div class="section-card">
          <h3>Glucosa</h3>
          <div class="result-row">
            <label>Glucosa en ayunas</label>
            <input type="number" id="s12-glucosa" placeholder="Valor" oninput="saveFieldState('s12-glucosa')" />
            <span class="unit">mg/dL</span>
            <select id="s12-glucosa-res" class="status-select" onchange="updateStatusStyle('s12-glucosa-res');saveFieldState('s12-glucosa-res')">
              <option value="">--</option><option>Normal</option><option>Anormal</option><option>Limítrofe</option>
            </select>
          </div>
          <div class="result-row">
            <label>Hemoglobina Glucosilada (HbA1c)</label>
            <input type="number" id="s12-hba1c" placeholder="Valor" step="0.1" oninput="saveFieldState('s12-hba1c')" />
            <span class="unit">%</span>
            <select id="s12-hba1c-res" class="status-select" onchange="updateStatusStyle('s12-hba1c-res');saveFieldState('s12-hba1c-res')">
              <option value="">--</option><option>Normal</option><option>Anormal</option><option>Limítrofe</option>
            </select>
          </div>
        </div>

        <div class="section-card">
          <h3>Ácido Úrico</h3>
          <div class="result-row">
            <label>Ácido Úrico</label>
            <input type="number" id="s12-acido-urico" placeholder="Valor" step="0.1" oninput="saveFieldState('s12-acido-urico')" />
            <span class="unit">mg/dL</span>
            <select id="s12-acido-urico-res" class="status-select" onchange="updateStatusStyle('s12-acido-urico-res');saveFieldState('s12-acido-urico-res')">
              <option value="">--</option><option>Normal</option><option>Anormal</option><option>Limítrofe</option>
            </select>
          </div>
        </div>

        <div class="section-card">
          <h3>Perfil de Lípidos</h3>
          ${[
            {id:'s12-col-total',label:'Colesterol Total',unit:'mg/dL'},
            {id:'s12-hdl',label:'HDL Colesterol',unit:'mg/dL'},
            {id:'s12-ldl',label:'LDL Colesterol',unit:'mg/dL'},
            {id:'s12-trig',label:'Triglicéridos',unit:'mg/dL'},
            {id:'s12-vldl',label:'VLDL',unit:'mg/dL'},
            {id:'s12-col-hdl',label:'Índice Colesterol/HDL',unit:''}
          ].map(f=>`
          <div class="result-row">
            <label>${f.label}</label>
            <input type="number" id="${f.id}" placeholder="Valor" step="0.1" oninput="saveFieldState('${f.id}')" />
            <span class="unit">${f.unit}</span>
            <select id="${f.id}-res" class="status-select" onchange="updateStatusStyle('${f.id}-res');saveFieldState('${f.id}-res')">
              <option value="">--</option><option>Normal</option><option>Anormal</option><option>Limítrofe</option>
            </select>
          </div>`).join('')}
        </div>

        <div class="section-card" id="s12-ovarico-section">
          <h3>Perfil Ovárico (Mujer — 5 determinaciones)</h3>
          ${[
            {id:'s12-fsh',label:'FSH',unit:'mUI/mL'},
            {id:'s12-lh',label:'LH',unit:'mUI/mL'},
            {id:'s12-estradiol',label:'Estradiol (E2)',unit:'pg/mL'},
            {id:'s12-progest',label:'Progesterona',unit:'ng/mL'},
            {id:'s12-prolact',label:'Prolactina',unit:'ng/mL'}
          ].map(f=>`
          <div class="result-row">
            <label>${f.label}</label>
            <input type="number" id="${f.id}" placeholder="Valor" step="0.01" oninput="saveFieldState('${f.id}')" />
            <span class="unit">${f.unit}</span>
            <select id="${f.id}-res" class="status-select" onchange="updateStatusStyle('${f.id}-res');saveFieldState('${f.id}-res')">
              <option value="">--</option><option>Normal</option><option>Anormal</option><option>Limítrofe</option>
            </select>
          </div>`).join('')}
        </div>

        <div class="section-card">
          <h3>IMC y Composición Corporal</h3>
          <div class="grid-2">
            <div class="result-row">
              <label>IMC</label>
              <input type="number" id="s12-imc" placeholder="kg/m²" step="0.1" oninput="saveFieldState('s12-imc'); sheet12.calcIMCStatus()" />
              <span class="unit">kg/m²</span>
            </div>
            <div class="result-row">
              <label>Clasificación IMC</label>
              <input type="text" id="s12-imc-class" readonly placeholder="Automático" style="background:#f0f4fa;" />
            </div>
          </div>
          <div class="result-row">
            <label>% Grasa Corporal</label>
            <input type="number" id="s12-grasa" placeholder="%" step="0.1" oninput="saveFieldState('s12-grasa')" />
            <span class="unit">%</span>
          </div>
        </div>

      </div>
    </div>`;
  },
  calcIMCStatus() {
    const imc = parseFloat(document.getElementById('s12-imc')?.value);
    const classEl = document.getElementById('s12-imc-class');
    if (!classEl) return;
    if (isNaN(imc)) { classEl.value=''; return; }
    if (imc < 18.5) classEl.value = 'Bajo peso';
    else if (imc < 25) classEl.value = 'Normal';
    else if (imc < 30) classEl.value = 'Sobrepeso';
    else if (imc < 35) classEl.value = 'Obesidad grado I';
    else if (imc < 40) classEl.value = 'Obesidad grado II';
    else classEl.value = 'Obesidad grado III';
    saveFieldState('s12-imc-class');
  },
  restore() {
    const fields = ['s12-glucosa','s12-glucosa-res','s12-hba1c','s12-hba1c-res',
      's12-acido-urico','s12-acido-urico-res',
      's12-col-total','s12-col-total-res','s12-hdl','s12-hdl-res','s12-ldl','s12-ldl-res',
      's12-trig','s12-trig-res','s12-vldl','s12-vldl-res','s12-col-hdl','s12-col-hdl-res',
      's12-fsh','s12-fsh-res','s12-lh','s12-lh-res','s12-estradiol','s12-estradiol-res',
      's12-progest','s12-progest-res','s12-prolact','s12-prolact-res',
      's12-imc','s12-imc-class','s12-grasa'];
    restoreFields(fields);
    fields.filter(f=>f.endsWith('-res')).forEach(f=>updateStatusStyle(f));
    const sex = appState.patientSex;
    const ov = document.getElementById('s12-ovarico-section');
    if (ov) ov.style.display = sex==='M' ? 'none' : 'block';
  }
};
