import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useJourney, STAGES } from '../context/JourneyContext';
import StoryEngine from '../engine/StoryEngine';

export default function ConsequenceScene() {
  const navigate = useNavigate();
  const {
    lastChoice, currentStage, scenarioCount,
    advanceStage, scores
  } = useJourney();

  if (!lastChoice) {
    navigate('/play');
    return null;
  }

  const scenariosPerStage = StoryEngine.getScenariosPerStage();
  const isStageComplete = scenarioCount >= scenariosPerStage;
  const isLastStage = StoryEngine.isLastStage(currentStage);
  const isJourneyComplete = isStageComplete && isLastStage;

  const handleContinue = () => {
    if (isJourneyComplete) {
      const audio = new Audio('/assets/audio/success.wav');
      audio.play().catch(e => console.log('Audio play failed:', e));
      navigate('/analysis');
    } else if (isStageComplete) {
      // Instead of advancing immediately, go to transition screen
      navigate('/transition');
    } else {
      const audio = new Audio('/assets/audio/click.wav');
      audio.play().catch(e => console.log('Audio play failed:', e));
      navigate('/play');
    }
  };

  return (
    <div className="min-h-[calc(100vh-60px)] flex items-center justify-center px-4 py-10">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        {/* Choice made */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="text-5xl mb-4"
          >
            {lastChoice.effects?.happiness > 0 ? '🌟' :
             lastChoice.effects?.career > 0 ? '💼' :
             lastChoice.effects?.health > 0 ? '💪' : '🔮'}
          </motion.div>
          <h2 className="text-2xl font-bold mb-2">Your Choice</h2>
          <p className="text-purple-400 italic">"{lastChoice.text}"</p>
        </div>

        {/* Consequence text */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white/90 shadow-xl shadow-purple-500/5 border border-slate-200 rounded-2xl p-6 mb-8"
        >
          <p className="text-slate-700 text-lg leading-relaxed">{lastChoice.consequence}</p>
        </motion.div>

        {/* Score Changes */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8"
        >
          {Object.entries(lastChoice.effects || {}).map(([key, value]) => {
            if (value === 0) return null;
            return (
              <motion.div
                key={key}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.6 }}
                className={`flex items-center justify-between p-3 rounded-xl border ${
                  value > 0 ? 'border-green-500/30 bg-green-500/5' : 'border-red-500/30 bg-red-500/5'
                }`}
              >
                <span className="text-sm capitalize text-slate-600">{key}</span>
                <span className={`font-bold ${value > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {value > 0 ? '+' : ''}{value}
                </span>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Status message */}
        {isStageComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center mb-6"
          >
            <p className="text-sm text-indigo-400">
              {isJourneyComplete
                ? '🎉 Journey complete! Time for your life analysis.'
                : `✅ ${currentStage} stage complete! Moving to the next stage.`}
            </p>
          </motion.div>
        )}

        {/* Continue button */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-center"
        >
          <button onClick={handleContinue}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-xl text-lg font-semibold transition-all shadow-lg hover:shadow-purple-500/25 text-white">
            {isJourneyComplete ? '📊 View Analysis' :
             isStageComplete ? 'Next Stage →' : 'Continue →'}
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}