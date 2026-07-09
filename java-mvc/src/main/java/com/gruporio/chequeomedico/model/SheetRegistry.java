package com.gruporio.chequeomedico.model;

import com.gruporio.chequeomedico.model.content.*;
import com.gruporio.chequeomedico.model.nutricional.NutriConfig;

import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Puerto directo de js/app.js (arreglo "sheets") + js/sheets/sheet*.js +
 * js/templates.js. Define, EN EL MISMO ORDEN que la version original, las
 * 26 hojas del Chequeo Medico mas la Evaluacion Nutricional.
 *
 * Nota: sheet22.js ("Firma del Doctor", c22-*) existe como archivo en el
 * proyecto original pero NUNCA se registra en el arreglo "sheets" de app.js
 * ni se carga en index.html -> es codigo muerto, no forma parte de la app
 * en produccion. Se omite aqui a proposito para no agregar una hoja que el
 * sistema actual no usa.
 *
 * Agregado respecto al original (ver README-arquitectura.md, seccion
 * "Datos generales"): los campos s1-patient/s1-id/s1-date/s1-clinic/s1-sex/
 * s1-age se leen en supabase-client.js y en los dashboards, pero NINGUNA
 * hoja del proyecto original los renderiza como input (bug preexistente:
 * de otro modo guardar un paciente nuevo era imposible, siempre faltaba el
 * nombre). Aqui se exponen en un formulario de "Datos generales" propio del
 * expediente (ver patient-form.jsp), reutilizando EXACTAMENTE esos mismos
 * ids, y no se agregan como pagina nueva del PDF (el PDF original tampoco
 * tenia una).
 */
public final class SheetRegistry {

    private SheetRegistry() {}

    // ----- Campos "Datos generales" (no viven en templates.js, ver nota arriba) -----
    public static final String GENERAL_PATIENT_NAME = "s1-patient";
    public static final String GENERAL_PATIENT_ID   = "s1-id";
    public static final String GENERAL_STUDY_DATE   = "s1-date";
    public static final String GENERAL_CLINIC       = "s1-clinic";
    public static final String GENERAL_SEX          = "s1-sex";
    public static final String GENERAL_AGE          = "s1-age";

    /** Campo del que se lee el sexo para los bloques SexConditional (c5-sexo, hoja "Contenido Hallazgos"). */
    public static final String SEX_FIELD_ID = "c5-sexo";

    /** Etiquetas descriptivas de cada "seccion" omitible (renderSectionOmit). */
    public static final Map<String, String> SECTION_LABELS = buildSectionLabels();

    private static Map<String, String> buildSectionLabels() {
        Map<String, String> m = new LinkedHashMap<>();
        m.put("cardio", "Prueba de Esfuerzo y ECG");
        m.put("espirometria", "Espirometría");
        m.put("gabinete", "Estudios de Gabinete");
        m.put("oftalmologia", "Revisión Oftalmológica");
        m.put("laboratorio", "Laboratorio");
        m.put("audiometria", "Audiometría");
        m.put("dental", "Evaluación Dental");
        return Collections.unmodifiableMap(m);
    }

    public static final List<SheetDefinition> SHEETS = buildSheets();

