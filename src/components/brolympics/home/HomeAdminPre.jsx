import { useState } from "react";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import ManageBro from "../manage/ManageBro";
import ManageEvents from "../manage/ManageEvents";
import ManageTeams from "../manage/ManageTeams";
import { fetchStartBrolympics } from "../../../api/activeBro/admin";
import { useNotification } from "../../Util/Notification";

const HomeAdminPre = ({
  teams,
  events,
  uuid,
  setStatus,
  name,
  projected_start_date,
  projected_end_date,
  img,
}) => {
  const { showNotification } = useNotification();

  const onStartClick = async () => {
    try {
      const data = await fetchStartBrolympics(uuid);
      setStatus("active");
    } catch (error) {
      if (error.status === 412) {
        showNotification(error.response.data.detail);
      } else {
        showNotification(
          "There was an error when attempting to start your brolympics."
        );
      }
    }
  };

  return (
    <div className="min-h-[calc(100vh-220px)] p-4 flex flex-col gap-3">
      <div className="w-full p-3 border rounded-md border-primary">
        <h3 className="w-full font-semibold text-center">Ready to Go?</h3>
        <div className="flex items-center justify-center w-full mt-3">
          <button className="w-1/2 p-2 primary-btn" onClick={onStartClick}>
            Start Brolympics
          </button>
        </div>
      </div>
      <h3 className="flex items-center w-full gap-3 text-errorRed">
        <PriorityHighIcon />
        <span className="text-[12px]">
          Make sure you fully update all of your event settings before your
          Brolympics begins.
        </span>
      </h3>
      <ManageEvents events={events} />
      <div className="my-3" />
      <ManageTeams teams={teams} broUUID={uuid} />
      <div className="my-3" />
      <ManageBro
        name={name}
        startDate={projected_start_date}
        endDate={projected_end_date}
        img={img}
      />
    </div>
  );
};

export default HomeAdminPre;
