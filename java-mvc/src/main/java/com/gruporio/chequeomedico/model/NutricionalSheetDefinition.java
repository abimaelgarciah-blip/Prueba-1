package com.gruporio.chequeomedico.model;

import com.gruporio.chequeomedico.model.nutricional.NutriConfig;

import java.util.Set;

/**
 * Hoja especial "Evaluacion Nutricional" (equivalente a window.sheetNutricional).
 * No se renderiza como imagen dentro del PDF principal: sus selecciones
 * (secciones, dieta por kcal, anexos, PDFs externos, paginas extra) se
 * guardan bajo la clave unica "nutri" (un JSON anidado, igual que
 * appState.nutri) y se usan para ANEXAR paginas de la plantilla nutricional
 * al final del PDF (ver NutricionalPdfService).
 */
public class NutricionalSheetDefinition implements SheetDefinition {
    public static final String ID = "evaluacion-nutricional";
    public static final String LABEL = "Evaluación Nutricional";
    /** Clave unica bajo la que se guarda todo el estado nutricional (objeto anidado). */
    public static final String FIELD_ID = "nutri";

    private final NutriConfig config;

    public NutricionalSheetDefinition(NutriConfig config) { this.config = config; }

    public NutriConfig getConfig() { return config; }

    @Override public String getId() { return ID; }
    @Override public String getLabel() { return LABEL; }
    @Override public String getSection() { return null; }

    @Override public void collectFieldIds(Set<String> out) { out.add(FIELD_ID); }
}
