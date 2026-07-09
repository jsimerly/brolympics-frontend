import ManageEventWrapper from "./ManageEventWrapper";
import { useState, useEffect } from "react";
import { updateEvent, deleteEvent } from "../../../../api/client";
import PopupContinue from "../../../Util/PopupContinue";
import { useNotification } from "../../../Util/Notification";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import GavelOutlinedIcon from "@mui/icons-material/GavelOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

// Flips per-league when Pro gating lands; the locked UI below already works.
const ADVANCED_LOCKED = false;

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

const rowInputClass =
  "w-16 p-2 text-center bg-white border border-gray-300 rounded-md shrink-0";

const Segmented = ({ value, options, onChange }) => (
  <div className="flex overflow-hidden text-xs font-semibold border border-gray-300 rounded-full shrink-0">
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
    Advanced settings are part of Brolympics Pro.
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

/** Settings editor for any event: the basics (name, place, time) up front,
 * rules and advanced structure/scoring behind their own folds. h2h structure
 * stays editable only until the event starts. */
const ManageEvent = ({ event }) => {
  const [formValues, setFormValues] = useState({});
  const [saving, setSaving] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const { showNotification } = useNotification();
  const isH2h = (event.format || event.type) === "h2h";
  const structureLocked = event.is_active || event.is_complete;

  useEffect(() => {
    if (event) {
      const rr = (event.stages || []).find(
        (s) => s.structure === "round_robin"
      );
      const ko = (event.stages || []).find((s) => s.structure === "knockout");
      setFormValues({
        ...event,
        ...(event.config || {}),
        projected_start_date: toLocalInput(event.projected_start_date),
        projected_end_date: toLocalInput(event.projected_end_date),
        n_matches: rr?.config?.games_per_team ?? "",
        bracket_take: ko?.config?.take ?? "",
      });
    }
  }, [event]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };
  const set = (key, value) =>
    setFormValues((prev) => ({ ...prev, [key]: value }));

  const buildStages = () =>
    (event.stages || []).map((s) => ({
      structure: s.structure,
      config: {
        ...s.config,
        ...(s.structure === "round_robin" && formValues.n_matches
          ? { games_per_team: Number(formValues.n_matches) }
          : {}),
        ...(s.structure === "knockout" && formValues.bracket_take
          ? { take: Number(formValues.bracket_take) }
          : {}),
      },
    }));

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
            ? {}
            : { display_avg_scores: !!formValues.display_avg_scores }),
        },
        ...(formValues.name && formValues.name !== event.name
          ? { name_override: formValues.name }
          : {}),
        ...(isH2h && !structureLocked ? { stages: buildStages() } : {}),
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
          badge={
            ADVANCED_LOCKED && (
              <LockOutlinedIcon sx={{ fontSize: 14 }} className="text-light" />
            )
          }
          open={showAdvanced}
          onToggle={() => setShowAdvanced((v) => !v)}
        >
          {ADVANCED_LOCKED ? (
            <LockedNote />
          ) : (
            <div className="flex flex-col divide-y divide-gray-50">
              {isH2h ? (
                <>
                  {structureLocked && (
                    <p className="pb-1 text-[10px] text-red">
                      This event has started; its structure can no longer
                      change.
                    </p>
                  )}
                  <SettingRow
                    label="Matches per team"
                    hint="Group-play games before the bracket."
                  >
                    <input
                      value={formValues.n_matches || ""}
                      name="n_matches"
                      onChange={handleInputChange}
                      disabled={structureLocked}
                      className={`${rowInputClass} disabled:bg-gray-50 disabled:text-light`}
                      type="number"
                    />
                  </SettingRow>
                  <SettingRow
                    label="Bracket size"
                    hint="How many teams make the playoffs."
                  >
                    <input
                      value={formValues.bracket_take || ""}
                      name="bracket_take"
                      onChange={handleInputChange}
                      disabled={structureLocked}
                      className={`${rowInputClass} disabled:bg-gray-50 disabled:text-light`}
                      type="number"
                    />
                  </SettingRow>
                </>
              ) : (
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
                  className="p-2 bg-white border border-gray-300 rounded-md shrink-0"
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
          )}
        </Fold>

        <button
          className="w-full py-2.5 font-semibold text-white rounded-full bg-primary disabled:opacity-50"
          onClick={handleUpdateClicked}
          disabled={saving}
        >
          {saving ? "Saving..." : `Save ${event.name}`}
        </button>
        <button
          className="self-center text-xs font-semibold text-red"
          onClick={() => setDeleteOpen(true)}
        >
          Delete this event
        </button>
      </div>

      <PopupContinue
        open={deleteOpen}
        setOpen={setDeleteOpen}
        header={`Delete ${event.name}?`}
        desc="This removes the event from your Brolympics. You can recreate it later, but these settings are gone."
        continueText="Delete"
        continueFunc={deleteEventFunc}
      />
    </ManageEventWrapper>
  );
};

export default ManageEvent;
