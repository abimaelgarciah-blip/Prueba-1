# Arquitectura — Chequeo Médico (Java 11 / JSP / Servlet MVC / Oracle 11g)

## 1. Qué es esto

Es el mismo sistema que vivía en `index.html` + `js/*.js` (una SPA en
JavaScript con Supabase como base de datos y generación de PDF 100% en el
navegador), reescrito como una aplicación **Java 11 + JSP + Servlets (MVC)**
para correr en **Tomcat**, con **Oracle 11g** como base de datos.

Se tradujeron **las 26 hojas del Chequeo Médico + el módulo de Evaluación
Nutricional**, las 4 vistas (Pacientes, Doctores, Dashboard, Ajustes), el
login, el autoguardado por campo, y la exportación de PDF completo
(incluyendo el anexo de la Evaluación Nutricional al final).

`sheet22.js` ("Firma del Doctor", campos `c22-*`) **no se tradujo a
propósito**: existe como archivo en el proyecto original pero nunca se
registra en el arreglo `sheets` de `app.js` ni se carga desde `index.html` —
es código muerto que no formaba parte de la app en producción.

## 2. Capas (MVC)

```
model/               Entidades y el "motor de bloques" (equivalente a templates.js)
  content/            Field, Paragraph, StudyLine, DynamicBlock, NumberedList,
                       EditableFixedText, Attachment, PdfReplace, SexConditional,
                       Group, OmitToggle  -> son los mismos helpers de templates.js,
                       ahora como objetos Java en vez de funciones que devuelven HTML.
  SheetRegistry        Puerto 1:1 de app.js (arreglo "sheets") + los 26 sheetN.js.
                       Aquí se define, hoja por hoja, la lista de bloques/campos.
  MedicalRecordData    El "appState" de la version JS: un mapa clave/valor con
                       TODOS los campos dinámicos, serializado a JSON en un CLOB.
dao/                  Acceso a Oracle (JDBC + DataSource JNDI). Un DAO por tabla.
service/
  html/                ContentBlockHtmlRenderer: genera el HTML editable de una
                       hoja a partir de sus bloques (mismas clases CSS que el
                       original -> reusa css/styles.css sin cambios).
  pdf/                 PdfExportService + ContentBlockPdfRenderer + PdfTextFlow:
                       arman el PDF final con Apache PDFBox.
  nutricional/         NutricionalPdfService: anexa plantilla + dieta + externos
                       (equivalente a mergeNutricional()/nutriBuildOrder()).
web/                  Servlets (controladores) + AuthFilter + JSPs en WEB-INF/views.
```

La idea central: **una misma definición declarativa por hoja** (en
`SheetRegistry`) alimenta tres cosas a la vez, igual que en la versión JS
cada `sheetN.js` alimentaba el formulario, el guardado y la exportación:

1. el formulario HTML editable (`ContentBlockHtmlRenderer`),
2. el JSON que se guarda en Oracle (`MedicalRecordData`),
3. el PDF exportado (`ContentBlockPdfRenderer`).

Si necesitas agregar un campo nuevo a una hoja, **se agrega en un solo
lugar** (`SheetRegistry`) y automáticamente aparece en el formulario, se
persiste y se imprime en el PDF.

## 3. Cómo mapear tu base de datos a los campos del PDF (lo que pediste)

No existe un PDF con "campos AcroForm" en el proyecto original (el PDF se
generaba tomando una especie de "foto" del HTML) — por eso aquí el PDF se
genera dibujando texto con PDFBox, hoja por hoja, tomando cada valor de
`MedicalRecordData` por su **id de campo** (el mismo id que usaba el HTML
original: `c7-endo-gluc`, `c19-avOD`, `s1-patient`, etc.).

Esa es la conexión que pediste: **el id es la llave única** que usan a la
vez el formulario, la base de datos y el PDF. Para mapear un dato de tu
sistema actual a un campo del reporte:

```java
MedicalRecord record = medicalRecordDao.findById(id);
MedicalRecordData data = record.getData();

data.set("c7-endo-gluc", resultadoLab.getGlucosa());   // -> aparece en "Sistema Endocrino"
data.set("c19-avOD", oftalmologia.getAgudezaVisualOD()); // -> aparece en "Oftalmología"

medicalRecordDao.save(record);
```

**`/field-catalog`** (menú superior "🗂 Campos del PDF") lista, generado en
vivo desde `SheetRegistry`, **todos los ids válidos de la aplicación** junto
con la hoja a la que pertenecen — es la tabla de referencia para tu mapeo.
También puedes generarla por código con `FieldCatalog.all()`.

Casos especiales:
- **Imágenes de portada/membrete** (`cover-1`, `mb-7`, ...): el valor es un
  data URL base64 (`data:image/png;base64,...`), igual que en la versión JS.
- **Bloques dinámicos** (`c7-resp-extra`, `c17-estudios`, `c21-resultados`,
  ...): el valor es una lista de objetos `{"title": "...", "body": "..."}"`
  (usa `data.setRaw(id, List.of(Map.of("title", "...", "body", "...")))`).
- **Listas numeradas** (`c11-sugs`): el valor es una lista de strings.
- **`nutri`**: un único campo con un objeto anidado
  `{secciones:{...}, kcal, nombre, anexos:[...], extra, externos:{...}}`
  (ver `NutriConfig`/`NutricionalPdfService`).

## 4. Por qué el PDF se genera "dibujado" y no como un PDF con campos rellenables

