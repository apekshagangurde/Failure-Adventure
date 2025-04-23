// Define types for the game state
export interface GameState {
  currentScenario: number;
  totalScenarios: number;
  selectedChoice: 'A' | 'B' | null;
  scenarios: Scenario[];
  userChoices: UserChoice[];
}

export interface UserChoice {
  scenarioId: number;
  question: string;
  choice: 'A' | 'B';
  choiceText: string;
  responseText: string;
  imageUrl: string;
}

export interface Scenario {
  id: number;
  question: string;
  choices: {
    A: string;
    B: string;
  };
  responses: {
    A: string;
    B: string;
  };
  images: {
    A: string;
    B: string;
  };
}

// Fun personality results based on user choices
export interface PersonalityResult {
  title: string;
  description: string;
  imageUrl: string;
}

export type GameScreen = 'welcome' | 'scenario' | 'response' | 'results';
