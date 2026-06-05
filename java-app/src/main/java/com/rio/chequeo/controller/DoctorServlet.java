package com.rio.chequeo.controller;

import com.rio.chequeo.dao.DoctorDAO;
import com.rio.chequeo.model.Doctor;
import com.rio.chequeo.util.AppConstants;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.servlet.http.Part;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Servlet de gestión de doctores para RIO - Chequeo Médico.
 *
 * <ul>
 *   <li>GET  /doctors          — Lista todos los doctores (JSON o JSP).</li>
 *   <li>GET  /doctors?id=N     — Devuelve el doctor N en JSON.</li>
 *   <li>POST /doctors          — Crea o actualiza un doctor (multipart: datos + firma).</li>
 *   <li>DELETE /doctors?id=N   — Elimina el doctor N (AJAX).</li>
 * </ul>
 */
@MultipartConfig(maxFileSize = 5242880, maxRequestSize = 5242880)
public class DoctorServlet extends HttpServlet {

    private static final long serialVersionUID = 1L;
    private static final Logger LOGGER = Logger.getLogger(DoctorServlet.class.getName());

    private static final String VIEW_LIST = "/WEB-INF/views/doctors/list.jsp";

    private final DoctorDAO doctorDAO = new DoctorDAO();

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

        String idParam = req.getParameter("id");
        boolean wantsJson = "application/json".equals(req.getHeader("Accept"))
                || isAjaxRequest(req);

