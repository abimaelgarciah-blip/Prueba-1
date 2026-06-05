package com.rio.chequeo.servlet;

import com.rio.chequeo.util.AppConstants;
import com.rio.chequeo.util.DBConnection;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Servlet de autenticación para RIO - Chequeo Médico.
 *
 * <ul>
 *   <li>GET  /auth  — Si hay sesión activa redirige a /patients; si no, muestra login.jsp.</li>
 *   <li>POST /auth  — Valida credenciales; crea sesión y redirige a /patients.</li>
 *   <li>GET  /logout — Invalida la sesión y redirige a /auth.</li>
 * </ul>
 */
@WebServlet(urlPatterns = {"/auth", "/login", "/logout"})
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

        // /logout — invalida sesión y redirige a /auth
        if (uri.endsWith("/logout")) {
            logout(req, resp);
            return;
        }

        // /auth o /login — si ya hay sesión activa redirigir a /patients
        HttpSession session = req.getSession(false);
        if (session != null && session.getAttribute(AppConstants.SESSION_USER_KEY) != null) {
            resp.sendRedirect(req.getContextPath() + "/patients");
            return;
        }

        // Sin sesión → mostrar formulario de login
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
            // Crear sesión
            HttpSession session = req.getSession(true);
            session.setMaxInactiveInterval(AppConstants.SESSION_TIMEOUT);
            session.setAttribute(AppConstants.SESSION_USER_KEY, username.trim());
            LOGGER.info("Login exitoso para usuario: " + username.trim());
            resp.sendRedirect(req.getContextPath() + "/patients");
        } else {
            LOGGER.warning("Intento de login fallido para usuario: " + username.trim());
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
     * Autentica al usuario.
     *
     * <p>Orden de validación:
     * <ol>
     *   <li>Contraseña global {@link AppConstants#DEFAULT_PASSWORD} (sin usuario individual).</li>
     *   <li>TODO: consultar tabla USUARIOS en Oracle para credenciales individuales.</li>
     * </ol>
     * </p>
     *
     * @param username nombre de usuario (puede ser vacío mientras no haya tabla USUARIOS)
     * @param password contraseña recibida
     * @return {@code true} si la autenticación es correcta
     */
    private boolean authenticate(String username, String password) {
        // Validación contra contraseña global (mientras no haya usuarios individuales)
        if (AppConstants.DEFAULT_PASSWORD.equals(password)) {
            return true;
        }

        // TODO: Consultar tabla USUARIOS en Oracle
        // Descomentar y ajustar cuando la tabla esté disponible:
        /*
        Connection conn = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
        try {
            conn = DBConnection.getConnection();
            ps = conn.prepareStatement(
                    "SELECT PASSWORD_HASH FROM USUARIOS WHERE USERNAME = ? AND ACTIVO = 1");
            ps.setString(1, username);
            rs = ps.executeQuery();
            if (rs.next()) {
                String storedHash = rs.getString("PASSWORD_HASH");
                // Comparar con hash de la contraseña recibida:
                return storedHash.equals(hashPassword(password));
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error consultando tabla USUARIOS", e);
        } finally {
            DBConnection.closeQuietly(conn, ps, rs);
        }
        */

        return false;
    }

    /**
     * TODO: Implementar hash seguro de contraseña (BCrypt o PBKDF2).
     */
    @SuppressWarnings("unused")
    private String hashPassword(String rawPassword) {
        // TODO: implementar con BCrypt o similar
        throw new UnsupportedOperationException("hashPassword no implementado");
    }
}
