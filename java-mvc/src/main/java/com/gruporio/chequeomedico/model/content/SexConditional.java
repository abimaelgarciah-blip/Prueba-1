package com.gruporio.chequeomedico.model.content;

import java.util.Set;

/**
 * Muestra el bloque interno solo si el sexo del paciente coincide
 * (equivalente a renderIfSex('M'|'F', html)). El sexo del paciente se lee de
 * MedicalRecord.getSex() (columna derivada del campo c5-sexo, ver
 * SheetRegistry.SEX_FIELD_ID).
 */
public class SexConditional implements ContentBlock {
    private final String sex; // "M" | "F"
    private final ContentBlock inner;

    public SexConditional(String sex, ContentBlock inner) {
        this.sex = sex;
        this.inner = inner;
    }

    public String getSex() { return sex; }
    public ContentBlock getInner() { return inner; }

    @Override public void collectFieldIds(Set<String> out) { inner.collectFieldIds(out); }
}
