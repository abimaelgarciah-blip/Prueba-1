<%@ page contentType="text/html; charset=UTF-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!doctype html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>Doctores - Chequeo Médico</title>
  <link rel="stylesheet" href="${pageContext.request.contextPath}/css/styles.css?v=v2" />
</head>
<body>
<%@ include file="_nav.jspf" %>
<div id="main-area">
  <div class="view-header">
    <div><h2>Doctores</h2><p class="view-subtitle">Perfiles médicos y firmas digitales</p></div>
    <a class="btn-primary" href="?new=1">＋ Agregar Doctor</a>
  </div>

  <c:if test="${empty param.new && empty editing}">
    <div id="doctors-grid">
      <div class="doctors-grid-inner">
        <c:forEach var="d" items="${doctors}">
          <div class="doctor-card">
            <div class="doctor-card-avatar">
              <c:if test="${not empty d.signatureImage}"><img src="${d.signatureImage}" style="max-height:48px;max-width:80px;object-fit:contain;" /></c:if>
            </div>
            <div class="doctor-card-info">
              <strong>Dr. ${d.nombre}</strong>
              <span>${d.especialidad}</span>
              <span>${d.clinica}</span>
              <span style="color:#888;font-size:0.78rem;">Cédula: ${empty d.cedula ? '—' : d.cedula}</span>
            </div>
            <div class="doctor-card-actions">
              <a class="btn-secondary" style="font-size:0.78rem;padding:5px 10px" href="?edit=${d.id}">Editar</a>
              <form method="post" action="${pageContext.request.contextPath}/doctors" onsubmit="return confirm('¿Eliminar al Dr. ${d.nombre}?')">
                <input type="hidden" name="action" value="delete" /><input type="hidden" name="id" value="${d.id}" />
                <button type="submit" class="btn-remove">✕</button>
              </form>
            </div>
          </div>
        </c:forEach>
      </div>
    </div>
  </c:if>

  <c:if test="${not empty param.new || not empty editing}">
    <div class="section-card" style="max-width:720px;margin:0 auto;">
      <h3>${empty editing ? 'Nuevo Doctor' : 'Editar Doctor'}</h3>
      <c:if test="${not empty error}"><p class="login-error">${error}</p></c:if>
      <form method="post" action="${pageContext.request.contextPath}/doctors">
        <input type="hidden" name="id" value="${editing.id}" />
        <div class="grid-2">
          <div class="form-group"><label>Nombre completo</label><input type="text" name="nombre" value="${editing.nombre}" placeholder="Dr. Nombre Apellido" /></div>
          <div class="form-group"><label>Cédula Profesional</label><input type="text" name="cedula" value="${editing.cedula}" /></div>
          <div class="form-group"><label>Especialidad</label><input type="text" name="especialidad" value="${editing.especialidad}" /></div>
          <div class="form-group"><label>Institución / Clínica</label><input type="text" name="clinica" value="${editing.clinica}" /></div>
          <div class="form-group"><label>Teléfono</label><input type="text" name="telefono" value="${editing.telefono}" /></div>
          <div class="form-group"><label>Correo Electrónico</label><input type="text" name="email" value="${editing.email}" /></div>
        </div>
        <div class="form-group"><label>Dirección del consultorio</label><input type="text" name="direccion" value="${editing.direccion}" /></div>
        <div class="form-group">
          <label>Firma (imagen)</label>
          <input type="hidden" name="signatureData" value="${editing.signatureData}" />
          <input type="hidden" id="sig-image-field" name="signatureImage" value="${editing.signatureImage}" />
          <input type="file" accept="image/*" onchange="var r=new FileReader();r.onload=function(e){document.getElementById('sig-image-field').value=e.target.result;};r.readAsDataURL(this.files[0])" />
        </div>
        <div class="btn-row" style="margin-top:16px">
          <button type="submit" class="btn-primary">Guardar Doctor</button>
          <a class="btn-secondary" href="${pageContext.request.contextPath}/doctors">Cancelar</a>
        </div>
      </form>
    </div>
  </c:if>
</div>
</body>
</html>
