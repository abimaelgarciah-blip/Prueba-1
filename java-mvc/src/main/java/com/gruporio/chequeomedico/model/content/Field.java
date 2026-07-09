package com.gruporio.chequeomedico.model.content;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

/**
 * Un campo de datos individual dentro de una hoja (equivalente a un
 * input/textarea/select con "id" del HTML original). El id es la MISMA clave
 * que se usa en:
 *   - el HTML/JSP renderizado (name/id del control),
 *   - el mapa de datos persistido en Oracle (MedicalRecordData / columna CLOB "data"),
 *   - el generador de PDF (PdfSheetRenderer busca este id en MedicalRecordData).
 *
 * Esa es la "conexion" pedida entre base de datos y PDF: el mismo id sirve
 * para las tres cosas, por lo que mapear una columna propia de tu base de
 * datos a un campo del PDF es simplemente escribir ese valor en
 * MedicalRecordData.set(id, valor) antes de exportar.
 */
public class Field {

    public enum Kind { TEXT, TEXTAREA, SELECT, DATE }

    private final String id;
    private final Kind kind;
    private String label;
    private String placeholder = "";
    private List<String> options = Collections.emptyList();
    private String size = "md"; // "sm" | "md" (ancho del input en linea, ver ctt-inline-*)
    private String sex;         // null | "M" | "F": el campo solo aplica a ese sexo

    private Field(String id, Kind kind) {
        this.id = id;
        this.kind = kind;
    }

    public static Field text(String id) { return new Field(id, Kind.TEXT); }
    public static Field textarea(String id) { return new Field(id, Kind.TEXTAREA); }
    public static Field date(String id) { return new Field(id, Kind.DATE); }
    public static Field select(String id, String... options) {
        Field f = new Field(id, Kind.SELECT);
        f.options = Arrays.asList(options);
        return f;
    }

    public Field label(String label) { this.label = label; return this; }
    public Field placeholder(String placeholder) { this.placeholder = placeholder; return this; }
    public Field size(String size) { this.size = size; return this; }
    public Field sex(String sex) { this.sex = sex; return this; }

    public String getId() { return id; }
    public Kind getKind() { return kind; }
    public String getLabel() { return label; }
    public String getPlaceholder() { return placeholder; }
    public List<String> getOptions() { return options; }
    public String getSize() { return size; }
    public String getSex() { return sex; }
}
