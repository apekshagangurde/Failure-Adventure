import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Scenario, GameScreen as GameScreenType } from "@/lib/types";
import ScenarioCard from "@/components/scenario-card";
import ResponseCard from "@/components/response-card";

interface GameScreenProps {
  currentScenario: number;
  totalScenarios: number;
  scenario: Scenario;
  screen: GameScreenType;
  selectedChoice: 'A' | 'B' | null;
  onChoiceSelect: (choice: 'A' | 'B') => void;
  onNext: () => void;
}

const GameScreen: React.FC<GameScreenProps> = ({
  currentScenario,
  totalScenarios,
  scenario,
  screen,
  selectedChoice,
  onChoiceSelect,
  onNext,
}) => {
  // Calculate progress percentage
  const progressPercent = ((currentScenario + 1) / totalScenarios) * 100;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Progress Bar */}
      <div className="mb-4 bg-white rounded-full p-1 shadow-md">
        <motion.div 
          className="bg-[#4ECDC4] rounded-full h-3"
          initial={{ width: `${((currentScenario) / totalScenarios) * 100}%` }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.5 }}
        ></motion.div>
      </div>
      
      {/* Scenario Counter */}
      <div className="text-center mb-4">
        <span className="inline-block bg-[#FFD166] text-dark font-bold py-1 px-4 rounded-full text-sm">
          Scenario {currentScenario + 1}/{totalScenarios}
        </span>
      </div>

      <AnimatePresence mode="wait">
        {screen === "scenario" && (
          <motion.div
            key="scenario"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <ScenarioCard 
              scenario={scenario} 
              onChoiceSelect={onChoiceSelect} 
            />
          </motion.div>
        )}

        {screen === "response" && selectedChoice && (
          <motion.div
            key="response"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <ResponseCard 
              scenario={scenario} 
              choice={selectedChoice} 
              onNext={onNext}
              isLastScenario={currentScenario === totalScenarios - 1}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default GameScreen;
