package com.gruporio.chequeomedico.model.content;

import java.util.List;
import java.util.Set;

/**
 * Envuelve un "formato" (lista de bloques) que puede ser sustituido por
 * completo por un PDF cargado por el usuario (equivalente a
 * renderPdfReplace(pdfKey, formatoHTML)). Si MedicalRecordData tiene un valor
 * para pdfKey, el PDF cargado reemplaza el formato en la exportacion; si no,
 * se usan los bloques del formato normalmente.
 */
public class PdfReplace implements ContentBlock {
    private final String pdfKey;
    private final List<ContentBlock> formatBlocks;

    public PdfReplace(String pdfKey, List<ContentBlock> formatBlocks) {
        this.pdfKey = pdfKey;
        this.formatBlocks = formatBlocks;
    }

    public String getPdfKey() { return pdfKey; }
    public List<ContentBlock> getFormatBlocks() { return formatBlocks; }

    @Override
    public void collectFieldIds(Set<String> out) {
        out.add(pdfKey);
        for (ContentBlock b : formatBlocks) b.collectFieldIds(out);
    }
}
