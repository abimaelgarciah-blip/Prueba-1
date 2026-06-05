package com.rio.chequeo.controller;

import com.rio.chequeo.dao.MedicalRecordDAO;
import com.rio.chequeo.model.MedicalRecord;
import com.rio.chequeo.util.AppConstants;

import javax.servlet.ServletException;
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
 * Ubicado en el paquete {@code controller} para cumplir la especificación del proyecto.
 *
 * <p>La implementación canónica reside en
 * {@link com.rio.chequeo.servlet.SheetServlet}.
 * El archivo web.xml registra la clase {@code com.rio.chequeo.servlet.SheetServlet}.</p>
 *
 * <p>Mapeo de hoja a JSP:
 * <pre>
 *  1,2,3,4,6,8,10,12,14,16,18,20,23,25 → portada.jsp
 *  5  → sheets/hallazgos.jsp
 *  7  → sheets/sistemas.jsp
 *  9  → sheets/conclusiones.jsp
 *  11 → sheets/sugerencias.jsp
 *  13 → sheets/prueba-esfuerzo.jsp
 *  15 → sheets/espirometria.jsp
 *  17 → sheets/gabinete.jsp
 *  19 → sheets/oftalmologia.jsp
 *  21 → sheets/laboratorio.jsp
 *  22 → sheets/firma.jsp
 *  24 → sheets/audiometria.jsp
 *  26 → sheets/dental.jsp
 * </pre>
 * </p>
 */
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

        HttpSession session  = req.getSession(false);
        MedicalRecord record = (MedicalRecord) session.getAttribute(AppConstants.SESSION_PATIENT_KEY);
        if (record == null) {
            record = new MedicalRecord();
            session.setAttribute(AppConstants.SESSION_PATIENT_KEY, record);
        }

        req.setAttribute("sheetNumber", sheetNumber);
        req.setAttribute("record", record);
        req.setAttribute("sectionColors", AppConstants.SECTION_COLORS);

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

        // Mapear TODOS los campos del request al MedicalRecord
        saveFieldsFromRequest(req, record);

        // Persistir en Oracle
        try {
            medicalRecordDAO.save(record);
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error persistiendo hoja " + sheetNumber, e);
            sendJsonError(resp, "Error guardando hoja: " + e.getMessage());
            return;
        }

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
     * Delega al switch centralizado en {@link PatientServlet#applyField}.
     *
     * @param req    request con los parámetros del formulario de la hoja
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
     * Resuelve la ruta relativa del JSP para el número de hoja dado.
     *
     * @param sheet número de hoja (1-26)
     * @return ruta relativa a {@code /WEB-INF/views/}
     */
    private String resolveJsp(int sheet) {
        switch (sheet) {
            case 1: case 2: case 3: case 4:
            case 6: case 8: case 10: case 12:
            case 14: case 16: case 18: case 20:
            case 23: case 25:
                return "portada.jsp";
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
        if (param == null || param.isEmpty()) return 1;
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
