window.sheet3 = {
  id: 'sheet3',
  label: 'Hoja 3: Antecedentes No Patológicos',
  render() {
    return `
    <div class="sheet" id="sheet-3">
      <div class="sheet-header">
        <h1>Antecedentes No Patológicos</h1>
        <span class="sheet-number">Hoja 3</span>
      </div>
      <div class="sheet-body">
        <div class="sheet-bg" id="s3-bg"></div>

        <button class="btn-bg-image" onclick="triggerBgImage('s3-bg','s3-bg-input')">
          🖼 Agregar imagen de fondo
        </button>
        <input type="file" id="s3-bg-input" accept="image/*" style="display:none"
          onchange="setBgImage(event,'s3-bg','s3bg')" />

        <div class="grid-2">
          <div class="section-card">
            <h3>Hábitos y Estilo de Vida</h3>
            <div class="form-group">
              <label>Tabaquismo</label>
              <select id="s3-tabaquismo" onchange="saveFieldState('s3-tabaquismo')">
                <option value="">--</option><option>No</option><option>Ex-fumador</option><option>Activo</option>
              </select>
            </div>
            <div class="form-group">
              <label>Alcoholismo</label>
              <select id="s3-alcohol" onchange="saveFieldState('s3-alcohol')">
                <option value="">--</option><option>No</option><option>Ocasional</option><option>Frecuente</option><option>Crónico</option>
              </select>
            </div>
            <div class="form-group">
              <label>Drogas / Sustancias</label>
              <select id="s3-drogas" onchange="saveFieldState('s3-drogas')">
                <option value="">--</option><option>No</option><option>Sí</option><option>Ex-consumidor</option>
              </select>
            </div>
            <div class="form-group">
              <label>Actividad Física</label>
              <select id="s3-actividad" onchange="saveFieldState('s3-actividad')">
                <option value="">--</option><option>Sedentario</option><option>Ligera</option><option>Moderada</option><option>Intensa</option>
              </select>
            </div>
          </div>
          <div class="section-card">
            <h3>Alimentación y Sueño</h3>
            <div class="form-group">
              <label>Tipo de Alimentación</label>
              <select id="s3-alimentacion" onchange="saveFieldState('s3-alimentacion')">
                <option value="">--</option><option>Balanceada</option><option>Hipercalórica</option><option>Hipocalórica</option><option>Vegetariana</option><option>Vegana</option><option>Otra</option>
              </select>
            </div>
            <div class="form-group">
              <label>Horas de sueño promedio</label>
              <input type="text" id="s3-sueno" placeholder="Ej. 7-8 horas" oninput="saveFieldState('s3-sueno')" />
            </div>
            <div class="form-group">
              <label>Calidad del sueño</label>
              <select id="s3-calidad-sueno" onchange="saveFieldState('s3-calidad-sueno')">
                <option value="">--</option><option>Buena</option><option>Regular</option><option>Mala</option><option>Insomnio</option>
              </select>
            </div>
            <div class="form-group">
              <label>Ocupación</label>
              <input type="text" id="s3-ocupacion" placeholder="Ej. Oficinista" oninput="saveFieldState('s3-ocupacion')" />
            </div>
          </div>
        </div>

        <div class="section-card">
          <h3>Contexto Personal</h3>
          <div class="grid-2">
            <div class="form-group">
              <label>Estado Civil</label>
              <select id="s3-estado-civil" onchange="saveFieldState('s3-estado-civil')">
                <option value="">--</option><option>Soltero/a</option><option>Casado/a</option><option>Unión libre</option><option>Divorciado/a</option><option>Viudo/a</option>
              </select>
            </div>
            <div class="form-group">
              <label>Escolaridad</label>
              <select id="s3-escolaridad" onchange="saveFieldState('s3-escolaridad')">
                <option value="">--</option><option>Primaria</option><option>Secundaria</option><option>Bachillerato</option><option>Universidad</option><option>Posgrado</option>
              </select>
            </div>
            <div class="form-group">
              <label>Religión</label>
              <input type="text" id="s3-religion" placeholder="Opcional" oninput="saveFieldState('s3-religion')" />
            </div>
            <div class="form-group">
              <label>Lugar de residencia</label>
              <input type="text" id="s3-residencia" placeholder="Ciudad, Estado" oninput="saveFieldState('s3-residencia')" />
            </div>
          </div>
        </div>

        <div class="form-group">
          <label>Observaciones adicionales</label>
          <div class="editor-wrapper"><div id="s3-editor"></div></div>
        </div>
      </div>
    </div>`;
  },
  quill: null,
  initEditor() {
    if (document.getElementById('s3-editor') && !this.quill) {
      this.quill = new Quill('#s3-editor', { theme: 'snow', placeholder: 'Notas sobre antecedentes no patológicos...' });
      this.quill.on('text-change', () => {
        appState.s3EditorContent = this.quill.root.innerHTML;
        saveToStorage();
      });
      if (appState.s3EditorContent) this.quill.root.innerHTML = appState.s3EditorContent;
    }
  },
  restore() {
    restoreFields(['s3-tabaquismo','s3-alcohol','s3-drogas','s3-actividad','s3-alimentacion',
      's3-sueno','s3-calidad-sueno','s3-ocupacion','s3-estado-civil','s3-escolaridad','s3-religion','s3-residencia']);
    restoreBgImage('s3-bg','s3bg');
    this.quill = null;
    this.initEditor();
  }
};
