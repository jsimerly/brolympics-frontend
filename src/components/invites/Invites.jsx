import { useAuth } from "../../context/AuthContext";
import { Route, Routes, useLocation } from "react-router-dom";
import LeagueInvite from "./LeagueInvite";
import BrolympicsInvite from "./BrolympicsInvite";
import TeamInvite from "./TeamInvite";

const Invites = () => {
  const { firebaseUser } = useAuth();
  const urlLocation = useLocation();

  return (
    <div className="bg-offWhite text-neutralDark">
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
