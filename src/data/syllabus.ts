import type { ExamAreaId } from '@/data/exams';

export interface SyllabusTopic {
  id: string;
  title: string;
  items: string[];
}

export interface SyllabusSection {
  id: string;
  title: string;
  note?: string;
  area: ExamAreaId;
  topics: SyllabusTopic[];
}

export interface SyllabusLeaf {
  id: string;
  sectionId: string;
  topicId: string;
  topicTitle: string;
  area: ExamAreaId;
  title: string;
}

export const SYLLABUS_DISCLAIMER =
  'Temario elaborado a partir de la información reportada por aspirantes, ex-estudiantes y fuentes públicas. La UnADM no publica un temario oficial detallado; este documento organiza y amplía los temas y subtemas señalados para que puedas repasar de forma estructurada.';

export const SYLLABUS_EXAM_PROFILE = {
  questionCount: 108,
  durationMinutes: 270,
  description:
    'Estructura del examen: 108 reactivos de opción múltiple, 4.5 horas, en una sola sesión, sin prórroga ni segundo intento.',
};

export const SYLLABUS_SECTIONS: SyllabusSection[] = [
  {
    id: 'espanol-lectura',
    title: 'I. Conocimientos fundamentales (todas las carreras) · Español y Comprensión Lectora',
    area: 'espanol',
    topics: [
      {
        id: 'espanol-ortografia-gramatica',
        title: '1.1 Ortografía y gramática',
        items: [
          'Reglas de acentuación: prosódica, ortográfica (tilde), diacrítica (más/mas, qué/que, cómo/como)',
          'Uso de grafías: b/v, s/c/z, g/j, h muda, x',
          'Categorías gramaticales: sustantivo, adjetivo, verbo, adverbio, pronombre, artículo, preposición, conjunción, interjección',
          'Conjugación verbal: tiempos (presente, pasado, futuro), modos (indicativo, subjuntivo, imperativo)',
          'Concordancia gramatical (género y número)',
          'Uso de mayúsculas',
          'Signos de puntuación: coma, punto y coma, dos puntos, punto, paréntesis, comillas',
        ],
      },
      {
        id: 'espanol-funciones-lenguaje',
        title: '1.2 Funciones del lenguaje',
        items: [
          'Referencial (informativa)',
          'Apelativa o conativa (persuasiva/directiva)',
          'Expresiva o emotiva',
          'Poética o estética',
          'Fática (contacto social)',
          'Metalingüística (lenguaje sobre el lenguaje)',
        ],
      },
      {
        id: 'espanol-lexico-semantica',
        title: '1.3 Léxico y semántica',
        items: [
          'Sinónimos y antónimos',
          'Homónimos y parónimos',
          'Campos semánticos',
          'Analogías verbales',
          'Denotación y connotación',
        ],
      },
      {
        id: 'espanol-nexos-conectores',
        title: '1.4 Nexos y conectores',
        items: [
          'Copulativos (y, e, ni)',
          'Disyuntivos (o, u)',
          'Adversativos (pero, sin embargo, aunque)',
          'Consecutivos (por lo tanto, así que)',
          'Causales (porque, ya que, debido a)',
          'Temporales (mientras, cuando, después de que)',
        ],
      },
      {
        id: 'espanol-comprension-textos',
        title: '1.5 Comprensión de textos',
        items: [
          'Identificación de idea principal e ideas secundarias',
          'Inferencia y conclusiones',
          'Tipos de texto: narrativo, descriptivo, expositivo, argumentativo, instructivo',
          'Estructura textual: introducción, desarrollo, conclusión',
          'Jerarquización de información en párrafos cortos (3-4 párrafos)',
        ],
      },
      {
        id: 'espanol-proceso-comunicativo',
        title: '1.6 Proceso comunicativo',
        items: [
          'Elementos: emisor, receptor, mensaje, código, canal, contexto, ruido, retroalimentación',
        ],
      },
      {
        id: 'espanol-vicios-lenguaje',
        title: '1.7 Vicios del lenguaje',
        items: [
          'Barbarismos',
          'Redundancia o pleonasmo',
          'Anfibología',
          'Cacofonía',
          'Monotonía o repetición léxica',
        ],
      },
    ],
  },
  {
    id: 'matematicas-logico',
    title: 'I. Conocimientos fundamentales (todas las carreras) · Matemáticas y Razonamiento Lógico',
    area: 'matematicas',
    topics: [
      {
        id: 'matem-aritmetica',
        title: '2.1 Aritmética',
        items: [
          'Jerarquía de operaciones (PEMDAS)',
          'Operaciones con números enteros y decimales',
          'Fracciones: suma, resta, multiplicación, división, simplificación',
          'Porcentajes: cálculo directo, aumentos y descuentos',
          'Razones y proporciones; regla de tres simple y compuesta',
          'Mínimo común múltiplo (MCM) y máximo común divisor (MCD)',
          'Potencias y raíces',
        ],
      },
      {
        id: 'matem-algebra',
        title: '2.2 Álgebra',
        items: [
          'Lenguaje algebraico: traducción de enunciados a expresiones/ecuaciones',
          'Ecuaciones lineales (1er grado) con una incógnita',
          'Sistemas de ecuaciones lineales (2x2)',
          'Ecuaciones cuadráticas (factorización, fórmula general)',
          'Leyes de los exponentes',
          'Productos notables (binomio al cuadrado, diferencia de cuadrados, etc.)',
          'Factorización de polinomios',
          'Funciones lineales y cuadráticas (gráficas básicas)',
        ],
      },
      {
        id: 'matem-estadistica-probabilidad',
        title: '2.3 Estadística y probabilidad',
        items: [
          'Medidas de tendencia central: media, mediana, moda',
          'Rango y dispersión básica',
          'Interpretación de tablas y gráficas (barras, pastel, líneas)',
          'Probabilidad simple (casos favorables/casos totales)',
        ],
      },
      {
        id: 'matem-geometria-trigonometria',
        title: '2.4 Geometría y trigonometría',
        items: [
          'Perímetros y áreas de figuras planas (cuadrado, rectángulo, triángulo, círculo, trapecio)',
          'Volúmenes de sólidos (cubo, prisma, cilindro, esfera)',
          'Ángulos y sus relaciones (complementarios, suplementarios)',
          'Teorema de Pitágoras',
          'Razones trigonométricas básicas: seno, coseno, tangente',
        ],
      },
      {
        id: 'matem-geometria-analitica',
        title: '2.5 Geometría analítica (temas avanzados, menos frecuentes)',
        items: [
          'Plano cartesiano, distancia entre dos puntos, punto medio',
          'Ecuación de la recta (pendiente, ordenada al origen)',
          'Cónicas: circunferencia, parábola, elipse, hipérbola (identificación básica)',
        ],
      },
      {
        id: 'matem-razonamiento-logico',
        title: '2.6 Razonamiento lógico-matemático',
        items: [
          'Secuencias numéricas y patrones',
          'Analogías numéricas',
          'Silogismos y proposiciones lógicas (premisas y conclusiones válidas)',
          'Problemas de planteamiento: edades, mezclas, trabajo conjunto, movimiento (velocidad-tiempo-distancia)',
        ],
      },
    ],
  },
  {
    id: 'informatica-digital',
    title: 'I. Conocimientos fundamentales (todas las carreras) · Informática (competencias digitales)',
    area: 'informatica',
    topics: [
      {
        id: 'info-hardware-software',
        title: '3.1 Hardware y software',
        items: [
          'Componentes físicos (CPU, RAM, disco duro, periféricos de entrada/salida)',
          'Diferencia entre hardware y software',
          'Tipos de software (sistema, aplicación, utilería)',
        ],
      },
      {
        id: 'info-sistemas-operativos',
        title: '3.2 Sistemas operativos',
        items: [
          'Funciones básicas (administración de archivos, procesos y recursos)',
          'Ejemplos: Windows, macOS, Linux',
        ],
      },
      {
        id: 'info-paqueteria-oficina',
        title: '3.3 Paquetería de oficina',
        items: [
          'Word: formato de texto, estilos, combinación de correspondencia, tablas',
          'Excel: fórmulas básicas (SUMA, PROMEDIO, CONTAR), gráficas, celdas y rangos',
          'PowerPoint: diseño de diapositivas, animaciones, vista de presentación',
          'Access: nociones básicas de bases de datos (tablas, consultas)',
        ],
      },
      {
        id: 'info-extensiones-archivo',
        title: '3.4 Extensiones de archivo',
        items: [
          'Documentos: .doc, .docx, .pdf',
          'Hojas de cálculo: .xls, .xlsx',
          'Presentaciones: .ppt, .pptx',
          'Bases de datos: .mdb, .accdb',
          'Comprimidos: .zip, .rar',
        ],
      },
      {
        id: 'info-internet-navegacion',
        title: '3.5 Internet y navegación',
        items: [
          'Concepto de WWW (World Wide Web)',
          'Navegadores web y motores de búsqueda',
          'Estructura de una URL',
          'Atajos de teclado comunes (Ctrl+C, Ctrl+V, Ctrl+Z, Ctrl+X, Ctrl+S)',
        ],
      },
      {
        id: 'info-correo-electronico',
        title: '3.6 Correo electrónico',
        items: [
          'Envío, reenvío, responder',
          'Campos CC (copia) y CCO/BCC (copia oculta)',
          'Adjuntar archivos',
        ],
      },
      {
        id: 'info-seguridad-redes',
        title: '3.7 Seguridad en redes',
        items: [
          'Malware, virus, troyanos, spyware',
          'Phishing y spam',
          'Contraseñas seguras y autenticación de dos factores',
        ],
      },
      {
        id: 'info-tecnologias-emergentes',
        title: '3.8 Tecnologías emergentes',
        items: [
          'Cómputo en la nube (Google Drive, OneDrive)',
          'Nociones básicas de Inteligencia Artificial',
        ],
      },
    ],
  },
  {
    id: 'especificos-salud-bio-ambientales',
    title: 'II. Conocimientos específicos por división académica · Ciencias de la Salud, Biológicas y Ambientales',
    note: 'Se evalúa según la carrera elegida, además de los conocimientos fundamentales.',
    area: 'experimentales',
    topics: [
      {
        id: 'exp-quimica',
        title: 'Química',
        items: [
          'Tabla periódica',
          'Tipos de enlace',
          'Reacciones químicas básicas',
        ],
      },
      {
        id: 'exp-biologia',
        title: 'Biología',
        items: [
          'La célula (estructura y funciones)',
          'Genética básica',
          'Ecosistemas',
        ],
      },
      {
        id: 'exp-ecologia',
        title: 'Ecología',
        items: [
          'Ciclos biogeoquímicos',
          'Sustentabilidad',
          'Impacto ambiental',
        ],
      },
    ],
  },
  {
    id: 'especificos-exactas-ingenieria',
    title: 'II. Conocimientos específicos por división académica · Ciencias Exactas, Ingeniería y Tecnología',
    note: 'Se evalúa según la carrera elegida, además de los conocimientos fundamentales.',
    area: 'experimentales',
    topics: [
      {
        id: 'exp-fisica',
        title: 'Física',
        items: [
          'Cinemática (movimiento, velocidad, aceleración)',
          'Leyes de Newton',
          'Energía (cinética y potencial)',
          'Electricidad básica (circuitos, ley de Ohm)',
        ],
      },
    ],
  },
  {
    id: 'especificos-sociales-administrativas',
    title: 'II. Conocimientos específicos por división académica · Ciencias Sociales y Administrativas',
    note: 'Se evalúa según la carrera elegida, además de los conocimientos fundamentales.',
    area: 'sociales',
    topics: [
      {
        id: 'soc-historia',
        title: 'Historia',
        items: ['Procesos históricos de México y el mundo contemporáneo'],
      },
      {
        id: 'soc-civismo',
        title: 'Civismo',
        items: [
          'Constitución Política, derechos humanos',
          'Valores y organización del Estado mexicano',
        ],
      },
    ],
  },
  {
    id: 'habilidades-aprendizaje-linea',
    title: 'III. Habilidades para el aprendizaje en línea',
    area: 'online',
    topics: [
      {
        id: 'online-aprendizaje-autogestivo',
        title: '1. Aprendizaje autogestivo',
        items: [
          'Planificación y organización del tiempo de estudio',
          'Autodisciplina y automotivación',
          'Iniciativa para la investigación autónoma',
          'Seguimiento preciso de instrucciones escritas',
        ],
      },
      {
        id: 'online-etica-ciudadania-digital',
        title: '2. Ética y ciudadanía digital',
        items: [
          'Honestidad académica',
          'Prevención y detección del plagio',
          'Uso correcto de citas y referencias bibliográficas (formato APA básico)',
        ],
      },
      {
        id: 'online-pensamiento-critico',
        title: '3. Pensamiento crítico',
        items: [
          'Construcción y evaluación de argumentos',
          'Resolución de problemas',
          'Justificación de conclusiones con evidencia',
        ],
      },
    ],
  },
];

