/* ===== IMÁGENES PREDETERMINADAS COMPARTIDAS (incluidas en el repositorio) =====
 * Prioridad de la imagen mostrada en cada portada/membrete:
 *   1) appState[clave]         -> imagen propia del paciente (su hoja)
 *   2) appDefaults[clave]      -> predeterminada de ESTE navegador (pantalla Ajustes)
 *   3) BUNDLED_DEFAULTS[clave]  -> predeterminada COMPARTIDA del repositorio
 *
 * Las entradas se agregan a medida que se suben archivos a assets/defaults/.
 */
const BUNDLED_DEFAULTS = {
  // 'cover-1': 'assets/defaults/cover-1.jpg',
  // 'mb-5':    'assets/defaults/mb-5.jpg',
};

function effectiveImage(key) {
  return (typeof appState !== 'undefined' && appState[key])
      || (typeof appDefaults !== 'undefined' && appDefaults[key])
      || BUNDLED_DEFAULTS[key]
      || '';
}
