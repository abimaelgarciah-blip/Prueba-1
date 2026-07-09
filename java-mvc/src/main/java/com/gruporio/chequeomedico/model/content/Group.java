package com.gruporio.chequeomedico.model.content;

import java.util.List;
import java.util.Set;

/** Agrupa varios bloques bajo un contenedor (equivalente a un &lt;div id="block-..."&gt; en el HTML original). No agrega campos propios. */
public class Group implements ContentBlock {
    private final String domId;
    private final List<ContentBlock> children;

    public Group(String domId, List<ContentBlock> children) {
        this.domId = domId;
        this.children = children;
    }

    public String getDomId() { return domId; }
    public List<ContentBlock> getChildren() { return children; }

    @Override
    public void collectFieldIds(Set<String> out) {
        for (ContentBlock c : children) c.collectFieldIds(out);
    }
}
