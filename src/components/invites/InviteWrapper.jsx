import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useNotification } from "../Util/Notification";

const InviteWrapper = ({ fetchInfo, fetchJoin, joinText, children }) => {
  const { uuid } = useParams();
  const [info, setInfo] = useState();
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  useEffect(() => {
    const getinfo = async () => {
      try {
        const data = await fetchInfo(uuid);
        setInfo(data);
      } catch (error) {
        if (error.status === 404) {
          showNotification(
            "We could not find this invite. We're rerouting you to the leagues page now.",
            "error"
          );
          setTimeout(() => {
            navigate("/");
          }, 3000);
        } else {
          showNotification(
            "There was an error attempting to retrieve this invite.",
            "error"
          );
        }
      }
    };
    getinfo();
  }, [uuid, fetchInfo, showNotification, navigate]);

  const joinClick = async () => {
    try {
      const data = await fetchJoin(uuid);
      if ("league_uuid" in data) {
        navigate(`/league/${data.league_uuid}`);
      }
      if ("bro_uuid" in data) {
        navigate(`/b/${data.bro_uuid}/home`);
      }
      showNotification(data.welcome_message, "success");
    } catch (error) {
      if (error.status === 409) {
        showNotification(error.data, "warning");
      } else {
        showNotification(
          "There was an error while attempting to accept this invite.",
          "error"
        );
      }
    }
  };

  const declineClick = () => {
    navigate("/");
  };

  return (
    <div className="flex items-center justify-center p-4 bg-gray-100 h-screen-minus-nav">
      <div className="w-full max-w-md p-6 card">
        {info && React.cloneElement(children, { info })}
        <div className="flex flex-col gap-4 mt-6">
          <button className="w-full primary-btn" onClick={joinClick}>
            {joinText}
          </button>
          <button className="w-full red-btn" onClick={declineClick}>
            Decline
          </button>
        </div>
      </div>
    </div>
  );
};

export default InviteWrapper;