export interface SyllabusGuideBlock {
  id: string;
  title: string;
  bullets: string[];
}

export const SYLLABUS_GUIDE: SyllabusGuideBlock[] = [
  {
    id: 'recursos-recomendados',
    title: 'Recursos recomendados',
    bullets: [
      'Guías de EXANI-II (Ceneval)',
      'Exámenes de admisión de la UNAM (estilo de reactivos más similar)',
    ],
  },
  {
    id: 'preparacion-tecnica',
    title: 'Preparación técnica',
    bullets: [
      'Usar computadora o laptop (no tablet ni celular)',
      'Navegador recomendado: Google Chrome actualizado',
      'Conexión a internet estable de al menos 10 Mbps',
      'Verificar suministro eléctrico antes de iniciar',
    ],
  },
  {
    id: 'gestion-tiempo',
    title: 'Gestión del tiempo durante el examen',
    bullets: [
      'El cronómetro no se detiene una vez iniciado',
      'No estancarse en preguntas difíciles; continuar y regresar si es posible',
      'Con 108 reactivos en 4.5 horas se dispone de ~2.5 minutos por reactivo en promedio',
    ],
  },
  {
    id: 'reglas-clave',
    title: 'Reglas clave',
    bullets: [
      'Un solo intento, sin prórrogas',
      'Periodo de aplicación: 24 de agosto al 6 de septiembre de 2026',
    ],
  },
];

