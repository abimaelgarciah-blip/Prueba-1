package com.gruporio.chequeomedico.model.content;

/** Fragmento de texto en negritas dentro de un Paragraph (equivalente a &lt;strong class="ctt-sub-line"&gt;). */
public final class Bold {
    private final String text;
    public Bold(String text) { this.text = text; }
    public String getText() { return text; }
}
