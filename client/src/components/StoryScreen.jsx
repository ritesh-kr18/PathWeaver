import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useJourney, STAGE_LABELS, STAGE_ICONS } from '../context/JourneyContext';
import { useAuth } from '../context/AuthContext';
import Timeline from './Timeline';
import LoadingSpinner from './common/LoadingSpinner';
import StoryEngine from '../engine/StoryEngine';

export default function StoryScreen() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const {
    currentStage, startingStage, exploredStages,
    currentScenario, setCurrentScenario,
    scores, decisions, userProfile,
    scenarioCount, makeDecision,
    isLoading, setIsLoading
  } = useJourney();

  const [error, setError] = useState(null);

  useEffect(() => {
    if (!currentStage) {
      navigate('/select-stage');
      return;
    }
    loadScenario();
  }, [currentStage, scenarioCount]);

  const loadScenario = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const scenario = await StoryEngine.loadNextScenario({
        currentStage,
        userProfile,
        previousDecisions: decisions,
        currentScores: scores,
        scenarioCount: scenarioCount + 1
      });
      setCurrentScenario(scenario);
    } catch (err) {
      setError('Failed to load scenario. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDecision = (choice) => {
    const audio = new Audio('/assets/audio/click.wav');
    audio.play().catch(e => console.log('Audio play failed:', e));
    
    makeDecision(choice, currentScenario?.title);
    navigate('/consequence');
  };

  if (!currentStage) return null;

  return (
    <div className="min-h-[calc(100vh-60px)] flex">
      {/* Timeline Sidebar */}
      <div className="hidden md:block w-64 bg-white/60 border-r border-slate-200 p-4 overflow-y-auto">
        <Timeline currentStage={currentStage} exploredStages={exploredStages} startingStage={startingStage} />

        {/* Score preview */}
        <div className="mt-6 pt-4 border-t border-slate-200">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Scores</h3>
          {Object.entries(scores)
            .filter(([key]) => !(key === 'relationships' && ['childhood', 'school', 'college'].includes(currentStage)))
            .map(([key, value]) => (
            <div key={key} className="mb-2">
              <div className="flex justify-between text-xs text-slate-600 mb-1">
                <span className="capitalize">{key}</span>
                <span>{value}%</span>
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${value}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Story Area */}
      <div className="flex-1 p-4 md:p-8 max-w-4xl mx-auto">
        {/* Stage Badge */}
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/30 rounded-full px-4 py-1.5 mb-6"
        >
          <span>{STAGE_ICONS[currentStage]}</span>
          <span className="text-sm text-purple-400 font-medium">{STAGE_LABELS[currentStage]}</span>
          {currentScenario?.source === 'ai' && (
            <span className="text-xs bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full">AI Generated</span>
          )}
        </motion.div>

        {isLoading ? (
          <LoadingSpinner message="AI is crafting your scenario..." />
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-400 mb-4">{error}</p>
            <button onClick={loadScenario} className="px-6 py-2 bg-purple-600 rounded-lg hover:bg-purple-500 transition text-white">
              Retry
            </button>
          </div>
        ) : currentScenario ? (
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
            {/* Scenario Title */}
            <h2 className="text-2xl md:text-3xl font-bold mb-4">{currentScenario.title}</h2>

            {/* Scenario Description */}
            <div className="bg-white/80 shadow-lg border border-slate-200 rounded-xl p-6 mb-8">
              <p className="text-slate-700 text-lg leading-relaxed">{currentScenario.text}</p>
            </div>

            {/* Decision Buttons */}
            <h3 className="text-sm text-slate-500 uppercase tracking-wider mb-4">What will you do?</h3>
            <div className="space-y-3">
              {currentScenario.choices?.map((choice, i) => (
                <motion.button
                  key={choice.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.02, x: 8 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleDecision(choice)}
                  className="w-full text-left bg-white/90 shadow-xl shadow-purple-500/5 border border-slate-300 hover:border-purple-500/50 rounded-xl p-5 transition-all group"
                >
                  <div className="flex items-start gap-3">
                    <span className="bg-slate-100 group-hover:bg-purple-500/20 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-slate-600 group-hover:text-purple-400 transition shrink-0">
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="text-slate-700 group-hover:text-slate-900 transition">{choice.text}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : null}
      </div>
    </div>
  );
}