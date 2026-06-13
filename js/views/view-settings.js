/* ===== VISTA: AJUSTES — imágenes predeterminadas de portadas y membretes =====
 * Estas imágenes son GLOBALES (se guardan en appDefaults / localStorage) y
 * aplican a todos los pacientes. En cada hoja, la imagen del paciente
 * (appState[clave]) tiene prioridad; si no hay, se usa la predeterminada.
 */

const COVER_SLOTS = [
  { key: 'cover-1',  label: 'Portada Principal' },
  { key: 'cover-2',  label: 'Portada Objetivos' },
  { key: 'cover-3',  label: 'Portada Introducción' },
  { key: 'cover-4',  label: 'Portada Hallazgos Principales' },
  { key: 'cover-6',  label: 'Portada Sistemas' },
  { key: 'cover-8',  label: 'Portada Conclusiones' },
  { key: 'cover-10', label: 'Portada Sugerencias' },
  { key: 'cover-12', label: 'Portada Prueba Esfuerzo y ECG' },
  { key: 'cover-14', label: 'Portada Espirometría' },
  { key: 'cover-16', label: 'Portada Estudios de Gabinete' },
  { key: 'cover-18', label: 'Portada Oftalmología' },
  { key: 'cover-20', label: 'Portada Laboratorio' },
];

const MEMBRETE_SLOTS = [
  { key: 'mb-5',  label: 'Contenido Hallazgos' },
  { key: 'mb-7',  label: 'Contenido Sistemas' },
  { key: 'mb-9',  label: 'Contenido Conclusiones' },
  { key: 'mb-11', label: 'Contenido Sugerencias' },
  { key: 'mb-13', label: 'Contenido Prueba Esfuerzo y ECG' },
  { key: 'mb-15', label: 'Contenido Espirometría' },
  { key: 'mb-17', label: 'Contenido Estudios de Gabinete' },
  { key: 'mb-19', label: 'Contenido Oftalmología' },
  { key: 'mb-21', label: 'Contenido Laboratorio' },
];

function loadSettingsView() {
  const cont = document.getElementById('settings-content');
  if (!cont) return;
  cont.innerHTML = `
    <p class="settings-hint">
      Sube aquí las imágenes que se usarán por defecto en cada portada y membrete.
      Se guardan en este navegador y aplican a todos los pacientes. En un paciente
      puntual puedes subir otra imagen desde su hoja para sobrescribir la predeterminada.
    </p>
    <div class="settings-section">
      <h3>Portadas</h3>
      <div class="settings-grid">${COVER_SLOTS.map(renderSettingsSlot).join('')}</div>
    </div>
    <div class="settings-section">
      <h3>Membretes (hojas de contenido)</h3>
      <div class="settings-grid">${MEMBRETE_SLOTS.map(renderSettingsSlot).join('')}</div>
    </div>`;
}

function renderSettingsSlot(slot) {
  const img = (typeof appDefaults !== 'undefined' && appDefaults[slot.key]) || '';
  return `
  <div class="settings-slot" id="slot-${slot.key}">
    <div class="settings-thumb" onclick="document.getElementById('def-input-${slot.key}').click()">
      ${img
        ? `<img src="${img}" alt="${escapeHtml(slot.label)}" />`
        : `<span class="settings-thumb-empty">＋ Subir imagen</span>`}
    </div>
    <div class="settings-slot-name">${escapeHtml(slot.label)}</div>
    <div class="settings-slot-actions">
      <button class="btn-secondary btn-mini" onclick="document.getElementById('def-input-${slot.key}').click()">
        ${img ? 'Cambiar' : 'Subir'}
      </button>
      ${img ? `<button class="btn-remove btn-mini" onclick="removeDefaultImage('${slot.key}')">Quitar</button>` : ''}
    </div>
    <input type="file" id="def-input-${slot.key}" accept="image/*" style="display:none"
      onchange="setDefaultImage(event, '${slot.key}')" />
  </div>`;
}

function setDefaultImage(event, key) {
  const file = event.target.files[0];
  if (!file) return;
  resizeImageFile(file, 1400, 0.82, (dataUrl) => {
    appDefaults[key] = dataUrl;
    saveDefaults();
    loadSettingsView();
    showToast('Imagen predeterminada guardada.');
  });
  event.target.value = '';
}

function removeDefaultImage(key) {
  if (!confirm('¿Quitar esta imagen predeterminada?')) return;
  delete appDefaults[key];
  saveDefaults();
  loadSettingsView();
}

/* Reescala una imagen (máx. lado = maxSide) y la devuelve como JPEG dataURL,
 * para no saturar el almacenamiento del navegador. */
function resizeImageFile(file, maxSide, quality, cb) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      let { width: w, height: h } = img;
      const escala = Math.min(1, maxSide / Math.max(w, h));
      w = Math.round(w * escala);
      h = Math.round(h * escala);
      const canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0, w, h);
      cb(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => alert('No se pudo leer la imagen.');
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}
