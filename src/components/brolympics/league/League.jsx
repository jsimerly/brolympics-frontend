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
    <div className="p-4 card-clickable" onClick={handleGoToBrolympics}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <img
            src={img}
            alt={name}
            className="object-cover w-20 h-20 bg-white rounded-lg"
          />
          <div className="flex flex-col justify-center">
            <h3 className="header-4 text-near-black">{name}</h3>
            <div className="text-sm text-light">
              {projected_start_date && formatDate(projected_start_date)}
              {projected_start_date && projected_end_date && " - "}
              {projected_end_date && formatDate(projected_end_date)}
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <div className="flex flex-col">
          {events.length > 0 && (
            <>
              <div className="mb-2 header-sm">Events:</div>
              <div className="flex flex-wrap gap-2">
                {events.map((event, i) => (
                  <div
                    className="px-2 py-1 text-sm border rounded-md border-primary"
                    key={i + "bro_card_event"}
                  >
                    {event.name}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        {teams.length > 0 && (
          <div className="flex flex-col">
            <div className="mb-2 header-sm">Teams:</div>
            <div className="flex flex-wrap gap-2">
              {teams.map((team, i) => (
                <div
                  className="px-2 py-1 text-sm border rounded-md border-tertiary"
                  key={i + "bro_card_team"}
                >
                  {team.name}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
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
  <div className="p-4 card">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-4">
        <img
          src={img}
          alt={name}
          className="object-cover w-20 h-20 bg-white rounded-lg"
        />
        <h3 className="header-4 text-near-black">{name}</h3>
      </div>
      <div className="text-sm text-light">{end_date}</div>
    </div>
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <img src={Gold} alt="Gold" className="h-5" />
        <span className="text-near-black">{winner}</span>
      </div>
      <div className="flex items-center gap-2">
        <img src={Silver} alt="Silver" className="h-5" />
        <span className="text-light">{second}</span>
      </div>
      <div className="flex items-center gap-2">
        <img src={Bronze} alt="Bronze" className="h-5" />
        <span className="text-light">{third}</span>
      </div>
    </div>
  </div>
);

const League = ({ leagueInfo }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const onCreateClick = () => {
    navigate("create-brolympics");
  };
  const isOwner = leagueInfo?.league_owner === user.uid;

  return (
    <div className="min-h-[calc(100vh-80px)] container-padding flex flex-col justify-between">
      <div className="space-y-6">
        <div className="flex items-center justify-between w-full">
          <div>
            <h1 className="text-[36px] font-bold leading-none pt-3 text-primary">
              {leagueInfo?.name || "No Name"}
            </h1>
            <span className="text-[12px]">
              Founded: {leagueInfo?.founded || "Unknown"}
            </span>
          </div>
          {isOwner && (
            <Link to="settings">
              <SettingsIcon sx={{ fontSize: 40 }} className="text-light" />
            </Link>
          )}
        </div>
        <div className="space-y-6">
          <section>
            <h2 className="mb-4 header-3">Upcoming Brolympics</h2>
            <div className="space-y-4">
              {leagueInfo && leagueInfo.upcoming_brolympics.length > 0 ? (
                leagueInfo.upcoming_brolympics.map((brolympic, i) => (
                  <BrolympicsCard_Upcoming
                    {...brolympic}
                    key={i + "_upcoming_bro_card"}
                  />
                ))
              ) : (
                <p className="text-light">
                  You do not have any upcoming Brolympics.
                </p>
              )}
            </div>
          </section>
          <section>
            <h2 className="header-3">Completed Brolympics</h2>
            <div className="space-y-4">
              {leagueInfo && leagueInfo.completed_brolympics.length > 0 ? (
                leagueInfo.completed_brolympics.map((brolympic, i) => (
                  <BrolympicsCard_Completed
                    {...brolympic}
                    key={i + "_complete_bro_card"}
                  />
                ))
              ) : (
                <p className="ml-1 text-sm text-light">
                  You have not completed any Brolympics.
                </p>
              )}
            </div>
          </section>
        </div>
      </div>
      <button
        className="w-full p-3 my-6 btn primary-btn"
        onClick={onCreateClick}
      >
        Create Brolympics
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
