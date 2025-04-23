// Define types for the game state
export interface GameState {
  currentScenario: number;
  totalScenarios: number;
  selectedChoice: 'A' | 'B' | null;
  scenarios: Scenario[];
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

export type GameScreen = 'welcome' | 'scenario' | 'response' | 'results';
