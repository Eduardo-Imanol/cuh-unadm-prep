import type { ExamQuestion } from '@/types';

interface BaseReactivo {
  text: string;
  options: [string, string, string, string];
  correctIndex: number;
  feedback: string;
  repeatFeedback: string;
}

interface ExamSection {
  category: string;
  count: number;
  bases: BaseReactivo[];
}

const ESPANOL_GENERIC =
  'Reactivo enfocado en la comprensión y aplicación de normas gramaticales.';

const MATEMATICAS_GENERIC =
  'Resolución mediante aplicación de álgebra, aritmética y modelado cuantitativo.';

const INFORMATICA_GENERIC =
  'Fundamentos de arquitectura de computadoras, redes y sistemas informáticos.';

const ONLINE_GENERIC =
  'Competencias digitales y estrategias de autorregulación académica en e-learning.';

const ESPECIFICA_GENERIC =
  'Principios lógicos de programación y estructuración de datos para ingeniería.';

const SECTIONS: ExamSection[] = [
  {
    category: 'Español',
    count: 25,
    bases: [
      {
        text: '¿Cuál es la función principal de un texto argumentativo?',
        options: [
          'Describir detalladamente un proceso físico o natural.',
          'Relatar hechos ficticios en un entorno cronológico.',
          'Persuadir al lector mediante la exposición de razones y evidencias fundamentadas.',
          'Instruir al usuario paso a paso en el armado de un dispositivo.',
        ],
        correctIndex: 2,
        feedback: 'Comprensión y análisis de textos académicos y persuasivos.',
        repeatFeedback: ESPANOL_GENERIC,
      },
      {
        text:
          "Identifique el sinónimo adecuado de la palabra 'índole' en el contexto: 'Un problema de esa índole requiere análisis técnico.'",
        options: ['Velocidad', 'Naturaleza', 'Magnitud', 'Origen'],
        correctIndex: 1,
        feedback: 'Precisión semántica contextual.',
        repeatFeedback: ESPANOL_GENERIC,
      },
      {
        text: '¿Qué opción presenta una oración con redacción impersonal?',
        options: [
          'Nosotros requerimos personal capacitado para el soporte técnico.',
          'Se requiere personal capacitado para el soporte técnico.',
          'Tú requieres personal capacitado para el soporte técnico.',
          'Ellos requieren personal capacitado para el soporte técnico.',
        ],
        correctIndex: 1,
        feedback: "Uso del pronombre 'se' en construcciones impersonales.",
        repeatFeedback: ESPANOL_GENERIC,
      },
      {
        text: '¿Cuál es el propósito de un ensayo académico?',
        options: [
          'Presentar datos estadísticos en crudo sin análisis.',
          'Narrar una anécdota personal de forma literaria.',
          'Analizar, interpretar o evaluar un tema específico con rigor y sustento teórico.',
          'Establecer normas jurídicas de carácter obligatorio.',
        ],
        correctIndex: 2,
        feedback: 'Estructura de la argumentación formal.',
        repeatFeedback: ESPANOL_GENERIC,
      },
      {
        text: 'Seleccione la opción con la ortografía y puntuación correcta:',
        options: [
          'Los algorítmos eficientes optimizan los tiempos de respuesta del sistema.',
          'Los algoritmos eficientes optimizan, los tiempos de respuesta del sistema.',
          'Los algoritmos eficientes optimizan los tiempos, de respuesta del sistema.',
          'Los algoritmos eficientes optimizan los tiempos de respuesta del sistema.',
        ],
        correctIndex: 3,
        feedback: 'Normativa ortográfica general y ausencia de comas entre sujeto y predicado.',
        repeatFeedback: ESPANOL_GENERIC,
      },
    ],
  },
  {
    category: 'Matemáticas',
    count: 30,
    bases: [
      {
        text: 'Resuelva la siguiente ecuación lineal: 3x - 5 = 16',
        options: ['x = 5', 'x = 7', 'x = 8', 'x = 21'],
        correctIndex: 1,
        feedback: MATEMATICAS_GENERIC,
        repeatFeedback: MATEMATICAS_GENERIC,
      },
      {
        text: '¿Cuál es el resultado de simplificar la expresión algebraica (2x^3)(4x^2)?',
        options: ['6x^5', '8x^6', '8x^5', '6x^6'],
        correctIndex: 2,
        feedback: 'Leyes de los exponentes en multiplicación algebraica.',
        repeatFeedback: MATEMATICAS_GENERIC,
      },
      {
        text: 'Si una aplicación web procesa 150 solicitudes en 3 minutos, ¿cuántas solicitudes procesará en 45 minutos al mismo ritmo?',
        options: ['1500', '2250', '3000', '4500'],
        correctIndex: 1,
        feedback: 'Razones y proporciones directas.',
        repeatFeedback: MATEMATICAS_GENERIC,
      },
      {
        text: 'Calcule el valor de y en el sistema de ecuaciones: x + y = 10 y 2x - y = 5',
        options: ['y = 3', 'y = 5', 'y = 7', 'y = 10'],
        correctIndex: 1,
        feedback: 'Método de suma y resta o sustitución en sistemas lineales.',
        repeatFeedback: MATEMATICAS_GENERIC,
      },
      {
        text: '¿Cuál es el área de un rectángulo cuyo largo mide (x + 4) y su ancho mide 3?',
        options: ['3x + 4', '3x + 12', 'x + 12', '4x + 3'],
        correctIndex: 1,
        feedback: 'Multiplicación algebraica distributiva.',
        repeatFeedback: MATEMATICAS_GENERIC,
      },
    ],
  },
  {
    category: 'Informática',
    count: 20,
    bases: [
      {
        text: '¿Qué componente de la computadora se encarga de ejecutar las instrucciones de los programas y procesar los datos?',
        options: ['Memoria RAM', 'Disco Duro', 'CPU (Unidad Central de Procesamiento)', 'Tarjeta Gráfica'],
        correctIndex: 2,
        feedback: INFORMATICA_GENERIC,
        repeatFeedback: INFORMATICA_GENERIC,
      },
      {
        text: '¿Cuál es la función principal de un Sistema Operativo?',
        options: [
          'Diseñar páginas web interactivas.',
          'Almacenar archivos de respaldo en la nube de forma permanente.',
          'Gestionar los recursos de hardware y proveer servicios a los programas de aplicación.',
          'Compilar código fuente a lenguaje de máquina exclusivamente.',
        ],
        correctIndex: 2,
        feedback: 'Rol del software de sistema en la gestión computacional.',
        repeatFeedback: INFORMATICA_GENERIC,
      },
      {
        text: '¿Qué protocolo se utiliza principalmente para la transferencia segura de hipertexto en la web?',
        options: ['FTP', 'SMTP', 'HTTP', 'HTTPS'],
        correctIndex: 3,
        feedback: 'Seguridad en protocolos de red y web.',
        repeatFeedback: INFORMATICA_GENERIC,
      },
      {
        text: '¿Qué es una dirección IP?',
        options: [
          'Un programa antivirus residente.',
          'Una dirección física inmutable grabada en fábrica.',
          'Una etiqueta numérica que identifica de manera lógica a un dispositivo en una red.',
          'Un protocolo de encriptación de bases de datos.',
        ],
        correctIndex: 2,
        feedback: 'Conceptos básicos de redes IP.',
        repeatFeedback: INFORMATICA_GENERIC,
      },
      {
        text: '¿Cuál de los siguientes elementos se considera software de sistema?',
        options: ['Microsoft Word', 'Google Chrome', 'Linux Ubuntu', 'Visual Studio Code'],
        correctIndex: 2,
        feedback: 'Clasificación del software: sistemas operativos vs aplicaciones.',
        repeatFeedback: INFORMATICA_GENERIC,
      },
    ],
  },
  {
    category: 'Ambientes Virtuales',
    count: 10,
    bases: [
      {
        text: '¿Qué caracteriza principalmente al aprendizaje autónomo en educación a distancia?',
        options: [
          'La asistencia obligatoria a aulas físicas en horarios matutinos.',
          'La dependencia absoluta de un profesor presencial para cada lectura.',
          'La capacidad del estudiante para gestionar su tiempo, recursos y ritmo de estudio.',
          'La prohibición de interactuar con compañeros mediante foros.',
        ],
        correctIndex: 2,
        feedback: ONLINE_GENERIC,
        repeatFeedback: ONLINE_GENERIC,
      },
      {
        text: '¿Cuál es la utilidad principal de un foro académico en una plataforma virtual?',
        options: [
          'Publicar ofertas comerciales externas.',
          'Evaluar el ancho de banda del servidor institucional.',
          'Propiciar el debate constructivo, la colaboración y el intercambio de conocimientos.',
          'Almacenar respaldos automáticos de las tareas.',
        ],
        correctIndex: 2,
        feedback: 'Dinámica colaborativa en entornos virtuales de aprendizaje.',
        repeatFeedback: ONLINE_GENERIC,
      },
      {
        text: '¿Qué actitud es fundamental para el éxito en la modalidad en línea de la UnADM?',
        options: [
          'Esperar instrucciones presenciales diarias.',
          'Evitar el uso de herramientas digitales avanzadas.',
          'La disciplina, la automotivación y la organización constante.',
          'Delegar las actividades escolares en equipos externos.',
        ],
        correctIndex: 2,
        feedback: 'Habilidades de estudio independiente.',
        repeatFeedback: ONLINE_GENERIC,
      },
    ],
  },
  {
    category: 'Lógica de Programación',
    count: 15,
    bases: [
      {
        text: '¿Qué es un algoritmo en ciencias de la computación?',
        options: [
          'Un tipo de base de datos relacional.',
          'Un dispositivo físico de almacenamiento secundario.',
          'Una secuencia finita de instrucciones bien definidas para resolver un problema.',
          'Un lenguaje de marcado para diseño web.',
        ],
        correctIndex: 2,
        feedback: ESPECIFICA_GENERIC,
        repeatFeedback: ESPECIFICA_GENERIC,
      },
      {
        text: '¿Cuál es la estructura de control que permite repetir un bloque de código mientras se cumpla una condición?',
        options: [
          'Estructura condicional (If-Else)',
          'Estructura secuencial lineal',
          'Estructura iterativa (ej. While)',
          'Función recursiva de asignación',
        ],
        correctIndex: 2,
        feedback: 'Control de flujo en programación.',
        repeatFeedback: ESPECIFICA_GENERIC,
      },
      {
        text: '¿Qué es una base de datos relacional?',
        options: [
          'Un archivo de texto plano sin formato.',
          'Un conjunto de datos organizados en tablas compuestas por filas y columnas relacionadas entre sí.',
          'Un software para edición gráfica vectorial.',
          'Un protocolo de red para correo electrónico.',
        ],
        correctIndex: 1,
        feedback: 'Conceptos fundamentales de bases de datos.',
        repeatFeedback: ESPECIFICA_GENERIC,
      },
      {
        text: '¿Qué lenguaje se utiliza comúnmente para consultar y manipular bases de datos relacionales?',
        options: ['HTML', 'CSS', 'SQL', 'Python'],
        correctIndex: 2,
        feedback: 'Lenguajes estándar de consulta de datos.',
        repeatFeedback: ESPECIFICA_GENERIC,
      },
      {
        text: '¿Qué representa una clave primaria (Primary Key) en una tabla de base de datos?',
        options: [
          'Un registro duplicado opcional.',
          'Un campo que almacena contraseñas cifradas exclusivamente.',
          'Un enlace a un servidor externo.',
          'Un campo o combinación de campos que identifica unívocamente a cada registro.',
        ],
        correctIndex: 3,
        feedback: 'Integridad de datos y modelado relacional.',
        repeatFeedback: ESPECIFICA_GENERIC,
      },
    ],
  },
];

function buildQuestions(): ExamQuestion[] {
  const questions: ExamQuestion[] = [];
  let counter = 0;

  for (const section of SECTIONS) {
    for (let i = 0; i < section.count; i += 1) {
      counter += 1;
      const base = section.bases[i % section.bases.length];
      if (base === undefined) {
        throw new Error(`No hay reactivos base para la sección ${section.category}`);
      }
      questions.push({
        id: `examen-1-q${counter}`,
        text: base.text,
        options: [...base.options],
        correctIndex: base.correctIndex,
        category: section.category,
        feedback: i < section.bases.length ? base.feedback : base.repeatFeedback,
      });
    }
  }

  return questions;
}

export const EXAMEN_1_QUESTIONS: ExamQuestion[] = buildQuestions();
