import { useNavigate } from "react-router-dom";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import GroupsIcon from "@mui/icons-material/Groups";
import LeaderboardOutlinedIcon from "@mui/icons-material/LeaderboardOutlined";
import LinkIcon from "@mui/icons-material/Link";
import PersonIcon from "@mui/icons-material/Person";
import SportsScoreIcon from "@mui/icons-material/SportsScore";
import WhatshotOutlinedIcon from "@mui/icons-material/WhatshotOutlined";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";
import brologo from "../../assets/imgs/brologo.webp";
import RingStrip from "../Util/RingStrip";
import { useAuth } from "../../context/AuthContext";

const STEPS = [
  {
    Icon: AddCircleOutlineIcon,
    title: "Build your league",
    text: "Pick a structure — teams of two, bigger squads, or everyone solo — then choose from over 100 events, or add your own.",
  },
  {
    Icon: LinkIcon,
    title: "Send one link",
    text: "Share a single invite link. People tap it, pick a team, and they're in. Returning players pick up right where they left off.",
  },
  {
    Icon: SportsScoreIcon,
    title: "Keep score as you play",
    text: "Record scores from your phone as games finish. Standings update on their own — no spreadsheet required.",
  },
];

const FORMATS = [
  {
    Icon: CompareArrowsIcon,
    title: "Head-to-Head",
    text: "Round robins, swiss rounds, and playoff brackets — with run-offs for every place, if you want them.",
  },
  {
    Icon: PersonIcon,
    title: "Individual",
    text: "Everyone posts a score; team results add up as totals or averages. Golf, bowling, that kind of thing.",
  },
  {
    Icon: GroupsIcon,
    title: "Team",
    text: "One score for the whole team — trivia, kickball, group games.",
  },
  {
    Icon: AccountTreeOutlinedIcon,
    title: "Free-for-All",
    text: "Everyone goes at once. Tap finishers in order and the points take care of themselves.",
  },
];

const HISTORY = [
  {
    Icon: LeaderboardOutlinedIcon,
    title: "All-time leaderboards",
    text: "Points, wins, and podiums for every player and team, year after year.",
  },
  {
    Icon: WhatshotOutlinedIcon,
    title: "Records & rivalries",
    text: "All-time bests get their own marker, and head-to-head history builds between players over the years.",
  },
  {
    Icon: EmojiEventsOutlinedIcon,
    title: "Names that live on",
    text: "Team names carry their history with them — hand one down and the record book follows.",
  },
];

/** The front door: what Brolympics is in 2026, in the app's own design
 * language. Public route -- this is the pitch a curious visitor sees. */
const About = () => {
  const navigate = useNavigate();
  const { firebaseUser } = useAuth();

  const primaryCta = firebaseUser
    ? { label: "Create your own league", to: "/start-league" }
    : { label: "Create your own league", to: "/auth/create-account" };

  return (
    <div className="min-h-screen-minus-nav">
      <div className="w-full max-w-3xl mx-auto container-padding">
        {/* Hero */}
        <section className="flex flex-col items-center pt-10 pb-8 text-center">
          <img src={brologo} alt="Brolympics" className="h-16" />
          <RingStrip className="w-24 mt-4" />
          <h1 className="pt-6 text-4xl font-bold leading-tight text-near-black">
            Run your own Olympics.
          </h1>
          <p className="max-w-md pt-3 text-light">
            Brolympics turns a weekend of games with friends into a real
            competition — live scores, proper brackets, and a history that
            sticks around.
          </p>
          <div className="flex flex-col items-center w-full max-w-xs gap-3 pt-6">
            <button
              className="w-full py-3 font-semibold text-white transition-colors rounded-full bg-primary hover:bg-primary-dark"
              onClick={() => navigate(primaryCta.to)}
            >
              {primaryCta.label}
            </button>
            {!firebaseUser && (
              <button
                className="text-sm font-semibold text-primary"
                onClick={() => navigate("/auth/login")}
              >
                Already have an account? Sign in
              </button>
            )}
          </div>
        </section>

        {/* How it works */}
        <section className="py-6">
          <h2 className="mb-4 header-3">How it works</h2>
          <div className="space-y-3">
            {STEPS.map(({ Icon, title, text }, i) => (
              <div className="flex gap-3 p-4 card" key={title}>
                <span className="flex items-center justify-center rounded-lg w-9 h-9 shrink-0 bg-primary/10">
                  <Icon sx={{ fontSize: 20 }} className="text-primary" />
                </span>
                <div>
                  <h3 className="font-semibold leading-tight">
                    <span className="text-light">{i + 1}.</span> {title}
                  </h3>
                  <p className="pt-1 text-sm text-light">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Formats */}
        <section className="py-6">
          <h2 className="mb-1 header-3">Every kind of game</h2>
          <p className="mb-4 text-sm text-light">
            Four formats cover just about everything. Mix them however you
            like.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {FORMATS.map(({ Icon, title, text }) => (
              <div className="p-4 card" key={title}>
                <div className="flex items-center gap-2">
                  <Icon sx={{ fontSize: 20 }} className="text-primary" />
                  <h3 className="font-semibold">{title}</h3>
                </div>
                <p className="pt-1.5 text-sm text-light">{text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* History */}
        <section className="py-6">
          <h2 className="mb-1 header-3">A history that lasts</h2>
          <p className="mb-4 text-sm text-light">
            Everything you record stays with your league.
          </p>
          <div className="space-y-3">
            {HISTORY.map(({ Icon, title, text }) => (
              <div className="flex gap-3 p-4 card" key={title}>
                <span className="flex items-center justify-center rounded-lg w-9 h-9 shrink-0 bg-primary/10">
                  <Icon sx={{ fontSize: 20 }} className="text-primary" />
                </span>
                <div>
                  <h3 className="font-semibold leading-tight">{title}</h3>
                  <p className="pt-1 text-sm text-light">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer CTA */}
        <section className="flex flex-col items-center py-10 text-center">
          <RingStrip className="w-20" />
          <h2 className="pt-4 text-2xl font-bold text-near-black">
            Ready when you are.
          </h2>
          <button
            className="w-full max-w-xs py-3 mt-5 font-semibold text-white transition-colors rounded-full bg-primary hover:bg-primary-dark"
            onClick={() => navigate(primaryCta.to)}
          >
            {primaryCta.label}
          </button>
        </section>
      </div>
    </div>
  );
};

export default About;
