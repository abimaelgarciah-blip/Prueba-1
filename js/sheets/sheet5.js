window.sheet5 = {
  id: 'sheet5',
  label: 'Hoja 5: Examen Físico',
  render() {
    return `
    <div class="sheet" id="sheet-5">
      <div class="sheet-header">
        <h1>Examen Físico</h1>
        <span class="sheet-number">Hoja 5</span>
      </div>
      <div class="sheet-body">
        <div class="sheet-bg" id="s5-bg"></div>

        <button class="btn-bg-image" onclick="triggerBgImage('s5-bg','s5-bg-input')">
          🖼 Agregar imagen de fondo
        </button>
        <input type="file" id="s5-bg-input" accept="image/*" style="display:none"
          onchange="setBgImage(event,'s5-bg','s5bg')" />

        <div class="grid-2">
          <div class="section-card">
            <h3>Signos Vitales</h3>
            ${[
              {id:'s5-ta',label:'Tensión Arterial',ph:'Ej. 120/80 mmHg'},
              {id:'s5-fc',label:'Frecuencia Cardíaca',ph:'lpm'},
              {id:'s5-fr',label:'Frecuencia Respiratoria',ph:'rpm'},
              {id:'s5-temp',label:'Temperatura',ph:'°C'},
              {id:'s5-spo2',label:'SpO₂',ph:'%'},
              {id:'s5-glucosa',label:'Glucosa capilar',ph:'mg/dL'}
            ].map(f=>`
            <div class="result-row">
              <label>${f.label}</label>
              <input type="text" id="${f.id}" placeholder="${f.ph}" oninput="saveFieldState('${f.id}')" />
            </div>`).join('')}
          </div>

          <div class="section-card">
            <h3>Antropometría</h3>
            ${[
              {id:'s5-peso',label:'Peso',ph:'kg'},
              {id:'s5-talla',label:'Talla',ph:'cm'},
              {id:'s5-imc',label:'IMC',ph:'kg/m²'},
              {id:'s5-cintura',label:'Circunf. Cintura',ph:'cm'},
              {id:'s5-cadera',label:'Circunf. Cadera',ph:'cm'},
              {id:'s5-cc',label:'Índice Cintura/Cadera',ph:''}
            ].map(f=>`
            <div class="result-row">
              <label>${f.label}</label>
              <input type="text" id="${f.id}" placeholder="${f.ph}" oninput="saveFieldState('${f.id}')" />
            </div>`).join('')}
          </div>
        </div>

        ${[
          {title:'Cabeza y Cuello', id:'s5-cabeza'},
          {title:'Tórax y Pulmones', id:'s5-torax'},
          {title:'Corazón y Cardiovascular', id:'s5-corazon'},
          {title:'Abdomen', id:'s5-abdomen'},
          {title:'Sistema Musculoesquelético', id:'s5-musculo'},
          {title:'Sistema Neurológico', id:'s5-neuro'},
          {title:'Piel y Tegumentos', id:'s5-piel'},
          {title:'Genitourinario', id:'s5-genito'}
        ].map(s=>`
        <div class="section-card">
          <h3>${s.title}</h3>
          <div class="form-group">
            <label>Hallazgos</label>
            <textarea id="${s.id}" placeholder="Describe los hallazgos del examen..." oninput="saveFieldState('${s.id}')"></textarea>
          </div>
          <div class="result-row">
            <label>Resultado</label>
            <select class="status-select" id="${s.id}-status" onchange="updateStatusStyle('${s.id}-status'); saveFieldState('${s.id}-status')">
              <option value="">-- Resultado --</option>
              <option value="Normal">Normal</option>
              <option value="Anormal">Anormal</option>
              <option value="Limítrofe">Limítrofe</option>
            </select>
          </div>
        </div>`).join('')}

        <div class="form-group">
          <label>Observaciones generales del examen físico</label>
          <div class="editor-wrapper"><div id="s5-editor"></div></div>
        </div>
      </div>
    </div>`;
  },
  quill: null,
  initEditor() {
    if (document.getElementById('s5-editor') && !this.quill) {
      this.quill = new Quill('#s5-editor', { theme: 'snow', placeholder: 'Observaciones generales...' });
      this.quill.on('text-change', () => {
        appState.s5EditorContent = this.quill.root.innerHTML;
        saveToStorage();
      });
      if (appState.s5EditorContent) this.quill.root.innerHTML = appState.s5EditorContent;
    }
  },
  restore() {
    const fields = ['s5-ta','s5-fc','s5-fr','s5-temp','s5-spo2','s5-glucosa',
      's5-peso','s5-talla','s5-imc','s5-cintura','s5-cadera','s5-cc',
      's5-cabeza','s5-torax','s5-corazon','s5-abdomen','s5-musculo','s5-neuro','s5-piel','s5-genito',
      's5-cabeza-status','s5-torax-status','s5-corazon-status','s5-abdomen-status',
      's5-musculo-status','s5-neuro-status','s5-piel-status','s5-genito-status'];
    restoreFields(fields);
    fields.filter(f=>f.endsWith('-status')).forEach(f=>updateStatusStyle(f));
    restoreBgImage('s5-bg','s5bg');
    this.quill = null;
    this.initEditor();
  }
};
