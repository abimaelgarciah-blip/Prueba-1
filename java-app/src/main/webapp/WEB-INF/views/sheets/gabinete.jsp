<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%-- HOJA 17 – Contenido Estudios de Gabinete --%>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Gabinete – RIO Chequeo Médico</title>
  <c:set var="activeNav"   value="patients" scope="request" />
  <c:set var="activeSheet" value="17"       scope="request" />
  <%@ include file="../layout/header.jsp" %>
</head>
<body>

<div id="form-layout">
  <%@ include file="../layout/sidebar.jsp" %>
  <main id="main-content">

    <div class="content-sheet-toolbar" style="background:#065f46;">
      <strong>Contenido Estudios de Gabinete</strong>
      <div class="membrete-control">
        <label class="btn-membrete" for="membrete17-input">
          🖼 ${not empty record.membrete17 ? 'Cambiar membrete' : 'Agregar imagen de membrete'}
        </label>
        <c:if test="${not empty record.membrete17}">
          <button type="button" class="btn-remove" onclick="removeMembrete(17)">✕ Quitar membrete</button>
        </c:if>
        <input type="file" id="membrete17-input" style="display:none"
               accept="image/*" onchange="uploadMembrete(event,17)" />
      </div>
    </div>

    <div class="sheet content-sheet" style="
        <c:if test='${not empty record.membrete17}'>background-image:url('data:image/jpeg;base64,${record.membrete17}');</c:if>
        --section-color:#065f46;
        --section-color-bg:rgba(6,95,70,0.10);
        --section-color-border:rgba(6,95,70,0.32);
        --section-color-subtle:rgba(6,95,70,0.06);">
      <div class="content-sheet-overlay">
        <div class="content-page-area">

          <form id="sheet17-form"
                action="${pageContext.request.contextPath}/sheet"
                method="post"
                enctype="multipart/form-data">
            <input type="hidden" name="sheet" value="17" />
            <input type="hidden" name="patientId" value="${currentPatientId}" />

            <h1 class="ctt-h1">ESTUDIOS DE GABINETE</h1>
            <p class="ctt-p">Estudios de imagen y de gabinete realizados:</p>

            <%-- Estudios individuales (nombre + resultado) --%>
            <div id="gabinete-estudios-list">
              <c:choose>
                <c:when test="${not empty record.c17Estudios}">
                  <c:forEach var="estudio" items="${record.c17Estudios}" varStatus="st">
                    <div class="ctt-dynamic-item" style="margin-bottom:10px;">
                      <input type="text" name="c17-estudio-titulo[]"
                             class="ctt-inline" style="width:100%;margin-bottom:4px;"
                             placeholder="Nombre del estudio"
                             value="${not empty estudio.titulo ? estudio.titulo : ''}" />
                      <textarea name="c17-estudio-contenido[]"
                                class="ctt-textarea"
                                placeholder="Resultado / descripción...">${not empty estudio.contenido ? estudio.contenido : ''}</textarea>
                    </div>
                  </c:forEach>
                </c:when>
                <c:otherwise>
                  <div class="ctt-dynamic-item" style="margin-bottom:10px;" id="estudio-0">
                    <input type="text" name="c17-estudio-titulo[]"
                           class="ctt-inline" style="width:100%;margin-bottom:4px;"
                           placeholder="Nombre del estudio" />
                    <textarea name="c17-estudio-contenido[]"
                              class="ctt-textarea"
                              placeholder="Resultado / descripción..."></textarea>
                  </div>
                </c:otherwise>
              </c:choose>
            </div>

            <button type="button" class="btn-secondary" style="margin-bottom:16px;"
                    onclick="addEstudio()">+ Agregar estudio</button>

            <p class="ctt-p" style="margin-top:10px;">Notas generales:</p>
            <textarea name="c17-notas" class="ctt-textarea"
                      placeholder="Observaciones generales sobre los estudios de gabinete..."
                      style="min-height:90px;">${not empty record.c17Notas ? record.c17Notas : ''}</textarea>

            <div class="ctt-attachment">
              <span class="ctt-attachment-label">Adjuntar imagen del estudio principal</span>
              <c:if test="${not empty record.c17Img}">
                <div style="margin-bottom:10px;">
                  <img src="data:image/jpeg;base64,${record.c17Img}"
                       alt="Gabinete"
                       style="max-width:100%;border-radius:6px;" />
                </div>
              </c:if>
              <label class="btn-secondary" for="c17-img-input" style="cursor:pointer;display:inline-block;">
                ${not empty record.c17Img ? 'Cambiar imagen' : 'Subir imagen'}
              </label>
              <input type="file" id="c17-img-input" name="c17-img-file"
                     accept="image/*" style="display:none"
                     onchange="previewAttachment(event,'c17-img-preview')" />
              <c:if test="${not empty record.c17Img}">
                <button type="button" class="btn-remove" style="margin-left:8px;"
                        onclick="removeAttachment('c17','c17-img-preview')">✕ Quitar imagen</button>
                <input type="hidden" name="c17-img-clear" id="c17-img-clear" value="" />
              </c:if>
              <div id="c17-img-preview" style="margin-top:8px;"></div>
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
  initSidebar(17);
  let estudioCount = document.querySelectorAll('[name="c17-estudio-titulo[]"]').length;

  function addEstudio() {
    const list = document.getElementById('gabinete-estudios-list');
    const div = document.createElement('div');
    div.className = 'ctt-dynamic-item';
    div.style.marginBottom = '10px';
    div.innerHTML =
      '<input type="text" name="c17-estudio-titulo[]" class="ctt-inline" style="width:100%;margin-bottom:4px;" placeholder="Nombre del estudio" />' +
      '<textarea name="c17-estudio-contenido[]" class="ctt-textarea" placeholder="Resultado / descripción..."></textarea>' +
      '<button type="button" class="btn-remove" style="margin-top:4px;" onclick="this.parentNode.remove()">✕ Eliminar</button>';
    list.appendChild(div);
    const ta = div.querySelector('textarea');
    ta.addEventListener('input', function(){ this.style.height='auto'; this.style.height=(this.scrollHeight+2)+'px'; });
  }

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
