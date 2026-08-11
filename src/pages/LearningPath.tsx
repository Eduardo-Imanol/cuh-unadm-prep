import { motion } from 'framer-motion';
import { AlertTriangle, BookOpen, CalendarRange, ClipboardCheck, FileQuestion, Timer } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { AreaSectionCard } from '@/components/learningPath/AreaSectionCard';
import { EXAM_AREAS } from '@/data/exams';
import {
  SYLLABUS_DISCLAIMER,
  SYLLABUS_EXAM_PROFILE,
  SYLLABUS_GUIDE,
  SYLLABUS_REVIEW_PLAN,
  getSyllabusAreaGroups,
  getSyllabusLeavesByArea,
  getSyllabusTotalCount,
  type SyllabusAreaGroup,
} from '@/data/syllabus';
import { useTopicMastery } from '@/hooks/useTopicMastery';
import { useAIChatStore } from '@/store/aiChatStore';

function LearningPathLoading() {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
      >
        <BookOpen className="size-12 text-emerald" aria-hidden="true" />
      </motion.div>
    </div>
  );
}

export default function LearningPath() {
  const { masteredIds, isLoading, toggle } = useTopicMastery();
  const setContextDetail = useAIChatStore((state) => state.setContextDetail);

  const totalCount = useMemo(() => getSyllabusTotalCount(), []);
  const groups = useMemo(() => getSyllabusAreaGroups(), []);
  const masteredCount = masteredIds.size;
  const overallPercentage = totalCount === 0 ? 0 : Math.round((masteredCount / totalCount) * 100);

  const areaLabels = useMemo(
    () =>
      groups
        .map((group) => EXAM_AREAS.find((item) => item.id === group.area)?.label ?? group.area)
        .join(', '),
    [groups],
  );

  const detail =
    `Ruta de aprendizaje con ${masteredCount}/${totalCount} subtemas dominados (${overallPercentage}%). ` +
    `Materias disponibles: ${areaLabels}. El estudiante puede preguntarte sobre cualquier tema del temario ` +
    'o pedir recomendaciones de estudio.';

  useEffect(() => {
    if (isLoading) {
      return;
    }
    setContextDetail(detail);
    return () => setContextDetail(null);
  }, [isLoading, setContextDetail, detail]);

  if (isLoading) {
    return <LearningPathLoading />;
  }

  return (
    <motion.main
      className="w-full space-y-8"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
      }}
    >
      <motion.header
        variants={{ hidden: { opacity: 0, y: -16 }, visible: { opacity: 1, y: 0 } }}
        className="space-y-4"
      >
        <p className="text-xs font-semibold uppercase tracking-wider text-emerald">
          Temario extendido · CUH UnADM 2026
        </p>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-navy dark:text-slate-50">
              Ruta de aprendizaje
            </h1>
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              Repasa cada tema del temario de forma estructurada y márcalo como dominado para
              alimentar tu avance global y tus simulacros.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 dark:border-slate-700 dark:text-slate-300">
              <FileQuestion className="size-3.5 text-slate-400" aria-hidden="true" />
              {SYLLABUS_EXAM_PROFILE.questionCount} reactivos
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 dark:border-slate-700 dark:text-slate-300">
              <Timer className="size-3.5 text-slate-400" aria-hidden="true" />
              {SYLLABUS_EXAM_PROFILE.durationMinutes / 60} horas
            </span>
          </div>
        </div>
      </motion.header>

      <motion.section
        variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
        className="rounded-3xl border border-amber-500/40 bg-gradient-to-br from-amber-500/10 to-transparent p-6 shadow-card"
      >
        <div className="flex items-start gap-4">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-600 ring-1 ring-amber-500/30 dark:text-amber-400">
            <AlertTriangle className="size-6" aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-base font-semibold text-navy dark:text-slate-100">Aviso</h2>
            <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              {SYLLABUS_DISCLAIMER} {SYLLABUS_EXAM_PROFILE.description}
            </p>
          </div>
        </div>
      </motion.section>

      <motion.section
        variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
        className="grid grid-cols-1 gap-4 lg:grid-cols-3"
      >
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card dark:border-slate-700/60 dark:bg-navy-light">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-navy dark:text-slate-100">Dominio general</h2>
            <span className="text-2xl font-extrabold text-emerald">{overallPercentage}%</span>
          </div>
          <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald to-emerald/80 transition-all duration-500 ease-out"
              style={{ width: `${overallPercentage}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            {masteredCount}/{totalCount} subtemas dominados
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card dark:border-slate-700/60 dark:bg-navy-light lg:col-span-2">
          <h2 className="text-sm font-semibold text-navy dark:text-slate-100">Avance por materia</h2>
          <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3">
            {groups.map((group) => {
              const area = EXAM_AREAS.find((item) => item.id === group.area);
              if (area === undefined) {
                return null;
              }
              const leaves = getSyllabusLeavesByArea(group.area);
              const mastered = leaves.filter((leaf) => masteredIds.has(leaf.id)).length;
              const pct = leaves.length === 0 ? 0 : Math.round((mastered / leaves.length) * 100);
              const AreaIcon = area.icon;
              return (
                <li key={group.area} className="flex items-center gap-2.5">
                  <span
                    className={`flex size-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${area.gradient}`}
                  >
                    <AreaIcon className="size-4 text-white" aria-hidden="true" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-navy dark:text-slate-200">
                      {area.label}
                    </p>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500">
                      {mastered}/{leaves.length} · {pct}%
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </motion.section>

      <div className="space-y-5">
        {groups.map((group: SyllabusAreaGroup) => (
          <AreaSectionCard
            key={group.area}
            group={group}
            masteredIds={masteredIds}
            onToggle={toggle}
          />
        ))}
      </div>

      <motion.section
        variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
        className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card dark:border-slate-700/60 dark:bg-navy-light"
      >
        <div className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-2xl bg-navy text-emerald dark:bg-navy-dark">
            <ClipboardCheck className="size-6" aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-base font-semibold text-navy dark:text-slate-100">
              IV. Estrategia de estudio y logística del examen
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Preparación técnica, gestión del tiempo y reglas clave.
            </p>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {SYLLABUS_GUIDE.map((block) => (
            <div
              key={block.id}
              className="rounded-2xl border border-slate-100 bg-surface p-4 dark:border-slate-700/60 dark:bg-navy-dark"
            >
              <h3 className="text-sm font-semibold text-navy dark:text-slate-200">{block.title}</h3>
              <ul className="mt-2 space-y-1.5">
                {block.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-emerald" aria-hidden="true" />
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </motion.section>

      <motion.section
        variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
        className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card dark:border-slate-700/60 dark:bg-navy-light"
      >
        <div className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-2xl bg-navy text-emerald dark:bg-navy-dark">
            <CalendarRange className="size-6" aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-base font-semibold text-navy dark:text-slate-100">
              Sugerencia de plan de repaso
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Distribuye tu estudio en 8 semanas antes de la cita oficial.
            </p>
          </div>
        </div>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[520px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Semana
                </th>
                <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Enfoque
                </th>
              </tr>
            </thead>
            <tbody>
              {SYLLABUS_REVIEW_PLAN.map((week) => (
                <tr
                  key={week.week}
                  className="border-b border-slate-100 last:border-0 dark:border-slate-700/60"
                >
                  <td className="px-3 py-2.5 font-semibold text-emerald">{week.week}</td>
                  <td className="px-3 py-2.5 text-slate-600 dark:text-slate-300">{week.focus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.section>
    </motion.main>
  );
}
