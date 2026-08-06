import { motion } from 'framer-motion';
import { AlertTriangle, ArrowLeft, Clock, FileQuestion, ListChecks, Play, Timer } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ExamCoverage } from '@/components/exams/ExamCoverage';
import { EXAM_DIFFICULTY, formatExamDuration, type ExamMeta } from '@/data/exams';
import type { ExamSession } from '@/hooks/useExamSession';

interface ExamIntroScreenProps {
  exam: ExamMeta;
  session: ExamSession;
}

export function ExamIntroScreen({ exam, session }: ExamIntroScreenProps) {
  const navigate = useNavigate();
  const difficulty = EXAM_DIFFICULTY[exam.difficulty];

  return (
    <motion.main
      className="w-full space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <header className="space-y-5">
        <motion.button
          type="button"
          onClick={() => navigate('/examenes')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-navy shadow-card transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald focus-visible:ring-offset-2 focus-visible:ring-offset-surface dark:border-slate-700 dark:bg-navy-light dark:text-slate-200 dark:hover:bg-navy"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Volver a exámenes
        </motion.button>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald">
              Simulador CUH 2026
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-navy dark:text-slate-50">
              {exam.title}
            </h1>
            <p className="mt-1 max-w-lg text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              {exam.description}
            </p>
          </div>
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${difficulty.className}`}
          >
            Dificultad {difficulty.label}
          </span>
        </div>
      </header>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card dark:border-slate-700/60 dark:bg-navy-light">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 dark:border-slate-700 dark:text-slate-300">
            <Clock className="size-3.5 text-slate-400" aria-hidden="true" />
            {formatExamDuration(exam.durationMinutes)}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 dark:border-slate-700 dark:text-slate-300">
            <FileQuestion className="size-3.5 text-slate-400" aria-hidden="true" />
            {exam.questionCount} preguntas
          </span>
        </div>

        <div className="mt-6">
          <ExamCoverage exam={exam} />
        </div>
      </section>

      {(exam.id === 'examen-3' || exam.id === 'examen-4') && (
        <section className="rounded-3xl border border-amber-500/40 bg-gradient-to-br from-amber-500/10 to-transparent p-6 shadow-card">
          <div className="flex items-start gap-4">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-600 ring-1 ring-amber-500/30 dark:text-amber-400">
              <AlertTriangle className="size-6" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-base font-semibold text-navy dark:text-slate-100">
                Práctica no oficial
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                Este simulacro fue elaborado de manera independiente para practicar y no
                representa, sustituye ni garantiza la estructura, contenidos o resultados del
                examen oficial de la UnADM.
              </p>
            </div>
          </div>
        </section>
      )}

      <section className="rounded-3xl border border-emerald/20 bg-gradient-to-br from-emerald/10 to-transparent p-6 shadow-card">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <div className="flex items-center gap-3">
              <span className="flex size-11 items-center justify-center rounded-2xl bg-emerald/15 text-emerald ring-1 ring-emerald/20">
                <ListChecks className="size-6" aria-hidden="true" />
              </span>
              <h2 className="text-base font-semibold text-navy dark:text-slate-100">
                ¿Listo para comenzar?
              </h2>
            </div>
            <ul className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <li className="flex items-center gap-2">
                <Timer className="size-4 text-emerald" aria-hidden="true" />
                El cronómetro inicia en cuanto presiones comenzar y no se puede pausar.
              </li>
              <li className="flex items-center gap-2">
                <ListChecks className="size-4 text-emerald" aria-hidden="true" />
                Puedes saltar preguntas y volver a ellas antes de finalizar.
              </li>
              <li className="flex items-center gap-2">
                <Clock className="size-4 text-emerald" aria-hidden="true" />
                Al terminar el tiempo, el examen se cierra automáticamente.
              </li>
            </ul>
          </div>

          <motion.button
            type="button"
            onClick={session.start}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald to-emerald/90 px-8 py-4 text-base font-bold text-white shadow-lg shadow-emerald/30 transition-shadow hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald focus-visible:ring-offset-2 focus-visible:ring-offset-surface dark:focus-visible:ring-offset-navy-light"
          >
            <Play className="size-5" aria-hidden="true" />
            Comenzar examen
          </motion.button>
        </div>
      </section>
    </motion.main>
  );
}
