package com.rio.chequeo.model;

import java.io.Serializable;

/**
 * Expediente médico completo.
 * Cada campo incluye el ID del formulario JS original para facilitar
 * el mapeo con las columnas de Oracle 11g.
 *
 * GUÍA DE MAPEO:
 *   Nombre Java          →  field JS original   →  columna Oracle (TODO: asignar)
 */
public class MedicalRecord implements Serializable {

    private Long patientId;

    // =====================================================================
    // DATOS DEL PACIENTE  (sheet5)
    // =====================================================================

    /** field: c5-sexo | columna Oracle: TODO_SEXO */
    private String sexo;

    /** field: c5-edad | columna Oracle: TODO_EDAD */
    private String edad;

    // =====================================================================
    // ANTECEDENTES HEREDO FAMILIARES  (sheet5)
    // =====================================================================

    /** field: c5-ahf | columna Oracle: TODO_AHF */
    private String antecedentesHeredoFamiliares;

    // =====================================================================
    // ANTECEDENTES NO PATOLÓGICOS  (sheet5)
    // =====================================================================

    /** field: c5-np-orig  | columna Oracle: TODO_NP_ORIGEN */
    private String npOrigen;
    /** field: c5-np-resid | columna Oracle: TODO_NP_RESIDENCIA */
    private String npResidencia;
    /** field: c5-np-alc   | columna Oracle: TODO_NP_ALCOHOL */
    private String npAlcohol;
    /** field: c5-np-fum   | columna Oracle: TODO_NP_FUMAR */
    private String npFumar;
    /** field: c5-np-dep   | columna Oracle: TODO_NP_DEPORTES */
    private String npDeportes;
    /** field: c5-np-vis   | columna Oracle: TODO_NP_VISION */
    private String npVision;
    /** field: c5-np-aud   | columna Oracle: TODO_NP_AUDITIVO */
    private String npAuditivo;
    /** field: c5-np-trans | columna Oracle: TODO_NP_TRANSFUSIONES */
    private String npTransfusiones;
    /** field: c5-np-hosp  | columna Oracle: TODO_NP_HOSPITALIZACIONES */
    private String npHospitalizaciones;
    /** field: c5-np-cirug | columna Oracle: TODO_NP_CIRUGIAS */
    private String npCirugias;
    /** field: c5-np-meds  | columna Oracle: TODO_NP_MEDICAMENTOS */
    private String npMedicamentos;
    /** field: c5-np-infec | columna Oracle: TODO_NP_ENF_INFECCIOSAS */
    private String npEnfInfecciosas;
    /** field: c5-np-alerg | columna Oracle: TODO_NP_ALERGIAS */
    private String npAlergias;
    /** field: c5-np-fract | columna Oracle: TODO_NP_FRACTURAS */
    private String npFracturas;
    /** field: c5-np-grsang| columna Oracle: TODO_NP_GRUPO_SANGUINEO */
    private String npGrupoSanguineo;
    /** field: c5-np-inmun | columna Oracle: TODO_NP_INMUNIZACIONES */
    private String npInmunizaciones;

    // =====================================================================
    // ANTECEDENTES PERSONALES PATOLÓGICOS  (sheet5)
    // =====================================================================

    /** field: c5-pp-prostata  (solo masculino) | columna Oracle: TODO_PP_PROSTATA */
    private String ppProstata;
    /** field: c5-pp-menarca   (solo femenino)  | columna Oracle: TODO_PP_MENARCA */
    private String ppMenarca;
    /** field: c5-pp-gesta     | columna Oracle: TODO_PP_GESTA */
    private String ppGesta;
    /** field: c5-pp-para      | columna Oracle: TODO_PP_PARA */
    private String ppPara;
    /** field: c5-pp-aborto    | columna Oracle: TODO_PP_ABORTO */
    private String ppAborto;
    /** field: c5-pp-cesareas  | columna Oracle: TODO_PP_CESAREAS */
    private String ppCesareas;
    /** field: c5-pp-lact1     | columna Oracle: TODO_PP_LACTANCIA1 */
    private String ppLactancia1;
    /** field: c5-pp-lact2     | columna Oracle: TODO_PP_LACTANCIA2 */
    private String ppLactancia2;
    /** field: c5-pp-lact3     | columna Oracle: TODO_PP_LACTANCIA3 */
    private String ppLactancia3;
    /** field: c5-pp-fum       | columna Oracle: TODO_PP_FUM_TIEMPO */
    private String ppFumTiempo;
    /** field: c5-pp-otros     | columna Oracle: TODO_PP_OTROS */
    private String ppOtros;

    // =====================================================================
    // EXAMEN FÍSICO  (sheet5)
    // =====================================================================

    /** field: c5-ef-ta    (tensión arterial)      | columna Oracle: TODO_EF_TA */
    private String efTa;
    /** field: c5-ef-fc    (frecuencia cardíaca)   | columna Oracle: TODO_EF_FC */
    private String efFc;
    /** field: c5-ef-sat   (saturación O2)         | columna Oracle: TODO_EF_SAT */
    private String efSat;
    /** field: c5-ef-peso                          | columna Oracle: TODO_EF_PESO */
    private String efPeso;
    /** field: c5-ef-talla                         | columna Oracle: TODO_EF_TALLA */
    private String efTalla;
    /** field: ef-general                          | columna Oracle: TODO_EF_GENERAL */
    private String efGeneral;
    /** field: ef-derma    (dermatológico)         | columna Oracle: TODO_EF_DERMA */
    private String efDermatologico;
    /** field: ef-craneo                           | columna Oracle: TODO_EF_CRANEO */
    private String efCraneo;
    /** field: ef-ojos                             | columna Oracle: TODO_EF_OJOS */
    private String efOjos;
    /** field: ef-oidos                            | columna Oracle: TODO_EF_OIDOS */
    private String efOidos;
    /** field: ef-nariz                            | columna Oracle: TODO_EF_NARIZ */
    private String efNariz;
    /** field: ef-boca                             | columna Oracle: TODO_EF_BOCA */
    private String efBoca;
    /** field: ef-cuello                           | columna Oracle: TODO_EF_CUELLO */
    private String efCuello;
    /** field: ef-torax                            | columna Oracle: TODO_EF_TORAX */
    private String efTorax;
    /** field: ef-abdomen                          | columna Oracle: TODO_EF_ABDOMEN */
    private String efAbdomen;
    /** field: ef-genit    (genitales)             | columna Oracle: TODO_EF_GENITALES */
    private String efGenitales;
    /** field: ef-rectal                           | columna Oracle: TODO_EF_RECTAL */
    private String efRectal;
    /** field: ef-extsup   (extremidades superior) | columna Oracle: TODO_EF_EXT_SUP */
    private String efExtSuperiores;
    /** field: ef-extinf   (extremidades inferior) | columna Oracle: TODO_EF_EXT_INF */
    private String efExtInferiores;
    /** field: ef-neuro    (neurológico)           | columna Oracle: TODO_EF_NEURO */
    private String efNeurologico;

    // =====================================================================
    // SISTEMA RESPIRATORIO  (sheet7)
    // =====================================================================

