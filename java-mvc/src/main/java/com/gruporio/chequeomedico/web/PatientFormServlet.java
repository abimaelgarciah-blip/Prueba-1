package com.gruporio.chequeomedico.web;

import com.gruporio.chequeomedico.dao.AppDefaultsDao;
import com.gruporio.chequeomedico.model.*;
import com.gruporio.chequeomedico.service.ImageResolver;
import com.gruporio.chequeomedico.service.html.ContentBlockHtmlRenderer;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.SQLException;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Controlador principal del expediente en edicion (equivalente a
 * navigateTo()/sheet.render()/sheet.restore() de app.js): dibuja la barra
 * lateral con las 26+ hojas y el contenido de la hoja seleccionada.
 */
@WebServlet("/patients/form")
public class PatientFormServlet extends HttpServlet {

    private final ContentBlockHtmlRenderer htmlRenderer = new ContentBlockHtmlRenderer();
    private final AppDefaultsDao defaultsDao = new AppDefaultsDao();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        MedicalRecord record = SessionDraft.get(req);
        MedicalRecordData data = record.getData();

        String sheetId = req.getParameter("sheet");
        if (sheetId == null || sheetId.isEmpty()) sheetId = "datos-generales";

        SheetDefinition current = findSheet(sheetId);

        req.setAttribute("record", record);
        req.setAttribute("sheets", SheetRegistry.SHEETS);
        req.setAttribute("sectionLabels", SheetRegistry.SECTION_LABELS);
        req.setAttribute("currentSheetId", sheetId);
        req.setAttribute("currentSheet", current);
        req.setAttribute("currentSheetIsCover", current instanceof CoverSheetDefinition);
        req.setAttribute("currentSheetIsContent", current instanceof ContentSheetDefinition);
        req.setAttribute("currentSheetIsNutri", current instanceof NutricionalSheetDefinition);

        java.util.Set<String> omittedSections = new java.util.HashSet<>();
        for (String section : SheetRegistry.SECTION_LABELS.keySet()) {
            if (data.isTrue("skip-section-" + section)) omittedSections.add(section);
        }
        req.setAttribute("omittedSections", omittedSections);
        req.setAttribute("isOmittedSection", current != null && current.getSection() != null
                && omittedSections.contains(current.getSection()));

        Map<String, String> appDefaults;
        try {
            appDefaults = defaultsDao.findAll();
        } catch (SQLException e) {
            appDefaults = Map.of();
        }

        if (current instanceof ContentSheetDefinition) {
            ContentSheetDefinition csd = (ContentSheetDefinition) current;
            req.setAttribute("membreteImage", ImageResolver.resolve(data, appDefaults, csd.getMembreteKey()));
            req.setAttribute("sheetHtml", htmlRenderer.render(csd.getBlocks(), data, record.getSex()));
        } else if (current instanceof CoverSheetDefinition) {
            CoverSheetDefinition cover = (CoverSheetDefinition) current;
            req.setAttribute("coverImage", ImageResolver.resolve(data, appDefaults, cover.getCoverKey()));
        } else if (current instanceof NutricionalSheetDefinition) {
            req.setAttribute("nutriConfig", ((NutricionalSheetDefinition) current).getConfig());
        }

