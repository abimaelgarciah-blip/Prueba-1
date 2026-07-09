package com.gruporio.chequeomedico.web;

import com.gruporio.chequeomedico.dao.MedicalRecordDao;
import com.gruporio.chequeomedico.model.MedicalRecord;
import com.gruporio.chequeomedico.model.SheetRegistry;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.SQLException;

/** Equivalente a dbSaveRecord() de supabase-client.js: guarda/actualiza el expediente en BD. */
@WebServlet("/patients/save")
public class PatientSaveServlet extends HttpServlet {

    private final MedicalRecordDao dao = new MedicalRecordDao();

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        MedicalRecord record = SessionDraft.get(req);
        String name = record.getData().get(SheetRegistry.GENERAL_PATIENT_NAME);
        if (name == null || name.trim().isEmpty()) {
            req.setAttribute("error", "Por favor ingresa el nombre del paciente en Datos Generales antes de guardar.");
            resp.sendRedirect(req.getContextPath() + "/patients/form?sheet=datos-generales&error=nombre");
            return;
        }
        // Mantiene sincronizadas las columnas indexadas por si el usuario no paso por el evento oninput.
        record.setPatientName(name);
        record.setPatientId(record.getData().get(SheetRegistry.GENERAL_PATIENT_ID));
        record.setClinic(record.getData().get(SheetRegistry.GENERAL_CLINIC));
        String dateStr = record.getData().get(SheetRegistry.GENERAL_STUDY_DATE);
        try {
            record.setStudyDate(dateStr == null || dateStr.isEmpty() ? null : java.time.LocalDate.parse(dateStr));
        } catch (Exception ignored) { }

        try {
            dao.save(record);
            SessionDraft.set(req, record);
        } catch (SQLException e) {
            throw new ServletException("No se pudo guardar el expediente", e);
        }
        String sheet = req.getParameter("sheet");
        resp.sendRedirect(req.getContextPath() + "/patients/form?sheet=" + (sheet == null ? "datos-generales" : sheet) + "&saved=1");
    }
}
