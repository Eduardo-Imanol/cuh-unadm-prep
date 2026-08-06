import { motion } from 'framer-motion';
import { ClipboardCheck } from 'lucide-react';

export function ExamsHeader() {
  return (
    <motion.header
      className="flex flex-wrap items-center justify-between gap-4"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-navy to-navy-light shadow-lg shadow-navy/25 ring-1 ring-navy/10 dark:ring-white/10"
        >
          <ClipboardCheck className="size-7 text-emerald" aria-hidden="true" />
        </motion.div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald">Práctica</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-navy dark:text-slate-50">
            Simulador de exámenes
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Exámenes completos para medir tu avance en todas las áreas del CUH.
          </p>
        </div>
      </div>
    </motion.header>
  );
}
