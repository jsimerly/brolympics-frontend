import { useState } from "react";
import { fetchForceOverallUpdate } from "../../../api/brolympics";
import { useParams } from "react-router-dom";

const TeamRank = ({ rank, team, points, onRankChange, onPointsChange }) => {

  return (
    <div className="flex justify-between p-1 border rounded-md">
      <input
        className="w-[10%] text-center"
        value={rank}
        onChange={(e) => onRankChange(e.target.value)}
      />
      {team}
      <input
        className="w-[15%] text-center p-2 rounded-md"
        value={points}
        onChange={(e) => onPointsChange(e.target.value)}
      />
    </div>
  );
};

const EditOverall = () => {
  const { uuid } = useParams();
  
  const ranking_data = [
    { rank: 1, team: "Greece", points: 10 },
    { rank: 2, team: "St Vincent", points: 8 },
    { rank: 3, team: "Germany", points: 7 },
    { rank: 4, team: "Typohn", points: 5 },
    { rank: 5, team: "Spain", points: 4 },
  ];

  const [rankingData, setRankingData] = useState(ranking_data);

  const handleRankChange = (index, newRank) => {
    const newRankingData = [...rankingData];
    newRankingData[index].rank = newRank;
    setRankingData(newRankingData);
  };

  const handlePointsChange = (index, newPoints) => {
    const newRankingData = [...rankingData];
    newRankingData[index].points = newPoints;
    setRankingData(newRankingData);
  };

  const onUpdateClick = async () => {
    fetchForceOverallUpdate(uuid);
  };

  return (
    <div className="flex flex-col gap-3">
      <button
        className="w-full p-2 font-semibold rounded-md bg-primary"
        onClick={onUpdateClick}
      >
        Force Rankings Update
      </button>
    </div>
  );
};

export default EditOverall;
