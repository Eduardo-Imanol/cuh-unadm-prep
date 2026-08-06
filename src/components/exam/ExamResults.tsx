import { motion } from 'framer-motion';
import {
  CheckCircle2,
  ChevronDown,
  Clock,
  HelpCircle,
  RotateCcw,
  Undo2,
  XCircle,
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAreaStudyTopics, getExamAreaByLabel, type ExamMeta } from '@/data/exams';
import type { ExamSession } from '@/hooks/useExamSession';
import { useAIStore } from '@/store/aiStore';
import { formatClock } from '@/utils/format';
import type { ScoreResult } from '@/utils/scoreCalculator';
import { ExamFeedbackSummary } from './ExamFeedbackSummary';
import { QuestionFeedback } from './QuestionFeedback';

interface ExamResultsProps {
  exam: ExamMeta;
  session: ExamSession;
}

function scoreLevel(percentage: number): { label: string; className: string } {
  if (percentage >= 80) {
    return {
      label: 'Excelente',
      className: 'bg-emerald/10 text-emerald ring-emerald/20',
    };
  }
  if (percentage >= 60) {
    return {
      label: 'Buen nivel',
      className: 'bg-amber-500/10 text-amber-600 ring-amber-500/20 dark:text-amber-400',
    };
  }
  return {
    label: 'A reforzar',
    className: 'bg-rose-500/10 text-rose-600 ring-rose-500/20 dark:text-rose-400',
  };
}

function optionLetter(index: number): string {
  return String.fromCharCode(65 + index);
}

