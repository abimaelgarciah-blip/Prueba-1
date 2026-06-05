/**
 * form.js – Frontend del sistema RIO Chequeo Médico (JSP/Servlet)
 *
 * Funciones públicas:
 *   initSidebar(activeSheetNum)  – resalta la hoja activa en el sidebar
 *   switchSheet(n)               – navega a otra hoja
 *   uploadImage(file, fieldKey, sheetNum) – sube imagen vía multipart
 *   uploadMembrete(event, sheetNum)       – wrapper: sube membrete de fondo
 *   removeMembrete(sheetNum)              – quita membrete vía AJAX
 *   showToast(msg, type)                  – notificación
 *   autoSaveForm(formEl)                  – guardado automático (debounced)
 */

'use strict';

/* ─────────────────────────────────────────
   Utilidades básicas
   ───────────────────────────────────────── */

/**
 * Muestra una notificación toast en la esquina inferior central.
 * @param {string} msg
 * @param {'ok'|'error'} [type='ok']
 */
function showToast(msg, type) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.style.cssText =
      'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);' +
      'padding:10px 22px;border-radius:8px;font-size:0.9rem;font-weight:600;' +
      'opacity:0;pointer-events:none;transition:opacity 0.3s;z-index:9999;' +
      'color:#fff;white-space:nowrap;';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.background = (type === 'error') ? '#b91c1c' : '#1e4d8c';
  toast.style.opacity = '1';
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => { toast.style.opacity = '0'; }, 2800);
}

/* ─────────────────────────────────────────
   Sidebar: resaltar hoja activa
   ───────────────────────────────────────── */

/**
 * Resalta el item del sidebar correspondiente a sheetNum.
 * @param {number} sheetNum
 */
function initSidebar(sheetNum) {
  document.querySelectorAll('.sheet-nav-item').forEach(item => {
    const num = parseInt(item.querySelector('.sheet-nav-num')?.textContent, 10);
    item.classList.toggle('active', num === sheetNum);
  });
}

/* ─────────────────────────────────────────
   Navegación entre hojas
   ───────────────────────────────────────── */

/**
 * Navega a la hoja N preservando el patientId actual de la URL.
 * @param {number} n
 */
function switchSheet(n) {
  const params = new URLSearchParams(window.location.search);
  const patientId = params.get('patientId') || '';
  let url = (typeof contextPath !== 'undefined' ? contextPath : '') + '/sheet?sheet=' + n;
  if (patientId) url += '&patientId=' + encodeURIComponent(patientId);
  window.location.href = url;
}

/* ─────────────────────────────────────────
   Guardado automático (debounced)
   ───────────────────────────────────────── */

let _autoSaveTimer = null;

/**
 * Llama a autoSaveForm cuando cualquier campo del form cambia.
 * Se conecta automáticamente al formulario principal de la hoja al cargar.
 */
document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('form[id^="sheet"]');
  if (!form) return;

  form.addEventListener('input', function () {
    clearTimeout(_autoSaveTimer);
    _autoSaveTimer = setTimeout(() => autoSaveForm(form), 1500);
  });
  form.addEventListener('change', function () {
    clearTimeout(_autoSaveTimer);
    _autoSaveTimer = setTimeout(() => autoSaveForm(form), 800);
  });
});

/**
 * Guarda el formulario vía AJAX POST (application/x-www-form-urlencoded).
 * Muestra toast de éxito o error.
 * @param {HTMLFormElement} formEl
 */
function autoSaveForm(formEl) {
  if (!formEl) return;
  const data = new URLSearchParams(new FormData(formEl));
  fetch(formEl.action, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: data.toString()
  })
  .then(r => {
    if (!r.ok) throw new Error('HTTP ' + r.status);
    return r.json().catch(() => ({}));
  })
  .then(json => {
    if (json && json.ok === false) {
      showToast('Error al guardar: ' + (json.error || '?'), 'error');
    } else {
      showToast('Guardado automáticamente.');
    }
  })
  .catch(err => {
    showToast('Error de red al guardar.', 'error');
    console.error('[autoSaveForm]', err);
  });
}

/* ─────────────────────────────────────────
   Subida de imágenes
   ───────────────────────────────────────── */

/**
 * Sube una imagen adjunta a una hoja vía multipart/form-data.
 * El servidor la almacena en el BLOB correspondiente a fieldKey.
 *
 * @param {File}   file      – archivo seleccionado por el usuario
 * @param {string} fieldKey  – clave del campo imagen (p.ej. 'c13-img', 'cover-1', 'mb-5')
 * @param {number} sheetNum  – número de hoja (1-26)
 */
function uploadImage(file, fieldKey, sheetNum) {
  if (!file) return;

  const params = new URLSearchParams(window.location.search);
  const patientId = params.get('patientId') || '';

  const fd = new FormData();
  fd.append('patientId', patientId);
  fd.append('sheet', sheetNum);
  fd.append('fieldKey', fieldKey);
  fd.append('imageFile', file, file.name);

  showToast('Subiendo imagen...');

  const cp = (typeof contextPath !== 'undefined' ? contextPath : '');
  fetch(cp + '/sheet?upload=image', {
    method: 'POST',
    body: fd
  })
  .then(r => {
    if (!r.ok) throw new Error('HTTP ' + r.status);
    return r.json();
  })
  .then(json => {
    if (json && json.ok === false) {
      showToast('Error al subir imagen: ' + (json.error || '?'), 'error');
    } else {
      showToast('Imagen subida correctamente.');
      setTimeout(() => location.reload(), 600);
    }
  })
  .catch(err => {
    showToast('Error de red al subir imagen.', 'error');
    console.error('[uploadImage]', err);
  });
}

/* ─────────────────────────────────────────
   Membrete (imagen de fondo de hojas)
   ───────────────────────────────────────── */

/**
 * Handler para el input[type=file] del membrete.
 * @param {Event}  event
 * @param {number} sheetNum
 */
function uploadMembrete(event, sheetNum) {
  const file = event.target.files[0];
  if (!file) return;
  uploadImage(file, 'mb-' + sheetNum, sheetNum);
}

/**
 * Elimina el membrete de fondo de una hoja vía AJAX.
 * @param {number} sheetNum
 */
function removeMembrete(sheetNum) {
  if (!confirm('¿Quitar el membrete de fondo?')) return;

  const params = new URLSearchParams(window.location.search);
  const patientId = params.get('patientId') || '';

  const fd = new FormData();
  fd.append('patientId', patientId);
  fd.append('sheet', sheetNum);
  fd.append('fieldKey', 'mb-' + sheetNum);

  const cp = (typeof contextPath !== 'undefined' ? contextPath : '');
  fetch(cp + '/sheet?upload=remove', {
    method: 'POST',
    body: fd
  })
  .then(r => {
    if (!r.ok) throw new Error('HTTP ' + r.status);
    return r.json().catch(() => ({}));
  })
  .then(() => {
    showToast('Membrete eliminado.');
    setTimeout(() => location.reload(), 700);
  })
  .catch(err => {
    showToast('Error al eliminar membrete.', 'error');
    console.error('[removeMembrete]', err);
  });
}
