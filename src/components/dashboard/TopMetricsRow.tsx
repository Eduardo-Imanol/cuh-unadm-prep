import { GlobalProgressCard } from '@/components/dashboard/GlobalProgressCard';
import type { DashboardMetricsData } from '@/hooks/useDashboardData';

interface TopMetricsRowProps {
  data: DashboardMetricsData;
}

export function TopMetricsRow({ data }: TopMetricsRowProps) {
  return (
    <section className="grid grid-cols-1">
      <GlobalProgressCard data={data} />
    </section>
  );
}
