import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import IosShareIcon from "@mui/icons-material/IosShare";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { format, parseISO } from "date-fns";
import {
  createTeam,
  updateTeam,
  joinTeam,
  leaveTeam,
  inviteLinkTeam,
} from "../../../api/client";
import Img from "../../Util/Img";
import CopyWrapper from "../../Util/CopyWrapper.jsx";
import PopupContinue from "../../Util/PopupContinue.jsx";
import ImageCropper, { readImageFile } from "../../Util/ImageCropper.jsx";
import { useNotification } from "../../Util/Notification.jsx";
import { daysUntil } from "../../Util/dates";

const FORMAT_LABEL = {
  h2h: "Head to Head",
  ind: "Individual",
  team: "Team",
  ffa: "Free-for-All",
};

/* dateRange stays local: it collapses same-day ranges and says "Dates TBD",
   unlike the shared formatDateRange. */
const dateRange = (start, end) => {
  if (!start) return "Dates TBD";
  const from = format(parseISO(start), "MMM d");
  if (!end) return from;
  const to = format(parseISO(end), "MMM d");
  return from === to ? from : `${from} – ${to}`;
};

/** The countdown hero: logo, dates, and how many are in. */
export const StatusCard = ({
  img,
  name,
  projected_start_date,
  projected_end_date,
  teams = [],
  team_size,
}) => {
  const days = daysUntil(projected_start_date);
  const countLabel =
    team_size === 1
      ? `${teams.length} player${teams.length === 1 ? "" : "s"} in`
      : `${teams.length} team${teams.length === 1 ? "" : "s"} in`;
  return (
    <div className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg">
      <Img
        src={img}
        alt={name}
        kind="brolympics"
        className="object-cover w-14 h-14 rounded-lg shrink-0"
      />
      <div className="flex flex-col min-w-0 gap-0.5">
        <span className="text-sm font-semibold">
          {dateRange(projected_start_date, projected_end_date)}
        </span>
        <span className="text-xs text-light">{countLabel}</span>
      </div>
      {days !== null && days >= 0 && (
        <span className="px-2.5 py-1 ml-auto text-xs font-semibold rounded-full shrink-0 bg-primary/10 text-primary">
          {days === 0 ? "Starts today" : `${days} day${days === 1 ? "" : "s"} out`}
        </span>
      )}
    </div>
  );
};

/** My team: logo (tap to swap), roster, inline rename, invite when open. */
const MyTeamCard = ({ uuid, name, img, players = [], is_available }) => {
  const [editing, setEditing] = useState(false);
  const [teamName, setTeamName] = useState(name);
  const [imgSrc, setImgSrc] = useState(null);
  const [savedImg, setSavedImg] = useState(img);
  const [cropping, setCropping] = useState(false);
  const [leaveOpen, setLeaveOpen] = useState(false);
  const { showNotification } = useNotification();

  const handleImageUpload = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setImgSrc(await readImageFile(e.target.files[0]));
      setCropping(true);
    }
  };

  const setCroppedImage = async (croppedImage) => {
    setCropping(false);
    try {
      await updateTeam(uuid, { img: croppedImage });
      setSavedImg(croppedImage);
    } catch (error) {
      console.log(error);
      showNotification(
        "Couldn't save the image — keep it under 500kb and try again."
      );
    }
  };

  const saveName = async () => {
    const next = teamName.trim();
    if (next && next !== name) {
      try {
        await updateTeam(uuid, { name: next });
      } catch (error) {
        console.log(error);
        showNotification("Couldn't save the team name.");
        setTeamName(name);
      }
    }
    setEditing(false);
  };

  const leave = async () => {
    try {
      await leaveTeam(uuid);
      location.reload();
    } catch (error) {
      console.log(error);
      showNotification("Couldn't leave the team.");
    }
  };

  return (
    <div className="p-3 bg-white border border-gray-200 rounded-lg">
      <div className="flex items-start gap-3">
        <input
          type="file"
          accept="image/*"
          id="file_team"
          onChange={handleImageUpload}
          hidden
        />
        <label htmlFor="file_team" className="relative cursor-pointer shrink-0">
          <Img
            src={savedImg}
            alt={name}
            kind="team"
            className="object-cover w-16 h-16 rounded-lg"
          />
          <span className="absolute p-0.5 bg-white border border-gray-200 rounded-full -bottom-1 -right-1">
            <CameraAltIcon sx={{ fontSize: 14 }} className="text-light" />
          </span>
        </label>

        <div className="flex flex-col min-w-0 gap-0.5 flex-grow">
          {editing ? (
            <div className="flex items-center gap-2">
              <input
                className="min-w-0 flex-grow input-primary !py-1.5"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                autoFocus
              />
              <button
                className="text-sm font-semibold shrink-0 text-primary"
                onClick={saveName}
              >
                Save
              </button>
            </div>
          ) : (
            <h3 className="font-semibold leading-tight">{name}</h3>
          )}
          {players.map((player) => (
            <span className="text-sm text-light" key={player.uuid}>
              {player.name}
            </span>
          ))}
          {editing && (
            <button
              className="self-start pt-1 text-xs font-semibold text-red"
              onClick={() => setLeaveOpen(true)}
            >
              Leave this team
            </button>
          )}
        </div>

        <button
          className="shrink-0 text-light"
          onClick={() => setEditing((v) => !v)}
        >
          {editing ? (
            <CloseIcon sx={{ fontSize: 20 }} />
          ) : (
            <EditIcon sx={{ fontSize: 20 }} />
          )}
        </button>
      </div>

      {is_available !== false && (
        <div className="pt-3 mt-3 border-t border-gray-100">
          <span className="text-xs font-semibold tracking-wide uppercase text-light">
            Room on the roster
          </span>
          <div className="flex items-center gap-2 mt-1">
            <CopyWrapper copyString={inviteLinkTeam(uuid)}>
              <div className="flex items-center flex-grow min-w-0 gap-2 p-2 border border-gray-200 rounded-lg cursor-pointer">
                <ContentCopyIcon
                  sx={{ fontSize: 14 }}
                  className="shrink-0 text-light"
                />
                <span className="text-xs truncate text-light">
                  {inviteLinkTeam(uuid)}
                </span>
              </div>
            </CopyWrapper>
            <button
              className="flex items-center gap-1 px-3 py-2 text-xs font-semibold text-white rounded-full shrink-0 bg-primary"
              onClick={() => {
                if (navigator.share) {
                  navigator
                    .share({
                      title: name,
                      text: `Join my team "${name}": ${inviteLinkTeam(uuid)}`,
                    })
                    .catch(() => {});
                } else {
                  navigator.clipboard?.writeText(inviteLinkTeam(uuid));
                }
              }}
            >
              <IosShareIcon sx={{ fontSize: 14 }} /> Share
            </button>
          </div>
        </div>
      )}

      {cropping && (
        <ImageCropper
          img={imgSrc}
          setCroppedImage={setCroppedImage}
          handleCloseCropper={() => setCropping(false)}
        />
      )}
      <PopupContinue
        open={leaveOpen}
        setOpen={setLeaveOpen}
        header="Leave this team?"
        desc="You can rejoin later with the team's invite link."
        continueText="Leave"
        continueFunc={leave}
      />
    </div>
  );
};