    /** field: c7-resp-sint   | columna Oracle: TODO_RESP_SINT */
    private String respSintomatologia;
    /** field: c7-resp-espiro | columna Oracle: TODO_RESP_ESPIRO */
    private String respEspirometria;
    /** field: c7-resp-rx     | columna Oracle: TODO_RESP_RX */
    private String respRayosX;

    // =====================================================================
    // SISTEMA CARDIOVASCULAR  (sheet7)
    // =====================================================================

    /** field: c7-card-pef | columna Oracle: TODO_CARD_PEF */
    private String cardPruebaEsfuerzo;
    /** field: c7-card-ecg | columna Oracle: TODO_CARD_ECG */
    private String cardEcg;

    // =====================================================================
    // SISTEMA GASTROINTESTINAL  (sheet7)
    // =====================================================================

    /** field: c7-gi-sint   | columna Oracle: TODO_GI_SINT */
    private String giSintomatologia;
    /** field: c7-gi-eco    | columna Oracle: TODO_GI_ECO */
    private String giEcografia;
    /** field: c7-gi-pfh    | columna Oracle: TODO_GI_PFH */
    private String giPfh;
    /** field: c7-gi-copro  | columna Oracle: TODO_GI_COPRO */
    private String giCoprologico;
    /** field: c7-gi-coprop | columna Oracle: TODO_GI_COPROP */
    private String giCoprop;
    /** field: c7-gi-dental | columna Oracle: TODO_GI_DENTAL */
    private String giDental;
    /** field: omit-gi-dental (checkbox) | columna Oracle: TODO_GI_OMIT_DENTAL (CHAR 1: S/N) */
    private boolean omitirDental;

    // =====================================================================
    // SISTEMA GENITO-URINARIO  (sheet7)
    // =====================================================================

    /** field: c7-gu-sint    | columna Oracle: TODO_GU_SINT */
    private String guSintomatologia;
    /** field: c7-gu-ecoR    | columna Oracle: TODO_GU_ECO_RENAL */
    private String guEcoRenal;
    /** field: c7-gu-ecoP    (solo masculino) | columna Oracle: TODO_GU_ECO_PROS */
    private String guEcoProstatico;
    /** field: c7-gu-ecoPel  (solo femenino)  | columna Oracle: TODO_GU_ECO_PEL */
    private String guEcoPelvico;
    /** field: c7-gu-orina   | columna Oracle: TODO_GU_ORINA */
    private String guOrina;
    /** field: c7-gu-urea    | columna Oracle: TODO_GU_UREA */
    private String guUrea;
    /** field: c7-gu-creat   | columna Oracle: TODO_GU_CREATININA */
    private String guCreatinina;
    /** field: c7-gu-nitro   | columna Oracle: TODO_GU_NITROGENO */
    private String guNitrogeno;
    /** field: c7-gu-tfg     | columna Oracle: TODO_GU_TFG */
    private String guTfg;
    /** field: c7-gu-psa     (solo masculino) | columna Oracle: TODO_GU_PSA */
    private String guPsa;

    // =====================================================================
    // SISTEMA NERVIOSO  (sheet7)
    // =====================================================================

    /** field: c7-nerv-sint  | columna Oracle: TODO_NERV_SINT */
    private String nervSintomatologia;
    /** field: c7-nerv-oftal | columna Oracle: TODO_NERV_OFTAL */
    private String nervOftalmologia;
    /** field: c7-nerv-audio | columna Oracle: TODO_NERV_AUDIO */
    private String nervAudiologia;

    // =====================================================================
    // SISTEMA ENDOCRINO  (sheet7)
    // =====================================================================

    /** field: c7-endo-gluc     | columna Oracle: TODO_ENDO_GLUCOSA */
    private String endoGlucosa;
    /** field: c7-endo-au       | columna Oracle: TODO_ENDO_AC_URICO */
    private String endoAcUrico;
    /** field: c7-endo-colT     | columna Oracle: TODO_ENDO_COL_TOTAL */
    private String endoColTotal;
    /** field: c7-endo-trig     | columna Oracle: TODO_ENDO_TRIGLICERIDOS */
    private String endoTrigliceridos;
    /** field: c7-endo-hdl      | columna Oracle: TODO_ENDO_HDL */
    private String endoHdl;
    /** field: c7-endo-ldl      | columna Oracle: TODO_ENDO_LDL */
    private String endoLdl;
    /** field: c7-endo-lh       | columna Oracle: TODO_ENDO_LH */
    private String endoLh;
    /** field: c7-endo-fsh      | columna Oracle: TODO_ENDO_FSH */
    private String endoFsh;
    /** field: c7-endo-prl      | columna Oracle: TODO_ENDO_PROLACTINA */
    private String endoProlactina;
    /** field: c7-endo-prog     | columna Oracle: TODO_ENDO_PROGESTERONA */
    private String endoProgesterona;
    /** field: c7-endo-est      | columna Oracle: TODO_ENDO_ESTROGENOS */
    private String endoEstrogenos;
    /** field: c7-endo-imc      | columna Oracle: TODO_ENDO_IMC */
    private String endoImc;
    /** field: c7-endo-imcClass | columna Oracle: TODO_ENDO_IMC_CLASIF */
    private String endoImcClasificacion;

    // =====================================================================
    // SISTEMA MUSCULOESQUELÉTICO  (sheet7)
    // =====================================================================

    /** field: c7-muscu-sint  | columna Oracle: TODO_MUSCU_SINT */
    private String muscuSintomatologia;
    /** field: c7-muscu-rx    | columna Oracle: TODO_MUSCU_RX */
    private String muscuRayosX;
    /** field: c7-muscu-densi | columna Oracle: TODO_MUSCU_DENSI */
    private String muscuDensitometria;

    // =====================================================================
    // SISTEMA HEMATOPOYÉTICO  (sheet7)
    // =====================================================================

    /** field: c7-hema-bh     | columna Oracle: TODO_HEMA_BH */
    private String hemaBiometria;
    /** field: c7-hema-ca     | columna Oracle: TODO_HEMA_CALCIO */
    private String hemaCalcio;
    /** field: c7-hema-p      | columna Oracle: TODO_HEMA_FOSFORO */
    private String hemaFosforo;
    /** field: c7-hema-na     | columna Oracle: TODO_HEMA_SODIO */
    private String hemaSodio;
    /** field: c7-hema-k      | columna Oracle: TODO_HEMA_POTASIO */
    private String hemaPotasio;
    /** field: c7-hema-cl     | columna Oracle: TODO_HEMA_CLORURO */
    private String hemaCloruro;
    /** field: c7-hema-fe     | columna Oracle: TODO_HEMA_HIERRO */
    private String hemaHierro;
    /** field: c7-hema-grupo  | columna Oracle: TODO_HEMA_GRUPO */
    private String hemaGrupoSanguineo;
    /** field: c7-hema-vih    | columna Oracle: TODO_HEMA_VIH */
    private String hemaVih;
    /** field: c7-hema-vdrl   | columna Oracle: TODO_HEMA_VDRL */
    private String hemaVdrl;

