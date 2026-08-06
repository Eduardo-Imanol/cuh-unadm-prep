import { motion } from 'framer-motion';
import { BookOpen, CheckCircle2, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatExamDuration } from '@/data/exams';
import type { SimulatorMetric } from '@/hooks/useDashboardData';

interface NextStepCardProps {
  simulator: SimulatorMetric;
}

export function NextStepCard({ simulator }: NextStepCardProps) {
  const navigate = useNavigate();
  const nextExam = simulator.pendingExams[0];
  const completedLabel = `${simulator.attemptedExams}/${simulator.totalExams} exámenes completados`;

  return (
    <motion.div
      className="relative isolate overflow-hidden rounded-3xl border border-emerald/20 bg-gradient-to-br from-navy via-navy-light to-emerald/5 p-px shadow-xl shadow-slate-900/5"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <div className="relative h-full rounded-3xl bg-gradient-to-br from-navy via-navy-light to-navy/95 p-6 md:p-8">
        <div className="mb-5 flex items-center gap-4">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-emerald/15 ring-1 ring-emerald/20">
            <BookOpen className="size-7 text-emerald" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald/80">
              Tu próxima meta
            </p>
            <h3 className="mt-1 text-xl font-bold text-white">Tu Siguiente Paso</h3>
          </div>
        </div>

        {nextExam ? (
          <>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-emerald/80">
              Siguiente simulacro pendiente
            </p>
            <h4 className="text-lg font-bold leading-snug text-white">{nextExam.title}</h4>
            <p className="mb-4 mt-2 max-w-md text-sm leading-relaxed text-slate-300">
              {nextExam.description}
            </p>
            <div className="mb-5 flex flex-wrap gap-2 text-xs font-medium text-slate-300">
              <span className="rounded-full bg-white/10 px-3 py-1">
                {formatExamDuration(nextExam.durationMinutes)}
              </span>
              <span className="rounded-full bg-white/10 px-3 py-1">
                {nextExam.questionCount} reactivos
              </span>
              <span className="rounded-full bg-white/10 px-3 py-1 capitalize">
                Dificultad {nextExam.difficulty}
              </span>
            </div>
          </>
        ) : (
          <>
            <p className="mb-4 max-w-md text-sm leading-relaxed text-slate-300">
              ¡Completaste todos los simulacros disponibles! Tu constancia te acerca a la
              admisión. Repite alguno para subir tu puntaje promedio.
            </p>
          </>
        )}

        <div className="flex gap-3">
          <motion.button
            type="button"
            onClick={() => navigate(nextExam ? `examenes/${nextExam.id}` : 'examenes')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald to-emerald/90 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald/30 transition-shadow hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
          >
            <Play className="size-4" aria-hidden="true" />
            {nextExam ? 'Iniciar Examen' : 'Volver a practicar'}
          </motion.button>
        </div>

        <p className="mt-5 inline-flex items-center gap-1.5 text-xs text-slate-400">
          <CheckCircle2 className="size-3.5 text-emerald" aria-hidden="true" />
          {completedLabel}
        </p>

        <div
          aria-hidden="true"
          className="absolute -bottom-24 -right-24 size-72 rounded-full bg-gradient-to-bl from-emerald/20 via-transparent to-transparent blur-3xl"
        />
      </div>
    </motion.div>
  );
}
