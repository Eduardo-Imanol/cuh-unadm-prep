import { motion } from 'framer-motion';
import { BookOpenCheck, ClipboardList, TrendingUp } from 'lucide-react';

interface ExamStatsSummaryProps {
  totalExams: number;
  attemptedExams: number;
  totalAttempts: number;
  averageBestScore: number | undefined;
}

interface SummaryCardData {
  label: string;
  value: string;
  detail: string;
  icon: typeof BookOpenCheck;
  accentClass: string;
}

export function ExamStatsSummary({
  totalExams,
  attemptedExams,
  totalAttempts,
  averageBestScore,
}: ExamStatsSummaryProps) {
  const cards: SummaryCardData[] = [
    {
      label: 'Exámenes disponibles',
      value: String(totalExams),
      detail: `${attemptedExams} de ${totalExams} iniciados`,
      icon: BookOpenCheck,
      accentClass: 'bg-emerald/10 text-emerald',
    },
    {
      label: 'Intentos realizados',
      value: String(totalAttempts),
      detail:
        totalAttempts === 1
          ? 'simulacro completado'
          : `${totalAttempts} simulacros completados`,
      icon: ClipboardList,
      accentClass: 'bg-navy/10 text-navy dark:bg-white/10 dark:text-slate-200',
    },
    {
      label: 'Mejor puntaje promedio',
      value: averageBestScore === undefined ? '—' : `${averageBestScore}%`,
      detail:
        averageBestScore === undefined
          ? 'sin intentos aún'
          : 'en tus mejores simulacros',
      icon: TrendingUp,
      accentClass: 'bg-emerald/10 text-emerald',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {cards.map((card, index) => {
        const CardIcon = card.icon;
        return (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 + index * 0.08 }}
            className="flex items-center gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-card dark:border-slate-700/60 dark:bg-navy-light"
          >
            <span
              className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${card.accentClass}`}
            >
              <CardIcon className="size-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {card.label}
              </p>
              <p className="mt-0.5 text-2xl font-extrabold tracking-tight text-navy dark:text-slate-50">
                {card.value}
              </p>
              <p className="truncate text-[11px] text-slate-400 dark:text-slate-500">
                {card.detail}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
