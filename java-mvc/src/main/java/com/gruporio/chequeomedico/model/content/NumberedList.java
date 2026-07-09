package com.gruporio.chequeomedico.model.content;

import java.util.Set;

/**
 * Lista numerada de textos libres (equivalente a renderNumberedList(stateKey,
 * placeholder), ej. sugerencias del doctor). Se persiste como un ARREGLO de
 * strings bajo stateKey.
 */
public class NumberedList implements ContentBlock {
    private final String stateKey;
    private final String placeholder;

    public NumberedList(String stateKey, String placeholder) {
        this.stateKey = stateKey;
        this.placeholder = placeholder;
    }

    public String getStateKey() { return stateKey; }
    public String getPlaceholder() { return placeholder; }

    @Override public void collectFieldIds(Set<String> out) { out.add(stateKey); }
}
