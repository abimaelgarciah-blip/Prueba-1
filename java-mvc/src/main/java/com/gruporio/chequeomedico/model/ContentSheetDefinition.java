package com.gruporio.chequeomedico.model;

import com.gruporio.chequeomedico.model.content.ContentBlock;

import java.util.List;
import java.util.Set;

/**
 * Hoja de contenido: membrete de fondo + una lista ordenada de ContentBlock
 * (equivalente a renderContentWrapper(membreteKey, label, innerHTML) donde
 * innerHTML era la concatenacion de llamadas a los helpers de templates.js).
 */
public class ContentSheetDefinition implements SheetDefinition {
    private final String id;
    private final String label;
    private final String membreteKey;
    private final String section; // nullable
    private final List<ContentBlock> blocks;

    public ContentSheetDefinition(String id, String label, String membreteKey, String section, List<ContentBlock> blocks) {
        this.id = id;
        this.label = label;
        this.membreteKey = membreteKey;
        this.section = section;
        this.blocks = blocks;
    }

    @Override public String getId() { return id; }
    @Override public String getLabel() { return label; }
    @Override public String getSection() { return section; }
    public String getMembreteKey() { return membreteKey; }
    public List<ContentBlock> getBlocks() { return blocks; }

    @Override
    public void collectFieldIds(Set<String> out) {
        out.add(membreteKey);
        for (ContentBlock b : blocks) b.collectFieldIds(out);
    }
}
