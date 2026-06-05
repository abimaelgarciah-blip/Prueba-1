<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%--
  Portada genérica (cover sheet).
  Parámetros de request:
    - sheetNumber  : Integer (1,2,3,4,6,8,10,12,14,16,18,20,23,25)
    - sheetLabel   : String  (nombre visible de la hoja)
    - coverImage   : String  (base64 del BLOB, puede ser null/empty)
    - activeSheet  : Integer (igual a sheetNumber)
    - currentPatientId, currentPatient
--%>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${sheetLabel} – RIO Chequeo Médico</title>
  <c:set var="activeNav" value="patients" scope="request" />
  <%@ include file="../layout/header.jsp" %>
</head>
<body>

<div id="form-layout">
  <%@ include file="../layout/sidebar.jsp" %>
  <main id="main-content">

    <%-- Toolbar azul portada --%>
    <div class="content-sheet-toolbar cover-toolbar">
      <strong>${sheetLabel}</strong>
      <div class="membrete-control">
        <label class="btn-membrete" for="cover-file-input">
          🖼 ${not empty coverImage ? 'Cambiar imagen de portada' : 'Agregar imagen de portada'}
        </label>
        <c:if test="${not empty coverImage}">
          <button type="button" class="btn-remove"
                  onclick="removeCoverImage(${sheetNumber})">✕ Quitar</button>
        </c:if>
        <input type="file" id="cover-file-input" style="display:none"
               accept="image/*"
               onchange="uploadCoverImage(event, ${sheetNumber})" />
      </div>
    </div>

    <%-- Cover area --%>
    <div class="cover-wrapper" id="cover-wrapper-${sheetNumber}">
      <div class="cover-sheet-page"
           id="cover-page-${sheetNumber}"
           onclick="document.getElementById('cover-file-input').click()">
        <c:choose>
          <c:when test="${not empty coverImage}">
            <img src="data:image/jpeg;base64,${coverImage}"
                 class="cover-full-img"
                 alt="${sheetLabel}" />
          </c:when>
          <c:otherwise>
            <div class="cover-placeholder-big">
              <svg width="64" height="64" fill="none" stroke="#b0bec5" stroke-width="1.3" viewBox="0 0 24 24">
                <rect x="3" y="3" width="18" height="18" rx="3"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <path d="M21 15l-5-5L5 21"/>
              </svg>
              <p>Haz clic para subir imagen de portada</p>
              <span>(${sheetLabel})</span>
            </div>
          </c:otherwise>
        </c:choose>
      </div>
    </div>

  </main>
</div>

<div id="toast" class="toast" aria-live="polite"></div>
<script src="${pageContext.request.contextPath}/js/form.js"></script>
<script>
  initSidebar(${sheetNumber});

  function uploadCoverImage(event, sheetNum) {
    const file = event.target.files[0];
    if (!file) return;
    uploadImage(file, 'cover-' + sheetNum, sheetNum);
  }

  function removeCoverImage(sheetNum) {
    if (!confirm('¿Quitar la imagen de portada?')) return;
    const fd = new FormData();
    fd.append('patientId', '${currentPatientId}');
    fd.append('sheet', sheetNum);
    fd.append('removeImage', 'cover-' + sheetNum);
    fetch('${pageContext.request.contextPath}/sheet?upload=remove', {
      method: 'POST', body: fd
    })
    .then(r => r.ok ? r.json() : Promise.reject())
    .then(() => {
      showToast('Imagen eliminada.');
      setTimeout(() => location.reload(), 800);
    })
    .catch(() => showToast('Error al eliminar la imagen.'));
  }
</script>
</body>
</html>
