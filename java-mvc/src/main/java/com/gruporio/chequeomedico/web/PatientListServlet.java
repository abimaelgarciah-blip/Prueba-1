package com.gruporio.chequeomedico.web;

import com.gruporio.chequeomedico.dao.MedicalRecordDao;
import com.gruporio.chequeomedico.model.MedicalRecord;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.SQLException;
import java.util.List;

/** Equivalente a view-patients.js (loadPatientsView/filterPatientsView/deletePatient). */
@WebServlet("/patients")
public class PatientListServlet extends HttpServlet {

    private final MedicalRecordDao dao = new MedicalRecordDao();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String action = req.getParameter("action");
        try {
            if ("new".equals(action)) {
                SessionDraft.clear(req);
                resp.sendRedirect(req.getContextPath() + "/patients/form");
                return;
            }
            if ("open".equals(action)) {
                String id = req.getParameter("id");
                MedicalRecord record = dao.findById(id);
                if (record != null) SessionDraft.set(req, record);
                resp.sendRedirect(req.getContextPath() + "/patients/form");
                return;
            }
            if ("delete".equals(action)) {
                dao.delete(req.getParameter("id"));
                resp.sendRedirect(req.getContextPath() + "/patients");
                return;
            }

            String q = req.getParameter("q");
            List<MedicalRecord> patients = (q == null || q.trim().isEmpty()) ? dao.findAll() : dao.search(q.trim());
            req.setAttribute("patients", patients);
            req.setAttribute("query", q);
            req.getRequestDispatcher("/WEB-INF/views/patients-list.jsp").forward(req, resp);
        } catch (SQLException e) {
            throw new ServletException("Error de base de datos", e);
        }
    }
}
