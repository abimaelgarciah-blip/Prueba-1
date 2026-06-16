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

/* ===== DEFAULTS GLOBALES (portadas/membretes predeterminados) =====
 * Imágenes por defecto que aplican a TODOS los pacientes. Se guardan aparte del
 * expediente (en el navegador). Cada paciente puede sobreescribirlas con su
 * propia imagen (appState[clave] tiene prioridad sobre appDefaults[clave]). */
let appDefaults = {};
const DEFAULTS_KEY = 'cm-defaults-v1';

function loadDefaults() {
  try {
    const raw = localStorage.getItem(DEFAULTS_KEY);
    if (raw) appDefaults = JSON.parse(raw);
  } catch (e) { appDefaults = {}; }
}

function saveDefaults() {
  try {
    localStorage.setItem(DEFAULTS_KEY, JSON.stringify(appDefaults));
  } catch (e) {
    alert('No se pudieron guardar las imágenes predeterminadas: el almacenamiento del navegador está lleno. Usa imágenes más ligeras.');
  }
}

/* ===== SHEETS REGISTRY ===== */
const sheets = [
  sheet1, sheet2, sheet3, sheet4, sheet5,
  sheet6, sheet7, sheet8, sheet9, sheet10,
  sheet11,
  sheetNutricional    // Evaluación Nutricional (se anexa al final del PDF)
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
  loadDefaults();
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
  if (view === 'settings')  loadSettingsView();
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
    if (sheet.section && isSectionOmitted(sheet.section)) {
      li.classList.add('nav-omitted');
      li.title = 'Sección omitida (no se incluye en el PDF)';
    }
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

/* ===== EXPORTAR PDF COMPLETO — html2canvas + jsPDF ===== */
async function exportPDF() {
  if (!window.html2canvas || !window.jspdf) {
    alert('Las librerías de PDF aún se están cargando. Intente en unos segundos.');
    return;
  }

  const { jsPDF } = window.jspdf;

  // Medidas en mm (carta)
  const PAGE_W = 215.9, PAGE_H = 279.4;
  const MT = 30, MB = 40, ML = 15, MR = 15;   // márgenes: 3cm arriba / 4cm abajo / 1.5cm lados
  const CW = PAGE_W - ML - MR;                 // ancho útil
  const CH = PAGE_H - MT - MB;                 // alto útil por página
  const RENDER_W = 816;                         // px de render (8.5in × 96)

  const doc = new jsPDF({ unit: 'mm', format: 'letter', orientation: 'portrait' });
  let firstPage = true;

  // Overlay de progreso
  const overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.55);z-index:9999;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff;font-family:Arial,sans-serif;gap:14px;';
  overlay.innerHTML = '<div style="font-size:1.1rem;font-weight:700;">Generando PDF...</div><div id="pdf-progress" style="font-size:0.9rem;opacity:0.8;">Hoja 0 / 0</div>';
  document.body.appendChild(overlay);
  const progressEl = document.getElementById('pdf-progress');

  try {
    for (let si = 0; si < sheets.length; si++) {
      const sheet = sheets[si];
      progressEl.textContent = `Hoja ${si + 1} / ${sheets.length} — ${sheet.label}`;

      /* --- 0. Saltar secciones omitidas (portada + contenido) --- */
      if (sheet.section && isSectionOmitted(sheet.section)) continue;

      /* --- 0a. Hojas que no se renderizan como imagen (ej. Evaluación
              Nutricional): se anexan aparte con pdf-lib tras el bucle --- */
      if (sheet.skipHtmlExport) continue;

      /* --- 0b. PDF de reemplazo: incrustar las páginas del PDF cargado --- */
      if (sheet.pdfKey && appState[sheet.pdfKey]) {
        try {
          firstPage = await renderPdfReplaceToDoc(
            doc, appState[sheet.pdfKey], firstPage,
            { PAGE_W, PAGE_H, ML, MT, MR, MB }
          );
        } catch (e) {
          console.error('No se pudo incrustar el PDF de', sheet.label, e);
        }
        continue;
      }

      /* --- 1. Renderizar hoja en div oculto --- */
      const div = document.createElement('div');
      div.className = 'pdf-rendering';
      div.style.cssText = `position:fixed;top:0;left:-9999px;width:${RENDER_W}px;background:#fff;z-index:-1;`;
      div.innerHTML = sheet.render();
      document.body.appendChild(div);

      // Convertir inputs/textareas/selects en spans con su valor (texto plano)
      div.querySelectorAll('input[type="text"], input:not([type])').forEach(el => {
        const val = (el.id && appState[el.id] !== undefined) ? appState[el.id] : el.value;
        const span = document.createElement('span');
        span.className = 'pdf-value';
        span.textContent = val || '';
        el.parentNode.replaceChild(span, el);
      });
      div.querySelectorAll('select').forEach(el => {
        const val = (el.id && appState[el.id] !== undefined) ? appState[el.id] : el.value;
        const span = document.createElement('span');
        span.className = 'pdf-value';
        span.textContent = val || '';
        el.parentNode.replaceChild(span, el);
      });
      div.querySelectorAll('textarea').forEach(el => {
        if (el.classList.contains('ctt-fixed-textarea')) {
          el.style.display = 'none';
          return;
        }
        const val = (el.id && appState[el.id] !== undefined) ? appState[el.id] : el.value;
        const div2 = document.createElement('div');
        div2.className = 'pdf-value-block';
        div2.textContent = val || '';
        el.parentNode.replaceChild(div2, el);
      });

      // Restaurar imágenes de firma
      [['c11-firma-img','c11-firma-display']].forEach(([k,id]) => {
        if (appState[k]) {
          const el = div.querySelector('#'+id);
          if (el) el.innerHTML = `<img src="${appState[k]}" style="max-height:100px;max-width:100%;object-fit:contain;"/>`;
        }
      });

      // Datos del doctor en la firma (son <strong>/<span>, no inputs: se rellenan a mano
      // igual que syncSugerenciaDoctorDisplay, para que el export muestre el doctor seleccionado)
      [['c11-doc-nombre','c11-doc-nombre-show'],
       ['c11-doc-cedula','c11-doc-cedula-show'],
       ['c11-doc-especialidad','c11-doc-especialidad-show']].forEach(([k,id]) => {
        const el = div.querySelector('#'+id);
        if (el) el.textContent = appState[k] ? appState[k] : '_____';
      });

      // Ocultar bloques omitidos
      div.querySelectorAll('[id^="block-"]').forEach(el => {
        if (appState['omit-' + el.id.replace('block-','')] === 'true') el.style.display = 'none';
      });

      // Ocultar controles de UI
      ['.content-sheet-toolbar','.ctt-omit','.ctt-omit-inline','.btn-add-block',
       '.btn-dynamic-remove','.btn-tiny','.btn-tiny-reset','.ctt-firma-edit',
       '.no-print','.ctt-attachment-actions','.ctt-fixed-actions',
       '.ctt-firma-placeholder','.btn-remove','.btn-secondary','.btn-primary',
       '.membrete-control','[type="file"]',
       '.btn-cover-change','.btn-cover-remove','.cover-placeholder-big',
       '.ctt-doctor-select','.ctt-firma-section .no-print',
       'button'].forEach(sel => {
        div.querySelectorAll(sel).forEach(el => el.style.display = 'none');
      });

      // Quitar background-image del .content-sheet (lo dibujamos nosotros)
      const contentSheet = div.querySelector('.content-sheet');
      if (contentSheet) contentSheet.style.backgroundImage = 'none';
      const overlay2 = div.querySelector('.content-sheet-overlay');
      if (overlay2) overlay2.style.background = 'transparent';

      // Esperar que imágenes internas carguen
      await Promise.all([...div.querySelectorAll('img')].map(img =>
        img.complete ? Promise.resolve() : new Promise(r => { img.onload = r; img.onerror = r; })
      ));
      await new Promise(r => setTimeout(r, 80));

      /* --- 2. Capturar canvas --- */
      const canvas = await html2canvas(div, {
        scale: 2, useCORS: true, allowTaint: true,
        logging: false, backgroundColor: '#ffffff', width: RENDER_W
      });

      // Límites (top/bottom en px CSS relativos al div) de cada bloque, para
      // cortar las páginas SIN partir un renglón a la mitad.
      const divTopPx = div.getBoundingClientRect().top;
      const blockSel = '.ctt-h1,.ctt-h2,.ctt-p,.ctt-study-line,.ctt-fixed,'
        + '.ctt-dynamic-item,.ctt-numbered-item,.ctt-attachment,'
        + '.ctt-firma-doc-line,.ctt-firma-centered-display,'
        + '.lab-card-head,.lab-row,.lab-qual-row,'
        + '.info-card-head,.field-cell,.metric-card,.sys-head,.sys-summary';
      const blockBounds = [];
      div.querySelectorAll(blockSel).forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.height <= 0) return;
        blockBounds.push([r.top - divTopPx, r.bottom - divTopPx]);
      });
      document.body.removeChild(div);

      const isCover = sheet.type === 'cover';

      if (!firstPage) doc.addPage();
      firstPage = false;

      /* --- 3a. Portada: imagen llena la página completa --- */
      if (isCover) {
        doc.addImage(canvas.toDataURL('image/jpeg', 0.92), 'JPEG', 0, 0, PAGE_W, PAGE_H);
        continue;
      }

      /* --- 3b. Hoja de contenido: márgenes + membrete por página --- */
      const membreteImg = sheet.membreteKey ? effectiveImage(sheet.membreteKey) : null;

      // Precomponer canvas del membrete con velo blanco (para reutilizar en cada página)
      let bgDataUrl = null;
      if (membreteImg) {
        const bgC = document.createElement('canvas');
        bgC.width = 816; bgC.height = 1056;
        const ctx = bgC.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, 816, 1056);
        await new Promise(resolve => {
          const img = new Image();
          img.onload = () => {
            ctx.globalAlpha = 0.70;
            ctx.drawImage(img, 0, 0, 816, 1056);
            ctx.globalAlpha = 1;
            resolve();
          };
          img.onerror = resolve;
          img.src = membreteImg;
        });
        bgDataUrl = bgC.toDataURL('image/jpeg', 0.88);
      }

      // Escalas
      const pxPerMM  = canvas.width / CW;        // px de canvas por mm
      const scaleC   = canvas.width / RENDER_W;  // px de canvas por px CSS
      const CHcanvas = CH * pxPerMM;             // alto útil por página (px de canvas)

      // Puntos de corte "limpios" (px de canvas): tope y base de cada bloque
      const cutSet = new Set();
      blockBounds.forEach(([t, b]) => {
        cutSet.add(Math.round(t * scaleC));
        cutSet.add(Math.round(b * scaleC));
      });
      const cuts = [...cutSet].filter(y => y > 0 && y < canvas.height).sort((a, b) => a - b);

      // Paginación: avanzar cortando en el mayor límite de bloque que quepa,
      // para que ningún renglón quede partido entre dos páginas.
      let startY = 0, firstSlice = true, safety = 0;
      while (startY < canvas.height - 1 && safety++ < 600) {
        const maxY = startY + CHcanvas;
        let endY;
        if (maxY >= canvas.height) {
          endY = canvas.height;
        } else {
          endY = -1;
          for (const c of cuts) { if (c > startY && c <= maxY) endY = c; else if (c > maxY) break; }
          if (endY <= startY) endY = Math.round(maxY); // bloque más alto que una página: corte forzado
        }

        if (!firstSlice) doc.addPage();
        firstSlice = false;

        // Membrete de fondo (completo, una vez por página)
        if (bgDataUrl) doc.addImage(bgDataUrl, 'JPEG', 0, 0, PAGE_W, PAGE_H);

        const srcH = Math.max(1, endY - startY);
        const sliceH_mm = srcH / pxPerMM;
        const sliceC = document.createElement('canvas');
        sliceC.width  = canvas.width;
        sliceC.height = srcH;
        sliceC.getContext('2d').drawImage(canvas, 0, startY, canvas.width, srcH, 0, 0, canvas.width, srcH);
        doc.addImage(sliceC.toDataURL('image/jpeg', 0.92), 'JPEG', ML, MT, CW, sliceH_mm);

        startY = endY;
      }
    }

    const nombre = appState['s1-patient'] || appState.patientName || 'paciente';
    const fecha  = new Date().toISOString().split('T')[0];
    const filename = `chequeo-${nombre}-${fecha}.pdf`;

    // Anexar la Evaluación Nutricional al final (si hay selección y pdf-lib disponible).
    const order = (typeof nutriBuildOrder === 'function') ? nutriBuildOrder() : [];
    if (window.PDFLib && order.length) {
      try {
        progressEl.textContent = 'Anexando Evaluación Nutricional…';
        const mergedBytes = await mergeNutricional(doc.output('arraybuffer'), order);
        downloadBytes(mergedBytes, filename);
        showToast('PDF (chequeo + nutricional) descargado.');
      } catch (e) {
        console.error('merge nutricional error:', e);
        doc.save(filename);
        showToast('Se descargó el chequeo, pero no se pudo anexar la parte nutricional: ' + e.message);
      }
    } else {
      doc.save(filename);
      showToast('PDF descargado correctamente.');
    }

  } catch (err) {
    console.error('exportPDF error:', err);
    alert('Error al generar el PDF: ' + err.message);
  } finally {
    overlay.remove();
  }
}

