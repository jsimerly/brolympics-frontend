/** The event catalog: canonical names + formats (+ scoring direction where it
 * isn't high-score-wins). Doubles as name standardization across leagues --
 * everyone's "Cornhole" is the same EventType name, which makes popularity
 * analytics possible. Ordered roughly by popularity; the first few show as
 * "Popular" before the user searches. */
export const PRESET_EVENTS = [
  // the classics
  { name: "Cornhole", format: "h2h" },
  { name: "Beer Pong", format: "h2h" },
  { name: "Flip Cup", format: "h2h" },
  { name: "Spikeball", format: "h2h" },
  { name: "Beer Die", format: "h2h" },
  { name: "Kan Jam", format: "h2h" },
  { name: "Mini-Golf", format: "ind", is_high_score_wins: false },
  { name: "Bowling", format: "ind" },
  { name: "Trivia", format: "team" },
  { name: "Mario Kart", format: "ffa" },

  // backyard + bar games
  { name: "Ladder Toss", format: "h2h" },
  { name: "Washers", format: "h2h" },
  { name: "Horseshoes", format: "h2h" },
  { name: "Bocce", format: "h2h" },
  { name: "Croquet", format: "h2h" },
  { name: "Polish Horseshoes", format: "h2h" },
  { name: "Beersbee", format: "h2h" },
  { name: "Stump", format: "h2h" },
  { name: "Hammerschlagen", format: "h2h" },
  { name: "Quarters", format: "h2h" },
  { name: "Boat Race", format: "h2h" },
  { name: "Darts", format: "h2h" },
  { name: "Billiards", format: "h2h" },
  { name: "Shuffleboard", format: "h2h" },
  { name: "Foosball", format: "h2h" },
  { name: "Air Hockey", format: "h2h" },
  { name: "Ping Pong", format: "h2h" },
  { name: "Giant Jenga", format: "h2h" },
  { name: "Yard Pong", format: "h2h" },
  { name: "Slip N Slide Kickball", format: "team" },

  // racket + net sports
  { name: "Pickleball", format: "h2h" },
  { name: "Tennis", format: "h2h" },
  { name: "Badminton", format: "h2h" },
  { name: "Volleyball", format: "h2h" },
  { name: "Roundnet", format: "h2h" },

  // field + court
  { name: "Basketball", format: "h2h" },
  { name: "Knockout", format: "ffa" },
  { name: "Soccer Tennis", format: "h2h" },
  { name: "Wiffle Ball", format: "h2h" },
  { name: "Kickball", format: "team" },
  { name: "Dodgeball", format: "team" },
  { name: "Ultimate Frisbee", format: "team" },
  { name: "Flag Football", format: "team" },
  { name: "Tug of War", format: "h2h" },

  // strength + feats
  { name: "Arm Wrestling", format: "h2h" },
  { name: "Home Run Derby", format: "ind" },
  { name: "Free Throw Contest", format: "ind" },
  { name: "Three-Point Contest", format: "ind" },
  { name: "Longest Drive", format: "ind" },
  { name: "Closest to the Pin", format: "ind", is_high_score_wins: false },
  { name: "Punt Pass Kick", format: "ind" },
  { name: "Push-Up Contest", format: "ind" },
  { name: "Pull-Up Contest", format: "ind" },
  { name: "Plank Hold", format: "ind" },
  { name: "Bench Press", format: "ind" },
  { name: "Deadlift", format: "ind" },
  { name: "Keg Toss", format: "ind" },
  { name: "Watermelon Seed Spitting", format: "ind" },
  { name: "Paper Airplane Distance", format: "ind" },
  { name: "Egg Toss", format: "team" },

  // precision + skill
  { name: "Golf", format: "ind", is_high_score_wins: false },
  { name: "Disc Golf", format: "ind", is_high_score_wins: false },
  { name: "Skee-Ball", format: "ind" },
  { name: "Axe Throwing", format: "ind" },
  { name: "Archery", format: "ind" },
  { name: "Casting Contest", format: "ind" },
  { name: "Basketball Pop-a-Shot", format: "ind" },

  // races (low time wins)
  { name: "5K", format: "ind", is_high_score_wins: false },
  { name: "Mile Run", format: "ind", is_high_score_wins: false },
  { name: "100m Dash", format: "ind", is_high_score_wins: false },
  { name: "Swimming Race", format: "ind", is_high_score_wins: false },
  { name: "Go-Karting", format: "ind", is_high_score_wins: false },
  { name: "Beer Mile", format: "ind", is_high_score_wins: false },
  { name: "Relay Race", format: "team", is_high_score_wins: false },
  { name: "Canoe Race", format: "team", is_high_score_wins: false },
  { name: "Three-Legged Race", format: "team", is_high_score_wins: false },
  { name: "Foot Race", format: "ffa" },
  { name: "Obstacle Course", format: "ind", is_high_score_wins: false },

  // eating + drinking
  { name: "Hot Dog Eating", format: "ind" },
  { name: "Wing Eating", format: "ind" },
  { name: "Pie Eating", format: "ind", is_high_score_wins: false },
  { name: "Chug Race", format: "ind", is_high_score_wins: false },

  // brains + party
  { name: "Poker", format: "ffa" },
  { name: "Blackjack", format: "ffa" },
  { name: "Euchre", format: "h2h" },
  { name: "Spades", format: "h2h" },
  { name: "Cribbage", format: "h2h" },
  { name: "Chess", format: "h2h" },
  { name: "Checkers", format: "h2h" },
  { name: "Connect Four", format: "h2h" },
  { name: "Battleship", format: "h2h" },
  { name: "Rock Paper Scissors", format: "h2h" },
  { name: "Charades", format: "team" },
  { name: "Pictionary", format: "team" },
  { name: "Family Feud", format: "team" },
  { name: "Scavenger Hunt", format: "team" },
  { name: "Escape Room", format: "team", is_high_score_wins: false },
  { name: "Karaoke", format: "ind" },
  { name: "Cook-Off", format: "ind" },
  { name: "Typing Test", format: "ind" },
  { name: "Rubik's Cube", format: "ind", is_high_score_wins: false },
  { name: "Cup Stacking", format: "ind", is_high_score_wins: false },
  { name: "Puzzle Race", format: "team", is_high_score_wins: false },
  { name: "Musical Chairs", format: "ffa" },
  { name: "Spoons", format: "ffa" },
  { name: "Uno", format: "ffa" },
  { name: "Catan", format: "ffa" },
  { name: "Monopoly", format: "ffa" },

  // video games
  { name: "Super Smash Bros", format: "ffa" },
  { name: "Rocket League", format: "h2h" },
  { name: "FIFA", format: "h2h" },
  { name: "Madden", format: "h2h" },
  { name: "NBA 2K", format: "h2h" },
  { name: "MLB The Show", format: "h2h" },
  { name: "Golf With Your Friends", format: "ind", is_high_score_wins: false },
  { name: "Wii Sports Bowling", format: "ind" },
  { name: "Tetris", format: "ind" },
  { name: "Pac-Man", format: "ind" },
  { name: "Fortnite", format: "ffa" },
];

export const POPULAR_COUNT = 6;

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
