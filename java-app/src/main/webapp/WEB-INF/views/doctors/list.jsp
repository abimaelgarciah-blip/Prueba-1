<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%-- Vista de gestión de doctores --%>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Doctores – RIO Chequeo Médico</title>
  <c:set var="activeNav" value="doctors" scope="request" />
  <%@ include file="../layout/header.jsp" %>
</head>
<body>

<div id="main-area" style="padding:28px;">

  <c:if test="${not empty errorMsg}">
    <div class="error-banner">${errorMsg}</div>
  </c:if>

  <div class="view-header">
    <div>
      <h2>Doctores</h2>
      <p class="view-subtitle">Perfiles médicos y firmas digitales</p>
    </div>
    <button class="btn-primary" onclick="showDoctorForm()">＋ Agregar Doctor</button>
  </div>

  <!-- Grid de doctores -->
  <div id="doctors-grid">
    <c:choose>
      <c:when test="${empty doctors}">
        <p style="color:#888;font-size:0.95rem;">No hay doctores registrados aún.</p>
      </c:when>
      <c:otherwise>
        <c:forEach var="doc" items="${doctors}">
          <div class="doctor-card">
            <div class="doctor-card-name">${doc.nombre}</div>
            <div class="doctor-card-info">${doc.especialidad}</div>
            <div class="doctor-card-info">${doc.clinica}</div>
            <c:if test="${not empty doc.cedula}">
              <div class="doctor-card-cedula">Cédula: ${doc.cedula}</div>
            </c:if>
            <c:if test="${not empty doc.telefono}">
              <div class="doctor-card-info">${doc.telefono}</div>
            </c:if>
            <c:if test="${doc.firmaImagen != null}">
              <div class="doctor-card-firma">
                <img src="${pageContext.request.contextPath}/doctors/firma?id=${doc.id}"
                     alt="Firma" style="max-height:60px;border:1px solid #dce3ec;border-radius:4px;padding:3px;" />
              </div>
            </c:if>
            <div class="doctor-card-actions">
              <button class="btn-secondary btn-sm"
                      onclick="editDoctor(${doc.id}, '${doc.nombre}', '${doc.cedula}',
                               '${doc.especialidad}', '${doc.clinica}', '${doc.telefono}',
                               '${doc.email}', '${doc.direccion}')">Editar</button>
              <button class="btn-danger btn-sm"
                      onclick="deleteDoctor(${doc.id})">Eliminar</button>
            </div>
          </div>
        </c:forEach>
      </c:otherwise>
    </c:choose>
  </div>

  <!-- Formulario de doctor (oculto por defecto) -->
  <div id="doctor-form-panel" style="display:none;margin-top:24px;">
    <div class="section-card" style="max-width:720px;margin:0 auto;">
      <h3 id="doctor-form-title">Nuevo Doctor</h3>
      <form id="doctor-form"
            action="${pageContext.request.contextPath}/doctors"
            method="post"
            enctype="multipart/form-data">
        <input type="hidden" name="id" id="df-id" value="" />
        <div class="grid-2">
          <div class="form-group">
            <label>Nombre completo</label>
            <input type="text" name="nombre" id="df-nombre" placeholder="Dr. Nombre Apellido" />
          </div>
          <div class="form-group">
            <label>Cédula Profesional</label>
            <input type="text" name="cedula" id="df-cedula" placeholder="Número de cédula" />
          </div>
          <div class="form-group">
            <label>Especialidad</label>
            <input type="text" name="especialidad" id="df-especialidad" placeholder="Ej. Medicina Interna" />
          </div>
          <div class="form-group">
            <label>Institución / Clínica</label>
            <input type="text" name="clinica" id="df-clinica" placeholder="Nombre de la institución" />
          </div>
          <div class="form-group">
            <label>Teléfono</label>
            <input type="text" name="telefono" id="df-telefono" placeholder="+52 55 1234 5678" />
          </div>
          <div class="form-group">
            <label>Correo Electrónico</label>
            <input type="text" name="email" id="df-email" placeholder="doctor@clinica.com" />
          </div>
        </div>
        <div class="form-group">
          <label>Dirección del consultorio</label>
          <input type="text" name="direccion" id="df-direccion" placeholder="Calle, número, colonia, ciudad" />
        </div>
        <div class="form-group" style="margin-top:8px;">
          <label>Imagen de firma</label>
          <label class="btn-secondary" for="df-firma-input" style="cursor:pointer;display:inline-block;">
            📎 Subir imagen de firma
          </label>
          <input type="file" id="df-firma-input" name="firma"
                 accept="image/*" style="display:none"
                 onchange="previewFirma(event)" />
          <div id="df-firma-preview" style="margin-top:8px;"></div>
        </div>
        <div class="btn-row" style="margin-top:16px;">
          <button type="submit" class="btn-primary">Guardar Doctor</button>
          <button type="button" class="btn-secondary" onclick="hideDoctorForm()">Cancelar</button>
        </div>
      </form>
    </div>
  </div>
</div>

<div id="toast" class="toast" aria-live="polite"></div>

<script>
  function showDoctorForm() {
    document.getElementById('doctor-form-panel').style.display = 'block';
    document.getElementById('doctor-form-title').textContent = 'Nuevo Doctor';
    document.getElementById('doctor-form').reset();
    document.getElementById('df-id').value = '';
    document.getElementById('df-firma-preview').innerHTML = '';
    document.getElementById('doctor-form-panel').scrollIntoView({ behavior: 'smooth' });
  }

  function hideDoctorForm() {
    document.getElementById('doctor-form-panel').style.display = 'none';
  }

  function editDoctor(id, nombre, cedula, especialidad, clinica, telefono, email, direccion) {
    document.getElementById('doctor-form-title').textContent = 'Editar Doctor';
    document.getElementById('df-id').value = id;
    document.getElementById('df-nombre').value = nombre;
    document.getElementById('df-cedula').value = cedula;
    document.getElementById('df-especialidad').value = especialidad;
    document.getElementById('df-clinica').value = clinica;
    document.getElementById('df-telefono').value = telefono;
    document.getElementById('df-email').value = email;
    document.getElementById('df-direccion').value = direccion;
    document.getElementById('doctor-form-panel').style.display = 'block';
    document.getElementById('doctor-form-panel').scrollIntoView({ behavior: 'smooth' });
  }

  function deleteDoctor(id) {
    if (!confirm('¿Eliminar este doctor?')) return;
    fetch('${pageContext.request.contextPath}/doctors?id=' + id, {
      method: 'DELETE',
      headers: { 'X-Requested-With': 'XMLHttpRequest' }
    })
    .then(r => r.json())
    .then(data => {
      if (data.ok) location.reload();
      else alert('Error: ' + data.error);
    })
    .catch(() => alert('Error de red'));
  }

  function previewFirma(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      document.getElementById('df-firma-preview').innerHTML =
        '<img src="' + ev.target.result + '" style="max-height:80px;border:1px solid #dce3ec;border-radius:6px;padding:4px;" />';
    };
    reader.readAsDataURL(file);
  }

  function showToast(msg) {
    const t = document.getElementById('toast');
    if (t) { t.textContent = msg; t.classList.add('show'); setTimeout(() => t.classList.remove('show'), 2500); }
  }
</script>
</body>
</html>
