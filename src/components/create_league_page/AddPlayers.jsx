import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateWrapper from "./CreateWrapper";
import CopyWrapper from "../Util/CopyWrapper.jsx";

const frontendUrl = import.meta.env.VITE_FRONTEND_URL;

const AddPlayers = ({ step, nextStep, link }) => {
  const navigate = useNavigate();
  const handleCreateClicked = () => {
    navigate(`/b/${link}`);
  };

  const inviteUrl = `${frontendUrl}/invite/brolympics/${link}`;

  return (
    <CreateWrapper
      color="red"
      button_text="Complete Set Up"
      step={step}
      submit={handleCreateClicked}
      title="Add Players to Your Brolympics"
      description="Share a link with your friends and fellow competitors"
    >
      <h4 className="pb-1 font-bold">Copy the Link and Share with Friends</h4>
      <div className="flex p-2 bg-white border rounded-md">
        <CopyWrapper copyString={inviteUrl}>
          <div className="w-full overflow-hidden text-ellipsis whitespace-nowrap">
            {inviteUrl}
          </div>
        </CopyWrapper>
      </div>
    </CreateWrapper>
  );
};

export default AddPlayers;
