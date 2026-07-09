package com.gruporio.chequeomedico.service.nutricional;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/** Puerto de parsearPaginasNutri() (nutricional): "9, 12-14" -> [9,12,13,14]. */
public final class PageRanges {
    private PageRanges() {}

    private static final Pattern RANGE = Pattern.compile("^(\\d+)\\s*[-–]\\s*(\\d+)$");

    public static List<Integer> parse(String texto) {
        List<Integer> out = new ArrayList<>();
        if (texto == null) return out;
        String limpio = texto.trim();
        if (limpio.isEmpty()) return out;
        for (String parte : limpio.split(",")) {
            String p = parte.trim();
            if (p.isEmpty()) continue;
            Matcher m = RANGE.matcher(p);
            if (m.matches()) {
                int a = Integer.parseInt(m.group(1));
                int bEnd = Integer.parseInt(m.group(2));
                for (int i = a; i <= bEnd; i++) out.add(i);
            } else if (p.matches("^\\d+$")) {
                out.add(Integer.parseInt(p));
            }
            // texto invalido: se ignora silenciosamente (equivalente a los omitidas del original)
        }
        return out;
    }
}
