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
import Events from "./events/Events.jsx";
import Standings from "./standings/Standings.jsx";
import Home from "./home/Home.jsx";
import Team from "./team/Team.jsx";
import InCompetition from "./InCompetition.jsx";
import ManageRouter from "./manage/ManageRouter.jsx";
import {
  fetchBrolympicsHome,
  fetchInCompetition,
} from "../../api/brolympics.js";
import { useAuth } from "../../context/AuthContext.jsx";

const Brolympics = () => {
  const [broInfo, setBroInfo] = useState();
  const { uuid } = useParams();
  const { firebaseUser } = useAuth();
  const [status, setStatus] = useState("active");
  const navigate = useNavigate();
  const location = useLocation();
  const page = location.pathname.split("/")[3];

  const [activeComp, setActiveComp] = useState({
    is_available: true,
    comp_uuid: "",
    type: "",
  });

  useEffect(() => {
    const getBrolympicsInfo = async () => {
      try {
        const data = await fetchBrolympicsHome(uuid);
        setBroInfo(data);
      } catch (error) {
        console.error("Error fetching Brolympics info:", error.message);
      }
    };
    getBrolympicsInfo();
  }, [uuid]);

  useEffect(() => {
    if (broInfo) {
      if (broInfo.is_active) setStatus("active");
      else if (!broInfo.is_complete && broInfo.is_owner) setStatus("pre_admin");
      else if (!broInfo.is_complete && !broInfo.is_owner) setStatus("pre");
      else if (broInfo.is_complete) setStatus("post");
    }
  }, [broInfo]);

  useEffect(() => {
    const checkActiveCompetition = async () => {
      if (broInfo && broInfo.is_active && firebaseUser) {
        try {
          const data = await fetchInCompetition();
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
      <div className="flex items-center justify-center h-screen">
        Loading...
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
              />
            }
          />
          <Route
            path="competition/:compUuid"
            element={<InCompetition activeComp={activeComp} />}
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
            is_owner={broInfo.is_owner}
            default_team_uuid={
              broInfo.user_team?.uuid || broInfo.teams?.[0].uuid || ""
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
