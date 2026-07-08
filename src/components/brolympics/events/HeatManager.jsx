import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import {
  addHeat,
  closeEventStage,
  fetchBrolympicsTeams,
  recordContest,
} from "../../../api/client";
import { useNotification } from "../../Util/Notification";

/** One heat: read-only results once recorded, placement inputs until then.
 * Participants and admins may record; the backend enforces. */
const HeatCard = ({ contest, index }) => {
  const { showNotification } = useNotification();
  const [placements, setPlacements] = useState({});
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
    }
  };

  if (contest.is_complete) {
    const ranked = [...players].sort(
      (a, b) => (a.placement ?? 99) - (b.placement ?? 99)
    );
    return (
      <div className="p-3 card">
        <h4 className="pb-1 font-semibold">Heat {index + 1}</h4>
        {ranked.map((entry) => (
          <div className="flex gap-2 text-sm" key={entry.player}>
            <span className="w-6 font-bold">{entry.placement}.</span>
            <span>{entry.player_name}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="p-3 card">
      <h4 className="pb-2 font-semibold">
        Heat {index + 1}
        <span className="ml-2 text-[10px] text-secondary">in progress</span>
      </h4>
      <div className="space-y-2">
        {players.map((entry) => (
          <div
            className="flex items-center justify-between"
            key={entry.player}
          >
            <span>{entry.player_name}</span>
            <input
              value={placements[entry.player] ?? ""}
              onChange={setPlacement(entry.player)}
              placeholder="#"
              className="w-14 h-10 text-center border-2 border-gray-300 rounded-md"
              type="text"
              inputMode="numeric"
              pattern="\d*"
            />
          </div>
        ))}
      </div>
      <button
        className="w-full p-2 mt-3 font-semibold text-white rounded-md bg-primary"
        onClick={handleRecordClicked}
      >
        Record Placements
      </button>
    </div>
  );
};

const AddHeatForm = ({ eventUuid }) => {
  const { uuid: broUuid } = useParams();
  const { showNotification } = useNotification();
  const [players, setPlayers] = useState([]);
  const [selected, setSelected] = useState(new Set());

  useEffect(() => {
    fetchBrolympicsTeams(broUuid)
      .then((teams) =>
        setPlayers(
          teams.flatMap((team) =>
            team.players.map((p) => ({ ...p, team_name: team.name }))
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
    }
  };

  return (
    <div className="p-3 card">
      <h4 className="pb-2 font-semibold">New Heat — pick the racers</h4>
      <div className="grid grid-cols-2 gap-1">
        {players.map((player) => (
          <label className="flex items-center gap-2 text-sm" key={player.uuid}>
            <input
              type="checkbox"
              checked={selected.has(player.uuid)}
              onChange={() => toggle(player.uuid)}
            />
            {player.name}
          </label>
        ))}
      </div>
      <button
        className="w-full p-2 mt-3 font-semibold text-white rounded-md bg-primary"
        onClick={handleAddClicked}
      >
        Start Heat ({selected.size})
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
      <h2 className="font-bold text-[20px]">Heats</h2>
      {heats.map((heat, i) => (
        <HeatCard contest={heat} index={i} key={heat.uuid} />
      ))}
      {heats.length === 0 && (
        <p className="text-sm text-light">No heats run yet.</p>
      )}
      {is_admin && event.is_active && (
        <>
          <button
            className="flex items-center gap-2 font-semibold"
            onClick={() => setAdding((a) => !a)}
          >
            <AddCircleOutlineIcon /> Add Heat
          </button>
          {adding && <AddHeatForm eventUuid={event.uuid} />}
          {heats.length > 0 && heats.every((h) => h.is_complete) && (
            <button
              className="w-full p-2 font-semibold border-2 rounded-md text-primary border-primary"
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
