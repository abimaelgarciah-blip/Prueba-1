/* ===== HOJA: EVALUACIÓN NUTRICIONAL =====
 * Panel de selección integrado al expediente del paciente.
 * Sus selecciones se guardan en appState.nutri (y por tanto en Supabase /
 * localStorage junto con el resto del expediente). No se imprime como hoja HTML:
 * al exportar el PDF completo, se anexan al final las páginas de la plantilla
 * nutricional (portadas + hoja de dieta + anexos) mediante pdf-lib.
 */
// config.js declara CONFIG_PREDETERMINADA con `const`, que NO queda como
// propiedad de window. Lo exponemos para que el resto del código lo encuentre.
if (typeof CONFIG_PREDETERMINADA !== 'undefined') window.CONFIG_PREDETERMINADA = CONFIG_PREDETERMINADA;

window.sheetNutricional = {
  id: 'evaluacion-nutricional',
  label: '🥗 Evaluación Nutricional',
  type: 'nutricional',
  skipHtmlExport: true, // no se renderiza como imagen en el PDF; se anexa con pdf-lib

  render() {
    const cfg = window.CONFIG_PREDETERMINADA;
    if (!cfg) {
      return `<div class="nutri-panel"><p class="nutri-aviso">No se pudo cargar la configuración nutricional (config.js).</p></div>`;
    }
    const n = nutriState();

    const secciones = cfg.secciones.map(s => {
      const checked = n.secciones[s.id] ? 'checked' : '';
      let html = `
        <li class="nutri-row">
          <input type="checkbox" id="nutri-sec-${s.id}" ${checked}
            onchange="nutriToggleSeccion('${s.id}', this.checked)" />
          <label for="nutri-sec-${s.id}" class="nutri-row-name">${escapeHtml(s.nombre)}</label>
          <span class="nutri-badge">pág. ${s.paginas}</span>
        </li>`;
      // Panel de hoja de dieta justo después de la portada del plan
      if (s.id === cfg.dieta.despuesDe) html += nutriRenderDietaPanel();
      // Espacio para insertar PDFs externos justo después de esta portada
      if (s.slotExterno) html += nutriRenderSlotExterno(s.slotExterno);
      return html;
    }).join('');

    return `
    <div class="nutri-panel">
      <h1 class="ctt-h1">EVALUACIÓN CORPORAL Y NUTRICIONAL</h1>
      <p class="nutri-aviso">Selecciona qué incluir para este paciente. Todo lo marcado se agrega
        <strong>al final del PDF</strong> al usar <strong>“Exportar PDF completo”</strong>.</p>

      <div class="nutri-card">
        <h3>Secciones del documento</h3>
        <ul class="nutri-list">${secciones}</ul>
      </div>

      <div class="nutri-card">
        <h3>Anexos</h3>
        <div class="nutri-anexos-controls">
          <input type="search" id="nutri-buscar" placeholder="🔍 Buscar anexo (ej. hierro, diabetes)…"
            oninput="nutriFilterAnexos()" />
          <div class="nutri-anexos-row">
            <input type="text" id="nutri-paginas" placeholder="Por páginas: 9, 12-14, 26" />
            <button class="btn-secondary" onclick="nutriAddByPage()">Seleccionar</button>
            <button class="btn-secondary" onclick="nutriSelectAllAnexos()">Todos</button>
            <button class="btn-secondary" onclick="nutriClearAnexos()">Ninguno</button>
            <span class="nutri-contador" id="nutri-contador"></span>
          </div>
        </div>
        <ul class="nutri-list nutri-anexos-list" id="nutri-anexos-list">${nutriRenderAnexos()}</ul>
      </div>

      <div class="nutri-card">
        <h3>Avanzado</h3>
        <label class="nutri-extra-label" for="nutri-extra">Páginas adicionales de la plantilla (al final):</label>
        <input type="text" id="nutri-extra" placeholder="ej. 5, 23-25"
          value="${escapeAttr(n.extra)}" onchange="nutriSetExtra(this.value)" />
      </div>
    </div>`;
  },

  restore() {
    nutriUpdateContador();
  }
};

/* ----- Estado ----- */
function nutriState() {
  if (!appState.nutri) appState.nutri = {};
  const n = appState.nutri;
  if (!n.secciones) n.secciones = {};
  const cfg = window.CONFIG_PREDETERMINADA;
  if (cfg) cfg.secciones.forEach(s => { if (!(s.id in n.secciones)) n.secciones[s.id] = true; });
  if (n.kcal === undefined) n.kcal = '';
  if (n.nombre === undefined) n.nombre = '';
  if (!Array.isArray(n.anexos)) n.anexos = [];
  if (n.extra === undefined) n.extra = '';
  if (!n.externos || typeof n.externos !== 'object') n.externos = {};
  return n;
}

