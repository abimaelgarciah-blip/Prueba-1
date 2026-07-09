<%@ page contentType="text/html; charset=UTF-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!doctype html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Chequeo Médico</title>
  <link rel="stylesheet" href="${pageContext.request.contextPath}/css/styles.css?v=v2" />
</head>
<body>
  <div id="login-screen">
    <div id="login-card">
      <div id="login-logo">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#1e4d8c" stroke-width="1.8">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
        </svg>
        <h1>Chequeo Médico</h1>
        <p>Sistema de expedientes clínicos</p>
      </div>
      <form method="post" action="${pageContext.request.contextPath}/login">
        <div class="form-group">
          <label>Contraseña</label>
          <input type="password" name="password" placeholder="Ingresa tu contraseña" autofocus autocomplete="current-password" />
        </div>
        <c:if test="${not empty error}"><div class="login-error">${error}</div></c:if>
        <button type="submit" class="btn-primary" style="width:100%;padding:12px;font-size:1rem;">Entrar</button>
      </form>
    </div>
  </div>
</body>
</html>