/** No team yet: create one here or join an open one below. */
const CreateTeamCard = ({ broUuid }) => {
  const [open, setOpen] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [teamImg, setTeamImg] = useState(null);
  const [cropping, setCropping] = useState(false);
  const [busy, setBusy] = useState(false);
  const { showNotification } = useNotification();

  const handleImageUpload = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setTeamImg(await readImageFile(e.target.files[0]));
      setCropping(true);
    }
  };

  const create = async () => {
    if (!teamName.trim() || busy) return;
    setBusy(true);
    try {
      const team = await createTeam({
        name: teamName.trim(),
        brolympics: broUuid,
      });
      if (teamImg) await updateTeam(team.uuid, { img: teamImg });
      await joinTeam(team.uuid);
      location.reload();
    } catch (error) {
      console.log(error);
      showNotification("Couldn't create the team. Try again in a second.");
      setBusy(false);
    }
  };

  return (
    <div className="p-3 bg-white border border-gray-200 rounded-lg">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold">You're not on a team yet</h3>
          <p className="text-xs text-light">
            Start your own, or join an open team below.
          </p>
        </div>
        <button
          className="flex items-center gap-1 px-3 py-2 text-sm font-semibold text-white rounded-full shrink-0 bg-primary"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? (
            <CloseIcon sx={{ fontSize: 16 }} />
          ) : (
            <AddCircleOutlineIcon sx={{ fontSize: 16 }} />
          )}
          {open ? "Close" : "Create"}
        </button>
      </div>

      {open && (
        <div className="flex flex-col gap-3 pt-3 mt-3 border-t border-gray-100">
          <div>
            <label htmlFor="new-team-name" className="form-label">
              Team name <span className="text-red">*</span>
            </label>
            <input
              id="new-team-name"
              className="w-full input-primary"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="The Dream Team"
              autoComplete="off"
            />
          </div>
          <div className="flex items-center gap-3">
            <input
              type="file"
              accept="image/*"
              id="file_new_team"
              onChange={handleImageUpload}
              hidden
            />
            <label htmlFor="file_new_team" className="cursor-pointer shrink-0">
              {teamImg ? (
                <img
                  src={teamImg}
                  className="object-cover w-16 h-16 rounded-lg"
                  alt="New team logo"
                />
              ) : (
                <div className="flex flex-col items-center justify-center w-16 h-16 gap-0.5 border-2 border-dashed border-gray-300 rounded-lg text-light">
                  <CameraAltIcon sx={{ fontSize: 20 }} />
                  <span className="text-[9px]">Logo</span>
                </div>
              )}
            </label>
            <button
              className={`flex-grow py-2.5 font-semibold rounded-full transition-colors ${
                teamName.trim() && !busy
                  ? "text-white bg-primary"
                  : "text-gray-400 bg-gray-100 cursor-not-allowed"
              }`}
              onClick={create}
              disabled={!teamName.trim() || busy}
            >
              {busy ? "Creating..." : "Create & join"}
            </button>
          </div>
          {cropping && (
            <ImageCropper
              img={teamImg}
              setCroppedImage={(cropped) => {
                setTeamImg(cropped);
                setCropping(false);
              }}
              handleCloseCropper={() => setCropping(false)}
            />
          )}
        </div>
      )}
    </div>
  );
};

