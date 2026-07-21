import { useEffect, useState } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
  useParams,
} from "react-router-dom";
import Toolbar from "./toolbar/Toolbar.jsx";
import RingStrip from "../Util/RingStrip";
import Events from "./events/Events.jsx";
import Standings from "./standings/Standings.jsx";
import Home from "./home/Home.jsx";
import Team from "./team/Team.jsx";
import InCompetition from "./InCompetition.jsx";
import ManageRouter from "./manage/ManageRouter.jsx";
import { fetchBrolympicsDetail, fetchMyOpenContests } from "../../api/client";
import useCachedFetch from "../../hooks/useCachedFetch";
import { SkeletonBroPage } from "../Util/Skeleton";
import { useAuth } from "../../context/AuthContext.jsx";
import { useNotification } from "../Util/Notification";

const Brolympics = () => {
  const { uuid } = useParams();
  const { data: broInfo, error: broError } = useCachedFetch(
    `bro-detail:${uuid}`,
    () => fetchBrolympicsDetail(uuid)
  );
  const { firebaseUser } = useAuth();
  const { showNotification } = useNotification();
  const [status, setStatus] = useState("active");
  const navigate = useNavigate();
  const location = useLocation();
  const page = location.pathname.split("/")[3];

  // A dead link (deleted/archived bro, e.g. from a stale hamburger list) must
  // bounce with a banner, never skeleton forever with dead buttons.
  useEffect(() => {
    if (!broInfo && broError?.response?.status === 404) {
      showNotification(
        "That Brolympics no longer exists — it may have been deleted.",
        "border-yellow-500"
      );
      navigate("/", { replace: true });
    }
  }, [broError, broInfo, navigate, showNotification]);

  const [activeComp, setActiveComp] = useState({
    is_available: true,
    comp_uuid: "",
    type: "",
  });

  useEffect(() => {
    if (broInfo) {
      // complete wins over active: a finished bro is history even if a
      // stale is_active flag survives
      if (broInfo.is_complete) setStatus("post");
      else if (broInfo.is_active) setStatus("active");
      else if (broInfo.is_admin) setStatus("pre_admin");
      else setStatus("pre");
    }
  }, [broInfo]);

  useEffect(() => {
    const checkActiveCompetition = async () => {
      if (broInfo && broInfo.is_active && firebaseUser) {
        try {
          const mine = await fetchMyOpenContests();
          const active = mine.find((c) => c.is_active);
          const data = {
            is_available: !active,
            comp_uuid: active?.uuid,
          };
          setActiveComp(data);

          if (
            !data.is_available &&
            !location.pathname.includes(
              `/b/${uuid}/competition/${data.comp_uuid}`
            )
          ) {
            navigate(`/b/${uuid}/competition/${data.comp_uuid}`);
          } else if (
            data.is_available &&
            location.pathname.includes(`/b/${uuid}/competition/`)
          ) {
            navigate(`/b/${uuid}/home`);
          }
        } catch (error) {
          console.error("Error checking active competition:", error.message);
        }
      }
    };

    checkActiveCompetition();
  }, [location, broInfo, firebaseUser, uuid, navigate]);

  if (!broInfo) {
    return (
      <div className="w-full max-w-3xl mx-auto">
        <SkeletonBroPage />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen-minus-nav">
      <header className="w-full px-6 pt-4 text-center">
        <h1 className="py-4 text-3xl font-bold">
          {broInfo.name || "Name Missing"}
        </h1>
        <p className="text-sm">{broInfo.league_name || ""}</p>
        <RingStrip className="w-24 mx-auto mt-3" />
      </header>

      <main className="flex-grow container-padding">
        <Routes>
          <Route
            path="home"
            element={
              <Home
                brolympics={broInfo}
                status={status}
                setStatus={setStatus}
              />
            }
          />
          <Route
            path="standings"
            element={<Standings status={status} teams={broInfo.teams} />}
          />
          <Route
            path="team/:teamUuid"
            element={
              <Team
                teams={broInfo.teams}
                default_uuid={broInfo.user_team?.uuid || ""}
                status={status}
              />
            }
          />
          <Route
            path="event/:eventType/:eventUuid"
            element={
              <Events
                events={broInfo.events}
                default_uuid={broInfo.events?.[0]?.uuid}
                default_type={broInfo.events?.[0]?.type}
                status={status}
                is_admin={broInfo.is_admin}
              />
            }
          />
          <Route
            path="competition/:compUuid"
            element={<InCompetition />}
          />
          <Route
            path="manage/*"
            element={<ManageRouter brolympics={broInfo} />}
          />
          <Route path="*" element={<Navigate to={`/b/${uuid}/home`} />} />
        </Routes>
      </main>

      {activeComp.is_available && (
        <footer className="bg-gray-100">
          <Toolbar
            status={status}
            is_owner={broInfo.is_admin}
            default_team_uuid={
              broInfo.user_team?.uuid || broInfo.teams?.[0]?.uuid || ""
            }
            default_event_type={broInfo.events?.[0]?.type || ""}
            default_event_uuid={broInfo.events?.[0]?.uuid || ""}
          />
        </footer>
      )}
    </div>
  );
};

export default Brolympics;