El PDF original **no tenía plantillas PDF con campos con nombre**: cada hoja
era HTML que el navegador convertía a imagen (`html2canvas`) y pegaba en un
PDF (`jsPDF`). Java no tiene un equivalente directo a `html2canvas`, así
que había dos caminos:

1. Lanzar un navegador headless en el servidor para seguir "tomando fotos"
   del HTML (requiere instalar Chromium en el Tomcat de producción).
2. Dibujar el contenido directamente con PDFBox, campo por campo.

Se eligió la opción 2 porque no depende de nada externo al `.war`/Tomcat, es
el enfoque estándar en aplicaciones Java empresariales para generar PDF, y
es exactamente lo que te permite tener **un id estable por campo** para
mapear tu base de datos.

**Contrapartida honesta:** el PDF resultante NO es pixel-idéntico al
original (tipografías/posiciones exactas de `css/styles.css` no se
replican); es un reporte limpio con la misma estructura, textos, membretes y
portadas, paginado automáticamente. Antes de usarlo con pacientes reales,
genera un PDF de prueba (`/patients/export`) y revísalo visualmente.

## 5. Qué se agregó/corrigió respecto al original

- **"Datos Generales" (nuevo panel)**: en el proyecto original, los campos
  `s1-patient`, `s1-id`, `s1-date`, `s1-clinic`, `s1-sex`, `s1-age` se leen
  en `supabase-client.js`, `view-patients.js` y `view-dashboard.js`, pero
  **ninguna hoja de `js/sheets/*.js` los renderiza como input** — es un bug
  preexistente (guardar un paciente nuevo dependía de un campo que no existía
  en ningún formulario). Aquí se agregó un panel "Datos Generales" que usa
  esos mismos ids, para que guardar funcione de extremo a extremo. No agrega
  una página nueva al PDF (el original tampoco la tenía).
- **Contraseña de acceso**: ya no vive en el JavaScript que llega al
  navegador (`const PASSWORD = '...'` en `app.js`); se valida en el servidor
  contra `WEB-INF/app.properties`.

## 6. Simplificaciones conocidas (para revisar/mejorar después)

- El PDF de exportación reconstruye el layout con texto fluido (ver §4); no
  reproduce la paginación pixel-perfecta original.
- El editor de "texto fijo editable" (`EditableFixedText`, ej. hallazgos del
  examen físico) se simplificó a una casilla de texto siempre editable con
  el texto clínico por defecto precargado (en vez del toggle "✏ Editar" /
  "↺ Restaurar" del original). El dato se guarda igual.
- La firma dibujada a mano (`SignaturePad`) del formulario de Doctores no se
  reimplementó; sólo queda la opción de subir una imagen de firma (el campo
  `signatureData` existe en el modelo/tabla por si se agrega después un
  canvas de firma en `doctors.jsp`).
- El panel de Evaluación Nutricional en `patient-form.jsp` cubre secciones,
  dieta por kcal y páginas extra; la inserción de PDFs externos por sección
  (`ext-revision`, `ext-plan`) tiene su lógica de fusión lista en
  `NutricionalPdfService`, pero falta el control de subida en el JSP.
- El autoguardado de bloques dinámicos/listas numeradas recarga la página
  tras cada alta/baja (más simple que el parcheo de DOM del original, misma
  persistencia).

Ninguna de estas simplificaciones afecta el modelo de datos ni el PDF
final una vez que se completen los controles de UI pendientes — son huecos
de interfaz, no del motor de datos/PDF.

## 7. Despliegue en Tomcat + Oracle 11g

1. **Compilar**: `mvn clean package` (Java 11) → genera
   `target/chequeo-medico.war`.
2. **Driver Oracle**: copia `ojdbc6.jar` (u `ojdbc8.jar`, según tu versión
   real de Oracle 11g/cliente) a `$CATALINA_HOME/lib/`. No se declara como
   dependencia Maven porque Oracle no lo publica en Maven Central y el
   código sólo usa `java.sql.*`.
3. **Esquema**: ejecuta `sql/schema_oracle11g.sql` contra tu base (crea
   `medical_records`, `doctors`, `app_defaults`).
4. **DataSource JNDI**: edita `src/main/webapp/META-INF/context.xml` con
   host/puerto/service name/usuario/password reales antes de empaquetar (o
   reemplázalo tras desplegar, directo en
   `$CATALINA_HOME/conf/Catalina/localhost/chequeo-medico.xml`).
5. **Contraseña de acceso**: cambia `auth.password` en
   `src/main/webapp/WEB-INF/app.properties`.
6. **Desplegar**: copia el `.war` a `$CATALINA_HOME/webapps/`.
7. Entra a `http://tu-servidor:8080/chequeo-medico/`.

## 8. Estructura de carpetas

```
java-mvc/
  pom.xml
  sql/schema_oracle11g.sql
  src/main/java/com/gruporio/chequeomedico/
    model/            entidades + motor de bloques + SheetRegistry + FieldCatalog
    dao/               acceso a Oracle
    service/html/      HTML editable de cada hoja
    service/pdf/        generación del PDF (PDFBox)
    service/nutricional/ fusión de la Evaluación Nutricional
    web/               servlets (controladores) + filtro de autenticación
  src/main/webapp/
    WEB-INF/views/*.jsp  vistas
    WEB-INF/web.xml, app.properties
    META-INF/context.xml  DataSource JNDI de Oracle
    css/styles.css        mismo archivo del proyecto original
    assets/defaults/*      imágenes predeterminadas empaquetadas
    nutricional/plantilla, nutricional/dietas   PDFs de la Evaluación Nutricional
    js/sheet-form.js      autoguardado genérico de cualquier hoja
```
