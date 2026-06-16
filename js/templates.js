/* ===== TEMPLATES & HELPERS PARA HOJAS ===== */

/* ----- PORTADA (full-page cover) ----- */
function renderCoverPage(stateKey, label) {
  const img = effectiveImage(stateKey);
  return `
  <div class="sheet cover-sheet-page" id="cover-${stateKey}">
    <div class="cover-page-inner" onclick="document.getElementById('input-${stateKey}').click()">
      ${img
        ? `<img src="${img}" class="cover-full-img" />`
        : `<div class="cover-placeholder-big">
            <svg width="64" height="64" fill="none" stroke="#b0bec5" stroke-width="1.3" viewBox="0 0 24 24">
              <rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/>
              <path d="M21 15l-5-5L5 21"/>
            </svg>
            <p>Haz clic para subir la imagen de portada</p>
            <span>(${label})</span>
          </div>`}
    </div>
    ${img ? `<button class="btn-cover-change" onclick="document.getElementById('input-${stateKey}').click()">Cambiar imagen</button>
            <button class="btn-cover-remove" onclick="removeCoverImage('${stateKey}')">Quitar</button>` : ''}
    <input type="file" id="input-${stateKey}" style="display:none"
      accept="image/*" onchange="setCoverImage(event,'${stateKey}')" />
  </div>`;
}

function setCoverImage(event, stateKey) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    appState[stateKey] = ev.target.result;
    saveToStorage();
    navigateTo(currentSheetIndex);
  };
  reader.readAsDataURL(file);
}

function removeCoverImage(stateKey) {
  if (!confirm('¿Quitar la imagen de portada?')) return;
  delete appState[stateKey];
  saveToStorage();
  navigateTo(currentSheetIndex);
}

/* ----- MEMBRETE (background image for content sheets) ----- */
function renderMembreteControl(stateKey) {
  const has = !!appState[stateKey];
  return `
  <div class="membrete-control">
    <button class="btn-membrete" onclick="document.getElementById('mb-input-${stateKey}').click()">
      🖼 ${has ? 'Cambiar membrete' : 'Agregar imagen de membrete'}
    </button>
    ${has ? `<button class="btn-remove" onclick="removeMembrete('${stateKey}')">✕ Quitar membrete</button>` : ''}
    <input type="file" id="mb-input-${stateKey}" style="display:none"
      accept="image/*" onchange="setMembrete(event,'${stateKey}')" />
  </div>`;
}

function renderMembreteBg(stateKey) {
  const img = effectiveImage(stateKey);
  return img ? `<div class="membrete-bg" style="background-image:url('${img}')"></div>` : '';
}

function setMembrete(event, stateKey) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    appState[stateKey] = ev.target.result;
    saveToStorage();
    navigateTo(currentSheetIndex);
  };
  reader.readAsDataURL(file);
}

function removeMembrete(stateKey) {
  if (!confirm('¿Quitar el membrete de fondo?')) return;
  delete appState[stateKey];
  saveToStorage();
  navigateTo(currentSheetIndex);
}

/* ----- CONTENT SHEET WRAPPER ----- */
function renderContentWrapper(stateKey, label, innerHTML) {
  const img = effectiveImage(stateKey);
  // Background va en el .content-sheet (el contenedor) con data-attr
  // para que print pueda usar background-attachment:fixed (una vez por página)
  const bgAttr = img ? ` data-bg="${escapeAttr(img)}" style="background-image:url('${img}');"` : '';
  return `
  <div class="sheet content-sheet"${bgAttr}>
    <div class="content-sheet-overlay">
      <div class="content-sheet-toolbar">
        <strong>${label}</strong>
        ${renderMembreteControl(stateKey)}
      </div>
      <div class="content-page-area">
        ${innerHTML}
      </div>
    </div>
  </div>`;
}

/* ----- ELEMENTOS DE TEXTO ESTRUCTURADO ----- */
function h1(text)    { return `<h1 class="ctt-h1">${text}</h1>`; }
function h2(text)    { return `<h2 class="ctt-h2">${text}</h2>`; }
function p(html)     { return `<p class="ctt-p">${html}</p>`; }

function input(id, ph, size='md') {
  return `<input type="text" class="ctt-inline ctt-inline-${size}" id="${id}"
    placeholder="${ph||''}" oninput="autoSizeInline(this); saveFieldState('${id}')" />`;
}

