package com.rio.chequeo.servlet;

import com.rio.chequeo.dao.MedicalRecordDAO;
import com.rio.chequeo.dao.PatientDAO;
import com.rio.chequeo.model.MedicalRecord;
import com.rio.chequeo.model.Patient;
import com.rio.chequeo.util.AppConstants;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Servlet de gestión de pacientes para RIO - Chequeo Médico.
 *
 * <p>Rutas manejadas:</p>
 * <ul>
 *   <li>GET  /patients          — Lista todos los pacientes.</li>
 *   <li>GET  /patients?id=nuevo — Crea un expediente vacío y abre el índice de hojas.</li>
 *   <li>GET  /patients?id=N     — Carga el paciente N con su expediente y abre el índice de hojas.</li>
 *   <li>POST /patients          — Guarda campos del formulario en sesión y persiste en Oracle.</li>
 * </ul>
 */
@WebServlet("/patients")
public class PatientServlet extends HttpServlet {

    private static final long serialVersionUID = 1L;
    private static final Logger LOGGER = Logger.getLogger(PatientServlet.class.getName());

    private static final String VIEW_LIST  = "/WEB-INF/views/patients/list.jsp";
    private static final String VIEW_INDEX = "/WEB-INF/views/sheets/index.jsp";

    private final PatientDAO       patientDAO       = new PatientDAO();
    private final MedicalRecordDAO medicalRecordDAO = new MedicalRecordDAO();

    // -------------------------------------------------------------------------
    // doGet
    // -------------------------------------------------------------------------

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        // Verificar sesión activa
        if (!isAuthenticated(req)) {
            resp.sendRedirect(req.getContextPath() + "/auth");
            return;
        }

        String idParam = req.getParameter("id");

