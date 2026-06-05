<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%-- HOJA 26 – Contenido Diagnóstico Dental --%>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Dental – RIO Chequeo Médico</title>
  <c:set var="activeNav"   value="patients" scope="request" />
  <c:set var="activeSheet" value="26"       scope="request" />
  <%@ include file="../layout/header.jsp" %>
</head>
<body>

<div id="form-layout">
  <%@ include file="../layout/sidebar.jsp" %>
  <main id="main-content">

    <div class="content-sheet-toolbar" style="background:#be185d;">
      <strong>Contenido Diagnóstico Dental</strong>
      <div class="membrete-control">
        <label class="btn-membrete" for="membrete26-input">
          🖼 ${not empty record.membrete26 ? 'Cambiar membrete' : 'Agregar imagen de membrete'}
        </label>
        <c:if test="${not empty record.membrete26}">
          <button type="button" class="btn-remove" onclick="removeMembrete(26)">✕ Quitar membrete</button>
        </c:if>
        <input type="file" id="membrete26-input" style="display:none"
               accept="image/*" onchange="uploadMembrete(event,26)" />
      </div>
    </div>

    <div class="sheet content-sheet" style="
        <c:if test='${not empty record.membrete26}'>background-image:url('data:image/jpeg;base64,${record.membrete26}');</c:if>
        --section-color:#be185d;
        --section-color-bg:rgba(190,24,93,0.10);
        --section-color-border:rgba(190,24,93,0.32);
        --section-color-subtle:rgba(190,24,93,0.06);">
      <div class="content-sheet-overlay">
        <div class="content-page-area">

          <form id="sheet26-form"
                action="${pageContext.request.contextPath}/sheet"
                method="post"
                enctype="multipart/form-data">
            <input type="hidden" name="sheet" value="26" />
            <input type="hidden" name="patientId" value="${currentPatientId}" />

            <h1 class="ctt-h1">DIAGNÓSTICO DENTAL</h1>

            <p class="ctt-p">
              <strong class="ctt-sub-line">Fecha:</strong>
              <input type="text" name="c26-fecha" class="ctt-inline ctt-inline-sm"
                     placeholder="dd/mm/aaaa"
                     value="${not empty record.c26Fecha ? record.c26Fecha : ''}" />
            </p>

            <h2 class="ctt-h2">Condición Periodontal</h2>
            <p class="ctt-p">
              <strong class="ctt-sub-line">Estado periodontal:</strong>
              <select name="c26-periodontal" class="ctt-inline">
                <option value="">--</option>
                <c:forEach var="opt" items="${['Normal','Gingivitis leve','Gingivitis moderada','Periodontitis leve','Periodontitis moderada','Periodontitis severa']}">
                  <option value="${opt}"
                          <c:if test="${record.c26Periodontal == opt}">selected</c:if>>${opt}</option>
                </c:forEach>
              </select>
            </p>
            <p class="ctt-p">
              <strong class="ctt-sub-line">Higiene oral:</strong>
              <select name="c26-higiene" class="ctt-inline">
                <option value="">--</option>
                <c:forEach var="opt" items="${['Buena','Regular','Deficiente']}">
                  <option value="${opt}"
                          <c:if test="${record.c26Higiene == opt}">selected</c:if>>${opt}</option>
                </c:forEach>
              </select>
            </p>

            <h2 class="ctt-h2">Hallazgos</h2>
            <p class="ctt-p">
              <strong class="ctt-sub-line">Caries presentes:</strong>
              <input type="text" name="c26-caries" class="ctt-inline"
                     placeholder="piezas afectadas"
                     value="${not empty record.c26Caries ? record.c26Caries : ''}" />
            </p>
            <p class="ctt-p">
              <strong class="ctt-sub-line">Piezas faltantes:</strong>
              <input type="text" name="c26-faltantes" class="ctt-inline"
                     placeholder="núms. de piezas"
                     value="${not empty record.c26Faltantes ? record.c26Faltantes : ''}" />
            </p>
            <p class="ctt-p">
              <strong class="ctt-sub-line">Piezas con restauración:</strong>
              <input type="text" name="c26-restauracion" class="ctt-inline"
                     placeholder="núms. de piezas"
                     value="${not empty record.c26Restauracion ? record.c26Restauracion : ''}" />
            </p>
            <p class="ctt-p">
              <strong class="ctt-sub-line">Otros hallazgos:</strong>
              <textarea name="c26-otros" class="ctt-textarea"
                        placeholder="...">${not empty record.c26Otros ? record.c26Otros : ''}</textarea>
            </p>

            <h2 class="ctt-h2">Plan de Tratamiento</h2>
            <p class="ctt-p">
              <strong class="ctt-sub-line">Requiere tratamiento:</strong>
              <select name="c26-tratamiento" class="ctt-inline">
                <option value="">--</option>
                <c:forEach var="opt" items="${['No requiere','Sí requiere','En proceso']}">
                  <option value="${opt}"
                          <c:if test="${record.c26Tratamiento == opt}">selected</c:if>>${opt}</option>
                </c:forEach>
              </select>
            </p>
            <p class="ctt-p">
              <strong class="ctt-sub-line">Diagnóstico:</strong>
              <textarea name="c26-diagnostico" class="ctt-textarea"
                        placeholder="Diagnóstico detallado...">${not empty record.c26Diagnostico ? record.c26Diagnostico : ''}</textarea>
            </p>
            <p class="ctt-p">
              <strong class="ctt-sub-line">Recomendaciones:</strong>
              <textarea name="c26-reco" class="ctt-textarea"
                        placeholder="...">${not empty record.c26Reco ? record.c26Reco : ''}</textarea>
            </p>

            <div class="ctt-attachment">
              <span class="ctt-attachment-label">Adjuntar odontograma / reporte</span>
              <c:if test="${not empty record.c26Img}">
                <div style="margin-bottom:10px;">
                  <img src="data:image/jpeg;base64,${record.c26Img}"
                       alt="Dental"
                       style="max-width:100%;border-radius:6px;" />
                </div>
              </c:if>
              <label class="btn-secondary" for="c26-img-input" style="cursor:pointer;display:inline-block;">
                ${not empty record.c26Img ? 'Cambiar imagen' : 'Subir imagen'}
              </label>
              <input type="file" id="c26-img-input" name="c26-img-file"
                     accept="image/*" style="display:none"
                     onchange="previewAttachment(event,'c26-img-preview')" />
              <c:if test="${not empty record.c26Img}">
                <button type="button" class="btn-remove" style="margin-left:8px;"
                        onclick="removeAttachment('c26','c26-img-preview')">✕ Quitar imagen</button>
                <input type="hidden" name="c26-img-clear" id="c26-img-clear" value="" />
              </c:if>
              <div id="c26-img-preview" style="margin-top:8px;"></div>
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
  initSidebar(26);
  document.querySelectorAll('.ctt-textarea').forEach(ta => {
    ta.style.height='auto'; ta.style.height=(ta.scrollHeight+2)+'px';
    ta.addEventListener('input', function(){ this.style.height='auto'; this.style.height=(this.scrollHeight+2)+'px'; });
  });
  function previewAttachment(event, previewId) {
    const file=event.target.files[0]; if(!file) return;
    const reader=new FileReader();
    reader.onload=ev=>{ const el=document.getElementById(previewId); if(el) el.innerHTML='<img src="'+ev.target.result+'" style="max-width:100%;border-radius:6px;margin-top:6px;" />'; };
    reader.readAsDataURL(file);
  }
  function removeAttachment(prefix, previewId) {
    document.getElementById(previewId).innerHTML='';
    const ci=document.getElementById(prefix+'-img-clear'); if(ci) ci.value='1';
  }
</script>
</body>
</html>