function autoSizeInline(el) {
  if (!el) return;
  const measure = document.getElementById('__ctt-measure') || (() => {
    const s = document.createElement('span');
    s.id = '__ctt-measure';
    s.style.cssText = 'position:absolute;visibility:hidden;white-space:pre;left:-9999px;top:-9999px;padding:0 4px;';
    document.body.appendChild(s);
    return s;
  })();
  const cs = window.getComputedStyle(el);
  measure.style.font = cs.font;
  measure.style.fontFamily = cs.fontFamily;
  measure.style.fontSize = cs.fontSize;
  measure.style.fontWeight = cs.fontWeight;
  measure.style.letterSpacing = cs.letterSpacing;
  measure.textContent = el.value || el.placeholder || '';
  const textW = measure.offsetWidth + 14;
  // Limitar al contenedor padre para no desbordar el layout
  const maxW = (el.closest('.ctt-study-line, .ctt-p, .content-page-area')?.clientWidth || 600) - 80;
  el.style.width = Math.min(Math.max(60, textW), Math.max(120, maxW)) + 'px';
}

function autoSizeAllInline(root) {
  (root || document).querySelectorAll('.ctt-inline').forEach(autoSizeInline);
}

function select(id, opts) {
  return `<select class="ctt-inline" id="${id}" onchange="saveFieldState('${id}')">
    <option value="">--</option>
    ${opts.map(o => `<option value="${o}">${o}</option>`).join('')}
  </select>`;
}

function textarea(id, ph) {
  return `<textarea class="ctt-textarea" id="${id}"
    placeholder="${ph||''}" oninput="autoGrow(this); saveFieldState('${id}')"></textarea>`;
}

/* ----- TEXTO FIJO EDITABLE ----- */
function renderEditableFixed(id, defaultText) {
  const current = appState[id] !== undefined ? appState[id] : defaultText;
  const isEdited = appState[id] !== undefined && appState[id] !== defaultText;
  return `
  <div class="ctt-fixed" data-default="${escapeAttr(defaultText)}" id="wrap-${id}">
    <p class="ctt-fixed-text${isEdited ? ' ctt-fixed-edited' : ''}" id="text-${id}">${escapeHtml(current)}</p>
    <textarea class="ctt-fixed-textarea" id="${id}" style="display:none"
      oninput="autoGrow(this); saveFieldState('${id}'); syncFixedText('${id}')">${escapeHtml(current)}</textarea>
    <div class="ctt-fixed-actions">
      <button class="btn-tiny" onclick="toggleFixedEdit('${id}')" id="btn-edit-${id}">✏ Editar</button>
      <button class="btn-tiny btn-tiny-reset" onclick="resetFixed('${id}')" id="btn-reset-${id}"${isEdited?'':' style="display:none"'}>↺ Restaurar</button>
    </div>
  </div>`;
}

function toggleFixedEdit(id) {
  const wrap   = document.getElementById(`wrap-${id}`);
  const text   = document.getElementById(`text-${id}`);
  const ta     = document.getElementById(id);
  const btn    = document.getElementById(`btn-edit-${id}`);
  if (!ta) return;
  const editing = ta.style.display !== 'none';
  if (editing) {
    ta.style.display = 'none';
    text.style.display = '';
    text.textContent = ta.value;
    btn.textContent = '✏ Editar';
  } else {
    ta.style.display = 'block';
    text.style.display = 'none';
    btn.textContent = '✓ Listo';
    autoGrow(ta);
    ta.focus();
  }
}

function syncFixedText(id) {
  const text = document.getElementById(`text-${id}`);
  const ta   = document.getElementById(id);
  const wrap = document.getElementById(`wrap-${id}`);
  const reset = document.getElementById(`btn-reset-${id}`);
  if (!text || !ta || !wrap) return;
  text.textContent = ta.value;
  const def = wrap.dataset.default || '';
  const edited = ta.value !== def;
  text.classList.toggle('ctt-fixed-edited', edited);
  if (reset) reset.style.display = edited ? '' : 'none';
}

function resetFixed(id) {
  const wrap = document.getElementById(`wrap-${id}`);
  const ta   = document.getElementById(id);
  if (!wrap || !ta) return;
  const def = wrap.dataset.default || '';
  ta.value = def;
  delete appState[id];
  saveToStorage();
  syncFixedText(id);
}

