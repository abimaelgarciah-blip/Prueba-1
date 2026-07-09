package com.gruporio.chequeomedico.service.html;

import com.gruporio.chequeomedico.model.MedicalRecordData;
import com.gruporio.chequeomedico.model.content.*;

import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Genera el HTML editable de una hoja de contenido a partir de su lista de
 * ContentBlock (puerto directo de templates.js: los mismos ids/clases CSS,
 * para poder reusar css/styles.css sin cambios). Es el "render()" de cada
 * sheetN.js, ahora del lado del servidor (JSP solo hace `${sheetHtml}`).
 *
 * El autoguardado de cada campo (equivalente a saveFieldState()) se hace con
 * JS generico (ver js/sheet-form.js) que escucha "input"/"change" sobre
 * cualquier elemento con [name] dentro de #sheet-container y hace POST a
 * /patients/save-field — no hay JS por-campo aqui, todo es por convencion de
 * atributos name/id/data-*.
 */
public class ContentBlockHtmlRenderer {

    public String render(List<ContentBlock> blocks, MedicalRecordData data, String sex) {
        StringBuilder sb = new StringBuilder();
        Set<String> omitted = collectOmittedGroups(blocks, data);
        renderBlocks(sb, blocks, data, sex, omitted);
        return sb.toString();
    }

    private Set<String> collectOmittedGroups(List<ContentBlock> blocks, MedicalRecordData data) {
        Set<String> out = new HashSet<>();
        for (ContentBlock b : blocks) {
            if (b instanceof OmitToggle) {
                OmitToggle t = (OmitToggle) b;
                if (data.isOmitted(t.getOmitFieldId())) out.add(t.getTargetGroupId());
            }
        }
        return out;
    }

    private void renderBlocks(StringBuilder sb, List<ContentBlock> blocks, MedicalRecordData data, String sex, Set<String> omitted) {
        for (ContentBlock b : blocks) renderBlock(sb, b, data, sex, omitted);
    }

    private void renderBlock(StringBuilder sb, ContentBlock block, MedicalRecordData data, String sex, Set<String> omitted) {
        if (block instanceof Heading) {
            sb.append("<h1 class=\"ctt-h1\">").append(esc(((Heading) block).getText())).append("</h1>\n");

        } else if (block instanceof Paragraph) {
            sb.append("<p class=\"ctt-p\">");
            renderParts(sb, ((Paragraph) block).getParts(), data);
            sb.append("</p>\n");

        } else if (block instanceof StudyLine) {
            StudyLine sl = (StudyLine) block;
            boolean om = data.isOmitted(sl.getOmitFieldId());
            sb.append("<div class=\"ctt-study-line").append(om ? " ctt-omitted" : "").append("\" id=\"block-")
              .append(esc(sl.getOmitId())).append("\">\n");
            sb.append("<label class=\"ctt-omit ctt-omit-inline\"><input type=\"checkbox\" name=\"")
              .append(esc(sl.getOmitFieldId())).append("\" value=\"true\"").append(om ? " checked" : "")
              .append(" /><span>Omitir</span></label>\n");
            sb.append("<p class=\"ctt-p ctt-study-text\">");
            renderParts(sb, sl.getParts(), data);
            sb.append("</p></div>\n");

        } else if (block instanceof EditableFixedText) {
            EditableFixedText fx = (EditableFixedText) block;
            String value = data.get(fx.getId(), fx.getDefaultText());
            sb.append("<div class=\"ctt-fixed\"><textarea class=\"ctt-fixed-textarea\" name=\"")
              .append(esc(fx.getId())).append("\" id=\"").append(esc(fx.getId())).append("\">")
              .append(esc(value)).append("</textarea></div>\n");

        } else if (block instanceof DynamicBlock) {
            renderDynamicBlock(sb, (DynamicBlock) block, data);

        } else if (block instanceof NumberedList) {
            renderNumberedList(sb, (NumberedList) block, data);

        } else if (block instanceof Attachment) {
            renderAttachment(sb, (Attachment) block, data);

        } else if (block instanceof PdfReplace) {
            renderPdfReplace(sb, (PdfReplace) block, data, sex, omitted);

        } else if (block instanceof SexConditional) {
            SexConditional sc = (SexConditional) block;
            boolean show = sc.getSex().equals(sexCode(sex));
            sb.append("<div class=\"ctt-conditional ctt-sex-").append(sc.getSex()).append("\"")
              .append(show ? "" : " style=\"display:none\"").append(">\n");
            renderBlock(sb, sc.getInner(), data, sex, omitted);
            sb.append("</div>\n");

        } else if (block instanceof Group) {
            Group g = (Group) block;
            boolean om = g.getDomId() != null && omitted.contains(g.getDomId());
            sb.append("<div class=\"ctt-group").append(om ? " ctt-omitted" : "").append("\" id=\"block-")
              .append(esc(g.getDomId())).append("\">\n");
            renderBlocks(sb, g.getChildren(), data, sex, collectOmittedGroups(g.getChildren(), data));
            sb.append("</div>\n");

        } else if (block instanceof OmitToggle) {
            OmitToggle t = (OmitToggle) block;
            boolean om = data.isOmitted(t.getOmitFieldId());
            sb.append("<label class=\"ctt-omit\"><input type=\"checkbox\" name=\"").append(esc(t.getOmitFieldId()))
              .append("\" value=\"true\"").append(om ? " checked" : "").append(" data-toggles-group=\"")
              .append(esc(t.getTargetGroupId())).append("\" /><span>").append(esc(t.getLabel())).append("</span></label>\n");
        }
    }

