import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import {
  addHeat,
  closeEventStage,
  fetchBrolympicsTeams,
  recordContest,
} from "../../../api/client";
import { useNotification } from "../../Util/Notification";

const PLACE_STYLE = {
  1: "bg-secondary/20 text-secondary-dark",
  2: "bg-gray-200 text-gray-600",
  3: "bg-orange-100 text-orange-700",
};

/** One heat: read-only results once recorded, placement inputs until then.
 * Participants and admins may record; the backend enforces. */
const HeatCard = ({ contest, index }) => {
  const { showNotification } = useNotification();
  const [placements, setPlacements] = useState({});
  const [saving, setSaving] = useState(false);
  const players = contest.entries.filter((e) => e.player);

  const setPlacement = (playerUuid) => (e) => {
    const value = e.target.value;
    if (value === "" || /^\d+$/.test(value)) {
      setPlacements((prev) => ({ ...prev, [playerUuid]: value }));
    }
  };

  const handleRecordClicked = async () => {
    const values = players.map((p) => Number(placements[p.player]));
    if (values.some((v) => !v)) {
      showNotification(
        "Enter a placement for every racer.",
        "border-yellow-500"
      );
      return;
    }
    if (saving) return;
    setSaving(true);
    try {
      await recordContest(contest.uuid, {
        placements: Object.fromEntries(
          players.map((p) => [p.player, Number(placements[p.player])])
        ),
      });
      window.location.reload();
    } catch (error) {
      const detail = error.response?.data;
      showNotification(
        detail
          ? String(detail[0] ?? detail.detail ?? JSON.stringify(detail))
          : "Error recording this heat."
      );
      setSaving(false);
    }
  };

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
    <div className="p-4 bg-white border rounded-lg border-tertiary/40">
      <div className="flex items-center justify-between pb-2">
        <h4 className="text-xs font-semibold tracking-wide uppercase text-light">
          Heat {index + 1}
        </h4>
        <span className="px-1.5 py-0.5 text-[10px] font-semibold uppercase rounded bg-tertiary/10 text-tertiary-dark">
          live
        </span>
      </div>
      <div className="divide-y divide-gray-50">
        {players.map((entry) => (
          <div
            className="flex items-center justify-between gap-3 py-1.5"
            key={entry.player}
          >
            <span className="min-w-0 text-sm truncate">
              {entry.player_name}
            </span>
            <input
              value={placements[entry.player] ?? ""}
              onChange={setPlacement(entry.player)}
              placeholder="#"
              className="w-14 h-10 shrink-0 input-box"
              type="text"
              inputMode="numeric"
              pattern="\d*"
            />
          </div>
        ))}
      </div>
      <button
        className="w-full py-2.5 mt-3 font-semibold text-white rounded-full bg-primary disabled:opacity-50"
        onClick={handleRecordClicked}
        disabled={saving}
      >
        {saving ? "Saving..." : "Record Placements"}
      </button>
    </div>
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
      showNotification("A heat needs at least 2 racers.", "border-yellow-500");
      return;
    }
    if (saving) return;
    setSaving(true);
    try {
      await addHeat(eventUuid, [...selected]);
      window.location.reload();
    } catch (error) {
      const detail = error.response?.data;
      showNotification(
        detail
          ? String(detail[0] ?? detail.detail ?? JSON.stringify(detail))
          : "Error creating the heat."
      );
      setSaving(false);
    }
  };

  return (
    <div className="p-4 bg-white border border-gray-200 rounded-lg">
      <h4 className="pb-2 text-xs font-semibold tracking-wide uppercase text-light">
        New Heat — pick the racers
      </h4>
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

/** Event-day controls for free-for-all events: run heats, record placements,
 * and (admin) close the event when racing is done. */
const HeatManager = ({ event, is_admin }) => {
  const { showNotification } = useNotification();
  const [adding, setAdding] = useState(false);
  const heats = (event.contests || []).filter((c) => c.kind === "heat");

  const handleFinishClicked = async () => {
    try {
      await closeEventStage(event.uuid);
      window.location.reload();
    } catch (error) {
      const detail = error.response?.data;
      showNotification(
        detail
          ? String(detail[0] ?? detail.detail ?? JSON.stringify(detail))
          : "Error finishing the event."
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
        <p className="text-sm text-light">No heats run yet.</p>
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
                <AddCircleOutlineIcon sx={{ fontSize: 18 }} /> Add Heat
              </>
            )}
          </button>
          {adding && <AddHeatForm eventUuid={event.uuid} />}
          {heats.length > 0 && heats.every((h) => h.is_complete) && (
            <button
              className="w-full py-2.5 font-semibold border rounded-full text-primary border-primary"
              onClick={handleFinishClicked}
            >
              Finish Event (final standings)
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default HeatManager;
