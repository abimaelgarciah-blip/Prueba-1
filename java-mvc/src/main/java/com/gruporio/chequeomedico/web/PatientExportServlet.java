package com.gruporio.chequeomedico.web;

import com.gruporio.chequeomedico.dao.AppDefaultsDao;
import com.gruporio.chequeomedico.model.MedicalRecord;
import com.gruporio.chequeomedico.service.pdf.PdfExportService;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.nio.file.Paths;
import java.sql.SQLException;
import java.util.Map;

/** Equivalente a exportPDF() de app.js: genera y descarga el PDF completo del expediente en edicion. */
@WebServlet("/patients/export")
public class PatientExportServlet extends HttpServlet {

    private final AppDefaultsDao defaultsDao = new AppDefaultsDao();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        MedicalRecord record = SessionDraft.get(req);
        String nombre = record.getData().get("s1-patient", "paciente");
        String fecha = java.time.LocalDate.now().toString();
        String filename = "chequeo-" + nombre.replaceAll("[^a-zA-Z0-9-_]", "_") + "-" + fecha + ".pdf";

        Map<String, String> appDefaults;
        try {
            appDefaults = defaultsDao.findAll();
        } catch (SQLException e) {
            appDefaults = Map.of();
        }

        resp.setContentType("application/pdf");
        resp.setHeader("Content-Disposition", "attachment; filename=\"" + filename + "\"");

        String webappRoot = getServletContext().getRealPath("/");
        try {
            new PdfExportService(Paths.get(webappRoot)).export(record, appDefaults, resp.getOutputStream());
        } catch (Exception e) {
            throw new ServletException("Error al generar el PDF: " + e.getMessage(), e);
        }
    }
}
