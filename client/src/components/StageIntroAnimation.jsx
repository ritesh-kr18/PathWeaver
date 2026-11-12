import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useJourney, STAGE_LABELS, STAGE_ICONS } from '../context/JourneyContext';

export default function StageIntroAnimation() {
  const navigate = useNavigate();
  const { currentStage } = useJourney();
  const videoRef = useRef(null);
  const [showSkip, setShowSkip] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isEnding, setIsEnding] = useState(false);

  useEffect(() => {
    if (!currentStage) {
      navigate('/select-stage');
      return;
    }

    // Show skip button after 3 seconds
    const skipTimer = setTimeout(() => setShowSkip(true), 3000);

    return () => clearTimeout(skipTimer);
  }, [currentStage, navigate]);

  // Track video progress for the progress bar
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const pct = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(pct);
    }
  };

  // When video finishes naturally
  const handleVideoEnd = () => {
    goToStory();
  };

  // Transition out then navigate
  const goToStory = () => {
    if (isEnding) return;
    setIsEnding(true);

    // Play the stage voice clip
    const audio = new Audio(`/assets/audio/voice/${currentStage}.m4a`);
    audio.play().catch(() => {});

    setTimeout(() => navigate('/play'), 800);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isEnding ? 0 : 1 }}
        transition={{ duration: 0.6 }}
        className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center"
      >
        {/* Full-screen Video */}
        <video
          ref={videoRef}
          src="/assets/video/pathweaver_animation.mp4"
          autoPlay
          playsInline
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleVideoEnd}
          className="absolute inset-0 w-full h-full object-contain bg-black"
        />

        {/* Bottom Overlay: Progress + Stage Name + Skip */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          {/* Progress Bar */}
          <div className="h-1 bg-white/20 w-full">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-500 to-indigo-500"
              style={{ width: `${progress}%` }}
              transition={{ ease: 'linear' }}
            />
          </div>

          <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-t from-black/80 to-transparent">
            {/* Stage Info */}
            <div className="flex items-center gap-3">
              <span className="text-3xl">{STAGE_ICONS[currentStage]}</span>
              <div>
                <p className="text-white/60 text-xs uppercase tracking-widest font-medium">Entering</p>
                <p className="text-white text-lg font-bold">{STAGE_LABELS[currentStage]} Phase</p>
              </div>
            </div>

            {/* Skip Button */}
            <AnimatePresence>
              {showSkip && (
                <motion.button
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  onClick={goToStory}
                  className="px-6 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-xl text-white font-semibold text-sm transition-all hover:scale-105"
                >
                  Skip Intro →
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
