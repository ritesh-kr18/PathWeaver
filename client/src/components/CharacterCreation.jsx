import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useJourney } from '../context/JourneyContext';

const AVATARS = [
  { id: 'avatar_1', emoji: '🧑‍💻', label: 'Tech Enthusiast' },
  { id: 'avatar_2', emoji: '🧑‍🎨', label: 'Creative Soul' },
  { id: 'avatar_3', emoji: '🧑‍🔬', label: 'Curious Mind' },
  { id: 'avatar_4', emoji: '🧑‍💼', label: 'Business Pro' },
  { id: 'avatar_5', emoji: '🧑‍🎓', label: 'Scholar' },
];

const INTERESTS = ['Technology', 'Sports', 'Music', 'Art', 'Business'];

export default function CharacterCreation() {
  const navigate = useNavigate();
  const { setUserProfile } = useJourney();
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [avatar, setAvatar] = useState('avatar_1');
  const [interests, setInterests] = useState([]);
  const [error, setError] = useState('');

  const toggleInterest = (interest) => {
    setInterests(prev =>
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return setError('Please enter your name');
    if (!age || age < 5 || age > 100) return setError('Please enter a valid age (5-100)');

    setUserProfile({ name: name.trim(), age: parseInt(age), avatar, interests });
    navigate('/intro');
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: (i) => ({ y: 0, opacity: 1, transition: { delay: i * 0.1 } }),
  };

  return (
    <div className="min-h-[calc(100vh-60px)] flex items-center justify-center px-4 py-10">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-lg bg-white/90 shadow-xl shadow-purple-500/5 backdrop-blur border border-slate-200 rounded-2xl p-8"
      >
        <motion.h2 custom={0} variants={itemVariants} initial="hidden" animate="visible"
          className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
          Create Your Character
        </motion.h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          <motion.div custom={1} variants={itemVariants} initial="hidden" animate="visible">
            <label className="block text-sm text-slate-600 mb-2">Your Name</label>
            <input
              type="text" value={name} onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-100 border border-slate-300 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:border-purple-500 transition"
              placeholder-slate-400 placeholder="Enter your name"
            />
          </motion.div>

          <motion.div custom={2} variants={itemVariants} initial="hidden" animate="visible">
            <label className="block text-sm text-slate-600 mb-2">Your Age</label>
            <input
              type="number" value={age} onChange={(e) => setAge(e.target.value)}
              className="w-full bg-slate-100 border border-slate-300 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:border-purple-500 transition"
              placeholder-slate-400 placeholder="Enter your age" min="5" max="100"
            />
          </motion.div>

          <motion.div custom={3} variants={itemVariants} initial="hidden" animate="visible">
            <label className="block text-sm text-slate-600 mb-3">Choose Your Avatar</label>
            <div className="grid grid-cols-5 gap-3">
              {AVATARS.map((a) => (
                <button key={a.id} type="button" onClick={() => setAvatar(a.id)}
                  className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all ${
                    avatar === a.id ? 'border-purple-500 bg-purple-500/10 scale-105' : 'border-slate-300 hover:border-slate-300'
                  }`}>
                  <span className="text-3xl">{a.emoji}</span>
                  <span className="text-[10px] text-slate-500 mt-1">{a.label}</span>
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div custom={4} variants={itemVariants} initial="hidden" animate="visible">
            <label className="block text-sm text-slate-600 mb-3">Your Interests</label>
            <div className="flex flex-wrap gap-2">
              {INTERESTS.map((interest) => (
                <button key={interest} type="button" onClick={() => toggleInterest(interest)}
                  className={`px-4 py-2 rounded-full text-sm transition-all ${
                    interests.includes(interest)
                      ? 'bg-purple-600 text-slate-900'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}>
                  {interest}
                </button>
              ))}
            </div>
          </motion.div>

          <motion.button custom={5} variants={itemVariants} initial="hidden" animate="visible"
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-xl text-lg font-semibold transition-all shadow-lg hover:shadow-purple-500/25 text-white">
            Continue →
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}