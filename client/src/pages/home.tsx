import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Scenario, GameScreen as GameScreenType, UserChoice } from "@/lib/types"; 
import { fallbackScenarios } from "@/lib/scenarios";
import WelcomeScreen from "@/components/welcome-screen";
import GameScreenComponent from "@/components/game-screen";
import ResultsScreen from "@/components/results-screen";

export default function Home() {
  // Game state
  const [currentScreen, setCurrentScreen] = useState<GameScreenType>("welcome");
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<'A' | 'B' | null>(null);
  const [userChoices, setUserChoices] = useState<UserChoice[]>([]);

  // Fetch scenarios from the API - get 10 random scenarios
  const { data: scenarios = fallbackScenarios, isLoading, refetch } = useQuery<Scenario[]>({
    queryKey: ['/api/scenarios'],
    queryFn: () => fetch('/api/scenarios?count=10').then(res => res.json()),
    retry: 1,
    refetchOnWindowFocus: false,
  });

  // Start the game with fresh scenarios
  const startGame = () => {
    refetch();
    setCurrentScreen("scenario");
    setCurrentScenario(0);
    setSelectedChoice(null);
    setUserChoices([]);
  };

  // Handle user choice
  const handleChoice = (choice: 'A' | 'B') => {
    setSelectedChoice(choice);
    
    // Record the user's choice
    if (scenarios && scenarios[currentScenario]) {
      const scenario = scenarios[currentScenario];
      const newChoice: UserChoice = {
        scenarioId: scenario.id,
        question: scenario.question,
        choice: choice,
        choiceText: scenario.choices[choice],
        responseText: scenario.responses[choice],
        imageUrl: scenario.images[choice]
      };
      
      setUserChoices(prev => [...prev, newChoice]);
    }
    
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
    setUserChoices([]);
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
          <ResultsScreen 
            onRestart={resetGame} 
            userChoices={userChoices}
          />
        )}
      </div>
    </div>
  );
}
