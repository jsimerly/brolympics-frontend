import Gold from "../../../assets/svgs/gold.svg";
import Silver from "../../../assets/svgs/silver.svg";
import Bronze from "../../../assets/svgs/bronze.svg";
import { Routes, Route, Link } from "react-router-dom";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { fetchLeagueInfo } from "../../../api/league.js";
import CreateBrolympicsManager from "./CreateBrolympicsManager";
import { useAuth } from "../../../context/AuthContext.jsx";
import SettingsIcon from "@mui/icons-material/Settings";

const BrolympicsCard_Upcoming = ({
  img,
  name,
  events,
  teams,
  projected_start_date,
  projected_end_date,
  uuid,
}) => {
  const navigate = useNavigate();
  const handleGoToBrolympics = () => {
    navigate(`/b/${uuid}/home/`);
  };

  const formatDate = (dateString) => {
    const options = { month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div
      className="p-3 border rounded-md border-primary"
      onClick={handleGoToBrolympics}
    >
      <div className="flex items-center justify-between">
        <div className="flex gap-3 item-center">
          <img
            src={img}
            className="bg-white h-[80px] w-[80px] rounded-lg text-black"
          />
          <div className="flex flex-col justify-center">
            <h3 className="text-[20px] font-bold flex items-center">{name}</h3>
            <div className="text-[12px] flex items-start justify-start">
              {projected_start_date && formatDate(projected_start_date)}
              {projected_start_date && projected_end_date && " - "}
              {projected_end_date && formatDate(projected_end_date)}
            </div>
          </div>
        </div>
      </div>
      <div className="flex pt-6 text-[14px]">
        <div className="pr-2 text-[16px] flex  justify-center">Events:</div>
        <div className="flex flex-wrap gap-2">
          {events.map((event, i) => (
            <div
              className="p-1 border rounded-md border-primaryLight"
              key={i + "bro_card_event"}
            >
              {event.name}
            </div>
          ))}
        </div>
      </div>
      {teams.length > 0 && (
        <div className="flex pt-6 text-[14px]">
          <div className="pr-2 text-[16px]">Teams:</div>
          <div className="flex flex-wrap gap-2">
            {teams.map((team, i) => (
              <div
                className="p-1 border rounded-md border-primaryLight"
                key={i + "bro_card_team"}
              >
                {team.name}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const BrolympicsCard_Completed = ({
  img,
  name,
  end_date,
  winner,
  second,
  third,
}) => (
  <div className="p-3 border rounded-md border-primary">
    <div className="flex items-center justify-between">
      <div className="flex gap-3 item-center">
        <img
          src={img}
          className="bg-white h-[80px] w-[80px] rounded-lg text-black"
        />
        <h3 className="text-[20px] font-bold flex items-center">{name}</h3>
      </div>
      <div className="text-[12px] flex items-end justify-end">{end_date}</div>
    </div>
    <div className="flex flex-col justify-center gap-3 px-2 pt-4">
      <div className="flex gap-1">
        <img src={Gold} className="h-[20px]" />
        {winner}
      </div>
      <div className="flex gap-1">
        <img src={Silver} className="h-[20px]" />
        {second}
      </div>
      <div className="flex gap-1">
        <img src={Bronze} className="h-[20px]" />
        {third}
      </div>
    </div>
  </div>
);

const League = ({leagueInfo}) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const onCreateClick = () => {
    navigate("create-brolympics");
  };
  const isOwner = leagueInfo?.league_owner === user.uid;

  return (
    <div className="min-h-[calc(100vh-80px)] px-6 py-3 text-white bg-neutral flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between w-full">
          <div>
            <h1 className="text-[26px] font-bold leading-none pt-3">
              {leagueInfo?.name || "No Name"}
            </h1>
            <span className="text-[12px]">
              Founded: {leagueInfo?.founded || "Unknown"}
            </span>
          </div>
          {isOwner && (
            <Link to="settings">
              <SettingsIcon sx={{ fontSize: 40 }} />
            </Link>
          )}
        </div>
        <div>
          <h2 className="py-3 ml-1 font-bold"> Upcoming Brolympics </h2>
          <div className="flex flex-col gap-3">
            {leagueInfo &&
              leagueInfo.upcoming_brolympics.map((brolympic, i) => (
                <BrolympicsCard_Upcoming
                  {...brolympic}
                  key={i + "_upcoming_bro_card"}
                />
              ))}
            {leagueInfo &&
              leagueInfo.upcoming_brolympics.length === 0 &&
              "You have do not have any upcoming Brolympics."}
          </div>
          <h2 className="py-3 ml-1 font-bold"> Completed Brolympics </h2>
          <div className="flex flex-col gap-3">
            {leagueInfo &&
              leagueInfo.completed_brolympics.map((brolympic, i) => (
                <BrolympicsCard_Completed
                  {...brolympic}
                  key={i + "_complete_bro_card"}
                />
              ))}
            {leagueInfo &&
              leagueInfo.completed_brolympics.length === 0 &&
              "You have not completed any Brolympics."}
          </div>
        </div>
      </div>
      <button
        className="w-full p-2 rounded-md bg-primary"
        onClick={onCreateClick}
      >
        Create Brolymipcs
      </button>
      <Routes>
        <Route path="/league-settings" />
        <Route
          path="/create-brolympics"
          element={<CreateBrolympicsManager />}
        />
      </Routes>
    </div>
  );
};

export default League;
