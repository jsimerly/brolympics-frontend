import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import IosShareIcon from "@mui/icons-material/IosShare";
import SmsOutlinedIcon from "@mui/icons-material/SmsOutlined";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import HomePre from "./HomePre";
import CopyWrapper from "../../Util/CopyWrapper.jsx";
import PopupContinue from "../../Util/PopupContinue.jsx";
import { startBrolympics, inviteLinkBrolympics } from "../../../api/client";
import { useNotification } from "../../Util/Notification";
import { apiErrorMessage } from "../../Util/apiError";

const CheckRow = ({ state, text, actionText, onAction }) => {
  const Icon =
    state === "ok"
      ? CheckCircleIcon
      : state === "warn"
      ? ErrorOutlineIcon
      : InfoOutlinedIcon;
  const color =
    state === "ok"
      ? "text-tertiary"
      : state === "warn"
      ? "text-yellow-600"
      : "text-light";
  return (
    <div className="flex items-center gap-2 py-1.5">
      <Icon sx={{ fontSize: 18 }} className={`shrink-0 ${color}`} />
      <span className="flex-grow min-w-0 text-sm">{text}</span>
      {actionText && (
        <button
          className="text-xs font-semibold shrink-0 text-primary"
          onClick={onAction}
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

/** The commissioner's launch panel: what's ready, what's not, one big go. */
const LaunchCard = ({ uuid, teams, events, team_size, setStatus }) => {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [starting, setStarting] = useState(false);

  const individual = team_size === 1;
  const openTeams = teams.filter((t) => t.is_available !== false).length;
  const undated = events.filter((e) => !e.projected_start_date).length;
  // events whose config doesn't fit the current field (creation never errors
  // on these -- THIS is where they surface, and they block the start button)
  const needsUpdate = events.filter((e) => (e.setup_issues || []).length > 0);

  const start = async () => {
    if (starting) return;
    setStarting(true);
    try {
      await startBrolympics(uuid);
      setStatus("active");
    } catch (error) {
      showNotification(
        apiErrorMessage(error, "There was an error starting your Brolympics.")
      );
      setStarting(false);
    }
  };

  return (
    <div className="p-3 bg-white border border-gray-200 rounded-lg">
      <h3 className="font-semibold">Launch Checklist</h3>
      <div className="mt-1 divide-y divide-gray-50">
        <CheckRow
          state={events.length > 0 ? "ok" : "warn"}
          text={
            events.length > 0
              ? `${events.length} event${events.length === 1 ? "" : "s"} on the slate`
              : "No events yet — the games need games"
          }
          actionText="Edit"
          onAction={() => navigate(`/b/${uuid}/manage/manage-events`)}
        />
        <CheckRow
          state={teams.length > 1 ? "ok" : "warn"}
          text={
            individual
              ? `${teams.length} player${teams.length === 1 ? "" : "s"} in`
              : teams.length > 1
              ? `${teams.length} teams in` +
                (openTeams > 0
                  ? ` — ${openTeams} still ${openTeams === 1 ? "has" : "have"} open spots`
                  : "")
              : "Fewer than 2 teams — invite the crew"
          }
          actionText="Edit"
          onAction={() => navigate(`/b/${uuid}/manage/manage-teams`)}
        />
        {undated > 0 && (
          <CheckRow
            state="info"
            text={`${undated} event${undated === 1 ? "" : "s"} without a scheduled time (fine for play-anytime events)`}
            actionText="Edit"
            onAction={() => navigate(`/b/${uuid}/manage/manage-events`)}
          />
        )}
        {needsUpdate.length > 0 && (
          <CheckRow
            state="warn"
            text={`${needsUpdate.length} event${
              needsUpdate.length === 1 ? " needs" : "s need"
            } updating for this field: ${needsUpdate
              .map((e) => e.name)
              .join(", ")}`}
            actionText="Fix"
            onAction={() => navigate(`/b/${uuid}/manage/manage-events`)}
          />
        )}
      </div>
      <button
        className="w-full py-2.5 mt-3 font-semibold text-white rounded-full bg-primary disabled:opacity-50"
        onClick={() => setConfirmOpen(true)}
        disabled={starting || needsUpdate.length > 0}
      >
        {starting ? "Starting..." : "Start Brolympics"}
      </button>
      <p className="pt-1.5 text-[11px] text-center text-light">
        {needsUpdate.length > 0
          ? "Some events need updating before you can begin."
          : "Starting locks registration. Events kick off one by one from their pages."}
      </p>
      <PopupContinue
        open={confirmOpen}
        setOpen={setConfirmOpen}
        header="Start the Brolympics?"
        desc="Registration closes and the games officially begin. Event schedules generate when you start each event."
        continueText="Start"
        continueFunc={start}
        danger={false}
      />
    </div>
  );
};

/** Bro-level invite: the only door in. */
const InviteCard = ({ uuid, name }) => {
  const link = inviteLinkBrolympics(uuid);
  const message = `You're invited to ${name || "the Brolympics"}! Claim your spot: ${link}`;

  return (
    <div className="p-3 bg-white border border-gray-200 rounded-lg">
      <h3 className="font-semibold">Invite the Crew</h3>
      <p className="text-xs text-light">
        Only people with this link can join.
      </p>
      <div className="flex items-center gap-2 p-2 mt-2 border border-gray-200 rounded-lg">
        <CopyWrapper copyString={link}>
          <div className="flex items-center flex-grow min-w-0 gap-2 cursor-pointer">
            <ContentCopyIcon
              sx={{ fontSize: 14 }}
              className="shrink-0 text-light"
            />
            <span className="text-xs truncate text-light">{link}</span>
          </div>
        </CopyWrapper>
      </div>
      <div className="grid grid-cols-2 gap-2 mt-2">
        <button
          className="flex items-center justify-center gap-2 py-2 text-sm font-semibold text-white rounded-full bg-primary"
          onClick={() => {
            if (navigator.share) {
              navigator.share({ title: name, text: message }).catch(() => {});
            } else {
              navigator.clipboard?.writeText(message);
            }
          }}
        >
          <IosShareIcon sx={{ fontSize: 16 }} /> Share
        </button>
        <button
          className="flex items-center justify-center gap-2 py-2 text-sm font-semibold border rounded-full text-primary border-primary"
          onClick={() => {
            window.location.href = `sms:?&body=${encodeURIComponent(message)}`;
          }}
        >
          <SmsOutlinedIcon sx={{ fontSize: 16 }} /> Text it
        </button>
      </div>
    </div>
  );
};

/** Admin pre-game home: launch panel + invites on top, the player view below
 * (commissioners have a team to run too). */
const HomeAdminPre = (props) => {
  const { uuid, name, teams = [], events = [], team_size, setStatus } = props;

  return (
    <div className="flex flex-col max-w-md gap-4 px-2 pt-4 mx-auto">
      <LaunchCard
        uuid={uuid}
        teams={teams}
        events={events}
        team_size={team_size}
        setStatus={setStatus}
      />
      <InviteCard uuid={uuid} name={name} />
      <div className="w-full h-[1px] bg-gray-200" />
      <div className="-mx-2 -mt-4">
        <HomePre {...props} />
      </div>
    </div>
  );
};

export default HomeAdminPre;
