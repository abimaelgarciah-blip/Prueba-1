/* Generador de PDF — Evaluación Corporal y Nutricional
 * Todo el procesamiento ocurre en el navegador (pdf-lib para armar el
 * documento, pdf.js para las miniaturas). No se sube nada a internet.
 */
(() => {
  'use strict';

  // Si una CDN falla, la interfaz sigue funcionando: sin pdf.js no hay
  // miniaturas y sin pdf-lib se avisa al intentar generar.
  const hayPdfjs = typeof pdfjsLib !== 'undefined';
  const hayPdfLib = typeof PDFLib !== 'undefined';

  if (hayPdfjs) {
    pdfjsLib.GlobalWorkerOptions.workerSrc =
      'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  }

  const LS_KEY = 'evaluacion-nutricional-estado-v1';
  const RUTA_PLANTILLA = 'plantilla/plantilla.pdf';

  // ------------------------------------------------------------------ Estado
  const estado = {
    config: clonar(CONFIG_PREDETERMINADA),
    plantillaBytes: null,      // Uint8Array de la plantilla
    plantillaPdfjs: null,      // documento pdf.js para miniaturas
    totalPaginasPlantilla: 0,
    seccionesActivas: {},      // id -> bool
    anexosSeleccionados: new Set(), // números de página
    externos: {},              // slotId -> [{nombre, bytes, paginas}]
    paginasExtra: '',
    dietasDisponibles: [],     // kcal de las hojas encontradas en dietas/
    dietaKcal: null,           // kcal de la hoja seleccionada (o null)
    dietaNombre: '',           // nombre a imprimir sobre la hoja de dieta
  };

  const cacheDietaBytes = new Map(); // kcal -> Uint8Array
  const cacheDietaPdfjs = new Map(); // kcal -> documento pdf.js

  const $ = (sel) => document.querySelector(sel);

  function clonar(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  // ------------------------------------------------------- Persistencia local
  function guardarEstado() {
    const datos = {
      config: estado.config,
      seccionesActivas: estado.seccionesActivas,
      anexosSeleccionados: [...estado.anexosSeleccionados],
      paginasExtra: estado.paginasExtra,
      dietaKcal: estado.dietaKcal,
      dietaNombre: estado.dietaNombre,
    };
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(datos));
    } catch (_) { /* sin localStorage no pasa nada, solo no se persiste */ }
  }

  function cargarEstado() {
    let datos = null;
    try {
      datos = JSON.parse(localStorage.getItem(LS_KEY));
    } catch (_) { /* ignorar JSON corrupto */ }

    if (datos && datos.config && datos.config.version === CONFIG_PREDETERMINADA.version) {
      estado.config = datos.config;
      estado.seccionesActivas = datos.seccionesActivas || {};
      estado.anexosSeleccionados = new Set(datos.anexosSeleccionados || []);
      estado.paginasExtra = datos.paginasExtra || '';
      estado.dietaKcal = datos.dietaKcal || null;
      estado.dietaNombre = datos.dietaNombre || '';
    }
    // Toda sección sin valor guardado inicia activada.
    for (const s of estado.config.secciones) {
      if (!(s.id in estado.seccionesActivas)) estado.seccionesActivas[s.id] = true;
    }
  }

  // --------------------------------------------------------- Utilería páginas
  /** "1, 3, 9-12" -> [1, 3, 9, 10, 11, 12]. Lanza Error si es inválido. */
  function parsearPaginas(texto, max) {
    const paginas = [];
    const limpio = (texto || '').trim();
    if (!limpio) return paginas;
    for (const parte of limpio.split(',')) {
      const p = parte.trim();
      if (!p) continue;
      const rango = p.match(/^(\d+)\s*[-–]\s*(\d+)$/);
      if (rango) {
        const a = parseInt(rango[1], 10);
        const b = parseInt(rango[2], 10);
        if (a < 1 || b < a) throw new Error(`Rango inválido: "${p}"`);
        for (let i = a; i <= b; i++) paginas.push(i);
      } else if (/^\d+$/.test(p)) {
        paginas.push(parseInt(p, 10));
      } else {
        throw new Error(`No entiendo "${p}". Usa números o rangos, ej. 9, 12-14`);
      }
    }
    if (max) {
      const fuera = paginas.filter((n) => n > max);
      if (fuera.length) {
        throw new Error(`La plantilla solo tiene ${max} páginas (pediste: ${fuera.join(', ')})`);
      }
    }
    return paginas;
  }

  // ------------------------------------------------------------ Carga plantilla
  async function cargarPlantillaInicial() {
    try {
      const resp = await fetch(RUTA_PLANTILLA);
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      await usarPlantilla(new Uint8Array(await resp.arrayBuffer()), 'plantilla.pdf');
    } catch (err) {
      $('#estadoPlantilla').innerHTML =
        '⚠️ No se pudo cargar la plantilla automáticamente. ' +
        'Usa el botón <strong>Reemplazar plantilla…</strong> para elegir el archivo.';
      $('#estadoPlantilla').classList.add('error');
    }
  }

  async function usarPlantilla(bytes, nombre) {
    estado.plantillaBytes = bytes;
    if (hayPdfjs) {
      // pdf.js puede "transferir" el buffer, así que le damos una copia.
      estado.plantillaPdfjs = await pdfjsLib.getDocument({ data: bytes.slice() }).promise;
      estado.totalPaginasPlantilla = estado.plantillaPdfjs.numPages;
    } else if (hayPdfLib) {
      const doc = await PDFLib.PDFDocument.load(bytes);
      estado.totalPaginasPlantilla = doc.getPageCount();
    } else {
      estado.totalPaginasPlantilla = 0;
    }

    $('#estadoPlantilla').classList.remove('error');
    $('#estadoPlantilla').innerHTML = estado.totalPaginasPlantilla
      ? `✅ <strong>${nombre}</strong> cargada — ${estado.totalPaginasPlantilla} páginas.`
      : `⚠️ <strong>${nombre}</strong> cargada, pero no se pudieron descargar las ` +
        'librerías de PDF. Revisa tu conexión a internet y recarga la página.';

    renderizarTodo();
  }

  // ----------------------------------------------------------- Hojas de dieta
  /**
   * Detecta qué hojas de dieta existen en la carpeta dietas/ probando
   * dietas/1100.pdf, dietas/1200.pdf, … Para agregar una dieta nueva basta
   * subir el archivo al repositorio; no hay que tocar el código.
   */
  async function detectarDietas() {
    const cfg = CONFIG_PREDETERMINADA.dieta;
    const candidatos = [];
    for (let k = cfg.kcalMin; k <= cfg.kcalMax; k += cfg.paso) candidatos.push(k);
    const resultados = await Promise.all(candidatos.map(async (k) => {
      try {
        const r = await fetch(cfg.carpeta + k + '.pdf', { method: 'HEAD' });
        return r.ok ? k : null;
      } catch (_) {
        return null;
      }
    }));
    estado.dietasDisponibles = resultados.filter(Boolean);
    if (estado.dietaKcal && !estado.dietasDisponibles.includes(estado.dietaKcal)) {
      estado.dietaKcal = null;
    }
    renderizarSecciones();
    renderizarResumen();
  }

  async function obtenerDietaBytes(kcal) {
    if (!cacheDietaBytes.has(kcal)) {
      const r = await fetch(CONFIG_PREDETERMINADA.dieta.carpeta + kcal + '.pdf');
      if (!r.ok) throw new Error(`no se pudo descargar la hoja de dieta de ${kcal} kcal`);
      cacheDietaBytes.set(kcal, new Uint8Array(await r.arrayBuffer()));
    }
    return cacheDietaBytes.get(kcal);
  }

  /** Nombre que se imprimirá en la hoja: el propio o, si está vacío, el del paciente. */
  function nombreEnDieta() {
    return (estado.dietaNombre || $('#nombrePaciente').value).trim();
  }

  async function abrirPreviewDieta(kcal) {
    if (!hayPdfjs) return;
    const modal = $('#modalPreview');
    const canvas = $('#modalCanvas');
    $('#modalTitulo').textContent = `Hoja de dieta — ${kcal} kcal`;
    modal.hidden = false;

    if (!cacheDietaPdfjs.has(kcal)) {
      const bytes = await obtenerDietaBytes(kcal);
      cacheDietaPdfjs.set(kcal, await pdfjsLib.getDocument({ data: bytes.slice() }).promise);
    }
    const pagina = await cacheDietaPdfjs.get(kcal).getPage(1);
    const vp1 = pagina.getViewport({ scale: 1 });
    const escala = Math.min(720, window.innerWidth - 80) / vp1.width;
    const vp = pagina.getViewport({ scale: escala });
    canvas.width = vp.width;
    canvas.height = vp.height;
    const ctx = canvas.getContext('2d');
    await pagina.render({ canvasContext: ctx, viewport: vp }).promise;

    // Dibujar el nombre tal como quedará en el PDF final.
    const nombre = nombreEnDieta();
    if (nombre) {
      const pos = CONFIG_PREDETERMINADA.dieta.nombre;
      ctx.fillStyle = '#000';
      ctx.font = `${pos.tamano * escala}px Helvetica, Arial, sans-serif`;
      ctx.fillText(nombre, pos.x * escala, (vp1.height - pos.y) * escala);
    }
  }

  function renderizarPanelDieta() {
    const cont = document.createElement('div');
    cont.className = 'panel-dieta';

    const titulo = document.createElement('div');
    titulo.className = 'panel-dieta-titulo';
    titulo.textContent = '↳ Hoja de dieta por kcal (se inserta después de esta portada)';
    cont.appendChild(titulo);

    if (!estado.dietasDisponibles.length) {
      const aviso = document.createElement('p');
      aviso.className = 'panel-dieta-aviso';
      aviso.textContent =
        'No se encontraron hojas en la carpeta dietas/. Sube archivos como ' +
        'dietas/1100.pdf, dietas/1200.pdf… al repositorio, o usa "+ Agregar PDF".';
      cont.appendChild(aviso);
      return cont;
    }

    const fila = document.createElement('div');
    fila.className = 'panel-dieta-fila';

    const select = document.createElement('select');
    select.id = 'selectDieta';
    const opcionVacia = document.createElement('option');
    opcionVacia.value = '';
    opcionVacia.textContent = 'Sin hoja de dieta';
    select.appendChild(opcionVacia);
    for (const k of estado.dietasDisponibles) {
      const op = document.createElement('option');
      op.value = String(k);
      op.textContent = `${k} kcal`;
      select.appendChild(op);
    }
    select.value = estado.dietaKcal ? String(estado.dietaKcal) : '';
    select.addEventListener('change', () => {
      estado.dietaKcal = select.value ? parseInt(select.value, 10) : null;
      guardarEstado();
      renderizarSecciones();
      renderizarResumen();
    });

    const inputNombre = document.createElement('input');
    inputNombre.type = 'text';
    inputNombre.id = 'nombreDieta';
    inputNombre.placeholder = 'Nombre en la hoja (vacío = nombre del paciente)';
    inputNombre.value = estado.dietaNombre;
    inputNombre.disabled = !estado.dietaKcal;
    inputNombre.addEventListener('input', () => {
      estado.dietaNombre = inputNombre.value;
      guardarEstado();
      renderizarResumen();
    });

    const btnVer = document.createElement('button');
    btnVer.className = 'btn btn-fantasma btn-mini';
    btnVer.id = 'btnVerDieta';
    btnVer.textContent = '👁 Vista previa';
    btnVer.disabled = !estado.dietaKcal;
    btnVer.addEventListener('click', () => abrirPreviewDieta(estado.dietaKcal));

    fila.append(select, inputNombre, btnVer);
    cont.appendChild(fila);
    return cont;
  }

  // -------------------------------------------------------------- Miniaturas
  const colaMiniaturas = [];
  let procesandoMiniaturas = false;

  function pedirMiniatura(canvas, numPagina, escalaAncho = 88) {
    colaMiniaturas.push({ canvas, numPagina, escalaAncho });
    procesarColaMiniaturas();
  }

  async function procesarColaMiniaturas() {
    if (procesandoMiniaturas || !estado.plantillaPdfjs) return;
    procesandoMiniaturas = true;
    while (colaMiniaturas.length) {
      const { canvas, numPagina, escalaAncho } = colaMiniaturas.shift();
      if (!canvas.isConnected) continue;
      try {
        const pagina = await estado.plantillaPdfjs.getPage(numPagina);
        const vp1 = pagina.getViewport({ scale: 1 });
        const escala = escalaAncho / vp1.width;
        const vp = pagina.getViewport({ scale: escala });
        canvas.width = vp.width;
        canvas.height = vp.height;
        await pagina.render({ canvasContext: canvas.getContext('2d'), viewport: vp }).promise;
      } catch (_) { /* página fuera de rango con plantilla distinta: dejar en blanco */ }
    }
    procesandoMiniaturas = false;
  }

  async function abrirPreview(numPagina, titulo) {
    if (!estado.plantillaPdfjs || numPagina > estado.totalPaginasPlantilla) return;
    const modal = $('#modalPreview');
    const canvas = $('#modalCanvas');
    $('#modalTitulo').textContent = `${titulo} — página ${numPagina}`;
    modal.hidden = false;
    const pagina = await estado.plantillaPdfjs.getPage(numPagina);
    const vp1 = pagina.getViewport({ scale: 1 });
    const ancho = Math.min(720, window.innerWidth - 80);
    const vp = pagina.getViewport({ scale: ancho / vp1.width });
    canvas.width = vp.width;
    canvas.height = vp.height;
    await pagina.render({ canvasContext: canvas.getContext('2d'), viewport: vp }).promise;
  }

  // ------------------------------------------------------- Edición de nombres
  function hacerEditable(elemento, obtener, asignar) {
    elemento.title = 'Doble clic para renombrar';
    elemento.addEventListener('dblclick', () => {
      const nuevo = prompt('Nuevo nombre:', obtener());
      if (nuevo && nuevo.trim()) {
        asignar(nuevo.trim());
        guardarEstado();
        renderizarTodo();
      }
    });
  }

  // ------------------------------------------------------------- Render: UI
  function renderizarTodo() {
    renderizarSecciones();
    renderizarAnexos();
    renderizarResumen();
  }

  function renderizarSecciones() {
    const ul = $('#listaSecciones');
    ul.innerHTML = '';
    for (const seccion of estado.config.secciones) {
      const li = document.createElement('li');
      li.className = 'seccion-item';

      const fila = document.createElement('div');
      fila.className = 'seccion-fila';

      const check = document.createElement('input');
      check.type = 'checkbox';
      check.id = `sec-${seccion.id}`;
      check.checked = !!estado.seccionesActivas[seccion.id];
      check.addEventListener('change', () => {
        estado.seccionesActivas[seccion.id] = check.checked;
        guardarEstado();
        renderizarResumen();
      });

      const etiqueta = document.createElement('label');
      etiqueta.htmlFor = check.id;
      etiqueta.className = 'seccion-nombre';
      etiqueta.textContent = seccion.nombre;
      hacerEditable(etiqueta, () => seccion.nombre, (v) => { seccion.nombre = v; });

      const badge = document.createElement('span');
      badge.className = 'badge';
      badge.textContent = `pág. ${seccion.paginas}`;
      badge.title = 'Doble clic para cambiar el rango de páginas';
      badge.addEventListener('dblclick', () => {
        const nuevo = prompt('Páginas de la plantilla para esta sección (ej. 5-6):', seccion.paginas);
        if (nuevo === null) return;
        try {
          parsearPaginas(nuevo, estado.totalPaginasPlantilla || null);
          seccion.paginas = nuevo.trim();
          guardarEstado();
          renderizarTodo();
        } catch (err) {
          alert(err.message);
        }
      });

      fila.append(check, etiqueta, badge);
      li.appendChild(fila);

      if (seccion.id === CONFIG_PREDETERMINADA.dieta.despuesDe) {
        li.appendChild(renderizarPanelDieta());
      }
      if (seccion.slotExterno) {
        li.appendChild(renderizarSlotExterno(seccion.slotExterno));
      }
      ul.appendChild(li);
    }
  }

  function renderizarSlotExterno(slot) {
    const cont = document.createElement('div');
    cont.className = 'slot-externo';

    const titulo = document.createElement('div');
    titulo.className = 'slot-titulo';
    titulo.textContent = '↳ ' + slot.etiqueta;
    cont.appendChild(titulo);

    const archivos = estado.externos[slot.id] || [];
    if (archivos.length) {
      const lista = document.createElement('ul');
      lista.className = 'slot-archivos';
      archivos.forEach((archivo, idx) => {
        const item = document.createElement('li');

        const nombre = document.createElement('span');
        nombre.textContent = `${archivo.nombre} (${archivo.paginas} pág.)`;

        const acciones = document.createElement('span');
        acciones.className = 'slot-acciones';

        const subir = document.createElement('button');
        subir.textContent = '↑';
        subir.title = 'Mover arriba';
        subir.disabled = idx === 0;
        subir.addEventListener('click', () => {
          [archivos[idx - 1], archivos[idx]] = [archivos[idx], archivos[idx - 1]];
          renderizarTodo();
        });

        const bajar = document.createElement('button');
        bajar.textContent = '↓';
        bajar.title = 'Mover abajo';
        bajar.disabled = idx === archivos.length - 1;
        bajar.addEventListener('click', () => {
          [archivos[idx + 1], archivos[idx]] = [archivos[idx], archivos[idx + 1]];
          renderizarTodo();
        });

        const quitar = document.createElement('button');
        quitar.textContent = '✕';
        quitar.title = 'Quitar';
        quitar.addEventListener('click', () => {
          archivos.splice(idx, 1);
          renderizarTodo();
        });

        acciones.append(subir, bajar, quitar);
        item.append(nombre, acciones);
        lista.appendChild(item);
      });
      cont.appendChild(lista);
    }

    const botonAgregar = document.createElement('label');
    botonAgregar.className = 'btn btn-fantasma btn-archivo btn-mini';
    botonAgregar.textContent = '+ Agregar PDF';
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/pdf';
    input.multiple = true;
    input.hidden = true;
    input.addEventListener('change', async () => {
      if (!hayPdfLib) {
        alert('No se pudo descargar la librería de PDF (pdf-lib). Revisa tu conexión a internet y recarga la página.');
        return;
      }
      for (const archivo of input.files) {
        try {
          const bytes = new Uint8Array(await archivo.arrayBuffer());
          const doc = await PDFLib.PDFDocument.load(bytes, { ignoreEncryption: true });
          if (!estado.externos[slot.id]) estado.externos[slot.id] = [];
          estado.externos[slot.id].push({
            nombre: archivo.name,
            bytes,
            paginas: doc.getPageCount(),
          });
        } catch (err) {
          alert(`No se pudo leer "${archivo.name}": ${err.message}`);
        }
      }
      renderizarTodo();
    });
    botonAgregar.appendChild(input);
    cont.appendChild(botonAgregar);

    return cont;
  }

  function renderizarAnexos() {
    const ul = $('#listaAnexos');
    const filtro = $('#buscarAnexo').value.trim().toLowerCase();
    ul.innerHTML = '';

    for (const anexo of estado.config.anexos) {
      const coincide =
        !filtro ||
        anexo.nombre.toLowerCase().includes(filtro) ||
        String(anexo.pagina) === filtro;
      if (!coincide) continue;

      const li = document.createElement('li');
      li.className = 'anexo-item';
      if (estado.anexosSeleccionados.has(anexo.pagina)) li.classList.add('seleccionado');

      const check = document.createElement('input');
      check.type = 'checkbox';
      check.id = `anexo-${anexo.pagina}`;
      check.checked = estado.anexosSeleccionados.has(anexo.pagina);
      check.addEventListener('change', () => {
        if (check.checked) estado.anexosSeleccionados.add(anexo.pagina);
        else estado.anexosSeleccionados.delete(anexo.pagina);
        guardarEstado();
        li.classList.toggle('seleccionado', check.checked);
        actualizarContadorAnexos();
        renderizarResumen();
      });

      const mini = document.createElement('canvas');
      mini.className = 'anexo-mini';
      mini.title = 'Clic para ver la página completa';
      mini.addEventListener('click', () => abrirPreview(anexo.pagina, anexo.nombre));
      if (estado.plantillaPdfjs) pedirMiniatura(mini, anexo.pagina);

      const etiqueta = document.createElement('label');
      etiqueta.htmlFor = check.id;
      etiqueta.className = 'anexo-nombre';
      etiqueta.textContent = anexo.nombre;
      hacerEditable(etiqueta, () => anexo.nombre, (v) => { anexo.nombre = v; });

      const badge = document.createElement('span');
      badge.className = 'badge';
      badge.textContent = `pág. ${anexo.pagina}`;

      li.append(check, mini, etiqueta, badge);
      ul.appendChild(li);
    }
    actualizarContadorAnexos();
  }

  function actualizarContadorAnexos() {
    const n = estado.anexosSeleccionados.size;
    $('#contadorAnexos').textContent =
      n === 0 ? 'Ningún anexo seleccionado'
      : n === 1 ? '1 anexo seleccionado'
      : `${n} anexos seleccionados`;
  }

  // --------------------------------------------------- Orden final y resumen
  /**
   * Construye la lista ordenada de bloques que formarán el PDF final:
   *  { tipo: 'plantilla', titulo, paginas: [n…] }
   *  { tipo: 'externo',   titulo, bytes, paginas: total }
   */
  function construirOrden() {
    const bloques = [];
    const max = estado.totalPaginasPlantilla || null;

    for (const seccion of estado.config.secciones) {
      if (estado.seccionesActivas[seccion.id]) {
        let paginas = [];
        try { paginas = parsearPaginas(seccion.paginas, max); } catch (_) { /* rango inválido: omitir */ }
        if (paginas.length) {
          bloques.push({ tipo: 'plantilla', titulo: seccion.nombre, paginas });
        }
      }
      if (seccion.id === CONFIG_PREDETERMINADA.dieta.despuesDe && estado.dietaKcal) {
        const nombre = nombreEnDieta();
        bloques.push({
          tipo: 'dieta',
          titulo: `Hoja de dieta ${estado.dietaKcal} kcal${nombre ? ' — ' + nombre : ''}`,
          kcal: estado.dietaKcal,
          paginas: 1,
        });
      }
      if (seccion.slotExterno) {
        for (const archivo of estado.externos[seccion.slotExterno.id] || []) {
          bloques.push({
            tipo: 'externo',
            titulo: archivo.nombre,
            bytes: archivo.bytes,
            paginas: archivo.paginas,
          });
        }
      }
    }

    const anexosOrdenados = [...estado.anexosSeleccionados].sort((a, b) => a - b);
    for (const pagina of anexosOrdenados) {
      if (max && pagina > max) continue;
      const anexo = estado.config.anexos.find((a) => a.pagina === pagina);
      bloques.push({
        tipo: 'plantilla',
        titulo: `Anexo: ${anexo ? anexo.nombre : 'página ' + pagina}`,
        paginas: [pagina],
      });
    }

    let extra = [];
    try { extra = parsearPaginas(estado.paginasExtra, max); } catch (_) { /* se valida al escribir */ }
    if (extra.length) {
      bloques.push({ tipo: 'plantilla', titulo: 'Páginas adicionales', paginas: extra });
    }

    return bloques;
  }

  function renderizarResumen() {
    const ol = $('#resumenLista');
    ol.innerHTML = '';
    const bloques = construirOrden();
    let total = 0;

    for (const bloque of bloques) {
      const li = document.createElement('li');
      const n = bloque.tipo === 'plantilla' ? bloque.paginas.length : bloque.paginas;
      total += n;
      const icono = bloque.tipo === 'externo' ? '📎 ' : bloque.tipo === 'dieta' ? '🍽 ' : '';
      li.innerHTML =
        `<span class="resumen-titulo">${icono}${escaparHtml(bloque.titulo)}</span>` +
        `<span class="badge">${n} pág.</span>`;
      ol.appendChild(li);
    }

    if (!bloques.length) {
      const li = document.createElement('li');
      li.className = 'resumen-vacio';
      li.textContent = 'Nada seleccionado todavía.';
      ol.appendChild(li);
    }

    $('#totalPaginas').textContent = total;
    const listo = total > 0 && !!estado.plantillaBytes;
    $('#btnDescargar').disabled = !listo;
    $('#btnImprimir').disabled = !listo;
  }

  function escaparHtml(texto) {
    const div = document.createElement('div');
    div.textContent = texto;
    return div.innerHTML;
  }

  // ------------------------------------------------------------ Generación
  async function generarPdf() {
    if (!hayPdfLib) {
      throw new Error('no se pudo descargar la librería pdf-lib. Revisa tu conexión a internet y recarga la página.');
    }
    const { PDFDocument } = PDFLib;
    const salida = await PDFDocument.create();
    const plantilla = await PDFDocument.load(estado.plantillaBytes);
    const cacheExternos = new Map();

    for (const bloque of construirOrden()) {
      if (bloque.tipo === 'plantilla') {
        const indices = bloque.paginas.map((n) => n - 1);
        const paginas = await salida.copyPages(plantilla, indices);
        paginas.forEach((p) => salida.addPage(p));
      } else if (bloque.tipo === 'dieta') {
        // Se carga sin caché porque la página se modifica al estampar el nombre.
        const doc = await PDFDocument.load(await obtenerDietaBytes(bloque.kcal));
        const nombre = nombreEnDieta();
        if (nombre) {
          const fuente = await doc.embedFont(PDFLib.StandardFonts.Helvetica);
          const pos = CONFIG_PREDETERMINADA.dieta.nombre;
          doc.getPage(0).drawText(nombre, {
            x: pos.x,
            y: pos.y,
            size: pos.tamano,
            font: fuente,
            color: PDFLib.rgb(0, 0, 0),
          });
        }
        const paginas = await salida.copyPages(doc, doc.getPageIndices());
        paginas.forEach((p) => salida.addPage(p));
      } else {
        let doc = cacheExternos.get(bloque.bytes);
        if (!doc) {
          doc = await PDFDocument.load(bloque.bytes, { ignoreEncryption: true });
          cacheExternos.set(bloque.bytes, doc);
        }
        const paginas = await salida.copyPages(doc, doc.getPageIndices());
        paginas.forEach((p) => salida.addPage(p));
      }
    }

    const paciente = $('#nombrePaciente').value.trim();
    salida.setTitle(paciente
      ? `Evaluación Nutricional — ${paciente}`
      : 'Evaluación Corporal y Nutricional');
    salida.setCreator('Generador de Evaluación Nutricional');

    return salida.save();
  }

  function nombreArchivoSalida() {
    const paciente = $('#nombrePaciente').value.trim()
      .replace(/[^\p{L}\p{N} _-]/gu, '')
      .replace(/\s+/g, '_');
    const fecha = new Date().toISOString().slice(0, 10);
    return paciente
      ? `Evaluacion_${paciente}_${fecha}.pdf`
      : `Evaluacion_Nutricional_${fecha}.pdf`;
  }

  async function conMensaje(boton, fn) {
    const msg = $('#msgGeneracion');
    boton.disabled = true;
    msg.hidden = false;
    msg.textContent = 'Generando PDF…';
    msg.className = 'msg';
    try {
      await fn();
      msg.textContent = '✅ PDF generado.';
    } catch (err) {
      console.error(err);
      msg.textContent = '❌ Error al generar: ' + err.message;
      msg.className = 'msg error';
    } finally {
      boton.disabled = false;
      setTimeout(() => { msg.hidden = true; }, 4000);
    }
  }

  function descargarBlob(bytes, nombre) {
    const url = URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = nombre;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 30000);
  }

  function imprimirBytes(bytes) {
    const url = URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' }));
    const ventana = window.open(url, '_blank');
    if (!ventana) {
      alert('El navegador bloqueó la ventana de impresión. Permite las ventanas emergentes o usa "Descargar PDF".');
    }
  }

  // ------------------------------------------------------------- Eventos UI
  function conectarEventos() {
    // El nombre del paciente puede aparecer en la hoja de dieta del resumen.
    $('#nombrePaciente').addEventListener('input', renderizarResumen);

    $('#inputPlantilla').addEventListener('change', async (e) => {
      const archivo = e.target.files[0];
      if (!archivo) return;
      try {
        await usarPlantilla(new Uint8Array(await archivo.arrayBuffer()), archivo.name);
      } catch (err) {
        alert('No se pudo leer la plantilla: ' + err.message);
      }
    });

    $('#btnRestablecer').addEventListener('click', () => {
      if (!confirm('¿Restaurar nombres, rangos de página y selección predeterminados?')) return;
      estado.config = clonar(CONFIG_PREDETERMINADA);
      estado.seccionesActivas = {};
      for (const s of estado.config.secciones) estado.seccionesActivas[s.id] = true;
      estado.anexosSeleccionados.clear();
      estado.paginasExtra = '';
      estado.dietaKcal = null;
      estado.dietaNombre = '';
      $('#paginasExtra').value = '';
      guardarEstado();
      renderizarTodo();
    });

    $('#buscarAnexo').addEventListener('input', renderizarAnexos);

    $('#btnAgregarPaginas').addEventListener('click', () => {
      const campo = $('#paginasAnexo');
      let paginas;
      try {
        paginas = parsearPaginas(campo.value, estado.totalPaginasPlantilla || null);
      } catch (err) {
        alert(err.message);
        return;
      }
      const validas = new Set(estado.config.anexos.map((a) => a.pagina));
      const noAnexo = paginas.filter((p) => !validas.has(p));
      paginas.filter((p) => validas.has(p)).forEach((p) => estado.anexosSeleccionados.add(p));
      if (noAnexo.length) {
        alert(
          `Estas páginas no son anexos y se omitieron: ${noAnexo.join(', ')}.\n` +
          'Si necesitas incluirlas, usa "Páginas adicionales" en la sección Avanzado.'
        );
      }
      campo.value = '';
      guardarEstado();
      renderizarAnexos();
      renderizarResumen();
    });

    $('#paginasAnexo').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') $('#btnAgregarPaginas').click();
    });

    $('#btnTodosAnexos').addEventListener('click', () => {
      estado.config.anexos.forEach((a) => estado.anexosSeleccionados.add(a.pagina));
      guardarEstado();
      renderizarAnexos();
      renderizarResumen();
    });

    $('#btnNingunAnexo').addEventListener('click', () => {
      estado.anexosSeleccionados.clear();
      guardarEstado();
      renderizarAnexos();
      renderizarResumen();
    });

    $('#paginasExtra').addEventListener('change', (e) => {
      try {
        parsearPaginas(e.target.value, estado.totalPaginasPlantilla || null);
        estado.paginasExtra = e.target.value;
        guardarEstado();
        renderizarResumen();
      } catch (err) {
        alert(err.message);
        e.target.value = estado.paginasExtra;
      }
    });

    $('#btnDescargar').addEventListener('click', () =>
      conMensaje($('#btnDescargar'), async () => {
        descargarBlob(await generarPdf(), nombreArchivoSalida());
      })
    );

    $('#btnImprimir').addEventListener('click', () =>
      conMensaje($('#btnImprimir'), async () => {
        imprimirBytes(await generarPdf());
      })
    );

    $('#btnCerrarModal').addEventListener('click', () => { $('#modalPreview').hidden = true; });
    $('#modalPreview').addEventListener('click', (e) => {
      if (e.target === e.currentTarget) e.currentTarget.hidden = true;
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') $('#modalPreview').hidden = true;
    });
  }

  // ---------------------------------------------------------------- Arranque
  cargarEstado();
  conectarEventos();
  $('#paginasExtra').value = estado.paginasExtra;
  renderizarTodo();
  cargarPlantillaInicial();
  detectarDietas();
})();