export interface ReviewPlanWeek {
  week: number;
  focus: string;
}

export const SYLLABUS_REVIEW_PLAN: ReviewPlanWeek[] = [
  { week: 1, focus: 'Español: gramática, ortografía y funciones del lenguaje' },
  { week: 2, focus: 'Español: comprensión lectora y vicios del lenguaje' },
  { week: 3, focus: 'Matemáticas: aritmética y álgebra' },
  { week: 4, focus: 'Matemáticas: geometría, trigonometría y razonamiento lógico' },
  { week: 5, focus: 'Informática: paquetería de oficina, internet y seguridad' },
  { week: 6, focus: 'Módulo específico de tu carrera (Química/Física/Historia según el caso)' },
  { week: 7, focus: 'Simulacros completos cronometrados (108 reactivos, 4.5 horas)' },
  { week: 8, focus: 'Repaso de errores y temas débiles' },
];

export function syllabusItemId(topicId: string, index: number): string {
  return `${topicId}-${index + 1}`;
}

export function getSyllabusLeaves(): SyllabusLeaf[] {
  const leaves: SyllabusLeaf[] = [];
  for (const section of SYLLABUS_SECTIONS) {
    for (const topic of section.topics) {
      topic.items.forEach((item, index) => {
        leaves.push({
          id: syllabusItemId(topic.id, index),
          sectionId: section.id,
          topicId: topic.id,
          topicTitle: topic.title,
          area: section.area,
          title: item,
        });
      });
    }
  }
  return leaves;
}

export function getSyllabusLeavesByArea(area: ExamAreaId): SyllabusLeaf[] {
  return getSyllabusLeaves().filter((leaf) => leaf.area === area);
}

export function getSyllabusCountByArea(): Record<ExamAreaId, number> {
  const counts: Record<ExamAreaId, number> = {
    espanol: 0,
    matematicas: 0,
    informatica: 0,
    online: 0,
    especifica: 0,
    sociales: 0,
    experimentales: 0,
  };
  for (const leaf of getSyllabusLeaves()) {
    counts[leaf.area] += 1;
  }
  return counts;
}

export function getSyllabusTotalCount(): number {
  return getSyllabusLeaves().length;
}

export interface SyllabusAreaGroup {
  area: ExamAreaId;
  sections: SyllabusSection[];
}

export function getSyllabusAreaGroups(): SyllabusAreaGroup[] {
  const groups: SyllabusAreaGroup[] = [];
  const seen = new Set<ExamAreaId>();
  for (const section of SYLLABUS_SECTIONS) {
    if (!seen.has(section.area)) {
      seen.add(section.area);
      groups.push({ area: section.area, sections: [] });
    }
    const group = groups.find((g) => g.area === section.area);
    group?.sections.push(section);
  }
  return groups;
}
