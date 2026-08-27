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
  const { scores, startingStage, decisions, exploredStages, userProfile } = useJourney();
  const { isAuthenticated } = useAuth();
  const [feedback, setFeedback] = useState('');
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const totalScore = ScoreManager.calculateTotal(scores);
  const achievements = ScoreManager.getAchievements(scores);

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

  const scoreLabels = ['Career', 'Health', 'Finance', 'Relationships', 'Happiness'];
  const scoreValues = [scores.career, scores.health, scores.finance, scores.relationships, scores.happiness];

  const radarData = {
    labels: scoreLabels,
    datasets: [{
      label: 'Your Scores',
      data: scoreValues,
      backgroundColor: 'rgba(139, 92, 246, 0.2)',
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
      r: { min: 0, max: 100, ticks: { color: '#9CA3AF' }, grid: { color: '#374151' }, pointLabels: { color: '#D1D5DB' } },
      y: { min: 0, max: 100, ticks: { color: '#9CA3AF' }, grid: { color: '#374151' } },
      x: { ticks: { color: '#D1D5DB' }, grid: { display: false } }
    }
  };

  return (
    <div className="min-h-[calc(100vh-60px)] px-4 py-10 max-w-5xl mx-auto">
      <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-2 bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
          Your Life Analysis
        </h2>
        <p className="text-gray-500 text-center mb-8">
          Starting from: {STAGE_LABELS[startingStage] || 'Full Journey'}
        </p>
      </motion.div>

      {/* Total Score */}
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }}
        className="text-center mb-10">
        <div className="inline-flex items-center gap-3 bg-gray-900/80 border border-gray-800 rounded-2xl px-8 py-4">
          <span className="text-4xl">🏆</span>
          <div>
            <p className="text-sm text-gray-500">Overall Score</p>
            <p className="text-4xl font-black text-purple-400">{totalScore}%</p>
          </div>
        </div>
      </motion.div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }}
          className="bg-gray-900/80 border border-gray-800 rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-300">Radar View</h3>
          <Radar data={radarData} options={chartOptions} />
        </motion.div>
        <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4 }}
          className="bg-gray-900/80 border border-gray-800 rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-300">Score Breakdown</h3>
          <Bar data={barData} options={chartOptions} />
        </motion.div>
      </div>

      {/* Score Bars */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}
        className="bg-gray-900/80 border border-gray-800 rounded-2xl p-6 mb-10">
        {Object.entries(scores).map(([key, value]) => (
          <div key={key} className="mb-4 last:mb-0">
            <div className="flex justify-between text-sm mb-1">
              <span className="capitalize text-gray-400">{key}</span>
              <span className="text-white font-semibold">{value}%</span>
            </div>
            <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
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
                <p className="text-sm text-gray-500">{a.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* AI Feedback */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.8 }}
        className="bg-gray-900/80 border border-gray-800 rounded-2xl p-6 mb-10">
        <h3 className="text-xl font-bold mb-4">🤖 AI Analysis</h3>
        {loadingFeedback ? (
          <div className="text-gray-500 animate-pulse">Generating your personalized feedback...</div>
        ) : (
          <div className="text-gray-300 whitespace-pre-line leading-relaxed">{feedback}</div>
        )}
      </motion.div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link to="/summary" className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-xl font-semibold text-center transition-all shadow-lg">
          View Journey Summary
        </Link>
        <Link to="/report" className="px-8 py-3 border border-gray-700 hover:border-gray-500 rounded-xl font-semibold text-center transition-all">
          Full Report & PDF
        </Link>
      </div>
    </div>
  );
}