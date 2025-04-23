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
          A: "Send another text saying 'Oops, my friend stole my phone!'",
          B: "Double down and add 'That was meant for you btw' even though it wasn't."
        },
        responses: {
          A: "Your crush replies 'Weird, it looks like YOUR writing style...' Now you're caught in a lie AND they're analyzing your texting patterns.",
          B: "Your crush actually believes you, starts responding to your accidental text seriously, and now you're trapped in a conversation you're completely unprepared for."
        },
        images: {
          A: "https://images.unsplash.com/photo-1554744512-d6c603f27c54?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
          B: "https://images.unsplash.com/photo-1534643960519-11ad79bc19df?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
        }
      },
      {
        question: "You wave at someone, but they're not waving at you. What do you do?",
        choices: {
          A: "Pretend you were swatting at a fly and make insect-killing noises.",
          B: "Continue waving while slowly turning in a circle as if you're waving at everyone."
        },
        responses: {
          A: "Your impromptu fly-killing pantomime is so elaborate that someone calls pest control. Now you have to explain to an exterminator why they were summoned to a fly-free zone.",
          B: "Your 360-degree waving spectacle catches everyone's attention. Someone starts filming what they think is a flash mob beginning. You are now the reluctant star of a TikTok called 'Weirdest Dance Ever'."
        },
        images: {
          A: "https://images.unsplash.com/photo-1499714608240-22fc6ad53fb2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
          B: "https://images.unsplash.com/photo-1484688493527-670f98f9b195?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
        }
      },
      {
        question: "You forgot your coworker's name mid-conversation. What's your move?",
        choices: {
          A: "Call them 'buddy' and 'dude' for the entire conversation.",
          B: "Ask if they're on Instagram so you can 'follow them' but really just to see their name."
        },
        responses: {
          A: "You call them 'buddy' 17 times in a 2-minute conversation. They think you're having a stroke. HR is now concerned about your mental health.",
          B: "They say 'sure, I'm @johnsmith232' but you accidentally like their vacation photos from 3 years ago while stalking their profile. Double fail!"
        },
        images: {
          A: "https://images.unsplash.com/photo-1519575706483-221027bfbb31?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
          B: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
        }
      },
      {
        question: "The cashier says 'Enjoy your meal' and you reply 'You too!'. What now?",
        choices: {
          A: "Add 'I mean, enjoy serving other people's meals, not eating my meal, because that would be weird.'",
          B: "Double down with 'Yes, feel free to take a bite, you look hungry.'"
        },
        responses: {
          A: "Your rambling explanation somehow makes everything worse. The cashier stares blankly while the line behind you grows. Someone whispers 'Just move on, word-vomit.'",
          B: "The cashier is stunned into silence by your offer. The manager overhears and now they're implementing a new staff policy about 'not accepting food from customers' with your photo attached."
        },
        images: {
          A: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
          B: "https://images.unsplash.com/photo-1565938529776-763a68f9fa41?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
        }
      },
      {
        question: "You're in an elevator when someone you barely know gets in. Do you:",
        choices: {
          A: "Announce 'Going up!' in your best elevator operator voice even though you're clearly going down.",
          B: "Ask them to press a floor button for you when you're already standing right next to the panel."
        },
        responses: {
          A: "They look concerned about your directional confusion and press the emergency button. You spend the next 45 minutes explaining to maintenance staff that you were just trying to be 'quirky'.",
          B: "They awkwardly reach across you to press the button, accidentally pressing three wrong floors. Now you're both trapped in a multi-stop elevator journey of eternal silence."
        },
        images: {
          A: "https://images.unsplash.com/photo-1500841280667-c454583e3f34?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
          B: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
        }
      },
      {
        question: "You're at dinner and realize you have spinach in your teeth after talking for 10 minutes. What do you do?",
        choices: {
          A: "Smile bigger, thinking maybe no one will notice if you look confident enough.",
          B: "Lick your teeth really obviously while maintaining eye contact."
        },
        responses: {
          A: "Your big smile just puts your spinach on full display like a green billboard. Someone takes a picture 'for the memories' but you know it's for their group chat.",
          B: "Your weird tongue gymnastics make everyone at the table stop talking. Your date later texts their friend: 'The date was going well until they started doing... something with their tongue?'"
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
      },
      {
        question: "You're giving a presentation when your screen shares your personal browsing history. What do you do?",
        choices: {
          A: "Quickly close the window and continue as if nothing happened.",
          B: "Make a joke about how your research for the presentation took some weird turns."
        },
        responses: {
          A: "Everyone saw your 'how to pretend you know what you're talking about' searches. Your attempt to ignore it has failed spectacularly.",
          B: "Your joke lands surprisingly well! A colleague even confesses they've watched the same cat videos. Crisis averted through humor!"
        },
        images: {
          A: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
          B: "https://images.unsplash.com/photo-1573496358961-3c82861ab8f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
        }
      },
      {
        question: "Someone calls out 'Hey!' behind you and you turn, but they were talking to someone else. What's your move?",
        choices: {
          A: "Pretend you were just stretching or checking something behind you.",
          B: "Make eye contact and give a confident nod anyway."
        },
        responses: {
          A: "Your sudden interest in the ceiling architecture isn't fooling anyone. The person gives you a sympathetic smile - we've all been there.",
          B: "Your confident nod confuses them briefly, but they return it! You've just made a connection through pure awkwardness."
        },
        images: {
          A: "https://images.unsplash.com/photo-1589156288859-f0cb0d82b065?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
          B: "https://images.unsplash.com/photo-1551966775-a4ddc8df052b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
        }
      },
      {
        question: "Your stomach growls loudly during a silent moment in a meeting. How do you handle it?",
        choices: {
          A: "Ignore it completely and maintain intense eye contact with the speaker.",
          B: "Pat your stomach and say 'I guess someone has an opinion on this topic!'"
        },
        responses: {
          A: "Your poker face is impressive, but your colleague whispers 'lunch after this?' You've accidentally networked through your digestive system.",
          B: "Your joke breaks the tension and several people laugh. The meeting suddenly feels more relaxed. Hunger: the great equalizer."
        },
        images: {
          A: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
          B: "https://images.unsplash.com/photo-1543269865-cbf427effbad?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
        }
      },
      {
        question: "You accidentally like a 3-year-old Instagram photo of someone you just met. What now?",
        choices: {
          A: "Unlike it immediately and hope they didn't get a notification.",
          B: "Like several more recent photos to make it seem intentional."
        },
        responses: {
          A: "Too late! They've already seen the notification. Enjoy your new reputation as the group's dedicated stalker.",
          B: "Your photo-liking spree is now extremely obvious. They text you 'Enjoying my profile?' Your cover story needs work."
        },
        images: {
          A: "https://images.unsplash.com/photo-1616469829941-c7200edec809?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
          B: "https://images.unsplash.com/photo-1534008757030-27299c4371b6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
        }
      },
      {
        question: "You're introduced to someone and immediately forget their name. When you need to introduce them to someone else, you:",
        choices: {
          A: "Say 'Have you two met?' and let them introduce themselves.",
          B: "Mumble their name so badly they have to correct you."
        },
        responses: {
          A: "Smooth move! Crisis averted, though they seem to suspect your clever name-forgetting evasion technique.",
          B: "Your 'This is mmmrmph' gets you a raised eyebrow and 'It's Michael. We've met three times.' Name remembering is not your superpower."
        },
        images: {
          A: "https://images.unsplash.com/photo-1501290741922-b56c0d0884af?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
          B: "https://images.unsplash.com/photo-1552058544-f2b08422138a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
        }
      },
      {
        question: "You send a screenshot of a conversation to the very person you were talking about. What's your damage control?",
        choices: {
          A: "Claim your account was hacked by a mischievous friend.",
          B: "Own up to it and apologize immediately."
        },
        responses: {
          A: "They're not buying your hacking story. Your 'friend' must be very interested in sharing screenshots of private conversations at 2 AM.",
          B: "Your honesty is appreciated, though things will be awkward for a while. At least they know you're not a good liar - silver lining?"
        },
        images: {
          A: "https://images.unsplash.com/photo-1580894732930-0babd100d356?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
          B: "https://images.unsplash.com/photo-1597138804456-e7dca7f59d5b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
        }
      },
      {
        question: "During a video call, someone walks behind you in embarrassing clothing. You:",
        choices: {
          A: "Ignore it completely as if nothing happened.",
          B: "Apologize and briefly explain the situation with humor."
        },
        responses: {
          A: "Your poker face is impressive, but the chat is blowing up with comments about the 'unicorn onesie incident'. It will live in company lore forever.",
          B: "Your quick explanation and laugh defuses the situation. Your boss admits their kid once ran in during a board meeting. Humanity: confirmed."
        },
        images: {
          A: "https://images.unsplash.com/photo-1613979098226-9a5bbcd5b398?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
          B: "https://images.unsplash.com/photo-1591035897819-f4bdf739f446?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
        }
      },
      {
        question: "You walk into a glass door in front of a crowd. Your next move?",
        choices: {
          A: "Inspect the door as if it's poorly designed and clearly the door's fault.",
          B: "Laugh at yourself and take a theatrical bow."
        },
        responses: {
          A: "Your serious inspection of the 'faulty door' isn't convincing anyone, especially since you left a perfect face print as evidence.",
          B: "Your ability to laugh at yourself wins over the witnesses. A child high-fives you for 'the best door-bonk ever.' You're a legend now."
        },
        images: {
          A: "https://images.unsplash.com/photo-1567445514258-80691216d651?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
          B: "https://images.unsplash.com/photo-1565034957851-89df1348edbb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
        }
      },
      {
        question: "Your credit card gets declined at dinner with friends. What do you do?",
        choices: {
          A: "Blame it on the bank's system and try another card.",
          B: "Ask if someone can cover you and offer to pay them back immediately via app."
        },
        responses: {
          A: "Your second card also gets declined. The awkwardness multiplies as you rummage through your wallet for a mythical working card.",
          B: "Your friend covers the bill, and you send them the money right away. Crisis averted, though you'll be checking your bank account as soon as you get home."
        },
        images: {
          A: "https://images.unsplash.com/photo-1574607383172-1421479aec9d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
          B: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
        }
      },
      {
        question: "You accidentally send a risky text to your parent instead of your partner. What's your recovery plan?",
        choices: {
          A: "Send 'Sorry, wrong person!' and never speak of it again.",
          B: "Claim your phone was stolen and that wasn't you."
        },
        responses: {
          A: "Your parent replies 'I guessed that wasn't for me' with too many awkward emojis. Family gatherings will be weird for a while.",
          B: "Your 'phone theft' story falls apart when you have to explain why the 'thief' only sent one inappropriate message then gave the phone back."
        },
        images: {
          A: "https://images.unsplash.com/photo-1553775282-20af80779df7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
          B: "https://images.unsplash.com/photo-1605565348518-bef3e7d6fed8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
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
