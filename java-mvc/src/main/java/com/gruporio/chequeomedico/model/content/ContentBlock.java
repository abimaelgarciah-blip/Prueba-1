package com.gruporio.chequeomedico.model.content;

import java.util.Set;

/**
 * Un bloque de contenido de una hoja "content" (equivalente a los helpers de
 * templates.js: h1/p/renderStudyLine/renderDynamicBlock/renderNumberedList/
 * renderEditableFixed/renderAttachment/renderIfSex/renderPdfReplace). Una
 * hoja completa (ver ContentSheetDefinition) es simplemente una lista
 * ordenada de ContentBlock, igual que el render() original era una
 * concatenacion de llamadas a esos helpers.
 *
 * El mismo arbol de bloques se usa para:
 *   1) generar el HTML/JSP editable (ver ContentBlockHtmlRenderer),
 *   2) generar el PDF final (ver ContentBlockPdfRenderer),
 *   3) enumerar TODOS los campos de la app (ver FieldCatalog), que es la
 *      lista que necesitas para mapear tu base de datos al PDF.
 */
public interface ContentBlock {
    /** Agrega a {@code out} los ids de todos los campos de datos que este bloque persiste. */
    void collectFieldIds(Set<String> out);
}
