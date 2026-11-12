import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import { Radar, Bar } from 'react-chartjs-2';
import { useJourney, STAGE_LABELS } from '../context/JourneyContext';
import { useAuth } from '../context/AuthContext';
import ScoreManager from '../engine/ScoreManager';
import { generateFeedback } from '../services/aiService';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function FinalAnalysis() {
  const { scores, startingStage, decisions, exploredStages, userProfile, resetJourney } = useJourney();
  const { isAuthenticated } = useAuth();
  const [feedback, setFeedback] = useState('');
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  
  // Interactive Feature State
  const [isCelebrating, setIsCelebrating] = useState(false);
  const [confetti, setConfetti] = useState([]);

  const totalScore = ScoreManager.calculateTotal(scores);
  const achievements = ScoreManager.getAchievements(scores);

  const AVATARS = {
    avatar_1: { emoji: '🧑‍💻', label: 'Tech Enthusiast' },
    avatar_2: { emoji: '🧑‍🎨', label: 'Creative Soul' },
    avatar_3: { emoji: '🧑‍🔬', label: 'Curious Mind' },
    avatar_4: { emoji: '🧑‍💼', label: 'Business Pro' },
    avatar_5: { emoji: '🧑‍🎓', label: 'Scholar' },
  };

  const avatarData = userProfile?.avatar ? AVATARS[userProfile.avatar] : null;

  useEffect(() => {
    loadFeedback();
  }, []);

  const loadFeedback = async () => {
    if (!isAuthenticated) {
      setFeedback('Login to get AI-powered personalized feedback on your journey!');
      return;
    }
    setLoadingFeedback(true);
    try {
      const { data } = await generateFeedback({
        startingStage, decisions, scores, exploredStages,
        userName: userProfile?.name
      });
      if (data.success) setFeedback(data.feedback);
      else setFeedback('Your journey has been unique and insightful. Every decision shaped who you became!');
    } catch {
      setFeedback('Your journey has been unique and insightful. Every decision shaped who you became!');
    } finally {
      setLoadingFeedback(false);
    }
  };

  // Interactive Feature: A/V Synchronized Particle Animation
  const triggerCelebration = () => {
    // 1. Audio Sync
    const audio = new Audio('/assets/audio/success.wav');
    audio.play().catch(e => console.log('Audio error:', e));

    // 2. Generate random particles for physics animation
    const newConfetti = [...Array(60)].map((_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 800, // Random X spread
      y: (Math.random() - 0.5) * 800, // Random Y spread
      rotation: Math.random() * 360,
      scale: Math.random() * 1.5 + 0.5,
      color: ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444'][Math.floor(Math.random() * 5)]
    }));
    
    setConfetti(newConfetti);
    setIsCelebrating(true);
    
    // Auto turn off
    setTimeout(() => {
      setIsCelebrating(false);
      setConfetti([]);
    }, 2500);
  };

  const scoreLabels = ['Career', 'Health', 'Finance', 'Relationships', 'Happiness'];
  const scoreValues = [scores.career, scores.health, scores.finance, scores.relationships, scores.happiness];

  const radarData = {
    labels: scoreLabels,
    datasets: [{
      label: 'Your Scores',
      data: scoreValues,
      backgroundColor: 'rgba(139, 92, 246, 0.3)',
      borderColor: 'rgba(139, 92, 246, 0.8)',
      pointBackgroundColor: 'rgba(139, 92, 246, 1)',
      pointBorderColor: '#fff',
    }]
  };

  const barData = {
    labels: scoreLabels,
    datasets: [{
      label: 'Score %',
      data: scoreValues,
      backgroundColor: ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444'],
      borderRadius: 8,
    }]
  };

  const chartOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      r: { min: 0, max: 100, ticks: { color: '#4B5563' }, grid: { color: '#E5E7EB' }, pointLabels: { color: '#374151' } },
      y: { min: 0, max: 100, ticks: { color: '#4B5563' }, grid: { color: '#E5E7EB' } },
      x: { ticks: { color: '#374151' }, grid: { display: false } }
    }
  };

  return (
    <div className="min-h-[calc(100vh-60px)] px-4 py-10 max-w-5xl mx-auto">
      <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex flex-col items-center mb-10">
        
        {avatarData && (
          <div className="mb-4 bg-white shadow-lg shadow-purple-500/10 border border-slate-200 rounded-full w-24 h-24 flex items-center justify-center text-5xl">
            {avatarData.emoji}
          </div>
        )}

        <h2 className="text-3xl md:text-5xl font-black text-center mb-2 bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent">
          {userProfile?.name ? `${userProfile.name}'s Life Analysis` : 'Your Life Analysis'}
        </h2>
        <p className="text-slate-500 text-center font-medium">
          Starting from: {STAGE_LABELS[startingStage] || 'Full Journey'}
        </p>
      </motion.div>

      {/* Total Score */}
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }}
        className="text-center mb-10">
        <div className="inline-flex items-center gap-3 bg-white/90 shadow-xl shadow-purple-500/5 border border-slate-200 rounded-2xl px-8 py-4">
          <span className="text-4xl">🏆</span>
          <div>
            <p className="text-sm text-slate-500">Overall Score</p>
            <p className="text-4xl font-black text-purple-400">{totalScore}%</p>
          </div>
        </div>
      </motion.div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }}
          className="bg-white/90 shadow-xl shadow-purple-500/5 border border-slate-200 rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4 text-slate-700">Radar View</h3>
          <Radar data={radarData} options={chartOptions} />
        </motion.div>
        <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4 }}
          className="bg-white/90 shadow-xl shadow-purple-500/5 border border-slate-200 rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4 text-slate-700">Score Breakdown</h3>
          <Bar data={barData} options={chartOptions} />
        </motion.div>
      </div>

      {/* Score Bars */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}
        className="bg-white/90 shadow-xl shadow-purple-500/5 border border-slate-200 rounded-2xl p-6 mb-10">
        {Object.entries(scores).map(([key, value]) => (
          <div key={key} className="mb-4 last:mb-0">
            <div className="flex justify-between text-sm mb-1">
              <span className="capitalize text-slate-600">{key}</span>
              <span className="text-slate-900 font-semibold">{value}%</span>
            </div>
            <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-500"
                initial={{ width: 0 }}
                animate={{ width: value + '%' }}
                transition={{ duration: 1, delay: 0.6 }}
              />
            </div>
          </div>
        ))}
      </motion.div>

      {/* Achievements */}
      {achievements.length > 0 && (
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.7 }}
          className="mb-10">
          <h3 className="text-xl font-bold mb-4">🏅 Achievements</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {achievements.map((a, i) => (
              <div key={i} className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-4">
                <p className="font-semibold">{a.title}</p>
                <p className="text-sm text-slate-500">{a.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* AI Feedback */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.8 }}
        className="bg-white/90 shadow-xl shadow-purple-500/5 border border-slate-200 rounded-2xl p-6 mb-10">
        <h3 className="text-xl font-bold mb-4">🤖 AI Analysis</h3>
        {loadingFeedback ? (
          <div className="text-slate-500 animate-pulse">Generating your personalized feedback...</div>
        ) : (
          <div className="text-slate-700 whitespace-pre-line leading-relaxed">{feedback}</div>
        )}
      </motion.div>

      {/* Interactive Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
        
        {/* New Interactive Celebrate Feature */}
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={triggerCelebration}
          className="px-8 py-3 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 rounded-xl font-bold text-center transition-all shadow-xl shadow-rose-500/30 text-white flex justify-center items-center gap-2"
        >
          <span>🎉</span> Celebrate Results!
        </motion.button>

        <Link to="/summary" className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-xl font-semibold text-center transition-all shadow-lg text-white">
          View Journey Summary
        </Link>
        <button onClick={() => {
          resetJourney();
          window.location.href = '/';
        }} className="px-8 py-3 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl font-semibold text-center transition-all text-slate-700">
          🏠 Return to Home
        </button>
      </div>

      {/* Physics-based Confetti Animation Overlay */}
      {isCelebrating && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center overflow-hidden">
          {confetti.map(c => (
            <motion.div
              key={c.id}
              initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
              animate={{ 
                x: c.x, 
                y: c.y + 200, // Explode outward then fall down
                scale: c.scale,
                rotate: c.rotation,
                opacity: 0
              }}
              transition={{ duration: 2, ease: "easeOut" }}
              className="absolute w-3 h-6 rounded-sm"
              style={{ backgroundColor: c.color }}
            />
          ))}
        </div>
      )}
    </div>
  );
}