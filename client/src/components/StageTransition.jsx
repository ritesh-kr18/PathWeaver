import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useJourney, STAGES, STAGE_LABELS, STAGE_ICONS } from '../context/JourneyContext';

const StatBar = ({ label, value, colorClass, delay }) => {
  const [currentValue, setCurrentValue] = useState(0);

  useEffect(() => {
    // Animate the number counting up
    const duration = 1500; // 1.5 seconds
    const steps = 60;
    const stepTime = duration / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      // Use easeOutQuad for smoother counting
      const easeProgress = 1 - (1 - progress) * (1 - progress);
      setCurrentValue(Math.round(value * easeProgress));

      if (currentStep >= steps) clearInterval(timer);
    }, stepTime);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className="mb-6"
    >
      <div className="flex justify-between items-end mb-2">
        <span className="text-sm font-bold text-slate-600 uppercase tracking-wider">{label}</span>
        <span className={`text-2xl font-black ${colorClass}`}>{currentValue}%</span>
      </div>
      <div className="h-4 bg-slate-100 rounded-full overflow-hidden shadow-inner border border-slate-200">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1.5, delay, ease: "easeOut" }}
          className={`h-full rounded-full bg-gradient-to-r ${colorClass.replace('text-', 'from-').replace('500', '400')} to-${colorClass.replace('text-', '').replace('500', '600')}`}
          style={{ backgroundColor: 'currentColor' }} // Fallback if Tailwind dynamic classes fail
        />
      </div>
    </motion.div>
  );
};

export default function StageTransition() {
  const navigate = useNavigate();
  const { currentStage, scores, advanceStage } = useJourney();

  useEffect(() => {
    // Play completion voice when screen loads
    const audio = new Audio('/assets/audio/voice/complete.m4a');
    audio.play().catch(e => console.log('Audio error:', e));
  }, []);

  const currentIndex = STAGES.indexOf(currentStage);
  const nextStage = STAGES[currentIndex + 1];

  const handleNextPhase = () => {
    // Play voice for next stage
    if (nextStage) {
      const audio = new Audio(`/assets/audio/voice/${nextStage}.m4a`);
      audio.play().catch(e => console.log('Audio error:', e));
      
      // Advance and navigate
      advanceStage();
      setTimeout(() => navigate('/play'), 800);
    } else {
      navigate('/analysis');
    }
  };

  return (
    <div className="min-h-[calc(100vh-60px)] flex flex-col items-center justify-center px-4 py-10 bg-slate-50">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-2xl bg-white shadow-2xl shadow-purple-500/10 rounded-3xl p-8 md:p-12 border border-slate-100"
      >
        <div className="text-center mb-10">
          <motion.div 
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", bounce: 0.5, duration: 0.8 }}
            className="text-6xl mb-4"
          >
            🌟
          </motion.div>
          <h2 className="text-4xl font-black text-slate-800 mb-2">Phase Complete!</h2>
          <p className="text-lg text-slate-500">You have completed the <strong className="text-purple-600">{STAGE_LABELS[currentStage]}</strong> phase.</p>
        </div>

        <div className="mb-12">
          <h3 className="text-center text-sm font-bold text-slate-400 uppercase tracking-widest mb-8">Your Current Life Stats</h3>
          
          <StatBar label="Career / Education" value={scores.career} colorClass="text-blue-500" delay={0.2} />
          <StatBar label="Wealth / Finance" value={scores.finance} colorClass="text-emerald-500" delay={0.4} />
          <StatBar label="Health / Wellness" value={scores.health} colorClass="text-rose-500" delay={0.6} />
          
          {/* Hide relationships in early stages */}
          {!['childhood', 'school', 'college'].includes(currentStage) && (
            <StatBar label="Relationships" value={scores.relationships} colorClass="text-pink-500" delay={0.8} />
          )}
          
          <StatBar label="Happiness" value={scores.happiness} colorClass="text-amber-500" delay={1.0} />
        </div>

        <div className="flex justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNextPhase}
            className="px-10 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-2xl text-xl font-bold transition-all shadow-xl shadow-purple-500/30 text-white flex items-center gap-3"
          >
            {nextStage ? (
              <>Start {STAGE_LABELS[nextStage]} Phase <span>➡️</span></>
            ) : (
              <>View Final Analysis <span>📊</span></>
            )}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
