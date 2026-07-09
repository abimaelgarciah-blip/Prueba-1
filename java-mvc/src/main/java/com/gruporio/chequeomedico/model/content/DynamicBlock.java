package com.gruporio.chequeomedico.model.content;

import java.util.Set;

/**
 * Lista repetible de bloques {titulo, cuerpo} que el usuario agrega/quita
 * libremente (equivalente a renderDynamicBlock(stateKey, addBtnLabel)).
 * Se persiste como un ARREGLO de objetos {title, body} bajo stateKey en
 * MedicalRecordData (igual que appState[stateKey] en la version JS), no como
 * campos sueltos.
 */
public class DynamicBlock implements ContentBlock {
    private final String stateKey;
    private final String addButtonLabel;

    public DynamicBlock(String stateKey, String addButtonLabel) {
        this.stateKey = stateKey;
        this.addButtonLabel = addButtonLabel;
    }

    public String getStateKey() { return stateKey; }
    public String getAddButtonLabel() { return addButtonLabel; }

    @Override public void collectFieldIds(Set<String> out) { out.add(stateKey); }
}
