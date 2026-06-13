# Evaluación Corporal y Nutricional

Integrada en la app de Chequeo Médico como una **hoja más del expediente**:
*🥗 Evaluación Nutricional*, después de *Laboratorio* en el menú lateral del
paciente. Las selecciones (secciones, hoja de dieta por kcal y anexos) se guardan
dentro del expediente (Supabase / localStorage) junto con el resto del paciente.

Al usar **“Exportar PDF completo”** se genera un único PDF: primero las hojas del
Chequeo Médico (html2canvas + jsPDF) y al final la Evaluación Nutricional
(portadas + hoja de dieta + anexos), anexada con **pdf-lib** a partir de los PDF
de esta carpeta. Todo ocurre en el navegador; no se sube nada a internet.

## Archivos de esta carpeta usados por la app integrada
- `plantilla/plantilla.pdf` — base de 53 páginas (portadas, lista de equivalentes, anexos).
- `dietas/<kcal>.pdf` — hojas de dieta por nivel calórico.

La UI integrada vive en `../js/sheets/sheet-nutricional.js` y reutiliza
`js/config.js` de esta carpeta. Los archivos `index.html`, `css/` y `js/app.js`
de aquí son la **versión independiente** original (sigue funcionando si se abre
`nutricional/` directo, pero ya no se enlaza desde la app).

## Estructura

```
nutricional/
  index.html         Interfaz (3 pasos + resumen + modal de vista previa)
  css/styles.css     Estilos
  js/config.js       Datos del documento: dietas, secciones y anexos
  js/app.js          Lógica (estado, render, ensamblado de PDF)
  plantilla/plantilla.pdf   ← FALTA (binario, imprescindible)
  dietas/*.pdf              ← FALTAN (binarios: 1100.pdf … 3000.pdf, 3200.pdf)
```

## ⚠️ Archivos binarios pendientes

Para que el generador funcione hay que añadir, dentro de esta carpeta:

- **`plantilla/plantilla.pdf`** — la plantilla base de 53 páginas. **Imprescindible.**
- **`dietas/<kcal>.pdf`** — las hojas de dieta por nivel calórico
  (`1100.pdf`, `1200.pdf`, … `3000.pdf`, `3200.pdf`). El sitio detecta solas
  cuáles existen; para agregar una dieta nueva basta subir su PDF, sin tocar código.

Estos archivos son binarios y deben subirse directamente al repositorio (no se
pueden pegar como texto). Mientras falten, la interfaz carga igual: muestra un
aviso y permite cargar la plantilla a mano con **"Reemplazar plantilla…"**.

## Cómo correrlo

Por seguridad, el navegador no permite leer la plantilla con `fetch` desde
`file://`, así que conviene servirlo por HTTP:

```bash
python3 -m http.server 8000
# abrir http://localhost:8000/nutricional/
```
