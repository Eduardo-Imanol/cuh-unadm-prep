import { Bot, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  buildStaticQuestionFeedback,
  getQuestionFeedback,
  type AIQuestionFeedbackResult,
} from '@/services/aiService';

interface QuestionFeedbackProps {
  topic: string;
  question: string;
  options: string[];
  userAnswerIndex: number | undefined;
  correctIndex: number;
  staticFeedback: string | undefined;
  apiKey: string;
}

const cache = new Map<string, AIQuestionFeedbackResult>();

export function QuestionFeedback({
  topic,
  question,
  options,
  userAnswerIndex,
  correctIndex,
  staticFeedback,
  apiKey,
}: QuestionFeedbackProps) {
  const cacheKey = `${topic}:${question}`;
  const hasKey = apiKey.trim().length > 0;

  const [result, setResult] = useState<AIQuestionFeedbackResult | undefined>(() =>
    hasKey ? cache.get(cacheKey) : undefined,
  );
  const [isLoading, setIsLoading] = useState<boolean>(hasKey && !cache.has(cacheKey));

  useEffect(() => {
    if (!hasKey || result !== undefined) {
      return;
    }

    const cached = cache.get(cacheKey);
    if (cached) {
      setResult(cached);
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    void getQuestionFeedback(
      { topic, question, options, userAnswerIndex, correctIndex },
      apiKey,
      staticFeedback,
    ).then((value) => {
      if (cancelled) {
        return;
      }
      cache.set(cacheKey, value);
      setResult(value);
      setIsLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [apiKey, cacheKey, correctIndex, hasKey, options, question, result, staticFeedback, topic, userAnswerIndex]);

  if (hasKey && isLoading && result === undefined) {
    return (
      <div className="mt-4 animate-pulse rounded-xl border border-emerald/20 bg-emerald/5 px-3 py-2.5">
        <div className="h-3 w-3/4 rounded bg-slate-200 dark:bg-slate-600" />
        <div className="mt-2 h-3 w-1/2 rounded bg-slate-200 dark:bg-slate-600" />
      </div>
    );
  }

  const explanation =
    result?.explanation ??
    buildStaticQuestionFeedback(staticFeedback).explanation;
  const usedFallback = result?.usedFallback ?? !hasKey;

  return (
    <div className="mt-4 rounded-xl border border-emerald/20 bg-emerald/5 px-3 py-2.5">
      <div className="flex items-center gap-2">
        {usedFallback ? (
          <Bot className="size-4 shrink-0 text-emerald" aria-hidden="true" />
        ) : (
          <Sparkles className="size-4 shrink-0 text-emerald" aria-hidden="true" />
        )}
        <p className="text-xs font-semibold uppercase tracking-wide text-emerald">
          {usedFallback ? 'Retroalimentación de la guía' : 'Retroalimentación IA'}
        </p>
      </div>
      <p className="mt-1.5 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
        {explanation}
      </p>
    </div>
  );
}
