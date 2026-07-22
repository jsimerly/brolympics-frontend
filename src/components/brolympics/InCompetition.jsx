import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import InCompetitions_h2h from "./inCompetitions/InCompetitions_h2h";
import InCompetition_outing from "./inCompetitions/InCompetition_outing";
import InCompetition_ffa from "./inCompetitions/InCompetition_ffa";
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
    case "team":
      return <InCompetition_outing contest={contest} />;
    case "ffa":
      return <InCompetition_ffa contest={contest} />;
    default:
      return (
        <div className="p-6 text-center">
          This event type is scored from the event page.
        </div>
      );
  }
};

export default InCompetition;
