package com.gruporio.chequeomedico.model.nutricional;

import java.util.ArrayList;
import java.util.List;

/**
 * Puerto directo de nutricional/js/config.js (CONFIG_PREDETERMINADA). Define
 * las secciones fijas de la plantilla PDF de 53 paginas, los anexos
 * individuales y el rango de hojas de dieta por kcal.
 */
public class NutriConfig {

    public static class DietaConfig {
        public final String carpeta = "dietas/";
        public final int kcalMin = 1100;
        public final int kcalMax = 3200;
        public final int paso = 100;
        public final String despuesDe = "portada-plan";
        // Coordenadas PDF (puntos, origen abajo-izquierda, hoja carta) donde se imprime el nombre.
        public final float nombreX = 360f;
        public final float nombreY = 657.7f;
        public final float nombreTamano = 12f;
    }

    public static class SlotExterno {
        public final String id;
        public final String etiqueta;
        public SlotExterno(String id, String etiqueta) { this.id = id; this.etiqueta = etiqueta; }
    }

    public static class Seccion {
        public final String id;
        public final String nombre;
        public final String paginas; // ej. "1" o "5-6"
        public final SlotExterno slotExterno; // nullable

        public Seccion(String id, String nombre, String paginas, SlotExterno slotExterno) {
            this.id = id;
            this.nombre = nombre;
            this.paginas = paginas;
            this.slotExterno = slotExterno;
        }
    }

    public static class Anexo {
        public final int pagina;
        public final String nombre;
        public Anexo(int pagina, String nombre) { this.pagina = pagina; this.nombre = nombre; }
    }

    public final DietaConfig dieta = new DietaConfig();
    public final List<Seccion> secciones = new ArrayList<>();
    public final List<Anexo> anexos = new ArrayList<>();

    public static NutriConfig predeterminada() {
        NutriConfig c = new NutriConfig();
        c.secciones.add(new Seccion("portada-principal", "Portada principal — Análisis de Composición Corporal", "1", null));
        c.secciones.add(new Seccion("portada-revision", "Portada — Revisión Corporal y Nutricional", "2",
                new SlotExterno("ext-revision", "PDFs externos de la revisión (se insertan después de esta portada)")));
        c.secciones.add(new Seccion("portada-plan", "Portada — Plan de Alimentación", "3",
                new SlotExterno("ext-plan", "PDF externo del plan de alimentación (se inserta antes de la Lista de Equivalentes)")));
        c.secciones.add(new Seccion("portada-equivalentes", "Portada — Lista de Equivalentes", "4", null));
        c.secciones.add(new Seccion("contenido-equivalentes", "Lista de Equivalentes (contenido)", "5-6", null));
        c.secciones.add(new Seccion("portada-anexos", "Portada — Anexos", "7", null));
        c.secciones.add(new Seccion("recomendaciones", "Recomendaciones generales", "8", null));

        String[] nombres = {
            "Alimentos con Colesterol","Alimentos con Hierro","Alimentos con Zinc","Alimentos con Magnesio",
            "Alimentos con Purinas","Alimentos con Ácido Fólico","Alimentos con Calcio","Alimentos con Sodio",
            "Alimentos con Potasio","Vitamina B12","Vitamina C","Alimentos con Omega 3","Alimentos con Fósforo",
            "Vitamina D","Ácidos Grasos Saturados","Azúcar y Grasa (1 de 2)","Azúcar y Grasa (2 de 2)",
            "Diabetes — Alimentos prohibidos","Colitis y Úlceras","Acidez Gástrica","Estreñimiento","Esteatosis",
            "El Estrés","Antioxidantes (1 de 2)","Antioxidantes (2 de 2)","Parasitosis","Reflujo en el Adulto",
            "Alimentos con Fibra","Dieta Renal","Hidratación — Bebidas Isotónicas","Insuficiencia Renal (1 de 2)",
            "Insuficiencia Renal (2 de 2)","Hipertensión","Comer Fuera de Casa","Hepatitis",
            "Alimentos Bajos en Grasas","Dislipidemias","Diarrea","Hipertrigliceridemia","Hemorroides",
            "Cálculos Renales (Litiasis)","Alimentos con Tiramina — Migraña (1 de 2)",
            "Alimentos con Tiramina — Migraña (2 de 2)","Gluten en los Alimentos (1 de 2)","Gluten en los Alimentos (2 de 2)"
        };
        for (int i = 0; i < nombres.length; i++) {
            c.anexos.add(new Anexo(9 + i, nombres[i]));
        }
        return c;
    }
}
