import ManageEventWrapper from "./ManageEventWrapper";
import { useState, useEffect } from "react";
import {
  updateEvent,
  deleteEvent,
  cancelEvent,
  reinstateEvent,
} from "../../../../api/client";
import PopupContinue from "../../../Util/PopupContinue";
import { useNotification } from "../../../Util/Notification";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import GavelOutlinedIcon from "@mui/icons-material/GavelOutlined";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";
import DiamondOutlinedIcon from "@mui/icons-material/DiamondOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

// Flips per-league when Pro gating lands. Premium is a property of individual
// gem-marked settings, not a section: locked items swap to LockedNote in place.
const PREMIUM_LOCKED = false;

// mirrors H2HScoring.DEFAULT_TIEBREAKERS on the backend. The record always
// applies first and random is always the final straw -- only these move.
const DEFAULT_TIEBREAKERS = ["h2h", "sov", "sos", "diff"];
const TIEBREAKER_LABELS = {
  h2h: "Head-to-head",
  sov: "Strength of victory",
  sos: "Strength of schedule",
  diff: "Point margin",
};

// datetime-local inputs need "YYYY-MM-DDTHH:mm"; the API returns full ISO
const toLocalInput = (iso) => (iso ? iso.slice(0, 16) : "");

const Gem = () => (
  <DiamondOutlinedIcon sx={{ fontSize: 13 }} className="text-light" />
);

const SettingRow = ({ label, gem, hint, children }) => (
  <div className="flex items-center justify-between gap-3 py-2">
    <div className="min-w-0">
      <h4 className="flex items-center gap-1 text-sm font-semibold">
        {label}
        {gem && <Gem />}
      </h4>
      {hint && <p className="text-[10px] text-light">{hint}</p>}
    </div>
    {children}
  </div>
);

/** A full-width setting: label + hint on top, the control underneath. */
const SettingBlock = ({ label, gem, hint, children }) => (
  <div className="py-2">
    <h4 className="flex items-center gap-1 text-sm font-semibold">
      {label}
      {gem && <Gem />}
    </h4>
    {hint && <p className="text-[10px] text-light">{hint}</p>}
    <div className="mt-1.5">{children}</div>
  </div>
);

const rowInputClass = "w-16 shrink-0 input-box";

const Segmented = ({ value, options, onChange, disabled, disabledKeys = [] }) => (
  <div
    className={`flex overflow-hidden text-xs font-semibold border border-gray-300 rounded-full shrink-0 w-fit ${
      disabled ? "opacity-50 pointer-events-none" : ""
    }`}
  >
    {options.map(([key, label]) => (
      <button
        key={String(key)}
        disabled={disabledKeys.includes(key)}
        className={`px-3 py-1.5 disabled:opacity-40 ${
          value === key ? "bg-primary text-white" : "bg-white text-light"
        }`}
        onClick={() => onChange(key)}
      >
        {label}
      </button>
    ))}
  </div>
);

/** A collapsed sub-section inside the event card: icon, title, chevron. */
const Fold = ({ Icon, title, open, onToggle, children }) => (
  <div className="border-t border-gray-100">
    <button
      className="flex items-center justify-between w-full gap-2 py-2.5"
      onClick={onToggle}
    >
      <span className="flex items-center gap-2 text-sm font-semibold">
        <Icon sx={{ fontSize: 18 }} className="text-light" />
        {title}
      </span>
      {open ? (
        <ExpandLessIcon sx={{ fontSize: 18 }} className="text-light" />
      ) : (
        <ExpandMoreIcon sx={{ fontSize: 18 }} className="text-light" />
      )}
    </button>
    {open && <div className="pb-3">{children}</div>}
  </div>
);

const LockedNote = () => (
  <div className="flex items-center gap-2 p-3 my-2 text-xs rounded-lg bg-gray-50 text-light">
    <LockOutlinedIcon sx={{ fontSize: 16 }} />
    This setting is part of Brolympics Pro.
  </div>
);

/** Gem-marked settings render in place; the Pro gate swaps them for the note. */
const Premium = ({ children }) => (PREMIUM_LOCKED ? <LockedNote /> : children);

const QUILL_MODULES = {
  toolbar: [
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link"],
  ],
};
const QUILL_FORMATS = ["bold", "italic", "underline", "list", "bullet", "link"];

