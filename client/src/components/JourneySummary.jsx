import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useJourney, STAGE_LABELS, STAGE_ICONS } from '../context/JourneyContext';

export default function JourneySummary() {
  const { decisions, startingStage } = useJourney();

  return (
    <div className="min-h-[calc(100vh-60px)] px-4 py-10 max-w-3xl mx-auto">
      <motion.h2 initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
        Your Life Journey
      </motion.h2>
      <p className="text-gray-500 text-center mb-10">Every choice that shaped your story</p>

      <div className="space-y-4">
        {decisions.map((d, i) => (
          <motion.div key={i}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: i * 0.05 }}
            className="bg-gray-900/80 border border-gray-800 rounded-xl p-5 flex gap-4"
          >
            <div className="text-3xl shrink-0">{STAGE_ICONS[d.stage] || '📍'}</div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full">
                  {STAGE_LABELS[d.stage]}
                </span>
                <span className="text-xs text-gray-600">Decision #{i + 1}</span>
              </div>
              <p className="text-white font-medium">{d.choiceText}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {Object.entries(d.effects || {}).map(([key, val]) => {
                  if (val === 0) return null;
                  return (
                    <span key={key} className={'text-xs px-2 py-0.5 rounded-full ' +
                      (val > 0 ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400')}>
                      {key}: {val > 0 ? '+' : ''}{val}
                    </span>
                  );
                })}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {decisions.length === 0 && (
        <p className="text-gray-500 text-center py-20">No decisions recorded yet.</p>
      )}

      <div className="flex gap-4 justify-center mt-10">
        <Link to="/report" className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl font-semibold transition-all">
          View Full Report
        </Link>
        <Link to="/analysis" className="px-8 py-3 border border-gray-700 rounded-xl font-semibold transition-all">
          ← Back to Analysis
        </Link>
      </div>
    </div>
  );
}