    // =====================================================================
    // CONCLUSIONES  (sheet9)
    // =====================================================================

    /** field: c9-resp   | columna Oracle: TODO_CONC_RESP */
    private String concRespiratorio;
    /** field: c9-card   | columna Oracle: TODO_CONC_CARD */
    private String concCardiovascular;
    /** field: c9-gi     | columna Oracle: TODO_CONC_GI */
    private String concGastrointestinal;
    /** field: c9-gu     | columna Oracle: TODO_CONC_GU */
    private String concGenitourinario;
    /** field: c9-nerv   | columna Oracle: TODO_CONC_NERV */
    private String concNervioso;
    /** field: c9-muscu  | columna Oracle: TODO_CONC_MUSCU */
    private String concMusculoesqueletico;
    /** field: c9-hema   | columna Oracle: TODO_CONC_HEMA */
    private String concHematopoyetico;
    /** field: c9-endo   | columna Oracle: TODO_CONC_ENDO */
    private String concEndocrino;
    /** field: c9-dental | columna Oracle: TODO_CONC_DENTAL */
    private String concDental;
    /** field: omit-dental (checkbox) | columna Oracle: TODO_CONC_OMIT_DENTAL */
    private boolean omitirDentalConc;

    // =====================================================================
    // SUGERENCIAS  (sheet11)
    // =====================================================================

    /** field: c11-sugs (texto libre, una sugerencia por línea) | columna Oracle: TODO_SUGERENCIAS */
    private String sugerencias;
    /** field: c11-doc-nombre      | columna Oracle: TODO_SUG_DOC_NOMBRE */
    private String sugerenciasDocNombre;
    /** field: c11-doc-cedula      | columna Oracle: TODO_SUG_DOC_CEDULA */
    private String sugerenciasDocCedula;
    /** field: c11-doc-especialidad| columna Oracle: TODO_SUG_DOC_ESPEC */
    private String sugerenciasDocEspecialidad;
    /** field: c11-firma-img (BLOB imagen de firma) | columna Oracle: TODO_SUG_FIRMA_IMG (BLOB) */
    private byte[] sugerenciasFirmaImg;

    // =====================================================================
    // PRUEBA DE ESFUERZO Y ECG  (sheet13)
    // =====================================================================

    /** field: c13-fecha   | columna Oracle: TODO_ESF_FECHA */
    private String esfuerzoFecha;
    /** field: c13-mets    | columna Oracle: TODO_ESF_METS */
    private String esfuerzoMets;
    /** field: c13-fcmax   | columna Oracle: TODO_ESF_FCMAX */
    private String esfuerzoFcmax;
    /** field: c13-tamax   | columna Oracle: TODO_ESF_TAMAX */
    private String esfuerzoTamax;
    /** field: c13-ritmo   | columna Oracle: TODO_ESF_RITMO */
    private String esfuerzoRitmo;
    /** field: c13-resultado      | columna Oracle: TODO_ESF_RESULTADO */
    private String esfuerzoResultado;
    /** field: c13-interp         | columna Oracle: TODO_ESF_INTERP */
    private String esfuerzoInterpretacion;
    /** field: c13-img (BLOB)     | columna Oracle: TODO_ESF_IMG (BLOB) */
    private byte[] esfuerzoImagen;

    // =====================================================================
    // ESPIROMETRÍA  (sheet15)
    // =====================================================================

    /** field: c15-fecha    | columna Oracle: TODO_ESPIRO_FECHA */
    private String espiroFecha;
    /** field: c15-fvc      | columna Oracle: TODO_ESPIRO_FVC */
    private String espiroFvc;
    /** field: c15-fev1     | columna Oracle: TODO_ESPIRO_FEV1 */
    private String espiroFev1;
    /** field: c15-fev1fvc  | columna Oracle: TODO_ESPIRO_FEV1FVC */
    private String espiroFev1Fvc;
    /** field: c15-patron   | columna Oracle: TODO_ESPIRO_PATRON */
    private String espiroPatron;
    /** field: c15-resultado      | columna Oracle: TODO_ESPIRO_RESULTADO */
    private String espiroResultado;
    /** field: c15-interp         | columna Oracle: TODO_ESPIRO_INTERP */
    private String espiroInterpretacion;
    /** field: c15-img (BLOB)     | columna Oracle: TODO_ESPIRO_IMG (BLOB) */
    private byte[] espiroImagen;

    // =====================================================================
    // ESTUDIOS DE GABINETE  (sheet17)
    // =====================================================================

    /** field: c17-notas  | columna Oracle: TODO_GAB_NOTAS */
    private String gabineteNotas;
    /** field: c17-img (BLOB) | columna Oracle: TODO_GAB_IMG (BLOB) */
    private byte[] gabineteImagen;

    // =====================================================================
    // OFTALMOLOGÍA  (sheet19)
    // =====================================================================

    /** field: c19-fecha   | columna Oracle: TODO_OFTAL_FECHA */
    private String oftalFecha;
    /** field: c19-avOD    | columna Oracle: TODO_OFTAL_AV_OD */
    private String oftalAvOd;
    /** field: c19-avOI    | columna Oracle: TODO_OFTAL_AV_OI */
    private String oftalAvOi;
    /** field: c19-pioOD   | columna Oracle: TODO_OFTAL_PIO_OD */
    private String oftalPioOd;
    /** field: c19-pioOI   | columna Oracle: TODO_OFTAL_PIO_OI */
    private String oftalPioOi;
    /** field: c19-fondo   | columna Oracle: TODO_OFTAL_FONDO */
    private String oftalFondo;
    /** field: c19-segAnt  | columna Oracle: TODO_OFTAL_SEG_ANT */
    private String oftalSegAnterior;
    /** field: c19-resultado      | columna Oracle: TODO_OFTAL_RESULTADO */
    private String oftalResultado;
    /** field: c19-reco           | columna Oracle: TODO_OFTAL_RECO */
    private String oftalRecomendaciones;
    /** field: c19-img (BLOB)     | columna Oracle: TODO_OFTAL_IMG (BLOB) */
    private byte[] oftalImagen;

    // =====================================================================
    // LABORATORIO  (sheet21)
    // =====================================================================

    /** field: c21-fecha  | columna Oracle: TODO_LAB_FECHA */
    private String labFecha;
    /** field: c21-lab    | columna Oracle: TODO_LAB_NOMBRE */
    private String labNombre;
    /** field: c21-obs    | columna Oracle: TODO_LAB_OBS */
    private String labObservaciones;
    /** field: c21-img (BLOB) | columna Oracle: TODO_LAB_IMG (BLOB) */
    private byte[] labImagen;

    // =====================================================================
    // FIRMA DEL DOCTOR  (sheet22)
    // =====================================================================

