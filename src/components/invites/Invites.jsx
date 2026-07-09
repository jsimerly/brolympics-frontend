import { useAuth } from "../../context/AuthContext";
import { Route, Routes } from "react-router-dom";
import InviteLanding from "./InviteLanding";
import {
  fetchLeagueInvite,
  joinLeague,
  fetchBrolympicsInvite,
  joinBrolympics,
  fetchTeamInvite,
  joinTeam,
} from "../../api/client";

const Invites = () => {
  const { firebaseUser } = useAuth();
  if (!firebaseUser) return null;

  return (
    <Routes>
      <Route
        path="league/:uuid"
        element={
          <InviteLanding
            fetchInfo={fetchLeagueInvite}
            fetchJoin={joinLeague}
            joinText="Join League"
            kind="league"
          />
        }
      />
      <Route
        path="brolympics/:uuid"
        element={
          <InviteLanding
            fetchInfo={fetchBrolympicsInvite}
            fetchJoin={joinBrolympics}
            joinText="Join Brolympics"
            kind="brolympics"
          />
        }
      />
      <Route
        path="team/:uuid"
        element={
          <InviteLanding
            fetchInfo={fetchTeamInvite}
            fetchJoin={joinTeam}
            joinText="Join Team"
            kind="team"
          />
        }
      />
    </Routes>
  );
};

export default Invites;
