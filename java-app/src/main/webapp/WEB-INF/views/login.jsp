<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>RIO - Chequeo Médico</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Segoe UI', Arial, sans-serif;
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #0f1f3d 0%, #1e4d8c 100%);
    }

    #login-card {
      background: #fff;
      border-radius: 16px;
      padding: 40px 36px;
      width: 100%;
      max-width: 380px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.35);
    }

    #login-logo {
      text-align: center;
      margin-bottom: 28px;
    }
    #login-logo h1 {
      font-size: 1.4rem;
      font-weight: 700;
      color: #1e4d8c;
      margin-top: 10px;
    }
    #login-logo p {
      color: #888;
      font-size: 0.85rem;
      margin-top: 4px;
    }

    .form-group { margin-bottom: 18px; }
    .form-group label {
      display: block;
      font-weight: 600;
      font-size: 0.85rem;
      color: #34495e;
      margin-bottom: 6px;
      text-transform: uppercase;
      letter-spacing: 0.4px;
    }
    .form-group input[type="password"] {
      width: 100%;
      padding: 9px 12px;
      border: 1.5px solid #dce3ec;
      border-radius: 6px;
      font-size: 0.92rem;
      background: #fafbfc;
      transition: border-color 0.18s;
      color: #222;
    }
    .form-group input[type="password"]:focus {
      outline: none;
      border-color: #1e4d8c;
      background: #fff;
    }

    .login-error {
      background: #fee2e2;
      color: #b91c1c;
      border-radius: 7px;
      padding: 8px 12px;
      font-size: 0.84rem;
      margin-bottom: 12px;
    }

    .btn-primary {
      background: #1e4d8c;
      color: #fff;
      border: none;
      padding: 12px 20px;
      border-radius: 7px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      width: 100%;
      transition: background 0.18s;
    }
    .btn-primary:hover { background: #163b6e; }
  </style>
</head>
<body>

  <div id="login-card">
    <div id="login-logo">
      <!-- Ícono estetoscopio -->
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none"
           stroke="#1e4d8c" stroke-width="1.8"
           stroke-linecap="round" stroke-linejoin="round">
        <circle cx="6" cy="2.5" r="1"/>
        <circle cx="18" cy="2.5" r="1"/>
        <path d="M6 3.5v3.5M18 3.5v3.5"/>
        <path d="M6 7c0 2 2 3.5 6 3.5s6-1.5 6-3.5"/>
        <path d="M12 10.5c0 4 3 6.5 6 6.5"/>
        <circle cx="18" cy="20" r="2.5"/>
      </svg>
      <h1>RIO - Chequeo Médico</h1>
      <p>Sistema de expedientes clínicos</p>
    </div>

    <form method="post" action="${pageContext.request.contextPath}/auth">
      <div class="form-group">
        <label>Contraseña</label>
        <input type="password" name="password"
               placeholder="Ingresa tu contraseña" autofocus />
      </div>

      <c:if test="${not empty loginError}">
        <div class="login-error">${loginError}</div>
      </c:if>

      <button type="submit" class="btn-primary">Iniciar sesión</button>
    </form>
  </div>

</body>
</html>
