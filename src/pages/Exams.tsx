import { motion } from 'framer-motion';
import { ClipboardCheck } from 'lucide-react';
import { ExamCard } from '@/components/exams/ExamCard';
import { ExamStatsSummary } from '@/components/exams/ExamStatsSummary';
import { ExamsHeader } from '@/components/exams/ExamsHeader';
import { useExamsData } from '@/hooks/useExamsData';

function ExamsLoading() {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
      >
        <ClipboardCheck className="size-12 text-emerald" aria-hidden="true" />
      </motion.div>
    </div>
  );
}

export default function Exams() {
  const data = useExamsData();

  if (data.isLoading) {
    return <ExamsLoading />;
  }

  return (
    <motion.main
      className="w-full space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <ExamsHeader />

      <ExamStatsSummary
        totalExams={data.totalExams}
        attemptedExams={data.attemptedExams}
        totalAttempts={data.totalAttempts}
        averageBestScore={data.averageBestScore}
      />

      <section className="space-y-5">
        <div className="flex items-end justify-between">
          <h2 className="text-lg font-semibold text-navy dark:text-slate-200">
            Elige tu examen
          </h2>
          <p className="text-xs font-medium text-slate-400 dark:text-slate-500">
            {data.items.length} exámenes · sin límite de intentos
          </p>
        </div>

        <div className="space-y-5">
          {data.items.map((item, index) => (
            <ExamCard
              key={item.meta.id}
              exam={item.meta}
              stats={item.stats}
              index={index}
              mastery={item.mastery}
            />
          ))}
        </div>
      </section>
    </motion.main>
  );
}
