const ActiveCompetition_ind = ({ event_name, entries = [] }) => {
  const entry = entries.find((e) => e.team && !e.player) || entries[0];

  return (
    <div className="p-2">
      <h2 className="pb-2 font-bold">{event_name}</h2>
      <div className="flex gap-2">
        <img
          src={entry?.team_img}
          className="h-[60px] w-[60px] min-w-[60px] bg-white rounded-md"
        />
        <div className="flex items-center font-bold">{entry?.team_name}</div>
      </div>
    </div>
  );
};

export default ActiveCompetition_ind;
