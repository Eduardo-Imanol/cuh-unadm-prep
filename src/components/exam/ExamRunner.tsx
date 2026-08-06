import { AnimatePresence, motion } from 'framer-motion';
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Circle,
  Flag,
  LogOut,
  Timer,
} from 'lucide-react';
import { useState } from 'react';
import type { ExamMeta } from '@/data/exams';
import type { ExamSession } from '@/hooks/useExamSession';
import { formatClock } from '@/utils/format';

interface ExamRunnerProps {
  exam: ExamMeta;
  session: ExamSession;
}

type PendingAction = 'finish' | 'abandon' | null;

function optionLetter(index: number): string {
  return String.fromCharCode(65 + index);
}

function timerClassName(seconds: number): string {
  if (seconds <= 60) {
    return 'border-rose-200 bg-rose-50 text-rose-600 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-400';
  }
  if (seconds <= 300) {
    return 'border-amber-200 bg-amber-50 text-amber-600 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-400';
  }
  return 'border-slate-200 bg-white text-navy dark:border-slate-700 dark:bg-navy-light dark:text-slate-100';
}

export function ExamRunner({ exam, session }: ExamRunnerProps) {
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);

  const { currentQuestion, currentIndex, answers } = session;
  const total = session.questions.length;
  const position = Math.min(currentIndex + 1, total);
  const selected = currentQuestion ? answers[currentQuestion.id] : undefined;

  const progressPercent = total === 0 ? 0 : Math.round((session.answeredCount / total) * 100);

  const handleConfirm = () => {
    if (pendingAction === 'finish') {
      void session.finish();
    } else if (pendingAction === 'abandon') {
      session.abandon();
    }
    setPendingAction(null);
  };

  return (
    <motion.main
      className="w-full space-y-5"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="sticky top-16 z-10 -mx-4 border-b border-slate-200 bg-surface/90 px-4 py-3 backdrop-blur-md dark:border-slate-800 dark:bg-navy-dark/90 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="flex items-center justify-between gap-3">
          <p className="min-w-0 truncate text-sm font-bold text-navy dark:text-slate-100">
            {exam.title}
          </p>

          <div className="flex shrink-0 items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 font-mono text-sm font-bold tabular-nums ${timerClassName(session.timeLeftSeconds)}`}
            >
              <Timer className="size-4" aria-hidden="true" />
              {formatClock(session.timeLeftSeconds)}
            </span>
            <button
              type="button"
              onClick={() => setPendingAction('abandon')}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald dark:border-slate-700 dark:text-slate-300 dark:hover:bg-navy"
            >
              <LogOut className="size-3.5" aria-hidden="true" />
              Salir
            </button>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-3">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald to-emerald/80 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="shrink-0 text-xs font-medium text-slate-500 dark:text-slate-400">
            {session.answeredCount}/{total} respondidas
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <section
            aria-live="polite"
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card dark:border-slate-700/60 dark:bg-navy-light"
          >
            {currentQuestion ? (
              <>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center rounded-full bg-navy/10 px-3 py-1 text-xs font-bold text-navy dark:bg-white/10 dark:text-slate-100">
                    Pregunta {position} de {total}
                  </span>
                  <span className="inline-flex items-center rounded-full bg-emerald/10 px-3 py-1 text-xs font-semibold text-emerald">
                    {currentQuestion.category}
                  </span>
                  {selected !== undefined ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald/10 px-3 py-1 text-xs font-semibold text-emerald">
                      <CheckCircle2 className="size-3.5" aria-hidden="true" />
                      Respondida
                    </span>
                  ) : null}
                </div>

                <h2 className="mt-4 text-lg font-semibold leading-relaxed text-navy dark:text-slate-100">
                  {currentQuestion.text}
                </h2>

                <div
                  role="radiogroup"
                  aria-label="Opciones de respuesta"
                  className="mt-5 space-y-3"
                >
                  {currentQuestion.options.map((option, index) => {
                    const isSelected = selected === index;
                    return (
                      <button
                        key={option}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        onClick={() => session.answer(currentQuestion.id, index)}
                        className={`flex w-full items-start gap-3 rounded-2xl border px-4 py-3 text-left text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-navy-light ${
                          isSelected
                            ? 'border-emerald bg-emerald/10 shadow-sm'
                            : 'border-slate-200 bg-surface hover:border-emerald/40 hover:bg-white dark:border-slate-700 dark:bg-navy-dark dark:hover:bg-navy'
                        }`}
                      >
                        <span
                          className={`mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                            isSelected
                              ? 'bg-emerald text-white'
                              : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {optionLetter(index)}
                        </span>
                        <span
                          className={`flex-1 leading-relaxed ${
                            isSelected
                              ? 'font-medium text-navy dark:text-slate-100'
                              : 'text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {option}
                        </span>
                        {isSelected ? (
                          <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald" aria-hidden="true" />
                        ) : (
                          <Circle className="mt-0.5 size-4 shrink-0 text-slate-300 dark:text-slate-600" aria-hidden="true" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </>
            ) : null}
          </section>

          <div className="mt-5">
            <AnimatePresence mode="wait">
              {pendingAction ? (
                <motion.div
                  key="confirm"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="rounded-2xl border border-emerald/30 bg-emerald/5 p-5"
                >
                  <p className="text-sm font-semibold text-navy dark:text-slate-100">
                    {pendingAction === 'finish'
                      ? `¿Finalizar examen? Te quedan ${session.unansweredCount} ${session.unansweredCount === 1 ? 'pregunta' : 'preguntas'} sin responder.`
                      : '¿Abandonar el simulacro? Se perderá tu avance de esta sesión.'}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <motion.button
                      type="button"
                      onClick={handleConfirm}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald to-emerald/90 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald focus-visible:ring-offset-2"
                    >
                      {pendingAction === 'finish' ? (
                        <Flag className="size-4" aria-hidden="true" />
                      ) : (
                        <LogOut className="size-4" aria-hidden="true" />
                      )}
                      {pendingAction === 'finish' ? 'Finalizar ahora' : 'Abandonar'}
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={() => setPendingAction(null)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-navy transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald dark:border-slate-600 dark:text-slate-200 dark:hover:bg-navy"
                    >
                      Continuar resolviendo
                    </motion.button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="nav"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-wrap items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={session.previous}
                      disabled={currentIndex === 0}
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-navy transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-navy"
                    >
                      <ChevronLeft className="size-4" aria-hidden="true" />
                      Anterior
                    </button>
                    <button
                      type="button"
                      onClick={session.next}
                      disabled={currentIndex >= total - 1}
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-navy transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-navy"
                    >
                      Siguiente
                      <ChevronRight className="size-4" aria-hidden="true" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setPendingAction('finish')}
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-navy to-navy-light px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-navy/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald focus-visible:ring-offset-2 focus-visible:ring-offset-surface dark:ring-offset-navy-dark"
                  >
                    <Flag className="size-4" aria-hidden="true" />
                    Finalizar examen
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <aside className="lg:col-span-4">
          <div className="sticky top-44 rounded-3xl border border-slate-200 bg-white p-5 shadow-card dark:border-slate-700/60 dark:bg-navy-light">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Índice de preguntas
            </p>
            <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">
              Toca un número para saltar a esa pregunta.
            </p>
            <div className="mt-4 grid max-h-72 grid-cols-5 gap-2 overflow-y-auto pr-1 sm:grid-cols-8 lg:grid-cols-5">
              {session.questions.map((question, index) => {
                const isAnswered = answers[question.id] !== undefined;
                const isCurrent = index === currentIndex;
                const className = isCurrent
                  ? 'border-emerald bg-emerald text-white shadow-md shadow-emerald/30'
                  : isAnswered
                    ? 'border-emerald/30 bg-emerald/10 text-emerald'
                    : 'border-slate-200 bg-surface text-slate-600 hover:border-emerald/40 hover:text-navy dark:border-slate-700 dark:bg-navy-dark dark:text-slate-300';
                return (
                  <button
                    key={question.id}
                    type="button"
                    onClick={() => session.goTo(index)}
                    aria-label={`Ir a la pregunta ${index + 1}${isAnswered ? ' (respondida)' : ''}`}
                    className={`flex size-9 items-center justify-center rounded-xl border text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald ${className}`}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>
            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-[11px] text-slate-500 dark:text-slate-400">
              <span className="inline-flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-emerald" aria-hidden="true" />
                Respondida
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="size-2.5 rounded-full border border-slate-300 bg-surface dark:border-slate-600 dark:bg-navy-dark" aria-hidden="true" />
                Sin responder
              </span>
            </div>
          </div>
        </aside>
      </div>
    </motion.main>
  );
}
