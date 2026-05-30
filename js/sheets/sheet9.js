window.sheet9 = {
  id: 'contenido-conclusiones',
  label: 'Contenido Conclusiones',
  type: 'content',
  membreteKey: 'mb-9',

  systems: [
    { id:'resp',  label:'Sistema Respiratorio' },
    { id:'card',  label:'Sistema Cardiovascular' },
    { id:'gi',    label:'Sistema Gastrointestinal' },
    { id:'gu',    label:'Sistema Genito-Urinario' },
    { id:'nerv',  label:'Sistema Neurológico y Órganos de los Sentidos' },
    { id:'muscu', label:'Sistema Musculoesquelético' },
    { id:'hema',  label:'Sistema Hematopoyético y células en sangre' },
    { id:'endo',  label:'Sistema Endocrino metabólico' }
  ],

  render() {
    const inner = `
      ${h1('CONCLUSIONES')}
      ${p('Paciente que presenta las siguientes alteraciones:')}
      ${this.systems.map(s => p(`<strong class="ctt-sub-line">${s.label}:</strong> ${textarea('c9-'+s.id, '...')}`)).join('')}
      <div id="block-dental">
        ${renderOmitToggle('dental','Omitir odontológico')}
        ${p(`<strong class="ctt-sub-line">Odontológico:</strong> ${textarea('c9-dental','...')}`)}
      </div>
      ${renderDynamicBlock('c9-extra','+ Agregar otra conclusión')}

      <hr style="margin:28px 0 20px;border:none;border-top:1.5px solid #b0bec5;" />

      <div class="ctt-firma-section">
        <div class="ctt-doctor-select">
          <label class="ctt-doctor-label">Seleccionar doctor guardado:</label>
          <select id="c9-doctor-select" onchange="loadDoctorForConclusion()">
            <option value="">-- Elegir doctor --</option>
          </select>
        </div>
        ${p(`<strong class="ctt-sub-line">Nombre:</strong> ${input('c9-doc-nombre','Dr. Nombre Apellido')}`)}
        ${p(`<strong class="ctt-sub-line">Cédula Profesional:</strong> ${input('c9-doc-cedula','número de cédula')}`)}
        ${p(`<strong class="ctt-sub-line">Especialidad:</strong> ${input('c9-doc-especialidad','especialidad')}`)}
        <div class="ctt-firma-area">
          <p class="ctt-firma-label">Firma:</p>
          <div id="c9-firma-display" class="ctt-firma-display">
            <span class="ctt-firma-placeholder">Cargue un doctor con firma guardada o suba una imagen</span>
          </div>
          <button class="btn-secondary" onclick="document.getElementById('c9-firma-input').click()">
            📎 Subir imagen de firma
          </button>
          <input type="file" id="c9-firma-input" style="display:none"
            accept="image/*" onchange="uploadConclusionFirma(event)" />
          <button class="btn-remove" onclick="clearConclusionFirma()">✕ Quitar firma</button>
        </div>
      </div>
    `;
    return renderContentWrapper(this.membreteKey, this.label, inner);
  },

  async restore() {
    const ids = this.systems.map(s => 'c9-'+s.id);
    ids.push('c9-dental');
    restoreFields(ids);
    restoreAutoGrow(ids);

    const chk = document.getElementById('omit-chk-dental');
    if (chk && appState['omit-dental'] === 'true') {
      chk.checked = true;
      document.getElementById('block-dental')?.classList.add('ctt-omitted');
    }
    document.querySelectorAll('.ctt-dynamic-body').forEach(autoGrow);

    restoreFields(['c9-doc-nombre','c9-doc-cedula','c9-doc-especialidad']);

    const sel = document.getElementById('c9-doctor-select');
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

    if (appState['c9-firma-img']) {
      const display = document.getElementById('c9-firma-display');
      if (display) display.innerHTML = `<img src="${appState['c9-firma-img']}" />`;
    }
  }
};

async function loadDoctorForConclusion() {
  const id = document.getElementById('c9-doctor-select').value;
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
  document.getElementById('c9-doc-nombre').value       = doctor.nombre       || '';
  document.getElementById('c9-doc-cedula').value       = doctor.cedula       || '';
  document.getElementById('c9-doc-especialidad').value = doctor.especialidad || '';
  appState['c9-doc-nombre']       = doctor.nombre       || '';
  appState['c9-doc-cedula']       = doctor.cedula       || '';
  appState['c9-doc-especialidad'] = doctor.especialidad || '';
  const firma = doctor.signature_image || doctor.signature_data;
  if (firma) {
    appState['c9-firma-img'] = firma;
    const display = document.getElementById('c9-firma-display');
    if (display) display.innerHTML = `<img src="${firma}" />`;
  }
  saveToStorage();
}

function uploadConclusionFirma(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    appState['c9-firma-img'] = ev.target.result;
    saveToStorage();
    const display = document.getElementById('c9-firma-display');
    if (display) display.innerHTML = `<img src="${ev.target.result}" />`;
  };
  reader.readAsDataURL(file);
}

function clearConclusionFirma() {
  delete appState['c9-firma-img'];
  saveToStorage();
  const display = document.getElementById('c9-firma-display');
  if (display) display.innerHTML = '<span class="ctt-firma-placeholder">Cargue un doctor con firma guardada o suba una imagen</span>';
}
