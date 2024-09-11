import DataList from "./DataList";
import { useNavigate } from "react-router-dom";

const Card = (info, index, setOpen) => {
  const navigate = useNavigate();
  const onClick = () => {
    navigate(`/b/${info.uuid}/home`);
    setOpen(false);
  };

  const formatDate = (dateString) => {
    const options = { month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div
      className="flex items-center w-full gap-4 p-4 card-clickable"
      key={index}
      onClick={onClick}
    >
      <img
        src={info.img}
        alt={info.name}
        className="object-cover w-12 h-12 bg-white rounded-lg"
      />
      <div className="flex flex-col">
        <h3 className="header-4 text-near-black">{info.name}</h3>
        <div className="text-sm text-light">
          {info.projected_start_date && formatDate(info.projected_start_date)}
          {info.projected_start_date && info.projected_end_date && " - "}
          {info.projected_end_date && formatDate(info.projected_end_date)}
        </div>
      </div>
    </div>
  );
};

const UpcomingBrolympics = ({ upcoming_brolympics, setOpen }) => {
  if (upcoming_brolympics.length === 0) {
    return null;
  }

  return (
    <section className="my-8">
      <div className="p-2">
        <DataList
          title="Upcoming Brolympics"
          data={upcoming_brolympics}
          card={Card}
          setOpen={setOpen}
        />
      </div>
    </section>
  );
};

export default UpcomingBrolympics;
