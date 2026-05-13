/* ===== SUPABASE CONFIG ===== */
const SUPABASE_URL = 'https://mygjrrvepqpfoozbqemy.supabase.co';
const SUPABASE_KEY = 'sb_publishable_e1j34zueMXjeriiXFRO8ZA_EayRxMUd';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let currentRecordId = null;
let allPatients = [];

/* ===== CONNECTION CHECK ===== */
async function checkConnection() {
  setDbStatus('connecting');
  try {
    const { error } = await supabase.from('medical_records').select('id').limit(1);
    if (error) throw error;
    setDbStatus('connected');
    await loadPatientList();
  } catch (e) {
    console.error('Supabase connection error:', e);
    setDbStatus('error');
  }
}

function setDbStatus(state) {
  const el = document.getElementById('db-status');
  if (!el) return;
  const states = {
    connecting: { text: '● Conectando...', cls: 'db-connecting' },
    connected:  { text: '● Conectado',     cls: 'db-connected'  },
    error:      { text: '● Sin conexión',  cls: 'db-error'      },
    saving:     { text: '● Guardando...',  cls: 'db-connecting' },
    saved:      { text: '✓ Guardado',      cls: 'db-connected'  }
  };
  const s = states[state] || states.connecting;
  el.textContent = s.text;
  el.className = `db-status ${s.cls}`;
}

/* ===== CRUD ===== */
async function dbSaveRecord() {
  const name    = appState['s1-patient']  || '';
  const patId   = appState['s1-id']       || '';
  const date    = appState['s1-date']     || null;
  const clinic  = appState['s1-clinic']   || '';

  if (!name) {
    alert('Por favor ingresa el nombre del paciente en la Hoja 1 antes de guardar.');
    return;
  }

  setDbStatus('saving');

  // Strip large images from the saved data to keep payload reasonable
  const dataToSave = stripImages(appState);

  try {
    let result;
    if (currentRecordId) {
      result = await supabase
        .from('medical_records')
        .update({ patient_name: name, patient_id: patId, study_date: date || null, clinic, data: dataToSave })
        .eq('id', currentRecordId)
        .select()
        .single();
    } else {
      result = await supabase
        .from('medical_records')
        .insert({ patient_name: name, patient_id: patId, study_date: date || null, clinic, data: dataToSave })
        .select()
        .single();
    }

    if (result.error) throw result.error;

    currentRecordId = result.data.id;
    appState._recordId = currentRecordId;
    saveToStorage();

    setDbStatus('saved');
    setTimeout(() => setDbStatus('connected'), 2500);
    showToast(`Expediente de ${name} guardado correctamente.`);
    await loadPatientList();
  } catch (e) {
    console.error('Save error:', e);
    setDbStatus('error');
    alert('Error al guardar: ' + (e.message || 'Verifica tu conexión y que la tabla exista.'));
  }
}

async function dbLoadRecord(id) {
  setDbStatus('connecting');
  try {
    const { data, error } = await supabase
      .from('medical_records')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    currentRecordId = data.id;
    appState = { ...data.data, _recordId: data.id };
    appState['s1-patient'] = data.patient_name || appState['s1-patient'] || '';
    appState['s1-id']      = data.patient_id   || appState['s1-id']      || '';
    appState['s1-date']    = data.study_date    || appState['s1-date']    || '';
    appState['s1-clinic']  = data.clinic        || appState['s1-clinic']  || '';

    saveToStorage();

    const name = data.patient_name || '';
    document.getElementById('patient-name-display').textContent = name || 'Sin paciente';

    navigateTo(currentSheetIndex);
    togglePatientList();

    setDbStatus('connected');
    showToast(`Expediente de ${name} cargado.`);
  } catch (e) {
    console.error('Load error:', e);
    setDbStatus('error');
    alert('Error al cargar el expediente: ' + (e.message || ''));
  }
}

async function dbDeleteRecord(id, name) {
  if (!confirm(`¿Eliminar el expediente de ${name}? Esta acción no se puede deshacer.`)) return;
  try {
    const { error } = await supabase.from('medical_records').delete().eq('id', id);
    if (error) throw error;
    if (currentRecordId === id) { currentRecordId = null; appState._recordId = null; }
    showToast(`Expediente de ${name} eliminado.`);
    await loadPatientList();
  } catch (e) {
    alert('Error al eliminar: ' + (e.message || ''));
  }
}

function dbNewRecord() {
  if (!confirm('¿Iniciar un nuevo expediente? Se perderán los datos no guardados en la base de datos.')) return;
  currentRecordId = null;
  appState = {};
  localStorage.removeItem(STORAGE_KEY);
  document.getElementById('patient-name-display').textContent = 'Sin paciente';
  navigateTo(0);
  showToast('Nuevo expediente iniciado.');
}

/* ===== PATIENT LIST ===== */
async function loadPatientList() {
  try {
    const { data, error } = await supabase
      .from('medical_records')
      .select('id, patient_name, patient_id, study_date, clinic, updated_at')
      .order('updated_at', { ascending: false });

    if (error) throw error;
    allPatients = data || [];
    renderPatientList(allPatients);
  } catch (e) {
    console.error('Load list error:', e);
  }
}

function renderPatientList(patients) {
  const ul = document.getElementById('patient-list');
  if (!ul) return;
  if (!patients.length) {
    ul.innerHTML = '<li class="patient-list-empty">No hay expedientes guardados</li>';
    return;
  }
  ul.innerHTML = patients.map(p => {
    const date = p.study_date ? new Date(p.study_date + 'T12:00:00').toLocaleDateString('es-MX') : '—';
    const isActive = p.id === currentRecordId;
    return `
    <li class="patient-list-item ${isActive ? 'active' : ''}">
      <div class="patient-list-info" onclick="dbLoadRecord('${p.id}')">
        <strong>${p.patient_name || 'Sin nombre'}</strong>
        <span>${p.clinic || ''} · ${date}</span>
        ${p.patient_id ? `<span>Exp: ${p.patient_id}</span>` : ''}
      </div>
      <button class="btn-remove" title="Eliminar"
        onclick="event.stopPropagation(); dbDeleteRecord('${p.id}','${(p.patient_name||'').replace(/'/g,"\\'")}')">✕</button>
    </li>`;
  }).join('');
}

function togglePatientList() {
  const panel = document.getElementById('patient-list-panel');
  if (!panel) return;
  const isOpen = panel.style.display !== 'none';
  panel.style.display = isOpen ? 'none' : 'block';
  if (!isOpen) loadPatientList();
}

function filterPatients() {
  const q = document.getElementById('patient-search-input')?.value.toLowerCase() || '';
  const filtered = allPatients.filter(p =>
    (p.patient_name||'').toLowerCase().includes(q) ||
    (p.patient_id||'').toLowerCase().includes(q) ||
    (p.clinic||'').toLowerCase().includes(q)
  );
  renderPatientList(filtered);
}

/* ===== HELPERS ===== */
function stripImages(state) {
  const copy = { ...state };
  // Remove base64 image data before sending to DB (store locally only)
  const imgKeys = ['coverImage','s6CoverImage','s15CoverImage','s17CoverImage','signatureData','signatureImage',
    's2bg','s3bg','s4bg','s5bg'];
  imgKeys.forEach(k => delete copy[k]);
  return copy;
}

function showToast(msg) {
  let toast = document.getElementById('app-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'app-toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => toast.classList.remove('show'), 3000);
}
