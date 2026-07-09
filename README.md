# Chequeo Médico

Sistema de expedientes clínicos: captura de un chequeo médico completo (26+
hojas: hallazgos, sistemas del cuerpo, laboratorio, gabinete, oftalmología,
audiometría, evaluación dental, etc.) más un módulo de Evaluación Nutricional,
con generación de un PDF final para entregar al paciente.

Java 11 + JSP + Servlets (MVC), pensado para desplegarse en **Tomcat** con
**Oracle 11g** como base de datos. Todo el proyecto vive en [`java-mvc/`](java-mvc/).

```bash
cd java-mvc
mvn clean package        # genera target/chequeo-medico.war
```

Guía completa de arquitectura, despliegue (Tomcat + Oracle 11g) y mapeo de
campos de base de datos al PDF: **[`java-mvc/doc/README-arquitectura.md`](java-mvc/doc/README-arquitectura.md)**.
Guía rápida de arranque: [`java-mvc/README.md`](java-mvc/README.md).
