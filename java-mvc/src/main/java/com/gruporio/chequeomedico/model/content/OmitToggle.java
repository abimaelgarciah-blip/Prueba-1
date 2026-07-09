package com.gruporio.chequeomedico.model.content;

import java.util.Set;

/**
 * Casilla independiente "Omitir este estudio" que oculta un {@link Group}
 * completo (equivalente a renderOmitToggle(id, label), distinto del omit
 * individual de {@link StudyLine}). targetGroupId debe coincidir con el
 * domId del Group que controla.
 */
public class OmitToggle implements ContentBlock {
    private final String targetGroupId;
    private final String label;

    public OmitToggle(String targetGroupId, String label) {
        this.targetGroupId = targetGroupId;
        this.label = label;
    }

    public String getTargetGroupId() { return targetGroupId; }
    public String getLabel() { return label; }
    public String getOmitFieldId() { return "omit-" + targetGroupId; }

    @Override public void collectFieldIds(Set<String> out) { out.add(getOmitFieldId()); }
}
