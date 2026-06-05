package com.rio.chequeo.util;

import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Constantes globales de la aplicación RIO - Chequeo Médico.
 * Esta clase no es instanciable.
 */
public final class AppConstants {

    private AppConstants() {
        // Clase de constantes — no instanciar
    }

    // -------------------------------------------------------------------------
    // Identificación de la aplicación
    // -------------------------------------------------------------------------

    /** Nombre visible de la aplicación. */
    public static final String APP_NAME = "RIO - Chequeo Médico";

    // -------------------------------------------------------------------------
    // Claves de sesión HTTP
    // -------------------------------------------------------------------------

    /** Clave bajo la que se almacena el usuario autenticado en la sesión. */
    public static final String SESSION_USER_KEY = "currentUser";

    /** Clave bajo la que se almacena el paciente activo en la sesión. */
    public static final String SESSION_PATIENT_KEY = "currentPatient";

    /** Tiempo máximo de inactividad de sesión en segundos (1 hora). */
    public static final int SESSION_TIMEOUT = 3600;

    // -------------------------------------------------------------------------
    // Seguridad
    // -------------------------------------------------------------------------

    /**
     * Contraseña por defecto mientras no existan usuarios individuales en base de datos.
     * Reemplazar por gestión individual de usuarios en cuanto esté disponible la tabla USUARIOS.
     */
    public static final String DEFAULT_PASSWORD = "empatia1042";

    // -------------------------------------------------------------------------
    // Generación de PDF
    // -------------------------------------------------------------------------

    /** Fuente base utilizada en la generación de PDFs. */
    public static final String PDF_FONT = "Arial";

    // -------------------------------------------------------------------------
    // Colores por sección del expediente
    // Key  → identificador de hoja (ej. "mb-5")
    // Value → color hexadecimal CSS (ej. "#1a3d80")
    // -------------------------------------------------------------------------

    /**
     * Mapa inmutable con el color representativo de cada sección del expediente médico.
     * La clave corresponde al identificador de la sección (mb-N) y el valor al color en
     * formato hexadecimal CSS.
     */
    public static final Map<String, String> SECTION_COLORS;

    static {
        Map<String, String> map = new LinkedHashMap<>();
        map.put("mb-5",  "#1a3d80");   // Hallazgos físicos
        map.put("mb-7",  "#0d7a5f");   // Revisión por sistemas
        map.put("mb-9",  "#b45309");   // Conclusiones
        map.put("mb-11", "#6d28d9");   // Sugerencias
        map.put("mb-13", "#be123c");   // Prueba de esfuerzo
        map.put("mb-15", "#0369a1");   // Espirometría
        map.put("mb-17", "#065f46");   // Gabinete
        map.put("mb-19", "#4338ca");   // Oftalmología
        map.put("mb-21", "#1e3a5f");   // Laboratorio
        map.put("mb-24", "#0e7490");   // Audiometría
        map.put("mb-26", "#be185d");   // Dental
        SECTION_COLORS = Collections.unmodifiableMap(map);
    }
}
