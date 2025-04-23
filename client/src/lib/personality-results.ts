import { PersonalityResult } from './types';

// Helper function to determine personality type based on choice patterns
export function determinePersonalityResult(choicesACount: number, choicesBCount: number): PersonalityResult {
  // Calculate the ratio of A choices to total choices
  const totalChoices = choicesACount + choicesBCount;
  const ratioA = choicesACount / totalChoices;

  if (ratioA > 0.75) {
    return {
      title: "Safety Freak",
      description: "You'd wear a helmet to eat soup. Your idea of risk is using a public bathroom without putting toilet paper on the seat. When people say 'live a little,' you're like 'no thanks, I might die.' You Google 'is it normal to...' so much that your search history looks like a medical dictionary written by a hypochondriac.",
      imageUrl: ""
    };
  } else if (ratioA > 0.5) {
    return {
      title: "Awkward Faker",
      description: "You have 5 different fake laughs ready to go at all times. You say 'you too' when the dentist says 'open wide.' You practice conversations in your head but still mess them up. Your friends think you're normal, which just proves they're as weird as you are. Your personality is 50% anxiety and 50% pretending you don't have anxiety.",
      imageUrl: ""
    };
  } else if (ratioA > 0.25) {
    return {
      title: "Human Blooper Reel",
      description: "Your life is what happens between awkward moments. You've sent so many wrong texts to the right people that your friends have a support group. You don't just fall, you create new dance moves on the way down. The coffee shop employees have a nickname for you, and it's not flattering. You've made 'sorry about that' your personal catchphrase.",
      imageUrl: ""
    };
  } else {
    return {
      title: "Walking Disaster",
      description: "If there's a way to make things weird, you'll find it. When you trip, you don't just fall - you take down displays, waiters, and small children with you. Your dating stories make people say 'well at least MY life isn't THAT bad.' You've turned embarrassment into an art form. If embarrassing moments were money, you'd be a billionaire by now.",
      imageUrl: ""
    };
  }
}

// Get a funny quote based on the user's choices
export function getFunnyQuote(choicesACount: number, choicesBCount: number): string {
  const funnyQuotes = [
    "Your life is like America's Funniest Home Videos, but it's just you falling down different sets of stairs.",
    "Your friends keep you around to feel better about their own social skills.",
    "You don't just put your foot in your mouth - you somehow fit both feet, all 10 toes, and a whole shoe store in there.",
    "When God was giving out social skills, you thought he said 'social spills' and asked for extra.",
    "Your brain and mouth are playing a never-ending game of telephone, and the message is always getting messed up.",
    "If awkward moments were dollars, you'd have paid off the national debt by now.",
    "Your social fails are so legendary they should be studied in science class.",
    "When normal people have a bad day, they say 'it can't get worse.' You know for a fact it can and will.",
    "You're not clumsy - gravity just likes you more than other people.",
    "You don't break the ice, you fall through it and create a scene.",
    "Your life should come with background music and a laugh track.",
    "You're the reason they put warning labels on obvious things.",
    "Every time you think you've reached peak awkwardness, you find a new summit to conquer.",
    "Your daily goal: survive without becoming a viral video.",
    "If embarrassment burned calories, you'd be a supermodel.",
    "You've turned 'making things weird' into an Olympic sport, and you're taking home the gold."
  ];
  
  // Select a quote based on the ratio of choices (with some randomness)
  const seed = (choicesACount * 3 + choicesBCount * 7) % funnyQuotes.length;
  const randomIndex = (seed + Math.floor(Math.random() * 3)) % funnyQuotes.length;
  
  return funnyQuotes[randomIndex];
}