<%@ page contentType="text/html; charset=UTF-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>
<!doctype html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>Pacientes - Chequeo Médico</title>
  <link rel="stylesheet" href="${pageContext.request.contextPath}/css/styles.css?v=v2" />
</head>
<body>
<%@ include file="_nav.jspf" %>
<div id="main-area">
  <div id="view-patients" class="view-panel active-panel">
    <div id="patients-list-view">
      <div class="view-header">
        <div>
          <h2>Pacientes</h2>
          <p class="view-subtitle">Gestión de expedientes clínicos</p>
        </div>
        <a class="btn-primary" href="${pageContext.request.contextPath}/patients?action=new">＋ Nuevo Paciente</a>
      </div>
      <div id="patients-search-bar">
        <form method="get" action="${pageContext.request.contextPath}/patients">
          <input type="text" name="q" value="${query}" placeholder="🔍 Buscar por nombre, clínica o expediente..." />
        </form>
      </div>
      <div id="patients-grid">
        <c:if test="${empty patients}">
          <div class="empty-state">
            <p>No hay expedientes guardados</p>
            <a class="btn-primary" href="${pageContext.request.contextPath}/patients?action=new">＋ Crear primer paciente</a>
          </div>
        </c:if>
        <c:forEach var="p" items="${patients}">
          <div class="patient-card" onclick="location.href='${pageContext.request.contextPath}/patients?action=open&id=${p.id}'">
            <div class="patient-card-avatar">${fn:substring(p.patientName, 0, 1)}</div>
            <div class="patient-card-info">
              <strong>${empty p.patientName ? 'Sin nombre' : p.patientName}</strong>
              <span>${p.data.get('s1-age')} · ${p.data.get('s1-sex')}</span>
              <span>${empty p.clinic ? 'Sin clínica' : p.clinic}</span>
              <span class="patient-card-date">📅 ${p.studyDate}</span>
              <c:if test="${not empty p.patientId}"><span class="patient-card-id">Exp: ${p.patientId}</span></c:if>
            </div>
            <form method="get" action="${pageContext.request.contextPath}/patients" onclick="event.stopPropagation()"
                  onsubmit="return confirm('¿Eliminar el expediente de ${p.patientName}?')">
              <input type="hidden" name="action" value="delete" />
              <input type="hidden" name="id" value="${p.id}" />
              <button type="submit" class="patient-card-delete btn-remove">✕</button>
            </form>
          </div>
        </c:forEach>
      </div>
    </div>
  </div>
</div>
</body>
</html>
