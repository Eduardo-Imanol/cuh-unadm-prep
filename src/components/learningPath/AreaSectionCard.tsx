import { motion } from 'framer-motion';
import { EXAM_AREAS } from '@/data/exams';
import { getSyllabusLeavesByArea, type SyllabusAreaGroup } from '@/data/syllabus';
import { MasteryCheckbox } from '@/components/learningPath/MasteryCheckbox';

interface AreaSectionCardProps {
  group: SyllabusAreaGroup;
  masteredIds: Set<string>;
  onToggle: (id: string, area: string) => void;
}

export function AreaSectionCard({ group, masteredIds, onToggle }: AreaSectionCardProps) {
  const area = EXAM_AREAS.find((item) => item.id === group.area);
  if (area === undefined) {
    return null;
  }
  const leaves = getSyllabusLeavesByArea(group.area);
  const masteredCount = leaves.filter((leaf) => masteredIds.has(leaf.id)).length;
  const percentage = leaves.length === 0 ? 0 : Math.round((masteredCount / leaves.length) * 100);
  const AreaIcon = area.icon;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card dark:border-slate-700/60 dark:bg-navy-light"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span
            className={`flex size-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${area.gradient}`}
          >
            <AreaIcon className="size-5 text-white" aria-hidden="true" />
          </span>
          <div>
            <h3 className="text-base font-bold tracking-tight text-navy dark:text-slate-100">
              {area.label}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {masteredCount}/{leaves.length} temas dominados
            </p>
          </div>
        </div>
        <span className="text-sm font-bold text-emerald">{percentage}%</span>
      </div>

      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
        <div
          className="h-full rounded-full bg-gradient-to-r from-emerald to-emerald/80 transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="mt-6 space-y-6">
        {group.sections.map((section) => (
          <div key={section.id}>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
              {section.title}
            </h4>
            {section.note ? (
              <p className="mt-1 text-xs italic text-slate-500 dark:text-slate-400">{section.note}</p>
            ) : null}
            <div className="mt-3 space-y-4">
              {section.topics.map((topic) => (
                <div key={topic.id}>
                  <p className="mb-2 text-sm font-semibold text-navy dark:text-slate-200">
                    {topic.title}
                  </p>
                  <ul className="space-y-1.5">
                    {topic.items.map((item, index) => {
                      const itemId = `${topic.id}-${index + 1}`;
                      return (
                        <li key={itemId}>
                          <MasteryCheckbox
                            id={itemId}
                            label={item}
                            mastered={masteredIds.has(itemId)}
                            onToggle={() => onToggle(itemId, group.area)}
                          />
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.section>
  );
}
