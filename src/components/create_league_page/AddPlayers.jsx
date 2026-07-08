import { useEffect, useState } from "react";
import CreateWrapper from "./CreateWrapper";
import CopyWrapper from "../Util/CopyWrapper.jsx";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import IosShareIcon from "@mui/icons-material/IosShare";
import SmsOutlinedIcon from "@mui/icons-material/SmsOutlined";
import { fetchPlayers } from "../../api/client";
import useCachedFetch from "../../hooks/useCachedFetch";

const frontendUrl = import.meta.env.VITE_FRONTEND_URL;

const AddPlayers = ({ step, totalSteps, link, broName, leagueUuid, onComplete }) => {
  const inviteUrl = `${frontendUrl}/invite/brolympics/${link}`;
  const message = `You're invited to ${broName || "the Brolympics"}! Claim your spot: ${inviteUrl}`;

  const { data: players } = useCachedFetch(
    leagueUuid && link ? `league-players:${leagueUuid}` : null,
    () => fetchPlayers(leagueUuid)
  );
  const [checked, setChecked] = useState(null); // null until players load

  useEffect(() => {
    if (players && checked === null) {
      // everyone from prior years starts invited
      setChecked(new Set(players.map((p) => p.uuid)));
    }
  }, [players, checked]);

  const roster = players || [];
  const selected = checked || new Set();
  const allChecked = roster.length > 0 && selected.size === roster.length;

  const togglePlayer = (uuid) => {
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(uuid) ? next.delete(uuid) : next.add(uuid);
      return next;
    });
  };

  const toggleAll = () =>
    setChecked(allChecked ? new Set() : new Set(roster.map((p) => p.uuid)));

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: broName || "Brolympics", text: message });
      } catch {
        /* user closed the sheet */
      }
    } else {
      navigator.clipboard?.writeText(message);
    }
  };

  const handleText = () => {
    window.location.href = `sms:?&body=${encodeURIComponent(message)}`;
  };

  return (
    <CreateWrapper
      button_text="Done — Go to Brolympics"
      step={step}
      totalSteps={totalSteps}
      submit={onComplete}
      title="Invite the Crew"
      description="Your Brolympics is created. Only people with this link can join it (and your league)."
    >
      <div className="flex flex-col gap-4 py-2">
        <div className="flex items-center gap-2 p-3 text-sm border rounded-lg border-tertiary/40 bg-tertiary/5">
          <CheckCircleIcon className="text-tertiary" sx={{ fontSize: 20 }} />
          <span>
            <span className="font-semibold">{broName || "Your Brolympics"}</span>{" "}
            is live — events and all. Inviting can happen now or later from
            Manage.
          </span>
        </div>

        <div>
          <span className="form-label">Invite link</span>
          <div className="flex items-center gap-2 p-2 bg-white border border-gray-200 rounded-lg">
            <CopyWrapper copyString={inviteUrl}>
              <div className="flex items-center flex-grow min-w-0 gap-2 cursor-pointer">
                <ContentCopyIcon sx={{ fontSize: 16 }} className="shrink-0 text-light" />
                <span className="text-sm truncate">{inviteUrl}</span>
              </div>
            </CopyWrapper>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <button
              className="flex items-center justify-center gap-2 py-2.5 font-semibold text-white rounded-full bg-primary"
              onClick={handleShare}
            >
              <IosShareIcon sx={{ fontSize: 18 }} /> Share
            </button>
            <button
              className="flex items-center justify-center gap-2 py-2.5 font-semibold border rounded-full text-primary border-primary"
              onClick={handleText}
            >
              <SmsOutlinedIcon sx={{ fontSize: 18 }} /> Text it
            </button>
          </div>
          <p className="pt-1 text-[11px] text-light">
            The link is the key — nobody gets in without it.
          </p>
        </div>

        {roster.length > 0 && (
          <div>
            <div className="flex items-center justify-between pb-2">
              <span className="form-label !mb-0">
                Returning players ({selected.size}/{roster.length})
              </span>
              <button
                className="text-xs font-semibold text-primary"
                onClick={toggleAll}
              >
                {allChecked ? "Uncheck all" : "Check all"}
              </button>
            </div>
            <div className="overflow-hidden bg-white border border-gray-200 rounded-lg divide-y">
              {roster.map((player) => (
                <label
                  className="flex items-center gap-3 px-3 py-2 cursor-pointer"
                  key={player.uuid}
                >
                  <input
                    type="checkbox"
                    checked={selected.has(player.uuid)}
                    onChange={() => togglePlayer(player.uuid)}
                    className="w-4 h-4 accent-primary"
                  />
                  <span className="flex-grow text-sm">{player.name}</span>
                  {player.has_account && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-light">
                      has account
                    </span>
                  )}
                </label>
              ))}
            </div>
            <p className="pt-1 text-[11px] text-light">
              Your invite checklist — check people off as you send the link.
              Players with accounts will reconnect to their history when they
              join.
            </p>
          </div>
        )}
      </div>
    </CreateWrapper>
  );
};

export default AddPlayers;
