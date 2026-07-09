package com.gruporio.chequeomedico.web;

import com.gruporio.chequeomedico.util.AppConfig;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;

/** Equivalente a handleLogin()/handleLogout() de app.js. */
@WebServlet("/login")
public class LoginServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        req.getRequestDispatcher("/WEB-INF/views/login.jsp").forward(req, resp);
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String password = req.getParameter("password");
        if (password != null && password.equals(AppConfig.authPassword())) {
            HttpSession session = req.getSession(true);
            session.setAttribute("authenticated", Boolean.TRUE);
            resp.sendRedirect(req.getContextPath() + "/patients");
        } else {
            req.setAttribute("error", "Contraseña incorrecta");
            req.getRequestDispatcher("/WEB-INF/views/login.jsp").forward(req, resp);
        }
    }
}
