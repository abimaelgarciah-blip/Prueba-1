<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%-- HOJA 22 – Firma del Doctor --%>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Firma del Doctor – RIO Chequeo Médico</title>
  <c:set var="activeNav"   value="patients" scope="request" />
  <c:set var="activeSheet" value="22"       scope="request" />
  <%@ include file="../layout/header.jsp" %>
</head>
<body>

<div id="form-layout">
  <%@ include file="../layout/sidebar.jsp" %>
  <main id="main-content">

    <div class="content-sheet-toolbar" style="background:#374151;">
      <strong>Firma del Doctor</strong>
      <div class="membrete-control">
        <label class="btn-membrete" for="membrete22-input">
          🖼 ${not empty record.membrete22 ? 'Cambiar membrete' : 'Agregar imagen de membrete'}
        </label>
        <c:if test="${not empty record.membrete22}">
          <button type="button" class="btn-remove" onclick="removeMembrete(22)">✕ Quitar membrete</button>
        </c:if>
        <input type="file" id="membrete22-input" style="display:none"
               accept="image/*" onchange="uploadMembrete(event,22)" />
      </div>
    </div>

    <div class="sheet content-sheet" style="
        <c:if test='${not empty record.membrete22}'>background-image:url('data:image/jpeg;base64,${record.membrete22}');</c:if>
        --section-color:#374151;
        --section-color-bg:rgba(55,65,81,0.10);
        --section-color-border:rgba(55,65,81,0.32);
        --section-color-subtle:rgba(55,65,81,0.06);">
      <div class="content-sheet-overlay">
        <div class="content-page-area">

          <form id="sheet22-form"
                action="${pageContext.request.contextPath}/sheet"
                method="post"
                enctype="multipart/form-data">
            <input type="hidden" name="sheet" value="22" />
            <input type="hidden" name="patientId" value="${currentPatientId}" />

            <h1 class="ctt-h1">DATOS Y FIRMA DEL DOCTOR</h1>

            <p class="ctt-p">
              <strong class="ctt-sub-line">Nombre:</strong>
              <input type="text" name="c22-nombre" class="ctt-inline"
                     placeholder="Dr. Nombre Apellido"
                     value="${not empty record.c22Nombre ? record.c22Nombre : ''}" />
            </p>
            <p class="ctt-p">
              <strong class="ctt-sub-line">Cédula Profesional:</strong>
              <input type="text" name="c22-cedula" class="ctt-inline"
                     placeholder="número de cédula"
                     value="${not empty record.c22Cedula ? record.c22Cedula : ''}" />
            </p>
            <p class="ctt-p">
              <strong class="ctt-sub-line">Especialidad:</strong>
              <input type="text" name="c22-especialidad" class="ctt-inline"
                     placeholder="especialidad"
                     value="${not empty record.c22Especialidad ? record.c22Especialidad : ''}" />
            </p>
            <p class="ctt-p">
              <strong class="ctt-sub-line">Institución:</strong>
              <input type="text" name="c22-clinica" class="ctt-inline"
                     placeholder="clínica / consultorio"
                     value="${not empty record.c22Clinica ? record.c22Clinica : ''}" />
            </p>

            <%-- Área de firma --%>
            <div class="ctt-firma-area" style="margin-top:24px;">
              <p class="ctt-firma-label">Firma:</p>

              <div id="c22-firma-display" class="ctt-firma-display">
                <c:choose>
                  <c:when test="${not empty record.c22FirmaImg}">
                    <img src="data:image/png;base64,${record.c22FirmaImg}"
                         alt="Firma del doctor"
                         style="max-height:120px;" />
                  </c:when>
                  <c:otherwise>
                    <span class="ctt-firma-placeholder">
                      Suba una imagen de la firma del doctor
                    </span>
                  </c:otherwise>
                </c:choose>
              </div>

              <div style="margin-top:10px;display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
                <label class="btn-secondary" for="c22-firma-input" style="cursor:pointer;display:inline-block;">
                  Subir imagen de firma
                </label>
                <input type="file" id="c22-firma-input" name="c22-firma-file"
                       accept="image/*" style="display:none"
                       onchange="previewFirma22(event)" />
                <c:if test="${not empty record.c22FirmaImg}">
                  <button type="button" class="btn-remove"
                          onclick="clearFirma22()">✕ Quitar firma</button>
                  <input type="hidden" name="c22-firma-clear" id="c22-firma-clear" value="" />
                </c:if>
              </div>
            </div>

            <%-- Vista previa imprimible --%>
            <div class="ctt-firma-centered" style="margin-top:36px;">
              <div id="firma-preview-print" class="ctt-firma-centered-display">
                <c:if test="${not empty record.c22FirmaImg}">
                  <img src="data:image/png;base64,${record.c22FirmaImg}"
                       alt="Firma" style="max-height:80px;" />
                </c:if>
              </div>
              <div class="ctt-firma-line"></div>
              <p class="ctt-firma-doc-line">
                <strong>${not empty record.c22Nombre ? record.c22Nombre : 'Dr. Nombre Apellido'}</strong>
              </p>
              <p class="ctt-firma-doc-line">
                Cédula Profesional: ${not empty record.c22Cedula ? record.c22Cedula : '_____'}
              </p>
              <p class="ctt-firma-doc-line">
                Especialidad: ${not empty record.c22Especialidad ? record.c22Especialidad : '_____'}
              </p>
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
  initSidebar(22);

  function previewFirma22(event) {
    const file = event.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const display = document.getElementById('c22-firma-display');
      if (display) display.innerHTML = '<img src="' + ev.target.result + '" style="max-height:120px;" />';
      const prev = document.getElementById('firma-preview-print');
      if (prev) prev.innerHTML = '<img src="' + ev.target.result + '" style="max-height:80px;" />';
    };
    reader.readAsDataURL(file);
  }

  function clearFirma22() {
    const display = document.getElementById('c22-firma-display');
    if (display) display.innerHTML = '<span class="ctt-firma-placeholder">Suba una imagen de la firma del doctor</span>';
    const prev = document.getElementById('firma-preview-print');
    if (prev) prev.innerHTML = '';
    const ci = document.getElementById('c22-firma-clear');
    if (ci) ci.value = '1';
  }
</script>
</body>
</html>
