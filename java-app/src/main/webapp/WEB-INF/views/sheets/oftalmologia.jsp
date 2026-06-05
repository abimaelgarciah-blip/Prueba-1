<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%-- HOJA 19 – Contenido Oftalmología --%>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Oftalmología – RIO Chequeo Médico</title>
  <c:set var="activeNav"   value="patients" scope="request" />
  <c:set var="activeSheet" value="19"       scope="request" />
  <%@ include file="../layout/header.jsp" %>
</head>
<body>

<div id="form-layout">
  <%@ include file="../layout/sidebar.jsp" %>
  <main id="main-content">

    <div class="content-sheet-toolbar" style="background:#4338ca;">
      <strong>Contenido Oftalmología</strong>
      <div class="membrete-control">
        <label class="btn-membrete" for="membrete19-input">
          🖼 ${not empty record.membrete19 ? 'Cambiar membrete' : 'Agregar imagen de membrete'}
        </label>
        <c:if test="${not empty record.membrete19}">
          <button type="button" class="btn-remove" onclick="removeMembrete(19)">✕ Quitar membrete</button>
        </c:if>
        <input type="file" id="membrete19-input" style="display:none"
               accept="image/*" onchange="uploadMembrete(event,19)" />
      </div>
    </div>

    <div class="sheet content-sheet" style="
        <c:if test='${not empty record.membrete19}'>background-image:url('data:image/jpeg;base64,${record.membrete19}');</c:if>
        --section-color:#4338ca;
        --section-color-bg:rgba(67,56,202,0.10);
        --section-color-border:rgba(67,56,202,0.32);
        --section-color-subtle:rgba(67,56,202,0.06);">
      <div class="content-sheet-overlay">
        <div class="content-page-area">

          <form id="sheet19-form"
                action="${pageContext.request.contextPath}/sheet"
                method="post"
                enctype="multipart/form-data">
            <input type="hidden" name="sheet" value="19" />
            <input type="hidden" name="patientId" value="${currentPatientId}" />

            <h1 class="ctt-h1">OFTALMOLOGÍA</h1>

            <p class="ctt-p">
              <strong class="ctt-sub-line">Fecha:</strong>
              <input type="text" name="c19-fecha" class="ctt-inline ctt-inline-sm"
                     placeholder="dd/mm/aaaa"
                     value="${not empty record.c19Fecha ? record.c19Fecha : ''}" />
            </p>
            <p class="ctt-p">
              <strong class="ctt-sub-line">Agudeza Visual OD:</strong>
              <input type="text" name="c19-avOD" class="ctt-inline ctt-inline-sm"
                     placeholder="20/20"
                     value="${not empty record.c19AvOD ? record.c19AvOD : ''}" />
            </p>
            <p class="ctt-p">
              <strong class="ctt-sub-line">Agudeza Visual OI:</strong>
              <input type="text" name="c19-avOI" class="ctt-inline ctt-inline-sm"
                     placeholder="20/20"
                     value="${not empty record.c19AvOI ? record.c19AvOI : ''}" />
            </p>
            <p class="ctt-p">
              <strong class="ctt-sub-line">Presión Intraocular OD:</strong>
              <input type="text" name="c19-pioOD" class="ctt-inline ctt-inline-sm"
                     placeholder="____"
                     value="${not empty record.c19PioOD ? record.c19PioOD : ''}" /> mmHg
            </p>
            <p class="ctt-p">
              <strong class="ctt-sub-line">Presión Intraocular OI:</strong>
              <input type="text" name="c19-pioOI" class="ctt-inline ctt-inline-sm"
                     placeholder="____"
                     value="${not empty record.c19PioOI ? record.c19PioOI : ''}" /> mmHg
            </p>
            <p class="ctt-p">
              <strong class="ctt-sub-line">Fondo de Ojo:</strong>
              <textarea name="c19-fondo" class="ctt-textarea"
                        placeholder="...">${not empty record.c19Fondo ? record.c19Fondo : ''}</textarea>
            </p>
            <p class="ctt-p">
              <strong class="ctt-sub-line">Segmento Anterior:</strong>
              <textarea name="c19-segAnt" class="ctt-textarea"
                        placeholder="...">${not empty record.c19SegAnt ? record.c19SegAnt : ''}</textarea>
            </p>
            <p class="ctt-p">
              <strong class="ctt-sub-line">Resultado:</strong>
              <textarea name="c19-resultado" class="ctt-textarea"
                        placeholder="Resumen del resultado...">${not empty record.c19Resultado ? record.c19Resultado : ''}</textarea>
            </p>
            <p class="ctt-p">
              <strong class="ctt-sub-line">Recomendaciones:</strong>
              <textarea name="c19-reco" class="ctt-textarea"
                        placeholder="...">${not empty record.c19Reco ? record.c19Reco : ''}</textarea>
            </p>

            <div class="ctt-attachment">
              <span class="ctt-attachment-label">Adjuntar imagen del reporte</span>
              <c:if test="${not empty record.c19Img}">
                <div style="margin-bottom:10px;">
                  <img src="data:image/jpeg;base64,${record.c19Img}"
                       alt="Oftalmología"
                       style="max-width:100%;border-radius:6px;" />
                </div>
              </c:if>
              <label class="btn-secondary" for="c19-img-input" style="cursor:pointer;display:inline-block;">
                ${not empty record.c19Img ? 'Cambiar imagen' : 'Subir imagen'}
              </label>
              <input type="file" id="c19-img-input" name="c19-img-file"
                     accept="image/*" style="display:none"
                     onchange="previewAttachment(event,'c19-img-preview')" />
              <c:if test="${not empty record.c19Img}">
                <button type="button" class="btn-remove" style="margin-left:8px;"
                        onclick="removeAttachment('c19','c19-img-preview')">✕ Quitar imagen</button>
                <input type="hidden" name="c19-img-clear" id="c19-img-clear" value="" />
              </c:if>
              <div id="c19-img-preview" style="margin-top:8px;"></div>
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
  initSidebar(19);
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
