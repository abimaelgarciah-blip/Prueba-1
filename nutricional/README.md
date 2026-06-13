# Módulo: Evaluación Corporal y Nutricional (Generador de PDF)

Submódulo integrado en la app de Chequeo Médico. Se abre desde el menú lateral
de un paciente, con el botón **🥗 Evaluación Nutricional** (aparece después de
la sección *Laboratorio*). El nombre del paciente se pasa automáticamente por la
URL (`?paciente=...`).

Arma el PDF de la evaluación a partir de una plantilla de 53 páginas, imprimiendo
solo las secciones, hoja de dieta y anexos que cada paciente necesita. Todo el
procesamiento ocurre en el navegador (pdf-lib + pdf.js); no se sube nada a internet.

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
