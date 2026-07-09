<%@ page contentType="text/html; charset=UTF-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!doctype html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>Ajustes - Chequeo Médico</title>
  <link rel="stylesheet" href="${pageContext.request.contextPath}/css/styles.css?v=v2" />
</head>
<body>
<%@ include file="_nav.jspf" %>
<div id="main-area">
  <div class="view-header">
    <div><h2>Ajustes</h2><p class="view-subtitle">Imágenes predeterminadas de portadas y membretes (aplican a todos los pacientes)</p></div>
  </div>
  <p class="settings-hint">Sube aquí las imágenes que se usarán por defecto en cada portada y membrete. En un paciente puntual puedes subir otra imagen desde su hoja para sobrescribir la predeterminada.</p>

  <div class="settings-section">
    <h3>Portadas</h3>
    <div class="settings-grid" id="cover-slots"></div>
  </div>
  <div class="settings-section">
    <h3>Membretes (hojas de contenido)</h3>
    <div class="settings-grid" id="membrete-slots"></div>
  </div>
</div>
<script>
  const coverSlots = ${coverSlotsJson};
  const membreteSlots = ${membreteSlotsJson};
  const appDefaults = ${appDefaultsJson};
  const contextPath = '${pageContext.request.contextPath}';

  function renderSlots(container, slots) {
    container.innerHTML = Object.entries(slots).map(([key, label]) => {
      const img = appDefaults[key];
      return `<div class="settings-slot">
        <div class="settings-thumb">${'$'}{img ? `<img src="${'$'}{img}" alt="${'$'}{label}"/>` : '<span class="settings-thumb-empty">＋ Subir imagen</span>'}</div>
        <div class="settings-slot-name">${'$'}{label}</div>
        <div class="settings-slot-actions">
          <input type="file" accept="image/*" data-key="${'$'}{key}" class="settings-input" />
          ${'$'}{img ? `<button class="btn-remove btn-mini" data-remove="${'$'}{key}">Quitar</button>` : ''}
        </div>
      </div>`;
    }).join('');
  }
  renderSlots(document.getElementById('cover-slots'), coverSlots);
  renderSlots(document.getElementById('membrete-slots'), membreteSlots);

  document.addEventListener('change', (ev) => {
    if (!ev.target.matches('.settings-input') || !ev.target.files[0]) return;
    const key = ev.target.dataset.key;
    const reader = new FileReader();
    reader.onload = (e) => {
      fetch(contextPath + '/settings', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'action=set&key=' + encodeURIComponent(key) + '&value=' + encodeURIComponent(e.target.result) })
        .then(() => location.reload());
    };
    reader.readAsDataURL(ev.target.files[0]);
  });
  document.addEventListener('click', (ev) => {
    if (!ev.target.matches('[data-remove]')) return;
    if (!confirm('¿Quitar esta imagen predeterminada?')) return;
    fetch(contextPath + '/settings', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'action=remove&key=' + encodeURIComponent(ev.target.dataset.remove) })
      .then(() => location.reload());
  });
</script>
</body>
</html>
