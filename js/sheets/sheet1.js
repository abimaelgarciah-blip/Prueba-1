window.sheet1 = {
  id: 'sheet1',
  label: 'Hoja 1: Presentación del Estudio',
  render() {
    return `
    <div class="sheet" id="sheet-1">
      <div class="sheet-header">
        <h1>Presentación del Estudio</h1>
        <span class="sheet-number">Hoja 1</span>
      </div>
      <div class="sheet-body">
        <div class="cover-sheet">
          <div class="cover-image-area" id="cover-drop" onclick="document.getElementById('cover-img-input').click()">
            <img id="cover-img-preview" src="" alt="" style="display:none;width:100%;height:100%;object-fit:contain;" />
            <div class="cover-image-placeholder" id="cover-placeholder">
              <svg width="48" height="48" fill="none" stroke="#b0bec5" stroke-width="1.5" viewBox="0 0 24 24">
                <rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/>
                <path d="M21 15l-5-5L5 21"/>
              </svg>
              <p style="margin-top:8px;">Haz clic para subir<br>imagen del estudio</p>
            </div>
          </div>
          <input type="file" id="cover-img-input" accept="image/*" style="display:none" onchange="sheet1.onImageChange(event)" />

          <div style="width:100%;max-width:420px;">
            <div class="form-group">
              <label>Nombre del Estudio / Clínica</label>
              <input type="text" id="s1-clinic" placeholder="Ej. Centro Médico San Rafael" oninput="saveFieldState('s1-clinic')" />
            </div>
            <div class="form-group">
              <label>Nombre del Paciente</label>
              <input type="text" id="s1-patient" placeholder="Nombre completo" oninput="saveFieldState('s1-patient'); updatePatientName()" />
            </div>
            <div class="grid-2">
              <div class="form-group">
                <label>Fecha del Estudio</label>
                <input type="date" id="s1-date" oninput="saveFieldState('s1-date')" />
              </div>
              <div class="form-group">
                <label>Expediente / ID</label>
                <input type="text" id="s1-id" placeholder="Nº de expediente" oninput="saveFieldState('s1-id')" />
              </div>
            </div>
            <div class="grid-2">
              <div class="form-group">
                <label>Edad</label>
                <input type="text" id="s1-age" placeholder="Ej. 45 años" oninput="saveFieldState('s1-age')" />
              </div>
              <div class="form-group">
                <label>Sexo</label>
                <select id="s1-sex" onchange="saveFieldState('s1-sex')">
                  <option value="">-- Seleccionar --</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Femenino">Femenino</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>`;
  },
  onImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const img = document.getElementById('cover-img-preview');
      img.src = ev.target.result;
      img.style.display = 'block';
      document.getElementById('cover-placeholder').style.display = 'none';
      appState.coverImage = ev.target.result;
      saveToStorage();
    };
    reader.readAsDataURL(file);
  },
  restore() {
    if (appState.coverImage) {
      const img = document.getElementById('cover-img-preview');
      if (img) {
        img.src = appState.coverImage;
        img.style.display = 'block';
        const ph = document.getElementById('cover-placeholder');
        if (ph) ph.style.display = 'none';
      }
    }
    restoreFields(['s1-clinic','s1-patient','s1-date','s1-id','s1-age','s1-sex']);
  }
};