/* ----- TEXTAREA AUTOGROW ----- */
function autoGrow(el) {
  if (!el) return;
  el.style.height = 'auto';
  el.style.height = (el.scrollHeight + 2) + 'px';
}

function restoreAutoGrow(ids) {
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el && el.tagName === 'TEXTAREA') autoGrow(el);
  });
}

/* ----- ESCAPE ----- */
function escapeHtml(s) {
  return String(s||'').replace(/[&<>"']/g, c => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[c]));
}
function escapeAttr(s) { return escapeHtml(s); }

/* ----- BLOQUES DINÁMICOS (campos extra) ----- */
function renderDynamicBlock(stateKey, addBtnLabel='+ Agregar bloque') {
  const items = appState[stateKey] || [];
  return `
  <div class="ctt-dynamic" id="dyn-${stateKey}">
    ${items.map((_, i) => renderDynamicItem(stateKey, i)).join('')}
  </div>
  <button class="btn-secondary btn-add-block" onclick="addDynamicBlock('${stateKey}')">${addBtnLabel}</button>`;
}

function renderDynamicItem(stateKey, i) {
  const items = appState[stateKey] || [];
  const item  = items[i] || { title:'', body:'' };
  return `
  <div class="ctt-dynamic-item" data-index="${i}">
    <input type="text" class="ctt-dynamic-title" placeholder="SUBTÍTULO"
      value="${escapeAttr(item.title)}" oninput="updateDynamicBlock('${stateKey}',${i},'title',this.value)" />
    <textarea class="ctt-dynamic-body" placeholder="Contenido de desarrollo..."
      oninput="autoGrow(this); updateDynamicBlock('${stateKey}',${i},'body',this.value)">${escapeHtml(item.body)}</textarea>
    <button class="btn-remove btn-dynamic-remove" onclick="removeDynamicBlock('${stateKey}',${i})">✕</button>
  </div>`;
}

function addDynamicBlock(stateKey) {
  if (!appState[stateKey]) appState[stateKey] = [];
  appState[stateKey].push({ title:'', body:'' });
  saveToStorage();
  refreshDynamic(stateKey);
}

function updateDynamicBlock(stateKey, i, field, val) {
  if (!appState[stateKey]) appState[stateKey] = [];
  if (!appState[stateKey][i]) appState[stateKey][i] = { title:'', body:'' };
  appState[stateKey][i][field] = val;
  saveToStorage();
}

function removeDynamicBlock(stateKey, i) {
  if (!appState[stateKey]) return;
  appState[stateKey].splice(i, 1);
  saveToStorage();
  refreshDynamic(stateKey);
}

function refreshDynamic(stateKey) {
  const container = document.getElementById(`dyn-${stateKey}`);
  if (!container) return;
  const items = appState[stateKey] || [];
  container.innerHTML = items.map((_, i) => renderDynamicItem(stateKey, i)).join('');
  container.querySelectorAll('textarea').forEach(autoGrow);
}

/* ----- LISTAS NUMERADAS (sugerencias) ----- */
function renderNumberedList(stateKey, placeholder='Sugerencia...') {
  const items = appState[stateKey] || [];
  return `
  <ol class="ctt-numbered" id="num-${stateKey}">
    ${items.map((_, i) => renderNumberedItem(stateKey, i, placeholder)).join('')}
  </ol>
  <button class="btn-secondary btn-add-block" onclick="addNumberedItem('${stateKey}','${placeholder}')">+ Agregar sugerencia</button>`;
}

function renderNumberedItem(stateKey, i, placeholder) {
  const items = appState[stateKey] || [];
  const val   = items[i] || '';
  return `
  <li class="ctt-numbered-item">
    <textarea class="ctt-numbered-body" placeholder="${placeholder}"
      oninput="autoGrow(this); updateNumberedItem('${stateKey}',${i},this.value)">${escapeHtml(val)}</textarea>
    <button class="btn-remove btn-dynamic-remove" onclick="removeNumberedItem('${stateKey}',${i})">✕</button>
  </li>`;
}

function addNumberedItem(stateKey, ph) {
  if (!appState[stateKey]) appState[stateKey] = [];
  appState[stateKey].push('');
  saveToStorage();
  refreshNumbered(stateKey, ph);
}

function updateNumberedItem(stateKey, i, val) {
  if (!appState[stateKey]) appState[stateKey] = [];
  appState[stateKey][i] = val;
  saveToStorage();
}

function removeNumberedItem(stateKey, i) {
  if (!appState[stateKey]) return;
  appState[stateKey].splice(i, 1);
  saveToStorage();
  refreshNumbered(stateKey);
}

function refreshNumbered(stateKey, ph='') {
  const ol = document.getElementById(`num-${stateKey}`);
  if (!ol) return;
  const items = appState[stateKey] || [];
  ol.innerHTML = items.map((_, i) => renderNumberedItem(stateKey, i, ph)).join('');
  ol.querySelectorAll('textarea').forEach(autoGrow);
}

/* ----- CONDICIONAL POR SEXO ----- */
function renderIfSex(sex, html) {
  // sex: 'M', 'F', or 'any'
  const current = appState.patientSex || appState['c5-sexo'] || '';
  const show = (sex === 'any')
    || (sex === 'M' && current === 'Masculino')
    || (sex === 'F' && current === 'Femenino');
  return `<div class="ctt-conditional ctt-sex-${sex}" ${show ? '' : 'style="display:none"'}>${html}</div>`;
}

function refreshSexConditionals() {
  const current = appState['c5-sexo'] || '';
  document.querySelectorAll('.ctt-sex-M').forEach(el => {
    el.style.display = current === 'Masculino' ? '' : 'none';
  });
  document.querySelectorAll('.ctt-sex-F').forEach(el => {
    el.style.display = current === 'Femenino' ? '' : 'none';
  });
}

/* ----- ATTACHMENT (imagen adjunta para estudios) -----
 * Si se pasa pdfKey, se agrega también un botón para cargar un PDF del reporte
 * que SUSTITUYE el formato (dispara el input de renderPdfReplace con esa clave). */
function renderAttachment(stateKey, label='Adjuntar imagen / reporte', pdfKey=null) {
  const img = effectiveImage(stateKey);
  return `
  <div class="ctt-attachment" id="att-${stateKey}">
    ${img ? `<img src="${img}" class="ctt-attachment-img" />` : ''}
    <div class="ctt-attachment-actions">
      <button class="btn-secondary" onclick="document.getElementById('att-input-${stateKey}').click()">
        📎 ${img ? 'Cambiar imagen' : label}
      </button>
      ${img ? `<button class="btn-remove" onclick="removeAttachment('${stateKey}')">✕</button>` : ''}
      ${pdfKey ? `<button class="btn-secondary btn-pdf-load" onclick="document.getElementById('pdf-input-${pdfKey}').click()">
        📄 Cargar reporte PDF (sustituye el formato)
      </button>` : ''}
    </div>
    <input type="file" id="att-input-${stateKey}" style="display:none"
      accept="image/*" onchange="setAttachment(event,'${stateKey}')" />
  </div>`;
}

function setAttachment(event, stateKey) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    appState[stateKey] = ev.target.result;
    saveToStorage();
    navigateTo(currentSheetIndex);
  };
  reader.readAsDataURL(file);
}

