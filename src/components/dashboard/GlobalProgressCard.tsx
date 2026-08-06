import { motion } from 'framer-motion';
import { BarChart3, Layers } from 'lucide-react';
import { MetricCard } from '@/components/dashboard/MetricCard';
import type { DashboardMetricsData } from '@/hooks/useDashboardData';
import { ProgressBar } from '@/components/dashboard/ProgressBar';

interface GlobalProgressCardProps {
  data: DashboardMetricsData;
}

export function GlobalProgressCard({ data }: GlobalProgressCardProps) {
  const { globalProgress, completedModules, totalModules } = data;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <MetricCard
        title="Avance Global"
        icon={BarChart3}
        layout="side-by-side"
        badge={
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald/20 bg-emerald/10 px-3 py-1 text-xs font-semibold text-emerald">
            <Layers className="size-3" aria-hidden="true" />
            {completedModules}/{totalModules} módulos
          </span>
        }
      >
        <div className="flex-1">
          <ProgressBar value={globalProgress} />
        </div>
      </MetricCard>
    </motion.div>
  );
}
