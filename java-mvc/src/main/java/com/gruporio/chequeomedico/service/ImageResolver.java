package com.gruporio.chequeomedico.service;

import com.gruporio.chequeomedico.model.MedicalRecordData;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Puerto directo de js/defaults-config.js (BUNDLED_DEFAULTS + effectiveImage).
 * Prioridad de la imagen mostrada/usada en cada portada o membrete:
 *   1) record.getData().get(imageKey)      -> imagen propia del paciente
 *   2) appDefaults.get(imageKey)           -> predeterminada de este servidor (pantalla Ajustes -> app_defaults)
 *   3) BUNDLED_DEFAULTS.get(imageKey)      -> predeterminada compartida (empaquetada con la app, /assets/defaults)
 */
public final class ImageResolver {

    private ImageResolver() {}

    public static final Map<String, String> BUNDLED_DEFAULTS = build();

    private static Map<String, String> build() {
        Map<String, String> m = new LinkedHashMap<>();
        // Portadas
        m.put("cover-1", "assets/defaults/cover-1.png");
        m.put("cover-2", "assets/defaults/cover-2.png");
        m.put("cover-3", "assets/defaults/cover-3.png");
        m.put("cover-4", "assets/defaults/cover-4.png");
        m.put("cover-6", "assets/defaults/cover-6.png");
        m.put("cover-8", "assets/defaults/cover-8.png");
        m.put("cover-10", "assets/defaults/cover-10.png");
        m.put("cover-12", "assets/defaults/cover-12.png");
        m.put("cover-14", "assets/defaults/cover-14.png");
        m.put("cover-16", "assets/defaults/cover-16.png");
        m.put("cover-18", "assets/defaults/cover-18.png");
        m.put("cover-23", "assets/defaults/cover-audiometria.png");
        m.put("cover-25", "assets/defaults/cover-dental.png");
        m.put("cover-20", "assets/defaults/cover-20.png");
        // Membretes
        m.put("mb-5", "assets/defaults/mb-5.png");
        m.put("mb-7", "assets/defaults/mb-7.png");
        m.put("mb-9", "assets/defaults/mb-9.png");
        m.put("mb-11", "assets/defaults/mb-11.png");
        m.put("mb-13", "assets/defaults/mb-13.png");
        m.put("mb-15", "assets/defaults/mb-15.png");
        m.put("mb-17", "assets/defaults/mb-17.png");
        m.put("mb-19", "assets/defaults/mb-19.png");
        m.put("mb-24", "assets/defaults/mb-audiometria.png");
        m.put("mb-26", "assets/defaults/mb-dental.png");
        m.put("mb-21", "assets/defaults/mb-21.png");
        return m;
    }

    /**
     * @param data        datos del paciente (puede ser null)
     * @param appDefaults predeterminadas globales configuradas en Ajustes (app_defaults, puede ser null)
     * @param imageKey    ej. "cover-1", "mb-7"
     * @return data URL base64 del paciente, o predeterminada global, o ruta relativa del recurso empaquetado, o null.
     */
    public static String resolve(MedicalRecordData data, Map<String, String> appDefaults, String imageKey) {
        if (data != null) {
            String own = data.get(imageKey);
            if (own != null && !own.isEmpty()) return own;
        }
        if (appDefaults != null) {
            String def = appDefaults.get(imageKey);
            if (def != null && !def.isEmpty()) return def;
        }
        return BUNDLED_DEFAULTS.get(imageKey);
    }
}
