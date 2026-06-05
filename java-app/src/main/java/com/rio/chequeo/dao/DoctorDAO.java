package com.rio.chequeo.dao;

import com.rio.chequeo.model.Doctor;

import java.io.ByteArrayInputStream;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

/**
 * DAO para operaciones CRUD sobre la entidad {@link Doctor} en Oracle 11g.
 * <p>
 * El campo {@code firmaImagen} se almacena como BLOB en Oracle.
 * Los comentarios {@code TODO} indican la columna Oracle que debe confirmarse
 * una vez definido el esquema de base de datos.
 * </p>
 */
public class DoctorDAO {

    // =========================================================================
    // FIND ALL
    // =========================================================================

    /**
     * Retorna todos los doctores registrados.
     *
     * @param conn conexión JDBC activa
     * @return lista de doctores; vacía si no hay registros
     * @throws SQLException en caso de error de base de datos
     */
    public List<Doctor> findAll(Connection conn) throws SQLException {
        // TODO: ajustar nombre de tabla y columnas según esquema Oracle real
        String sql =
            "SELECT id, nombre, cedula, especialidad, clinica, direccion, firma_imagen " +
            "FROM doctor " +                                                              // TODO: nombre real de tabla
            "ORDER BY nombre";

        List<Doctor> list = new ArrayList<>();
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
     * Busca un doctor por su ID.
     *
     * @param conn conexión JDBC activa
     * @param id   identificador del doctor
     * @return el doctor encontrado o {@code null} si no existe
     * @throws SQLException en caso de error de base de datos
     */
    public Doctor findById(Connection conn, Long id) throws SQLException {
        // TODO: ajustar nombre de tabla y columnas según esquema Oracle real
        String sql =
            "SELECT id, nombre, cedula, especialidad, clinica, direccion, firma_imagen " +
            "FROM doctor " +                                                              // TODO: nombre real de tabla
            "WHERE id = ?";                                                               // TODO: col PK real

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
     * Inserta un nuevo doctor y retorna el ID generado por Oracle.
     *
     * @param conn   conexión JDBC activa
     * @param doctor datos del doctor a insertar (el campo {@code id} se ignora)
     * @return ID generado por la secuencia Oracle
     * @throws SQLException en caso de error de base de datos
     */
    public Long save(Connection conn, Doctor doctor) throws SQLException {
        // TODO: ajustar nombre de tabla, columnas y secuencia Oracle real.
        // Oracle 11g no soporta IDENTITY; se usa secuencia + RETURNING.
        String sql =
            "INSERT INTO doctor (id, nombre, cedula, especialidad, clinica, direccion, firma_imagen) " + // TODO: tabla/cols
            "VALUES (doctor_seq.NEXTVAL, ?, ?, ?, ?, ?, ?) " +                           // TODO: nombre real de secuencia
            "RETURNING id INTO ?";                                                        // TODO: col PK real

        try (CallableStatement cs = conn.prepareCall(sql)) {
            cs.setString(1, doctor.getNombre());                                          // TODO: col nombre
            cs.setString(2, doctor.getCedula());                                          // TODO: col cedula
            cs.setString(3, doctor.getEspecialidad());                                    // TODO: col especialidad
            cs.setString(4, doctor.getClinica());                                         // TODO: col clinica
            cs.setString(5, doctor.getDireccion());                                       // TODO: col direccion
            setBlobParam(cs, 6, doctor.getFirmaImagen());                                 // TODO: col firma_imagen (BLOB)
            cs.registerOutParameter(7, Types.NUMERIC);
            cs.execute();
            return cs.getLong(7);
        }
    }

    // =========================================================================
    // UPDATE
    // =========================================================================

    /**
     * Actualiza los datos de un doctor existente.
     *
     * @param conn   conexión JDBC activa
     * @param doctor doctor con datos actualizados; {@code id} es obligatorio
     * @throws SQLException en caso de error de base de datos
     */
    public void update(Connection conn, Doctor doctor) throws SQLException {
        // TODO: ajustar nombre de tabla y columnas según esquema Oracle real
        String sql =
            "UPDATE doctor " +                                                            // TODO: nombre real de tabla
            "SET nombre = ?, cedula = ?, especialidad = ?, " +                           // TODO: columnas reales
            "    clinica = ?, direccion = ?, firma_imagen = ? " +
            "WHERE id = ?";                                                               // TODO: col PK real

        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, doctor.getNombre());                                          // TODO: col nombre
            ps.setString(2, doctor.getCedula());                                          // TODO: col cedula
            ps.setString(3, doctor.getEspecialidad());                                    // TODO: col especialidad
            ps.setString(4, doctor.getClinica());                                         // TODO: col clinica
            ps.setString(5, doctor.getDireccion());                                       // TODO: col direccion
            setBlobParam(ps, 6, doctor.getFirmaImagen());                                 // TODO: col firma_imagen (BLOB)
            ps.setLong(7, doctor.getId());                                                // TODO: col id
            ps.executeUpdate();
        }
    }

    // =========================================================================
    // DELETE
    // =========================================================================

    /**
     * Elimina un doctor por su ID.
     *
     * @param conn conexión JDBC activa
     * @param id   identificador del doctor a eliminar
     * @throws SQLException en caso de error de base de datos
     */
    public void delete(Connection conn, Long id) throws SQLException {
        // TODO: ajustar nombre de tabla y columna PK según esquema Oracle real
        String sql = "DELETE FROM doctor WHERE id = ?";                                   // TODO: nombre real de tabla/col

        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, id);
            ps.executeUpdate();
        }
    }

    // =========================================================================
    // Helpers
    // =========================================================================

    /**
     * Mapea una fila del {@link ResultSet} a un objeto {@link Doctor}.
     */
    private Doctor mapRow(ResultSet rs) throws SQLException {
        Doctor d = new Doctor();
        d.setId(rs.getLong("id"));                                                        // TODO: col id
        d.setNombre(rs.getString("nombre"));                                              // TODO: col nombre
        d.setCedula(rs.getString("cedula"));                                              // TODO: col cedula
        d.setEspecialidad(rs.getString("especialidad"));                                  // TODO: col especialidad
        d.setClinica(rs.getString("clinica"));                                            // TODO: col clinica
        d.setDireccion(rs.getString("direccion"));                                        // TODO: col direccion
        d.setFirmaImagen(blobToBytes(rs.getBlob("firma_imagen")));                        // TODO: col firma_imagen (BLOB)
        return d;
    }

    /**
     * Establece un parámetro BLOB en un {@link PreparedStatement}.
     * Si los datos son nulos establece NULL.
     */
    private void setBlobParam(PreparedStatement ps, int index,
                              byte[] data) throws SQLException {
        if (data == null) {
            ps.setNull(index, Types.BLOB);
        } else {
            ps.setBinaryStream(index, new ByteArrayInputStream(data), data.length);
        }
    }

    /**
     * Convierte un {@link Blob} de JDBC en un arreglo de bytes.
     * Retorna {@code null} si el blob es nulo.
     */
    private byte[] blobToBytes(Blob blob) throws SQLException {
        if (blob == null) {
            return null;
        }
        try (java.io.InputStream is = blob.getBinaryStream()) {
            return is.readAllBytes();
        } catch (Exception e) {
            throw new SQLException("Error leyendo BLOB de firma", e);
        }
    }
}
