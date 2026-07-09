package com.gruporio.chequeomedico.model;

import java.util.Set;

/**
 * Hoja de portada: una sola imagen a pagina completa (equivalente a
 * renderCoverPage(coverKey, label) en templates.js). coverKey es la clave de
 * la imagen (ver ImageDefaults: appState[coverKey] > appDefaults[coverKey] >
 * BUNDLED_DEFAULTS[coverKey]).
 */
public class CoverSheetDefinition implements SheetDefinition {
    private final String id;
    private final String label;
    private final String coverKey;
    private final String section; // nullable

    public CoverSheetDefinition(String id, String label, String coverKey, String section) {
        this.id = id;
        this.label = label;
        this.coverKey = coverKey;
        this.section = section;
    }

    @Override public String getId() { return id; }
    @Override public String getLabel() { return label; }
    @Override public String getSection() { return section; }
    public String getCoverKey() { return coverKey; }

    @Override
    public void collectFieldIds(Set<String> out) {
        out.add(coverKey); // la imagen de portada tambien es un "campo" (guarda un data URL)
    }
}
