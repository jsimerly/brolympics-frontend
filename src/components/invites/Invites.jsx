import { useAuth } from "../../context/AuthContext";
import { Route, Routes } from "react-router-dom";
import LeagueInvite from "./LeagueInvite";
import BrolympicsInvite from "./BrolympicsInvite";
import TeamInvite from "./TeamInvite";

const Invites = () => {
  const { firebaseUser } = useAuth();

  return (
    <div className="">
      {firebaseUser && (
        <Routes>
          <Route path="league/:uuid" element={<LeagueInvite />} />
          <Route path="brolympics/:uuid" element={<BrolympicsInvite />} />
          <Route path="team/:uuid" element={<TeamInvite />} />
        </Routes>
      )}
    </div>
  );
};

export default Invites;
