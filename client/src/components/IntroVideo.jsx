import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useJourney } from '../context/JourneyContext';

const AVATARS = {
  avatar_1: { emoji: '🧑‍💻', label: 'Tech Enthusiast' },
  avatar_2: { emoji: '🧑‍🎨', label: 'Creative Soul' },
  avatar_3: { emoji: '🧑‍🔬', label: 'Curious Mind' },
  avatar_4: { emoji: '🧑‍💼', label: 'Business Pro' },
  avatar_5: { emoji: '🧑‍🎓', label: 'Scholar' },
};

export default function IntroVideo() {
  const navigate = useNavigate();
  const { userProfile } = useJourney();
  
  // Interactive Feature: A/V Synchronization Refs & State
  const videoRef = useRef(null);
  const [audioObj, setAudioObj] = useState(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const audio = new Audio('/assets/audio/voice/intro_video.m4a');
    setAudioObj(audio);
    
    // Attempt autoplay
    audio.play().catch(e => {
      console.log('Audio autoplay blocked by browser:', e);
      setIsPlaying(false); // If blocked, pause state
    });

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  // Synchronized Play/Pause
  const togglePlaySync = () => {
    if (isPlaying) {
      videoRef.current?.pause();
      audioObj?.pause();
    } else {
      videoRef.current?.play();
      audioObj?.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Synchronized Mute
  const toggleMuteSync = () => {
    if (videoRef.current) videoRef.current.muted = !isMuted;
    if (audioObj) audioObj.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const avatarData = userProfile?.avatar ? AVATARS[userProfile.avatar] : null;

  return (
    <div className="min-h-[calc(100vh-60px)] flex flex-col items-center justify-center px-4 py-10 bg-slate-50">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-3xl text-center"
      >
        <h2 className="text-4xl font-black mb-6 bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent">
          Your Journey Begins, {userProfile?.name || 'Traveler'}
        </h2>

        {avatarData && (
          <motion.div 
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
            className="mb-8 inline-flex flex-col items-center justify-center bg-white shadow-lg shadow-purple-500/10 border border-slate-200 rounded-3xl p-6 px-12"
          >
            <span className="text-6xl mb-2 block">{avatarData.emoji}</span>
            <span className="text-slate-500 font-medium uppercase tracking-widest text-sm">{avatarData.label}</span>
          </motion.div>
        )}

        {/* Interactive Synchronized Video Player */}
        <div className="bg-slate-900 shadow-2xl shadow-purple-500/20 border-4 border-slate-800 rounded-3xl overflow-hidden mb-10 relative group">
          <video 
            ref={videoRef}
            src="/assets/video/intro.mp4" 
            autoPlay 
            loop 
            muted={isMuted}
            playsInline
            className={`w-full h-auto object-cover aspect-video transition-opacity duration-500 ${isPlaying ? 'opacity-100' : 'opacity-50'}`}
          ></video>
          
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent flex flex-col justify-end p-6 text-left">
            
            {/* Interactive Control Menu */}
            <div className="flex items-center justify-between bg-black/50 backdrop-blur-md border border-white/10 rounded-2xl p-4 mb-4 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
              <div className="flex items-center gap-4">
                <button 
                  onClick={togglePlaySync}
                  className="bg-purple-600 hover:bg-purple-500 text-white rounded-full w-12 h-12 flex items-center justify-center transition-all hover:scale-110 shadow-lg shadow-purple-500/30"
                >
                  {isPlaying ? '⏸' : '▶️'}
                </button>
                <button 
                  onClick={toggleMuteSync}
                  className="bg-white/10 hover:bg-white/20 text-white rounded-full w-12 h-12 flex items-center justify-center transition-all hover:scale-110"
                >
                  {isMuted ? '🔇' : '🔊'}
                </button>
                <div className="flex flex-col">
                  <span className="text-white font-bold text-sm">A/V Sync Control</span>
                  <span className="text-slate-300 text-xs">{isPlaying ? 'Playing Synchronized Tracks' : 'Paused'}</span>
                </div>
              </div>
              
              {/* Animated Audio Equalizer (Animation Integration) */}
              {isPlaying && (
                <div className="flex items-end gap-1 h-8 px-4">
                  {[...Array(5)].map((_, i) => (
                    <motion.div 
                      key={i}
                      animate={{ height: ['20%', '100%', '40%', '80%', '30%'] }}
                      transition={{ repeat: Infinity, duration: 0.8 + (i * 0.1), ease: "easeInOut" }}
                      className="w-1.5 bg-purple-400 rounded-t-sm"
                    />
                  ))}
                </div>
              )}
            </div>

            <h3 className="text-white text-3xl font-bold mb-2">Shape Your Future</h3>
            <p className="text-slate-200 text-lg max-w-xl">
              In <strong className="text-purple-300">PathWeaver</strong>, every choice you make dictates your career, relationships, health, and happiness.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm text-slate-600 mb-10">
          <motion.div whileHover={{ y: -5 }} className="bg-white shadow-lg shadow-slate-200/50 rounded-2xl p-6 border border-slate-100">
            <div className="text-3xl mb-3">🎯</div>
            <p className="font-medium text-slate-800">Make decisions at every life stage</p>
          </motion.div>
          <motion.div whileHover={{ y: -5 }} className="bg-white shadow-lg shadow-slate-200/50 rounded-2xl p-6 border border-slate-100">
            <div className="text-3xl mb-3">📊</div>
            <p className="font-medium text-slate-800">Watch your scores change in real-time</p>
          </motion.div>
          <motion.div whileHover={{ y: -5 }} className="bg-white shadow-lg shadow-slate-200/50 rounded-2xl p-6 border border-slate-100">
            <div className="text-3xl mb-3">🤖</div>
            <p className="font-medium text-slate-800">AI creates unique scenarios for you</p>
          </motion.div>
        </div>

        <div className="flex gap-4 justify-center">
          <button onClick={() => {
            audioObj?.pause();
            navigate('/select-stage');
          }}
            className="px-10 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-xl font-bold transition-all shadow-xl shadow-purple-500/20 text-white text-lg">
            Let's Go! →
          </button>
        </div>
      </motion.div>
    </div>
  );
}