    private static List<SheetDefinition> buildSheets() {
        List<SheetDefinition> s = new ArrayList<>();
        s.add(new CoverSheetDefinition("portada-principal", "Portada Principal", "cover-1", null));
        s.add(new CoverSheetDefinition("portada-objetivos", "Portada Objetivos", "cover-2", null));
        s.add(new CoverSheetDefinition("portada-introduccion", "Portada Introducción", "cover-3", null));
        s.add(new CoverSheetDefinition("portada-hallazgos", "Portada Hallazgos Principales", "cover-4", null));
        s.add(sheet5());
        s.add(new CoverSheetDefinition("portada-sistemas", "Portada Sistemas", "cover-6", null));
        s.add(sheet7());
        s.add(new CoverSheetDefinition("portada-conclusiones", "Portada Conclusiones", "cover-8", null));
        s.add(sheet9());
        s.add(new CoverSheetDefinition("portada-sugerencias", "Portada Sugerencias", "cover-10", null));
        s.add(sheet11());
        s.add(new CoverSheetDefinition("portada-esfuerzo", "Portada Prueba Esfuerzo y ECG", "cover-12", "cardio"));
        s.add(sheet13());
        s.add(new CoverSheetDefinition("portada-espirometria", "Portada Espirometría", "cover-14", "espirometria"));
        s.add(sheet15());
        s.add(new CoverSheetDefinition("portada-gabinete", "Portada Estudios de Gabinete", "cover-16", "gabinete"));
        s.add(sheet17());
        s.add(new CoverSheetDefinition("portada-oftalmologia", "Portada Oftalmología", "cover-18", "oftalmologia"));
        s.add(sheet19());
        // Orden real de exportacion en app.js: Audiometria y Dental van ANTES de Laboratorio.
        s.add(new CoverSheetDefinition("portada-audiometria", "Portada Audiometría", "cover-23", "audiometria"));
        s.add(sheet24());
        s.add(new CoverSheetDefinition("portada-dental", "Portada Evaluación Dental", "cover-25", "dental"));
        s.add(sheet26());
        s.add(new CoverSheetDefinition("portada-laboratorio", "Portada Laboratorio", "cover-20", "laboratorio"));
        s.add(sheet21());
        s.add(new NutricionalSheetDefinition(NutriConfig.predeterminada()));
        return Collections.unmodifiableList(s);
    }

