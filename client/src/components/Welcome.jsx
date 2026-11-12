import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function Welcome() {
  const navigate = useNavigate();
  const [audioPlayed, setAudioPlayed] = useState(false);

  useEffect(() => {
    const audio = new Audio('/assets/audio/voice/welcome.m4a');
    
    // Try to autoplay immediately (browsers often block this)
    const playAttempt = audio.play();
    
    if (playAttempt !== undefined) {
      playAttempt.then(() => {
        setAudioPlayed(true);
      }).catch(() => {
        // Autoplay blocked by browser. Play on first interaction instead.
        const playOnInteraction = () => {
          if (!audioPlayed) {
            audio.play().catch(e => console.log(e));
            setAudioPlayed(true);
            document.removeEventListener('click', playOnInteraction);
          }
        };
        document.addEventListener('click', playOnInteraction);
        return () => document.removeEventListener('click', playOnInteraction);
      });
    }
  }, [audioPlayed]);

  const playClick = () => {
    const audio = new Audio('/assets/audio/click.wav');
    audio.play().catch(e => console.log('Audio play failed:', e));
  };

  const handleStart = (e) => {
    e.preventDefault();
    playClick();
    setTimeout(() => navigate('/create'), 200);
  };

  return (
    <div className="min-h-[calc(100vh-60px)] flex flex-col items-center justify-center relative overflow-hidden px-4">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0 opacity-20 bg-center bg-cover bg-no-repeat"
        style={{ backgroundImage: "url('/assets/images/hero_bg.jpg')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50/90 via-purple-100/60 to-slate-50/90 z-0" />

      {/* Floating particles (Animations) */}
      <div className="absolute inset-0 z-0">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-purple-500/30 rounded-full"
            style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
            animate={{
              y: [0, -40, 0],
              opacity: [0.1, 0.6, 0.1],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 4 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: 'spring', bounce: 0.5, duration: 0.8 }}
        >
          <h1 className="text-6xl md:text-8xl font-black mb-4 drop-shadow-sm">
            <span className="bg-gradient-to-r from-purple-600 via-indigo-500 to-cyan-500 bg-clip-text text-transparent">
              PATHWEAVER
            </span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-xl md:text-2xl text-slate-600 mb-10 font-medium"
        >
          Weave Your Future, One Choice at a Time
        </motion.p>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 items-center justify-center"
        >
          <button
            onClick={handleStart}
            className="px-10 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-2xl text-xl font-bold transition-all shadow-xl shadow-purple-500/30 hover:shadow-purple-500/50 hover:-translate-y-1 text-white flex items-center gap-2"
          >
            <span>🚀</span> Start Journey
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mt-16 max-w-xl mx-auto bg-white/60 p-6 rounded-2xl backdrop-blur-sm border border-white"
        >
          <p className="text-slate-600 text-sm leading-relaxed font-medium">
            Make life decisions across different stages — from childhood to retirement.
            Every choice shapes your career, health, finances, relationships, and happiness.
            Powered by AI for unique scenarios every time you play.
          </p>
        </motion.div>
      </div>
    </div>
  );
}