/* ----- Hoja de dieta ----- */
function nutriRenderDietaPanel() {
  const n = nutriState();
  const cfg = window.CONFIG_PREDETERMINADA.dieta;
  const opts = [];
  for (let k = cfg.kcalMin; k <= cfg.kcalMax; k += cfg.paso) {
    opts.push(`<option value="${k}" ${String(n.kcal) === String(k) ? 'selected' : ''}>${k} kcal</option>`);
  }
  return `
  <li class="nutri-dieta">
    <div class="nutri-dieta-title">↳ Hoja de dieta por kcal (se inserta después de esta portada)</div>
    <div class="nutri-dieta-row">
      <select id="nutri-kcal" onchange="nutriSetKcal(this.value)">
        <option value="">Sin hoja de dieta</option>
        ${opts.join('')}
      </select>
      <input type="text" id="nutri-nombre" placeholder="Nombre en la hoja (vacío = nombre del paciente)"
        value="${escapeAttr(n.nombre)}" oninput="nutriSetNombre(this.value)" />
    </div>
  </li>`;
}

/* ----- PDFs externos (slot por sección) -----
 * Permite insertar uno o varios PDFs externos justo después de la portada
 * correspondiente. Los archivos se guardan como data URL dentro de
 * appState.nutri.externos[slotId] y se incrustan en la exportación. */
function nutriFindSlot(slotId) {
  const cfg = window.CONFIG_PREDETERMINADA;
  if (!cfg) return null;
  for (const s of cfg.secciones) {
    if (s.slotExterno && s.slotExterno.id === slotId) return s.slotExterno;
  }
  return null;
}

function nutriRenderSlotExterno(slot) {
  const n = nutriState();
  const files = Array.isArray(n.externos[slot.id]) ? n.externos[slot.id] : [];
  const lista = files.map((f, i) => `
    <li class="nutri-ext-file">
      <span class="nutri-ext-name">📄 ${escapeHtml(f.name || 'PDF externo')}</span>
      <button class="btn-remove" title="Quitar este PDF" onclick="nutriRemoveExterno('${slot.id}', ${i})">✕</button>
    </li>`).join('');
  return `
  <li class="nutri-externo" id="nutri-ext-${slot.id}">
    <div class="nutri-externo-title">↳ ${escapeHtml(slot.etiqueta)}</div>
    ${files.length
      ? `<ul class="nutri-ext-list">${lista}</ul>`
      : `<p class="nutri-ext-empty">Aún no se ha insertado ningún PDF externo.</p>`}
    <div class="nutri-externo-actions">
      <button class="btn-secondary btn-pdf-load" onclick="document.getElementById('nutri-ext-input-${slot.id}').click()">
        📎 Insertar PDF externo
      </button>
      <input type="file" id="nutri-ext-input-${slot.id}" accept="application/pdf" multiple style="display:none"
        onchange="nutriAddExterno(event, '${slot.id}')" />
    </div>
  </li>`;
}

function nutriRefreshExterno(slotId) {
  const el = document.getElementById('nutri-ext-' + slotId);
  const slot = nutriFindSlot(slotId);
  if (el && slot) el.outerHTML = nutriRenderSlotExterno(slot);
}

function nutriAddExterno(event, slotId) {
  const files = [...(event.target.files || [])];
  event.target.value = '';
  if (!files.length) return;
  const noPdf = files.filter(f => f.type !== 'application/pdf');
  const pdfs  = files.filter(f => f.type === 'application/pdf');
  if (noPdf.length) alert('Solo se aceptan archivos PDF. Se ignoraron: ' + noPdf.map(f => f.name).join(', '));
  if (!pdfs.length) return;

  const n = nutriState();
  if (!Array.isArray(n.externos[slotId])) n.externos[slotId] = [];

  let pendientes = pdfs.length;
  pdfs.forEach(file => {
    const reader = new FileReader();
    reader.onload = ev => {
      n.externos[slotId].push({ name: file.name, data: ev.target.result });
      if (--pendientes === 0) {
        saveToStorage();
        // Verificar que se guardó (la cuota de localStorage puede fallar con PDFs grandes)
        try {
          const raw = localStorage.getItem(STORAGE_KEY);
          if (!raw || !JSON.parse(raw).nutri || !Array.isArray(JSON.parse(raw).nutri.externos?.[slotId])) {
            alert('Los PDFs son demasiado grandes para guardarse localmente. Se usarán en esta sesión, pero podrían perderse al recargar. Considera PDFs más livianos.');
          }
        } catch (e) {}
        nutriRefreshExterno(slotId);
      }
    };
    reader.readAsDataURL(file);
  });
}

function nutriRemoveExterno(slotId, i) {
  const n = nutriState();
  if (!Array.isArray(n.externos[slotId])) return;
  n.externos[slotId].splice(i, 1);
  saveToStorage();
  nutriRefreshExterno(slotId);
}

/* ----- Anexos ----- */
function nutriRenderAnexos() {
  const cfg = window.CONFIG_PREDETERMINADA;
  const n = nutriState();
  const filtro = (document.getElementById('nutri-buscar')?.value || '').trim().toLowerCase();
  return cfg.anexos.filter(a =>
    !filtro || a.nombre.toLowerCase().includes(filtro) || String(a.pagina) === filtro
  ).map(a => {
    const checked = n.anexos.includes(a.pagina) ? 'checked' : '';
    return `
    <li class="nutri-row">
      <input type="checkbox" id="nutri-anexo-${a.pagina}" ${checked}
        onchange="nutriToggleAnexo(${a.pagina}, this.checked)" />
      <label for="nutri-anexo-${a.pagina}" class="nutri-row-name">${escapeHtml(a.nombre)}</label>
      <span class="nutri-badge">pág. ${a.pagina}</span>
    </li>`;
  }).join('');
}

