package com.gruporio.chequeomedico.web;

import com.gruporio.chequeomedico.dao.DoctorDao;
import com.gruporio.chequeomedico.model.Doctor;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.SQLException;
import java.util.List;

/** Equivalente a view-doctors.js: perfiles de doctores + firma digital. */
@WebServlet("/doctors")
public class DoctorServlet extends HttpServlet {

    private final DoctorDao dao = new DoctorDao();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        try {
            String editId = req.getParameter("edit");
            if (editId != null) {
                req.setAttribute("editing", dao.findById(editId));
            }
            List<Doctor> doctors = dao.findAll();
            req.setAttribute("doctors", doctors);
            req.getRequestDispatcher("/WEB-INF/views/doctors.jsp").forward(req, resp);
        } catch (SQLException e) {
            throw new ServletException("Error de base de datos", e);
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String action = req.getParameter("action");
        try {
            if ("delete".equals(action)) {
                dao.delete(req.getParameter("id"));
            } else {
                Doctor d = new Doctor();
                d.setId(req.getParameter("id"));
                d.setNombre(req.getParameter("nombre"));
                d.setCedula(req.getParameter("cedula"));
                d.setEspecialidad(req.getParameter("especialidad"));
                d.setClinica(req.getParameter("clinica"));
                d.setTelefono(req.getParameter("telefono"));
                d.setEmail(req.getParameter("email"));
                d.setDireccion(req.getParameter("direccion"));
                d.setSignatureData(req.getParameter("signatureData"));
                d.setSignatureImage(req.getParameter("signatureImage"));
                if (d.getNombre() == null || d.getNombre().trim().isEmpty()) {
                    req.setAttribute("error", "El nombre del doctor es obligatorio.");
                    req.setAttribute("editing", d);
                    req.setAttribute("doctors", dao.findAll());
                    req.getRequestDispatcher("/WEB-INF/views/doctors.jsp").forward(req, resp);
                    return;
                }
                dao.save(d);
            }
            resp.sendRedirect(req.getContextPath() + "/doctors");
        } catch (SQLException e) {
            throw new ServletException("Error de base de datos", e);
        }
    }
}