        req.getRequestDispatcher("/WEB-INF/views/patient-form.jsp").forward(req, resp);
    }

    private SheetDefinition findSheet(String id) {
        for (SheetDefinition s : SheetRegistry.SHEETS) if (s.getId().equals(id)) return s;
        return null;
    }

    // ------------------------------------------------------------------
    // Autoguardado (equivalente a saveFieldState()/updateDynamicBlock()/etc.)
    // ------------------------------------------------------------------
    @Override
    @SuppressWarnings("unchecked")
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        MedicalRecord record = SessionDraft.get(req);
        MedicalRecordData data = record.getData();
        String op = req.getParameter("op");
        if (op == null) op = "field";

        switch (op) {
            case "field": {
                String id = req.getParameter("id");
                String value = req.getParameter("value");
                data.set(id, value);
                syncGeneralDataColumns(record, id, value);
                break;
            }
            case "dynamic-add": {
                String key = req.getParameter("key");
                List<Object> list = (List<Object>) ensureList(data, key);
                Map<String, Object> item = new LinkedHashMap<>();
                item.put("title", "");
                item.put("body", "");
                list.add(item);
                break;
            }
            case "dynamic-update": {
                String key = req.getParameter("key");
                int index = Integer.parseInt(req.getParameter("index"));
                String field = req.getParameter("field");
                String value = req.getParameter("value");
                List<Object> list = (List<Object>) ensureList(data, key);
                if (index < list.size() && list.get(index) instanceof Map) {
                    ((Map<String, Object>) list.get(index)).put(field, value);
                }
                break;
            }
            case "dynamic-remove": {
                String key = req.getParameter("key");
                int index = Integer.parseInt(req.getParameter("index"));
                List<Object> list = (List<Object>) ensureList(data, key);
                if (index < list.size()) list.remove(index);
                break;
            }
            case "numbered-add": {
                String key = req.getParameter("key");
                ((List<Object>) ensureList(data, key)).add("");
                break;
            }
            case "numbered-update": {
                String key = req.getParameter("key");
                int index = Integer.parseInt(req.getParameter("index"));
                String value = req.getParameter("value");
                List<Object> list = (List<Object>) ensureList(data, key);
                if (index < list.size()) list.set(index, value);
                break;
            }
            case "numbered-remove": {
                String key = req.getParameter("key");
                int index = Integer.parseInt(req.getParameter("index"));
                List<Object> list = (List<Object>) ensureList(data, key);
                if (index < list.size()) list.remove(index);
                break;
            }
            case "section-omit": {
                String section = req.getParameter("section");
                String checked = req.getParameter("checked");
                data.set("skip-section-" + section, checked);
                break;
            }
            case "nutri-seccion": {
                String seccionId = req.getParameter("id");
                String checked = req.getParameter("checked");
                seccionesMap(data).put(seccionId, Boolean.parseBoolean(checked));
                break;
            }
            case "nutri-field": {
                String key = req.getParameter("key"); // "kcal" | "nombre" | "extra"
                nutriMap(data).put(key, req.getParameter("value"));
                break;
            }
            case "nutri-anexos": {
                nutriMap(data).put("anexos", com.gruporio.chequeomedico.service.nutricional.PageRanges.parse(req.getParameter("value")));
                break;
            }
            default:
                resp.sendError(HttpServletResponse.SC_BAD_REQUEST, "Operacion desconocida: " + op);
                return;
        }
        resp.setStatus(HttpServletResponse.SC_NO_CONTENT);
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> nutriMap(MedicalRecordData data) {
        Object raw = data.getRaw(NutricionalSheetDefinition.FIELD_ID);
        if (raw instanceof Map) return (Map<String, Object>) raw;
        Map<String, Object> m = new LinkedHashMap<>();
        data.setRaw(NutricionalSheetDefinition.FIELD_ID, m);
        return m;
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> seccionesMap(MedicalRecordData data) {
        Map<String, Object> nutri = nutriMap(data);
        Object raw = nutri.get("secciones");
        if (raw instanceof Map) return (Map<String, Object>) raw;
        Map<String, Object> m = new LinkedHashMap<>();
        nutri.put("secciones", m);
        return m;
    }

    @SuppressWarnings("unchecked")
    private List<Object> ensureList(MedicalRecordData data, String key) {
        Object raw = data.getRaw(key);
        if (raw instanceof List) return (List<Object>) raw;
        List<Object> list = new java.util.ArrayList<>();
        data.setRaw(key, list);
        return list;
    }

    /** Mantiene sincronizadas las 4 columnas indexadas de MedicalRecord con los campos de "Datos generales". */
    private void syncGeneralDataColumns(MedicalRecord record, String fieldId, String value) {
        if (SheetRegistry.GENERAL_PATIENT_NAME.equals(fieldId)) record.setPatientName(value);
        else if (SheetRegistry.GENERAL_PATIENT_ID.equals(fieldId)) record.setPatientId(value);
        else if (SheetRegistry.GENERAL_CLINIC.equals(fieldId)) record.setClinic(value);
        else if (SheetRegistry.GENERAL_STUDY_DATE.equals(fieldId)) {
            try { record.setStudyDate(value == null || value.isEmpty() ? null : java.time.LocalDate.parse(value)); }
            catch (Exception ignored) { /* fecha invalida: se deja como estaba, igual que el input date del navegador */ }
        }
    }
}