        if (idParam == null || idParam.isEmpty()) {
            // Sin parámetro id → listar todos los pacientes
            showPatientList(req, resp);
        } else if ("nuevo".equalsIgnoreCase(idParam.trim())) {
            // id=nuevo → nuevo expediente vacío
            openNewRecord(req, resp);
        } else {
            // id=N → cargar paciente existente
            openExistingRecord(req, resp, idParam.trim());
        }
    }

    // -------------------------------------------------------------------------
    // doPost
    // -------------------------------------------------------------------------

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        req.setCharacterEncoding("UTF-8");

        // Verificar sesión activa
        if (!isAuthenticated(req)) {
            resp.sendRedirect(req.getContextPath() + "/auth");
            return;
        }

        HttpSession session  = req.getSession(false);
        boolean isAjax = isAjaxRequest(req);

        // Obtener el MedicalRecord de la sesión
        MedicalRecord record = (MedicalRecord) session.getAttribute(AppConstants.SESSION_PATIENT_KEY);
        if (record == null) {
            record = new MedicalRecord();
            session.setAttribute(AppConstants.SESSION_PATIENT_KEY, record);
        }

        // Mapear parámetros del request al expediente
        applyRequestParamsToRecord(req, record);

        // Obtener el patient desde sesión o parámetro
        String patientIdParam = req.getParameter("patientId");
        Long patientId = null;
        if (patientIdParam != null && !patientIdParam.isEmpty()) {
            try {
                patientId = Long.parseLong(patientIdParam.trim());
                record.setPatientId(patientId);
            } catch (NumberFormatException e) {
                LOGGER.warning("patientId inválido: " + patientIdParam);
            }
        }

        // Actualizar appState en sesión si viene como parámetro
        String appState = req.getParameter("appState");
        if (appState != null) {
            session.setAttribute("appState", appState);
        }

        // Persistir en Oracle
        try {
            medicalRecordDAO.save(record);
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error persistiendo expediente en Oracle", e);
            if (isAjax) {
                sendJsonError(resp, "Error guardando expediente: " + e.getMessage());
                return;
            }
            req.setAttribute("errorMsg", "Error guardando expediente: " + e.getMessage());
        }

        if (isAjax) {
            sendJsonOk(resp);
        } else {
            // Redirigir a la hoja del paciente
            String redirectId = (patientId != null) ? patientId.toString() : "nuevo";
            resp.sendRedirect(req.getContextPath() + "/patients?id=" + redirectId);
        }
    }

    // -------------------------------------------------------------------------
    // Métodos auxiliares — navegación
    // -------------------------------------------------------------------------

    private void showPatientList(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
        try {
            List<Patient> patients = patientDAO.findAll();
            req.setAttribute("patients", patients);
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error cargando lista de pacientes", e);
            req.setAttribute("patients", java.util.Collections.emptyList());
            req.setAttribute("errorMsg", "Error cargando pacientes: " + e.getMessage());
        }
        req.getRequestDispatcher(VIEW_LIST).forward(req, resp);
    }

    private void openNewRecord(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
        HttpSession session = req.getSession(true);
        MedicalRecord newRecord = new MedicalRecord();
        session.setAttribute(AppConstants.SESSION_PATIENT_KEY, newRecord);
        session.removeAttribute("currentPatientObj");
        req.setAttribute("sheetNumber", 1);
        req.getRequestDispatcher(VIEW_INDEX).forward(req, resp);
    }

    private void openExistingRecord(HttpServletRequest req, HttpServletResponse resp, String idParam)
            throws ServletException, IOException {
        long patientId;
        try {
            patientId = Long.parseLong(idParam);
        } catch (NumberFormatException e) {
            resp.sendError(HttpServletResponse.SC_BAD_REQUEST, "ID de paciente inválido: " + idParam);
            return;
        }

        try {
            Patient patient = patientDAO.findById(patientId);
            if (patient == null) {
                resp.sendError(HttpServletResponse.SC_NOT_FOUND, "Paciente no encontrado: " + patientId);
                return;
            }

            MedicalRecord record = medicalRecordDAO.findByPatientId(patientId);
            if (record == null) {
                record = new MedicalRecord();
                record.setPatientId(patientId);
            }
            patient.setExpediente(record);

            HttpSession session = req.getSession(true);
            session.setAttribute(AppConstants.SESSION_PATIENT_KEY, record);
            session.setAttribute("currentPatientObj", patient);

            req.setAttribute("patient", patient);
            req.setAttribute("sheetNumber", 1);
            req.getRequestDispatcher(VIEW_INDEX).forward(req, resp);

        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error cargando paciente id=" + patientId, e);
            resp.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
                    "Error cargando paciente: " + e.getMessage());
        }
    }

    // -------------------------------------------------------------------------
    // Métodos auxiliares — mapeo de parámetros
    // -------------------------------------------------------------------------

    /**
     * Aplica los parámetros del request al MedicalRecord de sesión.
     * Se delega al mismo mecanismo de mapeo que usa SheetServlet.
     */
    private void applyRequestParamsToRecord(HttpServletRequest req, MedicalRecord record) {
        // Delegar al iterador de parámetros
        for (String name : req.getParameterMap().keySet()) {
            String value = req.getParameter(name);
            if (value != null) {
                applyField(name, value, record);
            }
        }
    }

    /**
     * Mapea un único par (nombre de campo, valor) al MedicalRecord.
     * Este método es el mismo que usa {@link SheetServlet#saveFieldsFromRequest}.
     */
    static void applyField(String fieldName, String value, MedicalRecord record) {
        switch (fieldName) {
            // ── Hoja 5: Datos del paciente ─────────────────────────────────
            case "c5-sexo":   record.setSexo(value); break;
            case "c5-edad":   record.setEdad(value); break;
            case "c5-ahf":    record.setAntecedentesHeredoFamiliares(value); break;
            // Antecedentes No Patológicos
            case "c5-np-orig":   record.setNpOrigen(value); break;
            case "c5-np-resid":  record.setNpResidencia(value); break;
            case "c5-np-alc":    record.setNpAlcohol(value); break;
            case "c5-np-fum":    record.setNpFumar(value); break;
            case "c5-np-dep":    record.setNpDeportes(value); break;
            case "c5-np-vis":    record.setNpVision(value); break;
            case "c5-np-aud":    record.setNpAuditivo(value); break;
            case "c5-np-trans":  record.setNpTransfusiones(value); break;
            case "c5-np-hosp":   record.setNpHospitalizaciones(value); break;
            case "c5-np-cirug":  record.setNpCirugias(value); break;
            case "c5-np-meds":   record.setNpMedicamentos(value); break;
            case "c5-np-infec":  record.setNpEnfInfecciosas(value); break;
            case "c5-np-alerg":  record.setNpAlergias(value); break;
            case "c5-np-fract":  record.setNpFracturas(value); break;
            case "c5-np-grsang": record.setNpGrupoSanguineo(value); break;
            case "c5-np-inmun":  record.setNpInmunizaciones(value); break;
            // Antecedentes Personales Patológicos
            case "c5-pp-prostata":  record.setPpProstata(value); break;
            case "c5-pp-menarca":   record.setPpMenarca(value); break;
            case "c5-pp-gesta":     record.setPpGesta(value); break;
            case "c5-pp-para":      record.setPpPara(value); break;
            case "c5-pp-aborto":    record.setPpAborto(value); break;
            case "c5-pp-cesareas":  record.setPpCesareas(value); break;
            case "c5-pp-lact1":     record.setPpLactancia1(value); break;
            case "c5-pp-lact2":     record.setPpLactancia2(value); break;
            case "c5-pp-lact3":     record.setPpLactancia3(value); break;
            case "c5-pp-fum":       record.setPpFumTiempo(value); break;
            case "c5-pp-otros":     record.setPpOtros(value); break;
            // Examen Físico
            case "c5-ef-ta":     record.setEfTa(value); break;
            case "c5-ef-fc":     record.setEfFc(value); break;
            case "c5-ef-sat":    record.setEfSat(value); break;
            case "c5-ef-peso":   record.setEfPeso(value); break;
            case "c5-ef-talla":  record.setEfTalla(value); break;
            case "ef-general":   record.setEfGeneral(value); break;
            case "ef-derma":     record.setEfDermatologico(value); break;
            case "ef-craneo":    record.setEfCraneo(value); break;
            case "ef-ojos":      record.setEfOjos(value); break;
            case "ef-oidos":     record.setEfOidos(value); break;
            case "ef-nariz":     record.setEfNariz(value); break;
            case "ef-boca":      record.setEfBoca(value); break;
            case "ef-cuello":    record.setEfCuello(value); break;
            case "ef-torax":     record.setEfTorax(value); break;
            case "ef-abdomen":   record.setEfAbdomen(value); break;
            case "ef-genit":     record.setEfGenitales(value); break;
            case "ef-rectal":    record.setEfRectal(value); break;
            case "ef-extsup":    record.setEfExtSuperiores(value); break;
            case "ef-extinf":    record.setEfExtInferiores(value); break;
            case "ef-neuro":     record.setEfNeurologico(value); break;
            // ── Hoja 7: Revisión por sistemas ─────────────────────────────
            case "c7-resp-sint":  record.setRespSintomatologia(value); break;
            case "c7-resp-espiro": record.setRespEspirometria(value); break;
            case "c7-resp-rx":    record.setRespRayosX(value); break;
            case "c7-card-pef":   record.setCardPruebaEsfuerzo(value); break;
            case "c7-card-ecg":   record.setCardEcg(value); break;
            case "c7-gi-sint":    record.setGiSintomatologia(value); break;
            case "c7-gi-eco":     record.setGiEcografia(value); break;
            case "c7-gi-pfh":     record.setGiPfh(value); break;
            case "c7-gi-copro":   record.setGiCoprologico(value); break;
            case "c7-gi-coprop":  record.setGiCoprop(value); break;
            case "c7-gi-dental":  record.setGiDental(value); break;
            case "omit-gi-dental": record.setOmitirDental("true".equalsIgnoreCase(value)); break;
            case "c7-gu-sint":    record.setGuSintomatologia(value); break;
            case "c7-gu-ecoR":    record.setGuEcoRenal(value); break;
            case "c7-gu-ecoP":    record.setGuEcoProstatico(value); break;
            case "c7-gu-ecoPel":  record.setGuEcoPelvico(value); break;
            case "c7-gu-orina":   record.setGuOrina(value); break;
            case "c7-gu-urea":    record.setGuUrea(value); break;
            case "c7-gu-creat":   record.setGuCreatinina(value); break;
            case "c7-gu-nitro":   record.setGuNitrogeno(value); break;
            case "c7-gu-tfg":     record.setGuTfg(value); break;
            case "c7-gu-psa":     record.setGuPsa(value); break;
            case "c7-nerv-sint":  record.setNervSintomatologia(value); break;
            case "c7-nerv-oftal": record.setNervOftalmologia(value); break;
            case "c7-nerv-audio": record.setNervAudiologia(value); break;
            case "c7-endo-gluc":     record.setEndoGlucosa(value); break;
            case "c7-endo-au":       record.setEndoAcUrico(value); break;
            case "c7-endo-colT":     record.setEndoColTotal(value); break;
            case "c7-endo-trig":     record.setEndoTrigliceridos(value); break;
            case "c7-endo-hdl":      record.setEndoHdl(value); break;
            case "c7-endo-ldl":      record.setEndoLdl(value); break;
            case "c7-endo-lh":       record.setEndoLh(value); break;
            case "c7-endo-fsh":      record.setEndoFsh(value); break;
            case "c7-endo-prl":      record.setEndoProlactina(value); break;
            case "c7-endo-prog":     record.setEndoProgesterona(value); break;
            case "c7-endo-est":      record.setEndoEstrogenos(value); break;
            case "c7-endo-imc":      record.setEndoImc(value); break;
            case "c7-endo-imcClass": record.setEndoImcClasificacion(value); break;
            case "c7-muscu-sint":  record.setMuscuSintomatologia(value); break;
            case "c7-muscu-rx":    record.setMuscuRayosX(value); break;
            case "c7-muscu-densi": record.setMuscuDensitometria(value); break;
            case "c7-hema-bh":    record.setHemaBiometria(value); break;
            case "c7-hema-ca":    record.setHemaCalcio(value); break;
            case "c7-hema-p":     record.setHemaFosforo(value); break;
            case "c7-hema-na":    record.setHemaSodio(value); break;
            case "c7-hema-k":     record.setHemaPotasio(value); break;
            case "c7-hema-cl":    record.setHemaCloruro(value); break;
            case "c7-hema-fe":    record.setHemaHierro(value); break;
            case "c7-hema-grupo": record.setHemaGrupoSanguineo(value); break;
            case "c7-hema-vih":   record.setHemaVih(value); break;
            case "c7-hema-vdrl":  record.setHemaVdrl(value); break;
            // ── Hoja 9: Conclusiones ──────────────────────────────────────
            case "c9-resp":   record.setConcRespiratorio(value); break;
            case "c9-card":   record.setConcCardiovascular(value); break;
            case "c9-gi":     record.setConcGastrointestinal(value); break;
            case "c9-gu":     record.setConcGenitourinario(value); break;
            case "c9-nerv":   record.setConcNervioso(value); break;
            case "c9-muscu":  record.setConcMusculoesqueletico(value); break;
            case "c9-hema":   record.setConcHematopoyetico(value); break;
            case "c9-endo":   record.setConcEndocrino(value); break;
            case "c9-dental": record.setConcDental(value); break;
            case "omit-dental": record.setOmitirDentalConc("true".equalsIgnoreCase(value)); break;
            // ── Hoja 11: Sugerencias ──────────────────────────────────────
            case "c11-sugs":           record.setSugerencias(value); break;
            case "c11-doc-nombre":     record.setSugerenciasDocNombre(value); break;
            case "c11-doc-cedula":     record.setSugerenciasDocCedula(value); break;
            case "c11-doc-especialidad": record.setSugerenciasDocEspecialidad(value); break;
            // ── Hoja 13: Prueba de Esfuerzo ───────────────────────────────
            case "c13-fecha":     record.setEsfuerzoFecha(value); break;
            case "c13-mets":      record.setEsfuerzoMets(value); break;
            case "c13-fcmax":     record.setEsfuerzoFcmax(value); break;
            case "c13-tamax":     record.setEsfuerzoTamax(value); break;
            case "c13-ritmo":     record.setEsfuerzoRitmo(value); break;
            case "c13-resultado": record.setEsfuerzoResultado(value); break;
            case "c13-interp":    record.setEsfuerzoInterpretacion(value); break;
            // ── Hoja 15: Espirometría ─────────────────────────────────────
            case "c15-fecha":     record.setEspiroFecha(value); break;
            case "c15-fvc":       record.setEspiroFvc(value); break;
            case "c15-fev1":      record.setEspiroFev1(value); break;
            case "c15-fev1fvc":   record.setEspiroFev1Fvc(value); break;
            case "c15-patron":    record.setEspiroPatron(value); break;
            case "c15-resultado": record.setEspiroResultado(value); break;
            case "c15-interp":    record.setEspiroInterpretacion(value); break;
            // ── Hoja 17: Gabinete ─────────────────────────────────────────
            case "c17-notas": record.setGabineteNotas(value); break;
            // ── Hoja 19: Oftalmología ─────────────────────────────────────
            case "c19-fecha":    record.setOftalFecha(value); break;
            case "c19-avOD":     record.setOftalAvOd(value); break;
            case "c19-avOI":     record.setOftalAvOi(value); break;
            case "c19-pioOD":    record.setOftalPioOd(value); break;
            case "c19-pioOI":    record.setOftalPioOi(value); break;
            case "c19-fondo":    record.setOftalFondo(value); break;
            case "c19-segAnt":   record.setOftalSegAnterior(value); break;
            case "c19-resultado": record.setOftalResultado(value); break;
            case "c19-reco":     record.setOftalRecomendaciones(value); break;
            // ── Hoja 21: Laboratorio ──────────────────────────────────────
            case "c21-fecha": record.setLabFecha(value); break;
            case "c21-lab":   record.setLabNombre(value); break;
            case "c21-obs":   record.setLabObservaciones(value); break;
            // ── Hoja 22: Firma ────────────────────────────────────────────
            case "c22-nombre":       record.setFirmaNombre(value); break;
            case "c22-cedula":       record.setFirmaCedula(value); break;
            case "c22-especialidad": record.setFirmaEspecialidad(value); break;
            case "c22-clinica":      record.setFirmaClinica(value); break;
            // ── Hoja 24: Audiometría ──────────────────────────────────────
            case "c24-fecha":      record.setAudFecha(value); break;
            case "c24-od-500":     record.setAudOd500(value); break;
            case "c24-od-1k":      record.setAudOd1k(value); break;
            case "c24-od-2k":      record.setAudOd2k(value); break;
            case "c24-od-4k":      record.setAudOd4k(value); break;
            case "c24-od-8k":      record.setAudOd8k(value); break;
            case "c24-od-clasif":  record.setAudOdClasificacion(value); break;
            case "c24-oi-500":     record.setAudOi500(value); break;
            case "c24-oi-1k":      record.setAudOi1k(value); break;
            case "c24-oi-2k":      record.setAudOi2k(value); break;
            case "c24-oi-4k":      record.setAudOi4k(value); break;
            case "c24-oi-8k":      record.setAudOi8k(value); break;
            case "c24-oi-clasif":  record.setAudOiClasificacion(value); break;
            case "c24-resultado":  record.setAudResultado(value); break;
            case "c24-reco":       record.setAudRecomendaciones(value); break;
            // ── Hoja 26: Dental ───────────────────────────────────────────
            case "c26-fecha":        record.setDentalFecha(value); break;
            case "c26-periodontal":  record.setDentalPeriodontal(value); break;
            case "c26-higiene":      record.setDentalHigiene(value); break;
            case "c26-caries":       record.setDentalCaries(value); break;
            case "c26-faltantes":    record.setDentalFaltantes(value); break;
            case "c26-restauracion": record.setDentalRestauracion(value); break;
            case "c26-otros":        record.setDentalOtros(value); break;
            case "c26-tratamiento":  record.setDentalTratamiento(value); break;
            case "c26-diagnostico":  record.setDentalDiagnostico(value); break;
            case "c26-reco":         record.setDentalRecomendaciones(value); break;
            default:
                // Ignorar parámetros desconocidos (csrf token, appState, etc.)
                break;
        }
    }

    // -------------------------------------------------------------------------
    // Métodos auxiliares — sesión y respuestas JSON
    // -------------------------------------------------------------------------

    private boolean isAuthenticated(HttpServletRequest req) {
        HttpSession session = req.getSession(false);
        return session != null && session.getAttribute(AppConstants.SESSION_USER_KEY) != null;
    }

    private boolean isAjaxRequest(HttpServletRequest req) {
        return "XMLHttpRequest".equals(req.getHeader("X-Requested-With"));
    }

    private void sendJsonOk(HttpServletResponse resp) throws IOException {
        resp.setContentType("application/json;charset=UTF-8");
        resp.setStatus(HttpServletResponse.SC_OK);
        try (PrintWriter out = resp.getWriter()) {
            out.print("{\"ok\":true}");
        }
    }

    private void sendJsonError(HttpServletResponse resp, String message) throws IOException {
        resp.setContentType("application/json;charset=UTF-8");
        resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        // Escapar comillas en el mensaje
        String safe = message.replace("\"", "\\\"");
        try (PrintWriter out = resp.getWriter()) {
            out.print("{\"ok\":false,\"error\":\"" + safe + "\"}");
        }
    }
}
