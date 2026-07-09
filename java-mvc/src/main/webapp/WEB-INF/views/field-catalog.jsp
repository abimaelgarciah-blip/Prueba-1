<%@ page contentType="text/html; charset=UTF-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!doctype html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>Campos del PDF - Chequeo Médico</title>
  <link rel="stylesheet" href="${pageContext.request.contextPath}/css/styles.css?v=v2" />
  <style>
    table.field-table { width:100%; border-collapse: collapse; font-size: 0.85rem; }
    table.field-table th, table.field-table td { border: 1px solid #dce3ec; padding: 6px 10px; text-align: left; }
    table.field-table th { background: #f4f7fb; position: sticky; top: 0; }
    table.field-table code { background: #f0f4fa; padding: 1px 5px; border-radius: 4px; }
  </style>
</head>
<body>
<%@ include file="_nav.jspf" %>
<div id="main-area">
  <div class="view-header">
    <div>
      <h2>Campos del PDF</h2>
      <p class="view-subtitle">Cada fila es un id de campo. Para mapear tu base de datos, escribe el valor con
        <code>record.getData().set(id, valor)</code> antes de exportar el PDF (ver PdfExportService).</p>
    </div>
  </div>
  <table class="field-table">
    <thead><tr><th>Hoja</th><th>Id de campo</th></tr></thead>
    <tbody>
      <c:forEach var="e" items="${entries}">
        <tr><td>${e.sheetLabel}</td><td><code>${e.fieldId}</code></td></tr>
      </c:forEach>
    </tbody>
  </table>
</div>
</body>
</html>
