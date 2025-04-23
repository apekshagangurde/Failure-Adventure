import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Scenario } from "@/lib/types";

interface ResponseCardProps {
  scenario: Scenario;
  choice: 'A' | 'B';
  onNext: () => void;
  isLastScenario: boolean;
}

const ResponseCard: React.FC<ResponseCardProps> = ({ 
  scenario, 
  choice, 
  onNext,
  isLastScenario
}) => {
  return (
    <Card className="rounded-xl shadow-lg overflow-hidden">
      <CardContent className="p-6">
        <div className="mb-4">
          <div className="inline-block bg-[#FFD166] px-3 py-1 rounded-full text-sm font-bold mb-2">
            You chose: Option {choice}
          </div>
          <h3 className="text-xl font-bold mb-4">Result:</h3>
          <p className="text-lg mb-6">
            {scenario.responses[choice]}
          </p>
          <div className="flex justify-center">
            <motion.img 
              src={scenario.images[choice]} 
              alt={`Response to option ${choice}`} 
              className="w-48 h-48 object-cover rounded-lg mb-4"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <Button 
            onClick={onNext} 
            className="w-full bg-[#4ECDC4] hover:bg-opacity-90 text-white font-bold py-3 px-4 rounded-lg shadow-md"
          >
            {isLastScenario ? (
              <>
                <i className="ri-check-line mr-1"></i> See Results
              </>
            ) : (
              <>
                <i className="ri-arrow-right-line mr-1"></i> Next Awkward Moment
              </>
            )}
          </Button>
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default ResponseCard;
