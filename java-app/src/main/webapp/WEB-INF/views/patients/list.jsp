<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Pacientes – RIO Chequeo Médico</title>
</head>
<body>

<%-- Top nav --%>
<c:set var="activeNav" value="patients" scope="request" />
<%@ include file="../layout/header.jsp" %>

<%-- Main content --%>
<div id="main-area" style="display:flex;flex-direction:column;flex:1;overflow:hidden;">

  <div id="patients-list-view"
       style="flex:1;display:flex;flex-direction:column;min-height:0;overflow-y:auto;">

    <div class="view-header">
      <div>
        <h2>Pacientes</h2>
        <p class="view-subtitle">Gestión de expedientes clínicos</p>
      </div>
      <a href="${pageContext.request.contextPath}/patients?id=nuevo" class="btn-primary">
        Nuevo Paciente
      </a>
    </div>

    <div id="patients-search-bar">
      <input type="text" id="patients-search"
             placeholder="Buscar por nombre..."
             oninput="filterPatients()" />
    </div>

    <div id="patients-grid">
      <c:choose>
        <c:when test="${empty patients}">
          <p style="color:#888;padding:20px;">No hay pacientes registrados. Crea el primero.</p>
        </c:when>
        <c:otherwise>
          <c:forEach var="patient" items="${patients}">
            <div class="patient-card"
                 data-name="${fn:toLowerCase(patient.nombre)}"
                 onclick="window.location='${pageContext.request.contextPath}/patients?id=${patient.id}'">
              <div class="patient-card-avatar">
                ${fn:substring(patient.nombre, 0, 1)}
              </div>
              <div class="patient-card-info">
                <strong>${patient.nombre}</strong>
                <span class="patient-card-id">ID: ${patient.id}</span>
                <span class="patient-card-date">
                  Modificado: ${not empty patient.ultimaModificacion ? patient.ultimaModificacion : '—'}
                </span>
              </div>
              <button class="patient-card-delete btn-remove"
                      title="Eliminar paciente"
                      onclick="deletePatient(event, ${patient.id}, '${fn:escapeXml(patient.nombre)}')">
                ✕
              </button>
            </div>
          </c:forEach>
        </c:otherwise>
      </c:choose>
    </div>

  </div><!-- /patients-list-view -->
</div><!-- /main-area -->

<div id="toast" class="toast" aria-live="polite"></div>

<style>
  html, body { height: 100%; margin: 0; padding: 0; }
  body {
    font-family: 'Segoe UI', Arial, sans-serif;
    background: #f0f2f5; color: #222;
    display: flex; flex-direction: column;
  }
  #main-area { flex: 1; overflow: hidden; }

  .view-header {
    display: flex; align-items: flex-start;
    justify-content: space-between;
    padding: 24px 28px 12px;
    flex-shrink: 0; flex-wrap: wrap; gap: 12px;
  }
  .view-header h2 { font-size: 1.4rem; font-weight: 700; color: #1e4d8c; }
  .view-subtitle { color: #888; font-size: 0.85rem; margin-top: 2px; }

  #patients-search-bar { padding: 0 28px 16px; flex-shrink: 0; }
  #patients-search {
    width: 100%; padding: 10px 16px;
    border: 1.5px solid #dce3ec; border-radius: 8px;
    font-size: 0.92rem; background: #fff;
  }
  #patients-search:focus { outline: none; border-color: #1e4d8c; }

  #patients-grid {
    padding: 0 28px 28px;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 14px; align-content: start;
  }

  .patient-card {
    background: #fff; border-radius: 12px; padding: 18px;
    display: flex; align-items: center; gap: 14px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.07);
    cursor: pointer; transition: box-shadow 0.18s, transform 0.15s;
    position: relative;
  }
  .patient-card:hover {
    box-shadow: 0 6px 20px rgba(0,0,0,0.12);
    transform: translateY(-2px);
  }
  .patient-card-avatar {
    width: 48px; height: 48px; border-radius: 50%;
    background: #1e4d8c; color: #fff;
    font-weight: 700; font-size: 1.1rem;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; text-transform: uppercase;
  }
  .patient-card-info { flex: 1; min-width: 0; }
  .patient-card-info strong {
    display: block; font-size: 0.92rem; color: #1e2d40;
  }
  .patient-card-info span {
    display: block; font-size: 0.78rem; color: #666;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .patient-card-date { color: #888 !important; }
  .patient-card-id { color: #1e4d8c !important; font-weight: 600 !important; }
  .patient-card-delete {
    position: absolute; top: 8px; right: 8px;
    opacity: 0; transition: opacity 0.15s;
    background: #fee2e2; color: #b91c1c; border: none;
    border-radius: 50%; width: 24px; height: 24px;
    cursor: pointer; font-size: 0.75rem; line-height: 24px;
    padding: 0; text-align: center;
  }
  .patient-card:hover .patient-card-delete { opacity: 1; }

  .btn-primary {
    background: #1e4d8c; color: #fff; border: none;
    padding: 10px 18px; border-radius: 7px;
    font-size: 0.88rem; font-weight: 600; cursor: pointer;
    text-decoration: none; display: inline-block;
    transition: background 0.18s;
  }
  .btn-primary:hover { background: #163b6e; }
  .btn-remove { cursor: pointer; }

  /* Toast */
  .toast {
    position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
    background: #1e4d8c; color: #fff; padding: 10px 22px;
    border-radius: 8px; font-size: 0.9rem; font-weight: 600;
    opacity: 0; pointer-events: none;
    transition: opacity 0.3s; z-index: 9999;
  }
  .toast.show { opacity: 1; }
</style>

<script>
function filterPatients() {
  const q = document.getElementById('patients-search').value.toLowerCase();
  document.querySelectorAll('.patient-card').forEach(card => {
    const name = card.dataset.name || '';
    card.style.display = name.includes(q) ? '' : 'none';
  });
}

function deletePatient(e, id, name) {
  e.stopPropagation();
  if (!confirm('¿Eliminar paciente "' + name + '"? Esta acción no se puede deshacer.')) return;
  fetch('${pageContext.request.contextPath}/patients', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: '_method=DELETE&id=' + encodeURIComponent(id)
  })
  .then(r => r.ok ? r.json() : Promise.reject(r))
  .then(data => {
    if (data.ok) {
      showToast('Paciente eliminado.');
      setTimeout(() => location.reload(), 900);
    } else {
      showToast('Error al eliminar: ' + (data.error || '?'));
    }
  })
  .catch(() => showToast('Error de red al eliminar.'));
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}
</script>

</body>
</html>
