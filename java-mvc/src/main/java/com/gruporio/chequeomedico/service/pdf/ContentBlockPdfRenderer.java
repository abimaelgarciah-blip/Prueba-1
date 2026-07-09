package com.gruporio.chequeomedico.service.pdf;

import com.gruporio.chequeomedico.model.MedicalRecordData;
import com.gruporio.chequeomedico.model.content.*;

import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Recorre una lista de ContentBlock (ver SheetRegistry) y dibuja su
 * contenido con PdfTextFlow, resolviendo cada valor desde MedicalRecordData.
 * Es el equivalente, para el PDF, de lo que hacia sheet.render() + el
 * volcado de valores de appState en exportPDF() (app.js).
 */
public class ContentBlockPdfRenderer {

    private final PdfTextFlow flow;
    private final MedicalRecordData data;
    private final String patientSex; // "Masculino" | "Femenino" | null

    public ContentBlockPdfRenderer(PdfTextFlow flow, MedicalRecordData data, String patientSex) {
        this.flow = flow;
        this.data = data;
        this.patientSex = patientSex;
    }

    public void render(List<ContentBlock> blocks) throws Exception {
        Set<String> omittedGroups = collectOmittedGroups(blocks);
        renderBlocks(blocks, omittedGroups);
    }

    private Set<String> collectOmittedGroups(List<ContentBlock> blocks) {
        Set<String> out = new HashSet<>();
        for (ContentBlock b : blocks) {
            if (b instanceof OmitToggle) {
                OmitToggle t = (OmitToggle) b;
                if (data.isOmitted(t.getOmitFieldId())) out.add(t.getTargetGroupId());
            }
        }
        return out;
    }

    private void renderBlocks(List<ContentBlock> blocks, Set<String> omittedGroups) throws Exception {
        for (ContentBlock block : blocks) {
            renderBlock(block, omittedGroups);
        }
    }

    private void renderBlock(ContentBlock block, Set<String> omittedGroups) throws Exception {
        if (block instanceof Heading) {
            flow.heading(((Heading) block).getText());

        } else if (block instanceof Paragraph) {
            flow.drawRuns(resolveParts(((Paragraph) block).getParts()));

        } else if (block instanceof StudyLine) {
            StudyLine sl = (StudyLine) block;
            if (data.isOmitted(sl.getOmitFieldId())) return;
            flow.drawRuns(resolveParts(sl.getParts()));

        } else if (block instanceof EditableFixedText) {
            EditableFixedText fx = (EditableFixedText) block;
            flow.paragraph(data.get(fx.getId(), fx.getDefaultText()));

        } else if (block instanceof DynamicBlock) {
            renderDynamicBlock((DynamicBlock) block);

        } else if (block instanceof NumberedList) {
            renderNumberedList((NumberedList) block);

        } else if (block instanceof Attachment) {
            renderAttachment((Attachment) block);

        } else if (block instanceof PdfReplace) {
            // El reemplazo por PDF cargado (embebido de paginas completas) lo resuelve
            // PdfExportService antes de llegar aqui; si llegamos a este punto es porque
            // NO hay PDF de reemplazo y toca dibujar el formato normal.
            renderBlocks(((PdfReplace) block).getFormatBlocks(), omittedGroups);

        } else if (block instanceof SexConditional) {
            SexConditional sc = (SexConditional) block;
            if (sc.getSex().equals(sexCode())) {
                renderBlock(sc.getInner(), omittedGroups);
            }

        } else if (block instanceof Group) {
            Group g = (Group) block;
            if (g.getDomId() != null && omittedGroups.contains(g.getDomId())) return;
            renderBlocks(g.getChildren(), collectOmittedGroups(g.getChildren()));

        } else if (block instanceof OmitToggle) {
            // No dibuja nada por si mismo; ya se proceso en collectOmittedGroups.
        }
    }

    private String sexCode() {
        if ("Masculino".equals(patientSex)) return "M";
        if ("Femenino".equals(patientSex)) return "F";
        return "";
    }

    private List<Object> resolveParts(List<Object> parts) {
        List<Object> out = new java.util.ArrayList<>();
        for (Object part : parts) {
            if (part instanceof Field) {
                out.add(data.get(((Field) part).getId(), ""));
            } else {
                out.add(part);
            }
        }
        return out;
    }

    @SuppressWarnings("unchecked")
    private void renderDynamicBlock(DynamicBlock block) throws Exception {
        Object raw = data.getRaw(block.getStateKey());
        if (!(raw instanceof List)) return;
        for (Object item : (List<Object>) raw) {
            if (!(item instanceof Map)) continue;
            Map<String, Object> m = (Map<String, Object>) item;
            String title = str(m.get("title"));
            String body = str(m.get("body"));
            if (!title.isEmpty()) flow.paragraph(title.toUpperCase(), "");
            if (!body.isEmpty()) flow.paragraph(body);
        }
    }

    @SuppressWarnings("unchecked")
    private void renderNumberedList(NumberedList block) throws Exception {
        Object raw = data.getRaw(block.getStateKey());
        if (!(raw instanceof List)) return;
        int i = 1;
        for (Object item : (List<Object>) raw) {
            String text = str(item);
            if (!text.isEmpty()) flow.paragraph(i + ".", text);
            i++;
        }
    }

    private void renderAttachment(Attachment att) throws Exception {
        String dataUrl = data.get(att.getStateKey());
        if (dataUrl == null || dataUrl.isEmpty()) return;
        byte[] bytes = DataUrls.decode(dataUrl);
        if (bytes != null) flow.drawInlineImage(bytes, 220f);
    }

    private static String str(Object o) { return o == null ? "" : String.valueOf(o); }
}
