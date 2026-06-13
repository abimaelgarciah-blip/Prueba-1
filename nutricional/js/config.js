/**
 * Configuración predeterminada del documento.
 *
 * Los números de página corresponden a la plantilla
 * "Evaluación Corporal y Nutricional" (53 páginas).
 * Si la plantilla cambia, los rangos y nombres pueden editarse desde la
 * interfaz (doble clic) y quedan guardados en el navegador (localStorage).
 */
const CONFIG_PREDETERMINADA = {
  version: 1,

  // Hojas de dieta por calorías (carpeta dietas/). El sitio detecta
  // automáticamente qué archivos existen entre kcalMin y kcalMax (en pasos
  // de "paso"): para agregar una dieta nueva basta subir dietas/1600.pdf, etc.
  // "nombre" define dónde se imprime el nombre sobre la línea NOMBRE de la
  // hoja (coordenadas PDF en puntos, origen abajo-izquierda, hoja carta).
  dieta: {
    carpeta: 'dietas/',
    kcalMin: 1100,
    kcalMax: 3200,
    paso: 100,
    despuesDe: 'portada-plan',
    nombre: { x: 360, y: 657.7, tamano: 12 },
  },

  // Secciones fijas del documento, en el orden en que se imprimen.
  // "slotExterno" indica que después de esa sección se pueden insertar PDFs externos.
  secciones: [
    {
      id: 'portada-principal',
      nombre: 'Portada principal — Análisis de Composición Corporal',
      paginas: '1',
    },
    {
      id: 'portada-revision',
      nombre: 'Portada — Revisión Corporal y Nutricional',
      paginas: '2',
      slotExterno: {
        id: 'ext-revision',
        etiqueta: 'PDFs externos de la revisión (se insertan después de esta portada)',
      },
    },
    {
      id: 'portada-plan',
      nombre: 'Portada — Plan de Alimentación',
      paginas: '3',
      slotExterno: {
        id: 'ext-plan',
        etiqueta: 'PDF externo del plan de alimentación (se inserta antes de la Lista de Equivalentes)',
      },
    },
    {
      id: 'portada-equivalentes',
      nombre: 'Portada — Lista de Equivalentes',
      paginas: '4',
    },
    {
      id: 'contenido-equivalentes',
      nombre: 'Lista de Equivalentes (contenido)',
      paginas: '5-6',
    },
    {
      id: 'portada-anexos',
      nombre: 'Portada — Anexos',
      paginas: '7',
    },
    {
      id: 'recomendaciones',
      nombre: 'Recomendaciones generales',
      paginas: '8',
    },
  ],

  // Anexos individuales: una página de la plantilla cada uno.
  anexos: [
    { pagina: 9,  nombre: 'Alimentos con Colesterol' },
    { pagina: 10, nombre: 'Alimentos con Hierro' },
    { pagina: 11, nombre: 'Alimentos con Zinc' },
    { pagina: 12, nombre: 'Alimentos con Magnesio' },
    { pagina: 13, nombre: 'Alimentos con Purinas' },
    { pagina: 14, nombre: 'Alimentos con Ácido Fólico' },
    { pagina: 15, nombre: 'Alimentos con Calcio' },
    { pagina: 16, nombre: 'Alimentos con Sodio' },
    { pagina: 17, nombre: 'Alimentos con Potasio' },
    { pagina: 18, nombre: 'Vitamina B12' },
    { pagina: 19, nombre: 'Vitamina C' },
    { pagina: 20, nombre: 'Alimentos con Omega 3' },
    { pagina: 21, nombre: 'Alimentos con Fósforo' },
    { pagina: 22, nombre: 'Vitamina D' },
    { pagina: 23, nombre: 'Ácidos Grasos Saturados' },
    { pagina: 24, nombre: 'Azúcar y Grasa (1 de 2)' },
    { pagina: 25, nombre: 'Azúcar y Grasa (2 de 2)' },
    { pagina: 26, nombre: 'Diabetes — Alimentos prohibidos' },
    { pagina: 27, nombre: 'Colitis y Úlceras' },
    { pagina: 28, nombre: 'Acidez Gástrica' },
    { pagina: 29, nombre: 'Estreñimiento' },
    { pagina: 30, nombre: 'Esteatosis' },
    { pagina: 31, nombre: 'El Estrés' },
    { pagina: 32, nombre: 'Antioxidantes (1 de 2)' },
    { pagina: 33, nombre: 'Antioxidantes (2 de 2)' },
    { pagina: 34, nombre: 'Parasitosis' },
    { pagina: 35, nombre: 'Reflujo en el Adulto' },
    { pagina: 36, nombre: 'Alimentos con Fibra' },
    { pagina: 37, nombre: 'Dieta Renal' },
    { pagina: 38, nombre: 'Hidratación — Bebidas Isotónicas' },
    { pagina: 39, nombre: 'Insuficiencia Renal (1 de 2)' },
    { pagina: 40, nombre: 'Insuficiencia Renal (2 de 2)' },
    { pagina: 41, nombre: 'Hipertensión' },
    { pagina: 42, nombre: 'Comer Fuera de Casa' },
    { pagina: 43, nombre: 'Hepatitis' },
    { pagina: 44, nombre: 'Alimentos Bajos en Grasas' },
    { pagina: 45, nombre: 'Dislipidemias' },
    { pagina: 46, nombre: 'Diarrea' },
    { pagina: 47, nombre: 'Hipertrigliceridemia' },
    { pagina: 48, nombre: 'Hemorroides' },
    { pagina: 49, nombre: 'Cálculos Renales (Litiasis)' },
    { pagina: 50, nombre: 'Alimentos con Tiramina — Migraña (1 de 2)' },
    { pagina: 51, nombre: 'Alimentos con Tiramina — Migraña (2 de 2)' },
    { pagina: 52, nombre: 'Gluten en los Alimentos (1 de 2)' },
    { pagina: 53, nombre: 'Gluten en los Alimentos (2 de 2)' },
  ],
};