function removeAttachment(stateKey) {
  delete appState[stateKey];
  saveToStorage();
  navigateTo(currentSheetIndex);
}

/* ----- TOGGLE OMITIR ESTUDIO ----- */
function renderOmitToggle(id, label='Omitir este estudio') {
  const omitted = appState[`omit-${id}`] === 'true';
  return `
  <label class="ctt-omit">
    <input type="checkbox" id="omit-chk-${id}" ${omitted ? 'checked' : ''}
      onchange="toggleOmit('${id}', this.checked)" />
    <span>${label}</span>
  </label>`;
}

function toggleOmit(id, checked) {
  appState[`omit-${id}`] = checked ? 'true' : 'false';
  saveToStorage();
  const block = document.getElementById(`block-${id}`);
  if (block) block.classList.toggle('ctt-omitted', checked);
}

/* ----- PDF DE REEMPLAZO (sustituye el formato editable por un PDF cargado) -----
 * El botón para CARGAR el PDF vive ahora dentro de la zona "Adjuntar imagen del
 * reporte" (ver renderAttachment con pdfKey). Aquí solo mostramos, cuando ya hay
 * un PDF cargado, los botones para reemplazarlo o quitarlo (el formato se oculta). */
function renderPdfReplace(stateKey, formatHTML, label = 'Cargar PDF con la información') {
  const pdf = appState[stateKey];
  const hasPdf = !!pdf;
  return `
  <div class="ctt-pdf-replace" id="pdfrep-${stateKey}">
    <div class="ctt-pdf-control no-print">
      ${hasPdf ? `
        <button class="btn-secondary btn-pdf-load" onclick="document.getElementById('pdf-input-${stateKey}').click()">📄 Reemplazar PDF cargado</button>
        <button class="btn-remove" onclick="removePdfReplace('${stateKey}')">✕ Quitar PDF (volver al formato)</button>` : ''}
      <input type="file" id="pdf-input-${stateKey}" style="display:none"
        accept="application/pdf" onchange="setPdfReplace(event,'${stateKey}')" />
    </div>
    ${hasPdf
      ? `<div class="ctt-pdf-preview">
           <p class="ctt-pdf-note no-print">📄 Se usará el PDF cargado en lugar del formato. El formato editable queda oculto y el PDF se incrustará en la exportación.</p>
           <iframe class="ctt-pdf-frame" src="${pdf}" title="PDF cargado"></iframe>
         </div>`
      : `<div class="ctt-format-area">${formatHTML}</div>`}
  </div>`;
}

