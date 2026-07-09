# Chequeo Médico — Java 11 / JSP / Servlet MVC / Oracle 11g

Puerto completo de la app original (`index.html` + `js/*.js`, Supabase +
html2canvas/jsPDF/pdf-lib) a una arquitectura MVC clásica para desplegar en
Tomcat con Oracle 11g como base de datos.

**Para la explicación completa de la arquitectura, las decisiones de diseño y
la guía de mapeo de campos, lee [`doc/README-arquitectura.md`](doc/README-arquitectura.md).**

## Resumen rápido

```
mvn clean package                # genera target/chequeo-medico.war
```

1. Copia `ojdbc6.jar` (u `ojdbc8.jar`) a `$CATALINA_HOME/lib/`.
2. Ejecuta `sql/schema_oracle11g.sql` en tu instancia Oracle 11g.
3. Ajusta `src/main/webapp/META-INF/context.xml` con los datos reales de conexión.
4. Cambia la contraseña en `src/main/webapp/WEB-INF/app.properties` (`auth.password`).
5. Copia el `.war` a `$CATALINA_HOME/webapps/`.
6. Entra a `http://tu-servidor:8080/chequeo-medico/` con la contraseña configurada.
