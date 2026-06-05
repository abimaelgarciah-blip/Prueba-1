package com.rio.chequeo.servlet;

import com.rio.chequeo.dao.MedicalRecordDAO;
import com.rio.chequeo.model.MedicalRecord;
import com.rio.chequeo.util.AppConstants;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Servlet de visualización y guardado de hojas del expediente médico.
 *
 * <p>Rutas:</p>
 * <ul>
 *   <li>GET  /sheet?sheet=N — Muestra la hoja N del expediente.</li>
 *   <li>POST /sheet?sheet=N — Guarda los campos de la hoja N y responde JSON.</li>
 * </ul>
 *
 * <p>Mapeo de hoja a JSP:
 * <pre>
 *  1,2,3,4,6,8,10,12,14,16,18,20,23,25 → portada.jsp
 *  5  → hallazgos.jsp
 *  7  → sistemas.jsp
 *  9  → conclusiones.jsp
 *  11 → sugerencias.jsp
 *  13 → prueba-esfuerzo.jsp
 *  15 → espirometria.jsp
 *  17 → gabinete.jsp
 *  19 → oftalmologia.jsp
 *  21 → laboratorio.jsp
 *  22 → firma.jsp
 *  24 → audiometria.jsp
 *  26 → dental.jsp
 * </pre>
 * </p>
 */
@WebServlet("/sheet")
public class SheetServlet extends HttpServlet {

    private static final long serialVersionUID = 1L;
    private static final Logger LOGGER = Logger.getLogger(SheetServlet.class.getName());

    private static final String VIEWS_BASE = "/WEB-INF/views/";

    private final MedicalRecordDAO medicalRecordDAO = new MedicalRecordDAO();

    // -------------------------------------------------------------------------
    // doGet
    // -------------------------------------------------------------------------

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        if (!isAuthenticated(req)) {
            resp.sendRedirect(req.getContextPath() + "/auth");
            return;
        }

        int sheetNumber = parseSheetParam(req);
        if (sheetNumber < 1 || sheetNumber > 26) {
            resp.sendError(HttpServletResponse.SC_BAD_REQUEST,
                    "Número de hoja inválido. Debe ser entre 1 y 26.");
            return;
        }

        // Cargar MedicalRecord de sesión
        HttpSession session  = req.getSession(false);
        MedicalRecord record = (MedicalRecord) session.getAttribute(AppConstants.SESSION_PATIENT_KEY);
        if (record == null) {
            record = new MedicalRecord();
            session.setAttribute(AppConstants.SESSION_PATIENT_KEY, record);
        }

        // Poner atributos en request
        req.setAttribute("sheetNumber", sheetNumber);
        req.setAttribute("record", record);
        req.setAttribute("sectionColors", AppConstants.SECTION_COLORS);

