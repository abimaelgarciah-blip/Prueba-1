package com.gruporio.chequeomedico.model;

import java.util.Set;

/**
 * Contrato comun de una "hoja" del expediente (equivalente a los objetos
 * window.sheetN de la version JS: {id, label, render(), restore()}). Cada
 * implementacion sabe que campos de datos usa (para el catalogo de campos y
 * para el generador de PDF).
 */
public interface SheetDefinition {
    String getId();
    String getLabel();
    /** Clave de "seccion" omitible (renderSectionOmit), o null si no aplica. */
    String getSection();
    void collectFieldIds(Set<String> out);
}
