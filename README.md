# CUH UnADM 2026 Prep

> Plataforma **offline-first** de preparación para el Examen de Conocimientos Generales / Cuestionario Único de Habilidades (CUH) de la UnADM 2026.

Aplicación web progresiva (PWA) de alto rendimiento para aspirantes a la UnADM: repasa el temario, memoriza con flashcards y practica con simulacros de examen cronometrados, todo con o sin conexión a internet.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-Offline--first-5A0FC8?logo=pwa&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=white)

---

## Tabla de contenidos

- [Descripción](#descripción)
- [Características](#características)
- [Stack tecnológico](#stack-tecnológico)
- [Arquitectura](#arquitectura)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Base de datos local](#base-de-datos-local-dexiejs)
- [Simuladores de examen](#simuladores-de-examen)
- [Rutas de la aplicación](#rutas-de-la-aplicación)
- [Primeros pasos](#primeros-pasos)
- [Scripts disponibles](#scripts-disponibles)
- [Testing](#testing)
- [PWA y modo offline](#pwa-y-modo-offline)
- [Despliegue](#despliegue)
- [Contribuciones](#contribuciones)
- [Licencia](#licencia)

---

## Descripción

**CUH UnADM 2026 Prep** es una herramienta de estudio para personas que se preparan para el examen de admisión de la **Universidad Abierta y a Distancia de México (UnADM)**.

La app está pensada para funcionar **sin conexión** después del primer inicio de sesión: todos los datos de progreso, tarjetas de memorización e historial de simulacros se guardan localmente en el navegador (IndexedDB). No depende de un backend propio ni de una conexión permanente.

**Público objetivo:** aspirantes que quieren:

- Repasar el temario oficial por **áreas de conocimiento**.
- Memorizar conceptos con **flashcards** personalizables.
- Practicar con **simulacros de examen cronometrados** con desglose de resultados por materia.
- Monitorear su **probabilidad de ingreso** y su avance global en el dashboard.

> **Aviso:** La UnADM no publica un temario oficial detallado. El temario incluido se elaboró a partir de información reportada por aspirantes, ex-estudiantes y fuentes públicas, y se organiza en el archivo `src/data/syllabus.ts`.

---

## Características

- **Offline-first:** 100% funcional sin internet tras el primer inicio de sesión.
- **Progreso persistente:** lecciones completadas, dominio por tema y puntajes guardados localmente.
- **Simuladores de examen:** exámenes cronometrados de 100 y 108 reactivos con cobertura por área y desglose de resultados.
- **Flashcards:** sistema de memorización personalizable por categoría y dificultad.
- **Ruta de aprendizaje:** temario estructurado por áreas, con plan de repaso de 8 semanas.
- **Dashboard:** indicador circular de probabilidad de ingreso, progreso global y por materia, e historial de intentos.
- **Autenticación con email/password** vía Firebase Auth con persistencia local de sesión.
- **PWA instalable:** se puede agregar a la pantalla de inicio y funciona en modo *standalone*.
- **Dark mode:** soporte de tema claro/oscuro.
- **UI accesible:** navegación por teclado, foco visible y semántica HTML (WCAG 2.1 AA).

---

## Stack tecnológico

| Capa | Tecnología |
|------|------------|
| **Framework** | [React](https://react.dev) 18 + [Vite](https://vite.dev) 6 |
| **Lenguaje** | TypeScript 5.6 (Strict Mode, cero `any`) |
| **Estilos** | [Tailwind CSS](https://tailwindcss.com) 3 + [Framer Motion](https://www.framer.com/motion/) |
| **Base de datos local** | [Dexie.js](https://dexie.org) 4 (IndexedDB) |
| **Autenticación** | [Firebase Auth](https://firebase.google.com/docs/auth) Web SDK 11 (`browserLocalPersistence`) |
| **PWA** | [vite-plugin-pwa](https://vite-pwa-org.netlify.app/) + Workbox |
| **Estado global** | [Zustand](https://zustand-demo.pmnd.rs/) con middleware `persist` |
| **Routing** | [React Router](https://reactrouter.com) 7 |
| **Validación** | [Zod](https://zod.dev) 3 |
| **Iconos** | [Lucide React](https://lucide.dev) |
| **Testing** | [Vitest](https://vitest.dev) + [Testing Library](https://testing-library.com) |

---

## Arquitectura

La aplicación sigue los principios **SOLID** y **Clean Code**, con una separación clara de responsabilidades:

- **Capa de datos (Dexie.js):** toda la persistencia local vive en `src/db/index.ts`. Se exponen funciones tipadas para leer/escribir progreso, flashcards, intentos de examen y la cola de sincronización.
- **Capa de lógica (hooks):** la lógica de negocio está aislada en custom hooks (`useAuth`, `useExamSession`, `useDashboardData`, `useTopicMastery`, etc.), nunca dentro de los componentes visuales.
- **Capa de presentación (componentes):** componentes atómicos y reutilizables de responsabilidad única.
- **Capa de estado global (Zustand):** stores con slices para autenticación, tema y configuración, con persistencia selectiva.
- **Capa de datos estáticos (data/):** temario, exámenes, flashcards por defecto y navegación en archivos JSON/TS compilados en el bundle (funcionan sin red).

```
┌────────────────────────────────────────────────────┐
│                     UI (React)                     │
│  pages → components → framer-motion + tailwind     │
└──────────────┬─────────────────────┬───────────────┘
               │                     │
   hooks (lógica de negocio)    zustand (estado global)
               │                     │
   ┌───────────▼───────────┐   ┌─────▼──────┐
   │  Dexie.js (IndexedDB) │   │ Firebase   │
   │  progress · mastery   │   │ Auth       │
   │  flashcards ·        │   │ (email/pw) │
   │  examAttempts ·      │   └────────────┘
   │  outbox (sync)       │
   └───────────────────────┘
```

### Flujo offline

1. El usuario inicia sesión (Firebase Auth guarda la sesión de forma local).
2. La app precarga el temario, los exámenes y las flashcards por defecto desde el bundle estático.
3. Todo cambio (progreso, flashcards, intentos) se escribe primero en **IndexedDB**.
4. Las operaciones pendientes de sincronización se encolan en la tabla `outbox` (patrón *outbox*), lista para enviarse cuando haya conectividad.

---

## Estructura del proyecto

```
cuh-unadm-prep/
├── public/                  # Recursos estáticos (favicon, iconos PWA)
├── scripts/
│   └── os-shim.cjs          # Shim de Node para entornos sin CPU reportada
├── src/
│   ├── App.tsx              # Definición de rutas y layout principal
│   ├── main.tsx             # Punto de entrada
│   ├── index.css            # Tokens y estilos globales (Tailwind)
│   ├── components/          # UI atómica y reutilizable
│   │   ├── auth/            # Formularios de login/registro
│   │   ├── dashboard/       # Widgets del dashboard
│   │   ├── exam/            # Intro, runner y resultados del simulacro
│   │   ├── exams/           # Tarjetas y cobertura de exámenes
│   │   ├── learningPath/    # Temario y ruta de aprendizaje
│   │   ├── ErrorBoundary.tsx
│   │   ├── Navbar.tsx
│   │   ├── ProtectedRoute.tsx
│   │   └── Sidebar.tsx
│   ├── data/                # Datos estáticos offline
│   │   ├── exams.ts         # Metadatos y banco de preguntas de exámenes
│   │   ├── exams/           # Archivos de preguntas por examen
│   │   ├── syllabus.ts      # Temario completo por área
│   │   ├── flashcards.ts    # Baraja por defecto
│   │   └── navigation.ts    # Ítems de navegación
│   ├── db/
│   │   └── index.ts         # Esquema e instancia de Dexie.js
│   ├── hooks/               # Lógica de negocio aislada
│   ├── pages/               # Vistas por ruta
│   ├── services/
│   │   ├── firebase.ts      # Inicialización de Firebase Auth
│   │   └── googleAuth.ts    # Persistencia de sesión
│   ├── store/               # Stores de Zustand
│   ├── test/                # Setup de pruebas
│   ├── types/
│   │   └── index.ts         # Tipos de dominio (sin `any`)
│   └── utils/               # Funciones puras testeables
├── .env.example             # Variables de entorno requeridas
├── index.html
├── netlify.toml             # Config de despliegue en Netlify
├── package.json
├── tailwind.config.ts
├── vite.config.ts           # Config de Vite + PWA
└── vitest.config.ts
```

---

## Base de datos local (Dexie.js)

Esquema definido en `src/db/index.ts`. La base se llama `cuh-unadm-prep` y está versionada (migraciones automáticas).

| Tabla | Llave primaria | Índices | Propósito |
|-------|----------------|---------|-----------|
| `progress` | `lessonId` | `updatedAt` | Lecciones completadas y puntaje |
| `topicMastery` | `id` | `area`, `updatedAt` | Dominio por área de conocimiento |
| `flashcards` | `id` | `category`, `difficulty`, `createdAt` | Tarjetas de memorización |
| `examAttempts` | `id` | `examId`, `date` | Historial de simulacros con desglose |
| `outbox` | `id` | `status`, `createdAt` | Cola de sincronización pendiente |

> Al modificar tablas, **aumenta la versión** y define los `stores` de esa versión. Dexie migra automáticamente.

---

## Simuladores de examen

Los metadatos se definen en `src/data/exams.ts` y los bancos de preguntas en `src/data/exams/`.

| Examen | Preguntas | Duración | Dificultad | Cobertura |
|--------|----------|----------|------------|-----------|
| **Examen 1** · Simulador de Admisión | 100 | 2 h | Difícil | Comprensión Lectora, Pensamiento Matemático, TIC, Ambientes Virtuales, Lógica de Programación |
| **Examen 2** · Simulador de Admisión | 100 | 2 h | Media | Español, Matemáticas, Habilidades Digitales, Ciencias Sociales y Experimentales |
| **Examen 3** · Simulador de Admisión | 100 | 2 h | Media | Redacción y Comprensión Lectora, Razonamiento Lógico-Matemático, Uso de TIC |
| **Examen 4** · Final de práctica | 108 | 4.5 h | Difícil | Las 7 áreas del temario CUH |

Cada examen se compone de **4 opciones de respuesta** por reactivo y guarda un **desglose de resultados por área** (`breakdown`) en el historial de intentos.

---

## Rutas de la aplicación

Rutas definidas en `src/App.tsx`, todas protegidas por `ProtectedRoute` (redirigen a `/login` si no hay sesión).

| Ruta | Vista | Descripción |
|------|-------|-------------|
| `/login` | `Login` | Inicio de sesión / registro |
| `/` | `Dashboard` | Indicador de probabilidad de ingreso, progreso global y por materia |
| `/examenes` | `Exams` | Catálogo de simuladores disponibles |
| `/examenes/:examId` | `ExamSession` | Intro, desarrollo y resultados del simulacro (ej. `/examenes/examen-4`) |
| `/flashcards` | `Flashcards` | Repaso y creación de tarjetas de memorización |
| `/ruta-aprendizaje` | `LearningPath` | Temario por áreas y plan de repaso |

Cualquier ruta desconocida redirige a `/`.

---

## Primeros pasos

### Requisitos previos

- **Node.js 18+** (recomendado v20 LTS). Versión fijada en `.nvmrc`.
- **npm** 9+.

### Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/Eduardo-Imanol/cuh-unadm-prep.git
cd cuh-unadm-prep

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
```

### Variables de entorno

La autenticación usa Firebase Auth. Copia `.env.example` a `.env` y completa los valores desde la consola de Firebase (**Project settings → Your apps → Web app**):

```env
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu_auth_domain
VITE_FIREBASE_PROJECT_ID=tu_project_id
VITE_FIREBASE_APP_ID=tu_app_id
```

> **Importante:** los valores empiezan por `VITE_` porque así los expone Vite al cliente. Nunca subas tu `.env` real al repositorio (está en `.gitignore`).

### Ejecutar en desarrollo

```bash
npm run dev
```

Abre `http://localhost:5173`.

---

## Scripts disponibles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Servidor de desarrollo con HMR |
| `npm run build` | Compila TypeScript y genera el bundle de producción (PWA incluida) |
| `npm run preview` | Sirve el bundle de producción localmente |
| `npm run typecheck` | Comprueba tipos con `tsc -b` |
| `npm run lint` | Ejecuta ESLint sobre todo el proyecto |
| `npm test` | Ejecuta las pruebas unitarias una sola vez |
| `npm run test:watch` | Ejecuta las pruebas en modo observador |
| `npm run coverage` | Ejecuta las pruebas con reporte de cobertura |
| `npm run analyze` | Build con análisis de tamaño de bundle |

> **Nota:** el script de build usa `NODE_OPTIONS="--require ./scripts/os-shim.cjs"` como workaround para entornos de CI/emuladores donde Node reporta 0 CPUs. En tu máquina local no afecta nada.

---

## Testing

El proyecto usa **Vitest + Testing Library** con un mock de IndexedDB (`fake-indexeddb`) para no depender del navegador real.

- Pruebas de **utilidades puras**: `src/utils/*.test.ts` (cálculo de puntajes, dominio de temas, formato, validación de auth).
- Pruebas de **lógica en hooks**: `src/hooks/*.test.ts`.
- Pruebas **smoke de páginas**: `src/pages/*.smoke.test.tsx`.

```bash
npm test              # ejecutar una vez
npm run test:watch    # en modo observador
npm run coverage      # con cobertura
```

**Regla del proyecto:** toda utilidad matemática o evaluador nuevo debe incluir su prueba unitaria.

---

## PWA y modo offline

Configuración en `vite.config.ts`:

- **Manifest:** nombre `CUH / UnADM 2026 Prep`, tema Navy `#0B132B`, `display: standalone`.
- **Service Worker:** Workbox con `StaleWhileRevalidate` para las rutas `/api/*` y *navigate fallback* a `/index.html`.
- **Chunks manuales:** `vendor-react`, `vendor-db`, `vendor-motion` para optimizar el caché.
- **Actualización:** `registerType: 'autoUpdate'`.

El Service Worker se genera automáticamente en `npm run build` y solo está activo en el bundle de producción (no en `dev`).

---

## Despliegue

### Netlify

El proyecto incluye `netlify.toml` con:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

El redirect SPA garantiza que las rutas (`/examenes/examen-4`, etc.) funcionen al recargar la página. Solo resta conectar el repo en Netlify y añadir las variables `VITE_FIREBASE_*`.

### Firebase Hosting

También incluye `firebase.json`. Puedes desplegar con la CLI de Firebase apuntando a la carpeta `dist`.

---

## Contribuciones

Las contribuciones son bienvenidas. Para mantener la calidad del proyecto:

1. **Haz un fork** y crea una rama descriptiva (`feat/`, `fix/`, `refactor/`, `chore/`).
2. Escribe mensajes de commit con [Conventional Commits](https://www.conventionalcommits.org/) (ej. `feat(exams): add timer to exam runner`).
3. Mantén **TypeScript Strict** y **cero `any`**.
4. Añade pruebas unitarias para cualquier lógica nueva.
5. Ejecuta `npm run lint`, `npm run typecheck` y `npm test` antes de abrir un PR.
6. Abre un **Pull Request** contra la rama `main` describiendo los cambios.

---

## Licencia

Proyecto de código abierto sin licencia explícita. Si piensas usarlo comercialmente o redistribuirlo, contacta al autor a través del repositorio.

---

Hecho con ❤️ para los aspirantes a la UnADM. Si la app te ayuda, deja una ⭐ en [GitHub](https://github.com/Eduardo-Imanol/cuh-unadm-prep).
