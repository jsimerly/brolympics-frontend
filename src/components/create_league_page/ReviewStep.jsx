import CreateWrapper from "./CreateWrapper";
import Img from "../Util/Img";
import HistoryIcon from "@mui/icons-material/History";

const FORMAT_LABEL = { h2h: "Head to Head", ind: "Individual", team: "Team", ffa: "Free-for-All" };

const typeLabel = (teamSize) => {
  if (teamSize === 1) return "Individual — every player for themself";
  if (teamSize === 2) return "Traditional — teams of 2";
  if (teamSize) return `Teams of ${teamSize}`;
  return "Open teams — no set size";
};

/** The confirm gate: nothing is created until this page's button. */
const ReviewStep = ({
  step,
  totalSteps,
  back,
  leagueName,
  brolympics,
  h2hEvents = [],
  indEvents = [],
  teamEvents = [],
  ffaEvents = [],
  onCreate,
  creating = false,
}) => {
  const groups = [
    ["h2h", h2hEvents],
    ["ind", indEvents],
    ["team", teamEvents],
    ["ffa", ffaEvents],
  ].filter(([, events]) => events.length > 0);
  const totalEvents = groups.reduce((n, [, events]) => n + events.length, 0);

  return (
    <CreateWrapper
      button_text={
        creating
          ? "Creating..."
          : leagueName
          ? "Create League & Brolympics"
          : "Create Brolympics"
      }
      step={step}
      totalSteps={totalSteps}
      back={creating ? undefined : back}
      submit={onCreate}
      disabled={creating}
      title="Review & Create"
      description="Nothing is created until you hit the button. Use back to change anything."
    >
      <div className="flex flex-col gap-4 py-2">
        {leagueName && (
          <div className="p-3 bg-white border border-gray-200 rounded-lg">
            <span className="text-xs font-semibold tracking-wide uppercase text-light">
              League
            </span>
            <p className="font-semibold">{leagueName}</p>
          </div>
        )}

        <div className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg">
          <Img
            src={brolympics?.img}
            alt={brolympics?.name}
            kind="brolympics"
            className="object-cover w-14 h-14 rounded-lg"
          />
          <div className="flex flex-col min-w-0">
            <span className="font-semibold leading-tight">
              {brolympics?.name || "Unnamed Brolympics"}
            </span>
            <span className="text-xs text-light">
              {typeLabel(brolympics?.team_size)}
            </span>
            <span className="text-xs text-light">
              {brolympics?.projected_start_date || "no start date"}
              {" – "}
              {brolympics?.projected_end_date || "no end date"}
            </span>
          </div>
        </div>

        <div className="p-3 bg-white border border-gray-200 rounded-lg">
          <span className="text-xs font-semibold tracking-wide uppercase text-light">
            Events ({totalEvents})
          </span>
          {totalEvents === 0 && (
            <p className="pt-1 text-sm text-light">
              No events yet — you can add them now with back, or later from
              Manage.
            </p>
          )}
          {groups.map(([format, events]) => (
            <div key={format} className="pt-2">
              <h4 className="text-[11px] font-semibold tracking-wide uppercase text-light">
                {FORMAT_LABEL[format]}
              </h4>
              <ul>
                {events.map((event, i) => (
                  <li key={i} className="flex items-center gap-1.5 py-0.5 text-sm">
                    {event.name}
                    {event.fromLineage && (
                      <span
                        className="flex items-center gap-0.5 text-[10px] text-light"
                        title={`Same settings as ${event.lastPlayed}`}
                      >
                        <HistoryIcon sx={{ fontSize: 12 }} />
                        {event.lastPlayed}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </CreateWrapper>
  );
};

export default ReviewStep;