/** This year's events, dated ones first, tap through to the event page. */
export const EventLineup = ({ events = [] }) => {
  const navigate = useNavigate();
  const { uuid } = useParams();
  if (events.length === 0) {
    return (
      <p className="text-sm text-light">
        No events on the slate yet — check back soon.
      </p>
    );
  }
  const sorted = [...events].sort((a, b) => {
    if (a.projected_start_date && b.projected_start_date) {
      return new Date(a.projected_start_date) - new Date(b.projected_start_date);
    }
    if (a.projected_start_date) return -1;
    if (b.projected_start_date) return 1;
    return (a.name || "").localeCompare(b.name || "");
  });
  return (
    <div className="overflow-hidden bg-white border border-gray-200 rounded-lg divide-y">
      {sorted.map((event) => (
        <button
          key={event.uuid}
          className="flex items-center justify-between w-full gap-3 px-3 py-2.5 text-left"
          onClick={() =>
            navigate(`/b/${uuid}/event/${event.type}/${event.uuid}`)
          }
        >
          <div className="min-w-0">
            <h4 className="text-sm font-medium leading-tight">{event.name}</h4>
            <p className="text-[11px] text-light">
              {FORMAT_LABEL[event.type] || event.type}
              {event.location ? ` · ${event.location}` : ""}
            </p>
          </div>
          <span className="text-xs shrink-0 text-light">
            {event.projected_start_date
              ? format(parseISO(event.projected_start_date), "EEE MMM d")
              : "TBD"}
          </span>
        </button>
      ))}
    </div>
  );
};

/** Every team, mine pinned on top; open ones are joinable when I'm teamless. */
const TeamsSection = ({ teams = [], user_team, team_size, broUuid }) => {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const individual = team_size === 1;

  const join = async (team) => {
    try {
      await joinTeam(team.uuid);
      location.reload();
    } catch (error) {
      console.log(error);
      showNotification("Couldn't join the team.");
    }
  };

  const ordered = [...teams].sort((a, b) => {
    if (user_team) {
      if (a.uuid === user_team.uuid) return -1;
      if (b.uuid === user_team.uuid) return 1;
    }
    return (a.name || "").localeCompare(b.name || "");
  });

  if (ordered.length === 0) {
    return (
      <p className="text-sm text-light">
        {individual ? "Nobody has joined yet." : "No teams yet — start one!"}
      </p>
    );
  }

  return (
    <div className="overflow-hidden bg-white border border-gray-200 rounded-lg divide-y">
      {ordered.map((team) => {
        const isMine = user_team && team.uuid === user_team.uuid;
        return (
          <div key={team.uuid} className="flex items-center gap-3 px-3 py-2">
            <button
              className="flex items-center flex-grow min-w-0 gap-3 text-left"
              onClick={() => navigate(`/b/${broUuid}/team/${team.uuid}`)}
            >
              <Img
                src={team.img}
                alt={team.name}
                kind={individual ? "player" : "team"}
                className="object-cover w-10 h-10 rounded-lg shrink-0"
              />
              <div className="min-w-0">
                <h4 className="text-sm font-medium leading-tight truncate">
                  {team.name}
                </h4>
                {!individual && (
                  <p className="text-[11px] truncate text-light">
                    {(team.players || []).map((p) => p.name).join(", ") ||
                      "no players yet"}
                  </p>
                )}
              </div>
            </button>
            {isMine ? (
              <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full shrink-0 bg-primary/10 text-primary">
                Your team
              </span>
            ) : (
              !individual &&
              !user_team &&
              team.is_available !== false && (
                <button
                  className="px-3 py-1 text-xs font-semibold border rounded-full shrink-0 text-primary border-primary"
                  onClick={() => join(team)}
                >
                  Join
                </button>
              )
            )}
          </div>
        );
      })}
    </div>
  );
};

const Section = ({ title, children }) => (
  <div>
    <h2 className="mb-2 text-lg font-bold">{title}</h2>
    {children}
  </div>
);

const HomePre = (props) => {
  const { events = [], teams = [], user_team, team_size } = props;
  const { uuid } = useParams();
  const individual = team_size === 1;

  return (
    <div className="flex flex-col max-w-md gap-6 px-2 py-4 mx-auto">
      <StatusCard {...props} />

      {!individual &&
        (user_team ? (
          <MyTeamCard {...user_team} />
        ) : (
          <CreateTeamCard broUuid={uuid} />
        ))}

      <Section title="Event Lineup">
        <EventLineup events={events} />
      </Section>

      <Section
        title={
          individual
            ? `Who's In (${teams.length})`
            : `Teams (${teams.length})`
        }
      >
        <TeamsSection
          teams={teams}
          user_team={user_team}
          team_size={team_size}
          broUuid={uuid}
        />
      </Section>
    </div>
  );
};

export default HomePre;