/* ===== Incrustar páginas de un PDF cargado en el documento de exportación ===== */
async function renderPdfReplaceToDoc(doc, dataUrl, firstPage, opts) {
  if (!window.pdfjsLib) throw new Error('pdf.js no está disponible');
  const { PAGE_W, PAGE_H } = opts;

  // data URL -> bytes
  const base64 = dataUrl.split(',')[1] || '';
  const bin = atob(base64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);

  const pdf = await window.pdfjsLib.getDocument({ data: bytes }).promise;

  for (let n = 1; n <= pdf.numPages; n++) {
    const page = await pdf.getPage(n);
    const viewport = page.getViewport({ scale: 2 });
    const canvas = document.createElement('canvas');
    canvas.width  = viewport.width;
    canvas.height = viewport.height;
    await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;

    if (!firstPage) doc.addPage();
    firstPage = false;

    // Ajustar la página del PDF a la HOJA COMPLETA, conservando proporción y
    // centrando (un reporte carta/A4 llena toda la página, sin márgenes).
    const imgRatio = canvas.width / canvas.height;
    const boxRatio = PAGE_W / PAGE_H;
    let w, h;
    if (imgRatio > boxRatio) { w = PAGE_W; h = PAGE_W / imgRatio; }
    else                     { h = PAGE_H; w = PAGE_H * imgRatio; }
    const x = (PAGE_W - w) / 2;
    const y = (PAGE_H - h) / 2;
    doc.addImage(canvas.toDataURL('image/jpeg', 0.92), 'JPEG', x, y, w, h);
  }
  return firstPage;
}

