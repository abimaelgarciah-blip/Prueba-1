/* ===== PATIENTS VIEW ===== */
let patientsData = [];

async function loadPatientsView() {
  const grid = document.getElementById('patients-grid');
  if (!grid) return;
  grid.innerHTML = '<p class="loading-msg">Cargando expedientes...</p>';
  try {
    const { data, error } = await supabase
      .from('medical_records')
      .select('id, patient_name, patient_id, study_date, clinic, updated_at, data')
      .order('updated_at', { ascending: false });
    if (error) throw error;
    patientsData = data || [];
    renderPatientsGrid(patientsData);
  } catch(e) {
    grid.innerHTML = `<p class="error-msg">Error al cargar: ${e.message}</p>`;
  }
}

function filterPatientsView() {
  const q = document.getElementById('patients-search')?.value.toLowerCase() || '';
  const filtered = patientsData.filter(p =>
    (p.patient_name||'').toLowerCase().includes(q) ||
    (p.patient_id||'').toLowerCase().includes(q) ||
    (p.clinic||'').toLowerCase().includes(q)
  );
  renderPatientsGrid(filtered);
}

function renderPatientsGrid(patients) {
  const grid = document.getElementById('patients-grid');
  if (!grid) return;
  if (!patients.length) {
    grid.innerHTML = `
      <div class="empty-state">
        <svg width="56" height="56" fill="none" stroke="#b0bec5" stroke-width="1.3" viewBox="0 0 24 24">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
        <p>No hay expedientes guardados</p>
        <button class="btn-primary" onclick="startNewPatient()">＋ Crear primer paciente</button>
      </div>`;
    return;
  }
  grid.innerHTML = patients.map(p => {
    const date = p.study_date
      ? new Date(p.study_date + 'T12:00:00').toLocaleDateString('es-MX', { day:'2-digit', month:'short', year:'numeric' })
      : '—';
    const sex  = p.data?.['s1-sex'] || '';
    const age  = p.data?.['s1-age'] || '';
    const initials = (p.patient_name||'?').split(' ').slice(0,2).map(w=>w[0]).join('').toUpperCase();
    return `
    <div class="patient-card" onclick="openPatientRecord('${p.id}')">
      <div class="patient-card-avatar">${initials}</div>
      <div class="patient-card-info">
        <strong>${p.patient_name || 'Sin nombre'}</strong>
        <span>${age ? age + ' · ' : ''}${sex}</span>
        <span>${p.clinic || 'Sin clínica'}</span>
        <span class="patient-card-date">📅 ${date}</span>
        ${p.patient_id ? `<span class="patient-card-id">Exp: ${p.patient_id}</span>` : ''}
      </div>
      <button class="patient-card-delete btn-remove"
        onclick="event.stopPropagation(); deletePatient('${p.id}','${(p.patient_name||'').replace(/'/g,"\\'")}')">✕</button>
    </div>`;
  }).join('');
}

async function deletePatient(id, name) {
  if (!confirm(`¿Eliminar el expediente de ${name}?`)) return;
  try {
    const { error } = await supabase.from('medical_records').delete().eq('id', id);
    if (error) throw error;
    if (currentRecordId === id) { currentRecordId = null; appState._recordId = null; }
    showToast(`Expediente de ${name} eliminado.`);
    loadPatientsView();
  } catch(e) { alert('Error al eliminar: ' + e.message); }
}
