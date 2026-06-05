<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%-- HOJA 24 – Contenido Audiometría --%>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Audiometría – RIO Chequeo Médico</title>
  <c:set var="activeNav"   value="patients" scope="request" />
  <c:set var="activeSheet" value="24"       scope="request" />
  <%@ include file="../layout/header.jsp" %>
</head>
<body>

<div id="form-layout">
  <%@ include file="../layout/sidebar.jsp" %>
  <main id="main-content">

    <div class="content-sheet-toolbar" style="background:#0e7490;">
      <strong>Contenido Audiometría</strong>
      <div class="membrete-control">
        <label class="btn-membrete" for="membrete24-input">
          🖼 ${not empty record.membrete24 ? 'Cambiar membrete' : 'Agregar imagen de membrete'}
        </label>
        <c:if test="${not empty record.membrete24}">
          <button type="button" class="btn-remove" onclick="removeMembrete(24)">✕ Quitar membrete</button>
        </c:if>
        <input type="file" id="membrete24-input" style="display:none"
               accept="image/*" onchange="uploadMembrete(event,24)" />
      </div>
    </div>

    <div class="sheet content-sheet" style="
        <c:if test='${not empty record.membrete24}'>background-image:url('data:image/jpeg;base64,${record.membrete24}');</c:if>
        --section-color:#0e7490;
        --section-color-bg:rgba(14,116,144,0.10);
        --section-color-border:rgba(14,116,144,0.32);
        --section-color-subtle:rgba(14,116,144,0.06);">
      <div class="content-sheet-overlay">
        <div class="content-page-area">

          <form id="sheet24-form"
                action="${pageContext.request.contextPath}/sheet"
                method="post"
                enctype="multipart/form-data">
            <input type="hidden" name="sheet" value="24" />
            <input type="hidden" name="patientId" value="${currentPatientId}" />

            <h1 class="ctt-h1">AUDIOMETRÍA</h1>

            <p class="ctt-p">
              <strong class="ctt-sub-line">Fecha:</strong>
              <input type="text" name="c24-fecha" class="ctt-inline ctt-inline-sm"
                     placeholder="dd/mm/aaaa"
                     value="${not empty record.c24Fecha ? record.c24Fecha : ''}" />
            </p>

            <%-- OÍDO DERECHO --%>
            <h2 class="ctt-h2">Oído Derecho (OD)</h2>
            <p class="ctt-p">
              <strong class="ctt-sub-line">500 Hz:</strong>
              <input type="text" name="c24-od-500" class="ctt-inline ctt-inline-sm"
                     value="${not empty record.c24Od500 ? record.c24Od500 : ''}" /> dB &nbsp;
              <strong class="ctt-sub-line">1,000 Hz:</strong>
              <input type="text" name="c24-od-1k" class="ctt-inline ctt-inline-sm"
                     value="${not empty record.c24Od1k ? record.c24Od1k : ''}" /> dB &nbsp;
              <strong class="ctt-sub-line">2,000 Hz:</strong>
              <input type="text" name="c24-od-2k" class="ctt-inline ctt-inline-sm"
                     value="${not empty record.c24Od2k ? record.c24Od2k : ''}" /> dB
            </p>
            <p class="ctt-p">
              <strong class="ctt-sub-line">4,000 Hz:</strong>
              <input type="text" name="c24-od-4k" class="ctt-inline ctt-inline-sm"
                     value="${not empty record.c24Od4k ? record.c24Od4k : ''}" /> dB &nbsp;
              <strong class="ctt-sub-line">8,000 Hz:</strong>
              <input type="text" name="c24-od-8k" class="ctt-inline ctt-inline-sm"
                     value="${not empty record.c24Od8k ? record.c24Od8k : ''}" /> dB
            </p>
            <p class="ctt-p">
              <strong class="ctt-sub-line">Clasificación OD:</strong>
              <select name="c24-od-clasif" class="ctt-inline">
                <option value="">--</option>
                <c:set var="clasifOpts" value="${['Normal','Hipoacusia leve','Hipoacusia moderada','Hipoacusia severa','Hipoacusia profunda']}" />
                <c:forEach var="opt" items="${clasifOpts}">
                  <option value="${opt}"
                          <c:if test="${record.c24OdClasif == opt}">selected</c:if>>${opt}</option>
                </c:forEach>
              </select>
            </p>

            <%-- OÍDO IZQUIERDO --%>
            <h2 class="ctt-h2">Oído Izquierdo (OI)</h2>
            <p class="ctt-p">
              <strong class="ctt-sub-line">500 Hz:</strong>
              <input type="text" name="c24-oi-500" class="ctt-inline ctt-inline-sm"
                     value="${not empty record.c24Oi500 ? record.c24Oi500 : ''}" /> dB &nbsp;
              <strong class="ctt-sub-line">1,000 Hz:</strong>
              <input type="text" name="c24-oi-1k" class="ctt-inline ctt-inline-sm"
                     value="${not empty record.c24Oi1k ? record.c24Oi1k : ''}" /> dB &nbsp;
              <strong class="ctt-sub-line">2,000 Hz:</strong>
              <input type="text" name="c24-oi-2k" class="ctt-inline ctt-inline-sm"
                     value="${not empty record.c24Oi2k ? record.c24Oi2k : ''}" /> dB
            </p>
            <p class="ctt-p">
              <strong class="ctt-sub-line">4,000 Hz:</strong>
              <input type="text" name="c24-oi-4k" class="ctt-inline ctt-inline-sm"
                     value="${not empty record.c24Oi4k ? record.c24Oi4k : ''}" /> dB &nbsp;
              <strong class="ctt-sub-line">8,000 Hz:</strong>
              <input type="text" name="c24-oi-8k" class="ctt-inline ctt-inline-sm"
                     value="${not empty record.c24Oi8k ? record.c24Oi8k : ''}" /> dB
            </p>
            <p class="ctt-p">
              <strong class="ctt-sub-line">Clasificación OI:</strong>
              <select name="c24-oi-clasif" class="ctt-inline">
                <option value="">--</option>
                <c:forEach var="opt" items="${clasifOpts}">
                  <option value="${opt}"
                          <c:if test="${record.c24OiClasif == opt}">selected</c:if>>${opt}</option>
                </c:forEach>
              </select>
            </p>

            <%-- CONCLUSIÓN --%>
            <h2 class="ctt-h2">Conclusión</h2>
            <p class="ctt-p">
              <strong class="ctt-sub-line">Resultado:</strong>
              <textarea name="c24-resultado" class="ctt-textarea"
                        placeholder="Resumen del resultado...">${not empty record.c24Resultado ? record.c24Resultado : ''}</textarea>
            </p>
            <p class="ctt-p">
              <strong class="ctt-sub-line">Recomendaciones:</strong>
              <textarea name="c24-reco" class="ctt-textarea"
                        placeholder="...">${not empty record.c24Reco ? record.c24Reco : ''}</textarea>
            </p>

            <div class="ctt-attachment">
              <span class="ctt-attachment-label">Adjuntar audiograma / reporte</span>
              <c:if test="${not empty record.c24Img}">
                <div style="margin-bottom:10px;">
                  <img src="data:image/jpeg;base64,${record.c24Img}"
                       alt="Audiometría"
                       style="max-width:100%;border-radius:6px;" />
                </div>
              </c:if>
              <label class="btn-secondary" for="c24-img-input" style="cursor:pointer;display:inline-block;">
                ${not empty record.c24Img ? 'Cambiar imagen' : 'Subir imagen'}
              </label>
              <input type="file" id="c24-img-input" name="c24-img-file"
                     accept="image/*" style="display:none"
                     onchange="previewAttachment(event,'c24-img-preview')" />
              <c:if test="${not empty record.c24Img}">
                <button type="button" class="btn-remove" style="margin-left:8px;"
                        onclick="removeAttachment('c24','c24-img-preview')">✕ Quitar imagen</button>
                <input type="hidden" name="c24-img-clear" id="c24-img-clear" value="" />
              </c:if>
              <div id="c24-img-preview" style="margin-top:8px;"></div>
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
  initSidebar(24);
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