/* ===== MERGE EVALUACIÓN NUTRICIONAL (pdf-lib) ===== */
async function mergeNutricional(medicalBytes, order) {
  const { PDFDocument, StandardFonts, rgb } = PDFLib;
  const merged = await PDFDocument.load(medicalBytes);
  const cfg = window.CONFIG_PREDETERMINADA;

  // Plantilla nutricional (portadas, lista de equivalentes, anexos).
  let plantilla = null, totalPl = 0;
  if (order.some(b => b.tipo === 'plantilla')) {
    const resp = await fetch('nutricional/plantilla/plantilla.pdf');
    if (!resp.ok) throw new Error('no se pudo cargar la plantilla nutricional');
    plantilla = await PDFDocument.load(await resp.arrayBuffer());
    totalPl = plantilla.getPageCount();
  }

  for (const b of order) {
    if (b.tipo === 'plantilla') {
      const idx = b.pages.filter(p => p >= 1 && p <= totalPl).map(p => p - 1);
      if (!idx.length) continue;
      const pgs = await merged.copyPages(plantilla, idx);
      pgs.forEach(p => merged.addPage(p));
    } else if (b.tipo === 'dieta') {
      const resp = await fetch('nutricional/dietas/' + b.kcal + '.pdf');
      if (!resp.ok) throw new Error('no se pudo cargar la dieta de ' + b.kcal + ' kcal');
      const dietaDoc = await PDFDocument.load(await resp.arrayBuffer());
      if (b.nombre) {
        const fuente = await dietaDoc.embedFont(StandardFonts.Helvetica);
        const pos = cfg.dieta.nombre;
        dietaDoc.getPage(0).drawText(b.nombre, {
          x: pos.x, y: pos.y, size: pos.tamano, font: fuente, color: rgb(0, 0, 0)
        });
      }
      const pgs = await merged.copyPages(dietaDoc, dietaDoc.getPageIndices());
      pgs.forEach(p => merged.addPage(p));
    }
  }
  return merged.save();
}

function downloadBytes(bytes, filename) {
  const url = URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' }));
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30000);
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