        if (idParam != null && !idParam.isEmpty()) {
            // GET /doctors?id=N — devolver un doctor
            getDoctor(req, resp, idParam, wantsJson);
        } else {
            // GET /doctors — listar todos
            listDoctors(req, resp, wantsJson);
        }
    }

    // -------------------------------------------------------------------------
    // doPost
    // -------------------------------------------------------------------------

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        req.setCharacterEncoding("UTF-8");

        if (!isAuthenticated(req)) {
            resp.sendRedirect(req.getContextPath() + "/auth");
            return;
        }

        // Obtener datos del formulario
        String idParam        = req.getParameter("id");
        String nombre         = req.getParameter("nombre");
        String cedula         = req.getParameter("cedula");
        String especialidad   = req.getParameter("especialidad");
        String clinica        = req.getParameter("clinica");
        String telefono       = req.getParameter("telefono");
        String email          = req.getParameter("email");
        String direccion      = req.getParameter("direccion");

        Doctor doctor = new Doctor();
        if (idParam != null && !idParam.isEmpty()) {
            try {
                doctor.setId(Long.parseLong(idParam.trim()));
            } catch (NumberFormatException ignored) {}
        }
        doctor.setNombre(nombre);
        doctor.setCedula(cedula);
        doctor.setEspecialidad(especialidad);
        doctor.setClinica(clinica);
        doctor.setTelefono(telefono);
        doctor.setEmail(email);
        doctor.setDireccion(direccion);

        // Imagen de firma (multipart)
        try {
            Part firmaPart = req.getPart("firma");
            if (firmaPart != null && firmaPart.getSize() > 0) {
                try (InputStream is = firmaPart.getInputStream()) {
                    doctor.setFirmaImagen(is.readAllBytes());
                }
            }
        } catch (Exception e) {
            LOGGER.log(Level.WARNING, "No se pudo leer la imagen de firma", e);
        }

        // Guardar
        try {
            if (doctor.getId() != null && doctor.getId() > 0) {
                doctorDAO.update(doctor);
            } else {
                doctorDAO.save(doctor);
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error guardando doctor", e);
            if (isAjaxRequest(req)) {
                sendJsonError(resp, "Error guardando doctor: " + e.getMessage());
                return;
            }
            req.setAttribute("errorMsg", "Error guardando doctor: " + e.getMessage());
        }

        if (isAjaxRequest(req)) {
            sendJsonOk(resp);
        } else {
            resp.sendRedirect(req.getContextPath() + "/doctors");
        }
    }

    // -------------------------------------------------------------------------
    // doDelete
    // -------------------------------------------------------------------------

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        if (!isAuthenticated(req)) {
            resp.sendError(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        String idParam = req.getParameter("id");
        if (idParam == null || idParam.isEmpty()) {
            sendJsonError(resp, "Falta parámetro id");
            return;
        }

        try {
            long id = Long.parseLong(idParam.trim());
            doctorDAO.delete(id);
            sendJsonOk(resp);
        } catch (NumberFormatException e) {
            sendJsonError(resp, "id inválido: " + idParam);
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error eliminando doctor id=" + idParam, e);
            sendJsonError(resp, "Error eliminando doctor: " + e.getMessage());
        }
    }

    // -------------------------------------------------------------------------
    // Métodos auxiliares — navegación
    // -------------------------------------------------------------------------

    private void listDoctors(HttpServletRequest req, HttpServletResponse resp, boolean wantsJson)
            throws ServletException, IOException {
        try {
            List<Doctor> doctors = doctorDAO.findAll();
            if (wantsJson) {
                resp.setContentType("application/json;charset=UTF-8");
                StringBuilder sb = new StringBuilder("[");
                for (int i = 0; i < doctors.size(); i++) {
                    if (i > 0) sb.append(",");
                    sb.append(doctorToJson(doctors.get(i)));
                }
                sb.append("]");
                try (PrintWriter out = resp.getWriter()) {
                    out.print(sb.toString());
                }
            } else {
                req.setAttribute("doctors", doctors);
                req.getRequestDispatcher(VIEW_LIST).forward(req, resp);
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error cargando lista de doctores", e);
            if (wantsJson) {
                sendJsonError(resp, "Error cargando doctores: " + e.getMessage());
            } else {
                req.setAttribute("doctors", java.util.Collections.emptyList());
                req.setAttribute("errorMsg", "Error cargando doctores: " + e.getMessage());
                req.getRequestDispatcher(VIEW_LIST).forward(req, resp);
            }
        }
    }

    private void getDoctor(HttpServletRequest req, HttpServletResponse resp,
                           String idParam, boolean wantsJson)
            throws ServletException, IOException {
        try {
            long id = Long.parseLong(idParam.trim());
            Doctor doctor = doctorDAO.findById(id);
            if (doctor == null) {
                resp.sendError(HttpServletResponse.SC_NOT_FOUND, "Doctor no encontrado: " + id);
                return;
            }
            if (wantsJson) {
                resp.setContentType("application/json;charset=UTF-8");
                try (PrintWriter out = resp.getWriter()) {
                    out.print(doctorToJson(doctor));
                }
            } else {
                req.setAttribute("doctor", doctor);
                req.getRequestDispatcher(VIEW_LIST).forward(req, resp);
            }
        } catch (NumberFormatException e) {
            resp.sendError(HttpServletResponse.SC_BAD_REQUEST, "id inválido: " + idParam);
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error cargando doctor id=" + idParam, e);
            resp.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
                    "Error cargando doctor: " + e.getMessage());
        }
    }

    // -------------------------------------------------------------------------
    // JSON helpers
    // -------------------------------------------------------------------------

    private String doctorToJson(Doctor d) {
        return "{"
            + "\"id\":" + (d.getId() != null ? d.getId() : "null") + ","
            + "\"nombre\":\"" + escJson(d.getNombre()) + "\","
            + "\"cedula\":\"" + escJson(d.getCedula()) + "\","
            + "\"especialidad\":\"" + escJson(d.getEspecialidad()) + "\","
            + "\"clinica\":\"" + escJson(d.getClinica()) + "\","
            + "\"telefono\":\"" + escJson(d.getTelefono()) + "\","
            + "\"email\":\"" + escJson(d.getEmail()) + "\","
            + "\"direccion\":\"" + escJson(d.getDireccion()) + "\","
            + "\"tieneFirema\":" + (d.getFirmaImagen() != null && d.getFirmaImagen().length > 0)
            + "}";
    }

    private String escJson(String s) {
        if (s == null) return "";
        return s.replace("\\", "\\\\").replace("\"", "\\\"")
                .replace("\n", "\\n").replace("\r", "\\r");
    }

    private boolean isAuthenticated(HttpServletRequest req) {
        HttpSession session = req.getSession(false);
        return session != null && session.getAttribute(AppConstants.SESSION_USER_KEY) != null;
    }

    private boolean isAjaxRequest(HttpServletRequest req) {
        return "XMLHttpRequest".equals(req.getHeader("X-Requested-With"));
    }

    private void sendJsonOk(HttpServletResponse resp) throws IOException {
        resp.setContentType("application/json;charset=UTF-8");
        resp.setStatus(HttpServletResponse.SC_OK);
        try (PrintWriter out = resp.getWriter()) {
            out.print("{\"ok\":true}");
        }
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
