<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>
<%-- HOJA 11 – Contenido Sugerencias --%>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Sugerencias – RIO Chequeo Médico</title>
  <c:set var="activeNav"   value="patients" scope="request" />
  <c:set var="activeSheet" value="11"       scope="request" />
  <%@ include file="../layout/header.jsp" %>
</head>
<body>

<div id="form-layout">
  <%@ include file="../layout/sidebar.jsp" %>
  <main id="main-content">

    <div class="content-sheet-toolbar" style="background:#6d28d9;">
      <strong>Contenido Sugerencias</strong>
      <div class="membrete-control">
        <label class="btn-membrete" for="membrete11-input">
          🖼 ${not empty record.membrete11 ? 'Cambiar membrete' : 'Agregar imagen de membrete'}
        </label>
        <c:if test="${not empty record.membrete11}">
          <button type="button" class="btn-remove" onclick="removeMembrete(11)">✕ Quitar membrete</button>
        </c:if>
        <input type="file" id="membrete11-input" style="display:none"
               accept="image/*" onchange="uploadMembrete(event,11)" />
      </div>
    </div>

    <div class="sheet content-sheet" style="
        <c:if test='${not empty record.membrete11}'>background-image:url('data:image/jpeg;base64,${record.membrete11}');</c:if>
        --section-color:#6d28d9;
        --section-color-bg:rgba(109,40,217,0.10);
        --section-color-border:rgba(109,40,217,0.32);
        --section-color-subtle:rgba(109,40,217,0.06);">
      <div class="content-sheet-overlay">
        <div class="content-page-area">

          <form id="sheet11-form"
                action="${pageContext.request.contextPath}/sheet"
                method="post"
                enctype="multipart/form-data">
            <input type="hidden" name="sheet" value="11" />
            <input type="hidden" name="patientId" value="${currentPatientId}" />

            <h1 class="ctt-h1">SUGERENCIAS</h1>

            <%-- Sugerencias como textarea multilínea (una por línea) --%>
            <p class="ctt-p" style="margin-bottom:6px;">Escriba cada sugerencia en una línea separada:</p>
            <textarea name="c11-sugs" class="ctt-textarea"
                      rows="8"
                      placeholder="Sugerencia 1&#10;Sugerencia 2&#10;..."
                      style="min-height:140px;">${not empty record.c11Sugs ? record.c11Sugs : ''}</textarea>

            <%-- Firma del doctor --%>
            <div class="ctt-firma-centered" style="margin-top:32px;">
              <div class="ctt-firma-line"></div>

              <div style="text-align:center;margin-top:16px;">
                <p class="ctt-firma-doc-line">
                  <strong id="c11-doc-nombre-show">
                    ${not empty record.c11DocNombre ? record.c11DocNombre : 'Dr. Nombre Apellido'}
                  </strong>
                </p>
                <p class="ctt-firma-doc-line">
                  Cédula Profesional:
                  <span>${not empty record.c11DocCedula ? record.c11DocCedula : '_____'}</span>
                </p>
                <p class="ctt-firma-doc-line">
                  Especialidad:
                  <span>${not empty record.c11DocEspecialidad ? record.c11DocEspecialidad : '_____'}</span>
                </p>
              </div>

              <c:if test="${not empty record.c11FirmaImg}">
                <div style="text-align:center;margin-top:12px;">
                  <img src="data:image/png;base64,${record.c11FirmaImg}"
                       alt="Firma del doctor"
                       style="max-height:100px;max-width:300px;border:1px solid #dce3ec;border-radius:6px;padding:4px;" />
                </div>
              </c:if>
            </div>

            <%-- Campos editables de firma --%>
            <fieldset style="margin-top:24px;border:1.5px solid #dce3ec;border-radius:8px;padding:16px;">
              <legend style="font-weight:700;font-size:0.82rem;color:#6d28d9;padding:0 6px;">
                Datos del doctor firmante
              </legend>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:8px;">
                <div class="form-group">
                  <label style="font-size:0.8rem;font-weight:600;color:#444;display:block;margin-bottom:4px;">
                    Nombre del doctor
                  </label>
                  <input type="text" name="c11-doc-nombre" class="ctt-inline"
                         style="width:100%;"
                         placeholder="Dr. Nombre Apellido"
                         value="${not empty record.c11DocNombre ? record.c11DocNombre : ''}" />
                </div>
                <div class="form-group">
                  <label style="font-size:0.8rem;font-weight:600;color:#444;display:block;margin-bottom:4px;">
                    Cédula Profesional
                  </label>
                  <input type="text" name="c11-doc-cedula" class="ctt-inline"
                         style="width:100%;"
                         placeholder="número de cédula"
                         value="${not empty record.c11DocCedula ? record.c11DocCedula : ''}" />
                </div>
                <div class="form-group">
                  <label style="font-size:0.8rem;font-weight:600;color:#444;display:block;margin-bottom:4px;">
                    Especialidad
                  </label>
                  <input type="text" name="c11-doc-especialidad" class="ctt-inline"
                         style="width:100%;"
                         placeholder="especialidad"
                         value="${not empty record.c11DocEspecialidad ? record.c11DocEspecialidad : ''}" />
                </div>
              </div>

              <div style="margin-top:14px;">
                <label style="font-size:0.8rem;font-weight:600;color:#444;display:block;margin-bottom:6px;">
                  Imagen de firma
                </label>
                <label class="btn-secondary" for="c11-firma-input" style="cursor:pointer;display:inline-block;">
                  Subir imagen de firma
                </label>
                <input type="file" id="c11-firma-input" name="c11-firma-file"
                       accept="image/*" style="display:none"
                       onchange="previewFirma(event,'c11-firma-preview')" />
                <c:if test="${not empty record.c11FirmaImg}">
                  <label class="btn-remove" style="cursor:pointer;display:inline-block;margin-left:8px;"
                         onclick="clearFirmaPreview('c11-firma-preview','c11-firma-clear')">
                    ✕ Quitar firma
                  </label>
                  <input type="hidden" name="c11-firma-clear" id="c11-firma-clear" value="" />
                </c:if>
                <div id="c11-firma-preview" style="margin-top:8px;">
                  <c:if test="${not empty record.c11FirmaImg}">
                    <img src="data:image/png;base64,${record.c11FirmaImg}"
                         style="max-height:80px;border:1px solid #dce3ec;border-radius:6px;padding:4px;" />
                  </c:if>
                </div>
              </div>
            </fieldset>

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
  initSidebar(11);

  function previewFirma(event, previewId) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const prev = document.getElementById(previewId);
      if (prev) prev.innerHTML = '<img src="' + ev.target.result + '" style="max-height:80px;border:1px solid #dce3ec;border-radius:6px;padding:4px;" />';
    };
    reader.readAsDataURL(file);
  }

  function clearFirmaPreview(previewId, clearInputId) {
    const prev = document.getElementById(previewId);
    if (prev) prev.innerHTML = '';
    const ci = document.getElementById(clearInputId);
    if (ci) ci.value = '1';
  }
</script>
</body>
</html>
