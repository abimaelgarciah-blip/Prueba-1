<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%--
  Sidebar incluible con las 26 hojas del expediente.
  Request attribute "activeSheet" (Integer 1-26) indica la hoja activa.
  Request attribute "currentPatientId" se usa para construir los links.
--%>

<%-- Lista de hojas: número → etiqueta --%>
<%
  String[][] SHEETS = {
    {"1",  "Portada Principal"},
    {"2",  "Portada 2"},
    {"3",  "Portada 3"},
    {"4",  "Portada 4"},
    {"5",  "Contenido Hallazgos"},
    {"6",  "Portada 6"},
    {"7",  "Contenido Sistemas"},
    {"8",  "Portada 8"},
    {"9",  "Contenido Conclusiones"},
    {"10", "Portada 10"},
    {"11", "Contenido Sugerencias"},
    {"12", "Portada 12"},
    {"13", "Contenido Prueba Esfuerzo"},
    {"14", "Portada 14"},
    {"15", "Contenido Espirometría"},
    {"16", "Portada 16"},
    {"17", "Contenido Gabinete"},
    {"18", "Portada 18"},
    {"19", "Contenido Oftalmología"},
    {"20", "Portada 20"},
    {"21", "Contenido Laboratorio"},
    {"22", "Firma del Doctor"},
    {"23", "Portada 23"},
    {"24", "Contenido Audiometría"},
    {"25", "Portada 25"},
    {"26", "Contenido Dental"}
  };
  request.setAttribute("sheetList", SHEETS);
  Integer activeSheetNum = (Integer) request.getAttribute("activeSheet");
  int active = (activeSheetNum != null) ? activeSheetNum : 1;
%>

<nav id="sidebar">
  <div id="sidebar-header">
    <a href="${pageContext.request.contextPath}/patients" class="btn-back">← Pacientes</a>
    <p id="patient-name-display">
      <c:choose>
        <c:when test="${not empty currentPatient}">${currentPatient.nombre}</c:when>
        <c:otherwise>Sin paciente</c:otherwise>
      </c:choose>
    </p>
  </div>

  <ul id="sheet-nav">
    <%
      for (String[] sheet : SHEETS) {
        int num = Integer.parseInt(sheet[0]);
        boolean isActive = (num == active);
        String cp = request.getContextPath();
        String patId = (String) request.getAttribute("currentPatientId");
        String href = cp + "/sheet?sheet=" + num
                    + (patId != null ? "&patientId=" + patId : "");
    %>
    <li class="sheet-nav-item <%= isActive ? "active" : "" %>">
      <a href="<%= href %>">
        <span class="sheet-nav-num"><%= sheet[0] %></span>
        <span class="sheet-nav-label"><%= sheet[1] %></span>
      </a>
    </li>
    <% } %>
  </ul>

  <div id="sidebar-actions">
    <c:if test="${not empty currentPatientId}">
      <a href="${pageContext.request.contextPath}/pdf?patientId=${currentPatientId}"
         class="btn-action btn-action-primary">Exportar PDF completo</a>
    </c:if>
  </div>
</nav>

<style>
  #sidebar {
    width: 220px; min-width: 220px;
    background: #1a2740;
    display: flex; flex-direction: column;
    height: 100%; overflow: hidden;
    border-right: 1px solid #2e3f5c;
  }
  #sidebar-header {
    padding: 14px 12px 10px;
    border-bottom: 1px solid #2e3f5c;
    flex-shrink: 0;
  }
  #sidebar-header p {
    color: #7ec8e3; font-size: 0.82rem; font-weight: 600;
    margin-top: 6px; white-space: nowrap; overflow: hidden;
    text-overflow: ellipsis;
  }
  .btn-back {
    background: #243450; color: #7ec8e3; border: none;
    padding: 5px 10px; border-radius: 6px; font-size: 0.78rem;
    font-weight: 600; cursor: pointer; text-decoration: none;
    display: inline-block; transition: background 0.18s;
  }
  .btn-back:hover { background: #1e4d8c; }

  #sheet-nav {
    list-style: none; overflow-y: auto; flex: 1;
    padding: 6px 0;
  }
  .sheet-nav-item a {
    display: flex; align-items: center; gap: 8px;
    padding: 7px 14px; text-decoration: none;
    color: #a0b8d0; font-size: 0.82rem;
    border-radius: 0; transition: background 0.15s, color 0.15s;
    border-left: 3px solid transparent;
  }
  .sheet-nav-item a:hover {
    background: #243450; color: #fff;
    border-left-color: #4a7cc7;
  }
  .sheet-nav-item.active a {
    background: #1e4d8c; color: #fff; font-weight: 600;
    border-left-color: #7ec8e3;
  }
  .sheet-nav-num {
    background: rgba(255,255,255,0.12); border-radius: 4px;
    padding: 1px 5px; font-size: 0.72rem; min-width: 22px;
    text-align: center; flex-shrink: 0;
  }
  .sheet-nav-item.active .sheet-nav-num {
    background: rgba(255,255,255,0.22);
  }
  .sheet-nav-label { flex: 1; }

  #sidebar-actions {
    padding: 10px 10px 14px;
    border-top: 1px solid #2e3f5c;
    flex-shrink: 0;
  }
  .btn-action {
    display: block; width: 100%; padding: 7px 10px;
    border-radius: 7px; border: none; font-size: 0.78rem;
    font-weight: 600; cursor: pointer; text-align: center;
    text-decoration: none; margin-bottom: 6px;
    background: #243450; color: #a0b8d0;
    transition: background 0.18s, color 0.18s;
  }
  .btn-action:hover { background: #2e4a6e; color: #fff; }
  .btn-action-primary { background: #1e4d8c; color: #fff; }
  .btn-action-primary:hover { background: #163b6e; }
</style>
