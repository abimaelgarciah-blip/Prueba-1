/*
 * Autoguardado generico de la hoja en edicion (equivalente a saveFieldState(),
 * addDynamicBlock()/updateDynamicBlock()/removeDynamicBlock(),
 * addNumberedItem()/updateNumberedItem()/removeNumberedItem() y
 * setAttachment()/setPdfReplace() de app.js/templates.js), pero
 * delegado por atributos data-* en vez de un onXxx por campo, para que el
 * HTML lo genere ContentBlockHtmlRenderer.java sin tener que escribir JS
 * a mano por cada hoja nueva.
 *
 * Cada input/textarea/select con [name] dentro de #sheet-container se
 * guarda solo (POST a /patients/form) cuando cambia; no recarga la pagina.
 */
(function () {
  const FORM_URL = window.SHEET_FORM_URL;
  const container = document.getElementById('sheet-container');
  if (!container || !FORM_URL) return;

  function post(params) {
    const body = new URLSearchParams(params);
    return fetch(FORM_URL, { method: 'POST', body, headers: { 'X-Requested-With': 'XMLHttpRequest' } });
  }

  function saveField(id, value) {
    post({ op: 'field', id, value }).then(() => showSavedDot());
  }

  function showSavedDot() {
    const dot = document.getElementById('autosave-dot');
    if (!dot) return;
    dot.classList.add('show');
    clearTimeout(dot._t);
    dot._t = setTimeout(() => dot.classList.remove('show'), 900);
  }

  container.addEventListener('change', (ev) => {
    const el = ev.target;
    if (el.matches('[data-nutri-seccion]')) {
      post({ op: 'nutri-seccion', id: el.dataset.nutriSeccion, checked: el.checked }).then(showSavedDot);
      return;
    }
    if (el.matches('[data-nutri-field]')) {
      post({ op: 'nutri-field', key: el.dataset.nutriField, value: el.value }).then(showSavedDot);
      return;
    }
    if (el.matches('[data-nutri-anexos]')) {
      post({ op: 'nutri-anexos', value: el.value }).then(showSavedDot);
      return;
    }
    if (!el.name) return;
    if (el.matches('[data-dynamic-title], [data-dynamic-body]')) return; // manejados aparte (debounced)
    if (el.type === 'checkbox') {
      saveField(el.name, el.checked ? 'true' : 'false');
      if (el.dataset.togglesGroup) {
        const target = document.getElementById('block-' + el.dataset.togglesGroup);
        if (target) target.classList.toggle('ctt-omitted', el.checked);
      }
    } else {
      saveField(el.name, el.value);
    }
  });

  // Autoguardado con debounce para textareas/inputs de texto libre mientras el usuario escribe.
  let debounceTimer = null;
  container.addEventListener('input', (ev) => {
    const el = ev.target;
    if (!el.name || el.type === 'checkbox') return;
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      if (el.closest('.ctt-dynamic-item')) return; // manejado por los data-* de abajo
      if (el.closest('.ctt-numbered-item')) return;
      saveField(el.name, el.value);
    }, 500);
  });

  // Bloques dinamicos (title/body repetibles)
  container.addEventListener('click', (ev) => {
    const add = ev.target.closest('[data-add-dynamic-item]');
    if (add) {
      post({ op: 'dynamic-add', key: add.dataset.addDynamicItem }).then(() => location.reload());
      return;
    }
    const remove = ev.target.closest('[data-remove-dynamic-item]');
    if (remove) {
      post({ op: 'dynamic-remove', key: remove.dataset.removeDynamicItem, index: remove.dataset.index }).then(() => location.reload());
      return;
    }
    const addNum = ev.target.closest('[data-add-numbered-item]');
    if (addNum) {
      post({ op: 'numbered-add', key: addNum.dataset.addNumberedItem }).then(() => location.reload());
      return;
    }
    const removeNum = ev.target.closest('[data-remove-numbered-item]');
    if (removeNum) {
      post({ op: 'numbered-remove', key: removeNum.dataset.removeNumberedItem, index: removeNum.dataset.index }).then(() => location.reload());
      return;
    }
  });

  let dynDebounce = null;
  container.addEventListener('input', (ev) => {
    const item = ev.target.closest('.ctt-dynamic-item');
    if (item && item.parentElement.dataset.dynamicKey) {
      const key = item.parentElement.dataset.dynamicKey;
      const index = item.dataset.index;
      const field = ev.target.classList.contains('ctt-dynamic-title') ? 'title' : 'body';
      clearTimeout(dynDebounce);
      dynDebounce = setTimeout(() => post({ op: 'dynamic-update', key, index, field, value: ev.target.value }), 500);
      return;
    }
    const li = ev.target.closest('.ctt-numbered-item');
    if (li) {
      const ol = ev.target.closest('[data-numbered-key]');
      if (ol) {
        const key = ol.dataset.numberedKey;
        const index = Array.prototype.indexOf.call(ol.children, li);
        clearTimeout(dynDebounce);
        dynDebounce = setTimeout(() => post({ op: 'numbered-update', key, index, value: ev.target.value }), 500);
      }
    }
  });

  // Imagenes adjuntas / portadas / membretes (equivalente a setAttachment/setCoverImage/setMembrete)
  container.addEventListener('change', (ev) => {
    const el = ev.target;
    if (el.matches('[data-attachment-input]') && el.files[0]) {
      readAsDataUrl(el.files[0], (dataUrl) => {
        post({ op: 'field', id: el.dataset.attachmentInput, value: dataUrl }).then(() => location.reload());
      });
    }
    if (el.matches('[data-pdf-replace-input]') && el.files[0]) {
      readAsDataUrl(el.files[0], (dataUrl) => { saveField(el.dataset.pdfReplaceInput, dataUrl); setTimeout(() => location.reload(), 300); });
    }
  });
  container.addEventListener('click', (ev) => {
    const rm = ev.target.closest('[data-attachment-remove]');
    if (rm) { post({ op: 'field', id: rm.dataset.attachmentRemove, value: '' }).then(() => location.reload()); }
    const rmPdf = ev.target.closest('[data-pdf-replace-remove]');
    if (rmPdf) { post({ op: 'field', id: rmPdf.dataset.pdfReplaceRemove, value: '' }).then(() => location.reload()); }
  });

  function readAsDataUrl(file, cb) {
    const reader = new FileReader();
    reader.onload = (e) => cb(e.target.result);
    reader.readAsDataURL(file);
  }

  // Portada / membrete de la propia hoja (fuera de #sheet-container, ver patient-form.jsp)
  document.querySelectorAll('[data-cover-input], [data-membrete-input]').forEach((input) => {
    input.addEventListener('change', () => {
      if (!input.files[0]) return;
      const key = input.dataset.coverInput || input.dataset.membreteInput;
      readAsDataUrl(input.files[0], (dataUrl) => {
        post({ op: 'field', id: key, value: dataUrl }).then(() => location.reload());
      });
    });
  });
  document.querySelectorAll('[data-cover-remove], [data-membrete-remove]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.coverRemove || btn.dataset.membreteRemove;
      if (!confirm('¿Quitar esta imagen?')) return;
      post({ op: 'field', id: key, value: '' }).then(() => location.reload());
    });
  });

  // Omitir seccion completa (portada + contenido)
  document.querySelectorAll('[data-section-omit]').forEach((chk) => {
    chk.addEventListener('change', () => {
      post({ op: 'section-omit', section: chk.dataset.sectionOmit, checked: chk.checked ? 'true' : 'false' })
        .then(() => location.reload());
    });
  });
})();