function setPdfReplace(event, stateKey) {
  const file = event.target.files[0];
  if (!file) return;
  if (file.type !== 'application/pdf') {
    alert('Por favor selecciona un archivo PDF.');
    return;
  }
  if (file.size > 6 * 1024 * 1024) {
    if (!confirm('El PDF pesa más de 6 MB. Es posible que no se pueda guardar localmente. ¿Continuar de todos modos?')) {
      event.target.value = '';
      return;
    }
  }
  const reader = new FileReader();
  reader.onload = ev => {
    appState[stateKey] = ev.target.result;
    saveToStorage();
    // Verificar que realmente se guardó (la cuota de localStorage pudo fallar)
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw || JSON.parse(raw)[stateKey] !== ev.target.result) {
        alert('El PDF es demasiado grande para guardarse localmente. Se mostrará en esta sesión, pero podría perderse al recargar. Considera un PDF más liviano.');
      }
    } catch (e) {}
    navigateTo(currentSheetIndex);
  };
  reader.readAsDataURL(file);
}

function removePdfReplace(stateKey) {
  if (!confirm('¿Quitar el PDF y volver a usar el formato editable?')) return;
  delete appState[stateKey];
  saveToStorage();
  navigateTo(currentSheetIndex);
}

/* ----- OMITIR SECCIÓN COMPLETA (portada + contenido de estudios) ----- */
function isSectionOmitted(sectionKey) {
  const v = appState['skip-section-' + sectionKey];
  return v === true || v === 'true';
}

function renderSectionOmit(sectionKey, sectionLabel) {
  const skipped = isSectionOmitted(sectionKey);
  return `
  <div class="ctt-section-omit no-print" id="secomit-${sectionKey}">
    <label class="ctt-omit">
      <input type="checkbox" ${skipped ? 'checked' : ''}
        onchange="toggleSectionOmit('${sectionKey}', this.checked)" />
      <span>Omitir esta sección — no incluir Portada ni Contenido (${sectionLabel}) en el PDF / impresión</span>
    </label>
    ${skipped ? `<p class="ctt-section-omit-note">⚠ Esta sección está omitida: su portada y su contenido NO aparecerán en la exportación.</p>` : ''}
  </div>`;
}

function toggleSectionOmit(sectionKey, checked) {
  appState['skip-section-' + sectionKey] = checked;
  saveToStorage();
  buildNav();
  navigateTo(currentSheetIndex);
}

/* ===== ESTUDIOS DE LABORATORIO ESTRUCTURADOS =====
 * Cada estudio guarda valor + rango (mín/máx). El badge Normal/Alto/Bajo y la
 * barra indicadora se calculan solos comparando el valor con el rango. Los
 * valores viven en appState bajo claves `lab-<grupo>-<id>-val|min|max`. */

function labGet(id, def) {
  return appState[id] !== undefined ? appState[id] : (def !== undefined ? String(def) : '');
}

