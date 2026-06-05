package com.rio.chequeo.util;

import oracle.jdbc.pool.OracleDataSource;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Properties;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Gestión de pool de conexiones Oracle.
 * Intenta primero JNDI (context.xml) y si falla usa conexión directa con ojdbc.
 * Thread-safe mediante doble verificación de bloqueo para el DataSource de fallback.
 */
public final class DBConnection {

    private static final Logger LOGGER = Logger.getLogger(DBConnection.class.getName());

    // JNDI
    private static final String JNDI_NAME    = "java:comp/env/jdbc/ChequeoDS";

    // Defaults para conexión directa
    private static final String DEFAULT_URL  = "jdbc:oracle:thin:@localhost:1521:ORCL";
    private static final String DEFAULT_USER = "chequeo";
    private static final String DEFAULT_PASS = "chequeo";
    private static final String ORACLE_DRIVER = "oracle.jdbc.OracleDriver";

    // System properties para sobreescribir la conexión directa
    private static final String PROP_URL  = "chequeo.db.url";
    private static final String PROP_USER = "chequeo.db.user";
    private static final String PROP_PASS = "chequeo.db.pass";

    /** DataSource reutilizable para el path de fallback. */
    private static volatile DataSource directDataSource = null;
    private static final Object DS_LOCK = new Object();

    private DBConnection() {
        // Clase utilitaria — no instanciar
    }

    // -------------------------------------------------------------------------
    // API pública
    // -------------------------------------------------------------------------

    /**
     * Devuelve una conexión activa.
     * <ol>
     *   <li>Intenta el pool JNDI configurado en context.xml.</li>
     *   <li>Si falla, usa un {@link OracleDataSource} directo configurable
     *       por system properties ({@code chequeo.db.url}, {@code chequeo.db.user},
     *       {@code chequeo.db.pass}).</li>
     * </ol>
     *
     * @return Connection lista para usar; el llamador es responsable de cerrarla.
     * @throws SQLException si no puede establecer ninguna conexión.
     */
    public static Connection getConnection() throws SQLException {
        // 1. Intentar JNDI
        try {
            Context ctx = new InitialContext();
            DataSource ds = (DataSource) ctx.lookup(JNDI_NAME);
            if (ds != null) {
                return ds.getConnection();
            }
        } catch (NamingException e) {
            LOGGER.log(Level.WARNING,
                    "JNDI lookup falló para '" + JNDI_NAME + "', usando conexión directa. Causa: " + e.getMessage());
        }

        // 2. Fallback: OracleDataSource directo
        return getDirectConnection();
    }

    /**
     * Cierra silenciosamente los recursos JDBC en el orden correcto: rs → ps → conn.
     * Cualquier excepción de cierre se registra en nivel FINE y se descarta.
     *
     * @param conn conexión a cerrar (puede ser {@code null})
     * @param ps   PreparedStatement a cerrar (puede ser {@code null})
     * @param rs   ResultSet a cerrar (puede ser {@code null})
     */
    public static void closeQuietly(Connection conn, PreparedStatement ps, ResultSet rs) {
        if (rs != null) {
            try { rs.close(); } catch (SQLException e) {
                LOGGER.log(Level.FINE, "Error cerrando ResultSet", e);
            }
        }
        if (ps != null) {
            try { ps.close(); } catch (SQLException e) {
                LOGGER.log(Level.FINE, "Error cerrando PreparedStatement", e);
            }
        }
        if (conn != null) {
            try { conn.close(); } catch (SQLException e) {
                LOGGER.log(Level.FINE, "Error cerrando Connection", e);
            }
        }
    }

    /**
     * Sobrecarga conveniente cuando no hay ResultSet.
     */
    public static void closeQuietly(Connection conn, PreparedStatement ps) {
        closeQuietly(conn, ps, null);
    }

    /**
     * Sobrecarga conveniente cuando solo se cierra la conexión.
     */
    public static void closeQuietly(Connection conn) {
        closeQuietly(conn, null, null);
    }

    // -------------------------------------------------------------------------
    // Implementación interna
    // -------------------------------------------------------------------------

    private static Connection getDirectConnection() throws SQLException {
        if (directDataSource == null) {
            synchronized (DS_LOCK) {
                if (directDataSource == null) {
                    directDataSource = buildOracleDataSource();
                }
            }
        }
        return directDataSource.getConnection();
    }

    private static DataSource buildOracleDataSource() throws SQLException {
        // Registrar driver por compatibilidad con contenedores más antiguos
        try {
            Class.forName(ORACLE_DRIVER);
        } catch (ClassNotFoundException e) {
            LOGGER.log(Level.WARNING, "Driver no encontrado en classpath: " + ORACLE_DRIVER + " — " + e.getMessage());
        }

        String url  = System.getProperty(PROP_URL,  DEFAULT_URL);
        String user = System.getProperty(PROP_USER, DEFAULT_USER);
        String pass = System.getProperty(PROP_PASS, DEFAULT_PASS);

        OracleDataSource ods = new OracleDataSource();
        ods.setURL(url);
        ods.setUser(user);
        ods.setPassword(pass);

        // Pool básico thread-safe
        ods.setConnectionCachingEnabled(true);
        Properties cacheProps = new Properties();
        cacheProps.setProperty("MinLimit",              "2");
        cacheProps.setProperty("MaxLimit",              "10");
        cacheProps.setProperty("InitialLimit",          "2");
        cacheProps.setProperty("ConnectionWaitTimeout", "30");
        cacheProps.setProperty("ValidateConnection",    "true");
        ods.setConnectionCacheProperties(cacheProps);
        ods.setConnectionCacheName("ChequeoCache");

        LOGGER.info("OracleDataSource directo inicializado. URL=" + url + " User=" + user);
        return ods;
    }
}
