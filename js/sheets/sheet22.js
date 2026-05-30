window.sheet22 = {
  id: 'firma-doctor',
  label: 'Firma del Doctor',
  type: 'signature',

  render() {
    return `
    <div class="sheet content-sheet">
      ${renderMembreteBg('mb-22')}
      <div class="content-sheet-toolbar">
        <strong>Firma del Doctor</strong>
        ${renderMembreteControl('mb-22')}
      </div>
      <div class="content-page-area">
        ${h1('DATOS Y FIRMA DEL DOCTOR')}

        <div class="ctt-doctor-select">
          <label class="ctt-doctor-label">Seleccionar doctor guardado:</label>
          <select id="c22-doctor-select" onchange="loadSelectedDoctor()">
            <option value="">-- Elegir doctor --</option>
          </select>
        </div>

        ${p(`<strong class="ctt-sub-line">Nombre:</strong> ${input('c22-nombre','Dr. Nombre Apellido')}`)}
        ${p(`<strong class="ctt-sub-line">Cédula Profesional:</strong> ${input('c22-cedula','número de cédula')}`)}
        ${p(`<strong class="ctt-sub-line">Especialidad:</strong> ${input('c22-especialidad','especialidad')}`)}
        ${p(`<strong class="ctt-sub-line">Institución:</strong> ${input('c22-clinica','clínica / consultorio')}`)}

        <div class="ctt-firma-area">
          <p class="ctt-firma-label">Firma:</p>
          <div id="c22-firma-display" class="ctt-firma-display">
            <span class="ctt-firma-placeholder">Cargue un doctor con firma guardada o suba una imagen</span>
          </div>
          <button class="btn-secondary" onclick="document.getElementById('c22-firma-input').click()">
            📎 Subir imagen de firma
          </button>
          <input type="file" id="c22-firma-input" style="display:none"
            accept="image/*" onchange="uploadFirmaImage(event)" />
          <button class="btn-remove" onclick="clearFirmaImage()">✕ Quitar firma</button>
        </div>
      </div>
    </div>`;
  },

  async restore() {
    restoreFields(['c22-nombre','c22-cedula','c22-especialidad','c22-clinica']);
    // Cargar lista de doctores
    const sel = document.getElementById('c22-doctor-select');
    if (!sel) return;
    try {
      const { data, error } = await supabase.from('doctors').select('*').order('nombre');
      if (error) throw error;
      sel.innerHTML = '<option value="">-- Elegir doctor --</option>' +
        (data||[]).map(d => `<option value="${d.id}">Dr. ${d.nombre} — ${d.especialidad||''}</option>`).join('');
    } catch {
      const local = JSON.parse(localStorage.getItem('doctorProfiles') || '[]');
      sel.innerHTML = '<option value="">-- Elegir doctor --</option>' +
        local.map(d => `<option value="${d.id}">Dr. ${d.nombre} — ${d.especialidad||''}</option>`).join('');
    }
    // Restaurar firma seleccionada
    if (appState['c22-firma-img']) {
      const display = document.getElementById('c22-firma-display');
      if (display) display.innerHTML = `<img src="${appState['c22-firma-img']}" />`;
    }
  }
};

async function loadSelectedDoctor() {
  const id = document.getElementById('c22-doctor-select').value;
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
  document.getElementById('c22-nombre').value       = doctor.nombre       || '';
  document.getElementById('c22-cedula').value       = doctor.cedula       || '';
  document.getElementById('c22-especialidad').value = doctor.especialidad || '';
  document.getElementById('c22-clinica').value      = doctor.clinica      || '';
  appState['c22-nombre']       = doctor.nombre       || '';
  appState['c22-cedula']       = doctor.cedula       || '';
  appState['c22-especialidad'] = doctor.especialidad || '';
  appState['c22-clinica']      = doctor.clinica      || '';
  const firma = doctor.signature_image || doctor.signature_data;
  if (firma) {
    appState['c22-firma-img'] = firma;
    const display = document.getElementById('c22-firma-display');
    if (display) display.innerHTML = `<img src="${firma}" />`;
  }
  saveToStorage();
}

function uploadFirmaImage(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    appState['c22-firma-img'] = ev.target.result;
    saveToStorage();
    const display = document.getElementById('c22-firma-display');
    if (display) display.innerHTML = `<img src="${ev.target.result}" />`;
  };
  reader.readAsDataURL(file);
}

function clearFirmaImage() {
  delete appState['c22-firma-img'];
  saveToStorage();
  const display = document.getElementById('c22-firma-display');
  if (display) display.innerHTML = '<span class="ctt-firma-placeholder">Cargue un doctor con firma guardada o suba una imagen</span>';
}
