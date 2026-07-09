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
import DiamondOutlinedIcon from "@mui/icons-material/DiamondOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

// Flips per-league when Pro gating lands; the locked UI below already works.
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

const SettingRow = ({ label, hint, children }) => (
  <div className="flex items-center justify-between gap-3 py-2">
    <div className="min-w-0">
      <h4 className="text-sm font-semibold">{label}</h4>
      {hint && <p className="text-[10px] text-light">{hint}</p>}
    </div>
    {children}
  </div>
);

const rowInputClass = "w-16 shrink-0 input-box";

const Segmented = ({ value, options, onChange, disabled }) => (
  <div
    className={`flex overflow-hidden text-xs font-semibold border border-gray-300 rounded-full shrink-0 ${
      disabled ? "opacity-50 pointer-events-none" : ""
    }`}
  >
    {options.map(([key, label]) => (
      <button
        key={label}
        className={`px-3 py-1.5 ${
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
const Fold = ({ Icon, title, badge, open, onToggle, children }) => (
  <div className="border-t border-gray-100">
    <button
      className="flex items-center justify-between w-full gap-2 py-2.5"
      onClick={onToggle}
    >
      <span className="flex items-center gap-2 text-sm font-semibold">
        <Icon sx={{ fontSize: 18 }} className="text-light" />
        {title}
        {badge}
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
  <div className="flex items-center gap-2 p-3 text-xs rounded-lg bg-gray-50 text-light">
    <LockOutlinedIcon sx={{ fontSize: 16 }} />
    These settings are part of Brolympics Pro.
  </div>
);

const QUILL_MODULES = {
  toolbar: [
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link"],
  ],
};
const QUILL_FORMATS = ["bold", "italic", "underline", "list", "bullet", "link"];

/** Settings editor for any event: basics (name, place, time) up front; rules,
 * everyday advanced knobs, and premium structure choices behind folds.
 * Structure edits lock once the event starts. */
const ManageEvent = ({ event }) => {
  const [formValues, setFormValues] = useState({});
  const [saving, setSaving] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showPremium, setShowPremium] = useState(false);
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
        n_matches:
          rr?.config?.games_per_team ?? swiss?.config?.rounds ?? "",
        has_playoffs: !!ko,
        bracket_take: ko?.config?.take ?? "",
        placements: ko?.config?.classification
          ? ko?.config?.unplayed_places?.length
            ? "full-skip-last"
            : "full"
          : ko?.config?.third_place
          ? "third"
          : "none",
        heat_size: heats?.config?.heat_size ?? "",
        tiebreakers: (event.config?.tiebreakers ?? DEFAULT_TIEBREAKERS).filter(
          (key) => key in TIEBREAKER_LABELS
        ),
        tiebreakers_rank_standings: !!event.config?.tiebreakers_rank_standings,
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
      if (formValues.placements === "third") config.third_place = true;
      if (
        formValues.placements === "full" ||
        formValues.placements === "full-skip-last"
      ) {
        config.classification = true;
      }
      if (formValues.placements === "full-skip-last" && take >= 4) {
        config.unplayed_places = [take - 1];
      }
      stages.push({ structure: "knockout", config });
    }
    return stages;
  };

  const canEditStructure = !structureLocked && (isH2h || isFfa);

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
            : { display_avg_scores: !!formValues.display_avg_scores }),
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
          title="Advanced"
          open={showAdvanced}
          onToggle={() => setShowAdvanced((v) => !v)}
        >
          <div className="flex flex-col divide-y divide-gray-50">
            {isH2h && (
              <>
                {lockedNote}
                <SettingRow
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
                  <select
                    value={formValues.group_play}
                    onChange={handleInputChange}
                    name="group_play"
                    disabled={structureLocked}
                    className="shrink-0 input-box"
                  >
                    <option value="none">None</option>
                    <option value="semi">Semi round robin</option>
                    <option value="full">Full round robin</option>
                    <option value="swiss">Swiss 💎</option>
                  </select>
                </SettingRow>
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
                )}
              </>
            )}
            {isFfa && (
              <>
                {lockedNote}
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
              </>
            )}
            {!isH2h && !isFfa && (
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
            )}
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
              label="Score precision"
              hint="Whole numbers, decimals, or just win/loss."
            >
              <select
                name="decimal_places"
                value={formValues.decimal_places || ""}
                onChange={handleInputChange}
                className="shrink-0 input-box"
              >
                <option value="B">Win/Loss</option>
                <option value="0">Whole</option>
                <option value="1">0.0</option>
                <option value="2">0.00</option>
                <option value="3">0.000</option>
                <option value="16">Max</option>
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
          </div>
        </Fold>

        {isH2h && (
          <Fold
            Icon={DiamondOutlinedIcon}
            title="Premium"
            badge={
              PREMIUM_LOCKED && (
                <LockOutlinedIcon
                  sx={{ fontSize: 14 }}
                  className="text-light"
                />
              )
            }
            open={showPremium}
            onToggle={() => setShowPremium((v) => !v)}
          >
            {PREMIUM_LOCKED ? (
              <LockedNote />
            ) : (
              <div className="flex flex-col divide-y divide-gray-50">
                {lockedNote}
                {formValues.has_playoffs && (
                  <SettingRow
                    label="Placement games"
                    hint="Full placement runs the 5th/6th, 7th/8th run-offs."
                  >
                    <select
                      value={formValues.placements}
                      onChange={handleInputChange}
                      name="placements"
                      disabled={structureLocked}
                      className="shrink-0 input-box"
                    >
                      <option value="third">3rd place game</option>
                      <option value="full">Full placement</option>
                      <option value="full-skip-last">Full, split last</option>
                      <option value="none">Winners only</option>
                    </select>
                  </SettingRow>
                )}
                <SettingRow
                  label="Tiebreakers rank standings"
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
                <div className="py-2">
                  <h4 className="text-sm font-semibold">Tiebreaker order</h4>
                  <p className="text-[10px] text-light">
                    Only decides bracket spots and seeding — teams with equal
                    records always share the rank and split the points. The
                    record leads, random closes, and the middle is yours.
                  </p>
                  <div className="mt-1.5 overflow-hidden border border-gray-200 rounded-lg divide-y">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50">
                      <span className="w-4 text-xs font-semibold text-light">
                        —
                      </span>
                      <span className="flex-grow text-sm text-light">
                        Record (wins, then ties)
                      </span>
                      <span className="text-[10px] text-light">always first</span>
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
                </div>
              </div>
            )}
          </Fold>
        )}

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
