package com.rio.chequeo.servlet;

import com.rio.chequeo.dao.MedicalRecordDAO;
import com.rio.chequeo.dao.PatientDAO;
import com.rio.chequeo.model.MedicalRecord;
import com.rio.chequeo.model.Patient;
import com.rio.chequeo.service.PDFService;
import com.rio.chequeo.service.PDFService.SheetData;
import com.rio.chequeo.util.AppConstants;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Servlet de generación de PDF para el expediente de chequeo médico.
 *
 * <ul>
 *   <li>GET /pdf?patientId=N — Genera y descarga el PDF completo del expediente.</li>
 *   <li>GET /pdf?preview=N   — Genera solo la hoja N para preview en iframe (inline).</li>
 * </ul>
 */
@WebServlet("/pdf")
public class PDFServlet extends HttpServlet {

    private static final long serialVersionUID = 1L;
    private static final Logger LOGGER = Logger.getLogger(PDFServlet.class.getName());

    private final PDFService       pdfService       = new PDFService();
    private final PatientDAO       patientDAO       = new PatientDAO();
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

        String patientIdParam = req.getParameter("patientId");
        String previewParam   = req.getParameter("preview");

        if (previewParam != null && !previewParam.isEmpty()) {
            handlePreview(req, resp, previewParam.trim());
        } else if (patientIdParam != null && !patientIdParam.isEmpty()) {
            handleFullPdf(req, resp, patientIdParam.trim());
        } else {
            resp.sendError(HttpServletResponse.SC_BAD_REQUEST,
                    "Se requiere el parámetro patientId o preview");
        }
    }

    // -------------------------------------------------------------------------
    // PDF completo
    // -------------------------------------------------------------------------

    /**
     * Genera el PDF completo del expediente de un paciente y lo envía como descarga.
     */
    private void handleFullPdf(HttpServletRequest req, HttpServletResponse resp, String patientIdStr)
            throws ServletException, IOException {

        long patientId;
        try {
            patientId = Long.parseLong(patientIdStr);
        } catch (NumberFormatException e) {
            resp.sendError(HttpServletResponse.SC_BAD_REQUEST, "patientId inválido: " + patientIdStr);
            return;
        }

        // Cargar paciente y expediente desde Oracle
        Patient patient;
        MedicalRecord record;
        try {
            patient = patientDAO.findById(patientId);
            if (patient == null) {
                resp.sendError(HttpServletResponse.SC_NOT_FOUND, "Paciente no encontrado: " + patientId);
                return;
            }
            record = medicalRecordDAO.findByPatientId(patientId);
            if (record == null) {
                record = new MedicalRecord();
                record.setPatientId(patientId);
            }
            patient.setExpediente(record);
        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "Error cargando expediente para PDF. patientId=" + patientId, e);
            resp.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
                    "Error cargando expediente: " + e.getMessage());
            return;
        }

        // Construir la lista de SheetData (26 hojas en orden)
        List<SheetData> sheets = buildSheetDataList(req, resp, record);
        if (sheets == null) {
            // Error ya reportado dentro de buildSheetDataList
            return;
        }

        // Generar PDF
        byte[] pdfBytes;
        try {
            pdfBytes = pdfService.generateFullPDF(sheets);
        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "Error generando PDF completo para patientId=" + patientId, e);
            resp.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
                    "Error generando PDF: " + e.getMessage());
            return;
        }

        // Nombre de archivo: chequeo-{nombre}-{fecha}.pdf
        String nombre = sanitizeFilename(patient.getNombre());
        String fecha  = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
        String filename = "chequeo-" + nombre + "-" + fecha + ".pdf";

        // Enviar respuesta
        resp.setContentType("application/pdf");
        resp.setHeader("Content-Disposition", "attachment; filename=\"" + filename + "\"");
        resp.setContentLength(pdfBytes.length);
        try (OutputStream out = resp.getOutputStream()) {
            out.write(pdfBytes);
        }
    }

    // -------------------------------------------------------------------------
    // Preview de una hoja
    // -------------------------------------------------------------------------

    /**
     * Genera solo la hoja indicada como PDF y la devuelve inline para preview en iframe.
     */
    private void handlePreview(HttpServletRequest req, HttpServletResponse resp, String previewStr)
            throws ServletException, IOException {

        int sheetNumber;
        try {
            sheetNumber = Integer.parseInt(previewStr);
        } catch (NumberFormatException e) {
            resp.sendError(HttpServletResponse.SC_BAD_REQUEST, "preview inválido: " + previewStr);
            return;
        }

        if (sheetNumber < 1 || sheetNumber > 26) {
            resp.sendError(HttpServletResponse.SC_BAD_REQUEST,
                    "preview debe ser entre 1 y 26");
            return;
        }

        // Obtener el expediente de la sesión
        HttpSession session  = req.getSession(false);
        MedicalRecord record = null;
        if (session != null) {
            record = (MedicalRecord) session.getAttribute(AppConstants.SESSION_PATIENT_KEY);
        }
        if (record == null) {
            record = new MedicalRecord();
        }

        byte[] pdfBytes;
        try {
            SheetData sheetData = buildSingleSheetData(req, resp, sheetNumber, record);
            if (sheetData == null) {
                return;
            }

            if ("cover".equals(sheetData.type)) {
                pdfBytes = pdfService.generateCoverPagePDF(sheetData.coverImage);
            } else {
                pdfBytes = pdfService.generateSheetPDF(sheetData.htmlContent, sheetData.membreteImage);
            }
        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "Error generando preview de hoja " + sheetNumber, e);
            resp.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
                    "Error generando preview: " + e.getMessage());
            return;
        }

        // Enviar inline
        resp.setContentType("application/pdf");
        resp.setHeader("Content-Disposition", "inline; filename=\"preview-sheet-" + sheetNumber + ".pdf\"");
        resp.setContentLength(pdfBytes.length);
        try (OutputStream out = resp.getOutputStream()) {
            out.write(pdfBytes);
        }
    }

    // -------------------------------------------------------------------------
    // Construcción de SheetData
    // -------------------------------------------------------------------------

    /**
     * Construye la lista completa de SheetData para las 26 hojas del expediente.
     * Para cada portada usa la imagen BLOB del MedicalRecord.
     * Para cada hoja de contenido renderiza el JSP correspondiente a String.
     *
     * @return lista de SheetData o {@code null} si ocurre un error irrecuperable
     */
    private List<SheetData> buildSheetDataList(HttpServletRequest req, HttpServletResponse resp,
                                                MedicalRecord record)
            throws ServletException, IOException {

        List<SheetData> sheets = new ArrayList<>();

        for (int i = 1; i <= 26; i++) {
            SheetData sd = buildSingleSheetData(req, resp, i, record);
            if (sd == null) {
                return null;
            }
            sheets.add(sd);
        }
        return sheets;
    }

    /**
     * Construye el {@link SheetData} para una sola hoja.
     */
    private SheetData buildSingleSheetData(HttpServletRequest req, HttpServletResponse resp,
                                            int sheetNumber, MedicalRecord record)
            throws ServletException, IOException {

        SheetData sd = new SheetData();

        if (isCoverSheet(sheetNumber)) {
            sd.type       = "cover";
            sd.coverImage = getCoverImage(sheetNumber, record);
        } else {
            sd.type          = "content";
            sd.membreteImage = getMembreteImage(sheetNumber, record);

            // Renderizar el JSP de contenido a String HTML
            String jspPath   = resolveJsp(sheetNumber);
            req.setAttribute("record", record);
            req.setAttribute("sheetNumber", sheetNumber);
            req.setAttribute("sectionColors", AppConstants.SECTION_COLORS);

            String html = renderJspToString(req, resp, "/WEB-INF/views/" + jspPath);
            if (html == null) {
                LOGGER.warning("No se pudo renderizar JSP para hoja " + sheetNumber);
                html = "<html><body><p>Hoja " + sheetNumber + "</p></body></html>";
            }
            sd.htmlContent = html;
        }

        return sd;
    }

    /**
     * Renderiza un JSP a String capturando su salida.
     * Usa un {@link ResponseWrapper} para interceptar el writer.
     *
     * @param req     request original
     * @param resp    response original
     * @param jspPath ruta del JSP relativa al context root (ej. /WEB-INF/views/sheets/hallazgos.jsp)
     * @return HTML renderizado o {@code null} si falla
     */
    private String renderJspToString(HttpServletRequest req, HttpServletResponse resp, String jspPath)
            throws ServletException, IOException {

        StringWriter sw = new StringWriter();
        ResponseWrapper wrapper = new ResponseWrapper(resp, sw);

        RequestDispatcher rd = req.getRequestDispatcher(jspPath);
        if (rd == null) {
            LOGGER.warning("RequestDispatcher null para: " + jspPath);
            return null;
        }
        rd.include(req, wrapper);
        wrapper.getWriter().flush();
        return sw.toString();
    }

    // -------------------------------------------------------------------------
    // Mapeo hoja → tipo y recursos
    // -------------------------------------------------------------------------

    private boolean isCoverSheet(int sheet) {
        switch (sheet) {
            case 1: case 2: case 3: case 4:
            case 6: case 8: case 10: case 12:
            case 14: case 16: case 18: case 20:
            case 23: case 25:
                return true;
            default:
                return false;
        }
    }

    private String resolveJsp(int sheet) {
        switch (sheet) {
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

    private byte[] getCoverImage(int sheet, MedicalRecord r) {
        switch (sheet) {
            case 1:  return r.getPortadaPrincipal();
            case 2:  return r.getPortadaObjetivos();
            case 3:  return r.getPortadaIntroduccion();
            case 4:  return r.getPortadaHallazgos();
            case 6:  return r.getPortadaSistemas();
            case 8:  return r.getPortadaConclusiones();
            case 10: return r.getPortadaSugerencias();
            case 12: return r.getPortadaEsfuerzo();
            case 14: return r.getPortadaEspirometria();
            case 16: return r.getPortadaGabinete();
            case 18: return r.getPortadaOftalmologia();
            case 20: return r.getPortadaLaboratorio();
            case 23: return r.getPortadaAudiometria();
            case 25: return r.getPortadaDental();
            default: return null;
        }
    }

    private byte[] getMembreteImage(int sheet, MedicalRecord r) {
        switch (sheet) {
            case 5:  return r.getMembrete5();
            case 7:  return r.getMembrete7();
            case 9:  return r.getMembrete9();
            case 11: return r.getMembrete11();
            case 13: return r.getMembrete13();
            case 15: return r.getMembrete15();
            case 17: return r.getMembrete17();
            case 19: return r.getMembrete19();
            case 21: return r.getMembrete21();
            case 22: return r.getMembrete21(); // Firma usa mismo membrete que lab
            case 24: return r.getMembrete24();
            case 26: return r.getMembrete26();
            default: return null;
        }
    }

    // -------------------------------------------------------------------------
    // Métodos auxiliares
    // -------------------------------------------------------------------------

    private boolean isAuthenticated(HttpServletRequest req) {
        HttpSession session = req.getSession(false);
        return session != null && session.getAttribute(AppConstants.SESSION_USER_KEY) != null;
    }

    /**
     * Sanitiza el nombre del paciente para usarlo como nombre de archivo.
     * Reemplaza caracteres no alfanuméricos por guiones.
     */
    private String sanitizeFilename(String name) {
        if (name == null || name.isEmpty()) {
            return "paciente";
        }
        return name.trim()
                   .replaceAll("[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]", "-")
                   .replaceAll("-{2,}", "-")
                   .replaceAll("^-|-$", "");
    }

    // -------------------------------------------------------------------------
    // ResponseWrapper para capturar la salida del JSP
    // -------------------------------------------------------------------------

    /**
     * Wrapper de {@link HttpServletResponse} que redirige la salida del escritor
     * a un {@link StringWriter} en memoria, permitiendo capturar el HTML generado
     * por un JSP incluido con {@link RequestDispatcher#include}.
     */
    private static final class ResponseWrapper extends javax.servlet.http.HttpServletResponseWrapper {

        private final StringWriter stringWriter;
        private final PrintWriter  printWriter;

        ResponseWrapper(HttpServletResponse response, StringWriter stringWriter) {
            super(response);
            this.stringWriter = stringWriter;
            this.printWriter  = new PrintWriter(stringWriter);
        }

        @Override
        public PrintWriter getWriter() {
            return printWriter;
        }

        @Override
        public javax.servlet.ServletOutputStream getOutputStream() {
            // No usado en este contexto; JSP usa getWriter()
            throw new UnsupportedOperationException(
                    "ResponseWrapper no soporta getOutputStream() — use getWriter()");
        }

        @Override
        public void setContentType(String type) {
            // Ignorar: el content-type ya está establecido en la respuesta PDF
        }

        @Override
        public void setCharacterEncoding(String encoding) {
            // Ignorar
        }
    }
}