/** Devuelve {status:'normal'|'alto'|'bajo'|'', label, pct, bandLo, bandHi}. */
function computeLab(value, min, max) {
  const v = parseFloat(value), lo = parseFloat(min), hi = parseFloat(max);
  if (isNaN(v) || isNaN(lo) || isNaN(hi) || hi <= lo) {
    return { status: '', label: '', pct: null, bandLo: null, bandHi: null };
  }
  const span = hi - lo;
  const a = lo - span * 0.6, b = hi + span * 0.6;   // ejes del riel con contexto
  const clamp = (x) => Math.max(0, Math.min(1, x));
  const pct    = clamp((v - a) / (b - a)) * 100;
  const bandLo = clamp((lo - a) / (b - a)) * 100;
  const bandHi = clamp((hi - a) / (b - a)) * 100;
  let status = 'normal', label = 'Normal';
  if (v < lo)      { status = 'bajo'; label = 'Bajo'; }
  else if (v > hi) { status = 'alto'; label = 'Alto'; }
  return { status, label, pct, bandLo, bandHi };
}

function renderLabCard(group, title, studies) {
  return `
  <div class="lab-card">
    <div class="lab-card-head">
      <h3 class="lab-title">${title}</h3>
      <div class="lab-legend">
        <span class="lab-leg"><span class="lab-leg-dot ok"></span>Dentro de rango</span>
        <span class="lab-leg"><span class="lab-leg-dot bad"></span>Fuera de rango</span>
      </div>
    </div>
    <table class="lab-table">
      <thead><tr>
        <th>Estudio</th><th>Resultado</th><th>Referencia</th>
        <th>Indicador</th><th class="lab-th-estado">Estado</th>
      </tr></thead>
      <tbody>${studies.map((s) => renderLabRow(group, s)).join('')}</tbody>
    </table>
  </div>`;
}

function renderLabRow(g, s) {
  const base = `lab-${g}-${s.id}`;
  // Estado horneado en el HTML (para que el PDF conserve barra y badge sin re-pintar)
  const r = computeLab(labGet(base + '-val', ''), labGet(base + '-min', s.min), labGet(base + '-max', s.max));
  const bandStyle = r.pct == null ? 'left:0;width:0' : `left:${r.bandLo}%;width:${r.bandHi - r.bandLo}%`;
  const dotStyle  = r.pct == null ? 'display:none' : `left:${r.pct}%`;
  const dotCls    = r.status === 'normal' ? 'ok' : (r.status ? 'bad' : '');
  const badgeCls  = !r.label ? 'neutral' : (r.status === 'normal' ? 'ok' : 'bad');
  return `
  <tr class="lab-row" data-lab="${g}:${s.id}">
    <td class="lab-estudio">${s.label}</td>
    <td class="lab-result">
      <input class="lab-input lab-input-val" id="${base}-val" type="text" inputmode="decimal"
        value="${escapeAttr(labGet(base + '-val', ''))}" oninput="onLabInput('${g}','${s.id}')" />
      <span class="lab-unit">${s.unit || ''}</span>
    </td>
    <td class="lab-ref">
      <input class="lab-input lab-input-ref" id="${base}-min" type="text" inputmode="decimal"
        value="${escapeAttr(labGet(base + '-min', s.min))}" oninput="onLabInput('${g}','${s.id}')" />
      <span class="lab-ref-sep">–</span>
      <input class="lab-input lab-input-ref" id="${base}-max" type="text" inputmode="decimal"
        value="${escapeAttr(labGet(base + '-max', s.max))}" oninput="onLabInput('${g}','${s.id}')" />
      <span class="lab-unit">${s.unit || ''}</span>
    </td>
    <td class="lab-ind">
      <div class="lab-bar" id="labbar-${g}-${s.id}">
        <div class="lab-bar-band" style="${bandStyle}"></div>
        <div class="lab-bar-dot ${dotCls}" style="${dotStyle}"></div>
      </div>
    </td>
    <td class="lab-estado"><span class="lab-badge ${badgeCls}" id="labbadge-${g}-${s.id}">${r.label || '—'}</span></td>
  </tr>`;
}

function onLabInput(g, id) {
  const base = `lab-${g}-${id}`;
  ['val', 'min', 'max'].forEach((k) => {
    const el = document.getElementById(`${base}-${k}`);
    if (el) appState[`${base}-${k}`] = el.value;
  });
  saveToStorage();
  paintLabRow(g, id);
}

