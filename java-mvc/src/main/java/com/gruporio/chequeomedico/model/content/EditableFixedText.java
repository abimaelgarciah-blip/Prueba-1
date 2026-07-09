package com.gruporio.chequeomedico.model.content;

import java.util.Set;

/**
 * Texto fijo (clinicamente estandar) que el doctor puede editar puntualmente
 * (equivalente a renderEditableFixed(id, defaultText), ej. hallazgos de
 * exploracion fisica "sin alteraciones" por defecto). Si el registro no
 * tiene un valor guardado para "id", se usa defaultText tanto en pantalla
 * como en el PDF.
 */
public class EditableFixedText implements ContentBlock {
    private final String id;
    private final String defaultText;

    public EditableFixedText(String id, String defaultText) {
        this.id = id;
        this.defaultText = defaultText;
    }

    public String getId() { return id; }
    public String getDefaultText() { return defaultText; }

    @Override public void collectFieldIds(Set<String> out) { out.add(id); }
}
