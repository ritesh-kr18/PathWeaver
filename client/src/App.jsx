import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import { JourneyProvider } from './context/JourneyContext';
import Navbar from './components/common/Navbar';
import Welcome from './components/Welcome';
import CharacterCreation from './components/CharacterCreation';
import IntroVideo from './components/IntroVideo';
import StageSelection from './components/StageSelection';
import StoryScreen from './components/StoryScreen';
import ConsequenceScene from './components/ConsequenceScene';
import FinalAnalysis from './components/FinalAnalysis';
import JourneySummary from './components/JourneySummary';
import LifeReport from './components/LifeReport';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Leaderboard from './components/Leaderboard';

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Welcome />} />
        <Route path="/create" element={<CharacterCreation />} />
        <Route path="/intro" element={<IntroVideo />} />
        <Route path="/select-stage" element={<StageSelection />} />
        <Route path="/play" element={<StoryScreen />} />
        <Route path="/consequence" element={<ConsequenceScene />} />
        <Route path="/analysis" element={<FinalAnalysis />} />
        <Route path="/summary" element={<JourneySummary />} />
        <Route path="/report" element={<LifeReport />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <JourneyProvider>
          <div className="min-h-screen bg-gray-950 text-white">
            <Navbar />
            <AnimatedRoutes />
          </div>
        </JourneyProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}