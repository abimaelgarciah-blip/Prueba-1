package com.rio.chequeo.service;

import com.openhtmltopdf.pdfboxout.PdfRendererBuilder;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.util.Base64;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Servicio de generación de PDF para el sistema RIO - Chequeo Médico.
 *
 * <p>Usa <a href="https://github.com/danfickle/openhtmltopdf">OpenHTMLtoPDF</a>
 * ({@link PdfRendererBuilder}) para convertir HTML a PDF.</p>
 *
 * <p>Flujo principal:
 * <ol>
 *   <li>El Servlet renderiza cada JSP a un {@code String} HTML.</li>
 *   <li>Agrupa los HTMLs en una lista de {@link SheetData}.</li>
 *   <li>Llama a {@link #generateFullPDF(List)} para obtener el PDF completo.</li>
 * </ol>
 * </p>
 */
public class PDFService {

    private static final Logger LOGGER = Logger.getLogger(PDFService.class.getName());

    // Márgenes en mm
    private static final String MARGIN_TOP    = "30mm";
    private static final String MARGIN_BOTTOM = "40mm";
    private static final String MARGIN_LEFT   = "15mm";
    private static final String MARGIN_RIGHT  = "15mm";

    // -------------------------------------------------------------------------
    // Clases de datos
    // -------------------------------------------------------------------------

    /**
     * Contenedor de datos para una hoja del expediente.
     *
     * <ul>
     *   <li>{@code type} — {@code "cover"} para portadas, {@code "content"} para hojas de contenido.</li>
     *   <li>{@code htmlContent} — HTML ya renderizado desde el JSP (solo para tipo {@code "content"}).</li>
     *   <li>{@code coverImage} — bytes del BLOB de imagen (solo para tipo {@code "cover"}).</li>
     *   <li>{@code membreteImage} — bytes del BLOB de membrete usado como fondo (solo para tipo {@code "content"}).</li>
     * </ul>
     */
    public static class SheetData {
        /** Tipo de hoja: {@code "cover"} o {@code "content"}. */
        public String type;
        /** HTML ya renderizado del JSP (relevante para {@code "content"}). */
        public String htmlContent;
        /** Imagen BLOB de portada (relevante para {@code "cover"}). */
        public byte[] coverImage;
        /** Imagen BLOB de membrete (relevante para {@code "content"}). */
        public byte[] membreteImage;

        /** Constructor vacío. */
        public SheetData() {}

        /** Constructor de conveniencia para hojas de contenido. */
        public SheetData(String htmlContent, byte[] membreteImage) {
            this.type          = "content";
            this.htmlContent   = htmlContent;
            this.membreteImage = membreteImage;
        }

        /** Constructor de conveniencia para portadas. */
        public SheetData(byte[] coverImage) {
            this.type       = "cover";
            this.coverImage = coverImage;
        }
    }

    // -------------------------------------------------------------------------
    // API pública
    // -------------------------------------------------------------------------

    /**
     * Genera el PDF completo iterando todas las hojas.
     *
     * <ul>
     *   <li>Portadas: imagen BLOB renderizada como página completa sin márgenes.</li>
     *   <li>Contenido: HTML + membrete como fondo al 70 % de opacidad; márgenes
     *       top=30 mm, bottom=40 mm, left=15 mm, right=15 mm.</li>
     * </ul>
     *
     * @param sheets lista ordenada de hojas del expediente
     * @return bytes del PDF generado
     * @throws Exception si ocurre un error durante la generación
     */
    public byte[] generateFullPDF(List<SheetData> sheets) throws Exception {
        if (sheets == null || sheets.isEmpty()) {
            throw new IllegalArgumentException("La lista de hojas no puede estar vacía");
        }

        // Construir un único documento HTML que incluya todas las páginas.
        // Cada hoja se separa con un page-break; las portadas usan @page sin márgenes
        // y las hojas de contenido usan @page con los márgenes configurados.
        StringBuilder fullHtml = new StringBuilder();
        fullHtml.append("<!DOCTYPE html><html><head><meta charset=\"UTF-8\"/>")
                .append("<style>")
                .append("  @page cover-page { margin: 0; size: letter; }")
                .append("  @page content-page {")
                .append("    margin-top: ").append(MARGIN_TOP).append(";")
                .append("    margin-bottom: ").append(MARGIN_BOTTOM).append(";")
                .append("    margin-left: ").append(MARGIN_LEFT).append(";")
                .append("    margin-right: ").append(MARGIN_RIGHT).append(";")
                .append("    size: letter;")
                .append("  }")
                .append("  .cover-page { page: cover-page; page-break-after: always; }")
                .append("  .content-page { page: content-page; page-break-after: always; position: relative; }")
                .append("  .membrete-bg {")
                .append("    position: fixed; top: 0; left: 0; width: 100%; height: 100%;")
                .append("    opacity: 0.70; z-index: -1;")
                .append("  }")
                .append("  .cover-img { width: 100%; height: 100vh; object-fit: cover; display: block; }")
                .append("</style></head><body>");

        for (int i = 0; i < sheets.size(); i++) {
            SheetData sheet = sheets.get(i);
            boolean isLast = (i == sheets.size() - 1);

            if ("cover".equals(sheet.type)) {
                fullHtml.append(buildCoverPageHtml(sheet.coverImage, isLast));
            } else {
                fullHtml.append(buildContentPageHtml(sheet.htmlContent, sheet.membreteImage, isLast));
            }
        }

        fullHtml.append("</body></html>");

        return renderHtmlToPdf(fullHtml.toString());
    }

    /**
     * Genera una sola hoja de contenido como PDF.
     *
     * @param htmlContent   HTML ya renderizado del JSP
     * @param membreteImage bytes del BLOB del membrete (puede ser {@code null})
     * @return bytes del PDF generado
     * @throws Exception si ocurre un error durante la generación
     */
    public byte[] generateSheetPDF(String htmlContent, byte[] membreteImage) throws Exception {
        if (htmlContent == null || htmlContent.isEmpty()) {
            throw new IllegalArgumentException("El contenido HTML no puede estar vacío");
        }

        String html = "<!DOCTYPE html><html><head><meta charset=\"UTF-8\"/>" +
                "<style>" +
                "  @page {" +
                "    margin-top: " + MARGIN_TOP + ";" +
                "    margin-bottom: " + MARGIN_BOTTOM + ";" +
                "    margin-left: " + MARGIN_LEFT + ";" +
                "    margin-right: " + MARGIN_RIGHT + ";" +
                "    size: letter;" +
                "  }" +
                "  .membrete-bg { position: fixed; top:0; left:0; width:100%; height:100%; opacity:0.70; z-index:-1; }" +
                "</style></head><body>" +
                buildContentPageHtml(htmlContent, membreteImage, true) +
                "</body></html>";

        return renderHtmlToPdf(html);
    }

    /**
     * Genera una sola portada como PDF desde imagen BLOB.
     *
     * @param coverImage bytes del BLOB de la portada
     * @return bytes del PDF generado
     * @throws Exception si ocurre un error durante la generación
     */
    public byte[] generateCoverPagePDF(byte[] coverImage) throws Exception {
        if (coverImage == null || coverImage.length == 0) {
            throw new IllegalArgumentException("La imagen de portada no puede estar vacía");
        }

        String html = "<!DOCTYPE html><html><head><meta charset=\"UTF-8\"/>" +
                "<style>" +
                "  @page { margin: 0; size: letter; }" +
                "  body { margin: 0; padding: 0; }" +
                "  .cover-img { width: 100%; height: 100vh; object-fit: cover; display: block; }" +
                "</style></head><body>" +
                buildCoverPageHtml(coverImage, true) +
                "</body></html>";

        return renderHtmlToPdf(html);
    }

    // -------------------------------------------------------------------------
    // Métodos auxiliares de construcción HTML
    // -------------------------------------------------------------------------

    /**
     * Construye el fragmento HTML para una página de portada.
     */
    private String buildCoverPageHtml(byte[] coverImage, boolean isLast) {
        StringBuilder sb = new StringBuilder();
        sb.append("<div class=\"cover-page\"");
        if (isLast) {
            sb.append(" style=\"page-break-after:avoid\"");
        }
        sb.append(">");

        if (coverImage != null && coverImage.length > 0) {
            String base64 = Base64.getEncoder().encodeToString(coverImage);
            String mimeType = detectMimeType(coverImage);
            sb.append("<img class=\"cover-img\" src=\"data:")
              .append(mimeType)
              .append(";base64,")
              .append(base64)
              .append("\" alt=\"Portada\"/>");
        } else {
            sb.append("<div style=\"width:100%;height:100vh;background:#f0f0f0;\"></div>");
        }

        sb.append("</div>");
        return sb.toString();
    }

    /**
     * Construye el fragmento HTML para una hoja de contenido, inyectando
     * el membrete como imagen de fondo al 70 % de opacidad.
     */
    private String buildContentPageHtml(String htmlContent, byte[] membreteImage, boolean isLast) {
        StringBuilder sb = new StringBuilder();
        sb.append("<div class=\"content-page\"");
        if (isLast) {
            sb.append(" style=\"page-break-after:avoid\"");
        }
        sb.append(">");

        // Membrete como fondo
        if (membreteImage != null && membreteImage.length > 0) {
            String base64 = Base64.getEncoder().encodeToString(membreteImage);
            String mimeType = detectMimeType(membreteImage);
            sb.append("<img class=\"membrete-bg\" src=\"data:")
              .append(mimeType)
              .append(";base64,")
              .append(base64)
              .append("\" alt=\"\"/>");
        }

        // Contenido HTML del JSP
        if (htmlContent != null && !htmlContent.isEmpty()) {
            // Extraer solo el body si el HTML está completo
            sb.append(extractBody(htmlContent));
        }

        sb.append("</div>");
        return sb.toString();
    }

    /**
     * Extrae el contenido del {@code <body>} si el HTML es un documento completo,
     * o devuelve el HTML tal cual si es un fragmento.
     */
    private String extractBody(String html) {
        String lower = html.toLowerCase();
        int bodyStart = lower.indexOf("<body");
        int bodyEnd   = lower.lastIndexOf("</body>");

        if (bodyStart >= 0 && bodyEnd > bodyStart) {
            // Encontrar el cierre del tag <body ...>
            int tagClose = lower.indexOf('>', bodyStart);
            if (tagClose > 0 && tagClose < bodyEnd) {
                return html.substring(tagClose + 1, bodyEnd);
            }
        }
        return html;
    }

    /**
     * Detecta el MIME type de una imagen a partir de sus primeros bytes (magic numbers).
     */
    private String detectMimeType(byte[] data) {
        if (data == null || data.length < 4) {
            return "image/png";
        }
        // PNG: 89 50 4E 47
        if (data[0] == (byte) 0x89 && data[1] == 0x50 && data[2] == 0x4E && data[3] == 0x47) {
            return "image/png";
        }
        // JPEG: FF D8 FF
        if (data[0] == (byte) 0xFF && data[1] == (byte) 0xD8 && data[2] == (byte) 0xFF) {
            return "image/jpeg";
        }
        // GIF: 47 49 46 38
        if (data[0] == 0x47 && data[1] == 0x49 && data[2] == 0x46 && data[3] == 0x38) {
            return "image/gif";
        }
        // Default PNG
        return "image/png";
    }

    // -------------------------------------------------------------------------
    // Renderizado con OpenHTMLtoPDF
    // -------------------------------------------------------------------------

    /**
     * Convierte un documento HTML completo a bytes PDF usando {@link PdfRendererBuilder}.
     *
     * @param html documento HTML completo (con {@code <!DOCTYPE html>})
     * @return bytes del PDF resultante
     * @throws Exception si falla la conversión
     */
    private byte[] renderHtmlToPdf(String html) throws Exception {
        try (ByteArrayOutputStream os = new ByteArrayOutputStream()) {
            PdfRendererBuilder builder = new PdfRendererBuilder();
            builder.useFastMode();
            builder.withHtmlContent(html, null);
            builder.toStream(os);
            builder.run();
            return os.toByteArray();
        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "Error generando PDF con OpenHTMLtoPDF", e);
            throw e;
        }
    }
}
