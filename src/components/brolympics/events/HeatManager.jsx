import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {
  addHeat,
  closeEventStage,
  fetchBrolympicsTeams,
} from "../../../api/client";
import { useNotification } from "../../Util/Notification";
import { apiErrorMessage } from "../../Util/apiError";

const PLACE_STYLE = {
  1: "bg-secondary/20 text-secondary-dark",
  2: "bg-gray-200 text-gray-600",
  3: "bg-orange-100 text-orange-700",
};

/** One heat: results once recorded; until then a link into the same tap-the-
 * finish-order scorecard every other game uses (no separate logging system). */
const HeatCard = ({ contest, index }) => {
  const navigate = useNavigate();
  const { uuid: broUuid } = useParams();
  const players = contest.entries.filter((e) => e.player);

  if (contest.is_complete) {
    const ranked = [...players].sort(
      (a, b) => (a.placement ?? 99) - (b.placement ?? 99)
    );
    return (
      <div className="p-4 bg-white border border-gray-200 rounded-lg">
        <h4 className="pb-2 text-xs font-semibold tracking-wide uppercase text-light">
          Heat {index + 1}
        </h4>
        <div className="divide-y divide-gray-50">
          {ranked.map((entry) => (
            <div
              className="flex items-center gap-2.5 py-1.5 text-sm"
              key={entry.player}
            >
              <span
                className={`flex items-center justify-center w-6 h-6 text-xs font-bold rounded-full shrink-0 ${
                  PLACE_STYLE[entry.placement] || "bg-gray-50 text-light"
                }`}
              >
                {entry.placement}
              </span>
              <span
                className={entry.placement === 1 ? "font-semibold" : ""}
              >
                {entry.player_name}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <button
      className="w-full p-4 text-left bg-white border rounded-lg border-tertiary/40"
      onClick={() => navigate(`/b/${broUuid}/competition/${contest.uuid}`)}
    >
      <div className="flex items-center justify-between pb-2">
        <h4 className="text-xs font-semibold tracking-wide uppercase text-light">
          Heat {index + 1}
        </h4>
        <span className="px-1.5 py-0.5 text-[10px] font-semibold uppercase rounded bg-tertiary/10 text-tertiary-dark">
          live
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {players.map((entry) => (
          <span
            className="px-2 py-1 text-xs font-medium rounded-full bg-gray-50 text-near-black"
            key={entry.player}
          >
            {entry.player_name}
          </span>
        ))}
      </div>
      <span className="flex items-center gap-0.5 pt-2 text-xs font-semibold text-primary">
        Score this heat <ChevronRightIcon sx={{ fontSize: 16 }} />
      </span>
    </button>
  );
};

const AddHeatForm = ({ eventUuid }) => {
  const { uuid: broUuid } = useParams();
  const { showNotification } = useNotification();
  const [players, setPlayers] = useState([]);
  const [selected, setSelected] = useState(new Set());
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchBrolympicsTeams(broUuid)
      .then((teams) =>
        setPlayers(
          teams.flatMap((team) =>
            (team.players || [])
              // dormant players sit out scheduling
              .filter((p) => p.is_active !== false)
              .map((p) => ({ ...p, team_name: team.name }))
          )
        )
      )
      .catch((error) => console.error("Error fetching roster:", error));
  }, [broUuid]);

  const toggle = (uuid) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(uuid) ? next.delete(uuid) : next.add(uuid);
      return next;
    });
  };

  const handleAddClicked = async () => {
    if (selected.size < 2) {
      showNotification("A heat needs at least 2 racers.", "warning");
      return;
    }
    if (saving) return;
    setSaving(true);
    try {
      await addHeat(eventUuid, [...selected]);
      window.location.reload();
    } catch (error) {
      showNotification(
        apiErrorMessage(error, "Error creating the heat.")
      );
      setSaving(false);
    }
  };

  return (
    <div className="p-4 bg-white border border-gray-200 rounded-lg">
      <h4 className="pb-2 text-xs font-semibold tracking-wide uppercase text-light">
        Extra Heat — pick the racers
      </h4>
      <p className="pb-2 text-[10px] text-light">
        For re-runs and no-shows — the scheduled heats were built when the
        event started.
      </p>
      <div className="overflow-hidden border border-gray-200 rounded-lg divide-y">
        {players.map((player) => (
          <label
            className="flex items-center gap-3 px-3 py-2 cursor-pointer"
            key={player.uuid}
          >
            <input
              type="checkbox"
              checked={selected.has(player.uuid)}
              onChange={() => toggle(player.uuid)}
              className="w-4 h-4 accent-primary"
            />
            <span className="flex-grow min-w-0 text-sm truncate">
              {player.name}
              <span className="text-[10px] text-light"> · {player.team_name}</span>
            </span>
          </label>
        ))}
      </div>
      <button
        className="w-full py-2.5 mt-3 font-semibold text-white rounded-full bg-primary disabled:opacity-50"
        onClick={handleAddClicked}
        disabled={saving}
      >
        {saving ? "Starting..." : `Start Heat (${selected.size})`}
      </button>
    </div>
  );
};

/** Event-day view for free-for-all events: the scheduled heats with their
 * results, each live heat linking into the shared scorecard. Admins keep two
 * escape hatches -- an extra heat for re-runs, and an early finish. */
const HeatManager = ({ event, is_admin }) => {
  const { showNotification } = useNotification();
  const [adding, setAdding] = useState(false);
  const heats = (event.contests || []).filter((c) => c.kind === "heat");
  const unrecorded = heats.filter((h) => !h.is_complete).length;

  const handleFinishClicked = async () => {
    try {
      await closeEventStage(event.uuid);
      window.location.reload();
    } catch (error) {
      showNotification(
        apiErrorMessage(error, "Error finishing the event.")
      );
    }
  };

  return (
    <div className="px-4 pb-6 space-y-3">
      <h2 className="header-3">Heats</h2>
      {heats.map((heat, i) => (
        <HeatCard contest={heat} index={i} key={heat.uuid} />
      ))}
      {heats.length === 0 && (
        <p className="text-sm text-light">No heats yet.</p>
      )}
      {is_admin && event.is_active && (
        <>
          <button
            className={`flex items-center justify-center gap-2 w-full py-2.5 font-semibold rounded-full ${
              adding ? "text-light bg-gray-100" : "text-white bg-primary"
            }`}
            onClick={() => setAdding((a) => !a)}
          >
            {adding ? (
              <>
                <CloseIcon sx={{ fontSize: 18 }} /> Close
              </>
            ) : (
              <>
                <AddCircleOutlineIcon sx={{ fontSize: 18 }} /> Add Extra Heat
              </>
            )}
          </button>
          {adding && <AddHeatForm eventUuid={event.uuid} />}
          {heats.length > 0 && (
            <>
              <button
                className="w-full py-2.5 font-semibold border rounded-full text-primary border-primary"
                onClick={handleFinishClicked}
              >
                Finish Event (final standings)
              </button>
              {unrecorded > 0 && (
                <p className="text-[10px] text-center text-light">
                  {unrecorded} heat{unrecorded === 1 ? "" : "s"} unrecorded —
                  finishing now scores only what's been recorded.
                </p>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default HeatManager;
