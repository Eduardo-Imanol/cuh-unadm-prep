import { motion } from 'framer-motion';
import { BookOpen, ClipboardCheck, Clock, FileQuestion, Play, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ExamCoverage } from '@/components/exams/ExamCoverage';
import { EXAM_DIFFICULTY, formatExamDuration, getExamQuestions, type ExamMeta } from '@/data/exams';
import type { ExamStats } from '@/hooks/useExamsData';

interface ExamCardProps {
  exam: ExamMeta;
  stats: ExamStats;
  index: number;
  mastery: number | undefined;
}

function formatLastDate(timestamp: number): string {
  return new Intl.DateTimeFormat('es-MX', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(timestamp));
}

export function ExamCard({ exam, stats, index, mastery }: ExamCardProps) {
  const navigate = useNavigate();
  const difficulty = EXAM_DIFFICULTY[exam.difficulty];
  const hasAttempts = stats.attempts > 0;
  const isAvailable = getExamQuestions(exam.id).length > 0;

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.06, 0.3) }}
      className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-card transition-shadow hover:shadow-xl dark:border-slate-700/60 dark:bg-navy-light"
    >
      {exam.recommended ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-20 size-48 rounded-full bg-emerald/10 blur-3xl"
        />
      ) : null}

      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-navy to-navy-light shadow-lg shadow-navy/20 ring-1 ring-navy/10 dark:ring-white/10">
              <ClipboardCheck className="size-6 text-emerald" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg font-bold tracking-tight text-navy dark:text-slate-100">
                  {exam.title}
                </h3>
                {exam.recommended ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald/10 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-emerald ring-1 ring-emerald/20">
                    <Sparkles className="size-3" aria-hidden="true" />
                    Recomendado
                  </span>
                ) : null}
              </div>
              <p className="mt-0.5 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                {exam.description}
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 dark:border-slate-700 dark:text-slate-300">
              <Clock className="size-3.5 text-slate-400" aria-hidden="true" />
              {formatExamDuration(exam.durationMinutes)}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 dark:border-slate-700 dark:text-slate-300">
              <FileQuestion className="size-3.5 text-slate-400" aria-hidden="true" />
              {exam.questionCount} preguntas
            </span>
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${difficulty.className}`}
            >
              Dificultad {difficulty.label}
            </span>
          </div>

          <div className="mt-5">
            <ExamCoverage exam={exam} />
          </div>

          {mastery !== undefined ? (
            <div className="mt-4 max-w-md rounded-2xl border border-slate-100 bg-surface p-3 dark:border-slate-700/60 dark:bg-navy-dark">
              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-navy dark:text-slate-200">
                  <BookOpen className="size-3.5 text-emerald" aria-hidden="true" />
                  Dominio en ruta
                </span>
                <span className="text-xs font-bold text-emerald">{mastery}%</span>
              </div>
              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald to-emerald/80 transition-all duration-500 ease-out"
                  style={{ width: `${mastery}%` }}
                />
              </div>
            </div>
          ) : null}
        </div>

        <div className="flex shrink-0 flex-col items-stretch gap-4 lg:w-56">
          {hasAttempts ? (
            <div className="rounded-2xl border border-emerald/20 bg-emerald/5 px-4 py-3 text-center">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Mejor puntaje
              </p>
              <p className="mt-0.5 text-3xl font-extrabold text-emerald">{stats.bestScore}%</p>
              <p className="mt-0.5 text-[11px] text-slate-400 dark:text-slate-500">
                {stats.attempts} {stats.attempts === 1 ? 'intento' : 'intentos'}
              </p>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-3 text-center dark:border-slate-700">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Aún sin intentos
              </p>
              <p className="mt-0.5 text-sm text-slate-400 dark:text-slate-500">
                Empieza cuando quieras
              </p>
            </div>
          )}

          <motion.button
            type="button"
            onClick={() => navigate(`/examenes/${exam.id}`)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-navy-light ${
              isAvailable
                ? 'bg-gradient-to-r from-emerald to-emerald/90 text-white shadow-lg shadow-emerald/30 transition-shadow hover:shadow-xl'
                : 'border border-dashed border-slate-300 text-slate-400 transition-colors hover:border-emerald/40 hover:text-emerald dark:border-slate-600 dark:text-slate-400 dark:hover:border-emerald/40 dark:hover:text-emerald'
            }`}
          >
            {isAvailable ? (
              <>
                <Play className="size-4" aria-hidden="true" />
                Iniciar examen
              </>
            ) : (
              <>
                <Clock className="size-4" aria-hidden="true" />
                Próximamente
              </>
            )}
          </motion.button>

          {stats.lastAttemptDate ? (
            <p className="text-center text-[11px] text-slate-400 dark:text-slate-500">
              Último intento: {formatLastDate(stats.lastAttemptDate)}
            </p>
          ) : null}
        </div>
      </div>
    </motion.article>
  );
}
