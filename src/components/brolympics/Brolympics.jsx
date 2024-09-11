import { useEffect, useState, useContext } from "react";
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

  useEffect(() => {
    const getBrolympicsInfo = async () => {
      try {
        const data = await fetchBrolympicsHome(uuid);
        setBroInfo(data);
      } catch (error) {
        console.log(error.message);
      }
    };
    getBrolympicsInfo();
  }, []);

  useEffect(() => {
    if (broInfo) {
      broInfo.is_active && setStatus("active");
      !broInfo.is_active &&
        !broInfo.is_complete &&
        broInfo.is_owner &&
        setStatus("pre_admin");
      !broInfo.is_active &&
        !broInfo.is_complete &&
        !broInfo.is_owner &&
        setStatus("pre");
      broInfo.is_complete && setStatus("post");
    }
  }, [broInfo]);

  console.log(broInfo);

  const navigate = useNavigate();
  const location = useLocation();
  const page = location.pathname.split("/")[3];

  const [activeComp, setActiveComp] = useState({
    is_available: true,
    comp_uuid: "",
    type: "",
  });

  useEffect(() => {
    if (broInfo && broInfo.is_active) {
      const getIsAvailable = async () => {
        try {
          const data = await fetchInCompetition();
          if (!data.is_available) {
            if (activeComp.is_available) {
              setActiveComp(data);
            }

            if (
              !location.pathname.includes(
                `/b/${uuid}/competition/${data.comp_uuid}`
              )
            ) {
              navigate(`/b/${uuid}/competition/${data.comp_uuid}`);
            }
          }

          if (data.is_available) {
            if (!activeComp.is_available) {
              setActiveComp(data);
            }

            if (location.pathname.includes(`/b/${uuid}/competition/`)) {
              navigate(`/b/${uuid}/home`);
            }
          }
        } catch (error) {
          console.log(error.message);
        }
      };
      if (firebaseUser) {
        getIsAvailable();
      }
    }
  }, [location, broInfo, firebaseUser]);

  return (
    <div className="bg-neutral min-h-[calc(100vh-80px)] text-white">
      <div
        className={`w-full p-3 text-center 
         ${
           page === "manage" || (status === "pre_admin" && page === "home")
             ? "bg-offWhite text-neutralDark"
             : "border-b border-neutralLight"
         } `}
      >
        <h1 className="w-full font-bold leading-none text-[30px] ">
          Summer 2023
        </h1>
        <span>Stuck in Highschool</span>
      </div>
      <Routes>
        <Route
          path="home"
          element={
            <Home brolympics={broInfo} status={status} setStatus={setStatus} />
          }
        />
        <Route path="standings" element={<Standings />} />
        <Route
          path="team/:teamUuid"
          element={
            <Team
              teams={broInfo?.teams}
              default_uuid={broInfo?.user_team?.uuid || ""}
            />
          }
        />
        <Route
          path="event/:eventType/:eventUuid"
          element={
            <Events
              events={broInfo?.events}
              default_uuid={broInfo?.events?.[0]?.uuid}
              default_type={broInfo?.events?.[0]?.type}
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
      {activeComp.is_available && (
        <Toolbar
          status={status}
          is_owner={broInfo?.is_owner}
          default_team_uuid={broInfo?.user_team?.uuid || ""}
          default_event_type={broInfo?.events?.[0]?.type || ""}
          default_event_uuid={broInfo?.events?.[0]?.uuid || ""}
        />
      )}
    </div>
  );
};

export default Brolympics;
