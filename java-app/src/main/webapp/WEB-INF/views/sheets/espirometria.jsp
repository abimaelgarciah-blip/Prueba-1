<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%-- HOJA 15 – Contenido Espirometría --%>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Espirometría – RIO Chequeo Médico</title>
  <c:set var="activeNav"   value="patients" scope="request" />
  <c:set var="activeSheet" value="15"       scope="request" />
  <%@ include file="../layout/header.jsp" %>
</head>
<body>

<div id="form-layout">
  <%@ include file="../layout/sidebar.jsp" %>
  <main id="main-content">

    <div class="content-sheet-toolbar" style="background:#0369a1;">
      <strong>Contenido Espirometría</strong>
      <div class="membrete-control">
        <label class="btn-membrete" for="membrete15-input">
          🖼 ${not empty record.membrete15 ? 'Cambiar membrete' : 'Agregar imagen de membrete'}
        </label>
        <c:if test="${not empty record.membrete15}">
          <button type="button" class="btn-remove" onclick="removeMembrete(15)">✕ Quitar membrete</button>
        </c:if>
        <input type="file" id="membrete15-input" style="display:none"
               accept="image/*" onchange="uploadMembrete(event,15)" />
      </div>
    </div>

    <div class="sheet content-sheet" style="
        <c:if test='${not empty record.membrete15}'>background-image:url('data:image/jpeg;base64,${record.membrete15}');</c:if>
        --section-color:#0369a1;
        --section-color-bg:rgba(3,105,161,0.10);
        --section-color-border:rgba(3,105,161,0.32);
        --section-color-subtle:rgba(3,105,161,0.06);">
      <div class="content-sheet-overlay">
        <div class="content-page-area">

          <form id="sheet15-form"
                action="${pageContext.request.contextPath}/sheet"
                method="post"
                enctype="multipart/form-data">
            <input type="hidden" name="sheet" value="15" />
            <input type="hidden" name="patientId" value="${currentPatientId}" />

            <h1 class="ctt-h1">ESPIROMETRÍA</h1>

            <p class="ctt-p">
              <strong class="ctt-sub-line">Fecha:</strong>
              <input type="text" name="c15-fecha" class="ctt-inline ctt-inline-sm"
                     placeholder="dd/mm/aaaa"
                     value="${not empty record.c15Fecha ? record.c15Fecha : ''}" />
            </p>
            <p class="ctt-p">
              <strong class="ctt-sub-line">CVF (FVC):</strong>
              <input type="text" name="c15-fvc" class="ctt-inline ctt-inline-sm"
                     placeholder="____"
                     value="${not empty record.c15Fvc ? record.c15Fvc : ''}" /> % predicho
            </p>
            <p class="ctt-p">
              <strong class="ctt-sub-line">VEF1 (FEV1):</strong>
              <input type="text" name="c15-fev1" class="ctt-inline ctt-inline-sm"
                     placeholder="____"
                     value="${not empty record.c15Fev1 ? record.c15Fev1 : ''}" /> % predicho
            </p>
            <p class="ctt-p">
              <strong class="ctt-sub-line">VEF1/CVF:</strong>
              <input type="text" name="c15-fev1fvc" class="ctt-inline ctt-inline-sm"
                     placeholder="____"
                     value="${not empty record.c15Fev1fvc ? record.c15Fev1fvc : ''}" />
            </p>
            <p class="ctt-p">
              <strong class="ctt-sub-line">Patrón:</strong>
              <select name="c15-patron" class="ctt-inline">
                <option value="">--</option>
                <c:forEach var="opt" items="${['Normal','Obstructivo','Restrictivo','Mixto']}">
                  <option value="${opt}"
                          <c:if test="${record.c15Patron == opt}">selected</c:if>>${opt}</option>
                </c:forEach>
              </select>
            </p>
            <p class="ctt-p">
              <strong class="ctt-sub-line">Resultado:</strong>
              <textarea name="c15-resultado" class="ctt-textarea"
                        placeholder="Resumen del resultado...">${not empty record.c15Resultado ? record.c15Resultado : ''}</textarea>
            </p>
            <p class="ctt-p">
              <strong class="ctt-sub-line">Interpretación:</strong>
              <textarea name="c15-interp" class="ctt-textarea"
                        placeholder="Interpretación clínica...">${not empty record.c15Interp ? record.c15Interp : ''}</textarea>
            </p>

            <div class="ctt-attachment">
              <span class="ctt-attachment-label">Adjuntar imagen del reporte</span>
              <c:if test="${not empty record.c15Img}">
                <div style="margin-bottom:10px;">
                  <img src="data:image/jpeg;base64,${record.c15Img}"
                       alt="Espirometría"
                       style="max-width:100%;border-radius:6px;" />
                </div>
              </c:if>
              <label class="btn-secondary" for="c15-img-input" style="cursor:pointer;display:inline-block;">
                ${not empty record.c15Img ? 'Cambiar imagen' : 'Subir imagen'}
              </label>
              <input type="file" id="c15-img-input" name="c15-img-file"
                     accept="image/*" style="display:none"
                     onchange="previewAttachment(event,'c15-img-preview')" />
              <c:if test="${not empty record.c15Img}">
                <button type="button" class="btn-remove" style="margin-left:8px;"
                        onclick="removeAttachment('c15','c15-img-preview')">✕ Quitar imagen</button>
                <input type="hidden" name="c15-img-clear" id="c15-img-clear" value="" />
              </c:if>
              <div id="c15-img-preview" style="margin-top:8px;"></div>
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
  initSidebar(15);
  document.querySelectorAll('.ctt-textarea').forEach(ta => {
    ta.style.height = 'auto'; ta.style.height = (ta.scrollHeight+2)+'px';
    ta.addEventListener('input', function(){ this.style.height='auto'; this.style.height=(this.scrollHeight+2)+'px'; });
  });
  function previewAttachment(event, previewId) {
    const file = event.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const el = document.getElementById(previewId);
      if (el) el.innerHTML = '<img src="'+ev.target.result+'" style="max-width:100%;border-radius:6px;margin-top:6px;" />';
    };
    reader.readAsDataURL(file);
  }
  function removeAttachment(prefix, previewId) {
    document.getElementById(previewId).innerHTML = '';
    const ci = document.getElementById(prefix+'-img-clear');
    if (ci) ci.value = '1';
  }
</script>
</body>
</html>
