import { Scenario } from "./types";

// Fallback scenarios in case the API fails
export const fallbackScenarios: Scenario[] = [
  {
    id: 1,
    question: "You spill coffee on your boss. What do you do?",
    choices: {
      A: "Apologize immediately.",
      B: "Make a joke about it to lighten the mood."
    },
    responses: {
      A: "You quickly apologize, but your boss now knows your coffee addiction. Next time, try to sip with caution!",
      B: "You made a joke, and while it was awkward, you got a nervous laugh. You've learned your lesson—avoid caffeine on meeting days!"
    },
    images: {
      A: "https://images.unsplash.com/photo-1525785967371-87ba44b3e6cf?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      B: "https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    }
  },
  {
    id: 2,
    question: "You accidentally send a text meant for your friend to your crush. What do you do?",
    choices: {
      A: "Apologize and explain.",
      B: "Pretend it didn't happen and hope they don't notice."
    },
    responses: {
      A: "You immediately apologize, but the awkwardness lingers. At least you were honest!",
      B: "You pretend it didn't happen, but your crush keeps glancing at their phone. Awkward."
    },
    images: {
      A: "https://images.unsplash.com/photo-1554744512-d6c603f27c54?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      B: "https://images.unsplash.com/photo-1534643960519-11ad79bc19df?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    }
  },
  {
    id: 3,
    question: "You wave at someone, but they're not waving at you. What do you do?",
    choices: {
      A: "Pretend you were stretching.",
      B: "Commit to the wave and smile anyway."
    },
    responses: {
      A: "You smoothly transition into a stretch, but nobody's buying it. The memory will haunt you at 3 AM for years to come.",
      B: "You keep waving with confidence. A stranger behind you waves back, confused but friendly. Accidental friend made!"
    },
    images: {
      A: "https://images.unsplash.com/photo-1499714608240-22fc6ad53fb2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      B: "https://images.unsplash.com/photo-1484688493527-670f98f9b195?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    }
  }
];
