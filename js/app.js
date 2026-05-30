/* ===== AUTH ===== */
const PASSWORD = 'empatia1042';
const AUTH_KEY = 'cm-auth';

function handleLogin(e) {
  e.preventDefault();
  const input = document.getElementById('login-password').value;
  const err   = document.getElementById('login-error');
  if (input === PASSWORD) {
    sessionStorage.setItem(AUTH_KEY, '1');
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('app').style.display = 'flex';
    initApp();
  } else {
    err.style.display = 'block';
    document.getElementById('login-password').value = '';
    document.getElementById('login-password').focus();
  }
}

function handleLogout() {
  sessionStorage.removeItem(AUTH_KEY);
  location.reload();
}

/* ===== STATE ===== */
let appState = {};
const STORAGE_KEY = 'checqueo-medico-v1';

/* ===== SHEETS REGISTRY ===== */
const sheets = [
  sheet1, sheet2, sheet3, sheet4, sheet5,
  sheet6, sheet7, sheet8, sheet9, sheet10,
  sheet11, sheet12, sheet13, sheet14, sheet15,
  sheet16, sheet17, sheet18, sheet19, sheet20,
  sheet21
];

let currentSheetIndex = 0;
let currentView = 'patients';

/* ===== BOOT ===== */
document.addEventListener('DOMContentLoaded', () => {
  if (sessionStorage.getItem(AUTH_KEY) === '1') {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('app').style.display = 'flex';
    initApp();
  }
  // Auto-focus password field
  document.getElementById('login-password')?.focus();
});

function initApp() {
  loadFromStorage();
  buildNav();
  checkConnection();
  showView('patients');
}

/* ===== VIEW SWITCHER ===== */
function showView(view) {
  currentView = view;
  document.querySelectorAll('.view-panel').forEach(p => p.classList.remove('active-panel'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

  document.getElementById(`view-${view}`)?.classList.add('active-panel');
  document.getElementById(`nav-${view}`)?.classList.add('active');

  if (view === 'patients') loadPatientsView();
  if (view === 'doctors')  loadDoctorsView();
  if (view === 'dashboard') loadDashboard();
}

/* ===== PATIENT FORM NAV ===== */
function startNewPatient() {
  currentRecordId = null;
  appState = {};
  saveToStorage();
  openFormView();
  navigateTo(0);
}

function openPatientRecord(id) {
  dbLoadRecord(id);
}

function openFormView() {
  document.getElementById('patients-list-view').style.display = 'none';
  document.getElementById('patients-form-view').style.display = 'flex';
}

function backToPatientList() {
  document.getElementById('patients-form-view').style.display = 'none';
  document.getElementById('patients-list-view').style.display = 'flex';
  loadPatientsView();
}

/* ===== SHEET NAV ===== */
function buildNav() {
  const nav = document.getElementById('sheet-nav');
  if (!nav) return;
  nav.innerHTML = '';
  sheets.forEach((sheet, i) => {
    const li = document.createElement('li');
    li.textContent = sheet.label;
    li.dataset.index = i;
    li.addEventListener('click', () => navigateTo(i));
    nav.appendChild(li);
  });
}

function navigateTo(index) {
  currentSheetIndex = index;
  const sheet = sheets[index];

  document.querySelectorAll('#sheet-nav li').forEach((li, i) => {
    li.classList.toggle('active', i === index);
  });

  const container = document.getElementById('sheet-container');
  if (!container) return;
  container.innerHTML = sheet.render();

  if (sheet.restore) setTimeout(() => sheet.restore(), 0);
  setTimeout(() => autoSizeAllInline(container), 10);
  document.getElementById('main-content')?.scrollTo(0, 0);
}

/* ===== FIELD STATE ===== */
function saveFieldState(id) {
  const el = document.getElementById(id);
  if (!el) return;
  appState[id] = el.value;
  saveToStorage();
}

function restoreFields(ids) {
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el && appState[id] !== undefined) el.value = appState[id];
    if (el && el.classList?.contains('ctt-inline')) autoSizeInline(el);
  });
}

/* ===== BACKGROUND IMAGE ===== */
function triggerBgImage(bgId, inputId) {
  document.getElementById(inputId)?.click();
}

