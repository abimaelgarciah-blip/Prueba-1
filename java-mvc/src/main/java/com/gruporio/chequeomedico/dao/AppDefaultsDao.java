package com.gruporio.chequeomedico.dao;

import java.io.StringReader;
import java.sql.*;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Acceso a la tabla app_defaults: imagenes predeterminadas de portadas y
 * membretes (equivalente a appDefaults/localStorage de view-settings.js).
 * Compartidas por todos los pacientes salvo que el propio expediente
 * sobreescriba la imagen (ver ImageDefaults en el servicio de PDF).
 */
public class AppDefaultsDao {

    public Map<String, String> findAll() throws SQLException {
        Map<String, String> out = new LinkedHashMap<>();
        String sql = "SELECT image_key, image_data FROM app_defaults";
        try (Connection c = DataSourceProvider.getConnection();
             PreparedStatement ps = c.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                out.put(rs.getString("image_key"), MedicalRecordDao.readClob(rs, "image_data"));
            }
        }
        return out;
    }

    public void set(String key, String dataUrl) throws SQLException {
        try (Connection c = DataSourceProvider.getConnection()) {
            boolean exists;
            try (PreparedStatement check = c.prepareStatement("SELECT 1 FROM app_defaults WHERE image_key = ?")) {
                check.setString(1, key);
                try (ResultSet rs = check.executeQuery()) { exists = rs.next(); }
            }
            String sql = exists
                    ? "UPDATE app_defaults SET image_data = ?, updated_at = SYSTIMESTAMP WHERE image_key = ?"
                    : "INSERT INTO app_defaults (image_data, updated_at, image_key) VALUES (?, SYSTIMESTAMP, ?)";
            try (PreparedStatement ps = c.prepareStatement(sql)) {
                ps.setCharacterStream(1, new StringReader(dataUrl), dataUrl.length());
                ps.setString(2, key);
                ps.executeUpdate();
            }
        }
    }

    public void remove(String key) throws SQLException {
        try (Connection c = DataSourceProvider.getConnection();
             PreparedStatement ps = c.prepareStatement("DELETE FROM app_defaults WHERE image_key = ?")) {
            ps.setString(1, key);
            ps.executeUpdate();
        }
    }
}
