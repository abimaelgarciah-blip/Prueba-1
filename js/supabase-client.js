/* ===== SUPABASE CONFIG ===== */
const SUPABASE_URL = 'https://mygjrrvepqpfoozbqemy.supabase.co';
const SUPABASE_KEY = 'sb_publishable_e1j34zueMXjeriiXFRO8ZA_EayRxMUd';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let currentRecordId = null;

/* ===== CONNECTION CHECK ===== */
async function checkConnection() {
  setDbStatus('connecting');
  try {
    const { error } = await supabase.from('medical_records').select('id').limit(1);
    if (error) throw error;
    setDbStatus('connected');
  } catch(e) {
    console.error('Supabase connection error:', e);
    setDbStatus('error');
  }
}

function setDbStatus(state) {
  const states = {
    connecting: { text: '● Conectando...', cls: 'db-connecting' },
    connected:  { text: '● Conectado',     cls: 'db-connected'  },
    error:      { text: '● Sin conexión',  cls: 'db-error'      },
    saving:     { text: '● Guardando...',  cls: 'db-connecting' },
    saved:      { text: '✓ Guardado',      cls: 'db-connected'  }
  };
  const s = states[state] || states.connecting;
  ['db-status','db-status-form'].forEach(id => {
    const el = document.getElementById(id);
    if (el) { el.textContent = s.text; el.className = `db-status ${s.cls}`; }
  });
}

/* ===== SAVE ===== */
async function dbSaveRecord() {
  const name   = appState['s1-patient'] || '';
  const patId  = appState['s1-id']      || '';
  const date   = appState['s1-date']    || null;
  const clinic = appState['s1-clinic']  || '';

  if (!name) {
    alert('Por favor ingresa el nombre del paciente en la Hoja 1 antes de guardar.');
    return;
  }

  setDbStatus('saving');
  const dataToSave = stripImages(appState);

  try {
    let result;
    if (currentRecordId) {
      result = await supabase
        .from('medical_records')
        .update({ patient_name: name, patient_id: patId, study_date: date || null, clinic, data: dataToSave })
        .eq('id', currentRecordId)
        .select().single();
    } else {
      result = await supabase
        .from('medical_records')
        .insert({ patient_name: name, patient_id: patId, study_date: date || null, clinic, data: dataToSave })
        .select().single();
    }
    if (result.error) throw result.error;

    currentRecordId = result.data.id;
    appState._recordId = currentRecordId;
    saveToStorage();
    setDbStatus('saved');
    setTimeout(() => setDbStatus('connected'), 2500);
    showToast(`Expediente de ${name} guardado.`);
  } catch(e) {
    console.error('Save error:', e);
    setDbStatus('error');
    alert('Error al guardar: ' + (e.message || 'Verifica tu conexión.'));
  }
}

/* ===== LOAD ===== */
async function dbLoadRecord(id) {
  setDbStatus('connecting');
  try {
    const { data, error } = await supabase
      .from('medical_records').select('*').eq('id', id).single();
    if (error) throw error;

    currentRecordId = data.id;
    appState = { ...data.data, _recordId: data.id };
    appState['s1-patient'] = data.patient_name || appState['s1-patient'] || '';
    appState['s1-id']      = data.patient_id   || appState['s1-id']      || '';
    appState['s1-date']    = data.study_date    || appState['s1-date']    || '';
    appState['s1-clinic']  = data.clinic        || appState['s1-clinic']  || '';
    saveToStorage();

    const nameEl = document.getElementById('patient-name-display');
    if (nameEl) nameEl.textContent = data.patient_name || 'Sin paciente';

    openFormView();
    navigateTo(0);
    setDbStatus('connected');
    showToast(`Expediente de ${data.patient_name || 'paciente'} cargado.`);
  } catch(e) {
    setDbStatus('error');
    alert('Error al cargar: ' + (e.message || ''));
  }
}

/* ===== HELPERS ===== */
function stripImages(state) {
  const copy = { ...state };
  ['coverImage','s6CoverImage','s15CoverImage','s17CoverImage','signatureData',
   'signatureImage','s2bg','s3bg','s4bg','s5bg'].forEach(k => delete copy[k]);
  return copy;
}