function setBgImage(event, bgId, stateKey) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    const bgEl = document.getElementById(bgId);
    if (bgEl) bgEl.style.backgroundImage = `url('${ev.target.result}')`;
    appState[stateKey] = ev.target.result;
    saveToStorage();
  };
  reader.readAsDataURL(file);
}

function restoreBgImage(bgId, stateKey) {
  if (appState[stateKey]) {
    const bgEl = document.getElementById(bgId);
    if (bgEl) bgEl.style.backgroundImage = `url('${appState[stateKey]}')`;
  }
}

/* ===== STUDY ITEM RENDERER ===== */
function renderStudyItem(study) {
  const fields = study.fields || [];
  const fieldsHTML = fields.map(f => {
    if (f.type === 'textarea') {
      return `<div class="form-group">
        <label>${f.label}</label>
        <textarea id="${f.id}" placeholder="${f.ph||''}"
          oninput="saveFieldState('${f.id}')" style="min-height:70px;resize:vertical;"></textarea>
      </div>`;
    }
    if (f.type === 'select') {
      const opts = (f.opts||[]).map(o => `<option value="${o}">${o}</option>`).join('');
      return `<div class="form-group">
        <label>${f.label}</label>
        <select id="${f.id}" onchange="updateStatusStyle('${f.id}'); saveFieldState('${f.id}')">
          <option value="">-- Seleccionar --</option>${opts}
        </select>
      </div>`;
    }
    if (f.type === 'date') {
      return `<div class="form-group">
        <label>${f.label}</label>
        <input type="date" id="${f.id}" oninput="saveFieldState('${f.id}')" />
      </div>`;
    }
    return `<div class="form-group">
      <label>${f.label}</label>
      <input type="text" id="${f.id}" placeholder="${f.ph||''}" oninput="saveFieldState('${f.id}')" />
    </div>`;
  });

  return `
  <div class="study-item" id="item-${study.id}">
    <div class="study-item-header" onclick="toggleStudy('${study.id}')">
      <input type="checkbox" id="chk-${study.id}" checked
        onclick="event.stopPropagation(); toggleStudyCheck('${study.id}')"
        onchange="saveFieldState('chk-${study.id}')" />
      <label for="chk-${study.id}" onclick="event.stopPropagation()">${study.label}</label>
      <span style="color:#888;font-size:0.78rem;" id="arrow-${study.id}">▼</span>
    </div>
    <div class="study-item-body open" id="body-${study.id}">
      <div class="grid-2">${fieldsHTML.join('')}</div>
    </div>
  </div>`;
}

function toggleStudy(id) {
  const body  = document.getElementById(`body-${id}`);
  const arrow = document.getElementById(`arrow-${id}`);
  if (!body) return;
  body.classList.toggle('open');
  if (arrow) arrow.textContent = body.classList.contains('open') ? '▼' : '▶';
}

function toggleStudyCheck(id) {
  const chk  = document.getElementById(`chk-${id}`);
  const body = document.getElementById(`body-${id}`);
  if (!chk || !body) return;
  body.style.display = chk.checked ? '' : 'none';
  if (!chk.checked) body.classList.remove('open');
  else body.classList.add('open');
  appState[`chk-${id}`] = chk.checked ? 'true' : 'false';
  saveToStorage();
}

function restoreStudies(studies) {
  studies.forEach(study => {
    const chk  = document.getElementById(`chk-${study.id}`);
    const body = document.getElementById(`body-${study.id}`);
    const saved = appState[`chk-${study.id}`];
    if (saved === 'false' && chk) {
      chk.checked = false;
      if (body) body.style.display = 'none';
    }
    if (study.fields) {
      restoreFields(study.fields.map(f => f.id));
      study.fields.filter(f => f.type === 'select').forEach(f => updateStatusStyle(f.id));
    }
  });
}

/* ===== STATUS STYLE ===== */
function updateStatusStyle(idOrEl) {
  const el = typeof idOrEl === 'string' ? document.getElementById(idOrEl) : idOrEl;
  if (!el) return;
  el.classList.remove('status-normal','status-anormal','status-limítrofe');
  const v = el.value?.toLowerCase() || '';
  if (v === 'normal' || v === 'no reactivo' || v === 'negativo') el.classList.add('status-normal');
  else if (v.includes('anormal') || v.includes('reactivo') || v.includes('positivo') || v.includes('osteoporosis')) el.classList.add('status-anormal');
  else if (v.includes('limítrofe') || v.includes('osteopenia') || v.includes('riesgo') || v.includes('requiere')) el.classList.add('status-limítrofe');
}

