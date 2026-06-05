package com.rio.chequeo.controller;

import com.rio.chequeo.util.AppConstants;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Servlet de autenticación para RIO - Chequeo Médico.
 * Ubicado en el paquete {@code controller} para cumplir la especificación del proyecto.
 *
 * <p>La implementación canónica reside en
 * {@link com.rio.chequeo.servlet.AuthServlet}.
 * El archivo web.xml registra la clase {@code com.rio.chequeo.servlet.AuthServlet}.</p>
 *
 * <ul>
 *   <li>GET  /auth    — Redirige a /patients si hay sesión; muestra login.jsp si no.</li>
 *   <li>POST /auth    — Valida contraseña; crea sesión y redirige a /patients.</li>
 *   <li>GET  /logout  — Invalida sesión y redirige a /auth.</li>
 * </ul>
 */
public class AuthServlet extends HttpServlet {

    private static final long serialVersionUID = 1L;
    private static final Logger LOGGER = Logger.getLogger(AuthServlet.class.getName());

    private static final String VIEW_LOGIN = "/WEB-INF/views/login.jsp";

    // -------------------------------------------------------------------------
    // doGet
    // -------------------------------------------------------------------------

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        String uri = req.getRequestURI();

        // /logout → invalida sesión
        if (uri.endsWith("/logout")) {
            logout(req, resp);
            return;
        }

        // /auth o /login → si hay sesión activa redirigir a /patients
        HttpSession session = req.getSession(false);
        if (session != null && session.getAttribute(AppConstants.SESSION_USER_KEY) != null) {
            resp.sendRedirect(req.getContextPath() + "/patients");
            return;
        }

        req.getRequestDispatcher(VIEW_LOGIN).forward(req, resp);
    }

    // -------------------------------------------------------------------------
    // doPost
    // -------------------------------------------------------------------------

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        req.setCharacterEncoding("UTF-8");

        String username = req.getParameter("username");
        String password  = req.getParameter("password");

        if (username == null) username = "";
        if (password  == null) password = "";

        if (authenticate(username.trim(), password)) {
            HttpSession session = req.getSession(true);
            session.setMaxInactiveInterval(AppConstants.SESSION_TIMEOUT);
            session.setAttribute(AppConstants.SESSION_USER_KEY, username.trim());
            LOGGER.info("Login exitoso para usuario: " + username.trim());
            resp.sendRedirect(req.getContextPath() + "/patients");
        } else {
            LOGGER.warning("Login fallido para usuario: " + username.trim());
            req.setAttribute("loginError", "Usuario o contraseña incorrectos");
            req.getRequestDispatcher(VIEW_LOGIN).forward(req, resp);
        }
    }

    // -------------------------------------------------------------------------
    // Métodos auxiliares
    // -------------------------------------------------------------------------

    /**
     * Invalida la sesión actual y redirige al formulario de login.
     */
    private void logout(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        HttpSession session = req.getSession(false);
        if (session != null) {
            String user = (String) session.getAttribute(AppConstants.SESSION_USER_KEY);
            session.invalidate();
            LOGGER.info("Sesión cerrada para usuario: " + user);
        }
        resp.sendRedirect(req.getContextPath() + "/auth");
    }

    /**
     * Valida las credenciales.
     *
     * <ol>
     *   <li>Compara contra {@link AppConstants#DEFAULT_PASSWORD}.</li>
     *   <li>TODO: consultar tabla USUARIOS en Oracle cuando esté disponible.</li>
     * </ol>
     */
    private boolean authenticate(String username, String password) {
        // Validación global mientras no haya tabla USUARIOS
        if (AppConstants.DEFAULT_PASSWORD.equals(password)) {
            return true;
        }

        // TODO: Implementar consulta a tabla USUARIOS en Oracle
        // Connection conn = null; PreparedStatement ps = null; ResultSet rs = null;
        // try {
        //     conn = DBConnection.getConnection();
        //     ps = conn.prepareStatement(
        //             "SELECT PASSWORD_HASH FROM USUARIOS WHERE USERNAME=? AND ACTIVO=1");
        //     ps.setString(1, username);
        //     rs = ps.executeQuery();
        //     if (rs.next()) {
        //         return rs.getString("PASSWORD_HASH").equals(hashPassword(password));
        //     }
        // } catch (SQLException e) {
        //     LOGGER.log(Level.SEVERE, "Error consultando USUARIOS", e);
        // } finally {
        //     DBConnection.closeQuietly(conn, ps, rs);
        // }

        return false;
    }
}
