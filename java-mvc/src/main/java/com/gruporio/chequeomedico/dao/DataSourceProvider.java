package com.gruporio.chequeomedico.dao;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;

/**
 * Obtiene el DataSource de Oracle 11g configurado en Tomcat (JNDI). Ver
 * META-INF/context.xml para la definicion del pool (nombre
 * "jdbc/ChequeoMedicoDS"). Usar un pool JNDI administrado por Tomcat (en vez
 * de abrir conexiones sueltas con DriverManager) es la practica estandar
 * para apps JSP/Servlet en produccion.
 */
public final class DataSourceProvider {

    private static volatile DataSource dataSource;

    private DataSourceProvider() {}

    public static DataSource get() {
        DataSource ds = dataSource;
        if (ds == null) {
            synchronized (DataSourceProvider.class) {
                ds = dataSource;
                if (ds == null) {
                    ds = lookup();
                    dataSource = ds;
                }
            }
        }
        return ds;
    }

    private static DataSource lookup() {
        try {
            Context initCtx = new InitialContext();
            Context envCtx = (Context) initCtx.lookup("java:comp/env");
            return (DataSource) envCtx.lookup("jdbc/ChequeoMedicoDS");
        } catch (NamingException e) {
            throw new IllegalStateException(
                "No se encontro el DataSource JNDI 'jdbc/ChequeoMedicoDS'. "
                + "Verifica META-INF/context.xml y que el driver Oracle "
                + "(ojdbc*.jar) este en $CATALINA_HOME/lib.", e);
        }
    }

    public static Connection getConnection() throws SQLException {
        return get().getConnection();
    }
}
