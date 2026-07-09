package com.gruporio.chequeomedico.service.pdf;

import java.util.Base64;

/** Equivalente a dataUrlToBytes() en app.js: decodifica un "data:image/png;base64,...." a bytes. */
public final class DataUrls {
    private DataUrls() {}

    public static byte[] decode(String dataUrl) {
        if (dataUrl == null) return null;
        int comma = dataUrl.indexOf(',');
        String base64 = comma >= 0 ? dataUrl.substring(comma + 1) : dataUrl;
        try {
            return Base64.getDecoder().decode(base64);
        } catch (IllegalArgumentException e) {
            return null;
        }
    }

    public static boolean isDataUrl(String value) {
        return value != null && value.startsWith("data:");
    }
}