function paintLabRow(g, id) {
  const base = `lab-${g}-${id}`;
  const gv = (k) => { const e = document.getElementById(`${base}-${k}`); return e ? e.value : ''; };
  const r = computeLab(gv('val'), gv('min'), gv('max'));
  const bar = document.getElementById(`labbar-${g}-${id}`);
  if (bar) {
    const band = bar.querySelector('.lab-bar-band');
    const dot  = bar.querySelector('.lab-bar-dot');
    if (r.pct == null) {
      if (dot)  dot.style.display = 'none';
      if (band) { band.style.left = '0'; band.style.width = '0'; }
    } else {
      if (band) { band.style.left = r.bandLo + '%'; band.style.width = (r.bandHi - r.bandLo) + '%'; }
      if (dot)  { dot.style.display = ''; dot.style.left = r.pct + '%'; dot.className = 'lab-bar-dot ' + (r.status === 'normal' ? 'ok' : 'bad'); }
    }
  }
  const badge = document.getElementById(`labbadge-${g}-${id}`);
  if (badge) {
    badge.textContent = r.label || '—';
    badge.className = 'lab-badge ' + (!r.label ? 'neutral' : r.status === 'normal' ? 'ok' : 'bad');
  }
}

function refreshAllLabs() {
  document.querySelectorAll('[data-lab]').forEach((el) => {
    const [g, id] = el.dataset.lab.split(':');
    paintLabRow(g, id);
  });
}

/* ----- ESTUDIOS CUALITATIVOS (valor de texto → pastilla por color) ----- */
function qualClass(text) {
  const t = (text || '').toLowerCase();
  if (/negativ|no reactiv|normal|ausen|sin alterac/.test(t)) return 'ok';
  if (/positiv|reactiv|anormal|alterad/.test(t)) return 'bad';
  return 'neutral';
}

function renderQualCard(group, title, items) {
  return `
  <div class="lab-card lab-card-qual">
    <div class="lab-card-head"><h3 class="lab-title">${title}</h3></div>
    <table class="lab-table">
      <tbody>${items.map((it) => renderQualRow(group, it)).join('')}</tbody>
    </table>
  </div>`;
}

function renderQualRow(g, it) {
  const base = `qual-${g}-${it.id}`;
  const val  = labGet(base + '-val', '');
  return `
  <tr class="lab-qual-row" data-qual="${g}:${it.id}">
    <td class="lab-estudio">${it.label}</td>
    <td class="lab-estado">
      <input class="lab-qual-pill ${qualClass(val)}" id="${base}-val" type="text"
        value="${escapeAttr(val)}" placeholder="—" oninput="onQualInput('${g}','${it.id}')" />
    </td>
  </tr>`;
}

function onQualInput(g, id) {
  const el = document.getElementById(`qual-${g}-${id}-val`);
  if (!el) return;
  appState[`qual-${g}-${id}-val`] = el.value;
  saveToStorage();
  el.className = 'lab-qual-pill ' + qualClass(el.value);
}

function refreshAllQual() {
  document.querySelectorAll('[data-qual]').forEach((el) => {
    const [g, id] = el.dataset.qual.split(':');
    const inp = document.getElementById(`qual-${g}-${id}-val`);
    if (inp) inp.className = 'lab-qual-pill ' + qualClass(inp.value);
  });
}

/* ===== TARJETAS DE PRESENTACIÓN (resumen, antecedentes, signos vitales) ===== */
function renderInfoCard(title, bodyHtml, opts) {
  opts = opts || {};
  const accent = opts.accent ? ` info-card-${opts.accent}` : '';
  const icon = opts.icon ? `<span class="info-card-icon">${opts.icon}</span>` : '';
  return `<div class="info-card${accent}">
    ${title ? `<div class="info-card-head">${icon}<h3 class="info-card-title">${title}</h3></div>` : ''}
    <div class="info-card-body">${bodyHtml}</div>
  </div>`;
}

function renderFieldGrid(cells, cols) {
  return `<div class="field-grid cols-${cols || 2}">${cells.join('')}</div>`;
}
function fieldCell(label, fieldHtml) {
  return `<div class="field-cell"><span class="field-label">${label}</span>${fieldHtml}</div>`;
}

