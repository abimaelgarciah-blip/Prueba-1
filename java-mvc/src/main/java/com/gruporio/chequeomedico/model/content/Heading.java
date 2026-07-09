package com.gruporio.chequeomedico.model.content;

import java.util.Set;

/** Titulo de seccion (equivalente a h1()/h2() en templates.js). No persiste datos. */
public class Heading implements ContentBlock {
    private final String text;

    public Heading(String text) { this.text = text; }

    public String getText() { return text; }

    @Override public void collectFieldIds(Set<String> out) { /* sin datos */ }
}
