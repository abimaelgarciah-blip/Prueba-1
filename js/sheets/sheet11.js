window.sheet11 = {
  id: 'contenido-sugerencias',
  label: 'Contenido Sugerencias',
  type: 'content',
  membreteKey: 'mb-11',

  render() {
    const inner = `
      ${h1('SUGERENCIAS')}
      ${renderNumberedList('c11-sugs','Escriba la sugerencia...')}

      <div class="ctt-firma-centered">
        <div class="ctt-doctor-select no-print">
          <label class="ctt-doctor-label">Seleccionar doctor guardado:</label>
          <select id="c11-doctor-select" onchange="loadDoctorForSugerencia()">
            <option value="">-- Elegir doctor --</option>
          </select>
        </div>

        <div id="c11-firma-display" class="ctt-firma-centered-display">
          <span class="ctt-firma-placeholder">Cargue un doctor con firma guardada o suba una imagen</span>
        </div>
        <div class="ctt-firma-line"></div>
        <p class="ctt-firma-doc-line"><strong id="c11-doc-nombre-show">Dr. Nombre Apellido</strong></p>
        <p class="ctt-firma-doc-line">Cédula Profesional: <span id="c11-doc-cedula-show">_____</span></p>
        <p class="ctt-firma-doc-line">Especialidad: <span id="c11-doc-especialidad-show">_____</span></p>

        <div class="ctt-firma-edit no-print">
          <div class="grid-2" style="margin-top:14px">
            <div class="form-group"><label>Nombre del doctor</label>
              ${input('c11-doc-nombre','Dr. Nombre Apellido')}</div>
            <div class="form-group"><label>Cédula Profesional</label>
              ${input('c11-doc-cedula','número de cédula')}</div>
            <div class="form-group"><label>Especialidad</label>
              ${input('c11-doc-especialidad','especialidad')}</div>
          </div>
          <div style="margin-top:10px">
            <button class="btn-secondary" onclick="document.getElementById('c11-firma-input').click()">
              📎 Subir imagen de firma
            </button>
            <input type="file" id="c11-firma-input" style="display:none"
              accept="image/*" onchange="uploadSugerenciaFirma(event)" />
            <button class="btn-remove" onclick="clearSugerenciaFirma()">✕ Quitar firma</button>
          </div>
        </div>
      </div>
    `;
    return renderContentWrapper(this.membreteKey, this.label, inner);
  },

  async restore() {
    document.querySelectorAll('.ctt-numbered-body').forEach(autoGrow);

    restoreFields(['c11-doc-nombre','c11-doc-cedula','c11-doc-especialidad']);
    syncSugerenciaDoctorDisplay();

    ['c11-doc-nombre','c11-doc-cedula','c11-doc-especialidad'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('input', syncSugerenciaDoctorDisplay);
    });

    const sel = document.getElementById('c11-doctor-select');
    if (sel) {
      try {
        const { data, error } = await supabase.from('doctors').select('*').order('nombre');
        if (error) throw error;
        sel.innerHTML = '<option value="">-- Elegir doctor --</option>' +
          (data||[]).map(d => `<option value="${d.id}">${d.nombre} — ${d.especialidad||''}</option>`).join('');
      } catch {
        const local = JSON.parse(localStorage.getItem('doctorProfiles') || '[]');
        sel.innerHTML = '<option value="">-- Elegir doctor --</option>' +
          local.map(d => `<option value="${d.id}">${d.nombre} — ${d.especialidad||''}</option>`).join('');
      }
    }

    if (appState['c11-firma-img']) {
      const display = document.getElementById('c11-firma-display');
      if (display) display.innerHTML = `<img src="${appState['c11-firma-img']}" />`;
    }
  }
};

function syncSugerenciaDoctorDisplay() {
  const set = (id, val, prefix='') => {
    const el = document.getElementById(id);
    if (el) el.textContent = val ? prefix + val : '_____';
  };
  set('c11-doc-nombre-show', appState['c11-doc-nombre'] || '', '');
  set('c11-doc-cedula-show', appState['c11-doc-cedula'] || '');
  set('c11-doc-especialidad-show', appState['c11-doc-especialidad'] || '');
}

async function loadDoctorForSugerencia() {
  const id = document.getElementById('c11-doctor-select').value;
  if (!id) return;
  let doctor;
  try {
    const { data } = await supabase.from('doctors').select('*').eq('id', id).single();
    doctor = data;
  } catch {
    const local = JSON.parse(localStorage.getItem('doctorProfiles') || '[]');
    doctor = local.find(d => String(d.id) === String(id));
  }
  if (!doctor) return;
  const setField = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.value = val || '';
    appState[id] = val || '';
  };
  setField('c11-doc-nombre',       doctor.nombre);
  setField('c11-doc-cedula',       doctor.cedula);
  setField('c11-doc-especialidad', doctor.especialidad);
  const firma = doctor.signature_image || doctor.signature_data;
  if (firma) {
    appState['c11-firma-img'] = firma;
    const display = document.getElementById('c11-firma-display');
    if (display) display.innerHTML = `<img src="${firma}" />`;
  }
  saveToStorage();
  syncSugerenciaDoctorDisplay();
}

function uploadSugerenciaFirma(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    appState['c11-firma-img'] = ev.target.result;
    saveToStorage();
    const display = document.getElementById('c11-firma-display');
    if (display) display.innerHTML = `<img src="${ev.target.result}" />`;
  };
  reader.readAsDataURL(file);
}

function clearSugerenciaFirma() {
  delete appState['c11-firma-img'];
  saveToStorage();
  const display = document.getElementById('c11-firma-display');
  if (display) display.innerHTML = '<span class="ctt-firma-placeholder">Cargue un doctor con firma guardada o suba una imagen</span>';
}