/** Settings editor for any event: basics (name, place, time) up front; Rules,
 * Structure, and Scoring behind topical folds. Premium settings sit where
 * they belong, wearing the gem. Structure edits lock once the event starts. */
const ManageEvent = ({ event, teams = [] }) => {
  const [formValues, setFormValues] = useState({});
  const [saving, setSaving] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [showStructure, setShowStructure] = useState(false);
  const [showScoring, setShowScoring] = useState(false);
  const { showNotification } = useNotification();

  const format = event.format || event.type;
  const isH2h = format === "h2h";
  const isFfa = format === "ffa";
  const structureLocked = event.is_active || event.is_complete;

  useEffect(() => {
    if (event) {
      const stages = event.stages || [];
      const rr = stages.find((s) => s.structure === "round_robin");
      const swiss = stages.find((s) => s.structure === "swiss");
      const ko = stages.find((s) => s.structure === "knockout");
      const heats = stages.find((s) => s.structure === "heats");
      const openPlay = stages.find((s) => s.structure === "open_play");
      setFormValues({
        ...event,
        ...(event.config || {}),
        projected_start_date: toLocalInput(event.projected_start_date),
        projected_end_date: toLocalInput(event.projected_end_date),
        group_play: swiss
          ? "swiss"
          : rr
          ? rr.config?.full
            ? "full"
            : "semi"
          : "none",
        n_matches: rr?.config?.games_per_team ?? swiss?.config?.rounds ?? "",
        has_playoffs: !!ko,
        bracket_take: ko?.config?.take ?? "",
        runoffs: ko?.config?.classification
          ? ko?.config?.unplayed_places?.length
            ? "custom"
            : "every"
          : ko?.config?.third_place
          ? "third"
          : "off",
        place_through:
          ko?.config?.take && ko?.config?.unplayed_places?.length
            ? ko.config.take - 2 * ko.config.unplayed_places.length
            : "",
        heat_size: heats?.config?.heat_size ?? "",
        outing_games: openPlay?.config?.games_per_team ?? 1,
        tiebreakers: (event.config?.tiebreakers ?? DEFAULT_TIEBREAKERS).filter(
          (key) => key in TIEBREAKER_LABELS
        ),
        tiebreakers_rank_standings: !!event.config?.tiebreakers_rank_standings,
        games_counted: event.config?.games_counted ?? "",
        players_counted: event.config?.players_counted ?? "",
        blind: !!event.config?.blind,
        handicaps: { ...(event.config?.handicaps || {}) },
        handicaps_enabled:
          Object.keys(event.config?.handicaps || {}).length > 0,
      });
    }
  }, [event]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };
  const set = (key, value) =>
    setFormValues((prev) => ({ ...prev, [key]: value }));

  const moveTiebreaker = (i, delta) =>
    setFormValues((prev) => {
      const list = [...(prev.tiebreakers || DEFAULT_TIEBREAKERS)];
      const j = i + delta;
      if (j < 0 || j >= list.length) return prev;
      [list[i], list[j]] = [list[j], list[i]];
      return { ...prev, tiebreakers: list };
    });

  // rebuild the stage list from the structure choices (CreateEvent semantics)
  const buildStages = () => {
    if (isFfa) {
      const size = Number(formValues.heat_size);
      return [
        { structure: "heats", config: size >= 2 ? { heat_size: size } : {} },
      ];
    }
    if (!isH2h) {
      const games = Number(formValues.outing_games);
      return [
        {
          structure: "open_play",
          config: games >= 1 ? { games_per_team: games } : {},
        },
      ];
    }
    const stages = [];
    const n = Number(formValues.n_matches);
    if (formValues.group_play === "semi") {
      stages.push({
        structure: "round_robin",
        config: { games_per_team: n || 4 },
      });
    } else if (formValues.group_play === "full") {
      stages.push({ structure: "round_robin", config: { full: true } });
    } else if (formValues.group_play === "swiss") {
      stages.push({ structure: "swiss", config: { rounds: n || 4 } });
    }
    if (formValues.has_playoffs || stages.length === 0) {
      const config = { byes: "seeded" };
      const take = Number(formValues.bracket_take);
      if (take >= 2) config.take = take;
      const runoffs = formValues.runoffs;
      if (runoffs === "every" || runoffs === "custom") {
        // classification pools include the 3rd place game
        config.classification = true;
        if (runoffs === "custom" && take >= 6) {
          const through =
            Number(formValues.place_through) || take - 2;
          const unplayed = [];
          for (let place = 3; place < take; place += 2) {
            if (place > through) unplayed.push(place);
          }
          if (unplayed.length) config.unplayed_places = unplayed;
        }
      } else if (runoffs === "third") {
        config.third_place = true;
      }
      stages.push({ structure: "knockout", config });
    }
    return stages;
  };

  const canEditStructure = !structureLocked;

  const handleUpdateClicked = async () => {
    if (saving) return;
    setSaving(true);
    try {
      const patch = {
        location: formValues.location || "",
        rules: formValues.rules || "",
        is_high_score_wins: !!formValues.is_high_score_wins,
        projected_start_date: formValues.projected_start_date || null,
        projected_end_date: formValues.projected_end_date || null,
        config: {
          ...(event.config || {}),
          min_score: formValues.min_score ?? null,
          max_score: formValues.max_score ?? null,
          decimal_places: formValues.decimal_places ?? null,
          ...(isH2h
            ? {
                tiebreakers: formValues.tiebreakers || DEFAULT_TIEBREAKERS,
                tiebreakers_rank_standings:
                  !!formValues.tiebreakers_rank_standings,
              }
            : {
                display_avg_scores: !!formValues.display_avg_scores,
                games_counted: Number.isInteger(
                  Number(formValues.games_counted)
                )
                  ? Number(formValues.games_counted) >= 1
                    ? Number(formValues.games_counted)
                    : null
                  : null,
                ...(format === "ind"
                  ? {
                      players_counted: Number.isInteger(
                        Number(formValues.players_counted)
                      )
                        ? Number(formValues.players_counted) >= 1
                          ? Number(formValues.players_counted)
                          : null
                        : null,
                    }
                  : {}),
                blind: !!formValues.blind,
                handicaps: (() => {
                  if (!formValues.handicaps_enabled) return null;
                  const cleaned = {};
                  for (const [uuid, value] of Object.entries(
                    formValues.handicaps || {}
                  )) {
                    const n = Number(value);
                    if (value !== "" && !Number.isNaN(n) && n !== 0) {
                      cleaned[uuid] = n;
                    }
                  }
                  return Object.keys(cleaned).length ? cleaned : null;
                })(),
              }),
        },
        ...(formValues.name && formValues.name !== event.name
          ? { name_override: formValues.name }
          : {}),
        ...(canEditStructure ? { stages: buildStages() } : {}),
      };
      await updateEvent(event.uuid, patch);
      showNotification(`${event.name} has been updated.`, "!border-primary");
    } catch (error) {
      const detail = error.response?.data;
      showNotification(
        detail
          ? String(detail[0] ?? detail.detail ?? JSON.stringify(detail))
          : "There was an issue updating this event."
      );
    } finally {
      setSaving(false);
    }
  };

  const deleteEventFunc = async () => {
    try {
      await deleteEvent(event.uuid);
      showNotification(`Deleted ${event.name}.`, "!border-primary");
      location.reload();
    } catch (error) {
      showNotification("There was an error deleting this event.");
    }
  };

  const cancelEventFunc = async () => {
    try {
      await cancelEvent(event.uuid);
      showNotification(`${event.name} is cancelled.`, "!border-primary");
      location.reload();
    } catch (error) {
      const detail = error.response?.data;
      showNotification(
        detail
          ? String(detail[0] ?? detail.detail ?? JSON.stringify(detail))
          : "There was an error cancelling this event."
      );
    }
  };

  const reinstateEventFunc = async () => {
    try {
      await reinstateEvent(event.uuid);
      showNotification(`${event.name} is back on.`, "!border-primary");
      location.reload();
    } catch (error) {
      showNotification("There was an error reinstating this event.");
    }
  };

  const lockedNote = structureLocked && (
    <p className="pb-1 text-[10px] text-red">
      This event has started; its structure can no longer change.
    </p>
  );

  return (
    <ManageEventWrapper name={event.name} event={event}>
      <div className="flex flex-col gap-3">
        <div>
          <label className="text-xs text-light">Event name</label>
          <input
            value={formValues.name || ""}
            onChange={handleInputChange}
            name="name"
            className="w-full input-primary"
            autoComplete="off"
          />
        </div>
        <div>
          <label className="text-xs text-light">Location</label>
          <input
            value={formValues.location || ""}
            name="location"
            onChange={handleInputChange}
            className="w-full input-primary"
            type="text"
            placeholder="The backyard, lane 4, ..."
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="min-w-0">
            <label className="text-xs text-light">Starts</label>
            <input
              value={formValues.projected_start_date || ""}
              onChange={handleInputChange}
              name="projected_start_date"
              className="w-full min-w-0 input-primary"
              type="datetime-local"
            />
          </div>
          <div className="min-w-0">
            <label className="text-xs text-light">Ends</label>
            <input
              value={formValues.projected_end_date || ""}
              onChange={handleInputChange}
              name="projected_end_date"
              className="w-full min-w-0 input-primary"
              type="datetime-local"
            />
          </div>
        </div>
        <p className="text-[10px] text-light -mt-2">
          Leave dates blank for play-anytime events — they show as TBD in the
          lineup.
        </p>

        <Fold
          Icon={GavelOutlinedIcon}
          title="Rules"
          open={showRules}
          onToggle={() => setShowRules((v) => !v)}
        >
          <ReactQuill
            theme="snow"
            value={formValues.rules || ""}
            onChange={(content) => set("rules", content)}
            modules={QUILL_MODULES}
            formats={QUILL_FORMATS}
            className="bg-white"
          />
        </Fold>

        <Fold
          Icon={TuneOutlinedIcon}
          title="Scoring"
          open={showScoring}
          onToggle={() => setShowScoring((v) => !v)}
        >
          <div className="flex flex-col divide-y divide-gray-50">
            <SettingRow
              label="Winner"
              hint="Who takes it — the high or the low score."
            >
              <Segmented
                value={!!formValues.is_high_score_wins}
                options={[
                  [true, "High"],
                  [false, "Low"],
                ]}
                onChange={(v) => set("is_high_score_wins", v)}
              />
            </SettingRow>
            <SettingRow
              label="Score format"
              hint="What a score looks like when it's entered."
            >
              <select
                name="decimal_places"
                value={formValues.decimal_places ?? "0"}
                onChange={handleInputChange}
                className="shrink-0 input-box"
              >
                <option value="0">1</option>
                <option value="1">1.0</option>
                <option value="2">1.00</option>
                <option value="3">1.000</option>
                <option value="16">Any decimal</option>
                <option value="B">Win/Loss only</option>
              </select>
            </SettingRow>
            <SettingRow
              label="Score limits"
              hint="Optional min and max per score."
            >
              <div className="flex items-center gap-1.5 shrink-0">
                <input
                  name="min_score"
                  value={formValues.min_score || ""}
                  onChange={handleInputChange}
                  className={rowInputClass}
                  type="number"
                  placeholder="min"
                />
                <span className="text-light">–</span>
                <input
                  name="max_score"
                  value={formValues.max_score || ""}
                  onChange={handleInputChange}
                  className={rowInputClass}
                  type="number"
                  placeholder="max"
                />
              </div>
            </SettingRow>
            {!isH2h && !isFfa && (
              <>
                <SettingRow
                  label="Score display"
                  hint="Show each team's average or combined total."
                >
                  <Segmented
                    value={!!formValues.display_avg_scores}
                    options={[
                      [false, "Total"],
                      [true, "Average"],
                    ]}
                    onChange={(v) => set("display_avg_scores", v)}
                  />
                </SettingRow>
                <Premium>
                  <SettingRow
                    label="Games counted"
                    gem
                    hint="Play any number of games — only the team's best N count. Blank counts them all."
                  >
                    <input
                      name="games_counted"
                      value={formValues.games_counted ?? ""}
                      onChange={handleInputChange}
                      className={rowInputClass}
                      type="number"
                      placeholder="all"
                    />
                  </SettingRow>
                </Premium>
                {format === "ind" && (
                  <Premium>
                    <SettingRow
                      label="Scores counted"
                      gem
                      hint="Each game, only the team's top N player scores count. Blank counts everyone."
                    >
                      <input
                        name="players_counted"
                        value={formValues.players_counted ?? ""}
                        onChange={handleInputChange}
                        className={rowInputClass}
                        type="number"
                        placeholder="all"
                      />
                    </SettingRow>
                  </Premium>
                )}
                <Premium>
                  <SettingRow
                    label="Blind scoring"
                    gem
                    hint="Scores stay hidden until every team has posted — then the reveal happens on its own."
                  >
                    <Segmented
                      value={!!formValues.blind}
                      options={[
                        [false, "Off"],
                        [true, "On"],
                      ]}
                      onChange={(v) => set("blind", v)}
                    />
                  </SettingRow>
                </Premium>
                <Premium>
                  <SettingRow
                    label="Handicaps"
                    gem
                    hint={
                      format === "ind"
                        ? "Adjust each player's score every game. Golf: negatives take strokes off."
                        : "Adjust each team's final total. Golf: negatives take strokes off."
                    }
                  >
                    <Segmented
                      value={!!formValues.handicaps_enabled}
                      options={[
                        [false, "Off"],
                        [true, "On"],
                      ]}
                      onChange={(v) => set("handicaps_enabled", v)}
                    />
                  </SettingRow>
                </Premium>
                {!PREMIUM_LOCKED &&
                  formValues.handicaps_enabled &&
                  (() => {
                    const rows =
                      format === "ind"
                        ? teams.flatMap((team) =>
                            (team.players || []).map((player) => ({
                              key: player.uuid,
                              label: player.name,
                              detail: team.name,
                            }))
                          )
                        : teams.map((team) => ({
                            key: team.uuid,
                            label: team.name,
                          }));
                    if (rows.length === 0) {
                      return (
                        <p className="py-2 text-[10px] text-light">
                          {format === "ind" ? "Players" : "Teams"} appear here
                          once they've joined.
                        </p>
                      );
                    }
                    return (
                      <div className="py-2">
                        <div className="overflow-hidden border border-gray-200 rounded-lg divide-y">
                          {rows.map((row) => (
                            <div
                              className="flex items-center justify-between gap-3 px-3 py-1.5 bg-white"
                              key={row.key}
                            >
                              <span className="min-w-0 text-sm truncate">
                                {row.label}
                                {row.detail && (
                                  <span className="text-[10px] text-light">
                                    {" "}
                                    · {row.detail}
                                  </span>
                                )}
                              </span>
                              <input
                                type="number"
                                step="any"
                                placeholder="0"
                                value={formValues.handicaps?.[row.key] ?? ""}
                                onChange={(e) =>
                                  setFormValues((prev) => ({
                                    ...prev,
                                    handicaps: {
                                      ...prev.handicaps,
                                      [row.key]: e.target.value,
                                    },
                                  }))
                                }
                                className="w-20 shrink-0 input-box"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
              </>
            )}
            {isH2h && (
              <>
                <Premium>
                  <SettingRow
                    label="Tiebreakers rank standings"
                    gem
                    hint="Off: equal records share the rank and split points; the chain only seeds the bracket. On: the chain breaks ties everywhere — separate ranks, no splitting."
                  >
                    <Segmented
                      value={!!formValues.tiebreakers_rank_standings}
                      options={[
                        [false, "Off"],
                        [true, "On"],
                      ]}
                      onChange={(v) => set("tiebreakers_rank_standings", v)}
                    />
                  </SettingRow>
                </Premium>
                <Premium>
                  <SettingBlock
                    label="Tiebreaker order"
                    gem
                    hint={
                      formValues.tiebreakers_rank_standings
                        ? "Decides bracket spots, seeding, AND the standings — ties break in this order for rank and points. The record leads, random closes, and the middle is yours."
                        : "Only decides bracket spots and seeding — teams with equal records always share the rank and split the points. The record leads, random closes, and the middle is yours."
                    }
                  >
                    <div className="overflow-hidden border border-gray-200 rounded-lg divide-y">
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50">
                        <span className="w-4 text-xs font-semibold text-light">
                          —
                        </span>
                        <span className="flex-grow text-sm text-light">
                          Record (wins, then ties)
                        </span>
                        <span className="text-[10px] text-light">
                          always first
                        </span>
                      </div>
                      {(formValues.tiebreakers || DEFAULT_TIEBREAKERS).map(
                        (key, i, arr) => (
                          <div
                            className="flex items-center gap-2 px-3 py-1.5 bg-white"
                            key={key}
                          >
                            <span className="w-4 text-xs font-semibold text-light">
                              {i + 1}
                            </span>
                            <span className="flex-grow min-w-0 text-sm truncate">
                              {TIEBREAKER_LABELS[key] || key}
                            </span>
                            <button
                              disabled={i === 0}
                              onClick={() => moveTiebreaker(i, -1)}
                              className="text-light disabled:opacity-30"
                            >
                              <ArrowUpwardIcon sx={{ fontSize: 16 }} />
                            </button>
                            <button
                              disabled={i === arr.length - 1}
                              onClick={() => moveTiebreaker(i, 1)}
                              className="text-light disabled:opacity-30"
                            >
                              <ArrowDownwardIcon sx={{ fontSize: 16 }} />
                            </button>
                          </div>
                        )
                      )}
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50">
                        <span className="w-4 text-xs font-semibold text-light">
                          —
                        </span>
                        <span className="flex-grow text-sm text-light">
                          Random
                        </span>
                        <span className="text-[10px] text-light">
                          final straw — the bracket has to pick someone
                        </span>
                      </div>
                    </div>
                    {JSON.stringify(formValues.tiebreakers) !==
                      JSON.stringify(DEFAULT_TIEBREAKERS) && (
                      <button
                        className="pt-1.5 text-xs font-semibold text-primary"
                        onClick={() => set("tiebreakers", DEFAULT_TIEBREAKERS)}
                      >
                        Reset to default
                      </button>
                    )}
                  </SettingBlock>
                </Premium>
              </>
            )}
          </div>
        </Fold>

        <Fold
            Icon={AccountTreeOutlinedIcon}
            title="Structure"
            open={showStructure}
            onToggle={() => setShowStructure((v) => !v)}
          >
            <div className="flex flex-col divide-y divide-gray-50">
              {lockedNote}
              {isFfa ? (
                <SettingRow
                  label="Heat size"
                  hint="Pre-builds balanced heats at start; blank = make heats at the party."
                >
                  <input
                    value={formValues.heat_size || ""}
                    name="heat_size"
                    onChange={handleInputChange}
                    disabled={structureLocked}
                    className={rowInputClass}
                    type="number"
                  />
                </SettingRow>
              ) : !isH2h ? (
                <SettingRow
                  label="Games per team"
                  hint="How many rounds each team plays — bowling classically runs 2."
                >
                  <input
                    value={formValues.outing_games ?? 1}
                    name="outing_games"
                    onChange={handleInputChange}
                    disabled={structureLocked}
                    className={rowInputClass}
                    type="number"
                  />
                </SettingRow>
              ) : (
                <>
                  <SettingBlock
                    label="Group type"
                    hint={
                      formValues.group_play === "full"
                        ? "Everyone plays everyone once."
                        : formValues.group_play === "swiss"
                        ? "Each round pairs teams with similar records."
                        : formValues.group_play === "none"
                        ? "Straight to the bracket."
                        : "Everyone plays a set number of games."
                    }
                  >
                    <Segmented
                      value={formValues.group_play}
                      options={[
                        ["none", "None"],
                        ["semi", "Semi-RR"],
                        ["full", "Full-RR"],
                        [
                          "swiss",
                          <span
                            className="flex items-center gap-0.5"
                            key="swiss-label"
                          >
                            Swiss
                            <DiamondOutlinedIcon sx={{ fontSize: 12 }} />
                          </span>,
                        ],
                      ]}
                      onChange={(v) => set("group_play", v)}
                      disabled={structureLocked}
                    />
                  </SettingBlock>
                  {(formValues.group_play === "semi" ||
                    formValues.group_play === "swiss") && (
                    <SettingRow
                      label={
                        formValues.group_play === "swiss"
                          ? "Swiss rounds"
                          : "Matches per team"
                      }
                      hint="Group-play games before the bracket."
                    >
                      <input
                        value={formValues.n_matches || ""}
                        name="n_matches"
                        onChange={handleInputChange}
                        disabled={structureLocked}
                        className={rowInputClass}
                        type="number"
                      />
                    </SettingRow>
                  )}
                  <SettingRow
                    label="Playoffs"
                    hint="A seeded bracket after group play."
                  >
                    <Segmented
                      value={!!formValues.has_playoffs}
                      options={[
                        [true, "On"],
                        [false, "Off"],
                      ]}
                      onChange={(v) => set("has_playoffs", v)}
                      disabled={structureLocked}
                    />
                  </SettingRow>
                  {formValues.has_playoffs && (
                    <>
                      <SettingRow
                        label="Bracket size"
                        hint="How many teams make the playoffs. Blank = everyone."
                      >
                        <input
                          value={formValues.bracket_take || ""}
                          name="bracket_take"
                          onChange={handleInputChange}
                          disabled={structureLocked}
                          className={rowInputClass}
                          type="number"
                        />
                      </SettingRow>
                      <SettingBlock
                        label="Run-off games"
                        hint={
                          formValues.runoffs === "off"
                            ? "Winners only — the semifinal losers tie for 3rd and split the points."
                            : formValues.runoffs === "third"
                            ? "The semifinal losers play for bronze."
                            : formValues.runoffs === "every"
                            ? "Run-off brackets settle every place — 5th/6th, 7th/8th and beyond."
                            : "Run-offs settle places down to a depth you pick; deeper places tie in pairs and split the points."
                        }
                      >
                        <Segmented
                          value={formValues.runoffs}
                          options={[
                            ["off", "Off"],
                            ["third", "3rd place"],
                            [
                              "every",
                              <span
                                className="flex items-center gap-0.5"
                                key="every-label"
                              >
                                Every place
                                <DiamondOutlinedIcon sx={{ fontSize: 12 }} />
                              </span>,
                            ],
                            [
                              "custom",
                              <span
                                className="flex items-center gap-0.5"
                                key="custom-label"
                              >
                                Custom
                                <DiamondOutlinedIcon sx={{ fontSize: 12 }} />
                              </span>,
                            ],
                          ]}
                          onChange={(v) => set("runoffs", v)}
                          disabled={structureLocked}
                          disabledKeys={
                            PREMIUM_LOCKED ? ["every", "custom"] : []
                          }
                        />
                      </SettingBlock>
                      {formValues.runoffs === "custom" &&
                        (Number(formValues.bracket_take) >= 6 ? (
                          <SettingRow
                            label="Play places through"
                            hint="Run-offs go down to here; deeper places tie in pairs and split the points."
                          >
                            <select
                              name="place_through"
                              value={
                                formValues.place_through ||
                                Number(formValues.bracket_take) - 2
                              }
                              onChange={handleInputChange}
                              disabled={structureLocked}
                              className="shrink-0 input-box"
                            >
                              {Array.from(
                                {
                                  length: Math.floor(
                                    (Number(formValues.bracket_take) - 2) / 2
                                  ) - 1,
                                },
                                (_, i) => 4 + i * 2
                              ).map((place) => (
                                <option key={place} value={place}>
                                  {place}th
                                </option>
                              ))}
                            </select>
                          </SettingRow>
                        ) : (
                          <p className="py-2 text-[10px] text-light">
                            Custom depth needs a bracket size of 6 or more —
                            set one above.
                          </p>
                        ))}
                    </>
                  )}
                </>
              )}
            </div>
          </Fold>

        <button
          className="w-full py-2.5 font-semibold text-white rounded-full bg-primary disabled:opacity-50"
          onClick={handleUpdateClicked}
          disabled={saving}
        >
          {saving ? "Saving..." : `Save ${event.name}`}
        </button>
        <div className="flex items-center justify-center gap-6">
          {event.is_cancelled ? (
            <button
              className="text-xs font-semibold text-primary"
              onClick={reinstateEventFunc}
            >
              Reinstate this event
            </button>
          ) : (
            <button
              className="text-xs font-semibold text-light"
              onClick={() => setCancelOpen(true)}
            >
              Cancel this event
            </button>
          )}
          <button
            className="text-xs font-semibold text-red"
            onClick={() => setDeleteOpen(true)}
          >
            Delete this event
          </button>
        </div>
      </div>

      <PopupContinue
        open={deleteOpen}
        setOpen={setDeleteOpen}
        header={`Delete ${event.name}?`}
        desc="This removes the event from your Brolympics. You can recreate it later, but these settings are gone."
        continueText="Delete"
        continueFunc={deleteEventFunc}
      />
      <PopupContinue
        open={cancelOpen}
        setOpen={setCancelOpen}
        header={`Cancel ${event.name}?`}
        desc="A cancelled event drops out of standings and points but keeps its place in the lineup, marked cancelled. You can reinstate it any time."
        continueText="Cancel event"
        continueFunc={cancelEventFunc}
      />
    </ManageEventWrapper>
  );
};

export default ManageEvent;
