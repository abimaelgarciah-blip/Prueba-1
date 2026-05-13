window.sheet2 = {
  id: 'sheet2',
  label: 'Hoja 2: Antecedentes Heredo Familiares',
  render() {
    return `
    <div class="sheet" id="sheet-2">
      <div class="sheet-header">
        <h1>Antecedentes Heredo Familiares</h1>
        <span class="sheet-number">Hoja 2</span>
      </div>
      <div class="sheet-body">
        <div class="sheet-bg" id="s2-bg"></div>

        <button class="btn-bg-image" onclick="triggerBgImage('s2-bg','s2-bg-input')">
          🖼 Agregar imagen de fondo
        </button>
        <input type="file" id="s2-bg-input" accept="image/*" style="display:none"
          onchange="setBgImage(event,'s2-bg','s2bg')" />

        <div class="section-card">
          <h3>Antecedentes Familiares</h3>
          <div class="grid-2">
            ${sheet2.familyFields.map(f => `
            <div class="form-group">
              <label>${f.label}</label>
              <select id="s2-${f.id}" onchange="saveFieldState('s2-${f.id}')">
                <option value="">-- --</option>
                <option value="Sí">Sí</option>
                <option value="No">No</option>
                <option value="Desconocido">Desconocido</option>
              </select>
            </div>`).join('')}
          </div>
        </div>

        <div class="form-group">
          <label>Observaciones adicionales</label>
          <div class="editor-wrapper" id="s2-editor-wrap">
            <div id="s2-editor"></div>
          </div>
        </div>

        <div class="section-card">
          <h3>Familiares con padecimientos relevantes</h3>
          <ul class="list-editable" id="s2-relatives-list"></ul>
          <button class="btn-secondary" onclick="sheet2.addRelative()">+ Agregar familiar</button>
        </div>
      </div>
    </div>`;
  },
  familyFields: [
    {id:'diabetes',label:'Diabetes Mellitus'},
    {id:'hta',label:'Hipertensión Arterial'},
    {id:'cancer',label:'Cáncer'},
    {id:'cardio',label:'Enf. Cardiovascular'},
    {id:'renal',label:'Enf. Renal'},
    {id:'pulmonar',label:'Enf. Pulmonar'},
    {id:'mental',label:'Enf. Mental/Psiquiátrica'},
    {id:'artritis',label:'Artritis / Reumatismo'},
    {id:'tiroides',label:'Enf. Tiroidea'},
    {id:'otros',label:'Otros'}
  ],
  addRelative(value='') {
    const list = document.getElementById('s2-relatives-list');
    const li = document.createElement('li');
    li.innerHTML = `
      <input type="text" placeholder="Ej. Padre: Diabetes tipo 2" value="${value}"
        oninput="sheet2.saveRelatives()" />
      <button class="btn-remove" onclick="this.parentElement.remove(); sheet2.saveRelatives()">✕</button>`;
    list.appendChild(li);
  },
  saveRelatives() {
    const items = [...document.querySelectorAll('#s2-relatives-list input')].map(i => i.value);
    appState.s2Relatives = items;
    saveToStorage();
  },
  quill: null,
  initEditor() {
    if (document.getElementById('s2-editor') && !this.quill) {
      this.quill = new Quill('#s2-editor', { theme: 'snow', placeholder: 'Notas sobre antecedentes familiares...' });
      this.quill.on('text-change', () => {
        appState.s2EditorContent = this.quill.root.innerHTML;
        saveToStorage();
      });
      if (appState.s2EditorContent) this.quill.root.innerHTML = appState.s2EditorContent;
    }
  },
  restore() {
    restoreFields(this.familyFields.map(f => `s2-${f.id}`));
    restoreBgImage('s2-bg','s2bg');
    (appState.s2Relatives||[]).forEach(v => this.addRelative(v));
    this.quill = null;
    this.initEditor();
  }
};