    // ================================================================
    // Sheet 5 — Contenido Hallazgos (resumen medico / antecedentes / examen fisico)
    // ================================================================
    private static SheetDefinition sheet5() {
        List<ContentBlock> b = new ArrayList<>();
        b.add(new Heading("RESUMEN MÉDICO"));
        b.add(Paragraph.of(
                Field.select("c5-sexo", "Masculino", "Femenino"),
                " de ", Field.text("c5-edad").placeholder("edad").size("sm"), " años de edad."));

        b.add(new Heading("ANTECEDENTES HEREDO FAMILIARES"));
        b.add(Paragraph.of(new Bold("Refiere:"), Field.textarea("c5-ahf")));

        b.add(new Heading("ANTECEDENTES PERSONALES NO PATOLÓGICOS"));
        String[][] noPatologicos = {
            {"orig", "Originario de"}, {"resid", "Residente de"},
            {"alc", "Bebidas alcohólicas refiere"}, {"fum", "Fumar refiere"},
            {"dep", "Practicar deportes refiere"}, {"vis", "Problemas visuales refiere"},
            {"aud", "Problemas auditivos refiere"}, {"trans", "Transfusiones refiere"},
            {"hosp", "Hospitalizaciones refiere"}, {"cirug", "Intervenciones quirúrgicas refiere"},
            {"meds", "Medicamentos refiere"}, {"infec", "Enfermedades infecciosas refiere"},
            {"alerg", "Alergias refiere"}, {"fract", "Fracturas refiere"},
            {"grsang", "Grupo sanguíneo refiere"}, {"inmun", "Inmunizaciones refiere"}
        };
        for (String[] np : noPatologicos) {
            b.add(Paragraph.of(new Bold(np[1]), Field.textarea("c5-np-" + np[0])));
        }

        b.add(new Heading("ANTECEDENTES PERSONALES PATOLÓGICOS"));
        b.add(new SexConditional("M", Paragraph.of(
                new Bold("Al interrogatorio de signos y síntomas prostáticos se refiere"),
                Field.textarea("c5-pp-prostata"))));
        b.add(new SexConditional("F", Paragraph.of(
                "Inicia menstruación a los ", Field.text("c5-pp-menarca").size("sm"),
                " años, gesta ", Field.text("c5-pp-gesta").size("sm"),
                ", para ", Field.text("c5-pp-para").size("sm"),
                ", aborto ", Field.text("c5-pp-aborto").size("sm"),
                ", cesáreas ", Field.text("c5-pp-cesareas").size("sm"),
                ". Meses promedio de lactancia en el primero ", Field.text("c5-pp-lact1").size("sm"),
                " meses, en el segundo ", Field.text("c5-pp-lact2").size("sm"),
                " meses, en el tercer ", Field.text("c5-pp-lact3").size("sm"),
                " meses. FUM ", Field.text("c5-pp-fum").size("sm"))));
        b.add(Paragraph.of(new Bold("Otros antecedentes refiere"), Field.textarea("c5-pp-otros")));

        b.add(new Heading("EXAMEN FÍSICO"));
        b.add(Paragraph.of(new Bold("Signos vitales:"),
                " T.A. ", Field.text("c5-ef-ta").size("sm"),
                " F.C. ", Field.text("c5-ef-fc").size("sm"),
                " Saturación: ", Field.text("c5-ef-sat").size("sm")));
        b.add(Paragraph.of(new Bold("Peso:"), Field.text("c5-ef-peso").size("sm"),
                " kilos y ", new Bold("talla:"), Field.text("c5-ef-talla").size("sm"), " cm."));

        String[][] examenFisico = {
            {"ef-general", "Paciente consciente, cooperador, cuya edad cronológica corresponde con la real. Su apariencia general es normal."},
            {"ef-derma", "Exploración dermatológica: Sin alteraciones."},
            {"ef-craneo", "Cráneo: Es normoencefalo, con cabello bien implantado, no tiene exóstosis, sin otras alteraciones."},
            {"ef-ojos", "Ojos: Con movimientos oculares, reflejos y fondoscopía normal, conjuntivas, escleróticas y párpados normales."},
            {"ef-oidos", "Oídos: Con pabellón auricular normal, el conducto auditivo externo es normal, la membrana timpánica está íntegra, la conducción aérea y ósea normal."},
            {"ef-nariz", "Nariz: Rectilínea, septum central, sin traumatismos presentes, mucosas normales, cornetes sin alteraciones."},
            {"ef-boca", "Boca: Piezas dentales normales, lengua y mucosas normales, faringe sin alteraciones."},
            {"ef-cuello", "Cuello: Es cilíndrico, no presenta adenomegalias, la tiroides palpable normal, movimientos normales, pulsos presentes normales."},
            {"ef-torax", "Tórax: Es normolíneo, con movimientos de amplexión y amplexación normales, los ruidos respiratorios sin fenómenos acústicos agregados, los ruidos cardíacos rítmicos sin frotes, ni soplos."},
            {"ef-abdomen", "Abdomen: Es plano, blando, depresible, no es doloroso, no tiene visceromegalias, no presenta masas, peristaltismo presente y área renal sin alteraciones."},
            {"ef-genit", "Genitales: Sin alteraciones."},
            {"ef-rectal", "Examen rectal: No se realizó."},
            {"ef-extsup", "Examen de extremidades superiores: Sin alteraciones."},
            {"ef-extinf", "Examen de extremidades inferiores: Sin alteraciones."},
            {"ef-neuro", "Examen neurológico: Orientación normal en 3 esferas, pares craneales normales, meningeos negativos, vestíbulos cerebelosos negativos, reflejos osteotendinosos normales, marcha normal, no tiene problemas de sensibilidad ni motilidad."}
        };
        for (String[] ef : examenFisico) {
            b.add(new EditableFixedText(ef[0], ef[1]));
        }

        return new ContentSheetDefinition("contenido-hallazgos", "Contenido Hallazgos", "mb-5", null, b);
    }

