/* ===== VIEW: PLANTILLAS ===== */

const COVER_TEMPLATES = [
  { key: 'cover-1',  label: 'Portada Principal' },
  { key: 'cover-2',  label: 'Portada Objetivos' },
  { key: 'cover-3',  label: 'Portada Introducción' },
  { key: 'cover-4',  label: 'Portada Hallazgos' },
  { key: 'cover-6',  label: 'Portada Sistemas' },
  { key: 'cover-8',  label: 'Portada Conclusiones' },
  { key: 'cover-10', label: 'Portada Sugerencias' },
  { key: 'cover-12', label: 'Portada Prueba Esfuerzo' },
  { key: 'cover-14', label: 'Portada Espirometría' },
  { key: 'cover-16', label: 'Portada Est. Gabinete' },
  { key: 'cover-18', label: 'Portada Oftalmología' },
  { key: 'cover-20', label: 'Portada Laboratorio' },
];

const MEMBRETE_TEMPLATES = [
  { key: 'mb-5',  label: 'Contenido Hallazgos' },
  { key: 'mb-7',  label: 'Contenido Sistemas' },
  { key: 'mb-9',  label: 'Contenido Conclusiones' },
  { key: 'mb-11', label: 'Contenido Sugerencias' },
  { key: 'mb-13', label: 'Contenido Prueba Esfuerzo' },
  { key: 'mb-15', label: 'Contenido Espirometría' },
  { key: 'mb-17', label: 'Contenido Est. Gabinete' },
  { key: 'mb-19', label: 'Contenido Oftalmología' },
  { key: 'mb-21', label: 'Contenido Laboratorio' },
];

function loadTemplatesView() {
  const container = document.getElementById('templates-content');
  if (!container) return;

  const mbAllImg = templateState['__mb_all__'];

  container.innerHTML = `
    <div class="section-card">
      <h3>Membrete único para todas las hojas</h3>
      <p style="margin:-6px 0 14px;color:#64748b;font-size:0.86rem;">
        Sube una imagen y se usará como membrete en <strong>todas</strong> las hojas de contenido al crear nuevos pacientes.
        Los membretes individuales (abajo) tienen prioridad si están configurados.
      </p>
      <div style="display:flex;align-items:flex-start;gap:16px;flex-wrap:wrap;">
        ${mbAllImg
          ? `<img src="${mbAllImg}" class="tpl-preview-img" />`
          : `<div class="tpl-empty-preview">
               <svg width="36" height="36" fill="none" stroke="#94a3b8" stroke-width="1.4" viewBox="0 0 24 24">
                 <rect x="3" y="3" width="18" height="18" rx="3"/>
                 <circle cx="8.5" cy="8.5" r="1.5"/>
                 <path d="M21 15l-5-5L5 21"/>
               </svg>
               <span>Sin membrete</span>
             </div>`}
        <div style="display:flex;flex-direction:column;gap:8px;">
          <button class="btn-primary" onclick="document.getElementById('tpl-mb-all-input').click()">
            🖼 ${mbAllImg ? 'Cambiar membrete único' : 'Subir membrete único'}
          </button>
          ${mbAllImg ? `<button class="btn-secondary" onclick="removeTplMbAll()">✕ Quitar membrete único</button>` : ''}
          <input type="file" id="tpl-mb-all-input" style="display:none" accept="image/*"
            onchange="setTplMbAll(event)" />
        </div>
      </div>
    </div>

    <div class="section-card">
      <h3>Hojas de Portada</h3>
      <div class="tpl-grid">
        ${COVER_TEMPLATES.map(t => renderTplCard(t)).join('')}
      </div>
    </div>

    <div class="section-card">
      <h3>Membretes por Hoja</h3>
      <p style="margin:-6px 0 14px;color:#64748b;font-size:0.86rem;">
        Configura un membrete específico por hoja. Si se deja vacío, se usará el membrete único (si está configurado).
      </p>
      <div class="tpl-grid">
        ${MEMBRETE_TEMPLATES.map(t => renderTplCard(t)).join('')}
      </div>
    </div>
  `;
}

function renderTplCard(t) {
  const img = templateState[t.key];
  return `
  <div class="tpl-card">
    <div class="tpl-card-thumb" onclick="document.getElementById('tpl-inp-${t.key}').click()" title="Haz clic para subir imagen">
      ${img
        ? `<img src="${img}" style="width:100%;height:100%;object-fit:cover;" />`
        : `<div class="tpl-card-empty">
             <svg width="28" height="28" fill="none" stroke="#94a3b8" stroke-width="1.4" viewBox="0 0 24 24">
               <rect x="3" y="3" width="18" height="18" rx="3"/>
               <circle cx="8.5" cy="8.5" r="1.5"/>
               <path d="M21 15l-5-5L5 21"/>
             </svg>
             <span>Sin imagen</span>
           </div>`}
    </div>
    <div class="tpl-card-footer">
      <span class="tpl-card-label" title="${t.label}">${t.label}</span>
      <div class="tpl-card-actions">
        <button class="btn-tiny" onclick="document.getElementById('tpl-inp-${t.key}').click()">
          ${img ? '🔄 Cambiar' : '⬆ Subir'}
        </button>
        ${img ? `<button class="btn-tiny btn-tiny-reset" onclick="removeTplImage('${t.key}')">✕</button>` : ''}
      </div>
    </div>
    <input type="file" id="tpl-inp-${t.key}" style="display:none" accept="image/*"
      onchange="setTplImage(event,'${t.key}')" />
  </div>`;
}

function setTplImage(event, key) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    templateState[key] = ev.target.result;
    saveTemplate();
    loadTemplatesView();
    showToast('Imagen guardada en plantilla.');
  };
  reader.readAsDataURL(file);
}

function removeTplImage(key) {
  delete templateState[key];
  saveTemplate();
  loadTemplatesView();
  showToast('Imagen eliminada de plantilla.');
}

function setTplMbAll(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    templateState['__mb_all__'] = ev.target.result;
    saveTemplate();
    loadTemplatesView();
    showToast('Membrete único guardado. Se aplicará a todas las hojas de contenido.');
  };
  reader.readAsDataURL(file);
}

function removeTplMbAll() {
  delete templateState['__mb_all__'];
  saveTemplate();
  loadTemplatesView();
  showToast('Membrete único eliminado.');
}
