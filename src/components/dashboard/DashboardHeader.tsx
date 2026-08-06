import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { DashboardMetricsData } from '@/hooks/useDashboardData';

interface DashboardHeaderProps {
  data: DashboardMetricsData;
}

export function DashboardHeader({ data }: DashboardHeaderProps) {
  const { userName, hasAIKey } = data;
  const navigate = useNavigate();

  return (
    <motion.header
      className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald to-emerald/60 shadow-lg"
        >
          <span className="text-xl font-bold text-white">
            {userName.charAt(0).toUpperCase()}
          </span>
        </motion.div>
        <div>
          <h1 className="text-2xl font-extrabold text-navy dark:text-slate-100">
            ¡Hola, {userName}!
          </h1>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
            Continúa tu preparación para el examen CUH 2026.
          </p>
        </div>
      </div>

      <motion.button
        type="button"
        onClick={() => navigate('/config-ia')}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald to-emerald/90 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald/30 transition-shadow hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald focus-visible:ring-offset-2 focus-visible:ring-offset-surface sm:mt-0"
      >
        {hasAIKey ? (
          <Sparkles className="size-4 text-emerald-300" aria-hidden="true" />
        ) : null}
        Configurar IA
      </motion.button>
    </motion.header>
  );
}