        // Forward al JSP correspondiente
        String jspPath = resolveJsp(sheetNumber);
        req.getRequestDispatcher(VIEWS_BASE + jspPath).forward(req, resp);
    }

    // -------------------------------------------------------------------------
    // doPost
    // -------------------------------------------------------------------------

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        req.setCharacterEncoding("UTF-8");

        if (!isAuthenticated(req)) {
            sendJsonError(resp, "Sesión expirada");
            return;
        }

        int sheetNumber = parseSheetParam(req);
        if (sheetNumber < 1 || sheetNumber > 26) {
            sendJsonError(resp, "Número de hoja inválido: " + sheetNumber);
            return;
        }

        HttpSession session  = req.getSession(false);
        MedicalRecord record = (MedicalRecord) session.getAttribute(AppConstants.SESSION_PATIENT_KEY);
        if (record == null) {
            record = new MedicalRecord();
            session.setAttribute(AppConstants.SESSION_PATIENT_KEY, record);
        }

        // Mapear campos del request al MedicalRecord
        saveFieldsFromRequest(req, record);

        // Persistir en Oracle
        try {
            medicalRecordDAO.save(record);
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error persistiendo hoja " + sheetNumber, e);
            sendJsonError(resp, "Error guardando hoja: " + e.getMessage());
            return;
        }

        // Responder JSON {ok:true, sheet:N}
        resp.setContentType("application/json;charset=UTF-8");
        resp.setStatus(HttpServletResponse.SC_OK);
        try (PrintWriter out = resp.getWriter()) {
            out.print("{\"ok\":true,\"sheet\":" + sheetNumber + "}");
        }
    }

    // -------------------------------------------------------------------------
    // saveFieldsFromRequest — mapeo completo campo → setter
    // -------------------------------------------------------------------------

    /**
     * Mapea TODOS los parámetros del request al {@link MedicalRecord} de sesión.
     * Itera el mapa de parámetros y aplica cada par (fieldName, value) mediante
     * un switch centralizado en {@link PatientServlet#applyField}.
     *
     * @param req    request con los parámetros del formulario
     * @param record expediente en sesión a actualizar
     */
    public static void saveFieldsFromRequest(HttpServletRequest req, MedicalRecord record) {
        for (String name : req.getParameterMap().keySet()) {
            String value = req.getParameter(name);
            if (value != null) {
                PatientServlet.applyField(name, value, record);
            }
        }
    }

    // -------------------------------------------------------------------------
    // Mapeo hoja → JSP
    // -------------------------------------------------------------------------

    /**
     * Resuelve la ruta del JSP para un número de hoja dado.
     *
     * @param sheet número de hoja (1-26)
     * @return ruta relativa a {@code /WEB-INF/views/}
     */
    private String resolveJsp(int sheet) {
        switch (sheet) {
            // Portadas
            case 1:  return "portada.jsp";
            case 2:  return "portada.jsp";
            case 3:  return "portada.jsp";
            case 4:  return "portada.jsp";
            case 6:  return "portada.jsp";
            case 8:  return "portada.jsp";
            case 10: return "portada.jsp";
            case 12: return "portada.jsp";
            case 14: return "portada.jsp";
            case 16: return "portada.jsp";
            case 18: return "portada.jsp";
            case 20: return "portada.jsp";
            case 23: return "portada.jsp";
            case 25: return "portada.jsp";
            // Hojas de contenido
            case 5:  return "sheets/hallazgos.jsp";
            case 7:  return "sheets/sistemas.jsp";
            case 9:  return "sheets/conclusiones.jsp";
            case 11: return "sheets/sugerencias.jsp";
            case 13: return "sheets/prueba-esfuerzo.jsp";
            case 15: return "sheets/espirometria.jsp";
            case 17: return "sheets/gabinete.jsp";
            case 19: return "sheets/oftalmologia.jsp";
            case 21: return "sheets/laboratorio.jsp";
            case 22: return "sheets/firma.jsp";
            case 24: return "sheets/audiometria.jsp";
            case 26: return "sheets/dental.jsp";
            default: return "portada.jsp";
        }
    }

    // -------------------------------------------------------------------------
    // Métodos auxiliares
    // -------------------------------------------------------------------------

    private int parseSheetParam(HttpServletRequest req) {
        String param = req.getParameter("sheet");
        if (param == null || param.isEmpty()) {
            return 1;
        }
        try {
            return Integer.parseInt(param.trim());
        } catch (NumberFormatException e) {
            return -1;
        }
    }

    private boolean isAuthenticated(HttpServletRequest req) {
        HttpSession session = req.getSession(false);
        return session != null && session.getAttribute(AppConstants.SESSION_USER_KEY) != null;
    }

    private void sendJsonError(HttpServletResponse resp, String message) throws IOException {
        resp.setContentType("application/json;charset=UTF-8");
        resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        String safe = message.replace("\"", "\\\"");
        try (PrintWriter out = resp.getWriter()) {
            out.print("{\"ok\":false,\"error\":\"" + safe + "\"}");
        }
    }
}