    // ================================================================
    // Sheet 7 — Contenido Sistemas (8 sistemas corporales)
    // ================================================================
    private static SheetDefinition sheet7() {
        List<ContentBlock> b = new ArrayList<>();

        b.add(new Group("sis-resp", List.of(
                new Heading("SISTEMA RESPIRATORIO"),
                StudyLine.of("est-resp-sint", "Síntomas respiratorios:", Field.textarea("c7-resp-sint")),
                StudyLine.of("est-resp-espiro", "Espirometría:", Field.textarea("c7-resp-espiro")),
                StudyLine.of("est-resp-rx", "Radiografía de tórax:", Field.textarea("c7-resp-rx")),
                new DynamicBlock("c7-resp-extra", "+ Agregar campo a Respiratorio"))));

        b.add(new Group("sis-card", List.of(
                new Heading("SISTEMA CARDIOVASCULAR"),
                StudyLine.of("est-card-pef", "Prueba de esfuerzo:", Field.textarea("c7-card-pef")),
                StudyLine.of("est-card-ecg", "Electrocardiograma:", Field.textarea("c7-card-ecg")),
                new DynamicBlock("c7-card-extra", "+ Agregar campo a Cardiovascular"))));

        b.add(new Group("sis-gi", List.of(
                new Heading("SISTEMA GASTROINTESTINAL"),
                StudyLine.of("est-gi-sint", "Sintomatología:", Field.textarea("c7-gi-sint")),
                StudyLine.of("est-gi-eco", "Ultrasonido abdominal:", Field.textarea("c7-gi-eco")),
                StudyLine.of("est-gi-pfh", "Pruebas de función hepática:", Field.textarea("c7-gi-pfh")),
                StudyLine.of("est-gi-copro", "Coprológico:", Field.textarea("c7-gi-copro")),
                StudyLine.of("est-gi-coprop", "Coproparasitoscópico:", Field.textarea("c7-gi-coprop")),
                StudyLine.of("est-gi-dental", "Evaluación odontológica:", Field.textarea("c7-gi-dental")),
                new DynamicBlock("c7-gi-extra", "+ Agregar campo a Gastrointestinal"))));

        b.add(new Group("sis-gu", List.of(
                new Heading("SISTEMA GENITO-URINARIO"),
                StudyLine.of("est-gu-sint", "Sintomatología:", Field.textarea("c7-gu-sint")),
                StudyLine.of("est-gu-ecoR", "Ecosonograma renal:", Field.textarea("c7-gu-ecoR")),
                new SexConditional("M", StudyLine.of("est-gu-ecoP", "Ecosonograma prostático:", Field.textarea("c7-gu-ecoP"))),
                new SexConditional("F", StudyLine.of("est-gu-ecoPel", "Ecosonograma pélvico:", Field.textarea("c7-gu-ecoPel"))),
                StudyLine.of("est-gu-orina", "General de orina:", Field.textarea("c7-gu-orina")),
                StudyLine.of("est-gu-urea", "Urea:", Field.textarea("c7-gu-urea")),
                StudyLine.of("est-gu-creat", "Creatinina:", Field.textarea("c7-gu-creat")),
                StudyLine.of("est-gu-nitro", "Nitrógeno uréico:", Field.textarea("c7-gu-nitro")),
                StudyLine.of("est-gu-tfg", "Tasa de filtración glomerular:", Field.textarea("c7-gu-tfg")),
                new SexConditional("M", StudyLine.of("est-gu-psa", "Antígeno prostático:", Field.textarea("c7-gu-psa"))),
                new DynamicBlock("c7-gu-extra", "+ Agregar campo a Genito-Urinario"))));

        b.add(new Group("sis-nerv", List.of(
                new Heading("SISTEMA NERVIOSO Y ÓRGANOS DE LOS SENTIDOS"),
                StudyLine.of("est-nerv-sint", "Sintomatología:", Field.textarea("c7-nerv-sint")),
                StudyLine.of("est-nerv-oftal", "Valoración oftalmológica:", Field.textarea("c7-nerv-oftal")),
                StudyLine.of("est-nerv-audio", "Audiometría:", Field.textarea("c7-nerv-audio")),
                new DynamicBlock("c7-nerv-extra", "+ Agregar campo a Nervioso"))));

        b.add(new Group("sis-endo", List.of(
                new Heading("SISTEMA ENDOCRINO METABÓLICO"),
                StudyLine.of("est-endo-gluc", "Glucosa:", Field.textarea("c7-endo-gluc")),
                StudyLine.of("est-endo-au", "Ácido úrico:", Field.textarea("c7-endo-au")),
                StudyLine.of("est-endo-colT", "Colesterol total:", Field.textarea("c7-endo-colT")),
                StudyLine.of("est-endo-trig", "Triglicéridos:", Field.textarea("c7-endo-trig")),
                StudyLine.of("est-endo-hdl", "HDL:", Field.textarea("c7-endo-hdl")),
                StudyLine.of("est-endo-ldl", "LDL:", Field.textarea("c7-endo-ldl")),
                new SexConditional("F", StudyLine.of("est-endo-lh", "LH:", Field.textarea("c7-endo-lh"))),
                new SexConditional("F", StudyLine.of("est-endo-fsh", "FSH:", Field.textarea("c7-endo-fsh"))),
                new SexConditional("F", StudyLine.of("est-endo-prl", "Prolactina:", Field.textarea("c7-endo-prl"))),
                new SexConditional("F", StudyLine.of("est-endo-prog", "Progesterona:", Field.textarea("c7-endo-prog"))),
                new SexConditional("F", StudyLine.of("est-endo-est", "Estradiol:", Field.textarea("c7-endo-est"))),
                new StudyLine("est-endo-imc",
                        new Bold("Índice de masa corporal:"), Field.textarea("c7-endo-imc"),
                        " ", new Bold("clasificado como:"), Field.textarea("c7-endo-imcClass")),
                new DynamicBlock("c7-endo-extra", "+ Agregar campo a Endocrino"))));

        b.add(new Group("sis-muscu", List.of(
                new Heading("SISTEMA MUSCULOESQUELÉTICO"),
                StudyLine.of("est-muscu-sint", "Sintomatología:", Field.textarea("c7-muscu-sint")),
                StudyLine.of("est-muscu-rx", "Radiografía de columna lumbar:", Field.textarea("c7-muscu-rx")),
                StudyLine.of("est-muscu-densi", "Densitometría:", Field.textarea("c7-muscu-densi")),
                new DynamicBlock("c7-muscu-extra", "+ Agregar campo a Musculoesquelético"))));

        b.add(new Group("sis-hema", List.of(
                new Heading("SISTEMA HEMATOPOYÉTICO Y CÉLULAS EN SANGRE"),
                StudyLine.of("est-hema-bh", "Biometría hemática:", Field.textarea("c7-hema-bh")),
                StudyLine.of("est-hema-ca", "Calcio:", Field.textarea("c7-hema-ca")),
                StudyLine.of("est-hema-p", "Fósforo:", Field.textarea("c7-hema-p")),
                StudyLine.of("est-hema-na", "Sodio:", Field.textarea("c7-hema-na")),
                StudyLine.of("est-hema-k", "Potasio:", Field.textarea("c7-hema-k")),
                StudyLine.of("est-hema-cl", "Cloro:", Field.textarea("c7-hema-cl")),
                StudyLine.of("est-hema-fe", "Hierro sérico:", Field.textarea("c7-hema-fe")),
                StudyLine.of("est-hema-grupo", "Grupo sanguíneo:", Field.textarea("c7-hema-grupo")),
                StudyLine.of("est-hema-vih", "Anticuerpos contra el virus del SIDA y antígeno p24:", Field.textarea("c7-hema-vih")),
                StudyLine.of("est-hema-vdrl", "VDRL:", Field.textarea("c7-hema-vdrl")),
                new DynamicBlock("c7-hema-extra", "+ Agregar campo a Hematopoyético"))));

        return new ContentSheetDefinition("contenido-sistemas", "Contenido Sistemas", "mb-7", null, b);
    }

