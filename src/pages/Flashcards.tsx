import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Layers,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { getFlashcardCategories, getFlashcardEntries } from '@/data/flashcards';
import { useAIChatStore } from '@/store/aiChatStore';

const ALL_CATEGORY = 'Todas';

export default function Flashcards() {
  const entries = useMemo(() => getFlashcardEntries(), []);
  const categories = useMemo(() => getFlashcardCategories(), []);

  const [category, setCategory] = useState(ALL_CATEGORY);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [reviewedCount, setReviewedCount] = useState(0);
  const [finished, setFinished] = useState(false);

  const filtered = useMemo(
    () =>
      category === ALL_CATEGORY
        ? entries
        : entries.filter((card) => card.category === category),
    [entries, category],
  );

  const total = filtered.length;
  const current = filtered[index];

  const setContextDetail = useAIChatStore((state) => state.setContextDetail);

  useEffect(() => {
    if (current === undefined) {
      setContextDetail(null);
      return;
    }
    setContextDetail(
      `Flashcard en pantalla "${current.question}" (categoría ${current.category}). El estudiante puede preguntarte sobre este concepto o pedirte que se lo expliques con más detalle.`,
    );
    return () => setContextDetail(null);
  }, [current, setContextDetail]);

  const selectCategory = (next: string) => {
    setCategory(next);
    setIndex(0);
    setFlipped(false);
    setFinished(false);
  };

  const goTo = (nextIndex: number) => {
    setIndex(Math.min(Math.max(nextIndex, 0), Math.max(total - 1, 0)));
    setFlipped(false);
  };

  const mark = (known: boolean) => {
    if (known) {
      setReviewedCount((count) => count + 1);
    }
    if (index >= total - 1) {
      setFinished(true);
      return;
    }
    goTo(index + 1);
  };

  const restart = () => {
    setIndex(0);
    setFlipped(false);
    setReviewedCount(0);
    setFinished(false);
  };

  return (
    <motion.main
      className="w-full space-y-8"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
      }}
    >
      <motion.header variants={{ hidden: { opacity: 0, y: -16 }, visible: { opacity: 1, y: 0 } }}>
        <p className="text-xs font-semibold uppercase tracking-wider text-emerald">
          Repaso rápido · CUH UnADM 2026
        </p>
        <div className="mt-1 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-navy dark:text-slate-50">
              Flashcards
            </h1>
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              Refuerza los conceptos clave del examen con tarjetas construidas desde los simulacros
              disponibles. Voltea cada tarjeta, repasa y avanza a tu ritmo.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 dark:border-slate-700 dark:text-slate-300">
              <Layers className="size-3.5 text-emerald" aria-hidden="true" />
              {total} tarjetas
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 dark:border-slate-700 dark:text-slate-300">
              <Sparkles className="size-3.5 text-emerald" aria-hidden="true" />
              {categories.length} materias
            </span>
          </div>
        </div>
      </motion.header>

      <motion.section variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => selectCategory(ALL_CATEGORY)}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald focus-visible:ring-offset-2 focus-visible:ring-offset-surface dark:focus-visible:ring-offset-navy-dark ${
              category === ALL_CATEGORY
                ? 'bg-emerald text-white shadow-lg shadow-emerald/30'
                : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-navy-light dark:text-slate-300 dark:hover:bg-navy'
            }`}
          >
            Todas
          </button>
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => selectCategory(item)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald focus-visible:ring-offset-2 focus-visible:ring-offset-surface dark:focus-visible:ring-offset-navy-dark ${
                category === item
                  ? 'bg-emerald text-white shadow-lg shadow-emerald/30'
                  : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-navy-light dark:text-slate-300 dark:hover:bg-navy'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </motion.section>

      {current === undefined ? (
        <motion.section
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
          className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-card dark:border-slate-700/60 dark:bg-navy-light"
        >
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No hay tarjetas disponibles para esta materia.
          </p>
        </motion.section>
      ) : finished ? (
        <motion.section
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
          className="rounded-3xl border border-emerald/20 bg-white p-12 text-center shadow-card dark:border-slate-700/60 dark:bg-navy-light"
        >
          <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald to-emerald/70 shadow-lg">
            <CheckCircle2 className="size-8 text-white" aria-hidden="true" />
          </div>
          <h2 className="mt-5 text-lg font-semibold text-navy dark:text-slate-100">
            ¡Deck completado!
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Repasaste {total} tarjetas y dominaste {reviewedCount} de ellas. Repite el deck para
            consolidar lo aprendido.
          </p>
          <button
            type="button"
            onClick={restart}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald to-emerald/90 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald/30 transition-shadow hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald focus-visible:ring-offset-2 focus-visible:ring-offset-surface dark:focus-visible:ring-offset-navy-dark"
          >
            <RotateCcw className="size-4" aria-hidden="true" />
            Repasar de nuevo
          </button>
        </motion.section>
      ) : (
        <>
          <motion.section variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
            <div className="relative h-[340px] w-full [perspective:1200px]">
              <motion.div
                className="relative size-full cursor-pointer"
                style={{ transformStyle: 'preserve-3d' }}
                animate={{ rotateY: flipped ? 180 : 0 }}
                transition={{ duration: 0.45 }}
                onClick={() => setFlipped((value) => !value)}
                role="button"
                aria-label="Voltear tarjeta"
              >
                <div
                  className="absolute inset-0 flex flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5 [backface-visibility:hidden] dark:border-slate-700/60 dark:bg-navy-light sm:p-8"
                >
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-emerald to-emerald/80 px-3 py-1 text-xs font-bold uppercase tracking-tight text-white shadow-md">
                      <Layers className="size-3" aria-hidden="true" />
                      {current.category}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">
                      Pregunta · {index + 1} de {total}
                    </span>
                  </div>
                  <p className="mt-6 flex-1 text-center text-lg font-semibold leading-relaxed text-navy dark:text-slate-100 sm:text-xl">
                    {current.question}
                  </p>
                  <p className="mt-4 text-center text-xs font-semibold uppercase tracking-wide text-emerald">
                    Toca la tarjeta para ver la respuesta
                  </p>
                </div>

                <div
                  className="absolute inset-0 flex flex-col overflow-hidden rounded-3xl bg-gradient-to-br from-navy via-navy-light to-navy/95 p-6 shadow-xl shadow-navy/20 [backface-visibility:hidden] [transform:rotateY(180deg)] sm:p-8"
                >
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-navy to-navy-light px-3 py-1 text-xs font-bold uppercase tracking-tight text-emerald ring-1 ring-emerald/30">
                      Respuesta
                    </span>
                    <span className="text-xs font-semibold text-slate-400">
                      {current.source === 'examen-2'
                        ? 'Examen 2'
                        : current.source === 'examen-3'
                          ? 'Examen 3'
                          : 'Examen 4'}
                    </span>
                  </div>
                  <p className="mt-6 flex-1 overflow-y-auto text-center text-base font-medium leading-relaxed text-slate-100 sm:text-lg">
                    {current.answer}
                  </p>
                  <p className="mt-4 text-center text-xs font-semibold uppercase tracking-wide text-emerald/80">
                    Toca para volver a la pregunta
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.section>

          <motion.section
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
            className="flex flex-wrap items-center justify-center gap-3"
          >
            <button
              type="button"
              onClick={() => goTo(index - 1)}
              disabled={index === 0}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-navy dark:focus-visible:ring-offset-navy-dark"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              Anterior
            </button>

            <span className="rounded-xl bg-emerald/10 px-4 py-2.5 text-sm font-bold text-emerald">
              {index + 1} / {total}
            </span>

            <button
              type="button"
              onClick={() => goTo(index + 1)}
              disabled={index >= total - 1}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-navy dark:focus-visible:ring-offset-navy-dark"
            >
              Siguiente
              <ArrowRight className="size-4" aria-hidden="true" />
            </button>
          </motion.section>

          <motion.section
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
            className="grid grid-cols-1 gap-3 sm:grid-cols-2"
          >
            <button
              type="button"
              onClick={() => mark(false)}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-300 px-5 py-3 text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 focus-visible:ring-offset-surface dark:border-rose-500/40 dark:text-rose-400 dark:hover:bg-rose-500/10 dark:focus-visible:ring-offset-navy-dark"
            >
              <RotateCcw className="size-4" aria-hidden="true" />
              Aún no la sabía
            </button>
            <button
              type="button"
              onClick={() => mark(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald to-emerald/90 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald/30 transition-shadow hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald focus-visible:ring-offset-2 focus-visible:ring-offset-surface dark:focus-visible:ring-offset-navy-dark"
            >
              <CheckCircle2 className="size-4" aria-hidden="true" />
              Ya la sabía
            </button>
          </motion.section>
        </>
      )}
    </motion.main>
  );
}
