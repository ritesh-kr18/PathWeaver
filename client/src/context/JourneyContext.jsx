import { createContext, useContext, useState, useCallback } from 'react';

const JourneyContext = createContext();

export const STAGES = ['childhood', 'school', 'college', 'career', 'family', 'retirement'];
export const STAGE_LABELS = {
  childhood: 'Childhood',
  school: 'School',
  college: 'College',
  career: 'Career',
  family: 'Family & Adult Life',
  retirement: 'Retirement'
};
export const STAGE_ICONS = {
  childhood: '🧒',
  school: '📚',
  college: '🎓',
  career: '💼',
  family: '👨‍👩‍👧',
  retirement: '🌅'
};

const INITIAL_SCORES = {
  career: 50, health: 50, finance: 50,
  relationships: 50, happiness: 50, knowledge: 50
};

export function JourneyProvider({ children }) {
  const [userProfile, setUserProfile] = useState(null);
  const [startingStage, setStartingStageState] = useState(null);
  const [currentStage, setCurrentStage] = useState(null);
  const [currentScenario, setCurrentScenario] = useState(null);
  const [exploredStages, setExploredStages] = useState([]);
  const [decisions, setDecisions] = useState([]);
  const [scores, setScores] = useState({ ...INITIAL_SCORES });
  const [timelineEvents, setTimelineEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [scenarioCount, setScenarioCount] = useState(0);
  const [journeyId, setJourneyId] = useState(null);
  const [lastChoice, setLastChoice] = useState(null);

  const setStartingStage = useCallback((stage) => {
    setStartingStageState(stage);
    setCurrentStage(stage);
    setExploredStages([stage]);
    setScenarioCount(0);

    // Save to localStorage for reliability
    localStorage.setItem('pathweaver_journey', JSON.stringify({ startingStage: stage }));
  }, []);

  const makeDecision = useCallback((choice, scenarioTitle) => {
    const decision = {
      nodeId: currentScenario?.title || scenarioTitle,
      choiceId: choice.id,
      choiceText: choice.text,
      stage: currentStage,
      effects: choice.effects,
      timestamp: new Date().toISOString()
    };

    setDecisions(prev => [...prev, decision]);
    setLastChoice({ ...choice, scenarioTitle });
    setScenarioCount(prev => prev + 1);

    // Update scores
    const newScores = { ...scores };
    Object.entries(choice.effects).forEach(([key, value]) => {
      if (newScores[key] !== undefined) {
        newScores[key] = Math.max(0, Math.min(100, newScores[key] + value));
      }
    });
    setScores(newScores);

    // Add timeline event
    setTimelineEvents(prev => [...prev, {
      stage: currentStage,
      event: `Chose: ${choice.text}`,
      timestamp: new Date().toISOString()
    }]);
  }, [currentStage, currentScenario, scores]);

  const advanceStage = useCallback(() => {
    const currentIndex = STAGES.indexOf(currentStage);
    if (currentIndex < STAGES.length - 1) {
      const nextStage = STAGES[currentIndex + 1];
      setCurrentStage(nextStage);
      setExploredStages(prev => [...new Set([...prev, nextStage])]);
      setScenarioCount(0);
      return nextStage;
    }
    return null; // Journey complete
  }, [currentStage]);

  const resetJourney = useCallback(() => {
    setUserProfile(null);
    setStartingStageState(null);
    setCurrentStage(null);
    setCurrentScenario(null);
    setExploredStages([]);
    setDecisions([]);
    setScores({ ...INITIAL_SCORES });
    setTimelineEvents([]);
    setIsLoading(false);
    setScenarioCount(0);
    setJourneyId(null);
    setLastChoice(null);
    localStorage.removeItem('pathweaver_journey');
  }, []);

  return (
    <JourneyContext.Provider value={{
      userProfile, setUserProfile,
      startingStage, setStartingStage,
      currentStage, setCurrentStage,
      currentScenario, setCurrentScenario,
      exploredStages, setExploredStages,
      decisions, scores, setScores,
      timelineEvents, isLoading, setIsLoading,
      scenarioCount, setScenarioCount,
      journeyId, setJourneyId,
      lastChoice, setLastChoice,
      makeDecision, advanceStage, resetJourney,
      INITIAL_SCORES
    }}>
      {children}
    </JourneyContext.Provider>
  );
}

export const useJourney = () => useContext(JourneyContext);