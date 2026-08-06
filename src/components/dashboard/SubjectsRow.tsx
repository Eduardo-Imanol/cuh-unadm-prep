import { motion } from 'framer-motion';
import { SubjectCard } from '@/components/dashboard/SubjectCard';
import type { DashboardMetricsData } from '@/hooks/useDashboardData';

interface SubjectsRowProps {
  data: DashboardMetricsData;
}

export function SubjectsRow({ data }: SubjectsRowProps) {
  const { subjects } = data;

  return (
    <motion.section
      className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.15, delayChildren: 0.2 },
        },
      }}
    >
      {subjects.map((subject) => (
        <motion.div key={subject.id} variants={{ visible: { opacity: 1, y: 0 }, hidden: { opacity: 0, y: 20 } }}>
          <SubjectCard subject={subject} />
        </motion.div>
      ))}
    </motion.section>
  );
}