/* ===== PATIENT NAME ===== */
function updatePatientName() {
  const name = document.getElementById('s1-patient')?.value || '';
  const el = document.getElementById('patient-name-display');
  if (el) el.textContent = name || 'Sin paciente';
  appState.patientName = name;
  saveToStorage();
}

/* ===== STORAGE ===== */
function saveToStorage() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(appState)); } catch(e) {}
}

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      appState = JSON.parse(raw);
      if (appState._recordId) currentRecordId = appState._recordId;
    }
  } catch(e) { appState = {}; }
}

/* ===== EXPORT / IMPORT JSON ===== */
function saveData() {
  const data  = JSON.stringify(appState, null, 2);
  const blob  = new Blob([data], { type: 'application/json' });
  const url   = URL.createObjectURL(blob);
  const a     = document.createElement('a');
  const name  = appState['s1-patient'] || 'paciente';
  const date  = new Date().toISOString().split('T')[0];
  a.href = url; a.download = `chequeo-${name}-${date}.json`; a.click();
  URL.revokeObjectURL(url);
}

function loadData() {
  const input = document.createElement('input');
  input.type = 'file'; input.accept = '.json';
  input.onchange = e => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        appState = JSON.parse(ev.target.result);
        saveToStorage();
        navigateTo(currentSheetIndex);
        const name = appState.patientName || appState['s1-patient'] || '';
        const el = document.getElementById('patient-name-display');
        if (el) el.textContent = name || 'Sin paciente';
        showToast('Datos cargados correctamente.');
      } catch { alert('Archivo inválido.'); }
    };
    reader.readAsText(file);
  };
  input.click();
}

/* ===== PRINT (hoja actual) ===== */
function printReport() {
  document.body.classList.add('print-single');
  window.print();
  setTimeout(() => document.body.classList.remove('print-single'), 500);
}

/* ===== EXPORTAR PDF COMPLETO (todas las hojas) ===== */
function exportPDF() {
  // Eliminar contenedor previo si existe
  const prev = document.getElementById('pdf-export-container');
  if (prev) prev.remove();

  const container = document.createElement('div');
  container.id = 'pdf-export-container';

  // Renderizar todas las hojas
  sheets.forEach(sheet => {
    const wrap = document.createElement('div');
    wrap.className = 'pdf-sheet-wrap';
    wrap.innerHTML = sheet.render();
    container.appendChild(wrap);
  });

  document.body.appendChild(container);

  // Inyectar valores desde appState en cada input/textarea/select
  container.querySelectorAll('input, textarea, select').forEach(el => {
    if (el.type === 'file' || el.type === 'checkbox') return;
    if (el.id && appState[el.id] !== undefined) {
      el.value = appState[el.id];
      el.setAttribute('value', appState[el.id]);
      if (el.tagName === 'TEXTAREA') el.textContent = appState[el.id];
    }
  });

  // Restaurar firmas (sheet9 y sheet22)
  [['c9-firma-img','c9-firma-display'], ['c22-firma-img','c22-firma-display']].forEach(([k, dispId]) => {
    if (appState[k]) {
      const disp = container.querySelector(`#${dispId}`);
      if (disp) disp.innerHTML = `<img src="${appState[k]}" />`;
    }
  });

  // Aplicar omit (line-through) sobre estudios omitidos
  container.querySelectorAll('[id^="block-"]').forEach(el => {
    const id = el.id.replace(/^block-/, '');
    if (appState[`omit-${id}`] === 'true') el.classList.add('ctt-omitted');
  });

  // Activar modo export y disparar print
  document.body.classList.add('pdf-export-mode');
  setTimeout(() => {
    window.print();
    setTimeout(() => {
      document.body.classList.remove('pdf-export-mode');
      container.remove();
    }, 500);
  }, 100);
}

/* ===== TOAST ===== */
function showToast(msg) {
  let t = document.getElementById('app-toast');
  if (!t) { t = document.createElement('div'); t.id = 'app-toast'; document.body.appendChild(t); }
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timeout);
  t._timeout = setTimeout(() => t.classList.remove('show'), 3000);
}
