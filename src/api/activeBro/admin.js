import api from "../axios";

export async function fetchStartBrolympics(uuid) {
  const data = { uuid: uuid };
  try {
    const response = await api.put("/api/brolympics/start-brolympics/", data);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function fetchEventsUnstarted(uuid) {
  try {
    const response = await api.get(`/api/brolympics/events-unstarted/${uuid}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function fetchStartEvent(uuid, type) {
  const data = { uuid: uuid, type: type };
  try {
    const response = await api.put("/api/brolympics/start-event/", data);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function fetchUpdateIndComp(data) {
  try {
    const response = await api.put("/api/brolympics/update-comp-ind/", data);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function fetchUpdateH2hComp(data) {
  try {
    const response = await api.put("/api/brolympics/update-comp-h2h/", data);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function fetchUpdateTeamComp(data) {
  try {
    const response = await api.put("/api/brolympics/update-comp-team/", data);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function fetchAllCompData(bro_uuid) {
  try {
    const response = await api.get(`api/brolympics/all-comp-data/${bro_uuid}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function fetchBracketData(bro_uuid) {
  try {
    const response = await api.get(`/api/brolympics/bracket-data/${bro_uuid}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function fetchUpdateBracketMatch(data) {
  try {
    const response = await api.put("/api/brolympics/update-bracket-comp/");
    return response.data;
  } catch (error) {
    throw error;
  }
}
