import { PersonalityResult } from './types';

// Helper function to determine personality type based on choice patterns
export function determinePersonalityResult(choicesACount: number, choicesBCount: number): PersonalityResult {
  // Calculate the ratio of A choices to total choices
  const totalChoices = choicesACount + choicesBCount;
  const ratioA = choicesACount / totalChoices;

  if (ratioA > 0.75) {
    return {
      title: "AwkwardAvoidanceExpert",
      description: "Congratulations! You're the human equivalent of a turtle retreating into its shell. Your risk-aversion game is so strong, you probably check for traffic three times before crossing an empty street. If they gave Olympic medals for overthinking social interactions, you'd win gold, silver, AND bronze. Your browser history definitely includes 'how to escape conversation without being rude' and 'is it weird if I...'",
      imageUrl: ""
    };
  } else if (ratioA > 0.5) {
    return {
      title: "SocialChameleon",
      description: "You're like a social GPS constantly 'recalculating route.' You've perfected the art of the fake laugh and have at least seven different versions of it depending on who you're talking to. You probably rehearse conversations in the shower but still somehow say 'you too' when the waiter says 'enjoy your meal.' Your friends describe you as 'mostly normal' which is the most backhanded compliment ever, but you'll take it!",
      imageUrl: ""
    };
  } else if (ratioA > 0.25) {
    return {
      title: "CringeConnoisseur",
      description: "You're the person who accidentally replies-all to a company email and then DOUBLES DOWN with a meme. Your ability to transform mortifying moments into entertaining stories is unmatched. You've made peace with the fact that your life is basically a sitcom blooper reel. Your Google history includes 'how to recover from calling your boss mom' and 'is it too late to move to another country?' Your friends keep you around purely for entertainment value.",
      imageUrl: ""
    };
  } else {
    return {
      title: "CatastropheMagnet",
      description: "If there's an embarrassing situation within a 50-mile radius, you'll find it, improve it, and make it legendary. You don't just trip, you take down an entire wedding cake display. When you text the wrong person, it's not just anyone - it's your ex AND their new partner because somehow you're in a group chat. Your life motto is 'go big or go home' and the universe has decided you're never going home. You're the reason social media has a delete button.",
      imageUrl: ""
    };
  }
}

// Get a funny quote based on the user's choices
export function getFunnyQuote(choicesACount: number, choicesBCount: number): string {
  const funnyQuotes = [
    "Your awkwardness level is so high, your Autocorrect just gives up and says 'You're on your own with this one.'",
    "If social disasters were a currency, you'd make Elon Musk look middle-class.",
    "You don't just attract awkward moments, you're like their cult leader. They worship you.",
    "Your ability to create uncomfortable silences is practically a superpower. Have you considered working for the CIA?",
    "You're the reason etiquette books need constant updates. They never see you coming.",
    "You navigate social interactions like you're playing Minesweeper with your eyes closed. Bold strategy.",
    "Your awkward encounters aren't just stories, they're cautionary tales that parents tell their children.",
    "You're living proof that natural selection sometimes takes a coffee break.",
    "Your social skills are like that IKEA furniture with missing pieces - technically functional but everyone's concerned.",
    "Other people have a filter between their brain and mouth. Yours appears to be made of Swiss cheese.",
    "Your cringe moments aren't just memories, they're your brain's favorite 3AM playlist.",
    "You've turned blushing into an Olympic sport, and you're consistently taking home the gold.",
    "Most people avoid awkwardness. You collect it like limited edition trading cards.",
    "Your personal brand of chaos is so distinct, scientists should name it after you.",
    "If failing upwards was an art form, you'd be hanging in the Louvre.",
    "Some people worry about alien contact. Aliens worry about encountering you at a social gathering."
  ];
  
  // Select a quote based on the ratio of choices (with some randomness)
  const seed = (choicesACount * 3 + choicesBCount * 7) % funnyQuotes.length;
  const randomIndex = (seed + Math.floor(Math.random() * 3)) % funnyQuotes.length;
  
  return funnyQuotes[randomIndex];
}