    private void renderParts(StringBuilder sb, List<Object> parts, MedicalRecordData data) {
        for (Object part : parts) {
            if (part instanceof Bold) {
                sb.append("<strong class=\"ctt-sub-line\">").append(esc(((Bold) part).getText())).append("</strong>");
            } else if (part instanceof Field) {
                renderField(sb, (Field) part, data);
            } else {
                sb.append(esc(String.valueOf(part)));
            }
        }
    }

    private void renderField(StringBuilder sb, Field f, MedicalRecordData data) {
        String value = data.get(f.getId(), "");
        String sizeClass = "sm".equals(f.getSize()) ? " ctt-inline-sm" : " ctt-inline-md";
        switch (f.getKind()) {
            case TEXTAREA:
                sb.append("<textarea class=\"ctt-textarea\" name=\"").append(esc(f.getId())).append("\" id=\"")
                  .append(esc(f.getId())).append("\" placeholder=\"").append(esc(f.getPlaceholder())).append("\">")
                  .append(esc(value)).append("</textarea>");
                break;
            case SELECT:
                sb.append("<select class=\"ctt-inline\" name=\"").append(esc(f.getId())).append("\" id=\"")
                  .append(esc(f.getId())).append("\"><option value=\"\">--</option>");
                for (String opt : f.getOptions()) {
                    sb.append("<option value=\"").append(esc(opt)).append("\"")
                      .append(opt.equals(value) ? " selected" : "").append(">").append(esc(opt)).append("</option>");
                }
                sb.append("</select>");
                break;
            case DATE:
                sb.append("<input type=\"date\" class=\"ctt-inline\" name=\"").append(esc(f.getId())).append("\" id=\"")
                  .append(esc(f.getId())).append("\" value=\"").append(esc(value)).append("\" />");
                break;
            default:
                sb.append("<input type=\"text\" class=\"ctt-inline").append(sizeClass).append("\" name=\"")
                  .append(esc(f.getId())).append("\" id=\"").append(esc(f.getId())).append("\" placeholder=\"")
                  .append(esc(f.getPlaceholder())).append("\" value=\"").append(esc(value)).append("\" />");
        }
    }

    @SuppressWarnings("unchecked")
    private void renderDynamicBlock(StringBuilder sb, DynamicBlock block, MedicalRecordData data) {
        Object raw = data.getRaw(block.getStateKey());
        List<Object> items = (raw instanceof List) ? (List<Object>) raw : List.of();
        sb.append("<div class=\"ctt-dynamic\" data-dynamic-key=\"").append(esc(block.getStateKey())).append("\">\n");
        int i = 0;
        for (Object item : items) {
            Map<String, Object> m = (item instanceof Map) ? (Map<String, Object>) item : Map.of();
            sb.append("<div class=\"ctt-dynamic-item\" data-index=\"").append(i).append("\">\n");
            sb.append("<input type=\"text\" class=\"ctt-dynamic-title\" placeholder=\"SUBTÍTULO\" name=\"")
              .append(esc(block.getStateKey())).append("[").append(i).append("].title\" value=\"")
              .append(esc(str(m.get("title")))).append("\" />\n");
            sb.append("<textarea class=\"ctt-dynamic-body\" placeholder=\"Contenido de desarrollo...\" name=\"")
              .append(esc(block.getStateKey())).append("[").append(i).append("].body\">")
              .append(esc(str(m.get("body")))).append("</textarea>\n");
            sb.append("<button type=\"button\" class=\"btn-remove btn-dynamic-remove\" data-remove-dynamic-item=\"")
              .append(esc(block.getStateKey())).append("\" data-index=\"").append(i).append("\">✕</button>\n");
            sb.append("</div>\n");
            i++;
        }
        sb.append("</div>\n<button type=\"button\" class=\"btn-secondary btn-add-block\" data-add-dynamic-item=\"")
          .append(esc(block.getStateKey())).append("\">").append(esc(block.getAddButtonLabel())).append("</button>\n");
    }

