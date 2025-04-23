import { PersonalityResult } from './types';

// Helper function to determine personality type based on choice patterns
export function determinePersonalityResult(choicesACount: number, choicesBCount: number): PersonalityResult {
  // Calculate the ratio of A choices to total choices
  const totalChoices = choicesACount + choicesBCount;
  const ratioA = choicesACount / totalChoices;

  if (ratioA > 0.75) {
    return {
      title: "The Cautious Overthinker",
      description: "You prefer to play it safe and minimize social risks. While this means fewer spectacular fails, you might be missing out on some of life's most entertaining moments. Remember, sometimes the best stories come from our most embarrassing failures!",
      imageUrl: "https://images.unsplash.com/photo-1542596594-649edbc13630?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    };
  } else if (ratioA > 0.5) {
    return {
      title: "The Practical Improviser",
      description: "You balance caution with calculated risks. You're good at finding the middle path through awkward situations, adapting as needed while keeping your dignity mostly intact. Life's embarrassing moments rarely knock you down for long.",
      imageUrl: "https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    };
  } else if (ratioA > 0.25) {
    return {
      title: "The Social Surfer",
      description: "You ride the waves of social awkwardness with a smile. While not completely reckless, you're willing to embrace the unpredictable nature of social interactions. Your ability to laugh at yourself wins you friends even in the most embarrassing situations.",
      imageUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    };
  } else {
    return {
      title: "The Chaos Embracer",
      description: "You leap into awkward situations with enthusiasm! While this sometimes lands you in spectacularly embarrassing scenarios, your willingness to go with the flow and own your failures makes you memorable and often the life of the party. You've collected some legendary stories along the way!",
      imageUrl: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    };
  }
}

// Get a funny quote based on the user's choices
export function getFunnyQuote(choicesACount: number, choicesBCount: number): string {
  const funnyQuotes = [
    "Your awkwardness level is so high, even your WiFi disconnects in social situations.",
    "You don't just face awkward situations - you give them a warm hug and invite them to stay for dinner.",
    "In the game of social graces, you're playing 4D chess while the rest of us are still learning checkers.",
    "Your ability to transform epic fails into legendary stories is basically a superpower.",
    "You navigate social disasters with the grace of a cat on a keyboard - chaotic but somehow still adorable.",
    "Your awkward moments aren't bugs, they're features of your charming personality.",
    "You've turned social awkwardness into an art form. Museums should be calling any day now.",
    "If embarrassing moments were currency, you'd be a billionaire by now.",
    "Your approach to awkwardness is like a meteor hitting Earth - spectacular, memorable, and slightly concerning.",
    "You don't just walk into awkward situations, you dance into them with jazz hands."
  ];
  
  // Select a quote based on the ratio of choices (with some randomness)
  const seed = (choicesACount * 3 + choicesBCount * 7) % funnyQuotes.length;
  const randomIndex = (seed + Math.floor(Math.random() * 3)) % funnyQuotes.length;
  
  return funnyQuotes[randomIndex];
}