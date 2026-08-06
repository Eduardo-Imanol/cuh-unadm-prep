import { motion } from 'framer-motion';
import { ArrowLeft, Clock, FileQuestion, Hammer } from 'lucide-react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { ExamIntroScreen } from '@/components/exam/ExamIntroScreen';
import { ExamResults } from '@/components/exam/ExamResults';
import { ExamRunner } from '@/components/exam/ExamRunner';
import { ExamCoverage } from '@/components/exams/ExamCoverage';
import { EXAM_DIFFICULTY, formatExamDuration, getExamMeta, getExamQuestions, type ExamMeta } from '@/data/exams';
import { useExamSession } from '@/hooks/useExamSession';

function ExamConstructionNotice({ exam }: { exam: ExamMeta }) {
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

      <section className="rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-transparent p-6 shadow-card">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-600 ring-1 ring-amber-500/30 dark:text-amber-400">
            <Hammer className="size-6" aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-base font-semibold text-navy dark:text-slate-100">
              Examen en mantenimiento
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              Este simulacro está siendo preparado y estará disponible próximamente.
              Mientras tanto, completa los exámenes disponibles para medir tu avance, o revisa tu
              progreso en el dashboard.
            </p>
          </div>
        </div>
      </section>
    </motion.main>
  );
}

function ExamSessionContent({ exam }: { exam: ExamMeta }) {
  const session = useExamSession(exam);

  if (session.status === 'running') {
    return <ExamRunner exam={exam} session={session} />;
  }
  if (session.status === 'finished') {
    return <ExamResults exam={exam} session={session} />;
  }
  return <ExamIntroScreen exam={exam} session={session} />;
}

export default function ExamSession() {
  const { examId } = useParams();
  const exam = examId ? getExamMeta(examId) : undefined;

  if (!exam) {
    return <Navigate to="/examenes" replace />;
  }

  const hasQuestions = getExamQuestions(exam.id).length > 0;

  if (!hasQuestions) {
    return <ExamConstructionNotice exam={exam} />;
  }

  return <ExamSessionContent key={exam.id} exam={exam} />;
}
