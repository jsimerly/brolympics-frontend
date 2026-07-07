import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import InCompetitions_h2h from "./inCompetitions/InCompetitions_h2h";
import InCompetition_ind from "./inCompetitions/InCompetition_ind";
import InCompetition_team from "./inCompetitions/InCompetition_team";
import { fetchContest } from "../../api/client";

const InCompetition = () => {
  const { compUuid } = useParams();
  const [contest, setContest] = useState(null);

  useEffect(() => {
    const getContest = async () => {
      try {
        setContest(await fetchContest(compUuid));
      } catch (error) {
        console.error("Error fetching contest:", error);
      }
    };
    getContest();
  }, [compUuid]);

  if (!contest) return <div className="p-6 text-center">Loading...</div>;

  switch (contest.format) {
    case "h2h":
      return <InCompetitions_h2h contest={contest} />;
    case "ind":
      return <InCompetition_ind contest={contest} />;
    case "team":
      return <InCompetition_team contest={contest} />;
    default:
      return (
        <div className="p-6 text-center">
          This event type is scored from the event page.
        </div>
      );
  }
};

export default InCompetition;
