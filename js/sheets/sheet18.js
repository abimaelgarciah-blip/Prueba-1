window.sheet18 = {
  id: 'sheet18',
  label: 'Hoja 18: Sugerencias al Paciente',
  categories: [
    'Alimentación y Nutrición',
    'Actividad Física',
    'Control de Enfermedades Crónicas',
    'Estudios de Seguimiento',
    'Interconsultas Sugeridas',
    'Medicamentos / Suplementos',
    'Estilo de Vida',
    'Otras Recomendaciones'
  ],
  render() {
    return `
    <div class="sheet" id="sheet-18">
      <div class="sheet-header">
        <h1>Sugerencias al Paciente</h1>
        <span class="sheet-number">Hoja 18</span>
      </div>
      <div class="sheet-body">
        <p style="color:#666;font-size:0.88rem;margin-bottom:20px;">
          Recomendaciones personalizadas del médico al paciente.
        </p>

        ${this.categories.map(cat => `
        <div class="section-card">
          <h3>${cat}</h3>
          <ul class="list-editable" id="sug-list-${cat.replace(/[\s\/]+/g,'-')}"></ul>
          <button class="btn-secondary" onclick="sheet18.addSuggestion('${cat.replace(/[\s\/]+/g,'-')}')">
            + Agregar recomendación
          </button>
        </div>`).join('')}

        <div class="section-card">
          <h3>Recomendaciones adicionales</h3>
          <ul class="list-editable" id="sug-list-extra"></ul>
          <button class="btn-secondary" onclick="sheet18.addSuggestion('extra')">+ Agregar</button>
        </div>

        <div class="section-card">
          <h3>Próxima Revisión</h3>
          <div class="grid-2">
            <div class="form-group">
              <label>Fecha de seguimiento</label>
              <input type="date" id="s18-followup" oninput="saveFieldState('s18-followup')" />
            </div>
            <div class="form-group">
              <label>Tiempo de revisión</label>
              <select id="s18-tiempo" onchange="saveFieldState('s18-tiempo')">
                <option value="">--</option>
                <option>1 mes</option><option>3 meses</option><option>6 meses</option>
                <option>1 año</option><option>Cuando sea necesario</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label>Notas de seguimiento</label>
            <textarea id="s18-notas" placeholder="Indicaciones adicionales..." oninput="saveFieldState('s18-notas')"></textarea>
          </div>
        </div>
      </div>
    </div>`;
  },
  addSuggestion(catKey, value='') {
    const list = document.getElementById(`sug-list-${catKey}`);
    if (!list) return;
    const li = document.createElement('li');
    li.innerHTML = `
      <textarea placeholder="Escriba la recomendación..."
        oninput="sheet18.saveSuggestions('${catKey}')">${value}</textarea>
      <button class="btn-remove" onclick="this.parentElement.remove(); sheet18.saveSuggestions('${catKey}')">✕</button>`;
    list.appendChild(li);
  },
  saveSuggestions(catKey) {
    const items = [...document.querySelectorAll(`#sug-list-${catKey} textarea`)].map(t=>t.value);
    if (!appState.suggestions) appState.suggestions = {};
    appState.suggestions[catKey] = items;
    saveToStorage();
  },
  restore() {
    restoreFields(['s18-followup','s18-tiempo','s18-notas']);
    if (appState.suggestions) {
      Object.entries(appState.suggestions).forEach(([key, vals]) => {
        vals.forEach(v => this.addSuggestion(key, v));
      });
    }
  }
};
