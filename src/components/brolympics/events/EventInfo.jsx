import { format, parseISO } from "date-fns";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import HeadToHead from "./eventInfo/H2hInfo";
import Individual from "./eventInfo/IndInfo";
import TeamEvent from "./eventInfo/TeamInfo";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const QuillDisplay = ({ content }) => (
  <>
    <style>
      {`
        .quill-display-container .quill { border: none; }
        .quill-display-container .ql-container { border: none; font-size: 14px; }
        .quill-display-container .ql-editor { padding: 0; }
        .quill-display-container .ql-editor p { margin-bottom: 1em; }
      `}
    </style>
    <div className="quill-display-container">
      <ReactQuill
        value={content}
        readOnly={true}
        theme="snow"
        modules={{ toolbar: false }}
      />
    </div>
  </>
);

export default QuillDisplay;

const FORMAT_LABEL = {
  h2h: "Head to Head",
  ind: "Individual",
  team: "Team",
  ffa: "Free-for-All",
};

const SCORE_FORMAT_LABEL = {
  B: "Win/Loss only",
  0: "Whole numbers (1)",
  1: "Tenths (1.0)",
  2: "Hundredths (1.00)",
  3: "Thousandths (1.000)",
  16: "Any decimal",
};

const Card = ({ title, children }) => (
  <div className="p-4 bg-white border border-gray-200 rounded-lg">
    <h2 className="pb-2 text-xs font-semibold tracking-wide uppercase text-light">
      {title}
    </h2>
    {children}
  </div>
);

const InfoRow = ({ label, value }) => (
  <div className="flex items-baseline justify-between gap-3 py-1 text-sm">
    <span className="shrink-0 text-light">{label}</span>
    <span className="font-medium text-right">{value}</span>
  </div>
);

const stageSentence = (stage) => {
  const cfg = stage.config || {};
  if (stage.structure === "round_robin") {
    return cfg.full
      ? "Full round robin — everyone plays everyone"
      : `Round robin — ${cfg.games_per_team ?? "?"} games per team`;
  }
  if (stage.structure === "swiss") {
    return `Swiss — ${cfg.rounds ?? "?"} rounds paired by record`;
  }
  if (stage.structure === "knockout") {
    const bits = [cfg.take ? `top ${cfg.take}` : "everyone"];
    if (cfg.classification) bits.push("every place played out");
    else if (cfg.third_place) bits.push("3rd place game");
    return `Playoffs — ${bits.join(", ")}`;
  }
  if (stage.structure === "heats") {
    return cfg.heat_size
      ? `Heats of ${cfg.heat_size}, preset at start`
      : "Heats made at the party";
  }
  if (stage.structure === "open_play") {
    const games = cfg.games_per_team ?? 1;
    return games > 1 ? `${games} games per team` : "One game per team";
  }
  return stage.structure.replace("_", " ");
};

// Quill leaves "<p><br></p>" behind in emptied editors
const hasRules = (rules) =>
  rules && rules.replace(/<[^>]*>/g, "").trim().length > 0;

export const EventInfo = ({ event }) => {
  const fmtDateTime = (iso) => {
    if (!iso) return null;
    try {
      return format(parseISO(iso), "EEE, MMM d 'at' h:mm a");
    } catch {
      return null;
    }
  };

  const starts = fmtDateTime(event.projected_start_date);
  const ends = fmtDateTime(event.projected_end_date);

  const renderEventTypeDetails = () => {
    switch (event.type) {
      case "h2h":
        return <HeadToHead event={event} />;
      case "ind":
        return <Individual event={event} />;
      case "team":
        return <TeamEvent event={event} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl px-4 pb-8 mx-auto space-y-4">
      {(starts || ends || event.location) && (
        <Card title="Time & Place">
          <div className="flex flex-col gap-1.5 text-sm">
            {(starts || ends) && (
              <div className="flex items-center gap-2">
                <EventOutlinedIcon
                  sx={{ fontSize: 18 }}
                  className="shrink-0 text-primary"
                />
                <span>
                  {starts || "TBD"}
                  {ends && <span className="text-light"> – {ends}</span>}
                </span>
              </div>
            )}
            {event.location && (
              <div className="flex items-center gap-2">
                <PlaceOutlinedIcon
                  sx={{ fontSize: 18 }}
                  className="shrink-0 text-primary"
                />
                <span>{event.location}</span>
              </div>
            )}
          </div>
        </Card>
      )}

      {hasRules(event.rules) && (
        <Card title="Rules">
          <QuillDisplay content={event.rules} />
        </Card>
      )}

      <Card title="Format & Scoring">
        <div className="divide-y divide-gray-50">
          <InfoRow
            label="Format"
            value={FORMAT_LABEL[event.type] || event.type}
          />
          <InfoRow
            label="Winner"
            value={
              event.is_high_score_wins ? "High score wins" : "Low score wins"
            }
          />
          {event.config?.decimal_places != null && (
            <InfoRow
              label="Score format"
              value={
                SCORE_FORMAT_LABEL[String(event.config.decimal_places)] ||
                event.config.decimal_places
              }
            />
          )}
          {event.config?.min_score != null && (
            <InfoRow label="Minimum score" value={event.config.min_score} />
          )}
          {event.config?.max_score != null && (
            <InfoRow label="Maximum score" value={event.config.max_score} />
          )}
          {(event.stages || []).map((stage) => (
            <InfoRow
              label={`Stage ${stage.order + 1}`}
              value={stageSentence(stage)}
              key={stage.uuid}
            />
          ))}
        </div>
      </Card>

      <Card title="How It Works">{renderEventTypeDetails()}</Card>
    </div>
  );
};
