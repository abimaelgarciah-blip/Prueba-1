window.sheet14 = {
  id: 'sheet14',
  label: 'Hoja 14: Sistema Hematopoyético',
  render() {
    return `
    <div class="sheet" id="sheet-14">
      <div class="sheet-header">
        <h1>Sistema Hematopoyético</h1>
        <span class="sheet-number">Hoja 14</span>
      </div>
      <div class="sheet-body">

        <div class="section-card">
          <h3>Biometría Hemática</h3>
          ${[
            {id:'s14-hb',label:'Hemoglobina',unit:'g/dL'},
            {id:'s14-hto',label:'Hematocrito',unit:'%'},
            {id:'s14-leuco',label:'Leucocitos',unit:'×10³/μL'},
            {id:'s14-plaq',label:'Plaquetas',unit:'×10³/μL'},
            {id:'s14-vcm',label:'VCM',unit:'fL'},
            {id:'s14-hcm',label:'HCM',unit:'pg'}
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
          <h3>Hierro y Electrolitos</h3>
          ${[
            {id:'s14-hierro',label:'Hierro Sérico',unit:'μg/dL'},
            {id:'s14-ferritina',label:'Ferritina',unit:'ng/mL'},
            {id:'s14-sodio',label:'Sodio',unit:'mEq/L'},
            {id:'s14-potasio',label:'Potasio',unit:'mEq/L'},
            {id:'s14-calcio',label:'Calcio',unit:'mg/dL'},
            {id:'s14-magnesio',label:'Magnesio',unit:'mg/dL'},
            {id:'s14-fosforo',label:'Fósforo',unit:'mg/dL'}
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
          <h3>Grupo Sanguíneo e Inmunología</h3>
          <div class="grid-2">
            <div class="form-group">
              <label>Grupo Sanguíneo</label>
              <select id="s14-grupo" onchange="saveFieldState('s14-grupo')">
                <option value="">--</option>
                <option>A+</option><option>A-</option>
                <option>B+</option><option>B-</option>
                <option>AB+</option><option>AB-</option>
                <option>O+</option><option>O-</option>
              </select>
            </div>
            <div class="form-group">
              <label>Factor Rh</label>
              <select id="s14-rh" onchange="saveFieldState('s14-rh')">
                <option value="">--</option>
                <option>Positivo (+)</option><option>Negativo (-)</option>
              </select>
            </div>
          </div>

          <div class="result-row" style="margin-top:12px">
            <label>Anticuerpos VIH + Antígeno p24</label>
            <input type="text" id="s14-vih" placeholder="Valor/resultado" oninput="saveFieldState('s14-vih')" />
            <select id="s14-vih-res" class="status-select" onchange="updateStatusStyle('s14-vih-res');saveFieldState('s14-vih-res')">
              <option value="">--</option><option>No reactivo</option><option>Reactivo</option><option>Indeterminado</option>
            </select>
          </div>

          <div class="result-row">
            <label>VDRL (Sífilis)</label>
            <input type="text" id="s14-vdrl" placeholder="Título / resultado" oninput="saveFieldState('s14-vdrl')" />
            <select id="s14-vdrl-res" class="status-select" onchange="updateStatusStyle('s14-vdrl-res');saveFieldState('s14-vdrl-res')">
              <option value="">--</option><option>No reactivo</option><option>Reactivo</option>
            </select>
          </div>
        </div>

      </div>
    </div>`;
  },
  restore() {
    const fields = ['s14-hb','s14-hto','s14-leuco','s14-plaq','s14-vcm','s14-hcm',
      's14-hierro','s14-ferritina','s14-sodio','s14-potasio','s14-calcio','s14-magnesio','s14-fosforo',
      's14-grupo','s14-rh','s14-vih','s14-vdrl',
      's14-hb-res','s14-hto-res','s14-leuco-res','s14-plaq-res','s14-vcm-res','s14-hcm-res',
      's14-hierro-res','s14-ferritina-res','s14-sodio-res','s14-potasio-res',
      's14-calcio-res','s14-magnesio-res','s14-fosforo-res','s14-vih-res','s14-vdrl-res'];
    restoreFields(fields);
    fields.filter(f=>f.endsWith('-res')).forEach(f=>updateStatusStyle(f));
  }
};
