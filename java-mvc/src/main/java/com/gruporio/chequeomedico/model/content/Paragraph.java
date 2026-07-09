package com.gruporio.chequeomedico.model.content;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Set;

/**
 * Parrafo de texto libre que puede mezclar texto plano, texto en negritas
 * (Bold) y campos de captura (Field) en linea, tal como los parrafos armados
 * con plantillas literales en JS (ej. sheet5: "Inicia menstruacion a los
 * {input} anios, gesta {input}...").
 */
public class Paragraph implements ContentBlock {
    private final List<Object> parts;

    private Paragraph(List<Object> parts) { this.parts = parts; }

    /** Cada elemento debe ser String, Bold o Field. */
    public static Paragraph of(Object... items) {
        return new Paragraph(new ArrayList<>(Arrays.asList(items)));
    }

    public List<Object> getParts() { return parts; }

    @Override
    public void collectFieldIds(Set<String> out) {
        for (Object part : parts) {
            if (part instanceof Field) out.add(((Field) part).getId());
        }
    }
}
