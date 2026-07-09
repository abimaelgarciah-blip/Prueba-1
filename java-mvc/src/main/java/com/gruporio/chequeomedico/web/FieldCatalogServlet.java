package com.gruporio.chequeomedico.web;

import com.gruporio.chequeomedico.model.FieldCatalog;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Pagina de referencia con TODOS los ids de campos de la app, agrupados por
 * hoja: es el listado que necesitas para mapear tu base de datos actual a
 * los campos del PDF (ver MedicalRecordData.set(id, valor)).
 */
@WebServlet("/field-catalog")
public class FieldCatalogServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        req.setAttribute("entries", FieldCatalog.all());
        req.getRequestDispatcher("/WEB-INF/views/field-catalog.jsp").forward(req, resp);
    }
}
