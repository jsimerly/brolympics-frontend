import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import SportsEsportsOutlinedIcon from "@mui/icons-material/SportsEsportsOutlined";
import { useAuth } from "../../context/AuthContext";
import Account from "./Account.jsx";
import Img from "../Util/Img";
import { fetchUpcoming } from "../../api/client";

const fmt = (iso) => {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  } catch {
    return null;
  }
};

const dateRange = (start, end) => {
  const from = fmt(start);
  const to = fmt(end);
  if (from && to) return from === to ? from : `${from} – ${to}`;
  return from || to || null;
};

const Row = ({ icon, title, sub, badge, onClick }) => (
  <button
    className="flex items-center w-full gap-3 px-4 py-2.5 text-left active:bg-gray-50"
    onClick={onClick}
  >
    {icon}
    <span className="flex flex-col flex-grow min-w-0">
      <span className="text-sm font-semibold leading-tight truncate">
        {title}
      </span>
      {sub && <span className="text-xs truncate text-light">{sub}</span>}
    </span>
    {badge}
    <ChevronRightIcon className="shrink-0 text-light" sx={{ fontSize: 18 }} />
  </button>
);

const Section = ({ title, children }) => (
  <div className="pt-4">
    <h2 className="px-4 pb-1 text-xs font-semibold tracking-wide uppercase text-light">
      {title}
    </h2>
    <div>{children}</div>
  </div>
);

const LiveDot = () => (
  <span className="relative flex w-2.5 h-2.5 shrink-0">
    <span className="absolute inline-flex w-full h-full rounded-full opacity-75 animate-ping bg-tertiary" />
    <span className="relative inline-flex w-2.5 h-2.5 rounded-full bg-tertiary" />
  </span>
);

/** The drawer: who I am, my leagues, what's live, what's next. */
const Slideout = ({ open, leagues, setOpen }) => {
  const [view, setView] = useState("leagues");
  const { firebaseUser, user } = useAuth();
  const [currentBro, setCurrentBro] = useState([]);
  const [upcomingBro, setUpcomingBro] = useState([]);
  const [upcomingComps, setUpcomingComps] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getInfo = async () => {
      try {
        const data = await fetchUpcoming();
        setCurrentBro(data["current_brolympics"]);
        setUpcomingBro(data["upcoming_brolympics"]);
        setUpcomingComps(data["upcoming_competitions"]);
      } catch (error) {
        console.error("Error fetching upcoming events:", error.message);
      }
    };
    if (firebaseUser) {
      getInfo();
    }
  }, [firebaseUser]);

  if (user && !user.account_complete) {
    return <Account setView={setView} />;
  }

  const go = (path) => {
    navigate(path);
    setView("leagues");
    setOpen(false);
  };

  const broIcon = (info) => (
    <Img
      src={info.img}
      alt={info.name}
      kind="brolympics"
      className="object-cover w-10 h-10 rounded-lg shrink-0"
    />
  );

  return (
    <>
      <div
        className={`fixed inset-0 top-[60px] z-20 bg-black/30 transition-opacity duration-200 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
      />
      <div
        className={`fixed top-[60px] bottom-0 left-0 z-30 flex flex-col w-[85%] max-w-sm bg-white shadow-xl transition-transform duration-200 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {view === "account" ? (
          <div className="flex-grow overflow-y-auto">
            <Account setView={setView} />
          </div>
        ) : (
          <>
            <div className="flex-grow pb-6 overflow-y-auto">
              {firebaseUser ? (
                <>
                  {user && (
                    <div className="border-b border-gray-100">
                      <Row
                        icon={
                          <Img
                            src={user.img}
                            alt={user.display_name}
                            kind="player"
                            className="object-cover w-10 h-10 rounded-full shrink-0"
                          />
                        }
                        title={user.display_name || user.email}
                        sub="View account"
                        onClick={() => setView("account")}
                      />
                    </div>
                  )}

                  <Section title="Leagues">
                    {(leagues || []).map((league) => (
                      <Row
                        key={league.uuid}
                        icon={
                          <Img
                            src={league.img}
                            alt={league.name}
                            kind="league"
                            className="object-cover w-10 h-10 rounded-lg shrink-0"
                          />
                        }
                        title={league.name}
                        onClick={() => go(`/league/${league.uuid}`)}
                      />
                    ))}
                    <Row
                      icon={
                        <span className="flex items-center justify-center w-10 h-10 rounded-lg shrink-0 bg-primary/10">
                          <AddCircleOutlineIcon
                            className="text-primary"
                            sx={{ fontSize: 22 }}
                          />
                        </span>
                      }
                      title="Add a league"
                      onClick={() => go("/start-league")}
                    />
                  </Section>

                  {currentBro.length > 0 && (
                    <Section title="Happening Now">
                      {currentBro.map((info) => (
                        <Row
                          key={info.uuid}
                          icon={broIcon(info)}
                          title={info.name}
                          sub={dateRange(
                            info.projected_start_date,
                            info.projected_end_date
                          )}
                          badge={<LiveDot />}
                          onClick={() => go(`/b/${info.uuid}/home`)}
                        />
                      ))}
                    </Section>
                  )}

                  {upcomingBro.length > 0 && (
                    <Section title="Upcoming">
                      {upcomingBro.map((info) => (
                        <Row
                          key={info.uuid}
                          icon={broIcon(info)}
                          title={info.name}
                          sub={dateRange(
                            info.projected_start_date,
                            info.projected_end_date
                          )}
                          onClick={() => go(`/b/${info.uuid}/home`)}
                        />
                      ))}
                    </Section>
                  )}

                  {upcomingComps.length > 0 && (
                    <Section title="My Games">
                      {upcomingComps.map((contest) => (
                        <Row
                          key={contest.uuid}
                          icon={
                            <span className="flex items-center justify-center w-10 h-10 rounded-lg shrink-0 bg-gray-100">
                              <SportsEsportsOutlinedIcon
                                className="text-light"
                                sx={{ fontSize: 20 }}
                              />
                            </span>
                          }
                          title={contest.event_name}
                          sub={contest.entries
                            ?.map((e) => e.team_name ?? e.player_name)
                            .filter(Boolean)
                            .join(" vs ")}
                          onClick={() => go(`/b/${contest.brolympics}/home`)}
                        />
                      ))}
                    </Section>
                  )}
                </>
              ) : (
                <div className="p-4 m-4 text-sm border border-gray-200 rounded-lg">
                  <p className="pb-2 font-semibold">You're not logged in.</p>
                  <button
                    className="w-full py-2 font-semibold text-white rounded-full bg-primary"
                    onClick={() => go("/auth")}
                  >
                    Sign in
                  </button>
                </div>
              )}
            </div>
            <div className="border-t border-gray-100">
              <Row
                icon={
                  <InfoOutlinedIcon
                    className="text-light shrink-0"
                    sx={{ fontSize: 22 }}
                  />
                }
                title="About Brolympics"
                onClick={() => go("/about")}
              />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Slideout;
