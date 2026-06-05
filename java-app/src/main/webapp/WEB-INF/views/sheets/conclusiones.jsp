<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%-- HOJA 9 – Contenido Conclusiones --%>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Conclusiones – RIO Chequeo Médico</title>
  <c:set var="activeNav"   value="patients" scope="request" />
  <c:set var="activeSheet" value="9"        scope="request" />
  <%@ include file="../layout/header.jsp" %>
</head>
<body>

<div id="form-layout">
  <%@ include file="../layout/sidebar.jsp" %>
  <main id="main-content">

    <div class="content-sheet-toolbar" style="background:#b45309;">
      <strong>Contenido Conclusiones</strong>
      <div class="membrete-control">
        <label class="btn-membrete" for="membrete9-input">
          🖼 ${not empty record.membrete9 ? 'Cambiar membrete' : 'Agregar imagen de membrete'}
        </label>
        <c:if test="${not empty record.membrete9}">
          <button type="button" class="btn-remove" onclick="removeMembrete(9)">✕ Quitar membrete</button>
        </c:if>
        <input type="file" id="membrete9-input" style="display:none"
               accept="image/*" onchange="uploadMembrete(event,9)" />
      </div>
    </div>

    <div class="sheet content-sheet" style="
        <c:if test='${not empty record.membrete9}'>background-image:url('data:image/jpeg;base64,${record.membrete9}');</c:if>
        --section-color:#b45309;
        --section-color-bg:rgba(180,83,9,0.10);
        --section-color-border:rgba(180,83,9,0.32);
        --section-color-subtle:rgba(180,83,9,0.06);">
      <div class="content-sheet-overlay">
        <div class="content-page-area">

          <form id="sheet9-form"
                action="${pageContext.request.contextPath}/sheet"
                method="post">
            <input type="hidden" name="sheet" value="9" />
            <input type="hidden" name="patientId" value="${currentPatientId}" />

            <h1 class="ctt-h1">CONCLUSIONES</h1>
            <p class="ctt-p">Paciente que presenta las siguientes alteraciones:</p>

            <p class="ctt-p"><strong class="ctt-sub-line">Sistema Respiratorio:</strong>
              <textarea name="c9-resp" class="ctt-textarea" placeholder="...">${not empty record.c9Resp ? record.c9Resp : ''}</textarea></p>
            <p class="ctt-p"><strong class="ctt-sub-line">Sistema Cardiovascular:</strong>
              <textarea name="c9-card" class="ctt-textarea" placeholder="...">${not empty record.c9Card ? record.c9Card : ''}</textarea></p>
            <p class="ctt-p"><strong class="ctt-sub-line">Sistema Gastrointestinal:</strong>
              <textarea name="c9-gi" class="ctt-textarea" placeholder="...">${not empty record.c9Gi ? record.c9Gi : ''}</textarea></p>
            <p class="ctt-p"><strong class="ctt-sub-line">Sistema Genito-Urinario:</strong>
              <textarea name="c9-gu" class="ctt-textarea" placeholder="...">${not empty record.c9Gu ? record.c9Gu : ''}</textarea></p>
            <p class="ctt-p"><strong class="ctt-sub-line">Sistema Neurológico y Órganos de los Sentidos:</strong>
              <textarea name="c9-nerv" class="ctt-textarea" placeholder="...">${not empty record.c9Nerv ? record.c9Nerv : ''}</textarea></p>
            <p class="ctt-p"><strong class="ctt-sub-line">Sistema Musculoesquelético:</strong>
              <textarea name="c9-muscu" class="ctt-textarea" placeholder="...">${not empty record.c9Muscu ? record.c9Muscu : ''}</textarea></p>
            <p class="ctt-p"><strong class="ctt-sub-line">Sistema Hematopoyético y células en sangre:</strong>
              <textarea name="c9-hema" class="ctt-textarea" placeholder="...">${not empty record.c9Hema ? record.c9Hema : ''}</textarea></p>
            <p class="ctt-p"><strong class="ctt-sub-line">Sistema Endocrino metabólico:</strong>
              <textarea name="c9-endo" class="ctt-textarea" placeholder="...">${not empty record.c9Endo ? record.c9Endo : ''}</textarea></p>

            <div id="block-dental">
              <label class="ctt-omit-toggle">
                <input type="checkbox" name="omit-dental" id="omit-chk-dental"
                       value="true"
                       <c:if test="${record.omitDental}">checked</c:if>
                       onchange="toggleOmit('block-dental-content', this.checked)" />
                Omitir odontológico
              </label>
              <div id="block-dental-content"
                   <c:if test="${record.omitDental}">class="ctt-omitted"</c:if>>
                <p class="ctt-p"><strong class="ctt-sub-line">Odontológico:</strong>
                  <textarea name="c9-dental" class="ctt-textarea" placeholder="...">${not empty record.c9Dental ? record.c9Dental : ''}</textarea></p>
              </div>
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
  initSidebar(9);
  document.querySelectorAll('.ctt-textarea').forEach(ta => {
    ta.style.height = 'auto'; ta.style.height = (ta.scrollHeight + 2) + 'px';
    ta.addEventListener('input', function() {
      this.style.height = 'auto'; this.style.height = (this.scrollHeight + 2) + 'px';
    });
  });
  function toggleOmit(blockId, omit) {
    const el = document.getElementById(blockId);
    if (el) el.classList.toggle('ctt-omitted', omit);
  }
</script>
</body>
</html>
