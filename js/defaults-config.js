/* ===== IMÁGENES PREDETERMINADAS COMPARTIDAS (incluidas en el repositorio) =====
 * Prioridad de la imagen mostrada en cada portada/membrete:
 *   1) appState[clave]         -> imagen propia del paciente (su hoja)
 *   2) appDefaults[clave]      -> predeterminada de ESTE navegador (pantalla Ajustes)
 *   3) BUNDLED_DEFAULTS[clave]  -> predeterminada COMPARTIDA del repositorio
 *
 * Nota: las claves de Audiometría/Dental usan el esquema de esta rama
 * (cover-23/mb-24 = Audiometría, cover-25/mb-26 = Dental).
 */
const BUNDLED_DEFAULTS = {
  // Portadas
  'cover-1':  'assets/defaults/cover-1.png',   // Principal (Chequeo Médico)
  'cover-2':  'assets/defaults/cover-2.png',   // Objetivos
  'cover-3':  'assets/defaults/cover-3.png',   // Introducción
  'cover-4':  'assets/defaults/cover-4.png',   // Hallazgos Principales
  'cover-6':  'assets/defaults/cover-6.png',   // Sistemas del cuerpo
  'cover-8':  'assets/defaults/cover-8.png',   // Conclusiones
  'cover-10': 'assets/defaults/cover-10.png',  // Sugerencias (Recomendaciones)
  'cover-12': 'assets/defaults/cover-12.png',  // Prueba de Esfuerzo y ECG
  'cover-14': 'assets/defaults/cover-14.png',  // Espirometría
  'cover-16': 'assets/defaults/cover-16.png',  // Estudios de Gabinete
  'cover-18': 'assets/defaults/cover-18.png',  // Revisión Oftalmológica
  'cover-23': 'assets/defaults/cover-audiometria.png', // Audiometría
  'cover-25': 'assets/defaults/cover-dental.png',      // Evaluación Dental
  'cover-20': 'assets/defaults/cover-20.png',  // Laboratorio

  // Membretes (contenido)
  'mb-5':  'assets/defaults/mb-5.png',   // Hallazgos
  'mb-7':  'assets/defaults/mb-7.png',   // Sistemas del cuerpo
  'mb-9':  'assets/defaults/mb-9.png',   // Conclusiones
  'mb-11': 'assets/defaults/mb-11.png',  // Sugerencias (Recomendaciones)
  'mb-13': 'assets/defaults/mb-13.png',  // Prueba de Esfuerzo y ECG
  'mb-15': 'assets/defaults/mb-15.png',  // Espirometría
  'mb-17': 'assets/defaults/mb-17.png',  // Estudios de Gabinete
  'mb-19': 'assets/defaults/mb-19.png',  // Revisión Oftalmológica
  'mb-24': 'assets/defaults/mb-audiometria.png', // Audiometría
  'mb-26': 'assets/defaults/mb-dental.png',      // Evaluación Dental
  'mb-21': 'assets/defaults/mb-21.png',  // Laboratorio
};

function effectiveImage(key) {
  return (typeof appState !== 'undefined' && appState[key])
      || (typeof appDefaults !== 'undefined' && appDefaults[key])
      || BUNDLED_DEFAULTS[key]
      || '';
}
