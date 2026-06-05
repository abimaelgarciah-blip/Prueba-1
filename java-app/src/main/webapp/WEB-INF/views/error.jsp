<%@ page contentType="text/html;charset=UTF-8" language="java"
         isErrorPage="true" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Error – RIO Chequeo Médico</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Segoe UI', Arial, sans-serif;
      background: linear-gradient(135deg, #0f1f3d 0%, #1e4d8c 100%);
      min-height: 100vh;
      display: flex; align-items: center; justify-content: center;
    }
    .error-card {
      background: #fff; border-radius: 16px; padding: 40px 36px;
      width: 100%; max-width: 440px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.35);
      text-align: center;
    }
    .error-icon { font-size: 3rem; margin-bottom: 16px; }
    h1 { font-size: 1.3rem; color: #b91c1c; margin-bottom: 10px; }
    .error-code {
      font-size: 0.78rem; font-weight: 700; letter-spacing: 1px;
      text-transform: uppercase; color: #888; margin-bottom: 14px;
    }
    .error-message {
      font-size: 0.92rem; color: #444; line-height: 1.6;
      margin-bottom: 24px;
    }
    .btn-back {
      background: #1e4d8c; color: #fff; border: none;
      padding: 10px 22px; border-radius: 7px;
      font-size: 0.92rem; font-weight: 600; cursor: pointer;
      text-decoration: none; display: inline-block;
      transition: background 0.18s;
    }
    .btn-back:hover { background: #163b6e; }
  </style>
</head>
<body>
  <div class="error-card">
    <div class="error-icon">
      <svg width="56" height="56" viewBox="0 0 24 24" fill="none"
           stroke="#b91c1c" stroke-width="1.7"
           stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
    </div>

    <div class="error-code">
      <c:choose>
        <c:when test="${not empty pageContext.errorData.statusCode}">
          Error ${pageContext.errorData.statusCode}
        </c:when>
        <c:otherwise>Error</c:otherwise>
      </c:choose>
    </div>

    <h1>
      <c:choose>
        <c:when test="${pageContext.errorData.statusCode == 404}">Página no encontrada</c:when>
        <c:when test="${pageContext.errorData.statusCode == 403}">Acceso denegado</c:when>
        <c:when test="${pageContext.errorData.statusCode == 500}">Error interno del servidor</c:when>
        <c:otherwise>Algo salió mal</c:otherwise>
      </c:choose>
    </h1>

    <p class="error-message">
      <c:choose>
        <c:when test="${not empty errorMessage}">${errorMessage}</c:when>
        <c:when test="${pageContext.errorData.statusCode == 404}">
          El recurso solicitado no existe o fue movido.
        </c:when>
        <c:when test="${pageContext.errorData.statusCode == 403}">
          No tienes permiso para acceder a esta página.
          Por favor inicia sesión.
        </c:when>
        <c:when test="${pageContext.errorData.statusCode == 500}">
          Ocurrió un error interno. Por favor intente más tarde o
          contacte al administrador del sistema.
        </c:when>
        <c:otherwise>
          Ocurrió un error inesperado. Por favor vuelve al inicio.
        </c:otherwise>
      </c:choose>
    </p>

    <a href="${pageContext.request.contextPath}/patients" class="btn-back">
      Volver al inicio
    </a>
  </div>
</body>
</html>
