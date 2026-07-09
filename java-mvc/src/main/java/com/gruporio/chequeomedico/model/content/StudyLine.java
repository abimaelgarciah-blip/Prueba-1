package com.gruporio.chequeomedico.model.content;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Set;

/**
 * Linea de estudio individual con casilla "Omitir" (equivalente a
 * renderStudyLine(id, html) en templates.js). omitId es la clave usada para
 * el toggle (appState['omit-' + omitId]). El contenido mezcla texto en
 * negritas (Bold) y uno o mas campos (Field), igual que Paragraph, porque
 * varias lineas del original tienen mas de un campo (ej. "IMC: {campo}
 * clasificado como: {campo}").
 */
public class StudyLine implements ContentBlock {
    private final String omitId;
    private final List<Object> parts;

    public StudyLine(String omitId, Object... parts) {
        this.omitId = omitId;
        this.parts = new ArrayList<>(Arrays.asList(parts));
    }

    /** Atajo para el caso mas comun: una etiqueta en negritas + un solo campo. */
    public static StudyLine of(String omitId, String boldLabel, Field field) {
        return new StudyLine(omitId, new Bold(boldLabel), field);
    }

    public String getOmitId() { return omitId; }
    public List<Object> getParts() { return parts; }
    public String getOmitFieldId() { return "omit-" + omitId; }

    @Override
    public void collectFieldIds(Set<String> out) {
        out.add(getOmitFieldId());
        for (Object part : parts) {
            if (part instanceof Field) out.add(((Field) part).getId());
        }
    }
}
