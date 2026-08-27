import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useJourney, STAGES, STAGE_LABELS, STAGE_ICONS } from '../context/JourneyContext';

const STAGE_DESCRIPTIONS = {
  childhood: 'Begin from the earliest years. Experience school activities, friendships, and first choices.',
  school: 'Start from your school years. Face academic and social challenges.',
  college: 'Jump into higher education. Choose your major, internships, and social circles.',
  career: 'Begin your professional life. Navigate job offers, risks, and work-life balance.',
  family: 'Start from adult life. Handle relationships, parenting, and big financial decisions.',
  retirement: 'Experience your golden years. Focus on legacy, health, and fulfillment.',
};

export default function StageSelection() {
  const navigate = useNavigate();
  const { setStartingStage } = useJourney();

  const handleSelect = (stage) => {
    setStartingStage(stage);
    navigate('/play');
  };

  return (
    <div className="min-h-[calc(100vh-60px)] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-4xl">
        <motion.h2
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-3xl md:text-4xl font-bold text-center mb-3 bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent"
        >
          Where Are You in Your Life?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-500 text-center mb-10"
        >
          Choose where your journey begins
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {STAGES.map((stage, i) => (
            <motion.button
              key={stage}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.03, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelect(stage)}
              className="bg-gray-900/80 border border-gray-800 hover:border-purple-500/50 rounded-2xl p-6 text-left transition-all group"
            >
              <span className="text-4xl block mb-3">{STAGE_ICONS[stage]}</span>
              <h3 className="text-lg font-semibold text-white group-hover:text-purple-400 transition">
                {STAGE_LABELS[stage]}
              </h3>
              <p className="text-sm text-gray-500 mt-2">{STAGE_DESCRIPTIONS[stage]}</p>
            </motion.button>
          ))}
        </div>

        {/* Explore Full Journey — highlighted */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-6"
        >
          <button
            onClick={() => handleSelect('childhood')}
            className="w-full bg-gradient-to-r from-purple-900/50 to-indigo-900/50 border border-purple-500/30 hover:border-purple-500 rounded-2xl p-6 text-center transition-all group"
          >
            <span className="text-4xl block mb-2">🌟</span>
            <h3 className="text-xl font-bold text-purple-400">Explore Full Journey</h3>
            <p className="text-sm text-gray-400 mt-1">Experience every life stage from childhood to retirement</p>
          </button>
        </motion.div>
      </div>
    </div>
  );
}