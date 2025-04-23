import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Scenario } from "@/lib/types";

interface ScenarioCardProps {
  scenario: Scenario;
  onChoiceSelect: (choice: 'A' | 'B') => void;
}

const ScenarioCard: React.FC<ScenarioCardProps> = ({ scenario, onChoiceSelect }) => {
  return (
    <Card className="rounded-xl shadow-lg overflow-hidden">
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-6 leading-tight">
          {scenario.question}
        </h2>
        <div className="space-y-4">
          <ChoiceButton 
            letter="A" 
            text={scenario.choices.A} 
            onClick={() => onChoiceSelect('A')} 
          />
          <ChoiceButton 
            letter="B" 
            text={scenario.choices.B} 
            onClick={() => onChoiceSelect('B')} 
          />
        </div>
      </CardContent>
    </Card>
  );
};

interface ChoiceButtonProps {
  letter: 'A' | 'B';
  text: string;
  onClick: () => void;
}

const ChoiceButton: React.FC<ChoiceButtonProps> = ({ letter, text, onClick }) => {
  return (
    <motion.button
      className="w-full bg-white border-2 border-[#FF6B6B] text-[#FF6B6B] hover:bg-[#FF6B6B] hover:text-white font-bold py-3 px-4 rounded-lg text-left transition-colors"
      onClick={onClick}
      whileHover={{ y: -3, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }}
      whileTap={{ y: 0 }}
    >
      <span className="inline-block w-8 h-8 bg-[#FF6B6B] text-white rounded-full text-center leading-8 mr-2">
        {letter}
      </span>
      {text}
    </motion.button>
  );
};

export default ScenarioCard;