    // ================================================================
    // Sheet 9 — Contenido Conclusiones
    // ================================================================
    private static SheetDefinition sheet9() {
        List<ContentBlock> b = new ArrayList<>();
        String[][] sistemas = {
            {"resp", "Sistema Respiratorio"}, {"card", "Sistema Cardiovascular"},
            {"gi", "Sistema Gastrointestinal"}, {"gu", "Sistema Genito-Urinario"},
            {"nerv", "Sistema Neurológico y Órganos de los Sentidos"},
            {"muscu", "Sistema Musculoesquelético"},
            {"hema", "Sistema Hematopoyético y Células en Sangre"},
            {"endo", "Sistema Endocrino Metabólico"}
        };
        for (String[] sys : sistemas) {
            b.add(new Heading(sys[1]));
            b.add(Paragraph.of(Field.textarea("c9-" + sys[0])));
        }
        b.add(new OmitToggle("dental", "Omitir odontológico"));
        b.add(new Group("dental", List.of(
                new Heading("Odontológico"),
                Paragraph.of(Field.textarea("c9-dental")))));
        b.add(new DynamicBlock("c9-extra", "+ Agregar otra conclusión"));
        return new ContentSheetDefinition("contenido-conclusiones", "Contenido Conclusiones", "mb-9", null, b);
    }