    @SuppressWarnings("unchecked")
    private void renderNumberedList(StringBuilder sb, NumberedList block, MedicalRecordData data) {
        Object raw = data.getRaw(block.getStateKey());
        List<Object> items = (raw instanceof List) ? (List<Object>) raw : List.of();
        sb.append("<ol class=\"ctt-numbered\" data-numbered-key=\"").append(esc(block.getStateKey())).append("\">\n");
        int i = 0;
        for (Object item : items) {
            sb.append("<li class=\"ctt-numbered-item\">\n<textarea class=\"ctt-numbered-body\" placeholder=\"")
              .append(esc(block.getPlaceholder())).append("\" name=\"").append(esc(block.getStateKey()))
              .append("[").append(i).append("]\">").append(esc(str(item))).append("</textarea>\n")
              .append("<button type=\"button\" class=\"btn-remove btn-dynamic-remove\" data-remove-numbered-item=\"")
              .append(esc(block.getStateKey())).append("\" data-index=\"").append(i).append("\">✕</button>\n</li>\n");
            i++;
        }
        sb.append("</ol>\n<button type=\"button\" class=\"btn-secondary btn-add-block\" data-add-numbered-item=\"")
          .append(esc(block.getStateKey())).append("\">+ Agregar sugerencia</button>\n");
    }

    private void renderAttachment(StringBuilder sb, Attachment att, MedicalRecordData data) {
        String img = data.get(att.getStateKey());
        sb.append("<div class=\"ctt-attachment\" data-attachment-key=\"").append(esc(att.getStateKey())).append("\">\n");
        if (img != null && !img.isEmpty()) {
            sb.append("<img src=\"").append(esc(img)).append("\" class=\"ctt-attachment-img\" />\n");
        }
        sb.append("<div class=\"ctt-attachment-actions\">\n");
        sb.append("<input type=\"file\" accept=\"image/*\" data-attachment-input=\"").append(esc(att.getStateKey())).append("\" />\n");
        if (img != null && !img.isEmpty()) {
            sb.append("<button type=\"button\" class=\"btn-remove\" data-attachment-remove=\"").append(esc(att.getStateKey())).append("\">✕</button>\n");
        }
        if (att.getPdfKey() != null) {
            sb.append("<input type=\"file\" accept=\"application/pdf\" data-pdf-replace-input=\"").append(esc(att.getPdfKey())).append("\" title=\"Cargar reporte PDF (sustituye el formato)\" />\n");
        }
        sb.append("</div></div>\n");
    }

    private void renderPdfReplace(StringBuilder sb, PdfReplace pr, MedicalRecordData data, String sex, Set<String> omitted) {
        String pdf = data.get(pr.getPdfKey());
        boolean hasPdf = pdf != null && !pdf.isEmpty();
        sb.append("<div class=\"ctt-pdf-replace\">\n");
        if (hasPdf) {
            sb.append("<p class=\"ctt-pdf-note no-print\">📄 Se está usando el PDF cargado en lugar del formato. "
                    + "Sube otro para reemplazarlo, o quítalo para volver a editar el formato aquí.</p>\n");
            sb.append("<button type=\"button\" class=\"btn-remove\" data-pdf-replace-remove=\"").append(esc(pr.getPdfKey())).append("\">✕ Quitar PDF (volver al formato)</button>\n");
        } else {
            sb.append("<div class=\"ctt-format-area\">\n");
            renderBlocks(sb, pr.getFormatBlocks(), data, sex, omitted);
            sb.append("</div>\n");
        }
        sb.append("</div>\n");
    }

    private static String sexCode(String sex) {
        if ("Masculino".equals(sex)) return "M";
        if ("Femenino".equals(sex)) return "F";
        return "";
    }

    private static String str(Object o) { return o == null ? "" : String.valueOf(o); }

    private static String esc(String s) {
        if (s == null) return "";
        StringBuilder out = new StringBuilder(s.length());
        for (char c : s.toCharArray()) {
            switch (c) {
                case '&': out.append("&amp;"); break;
                case '<': out.append("&lt;"); break;
                case '>': out.append("&gt;"); break;
                case '"': out.append("&quot;"); break;
                case '\'': out.append("&#39;"); break;
                default: out.append(c);
            }
        }
        return out.toString();
    }
}
