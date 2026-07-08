/** The event catalog: canonical names + formats (+ scoring direction where it
 * isn't high-score-wins). Doubles as name standardization across leagues --
 * everyone's "Cornhole" is the same EventType name, which makes popularity
 * analytics possible. Ordered roughly by popularity; the first few show as
 * "Popular" before the user searches. */
export const PRESET_EVENTS = [
  // the classics
  { name: "Cornhole", format: "h2h" , category: "The Classics" },
  { name: "Beer Pong", format: "h2h" , category: "The Classics" },
  { name: "Flip Cup", format: "h2h" , category: "The Classics" },
  { name: "Spikeball", format: "h2h" , category: "The Classics" },
  { name: "Beer Die", format: "h2h" , category: "The Classics" },
  { name: "Kan Jam", format: "h2h" , category: "The Classics" },
  { name: "Mini-Golf", format: "ind", is_high_score_wins: false , category: "The Classics" },
  { name: "Bowling", format: "ind" , category: "The Classics" },
  { name: "Trivia", format: "team" , category: "The Classics" },
  { name: "Mario Kart", format: "ffa" , category: "The Classics" },

  // backyard + bar games
  { name: "Ladder Toss", format: "h2h" , category: "Backyard & Bar" },
  { name: "Washers", format: "h2h" , category: "Backyard & Bar" },
  { name: "Horseshoes", format: "h2h" , category: "Backyard & Bar" },
  { name: "Bocce", format: "h2h" , category: "Backyard & Bar" },
  { name: "Croquet", format: "h2h" , category: "Backyard & Bar" },
  { name: "Polish Horseshoes", format: "h2h" , category: "Backyard & Bar" },
  { name: "Beersbee", format: "h2h" , category: "Backyard & Bar" },
  { name: "Stump", format: "h2h" , category: "Backyard & Bar" },
  { name: "Hammerschlagen", format: "h2h" , category: "Backyard & Bar" },
  { name: "Quarters", format: "h2h" , category: "Backyard & Bar" },
  { name: "Boat Race", format: "h2h" , category: "Backyard & Bar" },
  { name: "Darts", format: "h2h" , category: "Backyard & Bar" },
  { name: "Billiards", format: "h2h" , category: "Backyard & Bar" },
  { name: "Shuffleboard", format: "h2h" , category: "Backyard & Bar" },
  { name: "Foosball", format: "h2h" , category: "Backyard & Bar" },
  { name: "Air Hockey", format: "h2h" , category: "Backyard & Bar" },
  { name: "Ping Pong", format: "h2h" , category: "Backyard & Bar" },
  { name: "Giant Jenga", format: "h2h" , category: "Backyard & Bar" },
  { name: "Yard Pong", format: "h2h" , category: "Backyard & Bar" },
  { name: "Slip N Slide Kickball", format: "team" , category: "Backyard & Bar" },

  // racket + net sports
  { name: "Pickleball", format: "h2h" , category: "Racket & Net" },
  { name: "Tennis", format: "h2h" , category: "Racket & Net" },
  { name: "Badminton", format: "h2h" , category: "Racket & Net" },
  { name: "Volleyball", format: "h2h" , category: "Racket & Net" },
  { name: "Roundnet", format: "h2h" , category: "Racket & Net" },

  // field + court
  { name: "Basketball", format: "h2h" , category: "Field & Court" },
  { name: "Knockout", format: "ffa" , category: "Field & Court" },
  { name: "Soccer Tennis", format: "h2h" , category: "Field & Court" },
  { name: "Wiffle Ball", format: "h2h" , category: "Field & Court" },
  { name: "Kickball", format: "team" , category: "Field & Court" },
  { name: "Dodgeball", format: "team" , category: "Field & Court" },
  { name: "Ultimate Frisbee", format: "team" , category: "Field & Court" },
  { name: "Flag Football", format: "team" , category: "Field & Court" },
  { name: "Tug of War", format: "h2h" , category: "Field & Court" },

  // strength + feats
  { name: "Arm Wrestling", format: "h2h" , category: "Strength & Feats" },
  { name: "Home Run Derby", format: "ind" , category: "Strength & Feats" },
  { name: "Free Throw Contest", format: "ind" , category: "Strength & Feats" },
  { name: "Three-Point Contest", format: "ind" , category: "Strength & Feats" },
  { name: "Longest Drive", format: "ind" , category: "Strength & Feats" },
  { name: "Closest to the Pin", format: "ind", is_high_score_wins: false , category: "Strength & Feats" },
  { name: "Punt Pass Kick", format: "ind" , category: "Strength & Feats" },
  { name: "Push-Up Contest", format: "ind" , category: "Strength & Feats" },
  { name: "Pull-Up Contest", format: "ind" , category: "Strength & Feats" },
  { name: "Plank Hold", format: "ind" , category: "Strength & Feats" },
  { name: "Bench Press", format: "ind" , category: "Strength & Feats" },
  { name: "Deadlift", format: "ind" , category: "Strength & Feats" },
  { name: "Keg Toss", format: "ind" , category: "Strength & Feats" },
  { name: "Watermelon Seed Spitting", format: "ind" , category: "Strength & Feats" },
  { name: "Paper Airplane Distance", format: "ind" , category: "Strength & Feats" },
  { name: "Egg Toss", format: "team" , category: "Strength & Feats" },

  // precision + skill
  { name: "Golf", format: "ind", is_high_score_wins: false , category: "Precision & Skill" },
  { name: "Disc Golf", format: "ind", is_high_score_wins: false , category: "Precision & Skill" },
  { name: "Skee-Ball", format: "ind" , category: "Precision & Skill" },
  { name: "Axe Throwing", format: "ind" , category: "Precision & Skill" },
  { name: "Archery", format: "ind" , category: "Precision & Skill" },
  { name: "Casting Contest", format: "ind" , category: "Precision & Skill" },
  { name: "Basketball Pop-a-Shot", format: "ind" , category: "Precision & Skill" },

  // races (low time wins)
  { name: "5K", format: "ind", is_high_score_wins: false , category: "Races" },
  { name: "Mile Run", format: "ind", is_high_score_wins: false , category: "Races" },
  { name: "100m Dash", format: "ind", is_high_score_wins: false , category: "Races" },
  { name: "Swimming Race", format: "ind", is_high_score_wins: false , category: "Races" },
  { name: "Go-Karting", format: "ind", is_high_score_wins: false , category: "Races" },
  { name: "Beer Mile", format: "ind", is_high_score_wins: false , category: "Races" },
  { name: "Relay Race", format: "team", is_high_score_wins: false , category: "Races" },
  { name: "Canoe Race", format: "team", is_high_score_wins: false , category: "Races" },
  { name: "Three-Legged Race", format: "team", is_high_score_wins: false , category: "Races" },
  { name: "Foot Race", format: "ffa" , category: "Races" },
  { name: "Obstacle Course", format: "ind", is_high_score_wins: false , category: "Races" },

  // eating + drinking
  { name: "Hot Dog Eating", format: "ind" , category: "Eating & Drinking" },
  { name: "Wing Eating", format: "ind" , category: "Eating & Drinking" },
  { name: "Pie Eating", format: "ind", is_high_score_wins: false , category: "Eating & Drinking" },
  { name: "Chug Race", format: "ind", is_high_score_wins: false , category: "Eating & Drinking" },

  // brains + party
  { name: "Poker", format: "ffa" , category: "Brains & Party" },
  { name: "Blackjack", format: "ffa" , category: "Brains & Party" },
  { name: "Euchre", format: "h2h" , category: "Brains & Party" },
  { name: "Spades", format: "h2h" , category: "Brains & Party" },
  { name: "Cribbage", format: "h2h" , category: "Brains & Party" },
  { name: "Chess", format: "h2h" , category: "Brains & Party" },
  { name: "Checkers", format: "h2h" , category: "Brains & Party" },
  { name: "Connect Four", format: "h2h" , category: "Brains & Party" },
  { name: "Battleship", format: "h2h" , category: "Brains & Party" },
  { name: "Rock Paper Scissors", format: "h2h" , category: "Brains & Party" },
  { name: "Charades", format: "team" , category: "Brains & Party" },
  { name: "Pictionary", format: "team" , category: "Brains & Party" },
  { name: "Family Feud", format: "team" , category: "Brains & Party" },
  { name: "Scavenger Hunt", format: "team" , category: "Brains & Party" },
  { name: "Escape Room", format: "team", is_high_score_wins: false , category: "Brains & Party" },
  { name: "Karaoke", format: "ind" , category: "Brains & Party" },
  { name: "Cook-Off", format: "ind" , category: "Brains & Party" },
  { name: "Typing Test", format: "ind" , category: "Brains & Party" },
  { name: "Rubik's Cube", format: "ind", is_high_score_wins: false , category: "Brains & Party" },
  { name: "Cup Stacking", format: "ind", is_high_score_wins: false , category: "Brains & Party" },
  { name: "Puzzle Race", format: "team", is_high_score_wins: false , category: "Brains & Party" },
  { name: "Musical Chairs", format: "ffa" , category: "Brains & Party" },
  { name: "Spoons", format: "ffa" , category: "Brains & Party" },
  { name: "Uno", format: "ffa" , category: "Brains & Party" },
  { name: "Catan", format: "ffa" , category: "Brains & Party" },
  { name: "Monopoly", format: "ffa" , category: "Brains & Party" },

  // video games
  { name: "Super Smash Bros", format: "ffa" , category: "Video Games" },
  { name: "Rocket League", format: "h2h" , category: "Video Games" },
  { name: "FIFA", format: "h2h" , category: "Video Games" },
  { name: "Madden", format: "h2h" , category: "Video Games" },
  { name: "NBA 2K", format: "h2h" , category: "Video Games" },
  { name: "MLB The Show", format: "h2h" , category: "Video Games" },
  { name: "Golf With Your Friends", format: "ind", is_high_score_wins: false , category: "Video Games" },
  { name: "Wii Sports Bowling", format: "ind" , category: "Video Games" },
  { name: "Tetris", format: "ind" , category: "Video Games" },
  { name: "Pac-Man", format: "ind" , category: "Video Games" },
  { name: "Fortnite", format: "ffa" , category: "Video Games" },
];

export const POPULAR_COUNT = 6;

/** Categories in catalog order, each with its presets -- the browse view. */
export const catalogByCategory = (exclude = new Set()) => {
  const sections = [];
  const index = new Map();
  for (const preset of PRESET_EVENTS) {
    if (exclude.has(preset.name.toLowerCase())) continue;
    if (!index.has(preset.category)) {
      index.set(preset.category, []);
      sections.push({ category: preset.category, presets: index.get(preset.category) });
    }
    index.get(preset.category).push(preset);
  }
  return sections;
};

/** Case-insensitive substring search over the catalog. Empty query returns
 * the popular slice. */
export const searchPresets = (query, exclude = new Set()) => {
  const q = query.trim().toLowerCase();
  const pool = PRESET_EVENTS.filter(
    (preset) => !exclude.has(preset.name.toLowerCase())
  );
  if (!q) return pool.slice(0, POPULAR_COUNT);
  return pool.filter((preset) => preset.name.toLowerCase().includes(q));
};
