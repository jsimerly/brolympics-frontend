import Gold from "../../../assets/svgs/gold.svg";
import Silver from "../../../assets/svgs/silver.svg";
import Bronze from "../../../assets/svgs/bronze.svg";
import { Routes, Route } from "react-router-dom";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { fetchLeagueInfo } from "../../../api/league.js";
import CreateBrolympicsManager from "./CreateBrolympicsManager";
import LeagueSettings from "./LeagueSettings";
import League from "./League";

const LeagueRouter = () => {
  const [leagueInfo, setLeagueInfo] = useState();
  const { uuid } = useParams();

  useEffect(() => {
    const getLeagueInfo = async () => {
      try {
        const data = await fetchLeagueInfo(uuid);
        setLeagueInfo(data);
      } catch (error) {
        console.log(error);
      }
    };
    getLeagueInfo();
  }, [uuid]);

  return (
    <div className="min-h-[calc(100vh-80px)]">
      <Routes>
        <Route path="*" element={<League leagueInfo={leagueInfo} />} />
        <Route
          path="/settings"
          element={<LeagueSettings leagueInfo={leagueInfo} />}
        />
        <Route
          path="/create-brolympics"
          element={<CreateBrolympicsManager />}
        />
      </Routes>
    </div>
  );
};

export default LeagueRouter;
