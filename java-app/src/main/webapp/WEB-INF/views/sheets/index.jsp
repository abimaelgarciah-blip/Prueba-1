<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%-- Índice de hojas: redirige a la primera hoja del expediente --%>
<%
    String patientId = request.getParameter("id");
    if (patientId == null || patientId.isEmpty()) {
        patientId = "nuevo";
    }
    response.sendRedirect(request.getContextPath() + "/sheet?sheet=1&patientId=" + patientId);
%>
