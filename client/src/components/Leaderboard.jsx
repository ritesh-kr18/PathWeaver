import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';

export default function Leaderboard() {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    loadLeaderboard();
  }, [filter]);

  const loadLeaderboard = async () => {
    setLoading(true);
    try {
      const url = filter ? '/report/leaderboard?stage=' + filter : '/report/leaderboard';
      const { data } = await api.get(url);
      if (data.success) setScores(data.leaderboard);
    } catch (err) {
      console.error('Leaderboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-60px)] px-4 py-10 max-w-4xl mx-auto">
      <motion.h2 initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
        🏆 Leaderboard
      </motion.h2>

      {/* Filter */}
      <div className="flex justify-center mb-6">
        <select value={filter} onChange={e => setFilter(e.target.value)}
          className="bg-slate-100 border border-slate-300 rounded-lg px-4 py-2 text-sm text-slate-700 focus:outline-none focus:border-purple-500">
          <option value="">All Starting Stages</option>
          <option value="childhood">Childhood</option>
          <option value="school">School</option>
          <option value="college">College</option>
          <option value="career">Career</option>
          <option value="family">Family</option>
        </select>
      </div>

      {loading ? (
        <p className="text-slate-500 text-center py-20">Loading leaderboard...</p>
      ) : scores.length === 0 ? (
        <p className="text-slate-500 text-center py-20">No scores yet. Be the first to complete a journey!</p>
      ) : (
        <div className="bg-white/90 shadow-xl shadow-purple-500/5 border border-slate-200 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="px-4 py-3 text-left">#</th>
                <th className="px-4 py-3 text-left">Player</th>
                <th className="px-4 py-3 text-center">Total</th>
                <th className="px-4 py-3 text-center hidden sm:table-cell">Career</th>
                <th className="px-4 py-3 text-center hidden sm:table-cell">Health</th>
                <th className="px-4 py-3 text-center hidden md:table-cell">Finance</th>
                <th className="px-4 py-3 text-center hidden md:table-cell">Relations</th>
                <th className="px-4 py-3 text-center hidden md:table-cell">Happy</th>
              </tr>
            </thead>
            <tbody>
              {scores.map((s, i) => (
                <tr key={i} className="border-b border-slate-200/50 hover:bg-slate-100/50">
                  <td className="px-4 py-3 font-bold text-slate-600">
                    {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}
                  </td>
                  <td className="px-4 py-3 font-medium">{s.userName || 'Anonymous'}</td>
                  <td className="px-4 py-3 text-center text-purple-400 font-bold">{s.totalScore}%</td>
                  <td className="px-4 py-3 text-center hidden sm:table-cell text-slate-600">{s.career}</td>
                  <td className="px-4 py-3 text-center hidden sm:table-cell text-slate-600">{s.health}</td>
                  <td className="px-4 py-3 text-center hidden md:table-cell text-slate-600">{s.finance}</td>
                  <td className="px-4 py-3 text-center hidden md:table-cell text-slate-600">{s.relationships}</td>
                  <td className="px-4 py-3 text-center hidden md:table-cell text-slate-600">{s.happiness}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}