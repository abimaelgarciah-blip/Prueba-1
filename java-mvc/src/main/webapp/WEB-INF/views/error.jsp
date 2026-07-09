<%@ page contentType="text/html; charset=UTF-8" isErrorPage="true" %>
<!doctype html>
<html lang="es">
<head><meta charset="UTF-8" /><title>Error - Chequeo Médico</title><link rel="stylesheet" href="${pageContext.request.contextPath}/css/styles.css" /></head>
<body style="padding:40px;font-family:Arial,sans-serif;">
  <h1 style="color:#b00020">Ocurrió un error</h1>
  <p><%= exception != null ? exception.getMessage() : "Error desconocido." %></p>
  <p><a href="${pageContext.request.contextPath}/patients">← Volver a Pacientes</a></p>
</body>
</html>
