package com.gruporio.chequeomedico.service.pdf;

import com.gruporio.chequeomedico.model.*;
import com.gruporio.chequeomedico.model.content.Attachment;
import com.gruporio.chequeomedico.model.content.ContentBlock;
import com.gruporio.chequeomedico.model.content.PdfReplace;
import com.gruporio.chequeomedico.service.ImageResolver;
import com.gruporio.chequeomedico.service.nutricional.NutricionalPdfService;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.graphics.image.PDImageXObject;

import java.io.IOException;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Map;

/**
 * Genera el PDF completo de un expediente (equivalente a exportPDF() +
 * mergeNutricional() en app.js): recorre SheetRegistry.SHEETS en orden,
 * omite las secciones marcadas como omitidas, dibuja portadas y hojas de
 * contenido, sustituye por PDFs cargados donde aplique, y anexa al final la
 * Evaluacion Nutricional.
 */
public class PdfExportService {

    private final Path webappRoot; // para resolver imagenes empaquetadas (assets/defaults/*) y la plantilla nutricional

    public PdfExportService(Path webappRoot) {
        this.webappRoot = webappRoot;
    }

    public void export(MedicalRecord record, Map<String, String> appDefaults, OutputStream out) throws Exception {
        MedicalRecordData data = record.getData();
        String sex = record.getSex();

        try (PDDocument doc = new PDDocument()) {
            for (SheetDefinition sheet : SheetRegistry.SHEETS) {
                if (sheet instanceof NutricionalSheetDefinition) continue; // se anexa al final
                if (sheet.getSection() != null && isSectionOmitted(data, sheet.getSection())) continue;

                if (sheet instanceof CoverSheetDefinition) {
                    drawCoverPage(doc, data, appDefaults, ((CoverSheetDefinition) sheet).getCoverKey());
                } else if (sheet instanceof ContentSheetDefinition) {
                    drawContentSheet(doc, (ContentSheetDefinition) sheet, data, appDefaults, sex);
                }
            }

            NutricionalSheetDefinition nutriDef = findNutricional();
            if (nutriDef != null) {
                NutricionalPdfService nutriService = new NutricionalPdfService(webappRoot);
                nutriService.append(doc, nutriDef.getConfig(), data);
            }

            doc.save(out);
        }
    }

    private NutricionalSheetDefinition findNutricional() {
        for (SheetDefinition s : SheetRegistry.SHEETS) {
            if (s instanceof NutricionalSheetDefinition) return (NutricionalSheetDefinition) s;
        }
        return null;
    }

    public static boolean isSectionOmitted(MedicalRecordData data, String section) {
        return data.isTrue("skip-section-" + section);
    }

    // ---------------------------------------------------------------
    // Portadas: la imagen llena la pagina completa (contain + centrado).
    // ---------------------------------------------------------------
    private void drawCoverPage(PDDocument doc, MedicalRecordData data, Map<String, String> appDefaults, String coverKey) throws IOException {
        PDPage page = new PDPage(PDRectangle.LETTER);
        doc.addPage(page);
        byte[] bytes = resolveImageBytes(data, appDefaults, coverKey);
        if (bytes == null) return;
        try (PDPageContentStream cs = new PDPageContentStream(doc, page)) {
            PDImageXObject img = PDImageXObject.createFromByteArray(doc, bytes, coverKey);
            float pw = PDRectangle.LETTER.getWidth();
            float ph = PDRectangle.LETTER.getHeight();
            float imgRatio = (float) img.getWidth() / img.getHeight();
            float boxRatio = pw / ph;
            float w, h;
            if (imgRatio > boxRatio) { w = pw; h = pw / imgRatio; } else { h = ph; w = ph * imgRatio; }
            cs.drawImage(img, (pw - w) / 2, (ph - h) / 2, w, h);
        } catch (Exception e) {
            // portada sin imagen valida: se deja la pagina en blanco, igual que el placeholder original.
        }
    }

    // ---------------------------------------------------------------
    // Hojas de contenido
    // ---------------------------------------------------------------
    private void drawContentSheet(PDDocument doc, ContentSheetDefinition sheet, MedicalRecordData data,
                                   Map<String, String> appDefaults, String sex) throws Exception {
        // ¿Alguno de los bloques PdfReplace de esta hoja tiene un PDF cargado que sustituye el formato?
        PdfReplace replace = findPdfReplace(sheet.getBlocks());
        if (replace != null) {
            String uploaded = data.get(replace.getPdfKey());
            if (uploaded != null && !uploaded.isEmpty() && DataUrls.isDataUrl(uploaded)) {
                embedUploadedPdf(doc, uploaded);
                return;
            }
        }

        byte[] membreteBytes = resolveImageBytes(data, appDefaults, sheet.getMembreteKey());
        PdfTextFlow flow = new PdfTextFlow(doc, membreteBytes == null ? null : () -> membreteBytes);
        try {
            ContentBlockPdfRenderer renderer = new ContentBlockPdfRenderer(flow, data, sex);
            flow.heading(sheet.getLabel().toUpperCase());
            renderer.render(sheet.getBlocks());
        } finally {
            flow.close();
        }
    }

    private PdfReplace findPdfReplace(List<ContentBlock> blocks) {
        for (ContentBlock b : blocks) if (b instanceof PdfReplace) return (PdfReplace) b;
        return null;
    }

    private void embedUploadedPdf(PDDocument doc, String dataUrl) throws IOException {
        byte[] bytes = DataUrls.decode(dataUrl);
        if (bytes == null) return;
        try (PDDocument uploaded = PDDocument.load(bytes)) {
            for (PDPage p : uploaded.getPages()) {
                doc.importPage(p);
            }
        }
    }

    /** Attachment de una imagen (no PDF) suelta, fuera del flujo normal de bloques (ej. adjuntos con pdfKey). */
    public static byte[] resolveAttachmentBytes(MedicalRecordData data, Attachment att) {
        String url = data.get(att.getStateKey());
        return url == null ? null : DataUrls.decode(url);
    }

    private byte[] resolveImageBytes(MedicalRecordData data, Map<String, String> appDefaults, String imageKey) {
        String resolved = ImageResolver.resolve(data, appDefaults, imageKey);
        if (resolved == null || resolved.isEmpty()) return null;
        if (DataUrls.isDataUrl(resolved)) return DataUrls.decode(resolved);
        // Ruta relativa de un recurso empaquetado con la app (ej. assets/defaults/cover-1.png)
        try {
            Path p = webappRoot.resolve(resolved);
            if (Files.exists(p)) return Files.readAllBytes(p);
        } catch (IOException e) {
            // se ignora: portada/membrete quedara sin imagen
        }
        return null;
    }
}
