<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%-- Incluible: coloca <link> CSS y renderiza el top-nav.
     El atributo de request "activeNav" indica cuál botón marcar:
       patients | doctors | dashboard | templates
     El atributo de request "currentPatientId" se usa para el botón PDF.
--%>
<link rel="stylesheet" href="${pageContext.request.contextPath}/css/styles.css" />

<header id="top-nav">
  <div id="nav-brand">
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
         stroke="#7ec8e3" stroke-width="2"
         stroke-linecap="round" stroke-linejoin="round">
      <circle cx="6"  cy="2.5" r="1"/>
      <circle cx="18" cy="2.5" r="1"/>
      <path d="M6 3.5v3.5M18 3.5v3.5"/>
      <path d="M6 7c0 2 2 3.5 6 3.5s6-1.5 6-3.5"/>
      <path d="M12 10.5c0 4 3 6.5 6 6.5"/>
      <circle cx="18" cy="20" r="2.5"/>
    </svg>
    <span>RIO - Chequeo Médico</span>
  </div>

  <nav id="nav-links">
    <a href="${pageContext.request.contextPath}/patients"
       class="nav-btn <c:if test="${activeNav == 'patients'}">active</c:if>">
      Pacientes
    </a>
    <a href="${pageContext.request.contextPath}/patients?view=doctors"
       class="nav-btn <c:if test="${activeNav == 'doctors'}">active</c:if>">
      Doctores
    </a>
    <a href="${pageContext.request.contextPath}/patients?view=dashboard"
       class="nav-btn <c:if test="${activeNav == 'dashboard'}">active</c:if>">
      Dashboard
    </a>
    <a href="${pageContext.request.contextPath}/patients?view=templates"
       class="nav-btn <c:if test="${activeNav == 'templates'}">active</c:if>">
      Plantillas
    </a>
  </nav>

  <div id="nav-right">
    <c:if test="${not empty currentPatientId}">
      <button class="btn-pdf"
              onclick="window.location='${pageContext.request.contextPath}/pdf?patientId=${currentPatientId}'">
        Exportar PDF
      </button>
    </c:if>
    <a href="${pageContext.request.contextPath}/logout" class="btn-logout">Cerrar sesión</a>
  </div>
</header>

<style>
  #top-nav {
    height: 56px; min-height: 56px;
    background: #1a2740;
    display: flex; align-items: center;
    padding: 0 20px; gap: 16px;
    border-bottom: 1px solid #2e3f5c;
    z-index: 100; flex-shrink: 0;
  }
  #nav-brand {
    display: flex; align-items: center; gap: 8px;
    color: #7ec8e3; font-weight: 700; font-size: 1rem;
    margin-right: 12px; white-space: nowrap; text-decoration: none;
  }
  #nav-links { display: flex; gap: 4px; flex: 1; }
  .nav-btn {
    background: transparent; border: none; color: #a0b8d0;
    padding: 7px 16px; border-radius: 7px; font-size: 0.85rem;
    font-weight: 600; cursor: pointer; transition: all 0.18s;
    text-decoration: none; display: inline-block;
  }
  .nav-btn:hover { background: #2e4a6e; color: #fff; }
  .nav-btn.active { background: #1e4d8c; color: #fff; }
  #nav-right {
    display: flex; align-items: center; gap: 12px; margin-left: auto;
  }
  .btn-pdf {
    background: #1e4d8c; color: #fff; border: none;
    padding: 6px 14px; border-radius: 7px; font-size: 0.8rem;
    font-weight: 600; cursor: pointer; transition: background 0.18s;
  }
  .btn-pdf:hover { background: #163b6e; }
  .btn-logout {
    background: #2e3f5c; color: #c0cfe0; border: none;
    padding: 6px 14px; border-radius: 7px; font-size: 0.8rem;
    font-weight: 600; cursor: pointer; transition: background 0.18s;
    text-decoration: none; display: inline-block;
  }
  .btn-logout:hover { background: #b91c1c; color: #fff; }
</style>
