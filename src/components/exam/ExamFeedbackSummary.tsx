import { motion } from 'framer-motion';
import { Bot, ListChecks, Lightbulb, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAIStore } from '@/store/aiStore';
import { getFeedback, type AIFeedbackResult } from '@/services/aiService';
import type { ScoreResult } from '@/utils/scoreCalculator';

interface ExamFeedbackSummaryProps {
  examTitle: string;
  score: ScoreResult;
}

export function ExamFeedbackSummary({ examTitle, score }: ExamFeedbackSummaryProps) {
  const apiKey = useAIStore((state) => state.apiKey);
  const hasKey = apiKey.trim().length > 0;
  const [feedback, setFeedback] = useState<AIFeedbackResult | undefined>();

  useEffect(() => {
    let cancelled = false;
    const weakAreas = score.breakdown
      .filter((item) => item.total > 0 && item.correct / item.total < 0.6)
      .map((item) => item.category);

    void getFeedback(
      { topic: examTitle, score: score.correct, total: score.total, weakAreas },
      apiKey,
    ).then((value) => {
      if (!cancelled) {
        setFeedback(value);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [apiKey, examTitle, score]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.4 }}
      className="rounded-3xl border border-emerald/20 bg-gradient-to-br from-emerald/5 via-white to-white p-6 shadow-card dark:from-emerald/10 dark:via-navy-light dark:to-navy-light"
    >
      <div className="flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-2xl bg-emerald/10 text-emerald">
          <Lightbulb className="size-5" aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-base font-semibold text-navy dark:text-slate-100">
            Retroalimentación del simulacro
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Consejos personalizados para tu próxima sesión
          </p>
        </div>
      </div>

      {feedback ? (
        <div className="mt-4 space-y-4">
          <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            {feedback.summary}
          </p>
          {feedback.tips.length > 0 ? (
            <ul className="space-y-2">
              {feedback.tips.map((tip) => (
                <li
                  key={tip}
                  className="flex items-start gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 dark:border-slate-700 dark:bg-navy-dark dark:text-slate-300"
                >
                  <ListChecks className="mt-0.5 size-4 shrink-0 text-emerald" aria-hidden="true" />
                  {tip}
                </li>
              ))}
            </ul>
          ) : null}
          <div className="flex items-center gap-2">
            {feedback.usedFallback || !hasKey ? (
              <Bot className="size-3.5 text-emerald" aria-hidden="true" />
            ) : (
              <Sparkles className="size-3.5 text-emerald" aria-hidden="true" />
            )}
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald">
              {feedback.usedFallback || !hasKey
                ? 'Feedback de la guía local'
                : 'Generado con IA'}
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-4 animate-pulse space-y-2">
          <div className="h-3 w-full rounded bg-slate-200 dark:bg-slate-700" />
          <div className="h-3 w-5/6 rounded bg-slate-200 dark:bg-slate-700" />
          <div className="h-3 w-2/3 rounded bg-slate-200 dark:bg-slate-700" />
        </div>
      )}
    </motion.section>
  );
}
