import { motion } from 'framer-motion';
import { STAGES, STAGE_LABELS, STAGE_ICONS } from '../context/JourneyContext';

export default function Timeline({ currentStage, exploredStages, startingStage }) {
  const getStatus = (stage) => {
    const stageIndex = STAGES.indexOf(stage);
    const startIndex = STAGES.indexOf(startingStage);
    const currentIndex = STAGES.indexOf(currentStage);

    if (stageIndex < startIndex) return 'skipped';
    if (stage === currentStage) return 'current';
    if (exploredStages?.includes(stage) && stageIndex < currentIndex) return 'completed';
    return 'upcoming';
  };

  const statusStyles = {
    skipped: 'opacity-30',
    completed: 'border-green-500/50 bg-green-500/10',
    current: 'border-purple-500 bg-purple-500/10 ring-2 ring-purple-500/30',
    upcoming: 'border-gray-700 opacity-50',
  };

  const statusIcons = {
    skipped: '—',
    completed: '✓',
    current: '●',
    upcoming: '○',
  };

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Timeline</h3>
      {STAGES.map((stage, i) => {
        const status = getStatus(stage);
        return (
          <motion.div
            key={stage}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: i * 0.05 }}
            className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all ${statusStyles[status]}`}
          >
            <span className="text-lg">{STAGE_ICONS[stage]}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{STAGE_LABELS[stage]}</p>
              <p className="text-xs text-gray-500">
                {status === 'skipped' ? 'Not Explored' :
                 status === 'completed' ? 'Completed' :
                 status === 'current' ? 'In Progress' : 'Upcoming'}
              </p>
            </div>
            {status === 'current' && (
              <motion.span
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-purple-400 text-xs"
              >
                {statusIcons[status]}
              </motion.span>
            )}
            {status === 'completed' && (
              <span className="text-green-400 text-sm">{statusIcons[status]}</span>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}