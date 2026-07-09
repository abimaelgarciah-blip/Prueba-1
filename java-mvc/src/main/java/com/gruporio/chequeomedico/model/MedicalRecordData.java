package com.gruporio.chequeomedico.model;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import java.lang.reflect.Type;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Contenedor de TODOS los campos dinamicos de un expediente (equivalente al
 * "appState" de la version JS y a la columna jsonb "data" de Supabase). Se
 * persiste como un solo CLOB JSON en Oracle (ver MedicalRecordDao).
 *
 * ESTA es la clase que conecta tu base de datos con el PDF: para mapear una
 * columna propia (de tu sistema actual) a un campo del reporte, basta con
 * escribir aqui, usando el mismo id que usa la hoja/el PDF, por ejemplo:
 *
 *   MedicalRecordData data = record.getData();
 *   data.set("c7-endo-gluc", resultadoDeLaboratorio.getGlucosa());
 *   data.set("c19-avOD", oftalmologia.getAgudezaVisualOD());
 *
 * Consulta FieldCatalog para la lista completa de ids validos por hoja.
 */
public class MedicalRecordData {

    private static final Gson GSON = new Gson();
    private static final Type MAP_TYPE = new TypeToken<Map<String, Object>>() {}.getType();

    private final Map<String, Object> values;

    public MedicalRecordData() {
        this.values = new LinkedHashMap<>();
    }

    public MedicalRecordData(Map<String, Object> values) {
        this.values = (values != null) ? values : new LinkedHashMap<>();
    }

    public static MedicalRecordData fromJson(String json) {
        if (json == null || json.trim().isEmpty()) return new MedicalRecordData();
        Map<String, Object> map = GSON.fromJson(json, MAP_TYPE);
        return new MedicalRecordData(map);
    }

    public String toJson() {
        return GSON.toJson(values);
    }

    /** Valor de texto de un campo simple (input/textarea/select/date/imagen-base64). */
    public String get(String fieldId) {
        Object v = values.get(fieldId);
        return v == null ? null : String.valueOf(v);
    }

    public String get(String fieldId, String defaultValue) {
        String v = get(fieldId);
        return (v == null || v.isEmpty()) ? defaultValue : v;
    }

    public void set(String fieldId, String value) {
        values.put(fieldId, value);
    }

    /** Para valores compuestos: listas de {title,body} (DynamicBlock), listas de string (NumberedList), o el objeto "nutri". */
    public Object getRaw(String fieldId) {
        return values.get(fieldId);
    }

    public void setRaw(String fieldId, Object value) {
        values.put(fieldId, value);
    }

    public boolean isTrue(String fieldId) {
        Object v = values.get(fieldId);
        return "true".equals(v) || Boolean.TRUE.equals(v);
    }

    public boolean isOmitted(String omitFieldId) {
        return isTrue(omitFieldId);
    }

    public Map<String, Object> asMap() {
        return values;
    }
}