    /** field: c22-nombre       | columna Oracle: TODO_FIRMA_NOMBRE */
    private String firmaNombre;
    /** field: c22-cedula       | columna Oracle: TODO_FIRMA_CEDULA */
    private String firmaCedula;
    /** field: c22-especialidad | columna Oracle: TODO_FIRMA_ESPEC */
    private String firmaEspecialidad;
    /** field: c22-clinica      | columna Oracle: TODO_FIRMA_CLINICA */
    private String firmaClinica;
    /** field: c22-firma-img (BLOB) | columna Oracle: TODO_FIRMA_IMG (BLOB) */
    private byte[] firmaImagen;

    // =====================================================================
    // AUDIOMETRÍA  (sheet24)
    // =====================================================================

    /** field: c24-fecha        | columna Oracle: TODO_AUD_FECHA */
    private String audFecha;
    /** field: c24-od-500       | columna Oracle: TODO_AUD_OD_500 */
    private String audOd500;
    /** field: c24-od-1k        | columna Oracle: TODO_AUD_OD_1K */
    private String audOd1k;
    /** field: c24-od-2k        | columna Oracle: TODO_AUD_OD_2K */
    private String audOd2k;
    /** field: c24-od-4k        | columna Oracle: TODO_AUD_OD_4K */
    private String audOd4k;
    /** field: c24-od-8k        | columna Oracle: TODO_AUD_OD_8K */
    private String audOd8k;
    /** field: c24-od-clasif    | columna Oracle: TODO_AUD_OD_CLASIF */
    private String audOdClasificacion;
    /** field: c24-oi-500       | columna Oracle: TODO_AUD_OI_500 */
    private String audOi500;
    /** field: c24-oi-1k        | columna Oracle: TODO_AUD_OI_1K */
    private String audOi1k;
    /** field: c24-oi-2k        | columna Oracle: TODO_AUD_OI_2K */
    private String audOi2k;
    /** field: c24-oi-4k        | columna Oracle: TODO_AUD_OI_4K */
    private String audOi4k;
    /** field: c24-oi-8k        | columna Oracle: TODO_AUD_OI_8K */
    private String audOi8k;
    /** field: c24-oi-clasif    | columna Oracle: TODO_AUD_OI_CLASIF */
    private String audOiClasificacion;
    /** field: c24-resultado    | columna Oracle: TODO_AUD_RESULTADO */
    private String audResultado;
    /** field: c24-reco         | columna Oracle: TODO_AUD_RECO */
    private String audRecomendaciones;
    /** field: c24-img (BLOB)   | columna Oracle: TODO_AUD_IMG (BLOB) */
    private byte[] audImagen;

    // =====================================================================
    // DIAGNÓSTICO DENTAL  (sheet26)
    // =====================================================================

    /** field: c26-fecha          | columna Oracle: TODO_DENTAL_FECHA */
    private String dentalFecha;
    /** field: c26-periodontal    | columna Oracle: TODO_DENTAL_PERIO */
    private String dentalPeriodontal;
    /** field: c26-higiene        | columna Oracle: TODO_DENTAL_HIGIENE */
    private String dentalHigiene;
    /** field: c26-caries         | columna Oracle: TODO_DENTAL_CARIES */
    private String dentalCaries;
    /** field: c26-faltantes      | columna Oracle: TODO_DENTAL_FALT */
    private String dentalFaltantes;
    /** field: c26-restauracion   | columna Oracle: TODO_DENTAL_REST */
    private String dentalRestauracion;
    /** field: c26-otros          | columna Oracle: TODO_DENTAL_OTROS */
    private String dentalOtros;
    /** field: c26-tratamiento    | columna Oracle: TODO_DENTAL_TRAT */
    private String dentalTratamiento;
    /** field: c26-diagnostico    | columna Oracle: TODO_DENTAL_DIAG */
    private String dentalDiagnostico;
    /** field: c26-reco           | columna Oracle: TODO_DENTAL_RECO */
    private String dentalRecomendaciones;
    /** field: c26-img (BLOB)     | columna Oracle: TODO_DENTAL_IMG (BLOB) */
    private byte[] dentalImagen;

    // =====================================================================
    // IMÁGENES DE PORTADA  (BLOB por cada portada)
    // =====================================================================

    /** field: cover-1  | columna Oracle: TODO_PORT_PRINCIPAL (BLOB) */
    private byte[] portadaPrincipal;
    /** field: cover-2  | columna Oracle: TODO_PORT_OBJETIVOS (BLOB) */
    private byte[] portadaObjetivos;
    /** field: cover-3  | columna Oracle: TODO_PORT_INTRO (BLOB) */
    private byte[] portadaIntroduccion;
    /** field: cover-4  | columna Oracle: TODO_PORT_HALLAZGOS (BLOB) */
    private byte[] portadaHallazgos;
    /** field: cover-6  | columna Oracle: TODO_PORT_SISTEMAS (BLOB) */
    private byte[] portadaSistemas;
    /** field: cover-8  | columna Oracle: TODO_PORT_CONCL (BLOB) */
    private byte[] portadaConclusiones;
    /** field: cover-10 | columna Oracle: TODO_PORT_SUG (BLOB) */
    private byte[] portadaSugerencias;
    /** field: cover-12 | columna Oracle: TODO_PORT_ESF (BLOB) */
    private byte[] portadaEsfuerzo;
    /** field: cover-14 | columna Oracle: TODO_PORT_ESPIRO (BLOB) */
    private byte[] portadaEspirometria;
    /** field: cover-16 | columna Oracle: TODO_PORT_GAB (BLOB) */
    private byte[] portadaGabinete;
    /** field: cover-18 | columna Oracle: TODO_PORT_OFTAL (BLOB) */
    private byte[] portadaOftalmologia;
    /** field: cover-20 | columna Oracle: TODO_PORT_LAB (BLOB) */
    private byte[] portadaLaboratorio;
    /** field: cover-23 | columna Oracle: TODO_PORT_AUD (BLOB) */
    private byte[] portadaAudiometria;
    /** field: cover-25 | columna Oracle: TODO_PORT_DENTAL (BLOB) */
    private byte[] portadaDental;

    // =====================================================================
    // IMÁGENES DE MEMBRETE / FONDO  (BLOB por cada sección de contenido)
    // =====================================================================

    /** field: mb-5  | columna Oracle: TODO_MB_HALLAZGOS (BLOB) */
    private byte[] membrete5;
    /** field: mb-7  | columna Oracle: TODO_MB_SISTEMAS (BLOB) */
    private byte[] membrete7;
    /** field: mb-9  | columna Oracle: TODO_MB_CONCL (BLOB) */
    private byte[] membrete9;
    /** field: mb-11 | columna Oracle: TODO_MB_SUG (BLOB) */
    private byte[] membrete11;
    /** field: mb-13 | columna Oracle: TODO_MB_ESF (BLOB) */
    private byte[] membrete13;
    /** field: mb-15 | columna Oracle: TODO_MB_ESPIRO (BLOB) */
    private byte[] membrete15;
    /** field: mb-17 | columna Oracle: TODO_MB_GAB (BLOB) */
    private byte[] membrete17;
    /** field: mb-19 | columna Oracle: TODO_MB_OFTAL (BLOB) */
    private byte[] membrete19;
    /** field: mb-21 | columna Oracle: TODO_MB_LAB (BLOB) */
    private byte[] membrete21;
    /** field: mb-24 | columna Oracle: TODO_MB_AUD (BLOB) */
    private byte[] membrete24;
    /** field: mb-26 | columna Oracle: TODO_MB_DENTAL (BLOB) */
    private byte[] membrete26;