    // ================================================================
    // Sheet 11 — Contenido Sugerencias (+ firma del doctor)
    // ================================================================
    private static SheetDefinition sheet11() {
        List<ContentBlock> b = new ArrayList<>();
        b.add(new Heading("SUGERENCIAS"));
        b.add(new NumberedList("c11-sugs", "Sugerencia..."));
        b.add(new Heading("Firma"));
        b.add(Paragraph.of(new Bold("Nombre del doctor:"), Field.text("c11-doc-nombre").placeholder("Dr. Nombre Apellido")));
        b.add(Paragraph.of(new Bold("Cédula Profesional:"), Field.text("c11-doc-cedula")));
        b.add(Paragraph.of(new Bold("Especialidad:"), Field.text("c11-doc-especialidad")));
        // c11-firma-img: se puede cargar a mano o copiar desde el perfil de un Doctor guardado
        // (ver DoctorDao); no usa pdfKey, es solo una imagen.
        b.add(new Attachment("c11-firma-img", "Firma del doctor", null));
        return new ContentSheetDefinition("contenido-sugerencias", "Contenido Sugerencias", "mb-11", null, b);
    }

    // ================================================================
    // Sheets "estudio simple": fecha + mediciones + resultado/interpretacion
    // + adjunto, con posibilidad de reemplazar todo por un PDF cargado.
    // ================================================================

    private static SheetDefinition sheet13() {
        String pdfKey = "pdf-13";
        List<ContentBlock> formato = new ArrayList<>();
        formato.add(Paragraph.of(new Bold("Fecha:"), Field.text("c13-fecha").placeholder("dd/mm/aaaa").size("sm")));
        formato.add(Paragraph.of(new Bold("METs alcanzados:"), Field.text("c13-mets").size("sm")));
        formato.add(Paragraph.of(new Bold("FC máxima (lpm):"), Field.text("c13-fcmax").size("sm")));
        formato.add(Paragraph.of(new Bold("TA máxima (mmHg):"), Field.text("c13-tamax").size("sm")));
        formato.add(Paragraph.of(new Bold("Ritmo:"), Field.text("c13-ritmo")));
        formato.add(new Heading("Resultado"));
        formato.add(Paragraph.of(Field.textarea("c13-resultado")));
        formato.add(new Heading("Interpretación clínica"));
        formato.add(Paragraph.of(Field.textarea("c13-interp")));
        formato.add(new Attachment("c13-img", "Adjuntar imagen del reporte / ECG", pdfKey));
        List<ContentBlock> b = List.of(new PdfReplace(pdfKey, formato));
        return new ContentSheetDefinition("contenido-esfuerzo", "Contenido Prueba Esfuerzo y ECG", "mb-13", "cardio", b);
    }

