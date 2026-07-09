package com.gruporio.chequeomedico.web;

import javax.servlet.*;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;

/**
 * Puerta de acceso unica a toda la app (equivalente a AUTH_KEY en
 * sessionStorage + handleLogin() de app.js, ahora aplicada del lado del
 * servidor: sin sesion valida, cualquier URL de la app redirige a /login).
 */
@WebFilter("/*")
public class AuthFilter implements Filter {

    private static final String SESSION_ATTR = "authenticated";

    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain) throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) req;
        HttpServletResponse response = (HttpServletResponse) res;
        String path = request.getServletPath();

        boolean isPublic = path.equals("/login") || path.startsWith("/css/") || path.startsWith("/js/")
                || path.startsWith("/assets/");
        if (isPublic) {
            chain.doFilter(req, res);
            return;
        }

        HttpSession session = request.getSession(false);
        boolean authenticated = session != null && Boolean.TRUE.equals(session.getAttribute(SESSION_ATTR));
        if (!authenticated) {
            response.sendRedirect(request.getContextPath() + "/login");
            return;
        }
        chain.doFilter(req, res);
    }
}
