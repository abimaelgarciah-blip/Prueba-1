package com.gruporio.chequeomedico.util;

import javax.servlet.ServletContext;
import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

/**
 * Configuracion de la app leida de WEB-INF/app.properties (equivalente a la
 * constante PASSWORD hardcodeada en js/app.js, ahora del lado del servidor
 * para no exponerla en el HTML/JS que llega al navegador).
 */
public final class AppConfig {

    private static volatile Properties props;

    private AppConfig() {}

    public static synchronized void init(ServletContext ctx) {
        if (props != null) return;
        Properties p = new Properties();
        try (InputStream in = ctx.getResourceAsStream("/WEB-INF/app.properties")) {
            if (in != null) p.load(in);
        } catch (IOException e) {
            throw new IllegalStateException("No se pudo leer WEB-INF/app.properties", e);
        }
        props = p;
    }

    public static String get(String key, String defaultValue) {
        return props == null ? defaultValue : props.getProperty(key, defaultValue);
    }

    public static String authPassword() {
        return get("auth.password", "CHANGEME");
    }
}
