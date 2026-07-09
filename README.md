# Chequeo Médico

Sistema de expedientes clínicos: captura de un chequeo médico completo (26+
hojas: hallazgos, sistemas del cuerpo, laboratorio, gabinete, oftalmología,
audiometría, evaluación dental, etc.) más un módulo de Evaluación Nutricional,
con generación de un PDF final para entregar al paciente.

Este repositorio tiene **dos versiones** del mismo sistema:

| Versión | Carpeta | Stack |
|---|---|---|
| **Original** | raíz del repo (`index.html`, `js/`, `css/`, `nutricional/`) | SPA en JavaScript, Supabase (Postgres), PDF generado en el navegador (html2canvas + jsPDF + pdf-lib) |
| **Java / MVC** | [`java-mvc/`](java-mvc/) | Java 11, JSP, Servlets, Oracle 11g, PDF generado en el servidor (Apache PDFBox) — pensado para desplegarse en Tomcat |

## Versión original (JavaScript)

No requiere build: es HTML/CSS/JS plano. Para probarla localmente (el
navegador no puede leer archivos locales por `file://`, así que hay que
servirla por HTTP):

```bash
python3 -m http.server 8000
# abrir http://localhost:8000/
```

Usa Supabase como base de datos (ver `js/supabase-client.js` para la URL y
la llave pública) y guarda un respaldo en `localStorage` del navegador.

### Estructura

```
index.html          Interfaz principal (login, pacientes, doctores, dashboard, ajustes)
css/styles.css       Estilos
js/app.js            Estado, navegación de hojas, exportación de PDF
js/templates.js      Helpers de render (encabezados, campos, bloques dinámicos, etc.)
js/supabase-client.js  Guardar/cargar expedientes en Supabase
js/views/            Vistas de Pacientes, Doctores, Dashboard, Ajustes
js/sheets/            Las 26+ hojas del expediente + la hoja de Evaluación Nutricional
nutricional/          Módulo de Evaluación Nutricional (plantilla PDF + dietas por kcal)
assets/defaults/      Imágenes predeterminadas de portadas y membretes
```

## Versión Java / JSP / MVC (Tomcat + Oracle 11g)

Puerto completo de la app anterior a una arquitectura MVC clásica, para
correr en un servidor Tomcat con Oracle 11g como base de datos. Mantiene
todas las funcionalidades (login, autoguardado por campo, exportación de PDF
completo con el anexo nutricional, y las vistas de Pacientes, Doctores,
Dashboard y Ajustes), y expone un **catálogo de campos** (`/field-catalog`)
para mapear una base de datos propia a cada campo del PDF.

```bash
cd java-mvc
mvn clean package        # genera target/chequeo-medico.war
```

Guía completa de arquitectura, despliegue (Tomcat + Oracle 11g) y mapeo de
campos: **[`java-mvc/doc/README-arquitectura.md`](java-mvc/doc/README-arquitectura.md)**.
Guía rápida de arranque: [`java-mvc/README.md`](java-mvc/README.md).

## ¿Cuál versión usar?

- **Original (JS + Supabase)**: si ya usas Supabase y quieres seguir
  operando desde el navegador sin infraestructura propia.
- **Java MVC (Tomcat + Oracle 11g)**: si tu infraestructura ya es Oracle/Tomcat,
  o si necesitas integrar el expediente con una base de datos corporativa
  propia (ver la guía de mapeo de campos).
