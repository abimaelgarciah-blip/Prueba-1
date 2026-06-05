package com.rio.chequeo.dao;

import com.rio.chequeo.model.MedicalRecord;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.sql.*;

/**
 * DAO para acceso a expedientes médicos en Oracle 11g.
 * Todas las operaciones BLOB se realizan mediante {@link Blob} de JDBC.
 * <p>
 * Los comentarios {@code TODO} indican la columna Oracle que debe mapearse
 * una vez definido el esquema de base de datos.
 * </p>
 */
public class MedicalRecordDAO {

    // =========================================================================
    // FIND BY PATIENT ID
    // =========================================================================

    /**
     * Carga el expediente médico completo de un paciente desde Oracle.
     *
     * @param conn      conexión JDBC activa
     * @param patientId ID del paciente
     * @return expediente médico o {@code null} si no existe
     * @throws SQLException en caso de error de base de datos
     */
    public MedicalRecord findByPatientId(Connection conn, Long patientId) throws SQLException {
        // TODO: ajustar nombre de tabla y columnas según esquema Oracle
        String sql =
            "SELECT " +
            // --- Datos del Paciente ---
            "  sexo, edad, " +                                                           // TODO: cols c5_sexo, c5_edad
            // --- AHF ---
            "  ahf, " +                                                                   // TODO: col ahf
            // --- Antecedentes No Patológicos ---
            "  np_origen, np_residencia, np_alcohol, np_fumar, np_deportes, " +
            "  np_vision, np_auditivo, np_transfusiones, np_hospitalizaciones, " +
            "  np_cirugias, np_medicamentos, np_enf_infecciosas, np_alergias, " +
            "  np_fracturas, np_grupo_sanguineo, np_inmunizaciones, " +
            // --- APP ---
            "  pp_prostata, pp_menarca, pp_gesta, pp_para, pp_aborto, " +
            "  pp_cesareas, pp_lactancia1, pp_lactancia2, pp_lactancia3, " +
            "  pp_fum_tiempo, pp_otros, " +
            // --- Examen Físico ---
            "  ef_ta, ef_fc, ef_sat, ef_peso, ef_talla, " +
            "  ef_general, ef_dermatologico, ef_craneo, ef_ojos, ef_oidos, " +
            "  ef_nariz, ef_boca, ef_cuello, ef_torax, ef_abdomen, " +
            "  ef_genitales, ef_rectal, ef_ext_superiores, ef_ext_inferiores, ef_neurologico, " +
            // --- Respiratorio ---
            "  resp_sintomatologia, resp_espirometria, resp_rayos_x, " +
            // --- Cardiovascular ---
            "  card_prueba_esfuerzo, card_ecg, " +
            // --- Gastrointestinal ---
            "  gi_sintomatologia, gi_ecografia, gi_pfh, gi_coprologico, gi_coprop, " +
            "  gi_dental, omitir_dental, " +
            // --- Genito-Urinario ---
            "  gu_sintomatologia, gu_eco_renal, gu_eco_prostatico, gu_eco_pelvico, " +
            "  gu_orina, gu_urea, gu_creatinina, gu_nitrogeno, gu_tfg, gu_psa, " +
            // --- Nervioso ---
            "  nerv_sintomatologia, nerv_oftalmologia, nerv_audiologia, " +
            // --- Endocrino ---
            "  endo_glucosa, endo_ac_urico, endo_col_total, endo_trigliceridos, " +
            "  endo_hdl, endo_ldl, endo_lh, endo_fsh, endo_prolactina, " +
            "  endo_progesterona, endo_estrogenos, endo_imc, endo_imc_clasificacion, " +
            // --- Musculoesquelético ---
            "  muscu_sintomatologia, muscu_rayos_x, muscu_densitometria, " +
            // --- Hematopoyético ---
            "  hema_biometria, hema_calcio, hema_fosforo, hema_sodio, hema_potasio, " +
            "  hema_cloruro, hema_hierro, hema_grupo_sanguineo, hema_vih, hema_vdrl, " +
            // --- Conclusiones ---
            "  conc_respiratorio, conc_cardiovascular, conc_gastrointestinal, " +
            "  conc_genitourinario, conc_nervioso, conc_musculoesqueletico, " +
            "  conc_hematopoyetico, conc_endocrino, conc_dental, omitir_dental_conc, " +
            // --- Sugerencias ---
            "  sugerencias, sug_doc_nombre, sug_doc_cedula, sug_doc_especialidad, " +
            "  sug_firma_img, " +
            // --- Prueba de Esfuerzo ---
            "  esf_fecha, esf_mets, esf_fcmax, esf_tamax, esf_ritmo, " +
            "  esf_resultado, esf_interpretacion, esf_imagen, " +
            // --- Espirometría ---
            "  espiro_fecha, espiro_fvc, espiro_fev1, espiro_fev1fvc, " +
            "  espiro_patron, espiro_resultado, espiro_interpretacion, espiro_imagen, " +
            // --- Gabinete ---
            "  gabinete_notas, gabinete_imagen, " +
            // --- Oftalmología ---
            "  oftal_fecha, oftal_av_od, oftal_av_oi, oftal_pio_od, oftal_pio_oi, " +
            "  oftal_fondo, oftal_seg_anterior, oftal_resultado, oftal_recomendaciones, oftal_imagen, " +
            // --- Laboratorio ---
            "  lab_fecha, lab_nombre, lab_observaciones, lab_imagen, " +
            // --- Firma del Doctor ---
            "  firma_nombre, firma_cedula, firma_especialidad, firma_clinica, firma_imagen, " +
            // --- Audiometría ---
            "  aud_fecha, aud_od500, aud_od1k, aud_od2k, aud_od4k, aud_od8k, aud_od_clasif, " +
            "  aud_oi500, aud_oi1k, aud_oi2k, aud_oi4k, aud_oi8k, aud_oi_clasif, " +
            "  aud_resultado, aud_recomendaciones, aud_imagen, " +
            // --- Dental ---
            "  dental_fecha, dental_periodontal, dental_higiene, dental_caries, " +
            "  dental_faltantes, dental_restauracion, dental_otros, dental_tratamiento, " +
            "  dental_diagnostico, dental_recomendaciones, dental_imagen, " +
            // --- Portadas ---
            "  cover_1, cover_2, cover_3, cover_4, cover_6, cover_8, cover_10, " +
            "  cover_12, cover_14, cover_16, cover_18, cover_20, cover_23, cover_25, " +
            // --- Membretes ---
            "  mb_5, mb_7, mb_9, mb_11, mb_13, mb_15, mb_17, mb_19, mb_21, mb_24, mb_26 " +
            "FROM expediente_medico " +                                                  // TODO: nombre real de tabla
            "WHERE patient_id = ?";                                                      // TODO: nombre real de columna FK

        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, patientId);
            try (ResultSet rs = ps.executeQuery()) {
                if (!rs.next()) {
                    return null;
                }
                MedicalRecord r = new MedicalRecord();

                // --- Datos del Paciente ---
                r.setSexo(rs.getString("sexo"));                                         // TODO: col c5_sexo
                r.setEdad(rs.getString("edad"));                                         // TODO: col c5_edad

                // --- AHF ---
                r.setAntecedentesHeredoFamiliares(rs.getString("ahf"));                 // TODO: col ahf

                // --- Antecedentes No Patológicos ---
                r.setNpOrigen(rs.getString("np_origen"));                                // TODO: col np_origen
                r.setNpResidencia(rs.getString("np_residencia"));                        // TODO: col np_residencia
                r.setNpAlcohol(rs.getString("np_alcohol"));                              // TODO: col np_alcohol
                r.setNpFumar(rs.getString("np_fumar"));                                  // TODO: col np_fumar
                r.setNpDeportes(rs.getString("np_deportes"));                            // TODO: col np_deportes
                r.setNpVision(rs.getString("np_vision"));                                // TODO: col np_vision
                r.setNpAuditivo(rs.getString("np_auditivo"));                            // TODO: col np_auditivo
                r.setNpTransfusiones(rs.getString("np_transfusiones"));                  // TODO: col np_transfusiones
                r.setNpHospitalizaciones(rs.getString("np_hospitalizaciones"));          // TODO: col np_hospitalizaciones
                r.setNpCirugias(rs.getString("np_cirugias"));                            // TODO: col np_cirugias
                r.setNpMedicamentos(rs.getString("np_medicamentos"));                    // TODO: col np_medicamentos
                r.setNpEnfInfecciosas(rs.getString("np_enf_infecciosas"));               // TODO: col np_enf_infecciosas
                r.setNpAlergias(rs.getString("np_alergias"));                            // TODO: col np_alergias
                r.setNpFracturas(rs.getString("np_fracturas"));                          // TODO: col np_fracturas
                r.setNpGrupoSanguineo(rs.getString("np_grupo_sanguineo"));               // TODO: col np_grupo_sanguineo
                r.setNpInmunizaciones(rs.getString("np_inmunizaciones"));                // TODO: col np_inmunizaciones

                // --- APP ---
                r.setPpProstata(rs.getString("pp_prostata"));                            // TODO: col pp_prostata
                r.setPpMenarca(rs.getString("pp_menarca"));                              // TODO: col pp_menarca
                r.setPpGesta(rs.getString("pp_gesta"));                                  // TODO: col pp_gesta
                r.setPpPara(rs.getString("pp_para"));                                    // TODO: col pp_para
                r.setPpAborto(rs.getString("pp_aborto"));                                // TODO: col pp_aborto
                r.setPpCesareas(rs.getString("pp_cesareas"));                            // TODO: col pp_cesareas
                r.setPpLactancia1(rs.getString("pp_lactancia1"));                        // TODO: col pp_lactancia1
                r.setPpLactancia2(rs.getString("pp_lactancia2"));                        // TODO: col pp_lactancia2
                r.setPpLactancia3(rs.getString("pp_lactancia3"));                        // TODO: col pp_lactancia3
                r.setPpFumTiempo(rs.getString("pp_fum_tiempo"));                         // TODO: col pp_fum_tiempo
                r.setPpOtros(rs.getString("pp_otros"));                                  // TODO: col pp_otros

                // --- Examen Físico ---
                r.setEfTa(rs.getString("ef_ta"));                                        // TODO: col ef_ta
                r.setEfFc(rs.getString("ef_fc"));                                        // TODO: col ef_fc
                r.setEfSat(rs.getString("ef_sat"));                                      // TODO: col ef_sat
                r.setEfPeso(rs.getString("ef_peso"));                                    // TODO: col ef_peso
                r.setEfTalla(rs.getString("ef_talla"));                                  // TODO: col ef_talla
                r.setEfGeneral(rs.getString("ef_general"));                              // TODO: col ef_general
                r.setEfDermatologico(rs.getString("ef_dermatologico"));                  // TODO: col ef_dermatologico
                r.setEfCraneo(rs.getString("ef_craneo"));                                // TODO: col ef_craneo
                r.setEfOjos(rs.getString("ef_ojos"));                                    // TODO: col ef_ojos
                r.setEfOidos(rs.getString("ef_oidos"));                                  // TODO: col ef_oidos
                r.setEfNariz(rs.getString("ef_nariz"));                                  // TODO: col ef_nariz
                r.setEfBoca(rs.getString("ef_boca"));                                    // TODO: col ef_boca
                r.setEfCuello(rs.getString("ef_cuello"));                                // TODO: col ef_cuello
                r.setEfTorax(rs.getString("ef_torax"));                                  // TODO: col ef_torax
                r.setEfAbdomen(rs.getString("ef_abdomen"));                              // TODO: col ef_abdomen
                r.setEfGenitales(rs.getString("ef_genitales"));                          // TODO: col ef_genitales
                r.setEfRectal(rs.getString("ef_rectal"));                                // TODO: col ef_rectal
                r.setEfExtSuperiores(rs.getString("ef_ext_superiores"));                 // TODO: col ef_ext_superiores
                r.setEfExtInferiores(rs.getString("ef_ext_inferiores"));                 // TODO: col ef_ext_inferiores
                r.setEfNeurologico(rs.getString("ef_neurologico"));                      // TODO: col ef_neurologico

                // --- Respiratorio ---
                r.setRespSintomatologia(rs.getString("resp_sintomatologia"));            // TODO: col resp_sintomatologia
                r.setRespEspirometria(rs.getString("resp_espirometria"));                // TODO: col resp_espirometria
                r.setRespRayosX(rs.getString("resp_rayos_x"));                           // TODO: col resp_rayos_x

                // --- Cardiovascular ---
                r.setCardPruebaEsfuerzo(rs.getString("card_prueba_esfuerzo"));           // TODO: col card_prueba_esfuerzo
                r.setCardEcg(rs.getString("card_ecg"));                                  // TODO: col card_ecg

                // --- Gastrointestinal ---
                r.setGiSintomatologia(rs.getString("gi_sintomatologia"));                // TODO: col gi_sintomatologia
                r.setGiEcografia(rs.getString("gi_ecografia"));                          // TODO: col gi_ecografia
                r.setGiPfh(rs.getString("gi_pfh"));                                      // TODO: col gi_pfh
                r.setGiCoprologico(rs.getString("gi_coprologico"));                      // TODO: col gi_coprologico
                r.setGiCoprop(rs.getString("gi_coprop"));                                // TODO: col gi_coprop
                r.setGiDental(rs.getString("gi_dental"));                                // TODO: col gi_dental
                r.setOmitirDental("1".equals(rs.getString("omitir_dental")));            // TODO: col omitir_dental

                // --- Genito-Urinario ---
                r.setGuSintomatologia(rs.getString("gu_sintomatologia"));                // TODO: col gu_sintomatologia
                r.setGuEcoRenal(rs.getString("gu_eco_renal"));                           // TODO: col gu_eco_renal
                r.setGuEcoProstatico(rs.getString("gu_eco_prostatico"));                 // TODO: col gu_eco_prostatico
                r.setGuEcoPelvico(rs.getString("gu_eco_pelvico"));                       // TODO: col gu_eco_pelvico
                r.setGuOrina(rs.getString("gu_orina"));                                  // TODO: col gu_orina
                r.setGuUrea(rs.getString("gu_urea"));                                    // TODO: col gu_urea
                r.setGuCreatinina(rs.getString("gu_creatinina"));                        // TODO: col gu_creatinina
                r.setGuNitrogeno(rs.getString("gu_nitrogeno"));                          // TODO: col gu_nitrogeno
                r.setGuTfg(rs.getString("gu_tfg"));                                      // TODO: col gu_tfg
                r.setGuPsa(rs.getString("gu_psa"));                                      // TODO: col gu_psa

                // --- Nervioso ---
                r.setNervSintomatologia(rs.getString("nerv_sintomatologia"));            // TODO: col nerv_sintomatologia
                r.setNervOftalmologia(rs.getString("nerv_oftalmologia"));                // TODO: col nerv_oftalmologia
                r.setNervAudiologia(rs.getString("nerv_audiologia"));                    // TODO: col nerv_audiologia

                // --- Endocrino ---
                r.setEndoGlucosa(rs.getString("endo_glucosa"));                          // TODO: col endo_glucosa
                r.setEndoAcUrico(rs.getString("endo_ac_urico"));                         // TODO: col endo_ac_urico
                r.setEndoColTotal(rs.getString("endo_col_total"));                       // TODO: col endo_col_total
                r.setEndoTrigliceridos(rs.getString("endo_trigliceridos"));              // TODO: col endo_trigliceridos
                r.setEndoHdl(rs.getString("endo_hdl"));                                  // TODO: col endo_hdl
                r.setEndoLdl(rs.getString("endo_ldl"));                                  // TODO: col endo_ldl
                r.setEndoLh(rs.getString("endo_lh"));                                    // TODO: col endo_lh
                r.setEndoFsh(rs.getString("endo_fsh"));                                  // TODO: col endo_fsh
                r.setEndoProlactina(rs.getString("endo_prolactina"));                    // TODO: col endo_prolactina
                r.setEndoProgesterona(rs.getString("endo_progesterona"));                // TODO: col endo_progesterona
                r.setEndoEstrogenos(rs.getString("endo_estrogenos"));                    // TODO: col endo_estrogenos
                r.setEndoImc(rs.getString("endo_imc"));                                  // TODO: col endo_imc
                r.setEndoImcClasificacion(rs.getString("endo_imc_clasificacion"));       // TODO: col endo_imc_clasificacion

                // --- Musculoesquelético ---
                r.setMuscuSintomatologia(rs.getString("muscu_sintomatologia"));          // TODO: col muscu_sintomatologia
                r.setMuscuRayosX(rs.getString("muscu_rayos_x"));                         // TODO: col muscu_rayos_x
                r.setMuscuDensitometria(rs.getString("muscu_densitometria"));            // TODO: col muscu_densitometria

                // --- Hematopoyético ---
                r.setHemaBiometria(rs.getString("hema_biometria"));                      // TODO: col hema_biometria
                r.setHemaCalcio(rs.getString("hema_calcio"));                            // TODO: col hema_calcio
                r.setHemaFosforo(rs.getString("hema_fosforo"));                          // TODO: col hema_fosforo
                r.setHemaSodio(rs.getString("hema_sodio"));                              // TODO: col hema_sodio
                r.setHemaPotasio(rs.getString("hema_potasio"));                          // TODO: col hema_potasio
                r.setHemaCloruro(rs.getString("hema_cloruro"));                          // TODO: col hema_cloruro
                r.setHemaHierro(rs.getString("hema_hierro"));                            // TODO: col hema_hierro
                r.setHemaGrupoSanguineo(rs.getString("hema_grupo_sanguineo"));           // TODO: col hema_grupo_sanguineo
                r.setHemaVih(rs.getString("hema_vih"));                                  // TODO: col hema_vih
                r.setHemaVdrl(rs.getString("hema_vdrl"));                                // TODO: col hema_vdrl

                // --- Conclusiones ---
                r.setConcRespiratorio(rs.getString("conc_respiratorio"));                // TODO: col conc_respiratorio
                r.setConcCardiovascular(rs.getString("conc_cardiovascular"));            // TODO: col conc_cardiovascular
                r.setConcGastrointestinal(rs.getString("conc_gastrointestinal"));        // TODO: col conc_gastrointestinal
                r.setConcGenitourinario(rs.getString("conc_genitourinario"));            // TODO: col conc_genitourinario
                r.setConcNervioso(rs.getString("conc_nervioso"));                        // TODO: col conc_nervioso
                r.setConcMusculoesqueletico(rs.getString("conc_musculoesqueletico"));    // TODO: col conc_musculoesqueletico
                r.setConcHematopoyetico(rs.getString("conc_hematopoyetico"));            // TODO: col conc_hematopoyetico
                r.setConcEndocrino(rs.getString("conc_endocrino"));                      // TODO: col conc_endocrino
                r.setConcDental(rs.getString("conc_dental"));                            // TODO: col conc_dental
                r.setOmitirDentalConc("1".equals(rs.getString("omitir_dental_conc")));  // TODO: col omitir_dental_conc

                // --- Sugerencias ---
                r.setSugerencias(rs.getString("sugerencias"));                           // TODO: col sugerencias
                r.setSugerenciasDocNombre(rs.getString("sug_doc_nombre"));               // TODO: col sug_doc_nombre
                r.setSugerenciasDocCedula(rs.getString("sug_doc_cedula"));               // TODO: col sug_doc_cedula
                r.setSugerenciasDocEspecialidad(rs.getString("sug_doc_especialidad"));   // TODO: col sug_doc_especialidad
                r.setSugerenciasFirmaImg(blobToBytes(rs.getBlob("sug_firma_img")));      // TODO: col sug_firma_img (BLOB)

                // --- Prueba de Esfuerzo ---
                r.setEsfuerzoFecha(rs.getString("esf_fecha"));                           // TODO: col esf_fecha
                r.setEsfuerzoMets(rs.getString("esf_mets"));                             // TODO: col esf_mets
                r.setEsfuerzoFcmax(rs.getString("esf_fcmax"));                           // TODO: col esf_fcmax
                r.setEsfuerzoTamax(rs.getString("esf_tamax"));                           // TODO: col esf_tamax
                r.setEsfuerzoRitmo(rs.getString("esf_ritmo"));                           // TODO: col esf_ritmo
                r.setEsfuerzoResultado(rs.getString("esf_resultado"));                   // TODO: col esf_resultado
                r.setEsfuerzoInterpretacion(rs.getString("esf_interpretacion"));         // TODO: col esf_interpretacion
                r.setEsfuerzoImagen(blobToBytes(rs.getBlob("esf_imagen")));              // TODO: col esf_imagen (BLOB)

                // --- Espirometría ---
                r.setEspiroFecha(rs.getString("espiro_fecha"));                          // TODO: col espiro_fecha
                r.setEspiroFvc(rs.getString("espiro_fvc"));                              // TODO: col espiro_fvc
                r.setEspiroFev1(rs.getString("espiro_fev1"));                            // TODO: col espiro_fev1
                r.setEspiroFev1Fvc(rs.getString("espiro_fev1fvc"));                      // TODO: col espiro_fev1fvc
                r.setEspiroPatron(rs.getString("espiro_patron"));                        // TODO: col espiro_patron
                r.setEspiroResultado(rs.getString("espiro_resultado"));                  // TODO: col espiro_resultado
                r.setEspiroInterpretacion(rs.getString("espiro_interpretacion"));        // TODO: col espiro_interpretacion
                r.setEspiroImagen(blobToBytes(rs.getBlob("espiro_imagen")));             // TODO: col espiro_imagen (BLOB)

                // --- Gabinete ---
                r.setGabineteNotas(rs.getString("gabinete_notas"));                      // TODO: col gabinete_notas
                r.setGabineteImagen(blobToBytes(rs.getBlob("gabinete_imagen")));         // TODO: col gabinete_imagen (BLOB)

                // --- Oftalmología ---
                r.setOftalFecha(rs.getString("oftal_fecha"));                            // TODO: col oftal_fecha
                r.setOftalAvOd(rs.getString("oftal_av_od"));                             // TODO: col oftal_av_od
                r.setOftalAvOi(rs.getString("oftal_av_oi"));                             // TODO: col oftal_av_oi
                r.setOftalPioOd(rs.getString("oftal_pio_od"));                           // TODO: col oftal_pio_od
                r.setOftalPioOi(rs.getString("oftal_pio_oi"));                           // TODO: col oftal_pio_oi
                r.setOftalFondo(rs.getString("oftal_fondo"));                            // TODO: col oftal_fondo
                r.setOftalSegAnterior(rs.getString("oftal_seg_anterior"));               // TODO: col oftal_seg_anterior
                r.setOftalResultado(rs.getString("oftal_resultado"));                    // TODO: col oftal_resultado
                r.setOftalRecomendaciones(rs.getString("oftal_recomendaciones"));        // TODO: col oftal_recomendaciones
                r.setOftalImagen(blobToBytes(rs.getBlob("oftal_imagen")));               // TODO: col oftal_imagen (BLOB)

                // --- Laboratorio ---
                r.setLabFecha(rs.getString("lab_fecha"));                                // TODO: col lab_fecha
                r.setLabNombre(rs.getString("lab_nombre"));                              // TODO: col lab_nombre
                r.setLabObservaciones(rs.getString("lab_observaciones"));                // TODO: col lab_observaciones
                r.setLabImagen(blobToBytes(rs.getBlob("lab_imagen")));                   // TODO: col lab_imagen (BLOB)

                // --- Firma del Doctor ---
                r.setFirmaNombre(rs.getString("firma_nombre"));                          // TODO: col firma_nombre
                r.setFirmaCedula(rs.getString("firma_cedula"));                          // TODO: col firma_cedula
                r.setFirmaEspecialidad(rs.getString("firma_especialidad"));              // TODO: col firma_especialidad
                r.setFirmaClinica(rs.getString("firma_clinica"));                        // TODO: col firma_clinica
                r.setFirmaImagen(blobToBytes(rs.getBlob("firma_imagen")));               // TODO: col firma_imagen (BLOB)

                // --- Audiometría ---
                r.setAudFecha(rs.getString("aud_fecha"));                                // TODO: col aud_fecha
                r.setAudOd500(rs.getString("aud_od500"));                                // TODO: col aud_od500
                r.setAudOd1k(rs.getString("aud_od1k"));                                  // TODO: col aud_od1k
                r.setAudOd2k(rs.getString("aud_od2k"));                                  // TODO: col aud_od2k
                r.setAudOd4k(rs.getString("aud_od4k"));                                  // TODO: col aud_od4k
                r.setAudOd8k(rs.getString("aud_od8k"));                                  // TODO: col aud_od8k
                r.setAudOdClasificacion(rs.getString("aud_od_clasif"));                  // TODO: col aud_od_clasif
                r.setAudOi500(rs.getString("aud_oi500"));                                // TODO: col aud_oi500
                r.setAudOi1k(rs.getString("aud_oi1k"));                                  // TODO: col aud_oi1k
                r.setAudOi2k(rs.getString("aud_oi2k"));                                  // TODO: col aud_oi2k
                r.setAudOi4k(rs.getString("aud_oi4k"));                                  // TODO: col aud_oi4k
                r.setAudOi8k(rs.getString("aud_oi8k"));                                  // TODO: col aud_oi8k
                r.setAudOiClasificacion(rs.getString("aud_oi_clasif"));                  // TODO: col aud_oi_clasif
                r.setAudResultado(rs.getString("aud_resultado"));                        // TODO: col aud_resultado
                r.setAudRecomendaciones(rs.getString("aud_recomendaciones"));            // TODO: col aud_recomendaciones
                r.setAudImagen(blobToBytes(rs.getBlob("aud_imagen")));                   // TODO: col aud_imagen (BLOB)

                // --- Dental ---
                r.setDentalFecha(rs.getString("dental_fecha"));                          // TODO: col dental_fecha
                r.setDentalPeriodontal(rs.getString("dental_periodontal"));              // TODO: col dental_periodontal
                r.setDentalHigiene(rs.getString("dental_higiene"));                      // TODO: col dental_higiene
                r.setDentalCaries(rs.getString("dental_caries"));                        // TODO: col dental_caries
                r.setDentalFaltantes(rs.getString("dental_faltantes"));                  // TODO: col dental_faltantes
                r.setDentalRestauracion(rs.getString("dental_restauracion"));            // TODO: col dental_restauracion
                r.setDentalOtros(rs.getString("dental_otros"));                          // TODO: col dental_otros
                r.setDentalTratamiento(rs.getString("dental_tratamiento"));              // TODO: col dental_tratamiento
                r.setDentalDiagnostico(rs.getString("dental_diagnostico"));              // TODO: col dental_diagnostico
                r.setDentalRecomendaciones(rs.getString("dental_recomendaciones"));      // TODO: col dental_recomendaciones
                r.setDentalImagen(blobToBytes(rs.getBlob("dental_imagen")));             // TODO: col dental_imagen (BLOB)

                // --- Portadas (BLOB) ---
                r.setPortadaPrincipal(blobToBytes(rs.getBlob("cover_1")));               // TODO: col cover_1
                r.setPortadaObjetivos(blobToBytes(rs.getBlob("cover_2")));               // TODO: col cover_2
                r.setPortadaIntroduccion(blobToBytes(rs.getBlob("cover_3")));            // TODO: col cover_3
                r.setPortadaHallazgos(blobToBytes(rs.getBlob("cover_4")));               // TODO: col cover_4
                r.setPortadaSistemas(blobToBytes(rs.getBlob("cover_6")));                // TODO: col cover_6
                r.setPortadaConclusiones(blobToBytes(rs.getBlob("cover_8")));            // TODO: col cover_8
                r.setPortadaSugerencias(blobToBytes(rs.getBlob("cover_10")));            // TODO: col cover_10
                r.setPortadaEsfuerzo(blobToBytes(rs.getBlob("cover_12")));               // TODO: col cover_12
                r.setPortadaEspirometria(blobToBytes(rs.getBlob("cover_14")));           // TODO: col cover_14
                r.setPortadaGabinete(blobToBytes(rs.getBlob("cover_16")));               // TODO: col cover_16
                r.setPortadaOftalmologia(blobToBytes(rs.getBlob("cover_18")));           // TODO: col cover_18
                r.setPortadaLaboratorio(blobToBytes(rs.getBlob("cover_20")));            // TODO: col cover_20
                r.setPortadaAudiometria(blobToBytes(rs.getBlob("cover_23")));            // TODO: col cover_23
                r.setPortadaDental(blobToBytes(rs.getBlob("cover_25")));                 // TODO: col cover_25

                // --- Membretes (BLOB) ---
                r.setMembrete5(blobToBytes(rs.getBlob("mb_5")));                         // TODO: col mb_5
                r.setMembrete7(blobToBytes(rs.getBlob("mb_7")));                         // TODO: col mb_7
                r.setMembrete9(blobToBytes(rs.getBlob("mb_9")));                         // TODO: col mb_9
                r.setMembrete11(blobToBytes(rs.getBlob("mb_11")));                       // TODO: col mb_11
                r.setMembrete13(blobToBytes(rs.getBlob("mb_13")));                       // TODO: col mb_13
                r.setMembrete15(blobToBytes(rs.getBlob("mb_15")));                       // TODO: col mb_15
                r.setMembrete17(blobToBytes(rs.getBlob("mb_17")));                       // TODO: col mb_17
                r.setMembrete19(blobToBytes(rs.getBlob("mb_19")));                       // TODO: col mb_19
                r.setMembrete21(blobToBytes(rs.getBlob("mb_21")));                       // TODO: col mb_21
                r.setMembrete24(blobToBytes(rs.getBlob("mb_24")));                       // TODO: col mb_24
                r.setMembrete26(blobToBytes(rs.getBlob("mb_26")));                       // TODO: col mb_26

                return r;
            }
        }
    }

    // =========================================================================
    // SAVE (MERGE INTO)
    // =========================================================================

    /**
     * Inserta o actualiza el expediente médico usando MERGE INTO de Oracle.
     *
     * @param conn      conexión JDBC activa
     * @param patientId ID del paciente
     * @param record    datos del expediente
     * @throws SQLException en caso de error de base de datos
     */
    public void save(Connection conn, Long patientId, MedicalRecord record) throws SQLException {
        // TODO: ajustar tabla y columnas según esquema Oracle real.
        // Los campos BLOB (portadas, membretes, imágenes) se guardan por separado
        // con saveImage() para evitar superar el tamaño de parámetro de MERGE.
        String sql =
            "MERGE INTO expediente_medico tgt " +                                        // TODO: nombre real de tabla
            "USING (SELECT ? AS patient_id FROM DUAL) src " +
            "ON (tgt.patient_id = src.patient_id) " +
            "WHEN MATCHED THEN UPDATE SET " +
            // --- Datos del Paciente ---
            "  tgt.sexo = ?, " +                                                         // TODO: col sexo          param 2
            "  tgt.edad = ?, " +                                                         // TODO: col edad          param 3
            // --- AHF ---
            "  tgt.ahf = ?, " +                                                          // TODO: col ahf           param 4
            // --- Antecedentes No Patológicos ---
            "  tgt.np_origen = ?, tgt.np_residencia = ?, tgt.np_alcohol = ?, " +        // params 5-7
            "  tgt.np_fumar = ?, tgt.np_deportes = ?, tgt.np_vision = ?, " +            // params 8-10
            "  tgt.np_auditivo = ?, tgt.np_transfusiones = ?, " +                       // params 11-12
            "  tgt.np_hospitalizaciones = ?, tgt.np_cirugias = ?, " +                   // params 13-14
            "  tgt.np_medicamentos = ?, tgt.np_enf_infecciosas = ?, " +                 // params 15-16
            "  tgt.np_alergias = ?, tgt.np_fracturas = ?, " +                           // params 17-18
            "  tgt.np_grupo_sanguineo = ?, tgt.np_inmunizaciones = ?, " +               // params 19-20
            // --- APP ---
            "  tgt.pp_prostata = ?, tgt.pp_menarca = ?, tgt.pp_gesta = ?, " +          // params 21-23
            "  tgt.pp_para = ?, tgt.pp_aborto = ?, tgt.pp_cesareas = ?, " +             // params 24-26
            "  tgt.pp_lactancia1 = ?, tgt.pp_lactancia2 = ?, tgt.pp_lactancia3 = ?, " + // params 27-29
            "  tgt.pp_fum_tiempo = ?, tgt.pp_otros = ?, " +                             // params 30-31
            // --- Examen Físico ---
            "  tgt.ef_ta = ?, tgt.ef_fc = ?, tgt.ef_sat = ?, " +                       // params 32-34
            "  tgt.ef_peso = ?, tgt.ef_talla = ?, tgt.ef_general = ?, " +              // params 35-37
            "  tgt.ef_dermatologico = ?, tgt.ef_craneo = ?, tgt.ef_ojos = ?, " +       // params 38-40
            "  tgt.ef_oidos = ?, tgt.ef_nariz = ?, tgt.ef_boca = ?, " +                // params 41-43
            "  tgt.ef_cuello = ?, tgt.ef_torax = ?, tgt.ef_abdomen = ?, " +            // params 44-46
            "  tgt.ef_genitales = ?, tgt.ef_rectal = ?, " +                             // params 47-48
            "  tgt.ef_ext_superiores = ?, tgt.ef_ext_inferiores = ?, " +               // params 49-50
            "  tgt.ef_neurologico = ?, " +                                               // param 51
            // --- Respiratorio ---
            "  tgt.resp_sintomatologia = ?, tgt.resp_espirometria = ?, tgt.resp_rayos_x = ?, " + // params 52-54
            // --- Cardiovascular ---
            "  tgt.card_prueba_esfuerzo = ?, tgt.card_ecg = ?, " +                     // params 55-56
            // --- Gastrointestinal ---
            "  tgt.gi_sintomatologia = ?, tgt.gi_ecografia = ?, tgt.gi_pfh = ?, " +   // params 57-59
            "  tgt.gi_coprologico = ?, tgt.gi_coprop = ?, tgt.gi_dental = ?, " +       // params 60-62
            "  tgt.omitir_dental = ?, " +                                                // param 63
            // --- Genito-Urinario ---
            "  tgt.gu_sintomatologia = ?, tgt.gu_eco_renal = ?, " +                    // params 64-65
            "  tgt.gu_eco_prostatico = ?, tgt.gu_eco_pelvico = ?, " +                  // params 66-67
            "  tgt.gu_orina = ?, tgt.gu_urea = ?, tgt.gu_creatinina = ?, " +          // params 68-70
            "  tgt.gu_nitrogeno = ?, tgt.gu_tfg = ?, tgt.gu_psa = ?, " +              // params 71-73
            // --- Nervioso ---
            "  tgt.nerv_sintomatologia = ?, tgt.nerv_oftalmologia = ?, tgt.nerv_audiologia = ?, " + // params 74-76
            // --- Endocrino ---
            "  tgt.endo_glucosa = ?, tgt.endo_ac_urico = ?, tgt.endo_col_total = ?, " + // params 77-79
            "  tgt.endo_trigliceridos = ?, tgt.endo_hdl = ?, tgt.endo_ldl = ?, " +    // params 80-82
            "  tgt.endo_lh = ?, tgt.endo_fsh = ?, tgt.endo_prolactina = ?, " +        // params 83-85
            "  tgt.endo_progesterona = ?, tgt.endo_estrogenos = ?, " +                 // params 86-87
            "  tgt.endo_imc = ?, tgt.endo_imc_clasificacion = ?, " +                   // params 88-89
            // --- Musculoesquelético ---
            "  tgt.muscu_sintomatologia = ?, tgt.muscu_rayos_x = ?, tgt.muscu_densitometria = ?, " + // params 90-92
            // --- Hematopoyético ---
            "  tgt.hema_biometria = ?, tgt.hema_calcio = ?, tgt.hema_fosforo = ?, " + // params 93-95
            "  tgt.hema_sodio = ?, tgt.hema_potasio = ?, tgt.hema_cloruro = ?, " +    // params 96-98
            "  tgt.hema_hierro = ?, tgt.hema_grupo_sanguineo = ?, " +                  // params 99-100
            "  tgt.hema_vih = ?, tgt.hema_vdrl = ?, " +                                // params 101-102
            // --- Conclusiones ---
            "  tgt.conc_respiratorio = ?, tgt.conc_cardiovascular = ?, " +             // params 103-104
            "  tgt.conc_gastrointestinal = ?, tgt.conc_genitourinario = ?, " +         // params 105-106
            "  tgt.conc_nervioso = ?, tgt.conc_musculoesqueletico = ?, " +             // params 107-108
            "  tgt.conc_hematopoyetico = ?, tgt.conc_endocrino = ?, " +               // params 109-110
            "  tgt.conc_dental = ?, tgt.omitir_dental_conc = ?, " +                    // params 111-112
            // --- Sugerencias ---
            "  tgt.sugerencias = ?, tgt.sug_doc_nombre = ?, " +                        // params 113-114
            "  tgt.sug_doc_cedula = ?, tgt.sug_doc_especialidad = ?, " +               // params 115-116
            // --- Prueba de Esfuerzo (texto) ---
            "  tgt.esf_fecha = ?, tgt.esf_mets = ?, tgt.esf_fcmax = ?, " +            // params 117-119
            "  tgt.esf_tamax = ?, tgt.esf_ritmo = ?, " +                               // params 120-121
            "  tgt.esf_resultado = ?, tgt.esf_interpretacion = ?, " +                  // params 122-123
            // --- Espirometría (texto) ---
            "  tgt.espiro_fecha = ?, tgt.espiro_fvc = ?, tgt.espiro_fev1 = ?, " +     // params 124-126
            "  tgt.espiro_fev1fvc = ?, tgt.espiro_patron = ?, " +                      // params 127-128
            "  tgt.espiro_resultado = ?, tgt.espiro_interpretacion = ?, " +            // params 129-130
            // --- Gabinete (texto) ---
            "  tgt.gabinete_notas = ?, " +                                               // param 131
            // --- Oftalmología ---
            "  tgt.oftal_fecha = ?, tgt.oftal_av_od = ?, tgt.oftal_av_oi = ?, " +    // params 132-134
            "  tgt.oftal_pio_od = ?, tgt.oftal_pio_oi = ?, tgt.oftal_fondo = ?, " +  // params 135-137
            "  tgt.oftal_seg_anterior = ?, tgt.oftal_resultado = ?, " +               // params 138-139
            "  tgt.oftal_recomendaciones = ?, " +                                       // param 140
            // --- Laboratorio ---
            "  tgt.lab_fecha = ?, tgt.lab_nombre = ?, tgt.lab_observaciones = ?, " +  // params 141-143
            // --- Firma del Doctor ---
            "  tgt.firma_nombre = ?, tgt.firma_cedula = ?, " +                         // params 144-145
            "  tgt.firma_especialidad = ?, tgt.firma_clinica = ?, " +                  // params 146-147
            // --- Audiometría ---
            "  tgt.aud_fecha = ?, tgt.aud_od500 = ?, tgt.aud_od1k = ?, " +           // params 148-150
            "  tgt.aud_od2k = ?, tgt.aud_od4k = ?, tgt.aud_od8k = ?, " +             // params 151-153
            "  tgt.aud_od_clasif = ?, tgt.aud_oi500 = ?, tgt.aud_oi1k = ?, " +       // params 154-156
            "  tgt.aud_oi2k = ?, tgt.aud_oi4k = ?, tgt.aud_oi8k = ?, " +             // params 157-159
            "  tgt.aud_oi_clasif = ?, tgt.aud_resultado = ?, tgt.aud_recomendaciones = ?, " + // params 160-162
            // --- Dental ---
            "  tgt.dental_fecha = ?, tgt.dental_periodontal = ?, tgt.dental_higiene = ?, " + // params 163-165
            "  tgt.dental_caries = ?, tgt.dental_faltantes = ?, tgt.dental_restauracion = ?, " + // params 166-168
            "  tgt.dental_otros = ?, tgt.dental_tratamiento = ?, " +                   // params 169-170
            "  tgt.dental_diagnostico = ?, tgt.dental_recomendaciones = ? " +          // params 171-172
            "WHEN NOT MATCHED THEN INSERT (" +
            "  patient_id, sexo, edad, ahf," +
            "  np_origen, np_residencia, np_alcohol, np_fumar, np_deportes," +
            "  np_vision, np_auditivo, np_transfusiones, np_hospitalizaciones," +
            "  np_cirugias, np_medicamentos, np_enf_infecciosas, np_alergias," +
            "  np_fracturas, np_grupo_sanguineo, np_inmunizaciones," +
            "  pp_prostata, pp_menarca, pp_gesta, pp_para, pp_aborto," +
            "  pp_cesareas, pp_lactancia1, pp_lactancia2, pp_lactancia3," +
            "  pp_fum_tiempo, pp_otros," +
            "  ef_ta, ef_fc, ef_sat, ef_peso, ef_talla, ef_general," +
            "  ef_dermatologico, ef_craneo, ef_ojos, ef_oidos, ef_nariz, ef_boca," +
            "  ef_cuello, ef_torax, ef_abdomen, ef_genitales, ef_rectal," +
            "  ef_ext_superiores, ef_ext_inferiores, ef_neurologico," +
            "  resp_sintomatologia, resp_espirometria, resp_rayos_x," +
            "  card_prueba_esfuerzo, card_ecg," +
            "  gi_sintomatologia, gi_ecografia, gi_pfh, gi_coprologico, gi_coprop, gi_dental, omitir_dental," +
            "  gu_sintomatologia, gu_eco_renal, gu_eco_prostatico, gu_eco_pelvico," +
            "  gu_orina, gu_urea, gu_creatinina, gu_nitrogeno, gu_tfg, gu_psa," +
            "  nerv_sintomatologia, nerv_oftalmologia, nerv_audiologia," +
            "  endo_glucosa, endo_ac_urico, endo_col_total, endo_trigliceridos," +
            "  endo_hdl, endo_ldl, endo_lh, endo_fsh, endo_prolactina," +
            "  endo_progesterona, endo_estrogenos, endo_imc, endo_imc_clasificacion," +
            "  muscu_sintomatologia, muscu_rayos_x, muscu_densitometria," +
            "  hema_biometria, hema_calcio, hema_fosforo, hema_sodio, hema_potasio," +
            "  hema_cloruro, hema_hierro, hema_grupo_sanguineo, hema_vih, hema_vdrl," +
            "  conc_respiratorio, conc_cardiovascular, conc_gastrointestinal, conc_genitourinario," +
            "  conc_nervioso, conc_musculoesqueletico, conc_hematopoyetico, conc_endocrino," +
            "  conc_dental, omitir_dental_conc," +
            "  sugerencias, sug_doc_nombre, sug_doc_cedula, sug_doc_especialidad," +
            "  esf_fecha, esf_mets, esf_fcmax, esf_tamax, esf_ritmo, esf_resultado, esf_interpretacion," +
            "  espiro_fecha, espiro_fvc, espiro_fev1, espiro_fev1fvc, espiro_patron, espiro_resultado, espiro_interpretacion," +
            "  gabinete_notas," +
            "  oftal_fecha, oftal_av_od, oftal_av_oi, oftal_pio_od, oftal_pio_oi," +
            "  oftal_fondo, oftal_seg_anterior, oftal_resultado, oftal_recomendaciones," +
            "  lab_fecha, lab_nombre, lab_observaciones," +
            "  firma_nombre, firma_cedula, firma_especialidad, firma_clinica," +
            "  aud_fecha, aud_od500, aud_od1k, aud_od2k, aud_od4k, aud_od8k, aud_od_clasif," +
            "  aud_oi500, aud_oi1k, aud_oi2k, aud_oi4k, aud_oi8k, aud_oi_clasif," +
            "  aud_resultado, aud_recomendaciones," +
            "  dental_fecha, dental_periodontal, dental_higiene, dental_caries," +
            "  dental_faltantes, dental_restauracion, dental_otros, dental_tratamiento," +
            "  dental_diagnostico, dental_recomendaciones" +
            ") VALUES (" +
            "  ?,?,?,?," +
            "  ?,?,?,?,?," +
            "  ?,?,?,?," +
            "  ?,?,?,?," +
            "  ?,?,?," +
            "  ?,?,?,?,?," +
            "  ?,?,?,?," +
            "  ?,?," +
            "  ?,?,?,?,?,?," +
            "  ?,?,?,?,?,?," +
            "  ?,?,?,?,?," +
            "  ?,?,?," +
            "  ?,?,?," +
            "  ?,?," +
            "  ?,?,?,?,?,?,?," +
            "  ?,?,?,?," +
            "  ?,?,?,?,?,?," +
            "  ?,?,?," +
            "  ?,?,?,?," +
            "  ?,?,?,?,?," +
            "  ?,?,?,?," +
            "  ?,?,?,?,?," +
            "  ?,?,?,?,?," +
            "  ?,?,?,?," +
            "  ?,?," +
            "  ?,?,?,?," +
            "  ?,?,?,?,?,?,?," +
            "  ?,?,?,?,?,?,?," +
            "  ?," +
            "  ?,?,?,?,?," +
            "  ?,?,?,?," +
            "  ?,?,?," +
            "  ?,?,?,?," +
            "  ?,?,?,?,?,?,?," +
            "  ?,?,?,?,?,?," +
            "  ?,?," +
            "  ?,?,?,?," +
            "  ?,?,?,?," +
            "  ?,?" +
            ")";

        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            // WHEN MATCHED – param 1 is the key used in ON clause
            ps.setLong(1, patientId);                                                    // patient_id

            // Bind helper: all text params follow the same order for both UPDATE and INSERT.
            // UPDATE params start at index 2; INSERT params repeat from 173 onward.
            // For simplicity we use a single binder method and call it twice.
            bindTextParams(ps, 2, patientId, record);
            bindTextParams(ps, 173, patientId, record);

            ps.executeUpdate();
        }
    }

    /**
     * Binds all non-BLOB parameters starting at the given offset.
     * The binding order must match the column order in the MERGE statement.
     */
    private void bindTextParams(PreparedStatement ps, int offset,
                                Long patientId, MedicalRecord r) throws SQLException {
        int i = offset;
        // patient_id (only needed for INSERT section)
        if (offset > 2) {
            ps.setLong(i++, patientId);
        }
        ps.setString(i++, r.getSexo());                                                  // TODO: col sexo
        ps.setString(i++, r.getEdad());                                                  // TODO: col edad
        ps.setString(i++, r.getAntecedentesHeredoFamiliares());                         // TODO: col ahf
        ps.setString(i++, r.getNpOrigen());                                              // TODO: col np_origen
        ps.setString(i++, r.getNpResidencia());                                          // TODO: col np_residencia
        ps.setString(i++, r.getNpAlcohol());                                             // TODO: col np_alcohol
        ps.setString(i++, r.getNpFumar());                                               // TODO: col np_fumar
        ps.setString(i++, r.getNpDeportes());                                            // TODO: col np_deportes
        ps.setString(i++, r.getNpVision());                                              // TODO: col np_vision
        ps.setString(i++, r.getNpAuditivo());                                            // TODO: col np_auditivo
        ps.setString(i++, r.getNpTransfusiones());                                       // TODO: col np_transfusiones
        ps.setString(i++, r.getNpHospitalizaciones());                                   // TODO: col np_hospitalizaciones
        ps.setString(i++, r.getNpCirugias());                                            // TODO: col np_cirugias
        ps.setString(i++, r.getNpMedicamentos());                                        // TODO: col np_medicamentos
        ps.setString(i++, r.getNpEnfInfecciosas());                                      // TODO: col np_enf_infecciosas
        ps.setString(i++, r.getNpAlergias());                                            // TODO: col np_alergias
        ps.setString(i++, r.getNpFracturas());                                           // TODO: col np_fracturas
        ps.setString(i++, r.getNpGrupoSanguineo());                                      // TODO: col np_grupo_sanguineo
        ps.setString(i++, r.getNpInmunizaciones());                                      // TODO: col np_inmunizaciones
        ps.setString(i++, r.getPpProstata());                                            // TODO: col pp_prostata
        ps.setString(i++, r.getPpMenarca());                                             // TODO: col pp_menarca
        ps.setString(i++, r.getPpGesta());                                               // TODO: col pp_gesta
        ps.setString(i++, r.getPpPara());                                                // TODO: col pp_para
        ps.setString(i++, r.getPpAborto());                                              // TODO: col pp_aborto
        ps.setString(i++, r.getPpCesareas());                                            // TODO: col pp_cesareas
        ps.setString(i++, r.getPpLactancia1());                                          // TODO: col pp_lactancia1
        ps.setString(i++, r.getPpLactancia2());                                          // TODO: col pp_lactancia2
        ps.setString(i++, r.getPpLactancia3());                                          // TODO: col pp_lactancia3
        ps.setString(i++, r.getPpFumTiempo());                                           // TODO: col pp_fum_tiempo
        ps.setString(i++, r.getPpOtros());                                               // TODO: col pp_otros
        ps.setString(i++, r.getEfTa());                                                  // TODO: col ef_ta
        ps.setString(i++, r.getEfFc());                                                  // TODO: col ef_fc
        ps.setString(i++, r.getEfSat());                                                 // TODO: col ef_sat
        ps.setString(i++, r.getEfPeso());                                                // TODO: col ef_peso
        ps.setString(i++, r.getEfTalla());                                               // TODO: col ef_talla
        ps.setString(i++, r.getEfGeneral());                                             // TODO: col ef_general
        ps.setString(i++, r.getEfDermatologico());                                       // TODO: col ef_dermatologico
        ps.setString(i++, r.getEfCraneo());                                              // TODO: col ef_craneo
        ps.setString(i++, r.getEfOjos());                                                // TODO: col ef_ojos
        ps.setString(i++, r.getEfOidos());                                               // TODO: col ef_oidos
        ps.setString(i++, r.getEfNariz());                                               // TODO: col ef_nariz
        ps.setString(i++, r.getEfBoca());                                                // TODO: col ef_boca
        ps.setString(i++, r.getEfCuello());                                              // TODO: col ef_cuello
        ps.setString(i++, r.getEfTorax());                                               // TODO: col ef_torax
        ps.setString(i++, r.getEfAbdomen());                                             // TODO: col ef_abdomen
        ps.setString(i++, r.getEfGenitales());                                           // TODO: col ef_genitales
        ps.setString(i++, r.getEfRectal());                                              // TODO: col ef_rectal
        ps.setString(i++, r.getEfExtSuperiores());                                       // TODO: col ef_ext_superiores
        ps.setString(i++, r.getEfExtInferiores());                                       // TODO: col ef_ext_inferiores
        ps.setString(i++, r.getEfNeurologico());                                         // TODO: col ef_neurologico
        ps.setString(i++, r.getRespSintomatologia());                                    // TODO: col resp_sintomatologia
        ps.setString(i++, r.getRespEspirometria());                                      // TODO: col resp_espirometria
        ps.setString(i++, r.getRespRayosX());                                            // TODO: col resp_rayos_x
        ps.setString(i++, r.getCardPruebaEsfuerzo());                                    // TODO: col card_prueba_esfuerzo
        ps.setString(i++, r.getCardEcg());                                               // TODO: col card_ecg
        ps.setString(i++, r.getGiSintomatologia());                                      // TODO: col gi_sintomatologia
        ps.setString(i++, r.getGiEcografia());                                           // TODO: col gi_ecografia
        ps.setString(i++, r.getGiPfh());                                                 // TODO: col gi_pfh
        ps.setString(i++, r.getGiCoprologico());                                         // TODO: col gi_coprologico
        ps.setString(i++, r.getGiCoprop());                                              // TODO: col gi_coprop
        ps.setString(i++, r.getGiDental());                                              // TODO: col gi_dental
        ps.setString(i++, r.isOmitirDental() ? "1" : "0");                              // TODO: col omitir_dental
        ps.setString(i++, r.getGuSintomatologia());                                      // TODO: col gu_sintomatologia
        ps.setString(i++, r.getGuEcoRenal());                                            // TODO: col gu_eco_renal
        ps.setString(i++, r.getGuEcoProstatico());                                       // TODO: col gu_eco_prostatico
        ps.setString(i++, r.getGuEcoPelvico());                                          // TODO: col gu_eco_pelvico
        ps.setString(i++, r.getGuOrina());                                               // TODO: col gu_orina
        ps.setString(i++, r.getGuUrea());                                                // TODO: col gu_urea
        ps.setString(i++, r.getGuCreatinina());                                          // TODO: col gu_creatinina
        ps.setString(i++, r.getGuNitrogeno());                                           // TODO: col gu_nitrogeno
        ps.setString(i++, r.getGuTfg());                                                 // TODO: col gu_tfg
        ps.setString(i++, r.getGuPsa());                                                 // TODO: col gu_psa
        ps.setString(i++, r.getNervSintomatologia());                                    // TODO: col nerv_sintomatologia
        ps.setString(i++, r.getNervOftalmologia());                                      // TODO: col nerv_oftalmologia
        ps.setString(i++, r.getNervAudiologia());                                        // TODO: col nerv_audiologia
        ps.setString(i++, r.getEndoGlucosa());                                           // TODO: col endo_glucosa
        ps.setString(i++, r.getEndoAcUrico());                                           // TODO: col endo_ac_urico
        ps.setString(i++, r.getEndoColTotal());                                          // TODO: col endo_col_total
        ps.setString(i++, r.getEndoTrigliceridos());                                     // TODO: col endo_trigliceridos
        ps.setString(i++, r.getEndoHdl());                                               // TODO: col endo_hdl
        ps.setString(i++, r.getEndoLdl());                                               // TODO: col endo_ldl
        ps.setString(i++, r.getEndoLh());                                                // TODO: col endo_lh
        ps.setString(i++, r.getEndoFsh());                                               // TODO: col endo_fsh
        ps.setString(i++, r.getEndoProlactina());                                        // TODO: col endo_prolactina
        ps.setString(i++, r.getEndoProgesterona());                                      // TODO: col endo_progesterona
        ps.setString(i++, r.getEndoEstrogenos());                                        // TODO: col endo_estrogenos
        ps.setString(i++, r.getEndoImc());                                               // TODO: col endo_imc
        ps.setString(i++, r.getEndoImcClasificacion());                                  // TODO: col endo_imc_clasificacion
        ps.setString(i++, r.getMuscuSintomatologia());                                   // TODO: col muscu_sintomatologia
        ps.setString(i++, r.getMuscuRayosX());                                           // TODO: col muscu_rayos_x
        ps.setString(i++, r.getMuscuDensitometria());                                    // TODO: col muscu_densitometria
        ps.setString(i++, r.getHemaBiometria());                                         // TODO: col hema_biometria
        ps.setString(i++, r.getHemaCalcio());                                            // TODO: col hema_calcio
        ps.setString(i++, r.getHemaFosforo());                                           // TODO: col hema_fosforo
        ps.setString(i++, r.getHemaSodio());                                             // TODO: col hema_sodio
        ps.setString(i++, r.getHemaPotasio());                                           // TODO: col hema_potasio
        ps.setString(i++, r.getHemaCloruro());                                           // TODO: col hema_cloruro
        ps.setString(i++, r.getHemaHierro());                                            // TODO: col hema_hierro
        ps.setString(i++, r.getHemaGrupoSanguineo());                                    // TODO: col hema_grupo_sanguineo
        ps.setString(i++, r.getHemaVih());                                               // TODO: col hema_vih
        ps.setString(i++, r.getHemaVdrl());                                              // TODO: col hema_vdrl
        ps.setString(i++, r.getConcRespiratorio());                                      // TODO: col conc_respiratorio
        ps.setString(i++, r.getConcCardiovascular());                                    // TODO: col conc_cardiovascular
        ps.setString(i++, r.getConcGastrointestinal());                                  // TODO: col conc_gastrointestinal
        ps.setString(i++, r.getConcGenitourinario());                                    // TODO: col conc_genitourinario
        ps.setString(i++, r.getConcNervioso());                                          // TODO: col conc_nervioso
        ps.setString(i++, r.getConcMusculoesqueletico());                                // TODO: col conc_musculoesqueletico
        ps.setString(i++, r.getConcHematopoyetico());                                    // TODO: col conc_hematopoyetico
        ps.setString(i++, r.getConcEndocrino());                                         // TODO: col conc_endocrino
        ps.setString(i++, r.getConcDental());                                            // TODO: col conc_dental
        ps.setString(i++, r.isOmitirDentalConc() ? "1" : "0");                          // TODO: col omitir_dental_conc
        ps.setString(i++, r.getSugerencias());                                           // TODO: col sugerencias
        ps.setString(i++, r.getSugerenciasDocNombre());                                  // TODO: col sug_doc_nombre
        ps.setString(i++, r.getSugerenciasDocCedula());                                  // TODO: col sug_doc_cedula
        ps.setString(i++, r.getSugerenciasDocEspecialidad());                            // TODO: col sug_doc_especialidad
        ps.setString(i++, r.getEsfuerzoFecha());                                         // TODO: col esf_fecha
        ps.setString(i++, r.getEsfuerzoMets());                                          // TODO: col esf_mets
        ps.setString(i++, r.getEsfuerzoFcmax());                                         // TODO: col esf_fcmax
        ps.setString(i++, r.getEsfuerzoTamax());                                         // TODO: col esf_tamax
        ps.setString(i++, r.getEsfuerzoRitmo());                                         // TODO: col esf_ritmo
        ps.setString(i++, r.getEsfuerzoResultado());                                     // TODO: col esf_resultado
        ps.setString(i++, r.getEsfuerzoInterpretacion());                                // TODO: col esf_interpretacion
        ps.setString(i++, r.getEspiroFecha());                                           // TODO: col espiro_fecha
        ps.setString(i++, r.getEspiroFvc());                                             // TODO: col espiro_fvc
        ps.setString(i++, r.getEspiroFev1());                                            // TODO: col espiro_fev1
        ps.setString(i++, r.getEspiroFev1Fvc());                                         // TODO: col espiro_fev1fvc
        ps.setString(i++, r.getEspiroPatron());                                          // TODO: col espiro_patron
        ps.setString(i++, r.getEspiroResultado());                                       // TODO: col espiro_resultado
        ps.setString(i++, r.getEspiroInterpretacion());                                  // TODO: col espiro_interpretacion
        ps.setString(i++, r.getGabineteNotas());                                         // TODO: col gabinete_notas
        ps.setString(i++, r.getOftalFecha());                                            // TODO: col oftal_fecha
        ps.setString(i++, r.getOftalAvOd());                                             // TODO: col oftal_av_od
        ps.setString(i++, r.getOftalAvOi());                                             // TODO: col oftal_av_oi
        ps.setString(i++, r.getOftalPioOd());                                            // TODO: col oftal_pio_od
        ps.setString(i++, r.getOftalPioOi());                                            // TODO: col oftal_pio_oi
        ps.setString(i++, r.getOftalFondo());                                            // TODO: col oftal_fondo
        ps.setString(i++, r.getOftalSegAnterior());                                      // TODO: col oftal_seg_anterior
        ps.setString(i++, r.getOftalResultado());                                        // TODO: col oftal_resultado
        ps.setString(i++, r.getOftalRecomendaciones());                                  // TODO: col oftal_recomendaciones
        ps.setString(i++, r.getLabFecha());                                              // TODO: col lab_fecha
        ps.setString(i++, r.getLabNombre());                                             // TODO: col lab_nombre
        ps.setString(i++, r.getLabObservaciones());                                      // TODO: col lab_observaciones
        ps.setString(i++, r.getFirmaNombre());                                           // TODO: col firma_nombre
        ps.setString(i++, r.getFirmaCedula());                                           // TODO: col firma_cedula
        ps.setString(i++, r.getFirmaEspecialidad());                                     // TODO: col firma_especialidad
        ps.setString(i++, r.getFirmaClinica());                                          // TODO: col firma_clinica
        ps.setString(i++, r.getAudFecha());                                              // TODO: col aud_fecha
        ps.setString(i++, r.getAudOd500());                                              // TODO: col aud_od500
        ps.setString(i++, r.getAudOd1k());                                               // TODO: col aud_od1k
        ps.setString(i++, r.getAudOd2k());                                               // TODO: col aud_od2k
        ps.setString(i++, r.getAudOd4k());                                               // TODO: col aud_od4k
        ps.setString(i++, r.getAudOd8k());                                               // TODO: col aud_od8k
        ps.setString(i++, r.getAudOdClasificacion());                                    // TODO: col aud_od_clasif
        ps.setString(i++, r.getAudOi500());                                              // TODO: col aud_oi500
        ps.setString(i++, r.getAudOi1k());                                               // TODO: col aud_oi1k
        ps.setString(i++, r.getAudOi2k());                                               // TODO: col aud_oi2k
        ps.setString(i++, r.getAudOi4k());                                               // TODO: col aud_oi4k
        ps.setString(i++, r.getAudOi8k());                                               // TODO: col aud_oi8k
        ps.setString(i++, r.getAudOiClasificacion());                                    // TODO: col aud_oi_clasif
        ps.setString(i++, r.getAudResultado());                                          // TODO: col aud_resultado
        ps.setString(i++, r.getAudRecomendaciones());                                    // TODO: col aud_recomendaciones
        ps.setString(i++, r.getDentalFecha());                                           // TODO: col dental_fecha
        ps.setString(i++, r.getDentalPeriodontal());                                     // TODO: col dental_periodontal
        ps.setString(i++, r.getDentalHigiene());                                         // TODO: col dental_higiene
        ps.setString(i++, r.getDentalCaries());                                          // TODO: col dental_caries
        ps.setString(i++, r.getDentalFaltantes());                                       // TODO: col dental_faltantes
        ps.setString(i++, r.getDentalRestauracion());                                    // TODO: col dental_restauracion
        ps.setString(i++, r.getDentalOtros());                                           // TODO: col dental_otros
        ps.setString(i++, r.getDentalTratamiento());                                     // TODO: col dental_tratamiento
        ps.setString(i++, r.getDentalDiagnostico());                                     // TODO: col dental_diagnostico
        ps.setString(i,   r.getDentalRecomendaciones());                                 // TODO: col dental_recomendaciones
    }

    // =========================================================================
    // SAVE IMAGE (BLOB)
    // =========================================================================

    /**
     * Guarda o actualiza un BLOB (imagen de portada, membrete, firma o estudio)
     * en la tabla de imágenes de Oracle.
     *
     * @param conn      conexión JDBC activa
     * @param patientId ID del paciente propietario
     * @param fieldKey  clave del campo (p.ej. "cover-1", "mb-5", "c11-firma-img")
     * @param imageData bytes de la imagen; {@code null} borra el registro
     * @throws SQLException en caso de error de base de datos
     */
    public void saveImage(Connection conn, Long patientId,
                          String fieldKey, byte[] imageData) throws SQLException {
        // TODO: ajustar nombre de tabla según esquema Oracle real.
        // Tabla sugerida: EXPEDIENTE_IMAGEN (patient_id, field_key, image_data)
        String sql =
            "MERGE INTO expediente_imagen tgt " +                                        // TODO: nombre real de tabla
            "USING (SELECT ? AS patient_id, ? AS field_key FROM DUAL) src " +
            "ON (tgt.patient_id = src.patient_id AND tgt.field_key = src.field_key) " +
            "WHEN MATCHED THEN UPDATE SET tgt.image_data = ? " +                         // TODO: col image_data
            "WHEN NOT MATCHED THEN INSERT (patient_id, field_key, image_data) " +
            "VALUES (?, ?, ?)";

        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, patientId);
            ps.setString(2, fieldKey);
            setBlobParam(conn, ps, 3, imageData);
            ps.setLong(4, patientId);
            ps.setString(5, fieldKey);
            setBlobParam(conn, ps, 6, imageData);
            ps.executeUpdate();
        }
    }

    // =========================================================================
    // LOAD IMAGE (BLOB)
    // =========================================================================

    /**
     * Carga un BLOB (imagen de portada, membrete, firma o estudio) de Oracle.
     *
     * @param conn      conexión JDBC activa
     * @param patientId ID del paciente propietario
     * @param fieldKey  clave del campo (p.ej. "cover-1", "mb-5", "c13-img")
     * @return bytes de la imagen o {@code null} si no existe
     * @throws SQLException en caso de error de base de datos
     */
    public byte[] loadImage(Connection conn, Long patientId,
                            String fieldKey) throws SQLException {
        // TODO: ajustar nombre de tabla según esquema Oracle real.
        String sql =
            "SELECT image_data FROM expediente_imagen " +                                // TODO: nombre real de tabla / col
            "WHERE patient_id = ? AND field_key = ?";

        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, patientId);
            ps.setString(2, fieldKey);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return blobToBytes(rs.getBlob("image_data"));                        // TODO: col image_data
                }
            }
        }
        return null;
    }

    // =========================================================================
    // Helpers
    // =========================================================================

    /**
     * Convierte un {@link Blob} de JDBC en un arreglo de bytes.
     * Retorna {@code null} si el blob es nulo.
     */
    private byte[] blobToBytes(Blob blob) throws SQLException {
        if (blob == null) {
            return null;
        }
        try (InputStream is = blob.getBinaryStream()) {
            return is.readAllBytes();
        } catch (Exception e) {
            throw new SQLException("Error leyendo BLOB", e);
        }
    }

    /**
     * Establece un parámetro BLOB en el {@link PreparedStatement}.
     * Si los datos son nulos establece NULL en el parámetro.
     */
    private void setBlobParam(Connection conn, PreparedStatement ps,
                              int index, byte[] data) throws SQLException {
        if (data == null) {
            ps.setNull(index, Types.BLOB);
        } else {
            ps.setBinaryStream(index, new ByteArrayInputStream(data), data.length);
        }
    }
}