function StudyPlanCard({ score }: { score: ScoreResult }) {
  const weakAreas = score.breakdown
    .filter((item) => item.total > 0 && item.correct / item.total < 0.6)
    .map((item) => {
      const area = getExamAreaByLabel(item.category);
      return {
        item,
        area,
        topics: area ? getAreaStudyTopics(area.id) : [],
      };
    });

  if (weakAreas.length === 0) {
    return null;
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4 }}
      className="rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-white p-6 shadow-card dark:from-amber-500/10 dark:via-navy-light dark:to-navy-light"
    >
      <h2 className="text-base font-semibold text-navy dark:text-slate-100">
        Áreas a reforzar
      </h2>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Según tu desempeño, enfoca tu estudio en estos temas para el próximo intento.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {weakAreas.map(({ item, area, topics }) => (
          <div
            key={item.category}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-navy-dark"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="truncate text-sm font-semibold text-navy dark:text-slate-100">
                {item.category}
              </p>
              <span className="shrink-0 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-bold text-amber-600 ring-1 ring-amber-500/20 dark:text-amber-400">
                {Math.round((item.correct / item.total) * 100)}%
              </span>
            </div>
            {topics.length > 0 ? (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {topics.map((topic) => (
                  <span
                    key={topic}
                    className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-2.5 py-0.5 text-[11px] font-medium text-slate-600 dark:border-slate-600 dark:text-slate-300"
                  >
                    {area?.icon ? <area.icon className="size-3 text-amber-500" aria-hidden="true" /> : null}
                    {topic}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </motion.section>
  );
}

export function ExamResults({ exam, session }: ExamResultsProps) {
  const navigate = useNavigate();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const apiKey = useAIStore((state) => state.apiKey);

  const result = session.result;
  if (!result) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Preparando tus resultados…
        </p>
      </div>
    );
  }

  const { result: score, timeSpentSeconds } = result;
  const level = scoreLevel(score.percentage);

  const stats = [
    {
      label: 'Correctas',
      value: String(score.correct),
      icon: CheckCircle2,
      className: 'bg-emerald/10 text-emerald',
    },
    {
      label: 'Incorrectas',
      value: String(score.incorrect),
      icon: XCircle,
      className: 'bg-rose-500/10 text-rose-500',
    },
    {
      label: 'Sin responder',
      value: String(score.unanswered),
      icon: HelpCircle,
      className: 'bg-slate-500/10 text-slate-500',
    },
    {
      label: 'Tiempo usado',
      value: formatClock(timeSpentSeconds),
      icon: Clock,
      className: 'bg-navy/10 text-navy dark:bg-white/10 dark:text-slate-200',
    },
  ];

  return (
    <motion.main
      className="w-full space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <header className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card dark:border-slate-700/60 dark:bg-navy-light sm:p-8">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald">
              Simulacro completado
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-navy dark:text-slate-50">
              {exam.title}
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Obtuviste {score.correct} {score.correct === 1 ? 'acierto' : 'aciertos'} de{' '}
              {score.total} reactivos.
            </p>
          </div>
          <div className="flex items-center gap-5">
            <div>
              <p className="text-center text-5xl font-extrabold tracking-tight text-emerald">
                {score.percentage}%
              </p>
              <p className="mt-1 text-center text-[11px] font-medium text-slate-400 dark:text-slate-500">
                puntaje obtenido
              </p>
            </div>
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${level.className}`}
            >
              {level.label}
            </span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map((stat) => {
            const StatIcon = stat.icon;
            return (
              <div
                key={stat.label}
                className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-surface px-4 py-3 dark:border-slate-700/60 dark:bg-navy-dark"
              >
                <span
                  className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${stat.className}`}
                >
                  <StatIcon className="size-4" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                    {stat.label}
                  </p>
                  <p className="text-lg font-bold text-navy dark:text-slate-100">
                    {stat.value}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {score.breakdown.length > 0 ? (
          <div className="mt-6">
            <h2 className="text-sm font-semibold text-navy dark:text-slate-200">
              Desempeño por área
            </h2>
            <div className="mt-3 space-y-3">
              {score.breakdown.map((item) => {
                const area = getExamAreaByLabel(item.category);
                const percentage =
                  item.total === 0 ? 0 : Math.round((item.correct / item.total) * 100);
                return (
                  <div key={item.category} className="flex items-center gap-3">
                    <span className="w-44 shrink-0 truncate text-xs font-medium text-slate-600 dark:text-slate-300">
                      {item.category}
                    </span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${area?.gradient ?? 'from-slate-400 to-slate-500'}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="w-16 shrink-0 text-right text-xs font-bold text-navy dark:text-slate-100">
                      {item.correct}/{item.total}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}

        <div className="mt-8 flex flex-wrap gap-3">
          <motion.button
            type="button"
            onClick={session.start}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald to-emerald/90 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-navy-light"
          >
            <RotateCcw className="size-4" aria-hidden="true" />
            Intentar de nuevo
          </motion.button>
          <motion.button
            type="button"
            onClick={() => navigate('/examenes')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-navy transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald focus-visible:ring-offset-2 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-navy"
          >
            <Undo2 className="size-4" aria-hidden="true" />
            Volver a exámenes
          </motion.button>
        </div>
      </header>

      <ExamFeedbackSummary examTitle={exam.title} score={score} />

      <StudyPlanCard score={score} />

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card dark:border-slate-700/60 dark:bg-navy-light">
        <h2 className="text-base font-semibold text-navy dark:text-slate-100">
          Revisión de reactivos
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Expande cada reactivo para ver la respuesta correcta y la retroalimentación.
        </p>

        <div className="mt-5 space-y-3">
          {session.questions.map((question, index) => {
            const userAnswer = session.answers[question.id];
            const isCorrect = userAnswer === question.correctIndex;
            const isExpanded = expandedId === question.id;

            return (
              <div
                key={question.id}
                className={`rounded-2xl border transition-colors ${
                  isExpanded
                    ? 'border-emerald/30 bg-emerald/5'
                    : 'border-slate-200 bg-surface dark:border-slate-700 dark:bg-navy-dark'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setExpandedId(isExpanded ? null : question.id)}
                  aria-expanded={isExpanded}
                  className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-emerald"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    {isCorrect ? (
                      <CheckCircle2 className="size-5 shrink-0 text-emerald" aria-hidden="true" />
                    ) : (
                      <XCircle
                        className="size-5 shrink-0 text-rose-500"
                        aria-hidden="true"
                      />
                    )}
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-navy dark:text-slate-100">
                        {index + 1}. {question.category}
                      </p>
                      <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                        Tu respuesta:{' '}
                        {userAnswer !== undefined
                          ? `${optionLetter(userAnswer)}. ${question.options[userAnswer] ?? ''}`
                          : 'Sin responder'}
                      </p>
                    </div>
                  </div>
                  <ChevronDown
                    className={`size-4 shrink-0 text-slate-400 transition-transform duration-200 ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                    aria-hidden="true"
                  />
                </button>

                {isExpanded ? (
                  <div className="border-t border-slate-200 p-4 dark:border-slate-700">
                    <p className="text-sm font-medium leading-relaxed text-navy dark:text-slate-100">
                      {question.text}
                    </p>
                    <div className="mt-3 space-y-2">
                      {question.options.map((option, optionIndex) => {
                        const isCorrectOption = optionIndex === question.correctIndex;
                        const isUserPick = optionIndex === userAnswer;
                        return (
                          <div
                            key={option}
                            className={`flex items-start gap-2 rounded-xl border px-3 py-2 text-sm ${
                              isCorrectOption
                                ? 'border-emerald/40 bg-emerald/10 text-navy dark:text-slate-100'
                                : isUserPick
                                  ? 'border-rose-200 bg-rose-50 text-rose-600 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-400'
                                  : 'border-slate-200 bg-white text-slate-600 dark:border-slate-700 dark:bg-navy-light dark:text-slate-300'
                            }`}
                          >
                            <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md text-[11px] font-bold">
                              {optionLetter(optionIndex)}
                            </span>
                            <span className="flex-1 leading-relaxed">{option}</span>
                            {isCorrectOption ? (
                              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald" aria-hidden="true" />
                            ) : isUserPick ? (
                              <XCircle className="mt-0.5 size-4 shrink-0 text-rose-500" aria-hidden="true" />
                            ) : null}
                          </div>
                        );
                      })}
                    </div>
                    <QuestionFeedback
                      topic={question.category}
                      question={question.text}
                      options={question.options}
                      userAnswerIndex={userAnswer}
                      correctIndex={question.correctIndex}
                      staticFeedback={question.feedback}
                      apiKey={apiKey}
                    />
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </section>
    </motion.main>
  );
}
