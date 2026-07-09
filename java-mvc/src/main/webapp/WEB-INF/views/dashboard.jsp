<%@ page contentType="text/html; charset=UTF-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!doctype html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>Dashboard - Chequeo Médico</title>
  <link rel="stylesheet" href="${pageContext.request.contextPath}/css/styles.css?v=v2" />
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
</head>
<body>
<%@ include file="_nav.jspf" %>
<div id="main-area">
  <div class="view-header">
    <div><h2>Dashboard</h2><p class="view-subtitle">Concentrado de información clínica</p></div>
    <form method="get" action="${pageContext.request.contextPath}/dashboard">
      <select name="clinic" onchange="this.form.submit()" style="padding:8px 14px;border-radius:7px;border:1.5px solid #dce3ec;font-size:0.88rem;">
        <option value="">Todas las clínicas</option>
        <c:forEach var="c" items="${clinics}">
          <option value="${c}" ${c == clinicFilter ? 'selected' : ''}>${c}</option>
        </c:forEach>
      </select>
    </form>
  </div>
  <div id="dashboard-stats">
    <div class="stats-grid">
      <div class="stat-card"><div class="stat-value">${total}</div><div class="stat-label">Total de pacientes</div></div>
      <div class="stat-card"><div class="stat-value">${thisMonth}</div><div class="stat-label">Este mes</div></div>
      <div class="stat-card"><div class="stat-value">${masculino}</div><div class="stat-label">Masculino</div></div>
      <div class="stat-card"><div class="stat-value">${femenino}</div><div class="stat-label">Femenino</div></div>
      <div class="stat-card"><div class="stat-value">${clinicsCount}</div><div class="stat-label">Clínicas</div></div>
    </div>
  </div>
  <div id="dashboard-charts">
    <div class="chart-card"><canvas id="chart-sistemas"></canvas></div>
    <div class="chart-card"><canvas id="chart-sexo"></canvas></div>
    <div class="chart-card"><canvas id="chart-tendencia"></canvas></div>
  </div>
  <div id="dashboard-table-section">
    <h3 style="margin-bottom:12px;color:#1e4d8c">Pacientes recientes</h3>
    <table class="dash-table">
      <thead><tr><th>Paciente</th><th>Sexo</th><th>Edad</th><th>Clínica</th><th>Fecha estudio</th><th>Acciones</th></tr></thead>
      <tbody>
        <c:forEach var="r" items="${recent}">
          <tr>
            <td><strong>${r.patientName}</strong></td>
            <td>${r.data.get('s1-sex')}</td>
            <td>${r.data.get('s1-age')}</td>
            <td>${r.clinic}</td>
            <td>${r.studyDate}</td>
            <td><a class="btn-secondary" style="font-size:0.78rem;padding:4px 10px" href="${pageContext.request.contextPath}/patients?action=open&id=${r.id}">Ver</a></td>
          </tr>
        </c:forEach>
      </tbody>
    </table>
  </div>
</div>
<script>
  const abnormalBySystem = ${abnormalBySystemJson};
  const monthTrend = ${monthTrendJson};
  new Chart(document.getElementById('chart-sistemas'), {
    type: 'bar',
    data: { labels: Object.keys(abnormalBySystem), datasets: [{ label: 'Pacientes con hallazgos anormales', data: Object.values(abnormalBySystem), backgroundColor: '#3b82f6', borderRadius: 6 }] },
    options: { responsive: true, plugins: { legend: { display: false }, title: { display: true, text: 'Hallazgos Anormales por Sistema', font: { size: 14 } } }, scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } } }
  });
  new Chart(document.getElementById('chart-sexo'), {
    type: 'doughnut',
    data: { labels: ['Masculino', 'Femenino'], datasets: [{ data: [${masculino}, ${femenino}], backgroundColor: ['#3b82f6', '#ec4899'], borderWidth: 2 }] },
    options: { responsive: true, plugins: { title: { display: true, text: 'Distribución por Sexo', font: { size: 14 } } } }
  });
  new Chart(document.getElementById('chart-tendencia'), {
    type: 'line',
    data: { labels: Object.keys(monthTrend), datasets: [{ label: 'Estudios realizados', data: Object.values(monthTrend), borderColor: '#1e4d8c', backgroundColor: 'rgba(30,77,140,0.1)', tension: 0.4, fill: true, pointRadius: 5 }] },
    options: { responsive: true, plugins: { title: { display: true, text: 'Tendencia Mensual', font: { size: 14 } } }, scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } } }
  });
</script>
</body>
</html>
