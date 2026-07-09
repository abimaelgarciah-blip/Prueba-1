package com.gruporio.chequeomedico.dao;

import com.gruporio.chequeomedico.model.Doctor;

import java.io.StringReader;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/** Acceso a la tabla doctors. Equivalente a view-doctors.js (CRUD contra supabase.from('doctors')). */
public class DoctorDao {

    public List<Doctor> findAll() throws SQLException {
        String sql = "SELECT id, nombre, cedula, especialidad, clinica, telefono, email, direccion, "
                + "signature_data, signature_image, created_at FROM doctors ORDER BY created_at DESC";
        List<Doctor> out = new ArrayList<>();
        try (Connection c = DataSourceProvider.getConnection();
             PreparedStatement ps = c.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) out.add(map(rs));
        }
        return out;
    }

    public Doctor findById(String id) throws SQLException {
        String sql = "SELECT id, nombre, cedula, especialidad, clinica, telefono, email, direccion, "
                + "signature_data, signature_image, created_at FROM doctors WHERE id = ?";
        try (Connection c = DataSourceProvider.getConnection();
             PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setString(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next() ? map(rs) : null;
            }
        }
    }

    public Doctor save(Doctor d) throws SQLException {
        if (d.getId() == null || d.getId().isEmpty()) {
            d.setId(UUID.randomUUID().toString());
            String sql = "INSERT INTO doctors (id, nombre, cedula, especialidad, clinica, telefono, email, "
                    + "direccion, signature_data, signature_image, created_at) VALUES (?,?,?,?,?,?,?,?,?,?,SYSTIMESTAMP)";
            try (Connection c = DataSourceProvider.getConnection();
                 PreparedStatement ps = c.prepareStatement(sql)) {
                bind(ps, d);
                ps.executeUpdate();
            }
        } else {
            String sql = "UPDATE doctors SET nombre=?, cedula=?, especialidad=?, clinica=?, telefono=?, email=?, "
                    + "direccion=?, signature_data=?, signature_image=? WHERE id=?";
            try (Connection c = DataSourceProvider.getConnection();
                 PreparedStatement ps = c.prepareStatement(sql)) {
                ps.setString(1, d.getNombre());
                ps.setString(2, d.getCedula());
                ps.setString(3, d.getEspecialidad());
                ps.setString(4, d.getClinica());
                ps.setString(5, d.getTelefono());
                ps.setString(6, d.getEmail());
                ps.setString(7, d.getDireccion());
                setClobParam(ps, 8, d.getSignatureData());
                setClobParam(ps, 9, d.getSignatureImage());
                ps.setString(10, d.getId());
                ps.executeUpdate();
            }
        }
        return d;
    }

    private void bind(PreparedStatement ps, Doctor d) throws SQLException {
        ps.setString(1, d.getId());
        ps.setString(2, d.getNombre());
        ps.setString(3, d.getCedula());
        ps.setString(4, d.getEspecialidad());
        ps.setString(5, d.getClinica());
        ps.setString(6, d.getTelefono());
        ps.setString(7, d.getEmail());
        ps.setString(8, d.getDireccion());
        setClobParam(ps, 9, d.getSignatureData());
        setClobParam(ps, 10, d.getSignatureImage());
    }

    private void setClobParam(PreparedStatement ps, int index, String value) throws SQLException {
        if (value == null) ps.setNull(index, Types.CLOB);
        else ps.setCharacterStream(index, new StringReader(value), value.length());
    }

    public void delete(String id) throws SQLException {
        try (Connection c = DataSourceProvider.getConnection();
             PreparedStatement ps = c.prepareStatement("DELETE FROM doctors WHERE id = ?")) {
            ps.setString(1, id);
            ps.executeUpdate();
        }
    }

    private Doctor map(ResultSet rs) throws SQLException {
        Doctor d = new Doctor();
        d.setId(rs.getString("id"));
        d.setNombre(rs.getString("nombre"));
        d.setCedula(rs.getString("cedula"));
        d.setEspecialidad(rs.getString("especialidad"));
        d.setClinica(rs.getString("clinica"));
        d.setTelefono(rs.getString("telefono"));
        d.setEmail(rs.getString("email"));
        d.setDireccion(rs.getString("direccion"));
        d.setSignatureData(MedicalRecordDao.readClob(rs, "signature_data"));
        d.setSignatureImage(MedicalRecordDao.readClob(rs, "signature_image"));
        Timestamp createdAt = rs.getTimestamp("created_at");
        d.setCreatedAt(createdAt == null ? null : createdAt.toLocalDateTime());
        return d;
    }
}
