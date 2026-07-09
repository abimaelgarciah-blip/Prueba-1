package com.gruporio.chequeomedico.service.pdf;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDFont;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.graphics.image.PDImageXObject;
import org.apache.pdfbox.pdmodel.graphics.state.PDExtendedGraphicsState;

import java.io.IOException;
import java.util.function.Supplier;

/**
 * Escritor de texto con salto de linea/pagina automatico, usado por
 * ContentBlockPdfRenderer para dibujar cada hoja de contenido (equivalente,
 * en espiritu, a la paginacion por bloques de exportPDF() en app.js, aunque
 * aqui se dibuja texto real en vez de recortar una imagen).
 */
public class PdfTextFlow {

    // Tamaño carta en puntos, igual que PAGE_W/PAGE_H (mm) del original.
    public static final float PAGE_WIDTH = PDRectangle.LETTER.getWidth();
    public static final float PAGE_HEIGHT = PDRectangle.LETTER.getHeight();
    // Margenes iguales a los de app.js: 3cm arriba, 4cm abajo, 1.5cm lados (1mm = 2.8346pt).
    public static final float MARGIN_TOP = 85f;
    public static final float MARGIN_BOTTOM = 113f;
    public static final float MARGIN_LEFT = 42.5f;
    public static final float MARGIN_RIGHT = 42.5f;

    public final PDFont regular = PDType1Font.HELVETICA;
    public final PDFont bold = PDType1Font.HELVETICA_BOLD;
    public final PDFont italic = PDType1Font.HELVETICA_OBLIQUE;

    private final PDDocument doc;
    private final Supplier<byte[]> membreteImageSupplier; // null si no hay membrete
    private PDPage page;
    private PDPageContentStream cs;
    private float x;
    private float y;
    private float fontSize = 9.5f;
    private float leading = 12.5f;

    public PdfTextFlow(PDDocument doc, Supplier<byte[]> membreteImageSupplier) throws IOException {
        this.doc = doc;
        this.membreteImageSupplier = membreteImageSupplier;
        newPage();
    }

    public void newPage() throws IOException {
        if (cs != null) cs.close();
        page = new PDPage(PDRectangle.LETTER);
        doc.addPage(page);
        cs = new PDPageContentStream(doc, page);
        drawMembrete();
        x = MARGIN_LEFT;
        y = PAGE_HEIGHT - MARGIN_TOP;
    }

    private void drawMembrete() throws IOException {
        if (membreteImageSupplier == null) return;
        byte[] bytes = membreteImageSupplier.get();
        if (bytes == null) return;
        try {
            PDImageXObject img = PDImageXObject.createFromByteArray(doc, bytes, "membrete");
            PDExtendedGraphicsState gs = new PDExtendedGraphicsState();
            gs.setNonStrokingAlphaConstant(0.16f); // "velo blanco" del original (alpha 0.70 sobre blanco ~= marca de agua tenue)
            cs.saveGraphicsState();
            cs.setGraphicsStateParameters(gs);
            cs.drawImage(img, 0, 0, PAGE_WIDTH, PAGE_HEIGHT);
            cs.restoreGraphicsState();
        } catch (Exception e) {
            // Imagen invalida/corrupta: se ignora el membrete, no se detiene la exportacion.
        }
    }

    public void ensureSpace(float needed) throws IOException {
        if (y - needed < MARGIN_BOTTOM) newPage();
    }

    public void heading(String text) throws IOException {
        ensureSpace(leading * 2);
        y -= 4;
        drawWrapped(text, bold, 12f, 14f);
        y -= 4;
    }

    public void bodyRuns(Object... parts) throws IOException {
        drawRuns(java.util.Arrays.asList(parts));
    }

    /** parts: String (regular), com.gruporio.chequeomedico.model.content.Bold (negritas), o texto ya resuelto de un Field. */
    public void drawRuns(java.util.List<Object> parts) throws IOException {
        ensureSpace(leading);
        for (Object part : parts) {
            if (part instanceof com.gruporio.chequeomedico.model.content.Bold) {
                writeWords(((com.gruporio.chequeomedico.model.content.Bold) part).getText(), bold);
            } else {
                writeWords(String.valueOf(part), regular);
            }
        }
        newLine();
    }

    public void paragraph(String text) throws IOException {
        drawWrapped(text, regular, fontSize, leading);
    }

    public void paragraph(String label, String value) throws IOException {
        ensureSpace(leading);
        writeWords(label + " ", bold);
        writeWords(value == null ? "" : value, regular);
        newLine();
    }

    private void drawWrapped(String text, PDFont font, float size, float lead) throws IOException {
        float previousSize = this.fontSize;
        float previousLeading = this.leading;
        this.fontSize = size;
        this.leading = lead;
        if (text == null || text.isEmpty()) { newLine(); }
        else {
            String[] words = text.split("\\s+");
            for (String w : words) writeWord(w + " ", font, size);
            newLine();
        }
        this.fontSize = previousSize;
        this.leading = previousLeading;
    }

    private void writeWords(String text, PDFont font) throws IOException {
        if (text == null || text.isEmpty()) return;
        String[] words = text.split(" ", -1);
        for (int i = 0; i < words.length; i++) {
            String w = words[i] + (i < words.length - 1 ? " " : "");
            if (!w.isEmpty()) writeWord(w, font, fontSize);
        }
    }

    private void writeWord(String word, PDFont font, float size) throws IOException {
        float width = font.getStringWidth(word) / 1000f * size;
        if (x + width > PAGE_WIDTH - MARGIN_RIGHT) {
            x = MARGIN_LEFT;
            y -= leading;
            if (y < MARGIN_BOTTOM) newPage();
        }
        cs.beginText();
        cs.setFont(font, size);
        cs.newLineAtOffset(x, y);
        cs.showText(word);
        cs.endText();
        x += width;
    }

    public void newLine() {
        x = MARGIN_LEFT;
        y -= leading;
    }

    public void gap(float points) throws IOException {
        ensureSpace(points);
        y -= points;
    }

    public void drawInlineImage(byte[] bytes, float maxHeight) throws IOException {
        try {
            PDImageXObject img = PDImageXObject.createFromByteArray(doc, bytes, "attachment");
            float maxWidth = PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT;
            float scale = Math.min(maxWidth / img.getWidth(), maxHeight / img.getHeight());
            float w = img.getWidth() * scale;
            float h = img.getHeight() * scale;
            ensureSpace(h + 6);
            cs.drawImage(img, MARGIN_LEFT, y - h, w, h);
            y -= (h + 8);
            x = MARGIN_LEFT;
        } catch (Exception e) {
            paragraph("[No se pudo incrustar la imagen adjunta]");
        }
    }

    public void close() throws IOException {
        if (cs != null) cs.close();
    }
}
