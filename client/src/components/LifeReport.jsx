import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useJourney, STAGE_LABELS } from '../context/JourneyContext';
import { useAuth } from '../context/AuthContext';
import ScoreManager from '../engine/ScoreManager';
import { generatePDFReport } from '../utils/pdfGenerator';
import { saveJourney } from '../services/journeyService';

export default function LifeReport() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const journey = useJourney();
  const { userProfile, startingStage, decisions, scores, exploredStages, resetJourney } = journey;
  const totalScore = ScoreManager.calculateTotal(scores);
  const achievements = ScoreManager.getAchievements(scores);

  const handleDownloadPDF = () => {
    generatePDFReport({ userProfile, startingStage, decisions, scores, exploredStages, achievements, totalScore });
  };

  const handleSave = async () => {
    if (!isAuthenticated) return alert('Please login to save your journey');
    try {
      await saveJourney({
        userProfile, startingStage, currentStage: 'retirement',
        exploredStages, decisions, scores,
        timelineEvents: journey.timelineEvents,
        status: 'completed'
      });
      alert('Journey saved successfully!');
    } catch (err) {
      alert('Failed to save journey');
    }
  };

  const handleRestart = () => {
    resetJourney();
    navigate('/create');
  };

  return (
    <div className="min-h-[calc(100vh-60px)] px-4 py-10 max-w-3xl mx-auto">
      <motion.h2 initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
        Your Life Report
      </motion.h2>

      {/* Profile */}
      <section className="bg-gray-900/80 border border-gray-800 rounded-2xl p-6 mb-6">
        <h3 className="text-lg font-semibold mb-3">📋 Profile</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div><span className="text-gray-500">Name:</span> <span>{userProfile?.name || 'Player'}</span></div>
          <div><span className="text-gray-500">Age:</span> <span>{userProfile?.age || '—'}</span></div>
          <div><span className="text-gray-500">Starting Stage:</span> <span>{STAGE_LABELS[startingStage]}</span></div>
          <div><span className="text-gray-500">Total Score:</span> <span className="text-purple-400 font-bold">{totalScore}%</span></div>
        </div>
      </section>

      {/* Scores */}
      <section className="bg-gray-900/80 border border-gray-800 rounded-2xl p-6 mb-6">
        <h3 className="text-lg font-semibold mb-3">📊 Final Scores</h3>
        {Object.entries(scores).map(([key, value]) => (
          <div key={key} className="mb-3">
            <div className="flex justify-between text-sm mb-1">
              <span className="capitalize text-gray-400">{key}</span>
              <span className="font-semibold">{value}%</span>
            </div>
            <div className="h-2.5 bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-500"
                style={{ width: value + '%' }} />
            </div>
          </div>
        ))}
      </section>

      {/* Decisions */}
      <section className="bg-gray-900/80 border border-gray-800 rounded-2xl p-6 mb-6">
        <h3 className="text-lg font-semibold mb-3">🔀 Key Decisions ({decisions.length})</h3>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {decisions.map((d, i) => (
            <div key={i} className="text-sm flex items-start gap-2">
              <span className="text-gray-600 shrink-0">#{i+1}</span>
              <span className="text-gray-500">[{STAGE_LABELS[d.stage]}]</span>
              <span className="text-gray-300">{d.choiceText}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Achievements */}
      {achievements.length > 0 && (
        <section className="bg-gray-900/80 border border-gray-800 rounded-2xl p-6 mb-6">
          <h3 className="text-lg font-semibold mb-3">🏆 Achievements</h3>
          <div className="flex flex-wrap gap-2">
            {achievements.map((a, i) => (
              <span key={i} className="bg-yellow-500/10 border border-yellow-500/20 rounded-full px-3 py-1 text-sm">
                {a.title}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button onClick={handleDownloadPDF}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-xl font-semibold transition-all">
          📥 Download PDF
        </button>
        <button onClick={handleSave}
          className="px-6 py-3 border border-gray-700 hover:border-gray-500 rounded-xl font-semibold transition-all">
          💾 Save Journey
        </button>
        <button onClick={handleRestart}
          className="px-6 py-3 border border-gray-700 hover:border-gray-500 rounded-xl font-semibold transition-all">
          🔄 Start Again
        </button>
      </div>
    </div>
  );
}