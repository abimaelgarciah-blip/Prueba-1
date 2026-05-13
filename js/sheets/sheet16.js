window.sheet16 = {
  id: 'sheet16',
  label: 'Hoja 16: Conclusiones por Sistema',
  systems: [
    'Respiratorio','Cardiovascular','Gastrointestinal','Genitourinario',
    'Nervioso y Órganos de los Sentidos','Endocrino Metabólico',
    'Musculoesquelético','Hematopoyético','Examen Físico','General'
  ],
  render() {
    return `
    <div class="sheet" id="sheet-16">
      <div class="sheet-header">
        <h1>Conclusiones por Sistema</h1>
        <span class="sheet-number">Hoja 16</span>
      </div>
      <div class="sheet-body">
        <p style="color:#666;font-size:0.88rem;margin-bottom:20px;">
          Registre las alteraciones o hallazgos relevantes por sistema. Puede agregar conclusiones adicionales.
        </p>

        ${this.systems.map(sys => `
        <div class="section-card">
          <h3>Sistema ${sys}</h3>
          <ul class="list-editable" id="conc-list-${sys.replace(/\s+/g,'-')}"></ul>
          <button class="btn-secondary" style="margin-bottom:4px"
            onclick="sheet16.addConclusion('${sys.replace(/\s+/g,'-')}')">
            + Agregar conclusión
          </button>
        </div>`).join('')}

        <div class="section-card">
          <h3>Conclusiones Adicionales</h3>
          <ul class="list-editable" id="conc-list-extra"></ul>
          <button class="btn-secondary" onclick="sheet16.addConclusion('extra')">+ Agregar conclusión</button>
        </div>

        <div class="section-card" style="background:#fff8e1;border-color:#ffe082;">
          <h3 style="color:#b45309;">Resumen General</h3>
          <div class="editor-wrapper"><div id="s16-editor"></div></div>
        </div>
      </div>
    </div>`;
  },
  addConclusion(sysKey, value='') {
    const list = document.getElementById(`conc-list-${sysKey}`);
    if (!list) return;
    const li = document.createElement('li');
    li.innerHTML = `
      <textarea placeholder="Describa el hallazgo o alteración..."
        oninput="sheet16.saveConclusions('${sysKey}')">${value}</textarea>
      <button class="btn-remove" onclick="this.parentElement.remove(); sheet16.saveConclusions('${sysKey}')">✕</button>`;
    list.appendChild(li);
  },
  saveConclusions(sysKey) {
    const items = [...document.querySelectorAll(`#conc-list-${sysKey} textarea`)].map(t=>t.value);
    if (!appState.conclusions) appState.conclusions = {};
    appState.conclusions[sysKey] = items;
    saveToStorage();
  },
  quill: null,
  initEditor() {
    if (document.getElementById('s16-editor') && !this.quill) {
      this.quill = new Quill('#s16-editor', { theme:'snow', placeholder:'Resumen ejecutivo del estudio...' });
      this.quill.on('text-change', () => {
        appState.s16EditorContent = this.quill.root.innerHTML;
        saveToStorage();
      });
      if (appState.s16EditorContent) this.quill.root.innerHTML = appState.s16EditorContent;
    }
  },
  restore() {
    if (appState.conclusions) {
      Object.entries(appState.conclusions).forEach(([key, vals]) => {
        vals.forEach(v => this.addConclusion(key, v));
      });
    }
    this.quill = null;
    this.initEditor();
  }
};