function nutriFilterAnexos() {
  const ul = document.getElementById('nutri-anexos-list');
  if (ul) ul.innerHTML = nutriRenderAnexos();
}

function nutriUpdateContador() {
  const el = document.getElementById('nutri-contador');
  if (!el) return;
  const c = nutriState().anexos.length;
  el.textContent = c === 0 ? 'Ningún anexo' : c === 1 ? '1 anexo' : `${c} anexos`;
}

/* ----- Handlers ----- */
function nutriToggleSeccion(id, checked) {
  nutriState().secciones[id] = checked;
  saveToStorage();
}
function nutriSetKcal(v) {
  nutriState().kcal = v;
  saveToStorage();
}
function nutriSetNombre(v) {
  nutriState().nombre = v;
  saveToStorage();
}
function nutriSetExtra(v) {
  nutriState().extra = v;
  saveToStorage();
}
function nutriToggleAnexo(pagina, checked) {
  const n = nutriState();
  const set = new Set(n.anexos);
  if (checked) set.add(pagina); else set.delete(pagina);
  n.anexos = [...set].sort((a, b) => a - b);
  saveToStorage();
  nutriUpdateContador();
}
function nutriSelectAllAnexos() {
  const n = nutriState();
  n.anexos = window.CONFIG_PREDETERMINADA.anexos.map(a => a.pagina);
  saveToStorage();
  nutriFilterAnexos();
  nutriUpdateContador();
}
function nutriClearAnexos() {
  nutriState().anexos = [];
  saveToStorage();
  nutriFilterAnexos();
  nutriUpdateContador();
}
function nutriAddByPage() {
  const campo = document.getElementById('nutri-paginas');
  if (!campo) return;
  let paginas;
  try { paginas = parsearPaginasNutri(campo.value); }
  catch (e) { alert(e.message); return; }
  const validas = new Set(window.CONFIG_PREDETERMINADA.anexos.map(a => a.pagina));
  const n = nutriState();
  const set = new Set(n.anexos);
  const omitidas = [];
  paginas.forEach(p => { if (validas.has(p)) set.add(p); else omitidas.push(p); });
  n.anexos = [...set].sort((a, b) => a - b);
  campo.value = '';
  saveToStorage();
  nutriFilterAnexos();
  nutriUpdateContador();
  if (omitidas.length) alert(`Estas páginas no son anexos y se omitieron: ${omitidas.join(', ')}.`);
}

/* ----- Parser de páginas ("9, 12-14") ----- */
function parsearPaginasNutri(texto) {
  const out = [];
  const limpio = (texto || '').trim();
  if (!limpio) return out;
  for (const parte of limpio.split(',')) {
    const p = parte.trim();
    if (!p) continue;
    const rango = p.match(/^(\d+)\s*[-–]\s*(\d+)$/);
    if (rango) {
      const a = parseInt(rango[1], 10), b = parseInt(rango[2], 10);
      if (a < 1 || b < a) throw new Error(`Rango inválido: "${p}"`);
      for (let i = a; i <= b; i++) out.push(i);
    } else if (/^\d+$/.test(p)) {
      out.push(parseInt(p, 10));
    } else {
      throw new Error(`No entiendo "${p}". Usa números o rangos, ej. 9, 12-14`);
    }
  }
  return out;
}

/* ----- Orden de páginas nutricionales para el PDF combinado ----- */
function nutriBuildOrder() {
  const cfg = window.CONFIG_PREDETERMINADA;
  if (!cfg) return [];
  const n = nutriState();
  const order = [];
  for (const s of cfg.secciones) {
    if (n.secciones[s.id]) {
      let pages = [];
      try { pages = parsearPaginasNutri(s.paginas); } catch (_) {}
      if (pages.length) order.push({ tipo: 'plantilla', pages });
    }
    if (s.id === cfg.dieta.despuesDe && n.kcal) {
      const nombre = (n.nombre || appState['s1-patient'] || '').trim();
      order.push({ tipo: 'dieta', kcal: n.kcal, nombre });
    }
    // PDFs externos insertados justo después de esta portada (y de su dieta).
    if (s.slotExterno && Array.isArray(n.externos[s.slotExterno.id])) {
      for (const f of n.externos[s.slotExterno.id]) {
        if (f && f.data) order.push({ tipo: 'externo', data: f.data, nombre: f.name || '' });
      }
    }
  }
  for (const p of [...n.anexos].sort((a, b) => a - b)) {
    order.push({ tipo: 'plantilla', pages: [p] });
  }
  let extra = [];
  try { extra = parsearPaginasNutri(n.extra); } catch (_) {}
  if (extra.length) order.push({ tipo: 'plantilla', pages: extra });
  return order;
}
