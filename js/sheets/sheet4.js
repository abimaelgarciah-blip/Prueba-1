window.sheet4 = {
  id: 'sheet4',
  label: 'Hoja 4: Antecedentes Personales Patológicos',
  render() {
    return `
    <div class="sheet" id="sheet-4">
      <div class="sheet-header">
        <h1>Antecedentes Personales Patológicos</h1>
        <span class="sheet-number">Hoja 4</span>
      </div>
      <div class="sheet-body">
        <div class="sheet-bg" id="s4-bg"></div>

        <button class="btn-bg-image" onclick="triggerBgImage('s4-bg','s4-bg-input')">
          🖼 Agregar imagen de fondo
        </button>
        <input type="file" id="s4-bg-input" accept="image/*" style="display:none"
          onchange="setBgImage(event,'s4-bg','s4bg')" />

        <div class="grid-2">
          <div class="section-card">
            <h3>Enfermedades Crónicas</h3>
            ${[
              {id:'s4-dm',label:'Diabetes Mellitus'},
              {id:'s4-hta2',label:'Hipertensión Arterial'},
              {id:'s4-cardio',label:'Enf. Cardiovascular'},
              {id:'s4-pulmonar',label:'Enf. Pulmonar'},
              {id:'s4-renal',label:'Enf. Renal'},
              {id:'s4-hepatica',label:'Enf. Hepática'},
              {id:'s4-tiroides',label:'Enf. Tiroidea'},
              {id:'s4-cancer2',label:'Cáncer (especificar)'}
            ].map(f=>`
            <div class="form-group">
              <label>${f.label}</label>
              <select id="${f.id}" onchange="saveFieldState('${f.id}')">
                <option value="">--</option><option>No</option><option>Sí</option><option>En tratamiento</option>
              </select>
            </div>`).join('')}
          </div>

          <div>
            <div class="section-card">
              <h3>Cirugías y Hospitalizaciones</h3>
              <ul class="list-editable" id="s4-cirugias-list"></ul>
              <button class="btn-secondary" style="margin-bottom:10px" onclick="sheet4.addItem('s4-cirugias-list','s4Cirugias','Ej. Apendicectomía 2018')">+ Agregar</button>
            </div>

            <div class="section-card">
              <h3>Alergias</h3>
              <ul class="list-editable" id="s4-alergias-list"></ul>
              <button class="btn-secondary" style="margin-bottom:10px" onclick="sheet4.addItem('s4-alergias-list','s4Alergias','Ej. Penicilina')">+ Agregar</button>
            </div>

            <div class="section-card">
              <h3>Medicamentos Actuales</h3>
              <ul class="list-editable" id="s4-meds-list"></ul>
              <button class="btn-secondary" onclick="sheet4.addItem('s4-meds-list','s4Meds','Ej. Metformina 500mg/día')">+ Agregar</button>
            </div>
          </div>
        </div>

        <div class="section-card">
          <h3>Antecedentes Prostáticos</h3>
          <div class="grid-2">
            <div class="form-group">
              <label>Síntomas urinarios previos</label>
              <select id="s4-sintomas-uri" onchange="saveFieldState('s4-sintomas-uri')">
                <option value="">--</option><option>No</option><option>Sí</option>
              </select>
            </div>
            <div class="form-group">
              <label>Diagnóstico previo de próstata</label>
              <select id="s4-dx-prostata" onchange="saveFieldState('s4-dx-prostata')">
                <option value="">--</option><option>No</option><option>Hiperplasia benigna</option><option>Prostatitis</option><option>Cáncer de próstata</option>
              </select>
            </div>
            <div class="form-group">
              <label>Último PSA (valor)</label>
              <input type="text" id="s4-psa-prev" placeholder="Ej. 2.4 ng/mL" oninput="saveFieldState('s4-psa-prev')" />
            </div>
            <div class="form-group">
              <label>Tratamiento previo</label>
              <input type="text" id="s4-trat-prostata" placeholder="Especificar" oninput="saveFieldState('s4-trat-prostata')" />
            </div>
          </div>
        </div>

        <div class="form-group">
          <label>Observaciones adicionales</label>
          <div class="editor-wrapper"><div id="s4-editor"></div></div>
        </div>
      </div>
    </div>`;
  },
  addItem(listId, stateKey, placeholder='') {
    const list = document.getElementById(listId);
    const li = document.createElement('li');
    li.innerHTML = `
      <input type="text" placeholder="${placeholder}"
        oninput="sheet4.saveList('${listId}','${stateKey}')" />
      <button class="btn-remove" onclick="this.parentElement.remove(); sheet4.saveList('${listId}','${stateKey}')">✕</button>`;
    list.appendChild(li);
  },
  saveList(listId, stateKey) {
    appState[stateKey] = [...document.querySelectorAll(`#${listId} input`)].map(i=>i.value);
    saveToStorage();
  },
  quill: null,
  initEditor() {
    if (document.getElementById('s4-editor') && !this.quill) {
      this.quill = new Quill('#s4-editor', { theme: 'snow', placeholder: 'Notas sobre antecedentes patológicos...' });
      this.quill.on('text-change', () => {
        appState.s4EditorContent = this.quill.root.innerHTML;
        saveToStorage();
      });
      if (appState.s4EditorContent) this.quill.root.innerHTML = appState.s4EditorContent;
    }
  },
  restore() {
    restoreFields(['s4-dm','s4-hta2','s4-cardio','s4-pulmonar','s4-renal','s4-hepatica',
      's4-tiroides','s4-cancer2','s4-sintomas-uri','s4-dx-prostata','s4-psa-prev','s4-trat-prostata']);
    restoreBgImage('s4-bg','s4bg');
    (appState.s4Cirugias||[]).forEach(v => { this.addItem('s4-cirugias-list','s4Cirugias'); document.querySelector('#s4-cirugias-list li:last-child input').value=v; });
    (appState.s4Alergias||[]).forEach(v => { this.addItem('s4-alergias-list','s4Alergias'); document.querySelector('#s4-alergias-list li:last-child input').value=v; });
    (appState.s4Meds||[]).forEach(v => { this.addItem('s4-meds-list','s4Meds'); document.querySelector('#s4-meds-list li:last-child input').value=v; });
    this.quill = null;
    this.initEditor();
  }
};
