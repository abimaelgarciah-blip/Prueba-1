package com.gruporio.chequeomedico.model;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Equivalente a una fila de la tabla medical_records (antes en Supabase,
 * ahora en Oracle 11g). Las 4 columnas indexadas (patientName, patientId,
 * studyDate, clinic) se mantienen aparte del JSON para poder listar/filtrar/
 * buscar pacientes con SQL normal (igual que hacia Supabase); el resto de los
 * cientos de campos de las hojas viven en {@link MedicalRecordData}.
 */
public class MedicalRecord {

    private String id; // RAW(16) / GUID en Oracle
    private String patientName;
    private String patientId;
    private LocalDate studyDate;
    private String clinic;
    private MedicalRecordData data = new MedicalRecordData();
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }

    public String getPatientId() { return patientId; }
    public void setPatientId(String patientId) { this.patientId = patientId; }

    public LocalDate getStudyDate() { return studyDate; }
    public void setStudyDate(LocalDate studyDate) { this.studyDate = studyDate; }

    public String getClinic() { return clinic; }
    public void setClinic(String clinic) { this.clinic = clinic; }

    public MedicalRecordData getData() { return data; }
    public void setData(MedicalRecordData data) { this.data = data; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    /** Sexo del paciente (campo c5-sexo: "Masculino"/"Femenino"), usado por los SexConditional. */
    public String getSex() { return data.get(SheetRegistry.SEX_FIELD_ID); }
}
