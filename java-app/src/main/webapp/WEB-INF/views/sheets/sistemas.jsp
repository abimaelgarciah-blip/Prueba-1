<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>
<%-- HOJA 7 – Contenido Sistemas --%>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Sistemas – RIO Chequeo Médico</title>
  <c:set var="activeNav"   value="patients" scope="request" />
  <c:set var="activeSheet" value="7"        scope="request" />
  <%@ include file="../layout/header.jsp" %>
</head>
<body>

<div id="form-layout">
  <%@ include file="../layout/sidebar.jsp" %>
  <main id="main-content">

    <div class="content-sheet-toolbar" style="--section-color:#0d7a5f;background:#0d7a5f;">
      <strong>Contenido Sistemas</strong>
      <div class="membrete-control">
        <label class="btn-membrete" for="membrete7-input">
          🖼 ${not empty record.membrete7 ? 'Cambiar membrete' : 'Agregar imagen de membrete'}
        </label>
        <c:if test="${not empty record.membrete7}">
          <button type="button" class="btn-remove" onclick="removeMembrete(7)">✕ Quitar membrete</button>
        </c:if>
        <input type="file" id="membrete7-input" style="display:none"
               accept="image/*" onchange="uploadMembrete(event,7)" />
      </div>
    </div>

    <div class="sheet content-sheet" style="
        <c:if test='${not empty record.membrete7}'>background-image:url('data:image/jpeg;base64,${record.membrete7}');</c:if>
        --section-color:#0d7a5f;
        --section-color-bg:rgba(13,122,95,0.10);
        --section-color-border:rgba(13,122,95,0.32);
        --section-color-subtle:rgba(13,122,95,0.06);">
      <div class="content-sheet-overlay">
        <div class="content-page-area">

          <form id="sheet7-form"
                action="${pageContext.request.contextPath}/sheet"
                method="post">
            <input type="hidden" name="sheet" value="7" />
            <input type="hidden" name="patientId" value="${currentPatientId}" />

            <%-- RESPIRATORIO --%>
            <h1 class="ctt-h1">SISTEMA RESPIRATORIO</h1>
            <p class="ctt-p"><strong class="ctt-sub-line">Síntomas respiratorios:</strong>
              <textarea name="c7-resp-sint" class="ctt-textarea" placeholder="...">${not empty record.c7RespSint ? record.c7RespSint : ''}</textarea></p>
            <p class="ctt-p"><strong class="ctt-sub-line">Espirometría:</strong>
              <textarea name="c7-resp-espiro" class="ctt-textarea" placeholder="...">${not empty record.c7RespEspiro ? record.c7RespEspiro : ''}</textarea></p>
            <p class="ctt-p"><strong class="ctt-sub-line">Radiografía de tórax:</strong>
              <textarea name="c7-resp-rx" class="ctt-textarea" placeholder="...">${not empty record.c7RespRx ? record.c7RespRx : ''}</textarea></p>

            <%-- CARDIOVASCULAR --%>
            <h1 class="ctt-h1">SISTEMA CARDIOVASCULAR</h1>
            <p class="ctt-p"><strong class="ctt-sub-line">Prueba de esfuerzo:</strong>
              <textarea name="c7-card-pef" class="ctt-textarea" placeholder="...">${not empty record.c7CardPef ? record.c7CardPef : ''}</textarea></p>
            <p class="ctt-p"><strong class="ctt-sub-line">Electrocardiograma:</strong>
              <textarea name="c7-card-ecg" class="ctt-textarea" placeholder="...">${not empty record.c7CardEcg ? record.c7CardEcg : ''}</textarea></p>

            <%-- GASTROINTESTINAL --%>
            <h1 class="ctt-h1">SISTEMA GASTROINTESTINAL</h1>
            <p class="ctt-p"><strong class="ctt-sub-line">Sintomatología:</strong>
              <textarea name="c7-gi-sint" class="ctt-textarea" placeholder="...">${not empty record.c7GiSint ? record.c7GiSint : ''}</textarea></p>
            <p class="ctt-p"><strong class="ctt-sub-line">Ultrasonido abdominal:</strong>
              <textarea name="c7-gi-eco" class="ctt-textarea" placeholder="...">${not empty record.c7GiEco ? record.c7GiEco : ''}</textarea></p>
            <p class="ctt-p"><strong class="ctt-sub-line">Pruebas de función hepática:</strong>
              <textarea name="c7-gi-pfh" class="ctt-textarea" placeholder="...">${not empty record.c7GiPfh ? record.c7GiPfh : ''}</textarea></p>
            <p class="ctt-p"><strong class="ctt-sub-line">Coprológico:</strong>
              <textarea name="c7-gi-copro" class="ctt-textarea" placeholder="...">${not empty record.c7GiCopro ? record.c7GiCopro : ''}</textarea></p>
            <p class="ctt-p"><strong class="ctt-sub-line">Coproparasitoscópico:</strong>
              <textarea name="c7-gi-coprop" class="ctt-textarea" placeholder="...">${not empty record.c7GiCoprop ? record.c7GiCoprop : ''}</textarea></p>

            <div id="block-gi-dental">
              <label class="ctt-omit-toggle">
                <input type="checkbox" name="omit-gi-dental" id="omit-chk-gi-dental"
                       value="true"
                       <c:if test="${record.omitGiDental}">checked</c:if>
                       onchange="toggleOmit('block-gi-dental-content', this.checked)" />
                Omitir evaluación odontológica
              </label>
              <div id="block-gi-dental-content"
                   <c:if test="${record.omitGiDental}">class="ctt-omitted"</c:if>>
                <p class="ctt-p"><strong class="ctt-sub-line">Evaluación odontológica:</strong>
                  <textarea name="c7-gi-dental" class="ctt-textarea" placeholder="...">${not empty record.c7GiDental ? record.c7GiDental : ''}</textarea></p>
              </div>
            </div>

            <%-- GENITO-URINARIO --%>
            <h1 class="ctt-h1">SISTEMA GENITO-URINARIO</h1>
            <p class="ctt-p"><strong class="ctt-sub-line">Sintomatología:</strong>
              <textarea name="c7-gu-sint" class="ctt-textarea" placeholder="...">${not empty record.c7GuSint ? record.c7GuSint : ''}</textarea></p>
            <p class="ctt-p"><strong class="ctt-sub-line">Ecosonograma renal:</strong>
              <textarea name="c7-gu-ecoR" class="ctt-textarea" placeholder="...">${not empty record.c7GuEcoR ? record.c7GuEcoR : ''}</textarea></p>

            <div class="ctt-conditional ctt-sex-M"
                 <c:if test="${record.c5Sexo != 'Masculino'}">style="display:none"</c:if>>
              <p class="ctt-p"><strong class="ctt-sub-line">Ecosonograma prostático:</strong>
                <textarea name="c7-gu-ecoP" class="ctt-textarea" placeholder="...">${not empty record.c7GuEcoP ? record.c7GuEcoP : ''}</textarea></p>
            </div>
            <div class="ctt-conditional ctt-sex-F"
                 <c:if test="${record.c5Sexo != 'Femenino'}">style="display:none"</c:if>>
              <p class="ctt-p"><strong class="ctt-sub-line">Ecosonograma pélvico:</strong>
                <textarea name="c7-gu-ecoPel" class="ctt-textarea" placeholder="...">${not empty record.c7GuEcoPel ? record.c7GuEcoPel : ''}</textarea></p>
            </div>

            <p class="ctt-p"><strong class="ctt-sub-line">General de orina:</strong>
              <textarea name="c7-gu-orina" class="ctt-textarea" placeholder="...">${not empty record.c7GuOrina ? record.c7GuOrina : ''}</textarea></p>
            <p class="ctt-p"><strong class="ctt-sub-line">Urea:</strong>
              <textarea name="c7-gu-urea" class="ctt-textarea" placeholder="...">${not empty record.c7GuUrea ? record.c7GuUrea : ''}</textarea></p>
            <p class="ctt-p"><strong class="ctt-sub-line">Creatinina:</strong>
              <textarea name="c7-gu-creat" class="ctt-textarea" placeholder="...">${not empty record.c7GuCreat ? record.c7GuCreat : ''}</textarea></p>
            <p class="ctt-p"><strong class="ctt-sub-line">Nitrógeno uréico:</strong>
              <textarea name="c7-gu-nitro" class="ctt-textarea" placeholder="...">${not empty record.c7GuNitro ? record.c7GuNitro : ''}</textarea></p>
            <p class="ctt-p"><strong class="ctt-sub-line">Tasa de filtración glomerular:</strong>
              <textarea name="c7-gu-tfg" class="ctt-textarea" placeholder="...">${not empty record.c7GuTfg ? record.c7GuTfg : ''}</textarea></p>

            <div class="ctt-conditional ctt-sex-M"
                 <c:if test="${record.c5Sexo != 'Masculino'}">style="display:none"</c:if>>
              <p class="ctt-p"><strong class="ctt-sub-line">Antígeno prostático:</strong>
                <textarea name="c7-gu-psa" class="ctt-textarea" placeholder="...">${not empty record.c7GuPsa ? record.c7GuPsa : ''}</textarea></p>
            </div>

            <%-- NERVIOSO --%>
            <h1 class="ctt-h1">SISTEMA NERVIOSO Y ÓRGANOS DE LOS SENTIDOS</h1>
            <p class="ctt-p"><strong class="ctt-sub-line">Sintomatología:</strong>
              <textarea name="c7-nerv-sint" class="ctt-textarea" placeholder="...">${not empty record.c7NervSint ? record.c7NervSint : ''}</textarea></p>
            <p class="ctt-p"><strong class="ctt-sub-line">Valoración oftalmológica:</strong>
              <textarea name="c7-nerv-oftal" class="ctt-textarea" placeholder="...">${not empty record.c7NervOftal ? record.c7NervOftal : ''}</textarea></p>
            <p class="ctt-p"><strong class="ctt-sub-line">Audiometría:</strong>
              <textarea name="c7-nerv-audio" class="ctt-textarea" placeholder="...">${not empty record.c7NervAudio ? record.c7NervAudio : ''}</textarea></p>

            <%-- ENDOCRINO --%>
            <h1 class="ctt-h1">SISTEMA ENDOCRINO METABÓLICO</h1>
            <p class="ctt-p"><strong class="ctt-sub-line">Glucosa:</strong>
              <textarea name="c7-endo-gluc" class="ctt-textarea" placeholder="...">${not empty record.c7EndoGluc ? record.c7EndoGluc : ''}</textarea></p>
            <p class="ctt-p"><strong class="ctt-sub-line">Ácido úrico:</strong>
              <textarea name="c7-endo-au" class="ctt-textarea" placeholder="...">${not empty record.c7EndoAu ? record.c7EndoAu : ''}</textarea></p>
            <p class="ctt-p"><strong class="ctt-sub-line">Colesterol total:</strong>
              <textarea name="c7-endo-colT" class="ctt-textarea" placeholder="...">${not empty record.c7EndoColT ? record.c7EndoColT : ''}</textarea></p>
            <p class="ctt-p"><strong class="ctt-sub-line">Triglicéridos:</strong>
              <textarea name="c7-endo-trig" class="ctt-textarea" placeholder="...">${not empty record.c7EndoTrig ? record.c7EndoTrig : ''}</textarea></p>
            <p class="ctt-p"><strong class="ctt-sub-line">HDL:</strong>
              <textarea name="c7-endo-hdl" class="ctt-textarea" placeholder="...">${not empty record.c7EndoHdl ? record.c7EndoHdl : ''}</textarea></p>
            <p class="ctt-p"><strong class="ctt-sub-line">LDL:</strong>
              <textarea name="c7-endo-ldl" class="ctt-textarea" placeholder="...">${not empty record.c7EndoLdl ? record.c7EndoLdl : ''}</textarea></p>

            <div class="ctt-conditional ctt-sex-F"
                 <c:if test="${record.c5Sexo != 'Femenino'}">style="display:none"</c:if>>
              <p class="ctt-p"><strong class="ctt-sub-line">LH:</strong>
                <textarea name="c7-endo-lh" class="ctt-textarea" placeholder="...">${not empty record.c7EndoLh ? record.c7EndoLh : ''}</textarea></p>
              <p class="ctt-p"><strong class="ctt-sub-line">FSH:</strong>
                <textarea name="c7-endo-fsh" class="ctt-textarea" placeholder="...">${not empty record.c7EndoFsh ? record.c7EndoFsh : ''}</textarea></p>
              <p class="ctt-p"><strong class="ctt-sub-line">Prolactina:</strong>
                <textarea name="c7-endo-prl" class="ctt-textarea" placeholder="...">${not empty record.c7EndoPrl ? record.c7EndoPrl : ''}</textarea></p>
              <p class="ctt-p"><strong class="ctt-sub-line">Progesterona:</strong>
                <textarea name="c7-endo-prog" class="ctt-textarea" placeholder="...">${not empty record.c7EndoProg ? record.c7EndoProg : ''}</textarea></p>
              <p class="ctt-p"><strong class="ctt-sub-line">Estradiol:</strong>
                <textarea name="c7-endo-est" class="ctt-textarea" placeholder="...">${not empty record.c7EndoEst ? record.c7EndoEst : ''}</textarea></p>
            </div>

            <p class="ctt-p"><strong class="ctt-sub-line">IMC:</strong>
              <textarea name="c7-endo-imc" class="ctt-textarea" placeholder="...">${not empty record.c7EndoImc ? record.c7EndoImc : ''}</textarea></p>
            <p class="ctt-p"><strong class="ctt-sub-line">Clasificado como:</strong>
              <textarea name="c7-endo-imcClass" class="ctt-textarea" placeholder="...">${not empty record.c7EndoImcClass ? record.c7EndoImcClass : ''}</textarea></p>

            <%-- MUSCULOESQUELÉTICO --%>
            <h1 class="ctt-h1">SISTEMA MUSCULOESQUELÉTICO</h1>
            <p class="ctt-p"><strong class="ctt-sub-line">Sintomatología:</strong>
              <textarea name="c7-muscu-sint" class="ctt-textarea" placeholder="...">${not empty record.c7MuscuSint ? record.c7MuscuSint : ''}</textarea></p>
            <p class="ctt-p"><strong class="ctt-sub-line">Radiografía de columna lumbar:</strong>
              <textarea name="c7-muscu-rx" class="ctt-textarea" placeholder="...">${not empty record.c7MuscuRx ? record.c7MuscuRx : ''}</textarea></p>
            <p class="ctt-p"><strong class="ctt-sub-line">Densitometría:</strong>
              <textarea name="c7-muscu-densi" class="ctt-textarea" placeholder="...">${not empty record.c7MuscuDensi ? record.c7MuscuDensi : ''}</textarea></p>

            <%-- HEMATOPOYÉTICO --%>
            <h1 class="ctt-h1">SISTEMA HEMATOPOYÉTICO Y CÉLULAS EN SANGRE</h1>
            <p class="ctt-p"><strong class="ctt-sub-line">Biometría hemática:</strong>
              <textarea name="c7-hema-bh" class="ctt-textarea" placeholder="...">${not empty record.c7HemaBh ? record.c7HemaBh : ''}</textarea></p>
            <p class="ctt-p"><strong class="ctt-sub-line">Calcio:</strong>
              <textarea name="c7-hema-ca" class="ctt-textarea" placeholder="...">${not empty record.c7HemaCa ? record.c7HemaCa : ''}</textarea></p>
            <p class="ctt-p"><strong class="ctt-sub-line">Fósforo:</strong>
              <textarea name="c7-hema-p" class="ctt-textarea" placeholder="...">${not empty record.c7HemaP ? record.c7HemaP : ''}</textarea></p>
            <p class="ctt-p"><strong class="ctt-sub-line">Sodio:</strong>
              <textarea name="c7-hema-na" class="ctt-textarea" placeholder="...">${not empty record.c7HemaNa ? record.c7HemaNa : ''}</textarea></p>
            <p class="ctt-p"><strong class="ctt-sub-line">Potasio:</strong>
              <textarea name="c7-hema-k" class="ctt-textarea" placeholder="...">${not empty record.c7HemaK ? record.c7HemaK : ''}</textarea></p>
            <p class="ctt-p"><strong class="ctt-sub-line">Cloro:</strong>
              <textarea name="c7-hema-cl" class="ctt-textarea" placeholder="...">${not empty record.c7HemaCl ? record.c7HemaCl : ''}</textarea></p>
            <p class="ctt-p"><strong class="ctt-sub-line">Hierro sérico:</strong>
              <textarea name="c7-hema-fe" class="ctt-textarea" placeholder="...">${not empty record.c7HemaFe ? record.c7HemaFe : ''}</textarea></p>
            <p class="ctt-p"><strong class="ctt-sub-line">Grupo sanguíneo:</strong>
              <textarea name="c7-hema-grupo" class="ctt-textarea" placeholder="...">${not empty record.c7HemaGrupo ? record.c7HemaGrupo : ''}</textarea></p>
            <p class="ctt-p"><strong class="ctt-sub-line">Anticuerpos VIH y antígeno p24:</strong>
              <textarea name="c7-hema-vih" class="ctt-textarea" placeholder="...">${not empty record.c7HemaVih ? record.c7HemaVih : ''}</textarea></p>
            <p class="ctt-p"><strong class="ctt-sub-line">VDRL:</strong>
              <textarea name="c7-hema-vdrl" class="ctt-textarea" placeholder="...">${not empty record.c7HemaVdrl ? record.c7HemaVdrl : ''}</textarea></p>

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
  initSidebar(7);
  document.querySelectorAll('.ctt-textarea').forEach(ta => {
    ta.style.height = 'auto';
    ta.style.height = (ta.scrollHeight + 2) + 'px';
    ta.addEventListener('input', function() {
      this.style.height = 'auto';
      this.style.height = (this.scrollHeight + 2) + 'px';
    });
  });
  function toggleOmit(blockId, omit) {
    const el = document.getElementById(blockId);
    if (el) el.classList.toggle('ctt-omitted', omit);
  }
</script>
</body>
</html>