    // =====================================================================
    // GETTERS Y SETTERS
    // =====================================================================

    public Long getPatientId() { return patientId; }
    public void setPatientId(Long patientId) { this.patientId = patientId; }

    public String getSexo() { return sexo; }
    public void setSexo(String sexo) { this.sexo = sexo; }

    public String getEdad() { return edad; }
    public void setEdad(String edad) { this.edad = edad; }

    public String getAntecedentesHeredoFamiliares() { return antecedentesHeredoFamiliares; }
    public void setAntecedentesHeredoFamiliares(String v) { this.antecedentesHeredoFamiliares = v; }

    public String getNpOrigen() { return npOrigen; }
    public void setNpOrigen(String v) { this.npOrigen = v; }
    public String getNpResidencia() { return npResidencia; }
    public void setNpResidencia(String v) { this.npResidencia = v; }
    public String getNpAlcohol() { return npAlcohol; }
    public void setNpAlcohol(String v) { this.npAlcohol = v; }
    public String getNpFumar() { return npFumar; }
    public void setNpFumar(String v) { this.npFumar = v; }
    public String getNpDeportes() { return npDeportes; }
    public void setNpDeportes(String v) { this.npDeportes = v; }
    public String getNpVision() { return npVision; }
    public void setNpVision(String v) { this.npVision = v; }
    public String getNpAuditivo() { return npAuditivo; }
    public void setNpAuditivo(String v) { this.npAuditivo = v; }
    public String getNpTransfusiones() { return npTransfusiones; }
    public void setNpTransfusiones(String v) { this.npTransfusiones = v; }
    public String getNpHospitalizaciones() { return npHospitalizaciones; }
    public void setNpHospitalizaciones(String v) { this.npHospitalizaciones = v; }
    public String getNpCirugias() { return npCirugias; }
    public void setNpCirugias(String v) { this.npCirugias = v; }
    public String getNpMedicamentos() { return npMedicamentos; }
    public void setNpMedicamentos(String v) { this.npMedicamentos = v; }
    public String getNpEnfInfecciosas() { return npEnfInfecciosas; }
    public void setNpEnfInfecciosas(String v) { this.npEnfInfecciosas = v; }
    public String getNpAlergias() { return npAlergias; }
    public void setNpAlergias(String v) { this.npAlergias = v; }
    public String getNpFracturas() { return npFracturas; }
    public void setNpFracturas(String v) { this.npFracturas = v; }
    public String getNpGrupoSanguineo() { return npGrupoSanguineo; }
    public void setNpGrupoSanguineo(String v) { this.npGrupoSanguineo = v; }
    public String getNpInmunizaciones() { return npInmunizaciones; }
    public void setNpInmunizaciones(String v) { this.npInmunizaciones = v; }

    public String getPpProstata() { return ppProstata; }
    public void setPpProstata(String v) { this.ppProstata = v; }
    public String getPpMenarca() { return ppMenarca; }
    public void setPpMenarca(String v) { this.ppMenarca = v; }
    public String getPpGesta() { return ppGesta; }
    public void setPpGesta(String v) { this.ppGesta = v; }
    public String getPpPara() { return ppPara; }
    public void setPpPara(String v) { this.ppPara = v; }
    public String getPpAborto() { return ppAborto; }
    public void setPpAborto(String v) { this.ppAborto = v; }
    public String getPpCesareas() { return ppCesareas; }
    public void setPpCesareas(String v) { this.ppCesareas = v; }
    public String getPpLactancia1() { return ppLactancia1; }
    public void setPpLactancia1(String v) { this.ppLactancia1 = v; }
    public String getPpLactancia2() { return ppLactancia2; }
    public void setPpLactancia2(String v) { this.ppLactancia2 = v; }
    public String getPpLactancia3() { return ppLactancia3; }
    public void setPpLactancia3(String v) { this.ppLactancia3 = v; }
    public String getPpFumTiempo() { return ppFumTiempo; }
    public void setPpFumTiempo(String v) { this.ppFumTiempo = v; }
    public String getPpOtros() { return ppOtros; }
    public void setPpOtros(String v) { this.ppOtros = v; }

    public String getEfTa() { return efTa; }
    public void setEfTa(String v) { this.efTa = v; }
    public String getEfFc() { return efFc; }
    public void setEfFc(String v) { this.efFc = v; }
    public String getEfSat() { return efSat; }
    public void setEfSat(String v) { this.efSat = v; }
    public String getEfPeso() { return efPeso; }
    public void setEfPeso(String v) { this.efPeso = v; }
    public String getEfTalla() { return efTalla; }
    public void setEfTalla(String v) { this.efTalla = v; }
    public String getEfGeneral() { return efGeneral; }
    public void setEfGeneral(String v) { this.efGeneral = v; }
    public String getEfDermatologico() { return efDermatologico; }
    public void setEfDermatologico(String v) { this.efDermatologico = v; }
    public String getEfCraneo() { return efCraneo; }
    public void setEfCraneo(String v) { this.efCraneo = v; }
    public String getEfOjos() { return efOjos; }
    public void setEfOjos(String v) { this.efOjos = v; }
    public String getEfOidos() { return efOidos; }
    public void setEfOidos(String v) { this.efOidos = v; }
    public String getEfNariz() { return efNariz; }
    public void setEfNariz(String v) { this.efNariz = v; }
    public String getEfBoca() { return efBoca; }
    public void setEfBoca(String v) { this.efBoca = v; }
    public String getEfCuello() { return efCuello; }
    public void setEfCuello(String v) { this.efCuello = v; }
    public String getEfTorax() { return efTorax; }
    public void setEfTorax(String v) { this.efTorax = v; }
    public String getEfAbdomen() { return efAbdomen; }
    public void setEfAbdomen(String v) { this.efAbdomen = v; }
    public String getEfGenitales() { return efGenitales; }
    public void setEfGenitales(String v) { this.efGenitales = v; }
    public String getEfRectal() { return efRectal; }
    public void setEfRectal(String v) { this.efRectal = v; }
    public String getEfExtSuperiores() { return efExtSuperiores; }
    public void setEfExtSuperiores(String v) { this.efExtSuperiores = v; }
    public String getEfExtInferiores() { return efExtInferiores; }
    public void setEfExtInferiores(String v) { this.efExtInferiores = v; }
    public String getEfNeurologico() { return efNeurologico; }
    public void setEfNeurologico(String v) { this.efNeurologico = v; }

    public String getRespSintomatologia() { return respSintomatologia; }
    public void setRespSintomatologia(String v) { this.respSintomatologia = v; }
    public String getRespEspirometria() { return respEspirometria; }
    public void setRespEspirometria(String v) { this.respEspirometria = v; }
    public String getRespRayosX() { return respRayosX; }
    public void setRespRayosX(String v) { this.respRayosX = v; }

