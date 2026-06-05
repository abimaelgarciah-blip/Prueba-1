<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%-- HOJA 13 – Contenido Prueba de Esfuerzo y ECG --%>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Prueba de Esfuerzo – RIO Chequeo Médico</title>
  <c:set var="activeNav"   value="patients" scope="request" />
  <c:set var="activeSheet" value="13"       scope="request" />
  <%@ include file="../layout/header.jsp" %>
</head>
<body>

<div id="form-layout">
  <%@ include file="../layout/sidebar.jsp" %>
  <main id="main-content">

    <div class="content-sheet-toolbar" style="background:#be123c;">
      <strong>Contenido Prueba Esfuerzo y ECG</strong>
      <div class="membrete-control">
        <label class="btn-membrete" for="membrete13-input">
          🖼 ${not empty record.membrete13 ? 'Cambiar membrete' : 'Agregar imagen de membrete'}
        </label>
        <c:if test="${not empty record.membrete13}">
          <button type="button" class="btn-remove" onclick="removeMembrete(13)">✕ Quitar membrete</button>
        </c:if>
        <input type="file" id="membrete13-input" style="display:none"
               accept="image/*" onchange="uploadMembrete(event,13)" />
      </div>
    </div>

    <div class="sheet content-sheet" style="
        <c:if test='${not empty record.membrete13}'>background-image:url('data:image/jpeg;base64,${record.membrete13}');</c:if>
        --section-color:#be123c;
        --section-color-bg:rgba(190,18,60,0.10);
        --section-color-border:rgba(190,18,60,0.32);
        --section-color-subtle:rgba(190,18,60,0.06);">
      <div class="content-sheet-overlay">
        <div class="content-page-area">

          <form id="sheet13-form"
                action="${pageContext.request.contextPath}/sheet"
                method="post"
                enctype="multipart/form-data">
            <input type="hidden" name="sheet" value="13" />
            <input type="hidden" name="patientId" value="${currentPatientId}" />

            <h1 class="ctt-h1">PRUEBA DE ESFUERZO Y ELECTROCARDIOGRAMA</h1>
            <p class="ctt-p">Datos del estudio:</p>

            <p class="ctt-p">
              <strong class="ctt-sub-line">Fecha:</strong>
              <input type="text" name="c13-fecha" class="ctt-inline ctt-inline-sm"
                     placeholder="dd/mm/aaaa"
                     value="${not empty record.c13Fecha ? record.c13Fecha : ''}" />
            </p>
            <p class="ctt-p">
              <strong class="ctt-sub-line">METs alcanzados:</strong>
              <input type="text" name="c13-mets" class="ctt-inline ctt-inline-sm"
                     placeholder="____"
                     value="${not empty record.c13Mets ? record.c13Mets : ''}" />
            </p>
            <p class="ctt-p">
              <strong class="ctt-sub-line">FC máxima:</strong>
              <input type="text" name="c13-fcmax" class="ctt-inline ctt-inline-sm"
                     placeholder="____"
                     value="${not empty record.c13Fcmax ? record.c13Fcmax : ''}" /> lpm
            </p>
            <p class="ctt-p">
              <strong class="ctt-sub-line">TA máxima:</strong>
              <input type="text" name="c13-tamax" class="ctt-inline ctt-inline-sm"
                     placeholder="____"
                     value="${not empty record.c13Tamax ? record.c13Tamax : ''}" /> mmHg
            </p>
            <p class="ctt-p">
              <strong class="ctt-sub-line">Ritmo:</strong>
              <input type="text" name="c13-ritmo" class="ctt-inline"
                     placeholder="____"
                     value="${not empty record.c13Ritmo ? record.c13Ritmo : ''}" />
            </p>
            <p class="ctt-p">
              <strong class="ctt-sub-line">Resultado:</strong>
              <textarea name="c13-resultado" class="ctt-textarea"
                        placeholder="Resumen del resultado...">${not empty record.c13Resultado ? record.c13Resultado : ''}</textarea>
            </p>
            <p class="ctt-p">
              <strong class="ctt-sub-line">Interpretación detallada:</strong>
              <textarea name="c13-interp" class="ctt-textarea"
                        placeholder="Interpretación clínica...">${not empty record.c13Interp ? record.c13Interp : ''}</textarea>
            </p>

            <%-- Imagen adjunta --%>
            <div class="ctt-attachment">
              <span class="ctt-attachment-label">Adjuntar imagen del reporte / ECG</span>
              <c:if test="${not empty record.c13Img}">
                <div style="margin-bottom:10px;">
                  <img src="data:image/jpeg;base64,${record.c13Img}"
                       alt="Imagen ECG / Prueba esfuerzo"
                       style="max-width:100%;border-radius:6px;" />
                </div>
              </c:if>
              <label class="btn-secondary" for="c13-img-input" style="cursor:pointer;display:inline-block;">
                ${not empty record.c13Img ? 'Cambiar imagen' : 'Subir imagen'}
              </label>
              <input type="file" id="c13-img-input" name="c13-img-file"
                     accept="image/*" style="display:none"
                     onchange="previewAttachment(event,'c13-img-preview')" />
              <c:if test="${not empty record.c13Img}">
                <button type="button" class="btn-remove" style="margin-left:8px;"
                        onclick="removeAttachment('c13','c13-img-preview')">✕ Quitar imagen</button>
                <input type="hidden" name="c13-img-clear" id="c13-img-clear" value="" />
              </c:if>
              <div id="c13-img-preview" style="margin-top:8px;"></div>
            </div>

            <div class="sheet-form-actions">
              <button type="submit" class="btn-save">Guardar</button>
            </div>
          </form>

        </div>
      </div>
    </div>
  </main>
</div>

<div id="toast" class="toast" aria-live="polite"></div>
<script src="${pageContext.request.contextPath}/js/form.js"></script>
<script>
  initSidebar(13);
  document.querySelectorAll('.ctt-textarea').forEach(ta => {
    ta.style.height = 'auto'; ta.style.height = (ta.scrollHeight + 2) + 'px';
    ta.addEventListener('input', function() {
      this.style.height = 'auto'; this.style.height = (this.scrollHeight + 2) + 'px';
    });
  });
  function previewAttachment(event, previewId) {
    const file = event.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const el = document.getElementById(previewId);
      if (el) el.innerHTML = '<img src="' + ev.target.result + '" style="max-width:100%;border-radius:6px;margin-top:6px;" />';
    };
    reader.readAsDataURL(file);
  }
  function removeAttachment(prefix, previewId) {
    document.getElementById(previewId).innerHTML = '';
    const ci = document.getElementById(prefix + '-img-clear');
    if (ci) ci.value = '1';
  }
</script>
</body>
</html>
