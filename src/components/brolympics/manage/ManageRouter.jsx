import { Routes, Route, useNavigate, useLocation, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditBracket from "./EditBracket";
import EditComp from "./EditComp";
import ManageBro from "./ManageBro";
import ManageEvents from "./ManageEvents";
import ManageTeams from "./ManageTeams";
import Manage from "./Manage";

const TITLES = {
  "edit-bracket": "Fix a Bracket",
  "edit-competition": "Fix a Score",
  "manage-brolympics": "Brolympics Settings",
  "manage-teams": "Teams",
  "manage-events": "Events",
};

const ManageRouter = ({ brolympics }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const pathAfterManage = pathname.split("/")[4];
  const { uuid } = useParams();

  return (
    <div className="min-h-[calc(100vh-220px)] h-full max-w-md px-2 py-3 mx-auto">
      {pathAfterManage && (
        <div className="flex items-center gap-2 pb-3">
          <button
            className="flex items-center text-light"
            onClick={() => navigate(`/b/${uuid}/manage`)}
          >
            <ArrowBackIcon sx={{ fontSize: 22 }} />
          </button>
          <h2 className="text-lg font-bold">
            {TITLES[pathAfterManage] || "Manage"}
          </h2>
        </div>
      )}
      <Routes>
        <Route path="/" element={<Manage />} />
        <Route path="edit-bracket" element={<EditBracket />} />
        <Route path="edit-competition" element={<EditComp />} />
        <Route
          path="manage-brolympics"
          element={<ManageBro {...brolympics} />}
        />
        <Route
          path="manage-teams"
          element={
            <ManageTeams teams={brolympics?.teams} broUUID={brolympics?.uuid} />
          }
        />
        <Route
          path="manage-events"
          element={
            <ManageEvents
              events={brolympics?.events}
              teams={brolympics?.teams}
            />
          }
        />
      </Routes>
    </div>
  );
};

export default ManageRouter;