    public String getCardPruebaEsfuerzo() { return cardPruebaEsfuerzo; }
    public void setCardPruebaEsfuerzo(String v) { this.cardPruebaEsfuerzo = v; }
    public String getCardEcg() { return cardEcg; }
    public void setCardEcg(String v) { this.cardEcg = v; }

    public String getGiSintomatologia() { return giSintomatologia; }
    public void setGiSintomatologia(String v) { this.giSintomatologia = v; }
    public String getGiEcografia() { return giEcografia; }
    public void setGiEcografia(String v) { this.giEcografia = v; }
    public String getGiPfh() { return giPfh; }
    public void setGiPfh(String v) { this.giPfh = v; }
    public String getGiCoprologico() { return giCoprologico; }
    public void setGiCoprologico(String v) { this.giCoprologico = v; }
    public String getGiCoprop() { return giCoprop; }
    public void setGiCoprop(String v) { this.giCoprop = v; }
    public String getGiDental() { return giDental; }
    public void setGiDental(String v) { this.giDental = v; }
    public boolean isOmitirDental() { return omitirDental; }
    public void setOmitirDental(boolean v) { this.omitirDental = v; }

    public String getGuSintomatologia() { return guSintomatologia; }
    public void setGuSintomatologia(String v) { this.guSintomatologia = v; }
    public String getGuEcoRenal() { return guEcoRenal; }
    public void setGuEcoRenal(String v) { this.guEcoRenal = v; }
    public String getGuEcoProstatico() { return guEcoProstatico; }
    public void setGuEcoProstatico(String v) { this.guEcoProstatico = v; }
    public String getGuEcoPelvico() { return guEcoPelvico; }
    public void setGuEcoPelvico(String v) { this.guEcoPelvico = v; }
    public String getGuOrina() { return guOrina; }
    public void setGuOrina(String v) { this.guOrina = v; }
    public String getGuUrea() { return guUrea; }
    public void setGuUrea(String v) { this.guUrea = v; }
    public String getGuCreatinina() { return guCreatinina; }
    public void setGuCreatinina(String v) { this.guCreatinina = v; }
    public String getGuNitrogeno() { return guNitrogeno; }
    public void setGuNitrogeno(String v) { this.guNitrogeno = v; }
    public String getGuTfg() { return guTfg; }
    public void setGuTfg(String v) { this.guTfg = v; }
    public String getGuPsa() { return guPsa; }
    public void setGuPsa(String v) { this.guPsa = v; }

    public String getNervSintomatologia() { return nervSintomatologia; }
    public void setNervSintomatologia(String v) { this.nervSintomatologia = v; }
    public String getNervOftalmologia() { return nervOftalmologia; }
    public void setNervOftalmologia(String v) { this.nervOftalmologia = v; }
    public String getNervAudiologia() { return nervAudiologia; }
    public void setNervAudiologia(String v) { this.nervAudiologia = v; }

    public String getEndoGlucosa() { return endoGlucosa; }
    public void setEndoGlucosa(String v) { this.endoGlucosa = v; }
    public String getEndoAcUrico() { return endoAcUrico; }
    public void setEndoAcUrico(String v) { this.endoAcUrico = v; }
    public String getEndoColTotal() { return endoColTotal; }
    public void setEndoColTotal(String v) { this.endoColTotal = v; }
    public String getEndoTrigliceridos() { return endoTrigliceridos; }
    public void setEndoTrigliceridos(String v) { this.endoTrigliceridos = v; }
    public String getEndoHdl() { return endoHdl; }
    public void setEndoHdl(String v) { this.endoHdl = v; }
    public String getEndoLdl() { return endoLdl; }
    public void setEndoLdl(String v) { this.endoLdl = v; }
    public String getEndoLh() { return endoLh; }
    public void setEndoLh(String v) { this.endoLh = v; }
    public String getEndoFsh() { return endoFsh; }
    public void setEndoFsh(String v) { this.endoFsh = v; }
    public String getEndoProlactina() { return endoProlactina; }
    public void setEndoProlactina(String v) { this.endoProlactina = v; }
    public String getEndoProgesterona() { return endoProgesterona; }
    public void setEndoProgesterona(String v) { this.endoProgesterona = v; }
    public String getEndoEstrogenos() { return endoEstrogenos; }
    public void setEndoEstrogenos(String v) { this.endoEstrogenos = v; }
    public String getEndoImc() { return endoImc; }
    public void setEndoImc(String v) { this.endoImc = v; }
    public String getEndoImcClasificacion() { return endoImcClasificacion; }
    public void setEndoImcClasificacion(String v) { this.endoImcClasificacion = v; }

    public String getMuscuSintomatologia() { return muscuSintomatologia; }
    public void setMuscuSintomatologia(String v) { this.muscuSintomatologia = v; }
    public String getMuscuRayosX() { return muscuRayosX; }
    public void setMuscuRayosX(String v) { this.muscuRayosX = v; }
    public String getMuscuDensitometria() { return muscuDensitometria; }
    public void setMuscuDensitometria(String v) { this.muscuDensitometria = v; }

    public String getHemaBiometria() { return hemaBiometria; }
    public void setHemaBiometria(String v) { this.hemaBiometria = v; }
    public String getHemaCalcio() { return hemaCalcio; }
    public void setHemaCalcio(String v) { this.hemaCalcio = v; }
    public String getHemaFosforo() { return hemaFosforo; }
    public void setHemaFosforo(String v) { this.hemaFosforo = v; }
    public String getHemaSodio() { return hemaSodio; }
    public void setHemaSodio(String v) { this.hemaSodio = v; }
    public String getHemaPotasio() { return hemaPotasio; }
    public void setHemaPotasio(String v) { this.hemaPotasio = v; }
    public String getHemaCloruro() { return hemaCloruro; }
    public void setHemaCloruro(String v) { this.hemaCloruro = v; }
    public String getHemaHierro() { return hemaHierro; }
    public void setHemaHierro(String v) { this.hemaHierro = v; }
    public String getHemaGrupoSanguineo() { return hemaGrupoSanguineo; }
    public void setHemaGrupoSanguineo(String v) { this.hemaGrupoSanguineo = v; }
    public String getHemaVih() { return hemaVih; }
    public void setHemaVih(String v) { this.hemaVih = v; }
    public String getHemaVdrl() { return hemaVdrl; }
    public void setHemaVdrl(String v) { this.hemaVdrl = v; }

