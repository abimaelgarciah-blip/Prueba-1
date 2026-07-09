package com.gruporio.chequeomedico.service.nutricional;

import com.gruporio.chequeomedico.model.MedicalRecordData;
import com.gruporio.chequeomedico.model.nutricional.NutriConfig;
import com.gruporio.chequeomedico.service.pdf.DataUrls;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDFont;
import org.apache.pdfbox.pdmodel.font.PDType1Font;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Map;

/**
 * Puerto directo de mergeNutricional()/nutriBuildOrder() (app.js +
 * sheet-nutricional.js): anexa al PDF principal las paginas de la plantilla
 * nutricional (portadas, lista de equivalentes, anexos), la hoja de dieta
 * elegida (con el nombre del paciente sobreimpreso) y los PDFs externos que
 * el usuario haya insertado, en el mismo orden que el sitio original.
 */
public class NutricionalPdfService {

    private final Path webappRoot;

    public NutricionalPdfService(Path webappRoot) {
        this.webappRoot = webappRoot;
    }

    @SuppressWarnings("unchecked")
    public void append(PDDocument merged, NutriConfig cfg, MedicalRecordData data) throws IOException {
        Object rawNutri = data.getRaw("nutri");
        Map<String, Object> nutri = (rawNutri instanceof Map) ? (Map<String, Object>) rawNutri : Map.of();

        Map<String, Object> secciones = asMap(nutri.get("secciones"));
        String kcal = asString(nutri.get("kcal"));
        String nombre = asString(nutri.get("nombre"));
        List<Object> anexos = asList(nutri.get("anexos"));
        String extra = asString(nutri.get("extra"));
        Map<String, Object> externos = asMap(nutri.get("externos"));

        Path plantillaPath = webappRoot.resolve("nutricional/plantilla/plantilla.pdf");
        PDDocument plantilla = Files.exists(plantillaPath) ? PDDocument.load(plantillaPath.toFile()) : null;
        try {
            for (NutriConfig.Seccion s : cfg.secciones) {
                boolean incluida = secciones.containsKey(s.id) ? asBoolean(secciones.get(s.id)) : true;
                if (incluida && plantilla != null) {
                    for (int pageNum : PageRanges.parse(s.paginas)) importPlantillaPage(merged, plantilla, pageNum);
                }
                if (s.id.equals(cfg.dieta.despuesDe) && kcal != null && !kcal.isEmpty()) {
                    appendDieta(merged, cfg, kcal, nombre);
                }
                if (s.slotExterno != null) {
                    List<Object> files = asList(externos.get(s.slotExterno.id));
                    for (Object f : files) appendExterno(merged, f);
                }
            }
            List<Integer> anexoPages = new java.util.ArrayList<>();
            for (Object a : anexos) anexoPages.add((int) asDouble(a));
            java.util.Collections.sort(anexoPages);
            for (int p : anexoPages) if (plantilla != null) importPlantillaPage(merged, plantilla, p);

            for (int p : PageRanges.parse(extra)) if (plantilla != null) importPlantillaPage(merged, plantilla, p);
        } finally {
            if (plantilla != null) plantilla.close();
        }
    }

    private void importPlantillaPage(PDDocument merged, PDDocument plantilla, int pageNumOneBased) throws IOException {
        int idx = pageNumOneBased - 1;
        if (idx < 0 || idx >= plantilla.getNumberOfPages()) return;
        merged.importPage(plantilla.getPage(idx));
    }

    private void appendDieta(PDDocument merged, NutriConfig cfg, String kcal, String nombrePaciente) throws IOException {
        Path dietaPath = webappRoot.resolve("nutricional/dietas/" + kcal + ".pdf");
        if (!Files.exists(dietaPath)) return;
        try (PDDocument dietaDoc = PDDocument.load(dietaPath.toFile())) {
            String nombre = (nombrePaciente == null || nombrePaciente.isEmpty()) ? "" : nombrePaciente;
            if (!nombre.isEmpty() && dietaDoc.getNumberOfPages() > 0) {
                PDPage page = dietaDoc.getPage(0);
                PDFont font = PDType1Font.HELVETICA;
                try (PDPageContentStream cs = new PDPageContentStream(
                        dietaDoc, page, PDPageContentStream.AppendMode.APPEND, true, true)) {
                    cs.beginText();
                    cs.setFont(font, cfg.dieta.nombreTamano);
                    cs.newLineAtOffset(cfg.dieta.nombreX, cfg.dieta.nombreY);
                    cs.showText(nombre);
                    cs.endText();
                }
            }
            for (PDPage p : dietaDoc.getPages()) merged.importPage(p);
        }
    }

    private void appendExterno(PDDocument merged, Object fileEntry) throws IOException {
        if (!(fileEntry instanceof Map)) return;
        @SuppressWarnings("unchecked")
        Map<String, Object> m = (Map<String, Object>) fileEntry;
        String dataUrl = asString(m.get("data"));
        byte[] bytes = DataUrls.decode(dataUrl);
        if (bytes == null) return;
        try (PDDocument ext = PDDocument.load(bytes)) {
            for (PDPage p : ext.getPages()) merged.importPage(p);
        }
    }

    @SuppressWarnings("unchecked")
    private static Map<String, Object> asMap(Object o) { return (o instanceof Map) ? (Map<String, Object>) o : Map.of(); }
    @SuppressWarnings("unchecked")
    private static List<Object> asList(Object o) { return (o instanceof List) ? (List<Object>) o : List.of(); }
    private static String asString(Object o) { return o == null ? null : String.valueOf(o); }
    private static boolean asBoolean(Object o) { return Boolean.TRUE.equals(o) || "true".equals(o); }
    private static double asDouble(Object o) { return (o instanceof Number) ? ((Number) o).doubleValue() : Double.parseDouble(String.valueOf(o)); }
}
