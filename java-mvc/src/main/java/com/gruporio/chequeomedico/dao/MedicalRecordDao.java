package com.gruporio.chequeomedico.dao;

import com.gruporio.chequeomedico.model.MedicalRecord;
import com.gruporio.chequeomedico.model.MedicalRecordData;

import java.io.StringReader;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Acceso a la tabla medical_records (Oracle 11g). Equivalente a las llamadas
 * supabase.from('medical_records').select/insert/update/delete de
 * supabase-client.js y view-patients.js.
 */
public class MedicalRecordDao {

    public List<MedicalRecord> findAll() throws SQLException {
        String sql = "SELECT id, patient_name, patient_id, study_date, clinic, data, created_at, updated_at "
                + "FROM medical_records ORDER BY updated_at DESC";
        List<MedicalRecord> out = new ArrayList<>();
        try (Connection c = DataSourceProvider.getConnection();
             PreparedStatement ps = c.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) out.add(map(rs));
        }
        return out;
    }

    /** Igual que filterPatientsView(): busca por nombre, clinica o numero de expediente. */
    public List<MedicalRecord> search(String query) throws SQLException {
        String sql = "SELECT id, patient_name, patient_id, study_date, clinic, data, created_at, updated_at "
                + "FROM medical_records "
                + "WHERE LOWER(patient_name) LIKE ? OR LOWER(patient_id) LIKE ? OR LOWER(clinic) LIKE ? "
                + "ORDER BY updated_at DESC";
        String like = "%" + (query == null ? "" : query.toLowerCase()) + "%";
        List<MedicalRecord> out = new ArrayList<>();
        try (Connection c = DataSourceProvider.getConnection();
             PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setString(1, like);
            ps.setString(2, like);
            ps.setString(3, like);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) out.add(map(rs));
            }
        }
        return out;
    }

    public MedicalRecord findById(String id) throws SQLException {
        String sql = "SELECT id, patient_name, patient_id, study_date, clinic, data, created_at, updated_at "
                + "FROM medical_records WHERE id = ?";
        try (Connection c = DataSourceProvider.getConnection();
             PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setString(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next() ? map(rs) : null;
            }
        }
    }

    /** Igual que dbSaveRecord(): inserta si no tiene id, actualiza si ya existe. */
    public MedicalRecord save(MedicalRecord record) throws SQLException {
        if (record.getId() == null || record.getId().isEmpty()) {
            record.setId(UUID.randomUUID().toString());
            insert(record);
        } else {
            update(record);
        }
        return record;
    }

    private void insert(MedicalRecord r) throws SQLException {
        String sql = "INSERT INTO medical_records (id, patient_name, patient_id, study_date, clinic, data, created_at, updated_at) "
                + "VALUES (?, ?, ?, ?, ?, ?, SYSTIMESTAMP, SYSTIMESTAMP)";
        try (Connection c = DataSourceProvider.getConnection();
             PreparedStatement ps = c.prepareStatement(sql)) {
            bindWrite(ps, r);
            ps.executeUpdate();
        }
    }

    private void update(MedicalRecord r) throws SQLException {
        String sql = "UPDATE medical_records SET patient_name=?, patient_id=?, study_date=?, clinic=?, data=?, updated_at=SYSTIMESTAMP "
                + "WHERE id=?";
        try (Connection c = DataSourceProvider.getConnection();
             PreparedStatement ps = c.prepareStatement(sql)) {
            bindWrite(ps, r);
            ps.setString(6, r.getId());
            int n = ps.executeUpdate();
            if (n == 0) insert(r); // el id venia de un JSON importado que no existe en BD
        }
    }

    private void bindWrite(PreparedStatement ps, MedicalRecord r) throws SQLException {
        ps.setString(1, r.getId());
        ps.setString(2, r.getPatientName());
        ps.setString(3, r.getPatientId());
        if (r.getStudyDate() != null) ps.setDate(4, Date.valueOf(r.getStudyDate()));
        else ps.setNull(4, Types.DATE);
        ps.setString(5, r.getClinic());
        String json = r.getData().toJson();
        ps.setCharacterStream(6, new StringReader(json), json.length());
    }

    public void delete(String id) throws SQLException {
        try (Connection c = DataSourceProvider.getConnection();
             PreparedStatement ps = c.prepareStatement("DELETE FROM medical_records WHERE id = ?")) {
            ps.setString(1, id);
            ps.executeUpdate();
        }
    }

    private MedicalRecord map(ResultSet rs) throws SQLException {
        MedicalRecord r = new MedicalRecord();
        r.setId(rs.getString("id"));
        r.setPatientName(rs.getString("patient_name"));
        r.setPatientId(rs.getString("patient_id"));
        Date sd = rs.getDate("study_date");
        r.setStudyDate(sd == null ? null : sd.toLocalDate());
        r.setClinic(rs.getString("clinic"));
        Timestamp createdAt = rs.getTimestamp("created_at");
        r.setCreatedAt(createdAt == null ? null : createdAt.toLocalDateTime());
        Timestamp updatedAt = rs.getTimestamp("updated_at");
        r.setUpdatedAt(updatedAt == null ? null : updatedAt.toLocalDateTime());
        // Se carga siempre: view-patients/dashboard tambien leen campos del JSON (ej. s1-sex, s1-age).
        r.setData(MedicalRecordData.fromJson(readClob(rs, "data")));
        return r;
    }

    static String readClob(ResultSet rs, String column) throws SQLException {
        Clob clob = rs.getClob(column);
        if (clob == null) return null;
        try {
            return clob.getSubString(1, (int) clob.length());
        } finally {
            clob.free();
        }
    }
}
