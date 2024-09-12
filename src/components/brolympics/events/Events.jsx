import { fetchEventInfo } from "../../../api/activeBro/events.js";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import EventPre from "./EventPre.jsx";
import EventActive from "./EventActive.jsx";

const Events = ({ events, default_uuid, default_type, status }) => {
  const [eventInfo, setEventInfo] = useState();
  const navigate = useNavigate();
  let { eventUuid, eventType, uuid } = useParams();
  const savedEventUuid = eventUuid || localStorage.getItem("selectedEventUuid");
  const savedEventType = eventType || localStorage.getItem("selectedEventType");

  useEffect(() => {
    if (!eventInfo && savedEventType && savedEventUuid) {
      navigate(`/b/${uuid}/event/${savedEventType}/${savedEventUuid}`);
    } else if (!eventUuid && default_uuid && default_type) {
      navigate(`event/${uuid}/${default_type}/${default_uuid}`);
    }
  }, [eventUuid]);

  useEffect(() => {
    const getEventInfo = async () => {
      try {
        const data = await fetchEventInfo(eventUuid, eventType);
        setEventInfo(data);
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    };
    getEventInfo();
  }, [eventUuid]);

  if (status === "pre" || status === "pre_admin") {
    return <EventPre events={events} />;
  }
  if (status === "active") {
    return <EventActive events={events} eventInfo={eventInfo} />;
  }
  return <EventActive events={events} eventInfo={eventInfo} />;
};

export default Events;
