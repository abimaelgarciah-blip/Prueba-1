package com.gruporio.chequeomedico.model.content;

import java.util.Set;

/**
 * Imagen adjunta a un estudio (equivalente a renderAttachment(stateKey,
 * label, pdfKey)). stateKey guarda una imagen como data URL base64; si
 * pdfKey no es null, ademas se puede cargar un PDF que SUSTITUYE por completo
 * el formato editable de la hoja (ver PdfReplace).
 */
public class Attachment implements ContentBlock {
    private final String stateKey;
    private final String label;
    private final String pdfKey; // nullable

    public Attachment(String stateKey, String label, String pdfKey) {
        this.stateKey = stateKey;
        this.label = label;
        this.pdfKey = pdfKey;
    }

    public String getStateKey() { return stateKey; }
    public String getLabel() { return label; }
    public String getPdfKey() { return pdfKey; }

    @Override
    public void collectFieldIds(Set<String> out) {
        out.add(stateKey);
        if (pdfKey != null) out.add(pdfKey);
    }
}
