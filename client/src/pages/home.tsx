import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Scenario, GameScreen as GameScreenType } from "@/lib/types"; 
import { fallbackScenarios } from "@/lib/scenarios";
import WelcomeScreen from "@/components/welcome-screen";
import GameScreenComponent from "@/components/game-screen";
import ResultsScreen from "@/components/results-screen";

export default function Home() {
  // Game state
  const [currentScreen, setCurrentScreen] = useState<GameScreenType>("welcome");
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<'A' | 'B' | null>(null);

  // Fetch scenarios from the API
  const { data: scenarios = fallbackScenarios, isLoading } = useQuery<Scenario[]>({
    queryKey: ['/api/scenarios'],
    retry: 1,
    refetchOnWindowFocus: false,
  });

  // Start the game
  const startGame = () => {
    setCurrentScreen("scenario");
    setCurrentScenario(0);
    setSelectedChoice(null);
  };

  // Handle user choice
  const handleChoice = (choice: 'A' | 'B') => {
    setSelectedChoice(choice);
    setCurrentScreen("response");
  };

  // Show next scenario
  const showNextScenario = () => {
    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(currentScenario + 1);
      setSelectedChoice(null);
      setCurrentScreen("scenario");
    } else {
      setCurrentScreen("results");
    }
  };

  // Reset the game
  const resetGame = () => {
    setCurrentScreen("welcome");
    setCurrentScenario(0);
    setSelectedChoice(null);
  };

  // Define styles for the background
  const backgroundStyle = {
    backgroundImage: "radial-gradient(#4ECDC4 0.5px, transparent 0.5px), radial-gradient(#FF6B6B 0.5px, #F7F7F7 0.5px)",
    backgroundSize: "20px 20px",
    backgroundPosition: "0 0, 10px 10px",
    backgroundColor: "#F7F7F7"
  };

  // Loading state
  if (isLoading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center" 
        style={backgroundStyle}
      >
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl font-bold text-primary">Loading adventures...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen pt-8 pb-16 font-sans" 
      style={backgroundStyle}
    >
      <div className="container mx-auto px-4 max-w-md">
        {currentScreen === "welcome" && (
          <WelcomeScreen onStart={startGame} />
        )}
        
        {(currentScreen === "scenario" || currentScreen === "response") && (
          <GameScreenComponent
            currentScenario={currentScenario}
            totalScenarios={scenarios.length}
            scenario={scenarios[currentScenario]}
            screen={currentScreen}
            selectedChoice={selectedChoice}
            onChoiceSelect={handleChoice}
            onNext={showNextScenario}
          />
        )}
        
        {currentScreen === "results" && (
          <ResultsScreen onRestart={resetGame} />
        )}
      </div>
    </div>
  );
}