    public String getConcRespiratorio() { return concRespiratorio; }
    public void setConcRespiratorio(String v) { this.concRespiratorio = v; }
    public String getConcCardiovascular() { return concCardiovascular; }
    public void setConcCardiovascular(String v) { this.concCardiovascular = v; }
    public String getConcGastrointestinal() { return concGastrointestinal; }
    public void setConcGastrointestinal(String v) { this.concGastrointestinal = v; }
    public String getConcGenitourinario() { return concGenitourinario; }
    public void setConcGenitourinario(String v) { this.concGenitourinario = v; }
    public String getConcNervioso() { return concNervioso; }
    public void setConcNervioso(String v) { this.concNervioso = v; }
    public String getConcMusculoesqueletico() { return concMusculoesqueletico; }
    public void setConcMusculoesqueletico(String v) { this.concMusculoesqueletico = v; }
    public String getConcHematopoyetico() { return concHematopoyetico; }
    public void setConcHematopoyetico(String v) { this.concHematopoyetico = v; }
    public String getConcEndocrino() { return concEndocrino; }
    public void setConcEndocrino(String v) { this.concEndocrino = v; }
    public String getConcDental() { return concDental; }
    public void setConcDental(String v) { this.concDental = v; }
    public boolean isOmitirDentalConc() { return omitirDentalConc; }
    public void setOmitirDentalConc(boolean v) { this.omitirDentalConc = v; }

    public String getSugerencias() { return sugerencias; }
    public void setSugerencias(String v) { this.sugerencias = v; }
    public String getSugerenciasDocNombre() { return sugerenciasDocNombre; }
    public void setSugerenciasDocNombre(String v) { this.sugerenciasDocNombre = v; }
    public String getSugerenciasDocCedula() { return sugerenciasDocCedula; }
    public void setSugerenciasDocCedula(String v) { this.sugerenciasDocCedula = v; }
    public String getSugerenciasDocEspecialidad() { return sugerenciasDocEspecialidad; }
    public void setSugerenciasDocEspecialidad(String v) { this.sugerenciasDocEspecialidad = v; }
    public byte[] getSugerenciasFirmaImg() { return sugerenciasFirmaImg; }
    public void setSugerenciasFirmaImg(byte[] v) { this.sugerenciasFirmaImg = v; }

    public String getEsfuerzoFecha() { return esfuerzoFecha; }
    public void setEsfuerzoFecha(String v) { this.esfuerzoFecha = v; }
    public String getEsfuerzoMets() { return esfuerzoMets; }
    public void setEsfuerzoMets(String v) { this.esfuerzoMets = v; }
    public String getEsfuerzoFcmax() { return esfuerzoFcmax; }
    public void setEsfuerzoFcmax(String v) { this.esfuerzoFcmax = v; }
    public String getEsfuerzoTamax() { return esfuerzoTamax; }
    public void setEsfuerzoTamax(String v) { this.esfuerzoTamax = v; }
    public String getEsfuerzoRitmo() { return esfuerzoRitmo; }
    public void setEsfuerzoRitmo(String v) { this.esfuerzoRitmo = v; }
    public String getEsfuerzoResultado() { return esfuerzoResultado; }
    public void setEsfuerzoResultado(String v) { this.esfuerzoResultado = v; }
    public String getEsfuerzoInterpretacion() { return esfuerzoInterpretacion; }
    public void setEsfuerzoInterpretacion(String v) { this.esfuerzoInterpretacion = v; }
    public byte[] getEsfuerzoImagen() { return esfuerzoImagen; }
    public void setEsfuerzoImagen(byte[] v) { this.esfuerzoImagen = v; }

    public String getEspiroFecha() { return espiroFecha; }
    public void setEspiroFecha(String v) { this.espiroFecha = v; }
    public String getEspiroFvc() { return espiroFvc; }
    public void setEspiroFvc(String v) { this.espiroFvc = v; }
    public String getEspiroFev1() { return espiroFev1; }
    public void setEspiroFev1(String v) { this.espiroFev1 = v; }
    public String getEspiroFev1Fvc() { return espiroFev1Fvc; }
    public void setEspiroFev1Fvc(String v) { this.espiroFev1Fvc = v; }
    public String getEspiroPatron() { return espiroPatron; }
    public void setEspiroPatron(String v) { this.espiroPatron = v; }
    public String getEspiroResultado() { return espiroResultado; }
    public void setEspiroResultado(String v) { this.espiroResultado = v; }
    public String getEspiroInterpretacion() { return espiroInterpretacion; }
    public void setEspiroInterpretacion(String v) { this.espiroInterpretacion = v; }
    public byte[] getEspiroImagen() { return espiroImagen; }
    public void setEspiroImagen(byte[] v) { this.espiroImagen = v; }

    public String getGabineteNotas() { return gabineteNotas; }
    public void setGabineteNotas(String v) { this.gabineteNotas = v; }
    public byte[] getGabineteImagen() { return gabineteImagen; }
    public void setGabineteImagen(byte[] v) { this.gabineteImagen = v; }

    public String getOftalFecha() { return oftalFecha; }
    public void setOftalFecha(String v) { this.oftalFecha = v; }
    public String getOftalAvOd() { return oftalAvOd; }
    public void setOftalAvOd(String v) { this.oftalAvOd = v; }
    public String getOftalAvOi() { return oftalAvOi; }
    public void setOftalAvOi(String v) { this.oftalAvOi = v; }
    public String getOftalPioOd() { return oftalPioOd; }
    public void setOftalPioOd(String v) { this.oftalPioOd = v; }
    public String getOftalPioOi() { return oftalPioOi; }
    public void setOftalPioOi(String v) { this.oftalPioOi = v; }
    public String getOftalFondo() { return oftalFondo; }
    public void setOftalFondo(String v) { this.oftalFondo = v; }
    public String getOftalSegAnterior() { return oftalSegAnterior; }
    public void setOftalSegAnterior(String v) { this.oftalSegAnterior = v; }
    public String getOftalResultado() { return oftalResultado; }
    public void setOftalResultado(String v) { this.oftalResultado = v; }
    public String getOftalRecomendaciones() { return oftalRecomendaciones; }
    public void setOftalRecomendaciones(String v) { this.oftalRecomendaciones = v; }
    public byte[] getOftalImagen() { return oftalImagen; }
    public void setOftalImagen(byte[] v) { this.oftalImagen = v; }

    public String getLabFecha() { return labFecha; }
    public void setLabFecha(String v) { this.labFecha = v; }
    public String getLabNombre() { return labNombre; }
    public void setLabNombre(String v) { this.labNombre = v; }
    public String getLabObservaciones() { return labObservaciones; }
    public void setLabObservaciones(String v) { this.labObservaciones = v; }
    public byte[] getLabImagen() { return labImagen; }
    public void setLabImagen(byte[] v) { this.labImagen = v; }

    public String getFirmaNombre() { return firmaNombre; }
    public void setFirmaNombre(String v) { this.firmaNombre = v; }
    public String getFirmaCedula() { return firmaCedula; }
    public void setFirmaCedula(String v) { this.firmaCedula = v; }
    public String getFirmaEspecialidad() { return firmaEspecialidad; }
    public void setFirmaEspecialidad(String v) { this.firmaEspecialidad = v; }
    public String getFirmaClinica() { return firmaClinica; }
    public void setFirmaClinica(String v) { this.firmaClinica = v; }
    public byte[] getFirmaImagen() { return firmaImagen; }
    public void setFirmaImagen(byte[] v) { this.firmaImagen = v; }

