import Gold from "../../../assets/svgs/gold.svg";
import Silver from "../../../assets/svgs/silver.svg";
import Bronze from "../../../assets/svgs/bronze.svg";
import { Routes, Route } from "react-router-dom";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { fetchLeagueDetail } from "../../../api/client";
import useCachedFetch from "../../../hooks/useCachedFetch";
import CreateBrolympicsManager from "./CreateBrolympicsManager";
import LeagueSettings from "./LeagueSettings";
import PlayerStats from "./PlayerStats";
import EventStats from "./EventStats";
import League from "./League";

const LeagueRouter = () => {
  const { uuid } = useParams();
  const { data: leagueInfo } = useCachedFetch(`league-detail:${uuid}`, () =>
    fetchLeagueDetail(uuid)
  );

  return (
    <div className="h-screen-minus-nav">
      <Routes>
        <Route path="*" element={<League leagueInfo={leagueInfo} />} />
        <Route
          path="/settings"
          element={<LeagueSettings leagueInfo={leagueInfo} />}
        />
        <Route path="/player/:playerUuid/stats" element={<PlayerStats />} />
        <Route path="/event/:eventTypeUuid/stats" element={<EventStats />} />
        <Route
          path="/create-brolympics"
          element={<CreateBrolympicsManager />}
        />
      </Routes>
    </div>
  );
};

export default LeagueRouter;
