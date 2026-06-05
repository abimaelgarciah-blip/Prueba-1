<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%-- HOJA 21 – Contenido Laboratorio --%>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Laboratorio – RIO Chequeo Médico</title>
  <c:set var="activeNav"   value="patients" scope="request" />
  <c:set var="activeSheet" value="21"       scope="request" />
  <%@ include file="../layout/header.jsp" %>
</head>
<body>

<div id="form-layout">
  <%@ include file="../layout/sidebar.jsp" %>
  <main id="main-content">

    <div class="content-sheet-toolbar" style="background:#1e3a5f;">
      <strong>Contenido Laboratorio</strong>
      <div class="membrete-control">
        <label class="btn-membrete" for="membrete21-input">
          🖼 ${not empty record.membrete21 ? 'Cambiar membrete' : 'Agregar imagen de membrete'}
        </label>
        <c:if test="${not empty record.membrete21}">
          <button type="button" class="btn-remove" onclick="removeMembrete(21)">✕ Quitar membrete</button>
        </c:if>
        <input type="file" id="membrete21-input" style="display:none"
               accept="image/*" onchange="uploadMembrete(event,21)" />
      </div>
    </div>

    <div class="sheet content-sheet" style="
        <c:if test='${not empty record.membrete21}'>background-image:url('data:image/jpeg;base64,${record.membrete21}');</c:if>
        --section-color:#1e3a5f;
        --section-color-bg:rgba(30,58,95,0.10);
        --section-color-border:rgba(30,58,95,0.32);
        --section-color-subtle:rgba(30,58,95,0.06);">
      <div class="content-sheet-overlay">
        <div class="content-page-area">

          <form id="sheet21-form"
                action="${pageContext.request.contextPath}/sheet"
                method="post"
                enctype="multipart/form-data">
            <input type="hidden" name="sheet" value="21" />
            <input type="hidden" name="patientId" value="${currentPatientId}" />

            <h1 class="ctt-h1">LABORATORIO</h1>

            <p class="ctt-p">
              <strong class="ctt-sub-line">Fecha de toma:</strong>
              <input type="text" name="c21-fecha" class="ctt-inline ctt-inline-sm"
                     placeholder="dd/mm/aaaa"
                     value="${not empty record.c21Fecha ? record.c21Fecha : ''}" />
            </p>
            <p class="ctt-p">
              <strong class="ctt-sub-line">Laboratorio:</strong>
              <input type="text" name="c21-lab" class="ctt-inline"
                     placeholder="nombre del laboratorio"
                     value="${not empty record.c21Lab ? record.c21Lab : ''}" />
            </p>

            <p class="ctt-p" style="margin-top:12px;">Resultados de laboratorio:</p>
            <div id="lab-resultados-list">
              <c:choose>
                <c:when test="${not empty record.c21Resultados}">
                  <c:forEach var="res" items="${record.c21Resultados}">
                    <div class="ctt-dynamic-item" style="margin-bottom:10px;">
                      <input type="text" name="c21-res-titulo[]"
                             class="ctt-inline" style="width:100%;margin-bottom:4px;"
                             placeholder="Parámetro"
                             value="${not empty res.titulo ? res.titulo : ''}" />
                      <textarea name="c21-res-contenido[]" class="ctt-textarea"
                                placeholder="Valor / referencia...">${not empty res.contenido ? res.contenido : ''}</textarea>
                    </div>
                  </c:forEach>
                </c:when>
                <c:otherwise>
                  <div class="ctt-dynamic-item" style="margin-bottom:10px;">
                    <input type="text" name="c21-res-titulo[]"
                           class="ctt-inline" style="width:100%;margin-bottom:4px;"
                           placeholder="Parámetro" />
                    <textarea name="c21-res-contenido[]" class="ctt-textarea"
                              placeholder="Valor / referencia..."></textarea>
                  </div>
                </c:otherwise>
              </c:choose>
            </div>
            <button type="button" class="btn-secondary" style="margin-bottom:16px;"
                    onclick="addResultado()">+ Agregar resultado de laboratorio</button>

            <p class="ctt-p">
              <strong class="ctt-sub-line">Observaciones:</strong>
              <textarea name="c21-obs" class="ctt-textarea"
                        placeholder="...">${not empty record.c21Obs ? record.c21Obs : ''}</textarea>
            </p>

            <div class="ctt-attachment">
              <span class="ctt-attachment-label">Adjuntar imagen del reporte</span>
              <c:if test="${not empty record.c21Img}">
                <div style="margin-bottom:10px;">
                  <img src="data:image/jpeg;base64,${record.c21Img}"
                       alt="Laboratorio"
                       style="max-width:100%;border-radius:6px;" />
                </div>
              </c:if>
              <label class="btn-secondary" for="c21-img-input" style="cursor:pointer;display:inline-block;">
                ${not empty record.c21Img ? 'Cambiar imagen' : 'Subir imagen'}
              </label>
              <input type="file" id="c21-img-input" name="c21-img-file"
                     accept="image/*" style="display:none"
                     onchange="previewAttachment(event,'c21-img-preview')" />
              <c:if test="${not empty record.c21Img}">
                <button type="button" class="btn-remove" style="margin-left:8px;"
                        onclick="removeAttachment('c21','c21-img-preview')">✕ Quitar imagen</button>
                <input type="hidden" name="c21-img-clear" id="c21-img-clear" value="" />
              </c:if>
              <div id="c21-img-preview" style="margin-top:8px;"></div>
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
  initSidebar(21);
  function addResultado() {
    const list = document.getElementById('lab-resultados-list');
    const div = document.createElement('div');
    div.className = 'ctt-dynamic-item';
    div.style.marginBottom = '10px';
    div.innerHTML =
      '<input type="text" name="c21-res-titulo[]" class="ctt-inline" style="width:100%;margin-bottom:4px;" placeholder="Parámetro" />' +
      '<textarea name="c21-res-contenido[]" class="ctt-textarea" placeholder="Valor / referencia..."></textarea>' +
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
