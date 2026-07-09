<%@ page contentType="text/html; charset=UTF-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!doctype html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>${empty record.patientName ? 'Nuevo paciente' : record.patientName} - Chequeo Médico</title>
  <link rel="stylesheet" href="${pageContext.request.contextPath}/css/styles.css?v=v2" />
</head>
<body>
<%@ include file="_nav.jspf" %>
<div id="main-area">
  <div id="patients-form-view">
    <div id="form-layout">
      <nav id="sidebar">
        <div id="sidebar-header">
          <a class="btn-back" href="${pageContext.request.contextPath}/patients">← Pacientes</a>
          <p id="patient-name-display">${empty record.patientName ? 'Sin paciente' : record.patientName}</p>
          <span id="autosave-dot" class="db-status db-connected">✓ guardado automático</span>
        </div>
        <div id="sidebar-db">
          <form method="post" action="${pageContext.request.contextPath}/patients/save">
            <input type="hidden" name="sheet" value="${currentSheetId}" />
            <button type="submit" class="btn-db btn-db-save">💾 Guardar en BD</button>
          </form>
          <c:if test="${not empty error}"><p class="login-error">${error}</p></c:if>
          <c:if test="${param.saved == '1'}"><p class="ctt-section-omit-note">✓ Expediente guardado.</p></c:if>
        </div>
        <ul id="sheet-nav">
          <li class="${currentSheetId == 'datos-generales' ? 'active' : ''}">
            <a href="?sheet=datos-generales">Datos Generales</a>
          </li>
          <c:forEach var="s" items="${sheets}">
            <li class="${currentSheetId == s.id ? 'active' : ''} ${(not empty s.section && omittedSections.contains(s.section)) ? 'nav-omitted' : ''}">
              <a href="?sheet=${s.id}">${s.label}</a>
            </li>
          </c:forEach>
        </ul>
        <div id="sidebar-actions">
          <a class="btn-action btn-action-primary" href="${pageContext.request.contextPath}/patients/export">📄 Exportar PDF completo</a>
        </div>
      </nav>

      <main id="main-content">
        <div id="sheet-container">

          <c:if test="${currentSheetId == 'datos-generales'}">
            <div class="sheet content-sheet"><div class="content-sheet-overlay"><div class="content-page-area">
              <h1 class="ctt-h1">DATOS GENERALES</h1>
              <div class="grid-2">
                <div class="form-group"><label>Nombre del paciente</label>
                  <input type="text" name="s1-patient" value="${record.data.get('s1-patient')}" /></div>
                <div class="form-group"><label>Número de expediente</label>
                  <input type="text" name="s1-id" value="${record.data.get('s1-id')}" /></div>
                <div class="form-group"><label>Fecha del estudio</label>
                  <input type="date" name="s1-date" value="${record.data.get('s1-date')}" /></div>
                <div class="form-group"><label>Clínica / empresa</label>
                  <input type="text" name="s1-clinic" value="${record.data.get('s1-clinic')}" /></div>
                <div class="form-group"><label>Sexo</label>
                  <select name="s1-sex">
                    <option value="">--</option>
                    <option value="Masculino" ${record.data.get('s1-sex') == 'Masculino' ? 'selected' : ''}>Masculino</option>
                    <option value="Femenino" ${record.data.get('s1-sex') == 'Femenino' ? 'selected' : ''}>Femenino</option>
                  </select></div>
                <div class="form-group"><label>Edad</label>
                  <input type="text" name="s1-age" value="${record.data.get('s1-age')}" /></div>
              </div>
            </div></div></div>
          </c:if>

          <c:if test="${currentSheetIsCover}">
            <div class="sheet cover-sheet-page">
              <div class="cover-page-inner">
                <c:choose>
                  <c:when test="${not empty coverImage}"><img src="${coverImage}" class="cover-full-img" /></c:when>
                  <c:otherwise><div class="cover-placeholder-big"><p>Sin imagen de portada (${currentSheet.label})</p></div></c:otherwise>
                </c:choose>
              </div>
              <input type="file" accept="image/*" data-cover-input="${currentSheet.coverKey}" />
              <c:if test="${not empty coverImage}"><button type="button" class="btn-cover-remove" data-cover-remove="${currentSheet.coverKey}">Quitar</button></c:if>
              <c:if test="${not empty currentSheet.section}">
                <div class="ctt-section-omit no-print">
                  <label class="ctt-omit">
                    <input type="checkbox" data-section-omit="${currentSheet.section}" ${omittedSections.contains(currentSheet.section) ? 'checked' : ''} />
                    <span>Omitir esta sección (${sectionLabels.get(currentSheet.section)}) — no incluir portada ni contenido en el PDF</span>
                  </label>
                </div>
              </c:if>
            </div>
          </c:if>

          <c:if test="${currentSheetIsContent}">
            <div class="sheet content-sheet" style="${not empty membreteImage ? 'background-image:url(\''.concat(membreteImage).concat('\')') : ''}">
              <div class="content-sheet-overlay">
                <div class="content-sheet-toolbar">
                  <strong>${currentSheet.label}</strong>
                  <input type="file" accept="image/*" data-membrete-input="${currentSheet.membreteKey}" title="Cambiar membrete" />
                </div>
                <div class="content-page-area">
                  ${sheetHtml}
                </div>
              </div>
            </div>
          </c:if>

          <c:if test="${currentSheetIsNutri}">
            <div class="nutri-panel">
              <h1 class="ctt-h1">EVALUACIÓN CORPORAL Y NUTRICIONAL</h1>
              <p class="nutri-aviso">Selecciona qué incluir para este paciente. Todo lo marcado se agrega al final del PDF al exportar.</p>
              <div class="nutri-card">
                <h3>Secciones del documento</h3>
                <ul class="nutri-list">
                  <c:forEach var="s" items="${nutriConfig.secciones}">
                    <c:set var="seccionesMap" value="${record.data.getRaw('nutri')['secciones']}" />
                    <li class="nutri-row">
                      <input type="checkbox" data-nutri-seccion="${s.id}"
                             ${empty seccionesMap || seccionesMap[s.id] != false ? 'checked' : ''} />
                      <label class="nutri-row-name">${s.nombre}</label>
                      <span class="nutri-badge">pág. ${s.paginas}</span>
                    </li>
                  </c:forEach>
                </ul>
              </div>
              <div class="nutri-card">
                <h3>Hoja de dieta</h3>
                <div class="form-group"><label>Calorías (kcal)</label>
                  <input type="text" data-nutri-field="kcal" value="${record.data.getRaw('nutri')['kcal']}" placeholder="ej. 1500" /></div>
                <div class="form-group"><label>Nombre en la hoja (vacío = nombre del paciente)</label>
                  <input type="text" data-nutri-field="nombre" value="${record.data.getRaw('nutri')['nombre']}" /></div>
              </div>
              <div class="nutri-card">
                <h3>Anexos y páginas adicionales</h3>
                <div class="form-group"><label>Anexos por número de página (ej. 9, 12-14)</label>
                  <input type="text" data-nutri-anexos value="" placeholder="9, 12-14" /></div>
                <div class="form-group"><label>Páginas adicionales de la plantilla</label>
                  <input type="text" data-nutri-field="extra" value="${record.data.getRaw('nutri')['extra']}" placeholder="ej. 5, 23-25" /></div>
              </div>
              <p class="nutri-aviso">Nota: ver FieldCatalog para el detalle completo de la clave única "nutri" (secciones, dieta, anexos, PDFs externos) y README-arquitectura.md para su estructura.</p>
            </div>
          </c:if>

        </div>
      </main>
    </div>
  </div>
</div>
<script>window.SHEET_FORM_URL = '${pageContext.request.contextPath}/patients/form?sheet=${currentSheetId}';</script>
<script src="${pageContext.request.contextPath}/js/sheet-form.js"></script>
</body>
</html>
