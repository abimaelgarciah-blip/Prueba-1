package com.rio.chequeo.dao;

import com.rio.chequeo.model.Patient;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

/**
 * DAO para operaciones CRUD sobre la entidad {@link Patient} en Oracle 11g.
 * <p>
 * Los comentarios {@code TODO} indican la columna Oracle que debe confirmarse
 * una vez definido el esquema de base de datos.
 * </p>
 */
public class PatientDAO {

    // =========================================================================
    // FIND ALL
    // =========================================================================

    /**
     * Retorna todos los pacientes registrados.
     *
     * @param conn conexión JDBC activa
     * @return lista de pacientes; vacía si no hay registros
     * @throws SQLException en caso de error de base de datos
     */
    public List<Patient> findAll(Connection conn) throws SQLException {
        // TODO: ajustar nombre de tabla y columnas según esquema Oracle real
        String sql =
            "SELECT id, nombre, fecha_creacion, ultima_modificacion " +
            "FROM paciente " +                                                            // TODO: nombre real de tabla
            "ORDER BY nombre";

        List<Patient> list = new ArrayList<>();
        try (PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                list.add(mapRow(rs));
            }
        }
        return list;
    }

    // =========================================================================
    // FIND BY ID
    // =========================================================================

    /**
     * Busca un paciente por su ID.
     *
     * @param conn conexión JDBC activa
     * @param id   identificador del paciente
     * @return el paciente encontrado o {@code null} si no existe
     * @throws SQLException en caso de error de base de datos
     */
    public Patient findById(Connection conn, Long id) throws SQLException {
        // TODO: ajustar nombre de tabla y columnas según esquema Oracle real
        String sql =
            "SELECT id, nombre, fecha_creacion, ultima_modificacion " +
            "FROM paciente " +                                                            // TODO: nombre real de tabla
            "WHERE id = ?";                                                               // TODO: nombre real de columna PK

        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return mapRow(rs);
                }
            }
        }
        return null;
    }

    // =========================================================================
    // SAVE (INSERT)
    // =========================================================================

    /**
     * Inserta un nuevo paciente y retorna el ID generado por Oracle.
     *
     * @param conn    conexión JDBC activa
     * @param patient datos del paciente a insertar (el campo {@code id} se ignora)
     * @return ID generado por la secuencia Oracle
     * @throws SQLException en caso de error de base de datos
     */
    public Long save(Connection conn, Patient patient) throws SQLException {
        // TODO: ajustar nombre de tabla, columnas y secuencia Oracle real.
        // Oracle 11g no soporta IDENTITY; se usa secuencia + RETURNING.
        String sql =
            "INSERT INTO paciente (id, nombre, fecha_creacion, ultima_modificacion) " +  // TODO: nombre real de tabla/cols
            "VALUES (paciente_seq.NEXTVAL, ?, ?, ?) " +                                  // TODO: nombre real de secuencia
            "RETURNING id INTO ?";                                                        // TODO: col PK real

        try (CallableStatement cs = conn.prepareCall(sql)) {
            cs.setString(1, patient.getNombre());                                         // TODO: col nombre
            cs.setString(2, patient.getFechaCreacion());                                  // TODO: col fecha_creacion
            cs.setString(3, patient.getUltimaModificacion());                             // TODO: col ultima_modificacion
            cs.registerOutParameter(4, Types.NUMERIC);
            cs.execute();
            return cs.getLong(4);
        }
    }

    // =========================================================================
    // UPDATE
    // =========================================================================

    /**
     * Actualiza los datos de un paciente existente.
     *
     * @param conn    conexión JDBC activa
     * @param patient paciente con datos actualizados; {@code id} es obligatorio
     * @throws SQLException en caso de error de base de datos
     */
    public void update(Connection conn, Patient patient) throws SQLException {
        // TODO: ajustar nombre de tabla y columnas según esquema Oracle real
        String sql =
            "UPDATE paciente " +                                                          // TODO: nombre real de tabla
            "SET nombre = ?, fecha_creacion = ?, ultima_modificacion = ? " +             // TODO: columnas reales
            "WHERE id = ?";                                                               // TODO: col PK real

        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, patient.getNombre());                                         // TODO: col nombre
            ps.setString(2, patient.getFechaCreacion());                                  // TODO: col fecha_creacion
            ps.setString(3, patient.getUltimaModificacion());                             // TODO: col ultima_modificacion
            ps.setLong(4, patient.getId());                                               // TODO: col id
            ps.executeUpdate();
        }
    }

    // =========================================================================
    // DELETE
    // =========================================================================

    /**
     * Elimina un paciente por su ID.
     *
     * @param conn conexión JDBC activa
     * @param id   identificador del paciente a eliminar
     * @throws SQLException en caso de error de base de datos
     */
    public void delete(Connection conn, Long id) throws SQLException {
        // TODO: ajustar nombre de tabla y columna PK según esquema Oracle real
        String sql = "DELETE FROM paciente WHERE id = ?";                                 // TODO: nombre real de tabla/col

        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, id);
            ps.executeUpdate();
        }
    }

    // =========================================================================
    // Helper
    // =========================================================================

    /**
     * Mapea una fila del {@link ResultSet} a un objeto {@link Patient}.
     * El expediente médico NO se carga aquí; use {@link MedicalRecordDAO} si lo necesita.
     */
    private Patient mapRow(ResultSet rs) throws SQLException {
        Patient p = new Patient();
        p.setId(rs.getLong("id"));                                                        // TODO: col id
        p.setNombre(rs.getString("nombre"));                                              // TODO: col nombre
        p.setFechaCreacion(rs.getString("fecha_creacion"));                               // TODO: col fecha_creacion
        p.setUltimaModificacion(rs.getString("ultima_modificacion"));                     // TODO: col ultima_modificacion
        return p;
    }
}
