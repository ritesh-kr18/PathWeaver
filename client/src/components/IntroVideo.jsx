import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function IntroVideo() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-60px)] flex items-center justify-center px-4 py-10">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-2xl text-center"
      >
        <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
          Your Journey Begins
        </h2>

        {/* Video placeholder */}
        <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-12 mb-8">
          <div className="text-6xl mb-6">🎬</div>
          <p className="text-gray-300 text-lg mb-6 leading-relaxed">
            In <strong className="text-purple-400">PathWeaver</strong>, every choice shapes your future.
            You'll face real-life scenarios across different life stages — and your decisions will determine
            your career, health, finances, relationships, and happiness.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-400">
            <div className="bg-gray-800/50 rounded-xl p-4">
              <div className="text-2xl mb-2">🎯</div>
              <p>Make decisions at every life stage</p>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-4">
              <div className="text-2xl mb-2">📊</div>
              <p>Watch your scores change in real-time</p>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-4">
              <div className="text-2xl mb-2">🤖</div>
              <p>AI creates unique scenarios for you</p>
            </div>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <button onClick={() => navigate('/select-stage')}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-xl font-semibold transition-all shadow-lg">
            Continue →
          </button>
          <button onClick={() => navigate('/select-stage')}
            className="px-8 py-3 border border-gray-700 hover:border-gray-500 rounded-xl font-semibold transition-all">
            Skip
          </button>
        </div>
      </motion.div>
    </div>
  );
}