function renderMetricCards(metrics) {
  return `<div class="metric-grid">${metrics.map((m) => `
    <div class="metric-card">
      <div class="metric-label">${m.label}</div>
      <div class="metric-field">${m.field}${m.unit ? `<span class="metric-unit">${m.unit}</span>` : ''}</div>
    </div>`).join('')}</div>`;
}

/* ===== RESUMEN POR SISTEMAS (estado + tarjetas con borde de color) ===== */
function renderSysSummary(systems) {
  // Estado horneado para que el PDF conserve colores y conteo sin re-pintar.
  let normal = 0;
  const chips = systems.map((s) => {
    const st = appState['sys-status-' + s.key] || 'normal';
    if (st === 'normal') normal++;
    const cls = st === 'normal' ? 'ok' : 'warn';
    const txt = st === 'normal' ? 'Sin alteraciones' : 'Con hallazgos';
    return `<div class="sys-chip ${cls}" id="sys-chip-${s.key}" data-sys="${s.key}">
      <span class="sys-chip-dot"></span>
      <span class="sys-chip-name">${s.short}</span>
      <span class="sys-chip-state" id="sys-chip-state-${s.key}">${txt}</span>
    </div>`;
  }).join('');
  return `<div class="sys-summary" id="sys-summary">
    <div class="sys-summary-top">
      <div class="sys-summary-badge" id="sys-summary-count">${normal}/${systems.length}</div>
      <div class="sys-summary-text">
        <strong>Resumen por sistemas</strong>
        <span>sistemas evaluados sin alteraciones</span>
      </div>
    </div>
    <div class="sys-summary-grid">${chips}</div>
  </div>`;
}

// Clase del bloque de sistema con su color de estado horneado (para el PDF).
function sysBlockClass(key) {
  const st = appState['sys-status-' + key] || 'normal';
  return 'sys-block ' + (st === 'normal' ? 'ok' : 'warn');
}

function renderSysHeader(key, title) {
  const v = appState['sys-status-' + key] || 'normal';
  return `<div class="sys-head">
    <h1 class="ctt-h1 sys-head-title">${title}</h1>
    <select class="sys-status-select ${v}" id="sys-status-${key}" onchange="onSysStatus('${key}')">
      <option value="normal"${v === 'normal' ? ' selected' : ''}>Sin alteraciones</option>
      <option value="hallazgo"${v === 'hallazgo' ? ' selected' : ''}>Con hallazgos</option>
    </select>
  </div>`;
}

function onSysStatus(key) {
  const el = document.getElementById('sys-status-' + key);
  if (!el) return;
  appState['sys-status-' + key] = el.value;
  saveToStorage();
  el.className = 'sys-status-select ' + el.value;
  refreshSysSummary();
}

function refreshSysSummary() {
  const chips = document.querySelectorAll('[data-sys]');
  if (!chips.length) return;
  let normal = 0;
  chips.forEach((chip) => {
    const key = chip.dataset.sys;
    const st = appState['sys-status-' + key] || 'normal';
    if (st === 'normal') normal++;
    chip.className = 'sys-chip ' + (st === 'normal' ? 'ok' : 'warn');
    const lbl = document.getElementById('sys-chip-state-' + key);
    if (lbl) lbl.textContent = st === 'normal' ? 'Sin alteraciones' : 'Con hallazgos';
  });
  document.querySelectorAll('[data-sysblock]').forEach((b) => {
    const st = appState['sys-status-' + b.dataset.sysblock] || 'normal';
    b.classList.remove('ok', 'warn');
    b.classList.add(st === 'normal' ? 'ok' : 'warn');
  });
  const c = document.getElementById('sys-summary-count');
  if (c) c.textContent = `${normal}/${chips.length}`;
}

/* ----- ESTUDIO INDIVIDUAL (línea + omit toggle) ----- */
function renderStudyLine(id, html) {
  const omitted = appState[`omit-${id}`] === 'true';
  return `
  <div class="ctt-study-line${omitted ? ' ctt-omitted' : ''}" id="block-${id}">
    <label class="ctt-omit ctt-omit-inline">
      <input type="checkbox" id="omit-chk-${id}" ${omitted ? 'checked' : ''}
        onchange="toggleOmit('${id}', this.checked)" />
      <span>Omitir</span>
    </label>
    <p class="ctt-p ctt-study-text">${html}</p>
  </div>`;
}
