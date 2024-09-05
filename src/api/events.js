import api from "./axios";

export async function fetchUpdateEvent(event) {
  try {
    const response = await api.put("/api/brolympics/update-event/", event);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function fetchCreateEvent(event, type, uuid) {
  try {
    const data = { event_name: event, type: type, uuid: uuid };
    const response = await api.post("/api/brolympics/create-event/", data);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function fetchDeleteInd(uuid) {
  try {
    const response = await api.delete(
      `/api/brolympics/delete-event-ind/${uuid}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function fetchDeleteH2h(uuid) {
  try {
    const response = await api.delete(
      `/api/brolympics/delete-event-ind/${uuid}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function fetchDeleteTeamEvent(uuid) {
  try {
    const response = await api.delete(
      `/api/brolympics/delete-event-team/${uuid}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}