    public String getAudFecha() { return audFecha; }
    public void setAudFecha(String v) { this.audFecha = v; }
    public String getAudOd500() { return audOd500; }
    public void setAudOd500(String v) { this.audOd500 = v; }
    public String getAudOd1k() { return audOd1k; }
    public void setAudOd1k(String v) { this.audOd1k = v; }
    public String getAudOd2k() { return audOd2k; }
    public void setAudOd2k(String v) { this.audOd2k = v; }
    public String getAudOd4k() { return audOd4k; }
    public void setAudOd4k(String v) { this.audOd4k = v; }
    public String getAudOd8k() { return audOd8k; }
    public void setAudOd8k(String v) { this.audOd8k = v; }
    public String getAudOdClasificacion() { return audOdClasificacion; }
    public void setAudOdClasificacion(String v) { this.audOdClasificacion = v; }
    public String getAudOi500() { return audOi500; }
    public void setAudOi500(String v) { this.audOi500 = v; }
    public String getAudOi1k() { return audOi1k; }
    public void setAudOi1k(String v) { this.audOi1k = v; }
    public String getAudOi2k() { return audOi2k; }
    public void setAudOi2k(String v) { this.audOi2k = v; }
    public String getAudOi4k() { return audOi4k; }
    public void setAudOi4k(String v) { this.audOi4k = v; }
    public String getAudOi8k() { return audOi8k; }
    public void setAudOi8k(String v) { this.audOi8k = v; }
    public String getAudOiClasificacion() { return audOiClasificacion; }
    public void setAudOiClasificacion(String v) { this.audOiClasificacion = v; }
    public String getAudResultado() { return audResultado; }
    public void setAudResultado(String v) { this.audResultado = v; }
    public String getAudRecomendaciones() { return audRecomendaciones; }
    public void setAudRecomendaciones(String v) { this.audRecomendaciones = v; }
    public byte[] getAudImagen() { return audImagen; }
    public void setAudImagen(byte[] v) { this.audImagen = v; }

    public String getDentalFecha() { return dentalFecha; }
    public void setDentalFecha(String v) { this.dentalFecha = v; }
    public String getDentalPeriodontal() { return dentalPeriodontal; }
    public void setDentalPeriodontal(String v) { this.dentalPeriodontal = v; }
    public String getDentalHigiene() { return dentalHigiene; }
    public void setDentalHigiene(String v) { this.dentalHigiene = v; }
    public String getDentalCaries() { return dentalCaries; }
    public void setDentalCaries(String v) { this.dentalCaries = v; }
    public String getDentalFaltantes() { return dentalFaltantes; }
    public void setDentalFaltantes(String v) { this.dentalFaltantes = v; }
    public String getDentalRestauracion() { return dentalRestauracion; }
    public void setDentalRestauracion(String v) { this.dentalRestauracion = v; }
    public String getDentalOtros() { return dentalOtros; }
    public void setDentalOtros(String v) { this.dentalOtros = v; }
    public String getDentalTratamiento() { return dentalTratamiento; }
    public void setDentalTratamiento(String v) { this.dentalTratamiento = v; }
    public String getDentalDiagnostico() { return dentalDiagnostico; }
    public void setDentalDiagnostico(String v) { this.dentalDiagnostico = v; }
    public String getDentalRecomendaciones() { return dentalRecomendaciones; }
    public void setDentalRecomendaciones(String v) { this.dentalRecomendaciones = v; }
    public byte[] getDentalImagen() { return dentalImagen; }
    public void setDentalImagen(byte[] v) { this.dentalImagen = v; }

    // Portadas
    public byte[] getPortadaPrincipal() { return portadaPrincipal; }
    public void setPortadaPrincipal(byte[] v) { this.portadaPrincipal = v; }
    public byte[] getPortadaObjetivos() { return portadaObjetivos; }
    public void setPortadaObjetivos(byte[] v) { this.portadaObjetivos = v; }
    public byte[] getPortadaIntroduccion() { return portadaIntroduccion; }
    public void setPortadaIntroduccion(byte[] v) { this.portadaIntroduccion = v; }
    public byte[] getPortadaHallazgos() { return portadaHallazgos; }
    public void setPortadaHallazgos(byte[] v) { this.portadaHallazgos = v; }
    public byte[] getPortadaSistemas() { return portadaSistemas; }
    public void setPortadaSistemas(byte[] v) { this.portadaSistemas = v; }
    public byte[] getPortadaConclusiones() { return portadaConclusiones; }
    public void setPortadaConclusiones(byte[] v) { this.portadaConclusiones = v; }
    public byte[] getPortadaSugerencias() { return portadaSugerencias; }
    public void setPortadaSugerencias(byte[] v) { this.portadaSugerencias = v; }
    public byte[] getPortadaEsfuerzo() { return portadaEsfuerzo; }
    public void setPortadaEsfuerzo(byte[] v) { this.portadaEsfuerzo = v; }
    public byte[] getPortadaEspirometria() { return portadaEspirometria; }
    public void setPortadaEspirometria(byte[] v) { this.portadaEspirometria = v; }
    public byte[] getPortadaGabinete() { return portadaGabinete; }
    public void setPortadaGabinete(byte[] v) { this.portadaGabinete = v; }
    public byte[] getPortadaOftalmologia() { return portadaOftalmologia; }
    public void setPortadaOftalmologia(byte[] v) { this.portadaOftalmologia = v; }
    public byte[] getPortadaLaboratorio() { return portadaLaboratorio; }
    public void setPortadaLaboratorio(byte[] v) { this.portadaLaboratorio = v; }
    public byte[] getPortadaAudiometria() { return portadaAudiometria; }
    public void setPortadaAudiometria(byte[] v) { this.portadaAudiometria = v; }
    public byte[] getPortadaDental() { return portadaDental; }
    public void setPortadaDental(byte[] v) { this.portadaDental = v; }

    // Membretes
    public byte[] getMembrete5() { return membrete5; }
    public void setMembrete5(byte[] v) { this.membrete5 = v; }
    public byte[] getMembrete7() { return membrete7; }
    public void setMembrete7(byte[] v) { this.membrete7 = v; }
    public byte[] getMembrete9() { return membrete9; }
    public void setMembrete9(byte[] v) { this.membrete9 = v; }
    public byte[] getMembrete11() { return membrete11; }
    public void setMembrete11(byte[] v) { this.membrete11 = v; }
    public byte[] getMembrete13() { return membrete13; }
    public void setMembrete13(byte[] v) { this.membrete13 = v; }
    public byte[] getMembrete15() { return membrete15; }
    public void setMembrete15(byte[] v) { this.membrete15 = v; }
    public byte[] getMembrete17() { return membrete17; }
    public void setMembrete17(byte[] v) { this.membrete17 = v; }
    public byte[] getMembrete19() { return membrete19; }
    public void setMembrete19(byte[] v) { this.membrete19 = v; }
    public byte[] getMembrete21() { return membrete21; }
    public void setMembrete21(byte[] v) { this.membrete21 = v; }
    public byte[] getMembrete24() { return membrete24; }
    public void setMembrete24(byte[] v) { this.membrete24 = v; }
    public byte[] getMembrete26() { return membrete26; }
    public void setMembrete26(byte[] v) { this.membrete26 = v; }
}
