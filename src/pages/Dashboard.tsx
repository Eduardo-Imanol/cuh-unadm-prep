import { motion } from 'framer-motion';
import { ClipboardCheck } from 'lucide-react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { NextStepCard } from '@/components/dashboard/NextStepCard';
import { SubjectsRow } from '@/components/dashboard/SubjectsRow';
import { TopMetricsRow } from '@/components/dashboard/TopMetricsRow';
import { useDashboardData } from '@/hooks/useDashboardData';

function DashboardLoading() {
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

export default function Dashboard() {
  const data = useDashboardData();

  if (data.isLoading) {
    return <DashboardLoading />;
  }

  return (
    <motion.main
      className="w-full space-y-8"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.1, delayChildren: 0.2 },
        },
      }}
    >
      <DashboardHeader data={data} />

      <motion.section variants={{ visible: { opacity: 1 }, hidden: { opacity: 0 } }}>
        <TopMetricsRow data={data} />
      </motion.section>

      <motion.section variants={{ visible: { opacity: 1 }, hidden: { opacity: 0 } }} className="space-y-4">
        <h2 className="text-lg font-semibold text-navy dark:text-slate-200">Desglose por materias</h2>
        <SubjectsRow data={data} />
      </motion.section>

      <motion.section variants={{ visible: { opacity: 1 }, hidden: { opacity: 0 } }}>
        <NextStepCard simulator={data.simulator} />
      </motion.section>
    </motion.main>
  );
}