    private static SheetDefinition sheet15() {
        String pdfKey = "pdf-15";
        List<ContentBlock> formato = new ArrayList<>();
        formato.add(Paragraph.of(new Bold("Fecha:"), Field.text("c15-fecha").placeholder("dd/mm/aaaa").size("sm")));
        formato.add(Paragraph.of(new Bold("CVF (FVC), % predicho:"), Field.text("c15-fvc").size("sm")));
        formato.add(Paragraph.of(new Bold("VEF1 (FEV1), % predicho:"), Field.text("c15-fev1").size("sm")));
        formato.add(Paragraph.of(new Bold("VEF1/CVF:"), Field.text("c15-fev1fvc").size("sm")));
        formato.add(Paragraph.of(new Bold("Patrón:"), Field.select("c15-patron", "Normal", "Obstructivo", "Restrictivo", "Mixto")));
        formato.add(new Heading("Resultado"));
        formato.add(Paragraph.of(Field.textarea("c15-resultado")));
        formato.add(new Heading("Interpretación clínica"));
        formato.add(Paragraph.of(Field.textarea("c15-interp")));
        formato.add(new Attachment("c15-img", "Adjuntar imagen del reporte", pdfKey));
        List<ContentBlock> b = List.of(new PdfReplace(pdfKey, formato));
        return new ContentSheetDefinition("contenido-espirometria", "Contenido Espirometría", "mb-15", "espirometria", b);
    }

    private static SheetDefinition sheet17() {
        String pdfKey = "pdf-17";
        List<ContentBlock> formato = new ArrayList<>();
        formato.add(new DynamicBlock("c17-estudios", "+ Agregar estudio"));
        formato.add(new Heading("Notas generales"));
        formato.add(Paragraph.of(Field.textarea("c17-notas")));
        formato.add(new Attachment("c17-img", "Adjuntar imagen del estudio principal", pdfKey));
        List<ContentBlock> b = List.of(new PdfReplace(pdfKey, formato));
        return new ContentSheetDefinition("contenido-gabinete", "Contenido Estudios de Gabinete", "mb-17", "gabinete", b);
    }

    private static SheetDefinition sheet19() {
        String pdfKey = "pdf-19";
        List<ContentBlock> formato = new ArrayList<>();
        formato.add(Paragraph.of(new Bold("Fecha:"), Field.text("c19-fecha").size("sm")));
        formato.add(Paragraph.of(new Bold("Agudeza Visual OD:"), Field.text("c19-avOD").size("sm")));
        formato.add(Paragraph.of(new Bold("Agudeza Visual OI:"), Field.text("c19-avOI").size("sm")));
        formato.add(Paragraph.of(new Bold("Presión Intraocular OD (mmHg):"), Field.text("c19-pioOD").size("sm")));
        formato.add(Paragraph.of(new Bold("Presión Intraocular OI (mmHg):"), Field.text("c19-pioOI").size("sm")));
        formato.add(new Heading("Fondo de Ojo"));
        formato.add(Paragraph.of(Field.textarea("c19-fondo")));
        formato.add(new Heading("Segmento Anterior"));
        formato.add(Paragraph.of(Field.textarea("c19-segAnt")));
        formato.add(new Heading("Resultado"));
        formato.add(Paragraph.of(Field.textarea("c19-resultado")));
        formato.add(new Heading("Recomendaciones"));
        formato.add(Paragraph.of(Field.textarea("c19-reco")));
        formato.add(new Attachment("c19-img", "Adjuntar imagen del reporte", pdfKey));
        List<ContentBlock> b = List.of(new PdfReplace(pdfKey, formato));
        return new ContentSheetDefinition("contenido-oftalmologia", "Contenido Oftalmología", "mb-19", "oftalmologia", b);
    }

