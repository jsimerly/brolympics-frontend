import { useState } from "react"


const TeamRank = ({ rank, team, points, onRankChange, onPointsChange }) => {
  return (
    <div className="flex justify-between p-1 border rounded-md">
      <input
        className="w-[10%] text-center"
        value={rank}
        onChange={e => onRankChange(e.target.value)}
      />
      {team}
      <input
        className="w-[15%] text-center p-2 rounded-md"
        value={points}
        onChange={e => onPointsChange(e.target.value)}
      />
    </div>
  );
};

const EditOverall = () => {
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
    // handle update logic here
  };

  return (
    <div className="flex flex-col gap-3">
      {rankingData ? (
        <>
          <ul>
            {rankingData.map((ranking, i) => (
              <TeamRank
                {...ranking}
                onRankChange={newRank => handleRankChange(i, newRank)}
                onPointsChange={newPoints => handlePointsChange(i, newPoints)}
              />
            ))}
          </ul>
          <button
            className="w-full p-2 font-semibold  rounded-md bg-primary"
            onClick={onUpdateClick}
          >
            Update Rankings
          </button>
        </>
      ) : (
        "No rankings to edit."
      )}
    </div>
  );
};

export default EditOverall;
