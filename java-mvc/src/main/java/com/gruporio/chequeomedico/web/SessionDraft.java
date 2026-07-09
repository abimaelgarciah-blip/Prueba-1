package com.gruporio.chequeomedico.web;

import com.gruporio.chequeomedico.model.MedicalRecord;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

/**
 * El expediente que se esta editando ahora mismo (equivalente a "appState" +
 * "currentRecordId" en la version JS, que vivian en memoria del navegador /
 * localStorage). Aqui vive en la sesion HTTP: se edita sheet por sheet con
 * autoguardado (ver /patients/save-field) y solo se escribe a Oracle cuando
 * el usuario aprieta "Guardar en BD" (ver /patients/save).
 */
public final class SessionDraft {

    private static final String ATTR = "currentRecord";

    private SessionDraft() {}

    public static MedicalRecord get(HttpServletRequest req) {
        HttpSession session = req.getSession(true);
        MedicalRecord r = (MedicalRecord) session.getAttribute(ATTR);
        if (r == null) {
            r = new MedicalRecord();
            session.setAttribute(ATTR, r);
        }
        return r;
    }

    public static void set(HttpServletRequest req, MedicalRecord record) {
        req.getSession(true).setAttribute(ATTR, record);
    }

    public static void clear(HttpServletRequest req) {
        HttpSession session = req.getSession(false);
        if (session != null) session.removeAttribute(ATTR);
    }
}
