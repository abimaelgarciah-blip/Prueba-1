package com.gruporio.chequeomedico.web;

import com.gruporio.chequeomedico.dao.AppDefaultsDao;
import com.google.gson.Gson;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.SQLException;
import java.util.LinkedHashMap;
import java.util.Map;

/** Equivalente a view-settings.js: imagenes predeterminadas de portadas/membretes (app_defaults). */
@WebServlet("/settings")
public class SettingsServlet extends HttpServlet {

    private final AppDefaultsDao dao = new AppDefaultsDao();
    private final Gson gson = new Gson();

    public static final Map<String, String> COVER_SLOTS = coverSlots();
    public static final Map<String, String> MEMBRETE_SLOTS = membreteSlots();

    private static Map<String, String> coverSlots() {
        Map<String, String> m = new LinkedHashMap<>();
        m.put("cover-1", "Portada Principal");
        m.put("cover-2", "Portada Objetivos");
        m.put("cover-3", "Portada Introducción");
        m.put("cover-4", "Portada Hallazgos Principales");
        m.put("cover-6", "Portada Sistemas");
        m.put("cover-8", "Portada Conclusiones");
        m.put("cover-10", "Portada Sugerencias");
        m.put("cover-12", "Portada Prueba Esfuerzo y ECG");
        m.put("cover-14", "Portada Espirometría");
        m.put("cover-16", "Portada Estudios de Gabinete");
        m.put("cover-18", "Portada Oftalmología");
        m.put("cover-23", "Portada Audiometría");
        m.put("cover-25", "Portada Evaluación Dental");
        m.put("cover-20", "Portada Laboratorio");
        return m;
    }

    private static Map<String, String> membreteSlots() {
        Map<String, String> m = new LinkedHashMap<>();
        m.put("mb-5", "Contenido Hallazgos");
        m.put("mb-7", "Contenido Sistemas");
        m.put("mb-9", "Contenido Conclusiones");
        m.put("mb-11", "Contenido Sugerencias");
        m.put("mb-13", "Contenido Prueba Esfuerzo y ECG");
        m.put("mb-15", "Contenido Espirometría");
        m.put("mb-17", "Contenido Estudios de Gabinete");
        m.put("mb-19", "Contenido Oftalmología");
        m.put("mb-24", "Contenido Audiometría");
        m.put("mb-26", "Contenido Evaluación Dental");
        m.put("mb-21", "Contenido Laboratorio");
        return m;
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        try {
            Map<String, String> appDefaults = dao.findAll();
            req.setAttribute("appDefaults", appDefaults);
            req.setAttribute("appDefaultsJson", gson.toJson(appDefaults));
            req.setAttribute("coverSlotsJson", gson.toJson(COVER_SLOTS));
            req.setAttribute("membreteSlotsJson", gson.toJson(MEMBRETE_SLOTS));
            req.getRequestDispatcher("/WEB-INF/views/settings.jsp").forward(req, resp);
        } catch (SQLException e) {
            throw new ServletException("Error de base de datos", e);
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String action = req.getParameter("action");
        String key = req.getParameter("key");
        try {
            if ("remove".equals(action)) {
                dao.remove(key);
            } else {
                dao.set(key, req.getParameter("value"));
            }
            resp.setStatus(HttpServletResponse.SC_NO_CONTENT);
        } catch (SQLException e) {
            throw new ServletException("Error de base de datos", e);
        }
    }
}
