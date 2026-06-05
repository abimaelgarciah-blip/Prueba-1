<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>
<%--
  HOJA 5 – Contenido Hallazgos
  Variables de request: record (MedicalRecord), activeSheet=5,
  currentPatientId, currentPatient
--%>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Hallazgos – RIO Chequeo Médico</title>
  <c:set var="activeNav" value="patients" scope="request" />
  <%@ include file="../layout/header.jsp" %>
</head>
<body>

<div id="form-layout">
  <%@ include file="../layout/sidebar.jsp" %>

  <main id="main-content">

    <%-- Toolbar azul con título + botón membrete --%>
    <div class="content-sheet-toolbar" style="background:#1a3d80;">
      <strong>Contenido Hallazgos</strong>
      <div class="membrete-control">
        <label class="btn-membrete" for="membrete5-input">
          🖼 ${not empty record.membrete5 ? 'Cambiar membrete' : 'Agregar imagen de membrete'}
        </label>
        <c:if test="${not empty record.membrete5}">
          <button type="button" class="btn-remove"
                  onclick="removeMembrete(5)">✕ Quitar membrete</button>
        </c:if>
        <input type="file" id="membrete5-input" style="display:none"
               accept="image/*" onchange="uploadMembrete(event, 5)" />
      </div>
    </div>

    <%-- Sheet wrapper con membrete de fondo --%>
    <div class="sheet content-sheet"
         id="sheet5-wrapper"
         style="
           <c:if test='${not empty record.membrete5}'>background-image:url('data:image/jpeg;base64,${record.membrete5}');</c:if>
           --section-color:#1a3d80;
           --section-color-bg:rgba(26,61,128,0.10);
           --section-color-border:rgba(26,61,128,0.32);
           --section-color-subtle:rgba(26,61,128,0.06);
         ">
      <div class="content-sheet-overlay">
        <div class="content-page-area">

          <form id="sheet5-form"
                action="${pageContext.request.contextPath}/sheet"
                method="post">
            <input type="hidden" name="sheet" value="5" />
            <input type="hidden" name="patientId" value="${currentPatientId}" />

            <%-- RESUMEN MÉDICO --%>
            <h1 class="ctt-h1">RESUMEN MÉDICO</h1>
            <p class="ctt-p">
              <select name="c5-sexo" class="ctt-inline" id="c5-sexo"
                      onchange="refreshSexConditionals()">
                <option value="">--</option>
                <option value="Masculino"
                        <c:if test="${record.c5Sexo == 'Masculino'}">selected</c:if>>Masculino</option>
                <option value="Femenino"
                        <c:if test="${record.c5Sexo == 'Femenino'}">selected</c:if>>Femenino</option>
              </select>
              de
              <input type="text" name="c5-edad" class="ctt-inline ctt-inline-sm"
                     placeholder="edad"
                     value="${not empty record.c5Edad ? record.c5Edad : ''}" />
              años de edad.
            </p>

            <%-- ANTECEDENTES HEREDO FAMILIARES --%>
            <h1 class="ctt-h1">ANTECEDENTES HEREDO FAMILIARES</h1>
            <p class="ctt-p">
              <strong class="ctt-sub-line">Refiere:</strong>
              <textarea name="c5-ahf" class="ctt-textarea"
                        placeholder="...">${not empty record.antecedentesHeredoFamiliares ? record.antecedentesHeredoFamiliares : ''}</textarea>
            </p>

            <%-- ANTECEDENTES NO PATOLÓGICOS --%>
            <h1 class="ctt-h1">ANTECEDENTES PERSONALES NO PATOLÓGICOS</h1>
            <p class="ctt-p"><strong class="ctt-sub-line">Originario de:</strong>
              <textarea name="c5-np-orig" class="ctt-textarea" placeholder="...">${not empty record.c5NpOrig ? record.c5NpOrig : ''}</textarea></p>
            <p class="ctt-p"><strong class="ctt-sub-line">Residente de:</strong>
              <textarea name="c5-np-resid" class="ctt-textarea" placeholder="...">${not empty record.c5NpResid ? record.c5NpResid : ''}</textarea></p>
            <p class="ctt-p"><strong class="ctt-sub-line">Bebidas alcohólicas refiere:</strong>
              <textarea name="c5-np-alc" class="ctt-textarea" placeholder="...">${not empty record.c5NpAlc ? record.c5NpAlc : ''}</textarea></p>
            <p class="ctt-p"><strong class="ctt-sub-line">Fumar refiere:</strong>
              <textarea name="c5-np-fum" class="ctt-textarea" placeholder="...">${not empty record.c5NpFum ? record.c5NpFum : ''}</textarea></p>
            <p class="ctt-p"><strong class="ctt-sub-line">Practicar deportes refiere:</strong>
              <textarea name="c5-np-dep" class="ctt-textarea" placeholder="...">${not empty record.c5NpDep ? record.c5NpDep : ''}</textarea></p>
            <p class="ctt-p"><strong class="ctt-sub-line">Problemas visuales refiere:</strong>
              <textarea name="c5-np-vis" class="ctt-textarea" placeholder="...">${not empty record.c5NpVis ? record.c5NpVis : ''}</textarea></p>
            <p class="ctt-p"><strong class="ctt-sub-line">Problemas auditivos refiere:</strong>
              <textarea name="c5-np-aud" class="ctt-textarea" placeholder="...">${not empty record.c5NpAud ? record.c5NpAud : ''}</textarea></p>
            <p class="ctt-p"><strong class="ctt-sub-line">Transfusiones refiere:</strong>
              <textarea name="c5-np-trans" class="ctt-textarea" placeholder="...">${not empty record.c5NpTrans ? record.c5NpTrans : ''}</textarea></p>
            <p class="ctt-p"><strong class="ctt-sub-line">Hospitalizaciones refiere:</strong>
              <textarea name="c5-np-hosp" class="ctt-textarea" placeholder="...">${not empty record.c5NpHosp ? record.c5NpHosp : ''}</textarea></p>
            <p class="ctt-p"><strong class="ctt-sub-line">Intervenciones quirúrgicas refiere:</strong>
              <textarea name="c5-np-cirug" class="ctt-textarea" placeholder="...">${not empty record.c5NpCirug ? record.c5NpCirug : ''}</textarea></p>
            <p class="ctt-p"><strong class="ctt-sub-line">Medicamentos refiere:</strong>
              <textarea name="c5-np-meds" class="ctt-textarea" placeholder="...">${not empty record.c5NpMeds ? record.c5NpMeds : ''}</textarea></p>
            <p class="ctt-p"><strong class="ctt-sub-line">Enfermedades infecciosas refiere:</strong>
              <textarea name="c5-np-infec" class="ctt-textarea" placeholder="...">${not empty record.c5NpInfec ? record.c5NpInfec : ''}</textarea></p>
            <p class="ctt-p"><strong class="ctt-sub-line">Alergias refiere:</strong>
              <textarea name="c5-np-alerg" class="ctt-textarea" placeholder="...">${not empty record.c5NpAlerg ? record.c5NpAlerg : ''}</textarea></p>
            <p class="ctt-p"><strong class="ctt-sub-line">Fracturas refiere:</strong>
              <textarea name="c5-np-fract" class="ctt-textarea" placeholder="...">${not empty record.c5NpFract ? record.c5NpFract : ''}</textarea></p>
            <p class="ctt-p"><strong class="ctt-sub-line">Grupo sanguíneo refiere:</strong>
              <textarea name="c5-np-grsang" class="ctt-textarea" placeholder="...">${not empty record.c5NpGrsang ? record.c5NpGrsang : ''}</textarea></p>
            <p class="ctt-p"><strong class="ctt-sub-line">Inmunizaciones refiere:</strong>
              <textarea name="c5-np-inmun" class="ctt-textarea" placeholder="...">${not empty record.c5NpInmun ? record.c5NpInmun : ''}</textarea></p>

            <%-- ANTECEDENTES PATOLÓGICOS --%>
            <h1 class="ctt-h1">ANTECEDENTES PERSONALES PATOLÓGICOS</h1>

            <%-- Masculino --%>
            <div class="ctt-conditional ctt-sex-M"
                 id="block-pp-prostata"
                 <c:if test="${record.c5Sexo != 'Masculino'}">style="display:none"</c:if>>
              <p class="ctt-p"><strong class="ctt-sub-line">Interrogatorio prostático:</strong>
                <textarea name="c5-pp-prostata" class="ctt-textarea"
                          placeholder="...">${not empty record.c5PpProstata ? record.c5PpProstata : ''}</textarea></p>
            </div>

            <%-- Femenino --%>
            <div class="ctt-conditional ctt-sex-F"
                 id="block-pp-gineco"
                 <c:if test="${record.c5Sexo != 'Femenino'}">style="display:none"</c:if>>
              <p class="ctt-p">
                <strong class="ctt-sub-line">Antecedentes gineco-obstétricos:</strong>
                Menarca a los
                <input type="text" name="c5-pp-menarca" class="ctt-inline ctt-inline-sm"
                       value="${not empty record.c5PpMenarca ? record.c5PpMenarca : ''}" /> años,
                gesta <input type="text" name="c5-pp-gesta" class="ctt-inline ctt-inline-sm"
                             value="${not empty record.c5PpGesta ? record.c5PpGesta : ''}" />,
                para <input type="text" name="c5-pp-para" class="ctt-inline ctt-inline-sm"
                            value="${not empty record.c5PpPara ? record.c5PpPara : ''}" />,
                aborto <input type="text" name="c5-pp-aborto" class="ctt-inline ctt-inline-sm"
                              value="${not empty record.c5PpAborto ? record.c5PpAborto : ''}" />,
                cesáreas <input type="text" name="c5-pp-cesareas" class="ctt-inline ctt-inline-sm"
                                value="${not empty record.c5PpCesareas ? record.c5PpCesareas : ''}" />.
                Lactancia: 1.º <input type="text" name="c5-pp-lact1" class="ctt-inline ctt-inline-sm"
                                       value="${not empty record.c5PpLact1 ? record.c5PpLact1 : ''}" /> meses,
                2.º <input type="text" name="c5-pp-lact2" class="ctt-inline ctt-inline-sm"
                            value="${not empty record.c5PpLact2 ? record.c5PpLact2 : ''}" /> meses,
                3.º <input type="text" name="c5-pp-lact3" class="ctt-inline ctt-inline-sm"
                            value="${not empty record.c5PpLact3 ? record.c5PpLact3 : ''}" /> meses.
                FUM <input type="text" name="c5-pp-fum2" class="ctt-inline"
                           value="${not empty record.c5PpFum2 ? record.c5PpFum2 : ''}" />
              </p>
            </div>

            <p class="ctt-p"><strong class="ctt-sub-line">Otros antecedentes:</strong>
              <textarea name="c5-pp-otros" class="ctt-textarea"
                        placeholder="...">${not empty record.c5PpOtros ? record.c5PpOtros : ''}</textarea></p>

            <%-- EXAMEN FÍSICO --%>
            <h1 class="ctt-h1">EXAMEN FÍSICO</h1>
            <p class="ctt-p">
              <strong class="ctt-sub-line">Signos vitales:</strong>
              T.A. <input type="text" name="c5-ef-ta" class="ctt-inline ctt-inline-sm"
                          value="${not empty record.c5EfTa ? record.c5EfTa : ''}" />
              F.C. <input type="text" name="c5-ef-fc" class="ctt-inline ctt-inline-sm"
                          value="${not empty record.c5EfFc ? record.c5EfFc : ''}" />
              Saturación: <input type="text" name="c5-ef-sat" class="ctt-inline ctt-inline-sm"
                                 value="${not empty record.c5EfSat ? record.c5EfSat : ''}" />
            </p>
            <p class="ctt-p">
              <strong class="ctt-sub-line">Antropometría:</strong>
              Peso <input type="text" name="c5-ef-peso" class="ctt-inline ctt-inline-sm"
                          value="${not empty record.c5EfPeso ? record.c5EfPeso : ''}" /> kg,
              talla <input type="text" name="c5-ef-talla" class="ctt-inline ctt-inline-sm"
                           value="${not empty record.c5EfTalla ? record.c5EfTalla : ''}" /> cm.
            </p>

            <%-- Textos de examen físico --%>
            <c:set var="efGeneral" value="${not empty record.efGeneral ? record.efGeneral : 'Paciente consciente, cooperador, cuya edad cronológica corresponde con la real. Su apariencia general es normal.'}" />
            <c:set var="efDerma"   value="${not empty record.efDerma   ? record.efDerma   : 'Exploración dermatológica: Sin alteraciones.'}" />
            <c:set var="efCraneo"  value="${not empty record.efCraneo  ? record.efCraneo  : 'Cráneo: Es normoencefalo, con cabello bien implantado, no tiene exóstosis, sin otras alteraciones.'}" />
            <c:set var="efOjos"    value="${not empty record.efOjos    ? record.efOjos    : 'Ojos: Con movimientos oculares, reflejos y fondoscopía normal, conjuntivas, escleróticas y párpados normales.'}" />
            <c:set var="efOidos"   value="${not empty record.efOidos   ? record.efOidos   : 'Oídos: Con pabellón auricular normal, el conducto auditivo externo es normal, la membrana timpánica está íntegra, la conducción aérea y ósea normal.'}" />
            <c:set var="efNariz"   value="${not empty record.efNariz   ? record.efNariz   : 'Nariz: Rectilínea, septum central, sin traumatismos presentes, mucosas normales, cornetes sin alteraciones.'}" />
            <c:set var="efBoca"    value="${not empty record.efBoca    ? record.efBoca    : 'Boca: Piezas dentales normales, lengua y mucosas normales, faringe sin alteraciones.'}" />
            <c:set var="efCuello"  value="${not empty record.efCuello  ? record.efCuello  : 'Cuello: Es cilíndrico, no presenta adenomegalias, la tiroides palpable normal, movimientos normales, pulsos presentes normales.'}" />
            <c:set var="efTorax"   value="${not empty record.efTorax   ? record.efTorax   : 'Tórax: Es normolíneo, con movimientos de amplexión y amplexación normales, los ruidos respiratorios sin fenómenos acústicos agregados, los ruidos cardíacos rítmicos sin frotes, ni soplos.'}" />
            <c:set var="efAbdomen" value="${not empty record.efAbdomen ? record.efAbdomen : 'Abdomen: Es plano, blando, depresible, no es doloroso, no tiene visceromegalias, no presenta masas, peristaltismo presente y área renal sin alteraciones.'}" />
            <c:set var="efGenit"   value="${not empty record.efGenit   ? record.efGenit   : 'Genitales: Sin alteraciones.'}" />
            <c:set var="efRectal"  value="${not empty record.efRectal  ? record.efRectal  : 'Examen rectal: No se realizó.'}" />
            <c:set var="efExtsup"  value="${not empty record.efExtsup  ? record.efExtsup  : 'Examen de extremidades superiores: Sin alteraciones.'}" />
            <c:set var="efExtinf"  value="${not empty record.efExtinf  ? record.efExtinf  : 'Examen de extremidades inferiores: Sin alteraciones.'}" />
            <c:set var="efNeuro"   value="${not empty record.efNeuro   ? record.efNeuro   : 'Examen neurológico: Orientación normal en 3 esferas, pares craneales normales, meningeos negativos, vestíbulos cerebelosos negativos, reflejos osteotendinosos normales, marcha normal, no tiene problemas de sensibilidad ni motilidad.'}" />

            <p class="ctt-p"><textarea name="ef-general" class="ctt-textarea">${efGeneral}</textarea></p>
            <p class="ctt-p"><textarea name="ef-derma"   class="ctt-textarea">${efDerma}</textarea></p>
            <p class="ctt-p"><textarea name="ef-craneo"  class="ctt-textarea">${efCraneo}</textarea></p>
            <p class="ctt-p"><textarea name="ef-ojos"    class="ctt-textarea">${efOjos}</textarea></p>
            <p class="ctt-p"><textarea name="ef-oidos"   class="ctt-textarea">${efOidos}</textarea></p>
            <p class="ctt-p"><textarea name="ef-nariz"   class="ctt-textarea">${efNariz}</textarea></p>
            <p class="ctt-p"><textarea name="ef-boca"    class="ctt-textarea">${efBoca}</textarea></p>
            <p class="ctt-p"><textarea name="ef-cuello"  class="ctt-textarea">${efCuello}</textarea></p>
            <p class="ctt-p"><textarea name="ef-torax"   class="ctt-textarea">${efTorax}</textarea></p>
            <p class="ctt-p"><textarea name="ef-abdomen" class="ctt-textarea">${efAbdomen}</textarea></p>
            <p class="ctt-p"><textarea name="ef-genit"   class="ctt-textarea">${efGenit}</textarea></p>
            <p class="ctt-p"><textarea name="ef-rectal"  class="ctt-textarea">${efRectal}</textarea></p>
            <p class="ctt-p"><textarea name="ef-extsup"  class="ctt-textarea">${efExtsup}</textarea></p>
            <p class="ctt-p"><textarea name="ef-extinf"  class="ctt-textarea">${efExtinf}</textarea></p>
            <p class="ctt-p"><textarea name="ef-neuro"   class="ctt-textarea">${efNeuro}</textarea></p>

            <div class="sheet-form-actions">
              <button type="submit" class="btn-save">Guardar</button>
            </div>

          </form>
        </div><%-- /content-page-area --%>
      </div><%-- /content-sheet-overlay --%>
    </div><%-- /sheet5-wrapper --%>

  </main>
</div><%-- /form-layout --%>

<div id="toast" class="toast" aria-live="polite"></div>

<%@ include file="../../css/sheet-styles.jsp" %>

<script src="${pageContext.request.contextPath}/js/form.js"></script>
<script>
  initSidebar(5);

  function refreshSexConditionals() {
    const sexo = document.getElementById('c5-sexo').value;
    document.getElementById('block-pp-prostata').style.display = (sexo === 'Masculino') ? '' : 'none';
    document.getElementById('block-pp-gineco').style.display   = (sexo === 'Femenino')  ? '' : 'none';
  }

  document.querySelectorAll('.ctt-textarea').forEach(ta => {
    ta.style.height = 'auto';
    ta.style.height = (ta.scrollHeight + 2) + 'px';
    ta.addEventListener('input', function() {
      this.style.height = 'auto';
      this.style.height = (this.scrollHeight + 2) + 'px';
    });
  });
</script>
</body>
</html>