    private static SheetDefinition sheet21() {
        String pdfKey = "pdf-21";
        List<ContentBlock> formato = new ArrayList<>();
        formato.add(Paragraph.of(new Bold("Fecha de toma:"), Field.text("c21-fecha").size("sm")));
        formato.add(Paragraph.of(new Bold("Laboratorio:"), Field.text("c21-lab")));
        formato.add(new DynamicBlock("c21-resultados", "+ Agregar resultado de laboratorio"));
        formato.add(new Heading("Observaciones"));
        formato.add(Paragraph.of(Field.textarea("c21-obs")));
        formato.add(new Attachment("c21-img", "Adjuntar imagen del reporte", pdfKey));
        List<ContentBlock> b = List.of(new PdfReplace(pdfKey, formato));
        return new ContentSheetDefinition("contenido-laboratorio", "Contenido Laboratorio", "mb-21", "laboratorio", b);
    }

    private static SheetDefinition sheet24() {
        String pdfKey = "pdf-24";
        List<ContentBlock> formato = new ArrayList<>();
        formato.add(Paragraph.of(new Bold("Fecha:"), Field.text("c24-fecha").size("sm")));
        formato.add(Paragraph.of(new Bold("Oído Derecho (umbral prom., dB):"), Field.text("c24-od").size("sm")));
        formato.add(Paragraph.of(new Bold("Oído Izquierdo (umbral prom., dB):"), Field.text("c24-oi").size("sm")));
        formato.add(Paragraph.of(new Bold("Tipo de hipoacusia:"), Field.select("c24-tipo",
                "Audición normal", "Conductiva", "Neurosensorial", "Mixta")));
        formato.add(Paragraph.of(new Bold("Grado:"), Field.select("c24-grado",
                "Normal", "Leve", "Moderada", "Severa", "Profunda")));
        formato.add(new Heading("Resultado"));
        formato.add(Paragraph.of(Field.textarea("c24-resultado")));
        formato.add(new Heading("Interpretación clínica"));
        formato.add(Paragraph.of(Field.textarea("c24-interp")));
        formato.add(new Heading("Recomendaciones"));
        formato.add(Paragraph.of(Field.textarea("c24-reco")));
        formato.add(new Attachment("c24-img", "Adjuntar imagen del audiograma / reporte", pdfKey));
        List<ContentBlock> b = List.of(new PdfReplace(pdfKey, formato));
        return new ContentSheetDefinition("contenido-audiometria", "Contenido Audiometría", "mb-24", "audiometria", b);
    }

    private static SheetDefinition sheet26() {
        String pdfKey = "pdf-26";
        List<ContentBlock> formato = new ArrayList<>();
        formato.add(Paragraph.of(new Bold("Fecha:"), Field.text("c26-fecha").size("sm")));
        formato.add(Paragraph.of(new Bold("Higiene bucal:"), Field.select("c26-higiene", "Buena", "Regular", "Deficiente")));
        formato.add(Paragraph.of(new Bold("Caries detectadas:"), Field.text("c26-caries")));
        formato.add(Paragraph.of(new Bold("Estado periodontal:"), Field.select("c26-perio",
                "Sano", "Gingivitis", "Periodontitis leve", "Periodontitis moderada", "Periodontitis severa")));
        formato.add(Paragraph.of(new Bold("Piezas ausentes:"), Field.text("c26-ausentes")));
        formato.add(new Heading("Hallazgos del examen dental"));
        formato.add(Paragraph.of(Field.textarea("c26-hallazgos")));
        formato.add(new Heading("Tratamiento sugerido"));
        formato.add(Paragraph.of(Field.textarea("c26-tratamiento")));
        formato.add(new Heading("Recomendaciones"));
        formato.add(Paragraph.of(Field.textarea("c26-reco")));
        formato.add(new Attachment("c26-img", "Adjuntar imagen del reporte / radiografía", pdfKey));
        List<ContentBlock> b = List.of(new PdfReplace(pdfKey, formato));
        return new ContentSheetDefinition("contenido-dental", "Contenido Evaluación Dental", "mb-26", "dental", b);
    }
}
