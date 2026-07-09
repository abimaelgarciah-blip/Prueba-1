package com.gruporio.chequeomedico.model;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

/**
 * Catalogo de TODOS los campos de datos de la aplicacion (una fila por cada
 * id usado en alguna hoja). Este es el listado que necesitas para mapear tu
 * base de datos actual a los campos del PDF: cada Entry.id es la clave que
 * debes usar en MedicalRecordData.set(id, valor) para que ese dato aparezca
 * en la hoja/pagina correspondiente al exportar.
 *
 * Se genera dinamicamente recorriendo SheetRegistry.SHEETS (no hay una lista
 * separada que mantener a mano: agregar/editar un campo en SheetRegistry es
 * suficiente para que aparezca aqui tambien).
 */
public final class FieldCatalog {

    private FieldCatalog() {}

    public static class Entry {
        public final String sheetId;
        public final String sheetLabel;
        public final String fieldId;

        public Entry(String sheetId, String sheetLabel, String fieldId) {
            this.sheetId = sheetId;
            this.sheetLabel = sheetLabel;
            this.fieldId = fieldId;
        }
    }

    public static List<Entry> all() {
        List<Entry> out = new ArrayList<>();
        for (SheetDefinition sheet : SheetRegistry.SHEETS) {
            Set<String> ids = new LinkedHashSet<>();
            sheet.collectFieldIds(ids);
            for (String id : ids) {
                out.add(new Entry(sheet.getId(), sheet.getLabel(), id));
            }
        }
        // Campos de "Datos generales" (ver nota en SheetRegistry): no pertenecen a
        // ninguna hoja imprimible, pero si al expediente.
        for (String id : List.of(
                SheetRegistry.GENERAL_PATIENT_NAME, SheetRegistry.GENERAL_PATIENT_ID,
                SheetRegistry.GENERAL_STUDY_DATE, SheetRegistry.GENERAL_CLINIC,
                SheetRegistry.GENERAL_SEX, SheetRegistry.GENERAL_AGE)) {
            out.add(new Entry("datos-generales", "Datos Generales", id));
        }
        return out;
    }
}
