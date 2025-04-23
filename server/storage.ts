import { users, type User, type InsertUser, scenarios, type Scenario, type InsertScenario } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Scenario methods
  getAllScenarios(): Promise<Scenario[]>;
  getScenario(id: number): Promise<Scenario | undefined>;
  createScenario(scenario: InsertScenario): Promise<Scenario>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private scenarios: Map<number, Scenario>;
  currentUserId: number;
  currentScenarioId: number;

  constructor() {
    this.users = new Map();
    this.scenarios = new Map();
    this.currentUserId = 1;
    this.currentScenarioId = 1;
    
    // Initialize with default scenarios
    this.initializeScenarios();
  }

  private initializeScenarios() {
    const defaultScenarios: InsertScenario[] = [
      {
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
      },
      {
        question: "You forgot your coworker's name mid-conversation. What's your move?",
        choices: {
          A: "Ask them to put their number in your phone to 'check the spelling'.",
          B: "Introduce them to someone else hoping they say their name."
        },
        responses: {
          A: "Clever move! They enter their contact as 'Mike (Your coworker for 3 years)'. They knew exactly what you were doing.",
          B: "Your plan backfires when they say 'Oh, we've met!' and you now have two people whose names you don't remember."
        },
        images: {
          A: "https://images.unsplash.com/photo-1519575706483-221027bfbb31?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
          B: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
        }
      },
      {
        question: "The cashier says 'Enjoy your meal' and you reply 'You too!'. What now?",
        choices: {
          A: "Laugh it off and acknowledge the mistake.",
          B: "Walk away quickly and never return to this establishment."
        },
        responses: {
          A: "You both laugh, and the cashier admits they've done the same thing. Awkward moment becomes a human connection!",
          B: "You speed-walk out, but you really like their food. You're now doomed to use the delivery app with its ridiculous fees."
        },
        images: {
          A: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
          B: "https://images.unsplash.com/photo-1565938529776-763a68f9fa41?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
        }
      },
      {
        question: "You're in an elevator when someone you barely know gets in. Do you:",
        choices: {
          A: "Make small talk about the weather.",
          B: "Pretend to be deeply focused on your phone."
        },
        responses: {
          A: "You mention it might rain, they disagree, and you spend 12 floors debating cloud patterns. Elevator meteorology wasn't on your agenda today.",
          B: "You stare at a blank screen for 30 seconds rather than risk conversation. Modern social skills at their finest!"
        },
        images: {
          A: "https://images.unsplash.com/photo-1500841280667-c454583e3f34?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
          B: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
        }
      },
      {
        question: "You're at dinner and realize you have spinach in your teeth after talking for 10 minutes. What do you do?",
        choices: {
          A: "Excuse yourself to the bathroom immediately.",
          B: "Make a joke about it and remove it at the table."
        },
        responses: {
          A: "You return from the bathroom to discover EVERYONE knew and no one told you. Your trust issues are now completely justified.",
          B: "Your self-deprecating humor works! Everyone laughs, though your date whispers they were trying to signal you for minutes."
        },
        images: {
          A: "https://images.unsplash.com/photo-1550975559-a676f35206bc?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
          B: "https://images.unsplash.com/photo-1543342384-1f1350e27861?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
        }
      },
      {
        question: "You call your teacher 'Mom' in front of the entire class. Your next move?",
        choices: {
          A: "Laugh it off and say 'That just happened.'",
          B: "Immediately drop the class and change schools."
        },
        responses: {
          A: "Your classmates laugh WITH you (mostly). Your teacher shares she once called her boss 'Dad.' Awkward solidarity!",
          B: "Too late! Videos already circulating. You're now known as 'Mommy's Boy' in three different WhatsApp groups."
        },
        images: {
          A: "https://images.unsplash.com/photo-1588075592446-265fd1e6e76f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
          B: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
        }
      },
      {
        question: "Your phone starts playing embarrassing music loudly in public. Do you:",
        choices: {
          A: "Frantically try to turn it off while looking panicked.",
          B: "Own it and start grooving to 'Baby Shark' like it's your jam."
        },
        responses: {
          A: "Your panic makes your fingers slip, somehow increasing the volume to maximum. The entire store now knows your secret playlist.",
          B: "Your confidence is admirable! A child joins in, then their parent. You've accidentally started a flash mob to 'Baby Shark'."
        },
        images: {
          A: "https://images.unsplash.com/photo-1549417229-aa67d3263c09?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
          B: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
        }
      },
      {
        question: "You trip and fall in front of a crowd. What's your recovery strategy?",
        choices: {
          A: "Get up quickly and walk away as if nothing happened.",
          B: "Take a bow and say 'Thank you, I'll be here all week!'"
        },
        responses: {
          A: "You speed-walk away with a flaming face, but hear someone whisper 'been there.' Solidarity in public embarrassment!",
          B: "Your theatrical bow gets a round of applause! You've turned a stumble into stage presence. Broadway is calling!"
        },
        images: {
          A: "https://images.unsplash.com/photo-1515248137880-45e105b5e44a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
          B: "https://images.unsplash.com/photo-1508520001581-25afed9b1bc3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
        }
      }
    ];

    // Create all scenarios
    defaultScenarios.forEach(scenario => {
      this.createScenario(scenario);
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAllScenarios(): Promise<Scenario[]> {
    return Array.from(this.scenarios.values());
  }

  async getScenario(id: number): Promise<Scenario | undefined> {
    return this.scenarios.get(id);
  }

  async createScenario(insertScenario: InsertScenario): Promise<Scenario> {
    const id = this.currentScenarioId++;
    const scenario: Scenario = { ...insertScenario, id };
    this.scenarios.set(id, scenario);
    return scenario;
  }
}

export const storage = new MemStorage();
